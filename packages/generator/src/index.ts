import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertDoctorResult,
  assertGenerationInput,
  assertGenerationPlan,
  type CatalogTemplateAssetManifest,
  type BrandKit,
  type DiffReport,
  type DoctorCheck,
  type DoctorResult,
  defineDiffReport,
  defineDoctorResult,
  defineFileTransform,
  defineFrameworkTargetDescriptor,
  defineGenerationPlan,
  definePatchOperation,
  defineStarterRecipe,
  defineUninstallManifest,
  type FileTransform,
  FRAMEWORK_ADAPTER_IDS,
  type FrameworkAdapterId,
  type FrameworkTargetDescriptor,
  type GenerationInput,
  type GenerationPlan,
  type ModuleManifest,
  type PatchOperation,
  type RegistryManifest,
  type TemplateManifest,
  type ThemeMode,
} from "@shandapha/contracts";
import { resolveEntitlements } from "@shandapha/entitlements";
import { createPackTheme } from "@shandapha/packs";
import {
  buildRegistry,
  evaluateCatalogPolicies,
  findCatalogItem,
  getCatalogTemplateAsset,
  getTemplateAssetBundle,
  loadCatalogConfig,
  resolveRegistryCatalog,
} from "@shandapha/registry";
import { runProjectDoctor } from "./doctor/runDoctor";
import {
  createChecksum,
  type GeneratedOutputFile,
  readOptionalText,
  writeGeneratedFiles,
} from "./engine/files";
import { createImportPatch, createPackageJsonPatch } from "./engine/patchApply";
import {
  renderBaseTsconfig,
  renderBlazorApp,
  renderBlazorProgram,
  renderBlazorProject,
  renderBlazorRoot,
  renderNextHomePage,
  renderNextLayout,
  renderNextPackageJson,
  renderNextTsconfig,
  renderReactViteApp,
  renderReactViteIndexHtml,
  renderReactViteMain,
  renderReactVitePackageJson,
  renderThemeCss,
  renderThemeGalleryHtml,
  renderVanillaPackageJson,
  renderVerificationFile,
  renderWcIndexHtml,
  renderWcMain,
} from "./engine/render";
import {
  applyPersistedPatchUninstall,
  createPersistedPatchManifest,
  PATCH_MANIFEST_PATH,
} from "./engine/uninstall";

const TEMPLATE_PACKAGE_ROOT = fileURLToPath(
  new URL("../../templates", import.meta.url),
);
const REPO_ROOT = fileURLToPath(new URL("../../../", import.meta.url));

export const recipes = FRAMEWORK_ADAPTER_IDS;

export interface GenerationExecutionOptions {
  brandKit?: BrandKit;
  dryRun?: boolean;
  projectName?: string;
  targetRoot: string;
  themeMode?: ThemeMode;
}

export interface ThemeOnlyInput {
  brandKit?: BrandKit;
  framework: FrameworkAdapterId;
  packId: GenerationInput["packId"];
  planId: GenerationInput["planId"];
}

export interface GenerationExecutionResult {
  diff: DiffReport;
  doctor: DoctorResult;
  dryRun: boolean;
  files: GeneratedOutputFile[];
  kind: "patch" | "starter" | "theme-only" | "uninstall";
  manifestPath?: string;
  plan: GenerationPlan;
  removedPaths: string[];
  targetRoot: string;
  writtenPaths: string[];
}

interface ResolvedGenerationSelections {
  selectedPack: NonNullable<RegistryManifest["packs"][number]>;
  selectedTemplates: TemplateManifest[];
  selectedModules: ModuleManifest[];
  templateAssetsByRegistryId: Map<string, CatalogTemplateAssetManifest>;
}

export function createGenerationPlan(input: GenerationInput): GenerationPlan {
  const validatedInput = assertGenerationInput(input);
  const frameworkTarget = resolveFrameworkTarget(validatedInput.framework);
  const {
    selectedPack,
    selectedTemplates,
    selectedModules,
    templateAssetsByRegistryId,
  } = resolveGenerationSelections(validatedInput);

  const blockedTemplates = selectedTemplates.filter(
    (template) =>
      getFrameworkSupport(template, validatedInput.framework) === "blocked",
  );

  if (blockedTemplates.length > 0) {
    throw new Error(
      [
        `Templates are not installable on "${validatedInput.framework}":`,
        blockedTemplates.map((template) => `- ${template.slug}`).join("\n"),
      ].join("\n"),
    );
  }

  const experimentalTemplates = selectedTemplates.filter(
    (template) =>
      getFrameworkSupport(template, validatedInput.framework) ===
      "experimental",
  );
  const entitlements = resolveEntitlements(validatedInput.planId);
  const deferredModules = selectedModules.filter(
    (module) => module.status !== "installable",
  );
  const blockedModules = selectedModules.filter(
    (module) => !entitlements.enabledModules.includes(module.id),
  );

  if (deferredModules.length > 0) {
    throw new Error(
      `Modules are intentionally deferred and cannot be installed yet: ${deferredModules
        .map((module) => module.id)
        .join(", ")}.`,
    );
  }

  if (blockedModules.length > 0) {
    throw new Error(
      `Modules require a higher plan before install: ${blockedModules
        .map((module) => module.id)
        .join(", ")}.`,
    );
  }

  const starterRecipe = defineStarterRecipe(
    createStarterRecipe(
      validatedInput,
      frameworkTarget,
      selectedTemplates,
      selectedModules,
    ),
  );
  const patchOperations = createPatchOperations(
    validatedInput,
    frameworkTarget,
    selectedPack.name,
    selectedTemplates,
    selectedModules,
    templateAssetsByRegistryId,
  );
  const fileTransforms = createFileTransforms(patchOperations);
  const uninstall = defineUninstallManifest({
    steps: patchOperations.map((operation) => ({
      action:
        operation.kind === "create"
          ? "remove-file"
          : operation.kind === "patch"
            ? "revert-patch"
            : "restore-file",
      path: operation.targetPath,
      detail: `Rollback ${operation.reason}`,
    })),
  });
  const checklist = [
    `Install packages: ${starterRecipe.requiredPackages.join(", ") || "none"}`,
    `Provision theme assets: ${starterRecipe.themeDependencies.join(", ")}`,
    `Create starter routes: ${starterRecipe.requiredRoutes.join(", ") || "none"}`,
    `Verify ${frameworkTarget.verificationPath}`,
  ];
  const doctor = runDoctor({
    hasProvider:
      validatedInput.framework !== "wc-universal" &&
      validatedInput.framework !== "blazor-wc",
    hasStyles: starterRecipe.themeDependencies.length > 0,
    hasTokens: starterRecipe.themeDependencies.includes("tokens.json"),
    packLocked: entitlements.enabledPacks.includes(selectedPack.id),
  });

  if (experimentalTemplates.length > 0) {
    checklist.push(
      `Review experimental adapter coverage for: ${experimentalTemplates
        .map((template) => template.slug)
        .join(", ")}`,
    );
  }

  const diff = defineDiffReport({
    mode: validatedInput.intent === "existing-project" ? "patch" : "starter",
    targetRoot: ".",
    entries: patchOperations.map((operation) => ({
      path: operation.targetPath,
      operation: operation.kind,
      ownerPackage: operation.ownerPackage,
      reason: operation.reason,
      checksum: createChecksum(`${operation.targetPath}:${operation.reason}`),
      existedBefore: operation.kind === "patch",
    })),
  });
  const diffReport = diff.entries.map(
    (entry) =>
      `${entry.operation.toUpperCase()} ${entry.path}: ${entry.reason}`,
  );
  const uninstallManifest = uninstall.steps.map(
    (step) => `${step.action.toUpperCase()} ${step.path}: ${step.detail}`,
  );

  return assertGenerationPlan(
    defineGenerationPlan({
      input: validatedInput,
      frameworkTarget,
      selectedPack,
      selectedTemplates,
      selectedModules,
      starterRecipe,
      patchOperations,
      fileTransforms,
      diff,
      uninstall,
      doctor,
      checklist,
      diffReport,
      uninstallManifest,
      doctorChecks: doctor.checks,
    }),
  );
}

export function runDoctor(input: {
  hasProvider: boolean;
  hasStyles: boolean;
  hasTokens: boolean;
  packLocked: boolean;
}): DoctorResult {
  const checks: DoctorCheck[] = [
    {
      id: "theme-loaded",
      label: "Theme loaded",
      status: input.hasTokens ? "pass" : "warn",
      detail: input.hasTokens
        ? "tokens.json and theme variables are present."
        : "tokens.json is missing.",
    },
    {
      id: "provider-wrapped",
      label: "Provider wrapped",
      status: input.hasProvider ? "pass" : "warn",
      detail: input.hasProvider
        ? "Expected bootstrap file is present."
        : "Framework target does not require a provider wrapper.",
    },
    {
      id: "styles-present",
      label: "Styles present",
      status: input.hasStyles ? "pass" : "warn",
      detail: input.hasStyles
        ? "Theme CSS is available."
        : "Theme CSS is missing.",
    },
    {
      id: "drift-clean",
      label: "Drift clean",
      status: input.packLocked ? "pass" : "warn",
      detail: input.packLocked
        ? "Pack and entitlements stay aligned."
        : "Selected pack exceeds the current plan.",
    },
  ];
  const warningCount = checks.filter((check) => check.status === "warn").length;

  return assertDoctorResult(
    defineDoctorResult({
      status: warningCount === 0 ? "pass" : "warn",
      summary:
        warningCount === 0
          ? "Generator assumptions are aligned with the current workspace."
          : `${warningCount} doctor warning(s) need attention before install.`,
      checks,
    }),
  );
}

export async function generateStarter(
  input: GenerationInput,
  options: GenerationExecutionOptions,
): Promise<GenerationExecutionResult> {
  const plan = createGenerationPlan({
    ...input,
    intent: "new-project",
  });
  const theme = createPackTheme(
    plan.selectedPack.id,
    options.brandKit,
    options.themeMode ?? "light",
  );
  const themeFiles = createThemeFiles(
    plan,
    options.projectName ?? `shandapha-${plan.input.framework}`,
    options.themeMode ?? "light",
    theme.cssVariables,
    theme.tokens,
  );
  const scaffoldFiles = createStarterScaffoldFiles(
    plan,
    options.projectName ?? `shandapha-${plan.input.framework}`,
  );
  const verificationFile = createVerificationStarterFile(plan);
  const templateFiles = await createTemplateFiles(plan, "starter");
  const metadataFiles = createMetadataFiles(plan, "starter");
  const files = [
    ...scaffoldFiles,
    verificationFile,
    ...themeFiles,
    ...templateFiles,
    ...metadataFiles,
  ];
  const writeResult = await writeGeneratedFiles(options.targetRoot, files, {
    dryRun: options.dryRun,
  });
  const doctor =
    options.dryRun || plan.input.framework === "blazor-wc"
      ? plan.doctor
      : await runProjectDoctor(options.targetRoot, plan.frameworkTarget);

  return {
    kind: "starter",
    targetRoot: options.targetRoot,
    dryRun: Boolean(options.dryRun),
    plan,
    files,
    diff: createRuntimeDiff("starter", files),
    doctor,
    manifestPath: ".shandapha/install-manifest.json",
    ...writeResult,
  };
}

export async function generatePatch(
  input: GenerationInput,
  options: GenerationExecutionOptions,
): Promise<GenerationExecutionResult> {
  const plan = createGenerationPlan({
    ...input,
    intent: "existing-project",
  });
  const theme = createPackTheme(
    plan.selectedPack.id,
    options.brandKit,
    options.themeMode ?? "light",
  );
  const themeFiles = await createThemeFilesForExistingProject(
    options.targetRoot,
    plan,
    options.projectName ?? "shandapha-patch",
    options.themeMode ?? "light",
    theme.cssVariables,
    theme.tokens,
  );
  const templateFiles = await createTemplateFiles(
    plan,
    "patch",
    options.targetRoot,
  );
  const dependencyPatch = await createProjectDependencyPatch(
    options.targetRoot,
    plan,
  );
  const importPatch = await createProviderImportPatch(options.targetRoot, plan);
  const verificationFile = await createVerificationPatch(
    options.targetRoot,
    plan,
  );
  const operationalFiles = [
    ...themeFiles,
    ...templateFiles,
    ...(dependencyPatch ? [dependencyPatch] : []),
    ...(importPatch ? [importPatch] : []),
    verificationFile,
    ...createMetadataFiles(plan, "patch"),
  ];
  const patchManifest = createPersistedPatchManifest({
    files: operationalFiles,
    framework: plan.input.framework,
    input: plan.input,
  });
  const manifestFile: GeneratedOutputFile = {
    path: PATCH_MANIFEST_PATH,
    operation: "create",
    ownerPackage: "@shandapha/generator",
    reason: "Persist reversible patch manifest.",
    content: `${JSON.stringify(patchManifest, null, 2)}\n`,
    existedBefore: false,
    checksum: createChecksum(JSON.stringify(patchManifest)),
  };
  const files = [...operationalFiles, manifestFile];
  const writeResult = await writeGeneratedFiles(options.targetRoot, files, {
    dryRun: options.dryRun,
  });
  const doctor =
    options.dryRun || plan.input.framework === "blazor-wc"
      ? plan.doctor
      : await runProjectDoctor(options.targetRoot, plan.frameworkTarget);

  return {
    kind: "patch",
    targetRoot: options.targetRoot,
    dryRun: Boolean(options.dryRun),
    plan,
    files,
    diff: createRuntimeDiff("patch", files),
    doctor,
    manifestPath: PATCH_MANIFEST_PATH,
    ...writeResult,
  };
}

export async function generateThemeOnly(
  input: ThemeOnlyInput,
  options: GenerationExecutionOptions,
): Promise<GenerationExecutionResult> {
  const generationInput = assertGenerationInput({
    version: 1,
    framework: input.framework,
    intent: "preview-only",
    packId: input.packId,
    planId: input.planId,
    templates: [],
    modules: [],
  });
  const plan = createGenerationPlan(generationInput);
  const theme = createPackTheme(
    generationInput.packId,
    input.brandKit,
    options.themeMode ?? "light",
  );
  const projectName = options.projectName ?? "shandapha-theme-only";
  const files: GeneratedOutputFile[] = [
    {
      path: "theme.css",
      operation: "create",
      ownerPackage: "@shandapha/generator",
      reason: "Export theme-only stylesheet.",
      content: renderThemeCss(theme.cssVariables, theme.tokens),
      existedBefore: false,
      checksum: createChecksum(JSON.stringify(theme.cssVariables)),
    },
    {
      path: "tokens.json",
      operation: "create",
      ownerPackage: "@shandapha/generator",
      reason: "Export theme-only token JSON.",
      content: `${JSON.stringify(theme.tokens, null, 2)}\n`,
      existedBefore: false,
      checksum: createChecksum(JSON.stringify(theme.tokens)),
    },
    {
      path: "theme-gallery.html",
      operation: "create",
      ownerPackage: "@shandapha/generator",
      reason: "Export a no-app theme preview gallery.",
      content: renderThemeGalleryHtml({
        packName: plan.selectedPack.name,
        projectName,
        templateSlugs: [],
        themeMode: options.themeMode ?? "light",
      }),
      existedBefore: false,
      checksum: createChecksum(`${projectName}:${plan.selectedPack.id}`),
    },
  ];
  const writeResult = await writeGeneratedFiles(options.targetRoot, files, {
    dryRun: options.dryRun,
  });

  return {
    kind: "theme-only",
    targetRoot: options.targetRoot,
    dryRun: Boolean(options.dryRun),
    plan,
    files,
    diff: createRuntimeDiff("theme-only", files),
    doctor: plan.doctor,
    manifestPath: "theme-gallery.html",
    ...writeResult,
  };
}

export async function generateUninstall(options: {
  dryRun?: boolean;
  targetRoot: string;
}) {
  const uninstallResult = await applyPersistedPatchUninstall(
    options.targetRoot,
    {
      dryRun: options.dryRun,
    },
  );
  const manifestInput = uninstallResult.manifest.input;
  const plan = createGenerationPlan({
    ...manifestInput,
    intent: "existing-project",
  });

  return {
    kind: "uninstall" as const,
    targetRoot: options.targetRoot,
    dryRun: Boolean(options.dryRun),
    plan,
    files: uninstallResult.manifest.files.map((file) => ({
      path: file.path,
      operation: file.existedBefore ? "patch" : "remove",
      ownerPackage: "@shandapha/generator",
      reason: `Uninstall ${file.path}`,
      existedBefore: file.existedBefore,
      previousContent: file.previousContent,
      checksum: file.checksum,
      content: file.previousContent,
    })),
    diff: createRuntimeDiff("uninstall", []),
    doctor: plan.doctor,
    manifestPath: PATCH_MANIFEST_PATH,
    removedPaths: uninstallResult.removedPaths,
    writtenPaths: uninstallResult.writtenPaths,
  };
}

export async function doctorProject(options: {
  framework: FrameworkAdapterId;
  targetRoot: string;
}) {
  return runProjectDoctor(
    options.targetRoot,
    resolveFrameworkTarget(options.framework),
  );
}

function resolveGenerationSelections(
  input: GenerationInput,
): ResolvedGenerationSelections {
  const templateAssetsByRegistryId = new Map<string, CatalogTemplateAssetManifest>();

  if (
    !input.catalogConfigPath &&
    !input.packRegistryId &&
    (input.templateRegistryIds?.length ?? 0) === 0 &&
    (input.moduleRegistryIds?.length ?? 0) === 0
  ) {
    const registry = buildRegistry();
    const selectedPack = registry.packs.find((pack) => pack.id === input.packId);

    if (!selectedPack) {
      throw new Error(`Unknown pack "${input.packId}".`);
    }

    return {
      selectedPack,
      selectedTemplates: resolveRequestedTemplates(registry, input.templates),
      selectedModules: resolveRequestedModules(registry, input.modules),
      templateAssetsByRegistryId,
    };
  }

  const catalog = resolveRegistryCatalog({
    catalogConfigPath: input.catalogConfigPath,
    workspaceId: input.catalogWorkspaceId,
  });
  const catalogConfig = loadCatalogConfig(input.catalogConfigPath);

  const selectedPackItem = input.packRegistryId
    ? findCatalogItem(catalog, input.packRegistryId, "pack")
    : findCatalogItem(catalog, input.packId, "pack");

  if (!selectedPackItem || selectedPackItem.kind !== "pack") {
    throw new Error(
      `Unknown catalog pack "${input.packRegistryId ?? input.packId}".`,
    );
  }

  const selectedTemplateItems =
    input.templateRegistryIds && input.templateRegistryIds.length > 0
      ? input.templateRegistryIds.map((registryId) => {
          const item = findCatalogItem(catalog, registryId, "template");

          if (!item || item.kind !== "template") {
            throw new Error(`Unknown catalog template "${registryId}".`);
          }

          if (item.templateAsset) {
            templateAssetsByRegistryId.set(item.registryId, item.templateAsset);
          }

          return item;
        })
      : resolveRequestedTemplates(buildRegistry(), input.templates).map((template) => {
          const item = findCatalogItem(catalog, template.registryId, "template");

          if (item?.templateAsset) {
            templateAssetsByRegistryId.set(item.registryId, item.templateAsset);
          }

          return {
            kind: "template" as const,
            manifest: template,
            registryId: template.registryId,
          };
        });

  const selectedModuleItems =
    input.moduleRegistryIds && input.moduleRegistryIds.length > 0
      ? input.moduleRegistryIds.map((registryId) => {
          const item = findCatalogItem(catalog, registryId, "module");

          if (!item || item.kind !== "module") {
            throw new Error(`Unknown catalog module "${registryId}".`);
          }

          return item;
        })
      : resolveRequestedModules(buildRegistry(), input.modules).map((module) => ({
          kind: "module" as const,
          manifest: module,
          registryId: module.registryId,
        }));

  const selectedRegistryIds = [
    selectedPackItem.registryId,
    ...selectedTemplateItems.map((item) => item.registryId),
    ...selectedModuleItems.map((item) => item.registryId),
  ];
  const policyResult = evaluateCatalogPolicies({
    catalog,
    policies: catalogConfig.policies,
    selectedRegistryIds,
  });

  if (policyResult.status === "fail") {
    throw new Error(
      [
        "Catalog policy check failed:",
        ...policyResult.findings.map((finding: (typeof policyResult.findings)[number]) =>
          `- [${finding.severity}] ${finding.message}`,
        ),
      ].join("\n"),
    );
  }

  return {
    selectedPack: selectedPackItem.manifest as RegistryManifest["packs"][number],
    selectedTemplates: selectedTemplateItems.map(
      (item) => item.manifest as TemplateManifest,
    ),
    selectedModules: selectedModuleItems.map(
      (item) => item.manifest as ModuleManifest,
    ),
    templateAssetsByRegistryId,
  };
}

function resolveRequestedTemplates(
  registry: RegistryManifest,
  requestedTemplates: string[],
) {
  const resolved = requestedTemplates.map((slug) => {
    const match = registry.templates.find((template) => template.slug === slug);

    if (!match) {
      throw new Error(`Unknown template "${slug}".`);
    }

    return match;
  });

  return uniqueBy(resolved, (template) => template.slug);
}

function resolveRequestedModules(
  registry: RegistryManifest,
  requestedModules: string[],
) {
  const resolved = requestedModules.map((moduleId) => {
    const match = registry.modules.find((module) => module.id === moduleId);

    if (!match) {
      throw new Error(`Unknown module "${moduleId}".`);
    }

    return match;
  });

  return uniqueBy(resolved, (module) => module.id);
}

function createStarterRecipe(
  input: GenerationInput,
  frameworkTarget: FrameworkTargetDescriptor,
  selectedTemplates: TemplateManifest[],
  selectedModules: ModuleManifest[],
) {
  const frameworkPackages =
    input.framework === "next-app-router"
      ? ["next", "react", "react-dom"]
      : input.framework === "react-vite"
        ? ["react", "react-dom", "vite"]
        : input.framework === "blazor-wc"
          ? []
          : ["vite"];

  return {
    framework: input.framework,
    intent: input.intent,
    targetRoot: frameworkTarget.routesRoot,
    templates: selectedTemplates.map((template) => template.slug),
    modules: selectedModules.map((module) => module.id),
    requiredPackages: unique([
      ...frameworkPackages,
      ...selectedModules.map((module) => module.packageName),
      ...selectedTemplates.flatMap(
        (template) => template.install.requiredPackages,
      ),
    ]),
    requiredRoutes: unique([
      ...selectedTemplates.flatMap((template) =>
        template.install.requiredRoutes.length > 0
          ? template.install.requiredRoutes
          : [`/${template.slug}`],
      ),
      toRoutePath(frameworkTarget.verificationPath),
    ]),
    themeDependencies: unique(
      selectedTemplates.flatMap(
        (template) => template.install.themeDependencies,
      ),
    ),
    sampleDataBindings: unique(
      selectedTemplates.flatMap(
        (template) => template.install.sampleDataBindings,
      ),
    ),
  };
}

function createPatchOperations(
  input: GenerationInput,
  frameworkTarget: FrameworkTargetDescriptor,
  packName: string,
  selectedTemplates: TemplateManifest[],
  selectedModules: ModuleManifest[],
  templateAssetsByRegistryId: Map<string, CatalogTemplateAssetManifest>,
) {
  const starterKind = input.intent === "existing-project" ? "patch" : "create";

  return [
    definePatchOperation({
      id: "theme-asset",
      kind: starterKind,
      targetPath: frameworkTarget.themePath,
      ownerPackage: "@shandapha/generator",
      reason: `Apply ${packName} theme variables.`,
      reversible: true,
      framework: input.framework,
    }),
    definePatchOperation({
      id: "token-asset",
      kind: starterKind,
      targetPath: frameworkTarget.tokensPath,
      ownerPackage: "@shandapha/generator",
      reason: `Write deterministic tokens for ${packName}.`,
      reversible: true,
      framework: input.framework,
    }),
    definePatchOperation({
      id: "verification",
      kind: starterKind,
      targetPath: frameworkTarget.verificationPath,
      ownerPackage: "@shandapha/generator",
      reason: "Create a generated verification surface.",
      reversible: true,
      framework: input.framework,
    }),
    ...selectedTemplates.flatMap((template) =>
      createTemplatePatchOperations(
        template,
        input.framework,
        templateAssetsByRegistryId,
      ),
    ),
    ...selectedModules.map((module) =>
      definePatchOperation({
        id: `module:${module.id}`,
        kind: "patch",
        targetPath: frameworkTarget.projectManifestPath,
        ownerPackage: module.packageName,
        reason: `Register ${module.name} dependencies.`,
        reversible: true,
        framework: input.framework,
      }),
    ),
  ];
}

function createFileTransforms(patchOperations: PatchOperation[]) {
  return patchOperations.map(
    (operation): FileTransform =>
      defineFileTransform({
        path: operation.targetPath,
        operation: operation.kind,
        source:
          operation.ownerPackage === "@shandapha/templates"
            ? "template"
            : operation.ownerPackage === "@shandapha/generator"
              ? "generator"
              : "registry",
        description: operation.reason,
      }),
  );
}

function createTemplatePatchOperations(
  template: TemplateManifest,
  framework: FrameworkAdapterId,
  templateAssetsByRegistryId: Map<string, CatalogTemplateAssetManifest>,
) {
  const sourceFiles =
    templateAssetsByRegistryId.get(template.registryId)?.files[framework] ??
    getTemplateAssetBundle(template.slug)?.files[framework] ??
    [];

  if (sourceFiles.length === 0) {
    throw new Error(
      `Template "${template.slug}" has no asset files for "${framework}".`,
    );
  }

  return sourceFiles.map((sourcePath) =>
    definePatchOperation({
      id: `template:${template.slug}:${basename(sourcePath)}`,
      kind: "create",
      targetPath: resolveTemplateOutputPath(
        framework,
        template.slug,
        basename(sourcePath),
      ),
      ownerPackage: "@shandapha/templates",
      reason: `Install ${template.name} asset from ${sourcePath}.`,
      reversible: true,
      framework,
    }),
  );
}

function getFrameworkSupport(
  template: TemplateManifest,
  framework: FrameworkAdapterId,
) {
  return (
    template.frameworks.find((rule) => rule.adapter === framework)?.support ??
    "blocked"
  );
}

function resolveFrameworkTarget(framework: FrameworkAdapterId) {
  switch (framework) {
    case "next-app-router":
      return defineFrameworkTargetDescriptor({
        framework,
        projectManager: "pnpm",
        projectManifestPath: "package.json",
        routesRoot: "app/generated",
        themePath: "app/theme.css",
        tokensPath: "app/tokens.json",
        providerPath: "app/layout.tsx",
        verificationPath: "app/generated/verification/page.tsx",
        supportsRuntimeBootstrap: true,
      });
    case "wc-universal":
      return defineFrameworkTargetDescriptor({
        framework,
        projectManager: "pnpm",
        projectManifestPath: "package.json",
        routesRoot: "src/views/generated",
        themePath: "src/theme/theme.css",
        tokensPath: "src/theme/tokens.json",
        providerPath: "src/main.ts",
        verificationPath: "src/views/generated/verification.ts",
        supportsRuntimeBootstrap: false,
      });
    case "blazor-wc":
      return defineFrameworkTargetDescriptor({
        framework,
        projectManager: "dotnet",
        projectManifestPath: "Shandapha.Generated.csproj",
        routesRoot: "Components/Generated",
        themePath: "wwwroot/theme/theme.css",
        tokensPath: "wwwroot/theme/tokens.json",
        providerPath: "Components/App.razor",
        verificationPath: "Components/Generated/Verification.razor",
        supportsRuntimeBootstrap: false,
      });
    default:
      return defineFrameworkTargetDescriptor({
        framework,
        projectManager: "pnpm",
        projectManifestPath: "package.json",
        routesRoot: "src/pages/generated",
        themePath: "src/theme.css",
        tokensPath: "src/tokens.json",
        providerPath: "src/main.tsx",
        verificationPath: "src/pages/generated/shandapha-verification.tsx",
        supportsRuntimeBootstrap: true,
      });
  }
}

function resolveTemplateOutputPath(
  framework: FrameworkAdapterId,
  slug: string,
  fileName: string,
) {
  const normalizedSlug = slug.replace(/^\//, "");
  const { routesRoot } = resolveFrameworkTarget(framework);

  return `${routesRoot}/${normalizedSlug}/${fileName}`;
}

function unique(values: string[]) {
  return uniqueBy(values, (value) => value);
}

function uniqueBy<T>(values: T[], selectKey: (value: T) => string) {
  const seen = new Set<string>();

  return values.filter((value) => {
    const key = selectKey(value);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function createRuntimeDiff(
  mode: DiffReport["mode"],
  files: GeneratedOutputFile[],
): DiffReport {
  return defineDiffReport({
    mode,
    targetRoot: ".",
    entries: files.map((file) => ({
      path: file.path,
      operation: file.operation,
      ownerPackage: file.ownerPackage,
      reason: file.reason,
      checksum: file.checksum,
      existedBefore: file.existedBefore,
      sourcePath: file.sourcePath,
    })),
  });
}

function createThemeFiles(
  plan: GenerationPlan,
  projectName: string,
  themeMode: ThemeMode,
  cssVariables: Record<string, string>,
  tokens: ReturnType<typeof createPackTheme>["tokens"],
) {
  return [
    {
      path: plan.frameworkTarget.themePath,
      operation: "create",
      ownerPackage: "@shandapha/generator",
      reason: "Emit theme.css.",
      content: renderThemeCss(cssVariables, tokens),
      existedBefore: false,
      checksum: createChecksum(JSON.stringify(cssVariables)),
    },
    {
      path: plan.frameworkTarget.tokensPath,
      operation: "create",
      ownerPackage: "@shandapha/generator",
      reason: "Emit tokens.json.",
      content: `${JSON.stringify(tokens, null, 2)}\n`,
      existedBefore: false,
      checksum: createChecksum(JSON.stringify(tokens)),
    },
    {
      path:
        plan.input.framework === "next-app-router"
          ? "public/theme-gallery.html"
          : plan.input.framework === "blazor-wc"
            ? "wwwroot/theme-gallery.html"
            : "theme-gallery.html",
      operation: "create",
      ownerPackage: "@shandapha/generator",
      reason: "Emit theme preview gallery.",
      content: renderThemeGalleryHtml({
        packName: plan.selectedPack.name,
        projectName,
        templateSlugs: plan.selectedTemplates.map((template) => template.slug),
        themeMode,
      }),
      existedBefore: false,
      checksum: createChecksum(
        `${projectName}:${plan.selectedPack.id}:${themeMode}`,
      ),
    },
  ] satisfies GeneratedOutputFile[];
}

async function createThemeFilesForExistingProject(
  targetRoot: string,
  plan: GenerationPlan,
  projectName: string,
  themeMode: ThemeMode,
  cssVariables: Record<string, string>,
  tokens: ReturnType<typeof createPackTheme>["tokens"],
) {
  const themePath = plan.frameworkTarget.themePath;
  const tokensPath = plan.frameworkTarget.tokensPath;
  const existingTheme = await readOptionalText(join(targetRoot, themePath));
  const existingTokens = await readOptionalText(join(targetRoot, tokensPath));
  const files = createThemeFiles(
    plan,
    projectName,
    themeMode,
    cssVariables,
    tokens,
  );

  return files.map((file): GeneratedOutputFile => {
    const operation: GeneratedOutputFile["operation"] =
      file.path === themePath
        ? existingTheme
          ? "patch"
          : "create"
        : file.path === tokensPath
          ? existingTokens
            ? "patch"
            : "create"
          : file.operation;

    return {
      ...file,
      operation,
      existedBefore:
        file.path === themePath
          ? Boolean(existingTheme)
          : file.path === tokensPath
            ? Boolean(existingTokens)
            : file.existedBefore,
      previousContent:
        file.path === themePath
          ? existingTheme
          : file.path === tokensPath
            ? existingTokens
            : undefined,
    };
  });
}

function createStarterScaffoldFiles(plan: GenerationPlan, projectName: string) {
  const generatedTemplateTargets = plan.selectedTemplates.flatMap(
    (template) => {
      return listTemplateSourceFiles(plan, template).map((sourcePath) => ({
        slug: template.slug,
        path: resolveTemplateOutputPath(
          plan.input.framework,
          template.slug,
          basename(sourcePath),
        ),
      }));
    },
  );

  switch (plan.input.framework) {
    case "next-app-router":
      return [
        starterFile(
          "package.json",
          renderNextPackageJson(projectName),
          "Create starter package manifest.",
        ),
        starterFile(
          "tsconfig.json",
          renderNextTsconfig(),
          "Create Next tsconfig.",
        ),
        starterFile(
          "next-env.d.ts",
          '/// <reference types="next" />\n',
          "Create Next environment types.",
        ),
        starterFile(
          plan.frameworkTarget.providerPath,
          renderNextLayout(projectName),
          "Create Next layout shell.",
        ),
        starterFile(
          "app/page.tsx",
          renderNextHomePage(
            plan.selectedTemplates.map((template) => template.slug),
            plan.frameworkTarget.verificationPath,
          ),
          "Create Next starter home page.",
        ),
      ] satisfies GeneratedOutputFile[];
    case "wc-universal":
      return [
        starterFile(
          "package.json",
          renderVanillaPackageJson(projectName),
          "Create WC starter package manifest.",
        ),
        starterFile("tsconfig.json", renderBaseTsconfig(), "Create tsconfig."),
        starterFile(
          "index.html",
          renderWcIndexHtml(projectName),
          "Create WC index.html.",
        ),
        starterFile(
          plan.frameworkTarget.providerPath,
          renderWcMain(
            generatedTemplateTargets.map((target) => ({
              ...target,
              exportName: `render${pascalCase(target.slug)}Template`,
            })),
            plan.frameworkTarget.verificationPath,
          ),
          "Create WC bootstrap entry.",
        ),
      ] satisfies GeneratedOutputFile[];
    case "blazor-wc":
      return [
        starterFile(
          plan.frameworkTarget.projectManifestPath,
          renderBlazorProject(projectName),
          "Create Blazor project file.",
        ),
        starterFile("Program.cs", renderBlazorProgram(), "Create Program.cs."),
        starterFile(
          "wwwroot/index.html",
          renderBlazorApp(projectName),
          "Create Blazor host page.",
        ),
        starterFile(
          plan.frameworkTarget.providerPath,
          renderBlazorRoot(
            generatedTemplateTargets,
            plan.frameworkTarget.verificationPath,
          ),
          "Create Blazor root component.",
        ),
      ] satisfies GeneratedOutputFile[];
    default:
      return [
        starterFile(
          "package.json",
          renderReactVitePackageJson(projectName),
          "Create React starter package manifest.",
        ),
        starterFile("tsconfig.json", renderBaseTsconfig(), "Create tsconfig."),
        starterFile(
          "index.html",
          renderReactViteIndexHtml(projectName),
          "Create Vite index.html.",
        ),
        starterFile(
          plan.frameworkTarget.providerPath,
          renderReactViteMain(),
          "Create React bootstrap entry.",
        ),
        starterFile(
          "src/App.tsx",
          renderReactViteApp(
            generatedTemplateTargets,
            plan.frameworkTarget.verificationPath,
          ),
          "Create React starter app shell.",
        ),
      ] satisfies GeneratedOutputFile[];
  }
}

function createVerificationStarterFile(plan: GenerationPlan) {
  return starterFile(
    plan.frameworkTarget.verificationPath,
    renderVerificationFile(plan.input.framework, plan),
    "Create generated verification surface.",
  );
}

async function createTemplateFiles(
  plan: GenerationPlan,
  mode: "patch" | "starter",
  targetRoot?: string,
) {
  const files: GeneratedOutputFile[] = [];

  for (const template of plan.selectedTemplates) {
    for (const sourcePath of listTemplateSourceFiles(plan, template)) {
      const targetPath = resolveTemplateOutputPath(
        plan.input.framework,
        template.slug,
        basename(sourcePath),
      );
      const content = await loadTemplateAssetContent(
        sourcePath,
        plan.input.framework,
        template.slug,
      );
      const existingContent =
        targetRoot === undefined
          ? undefined
          : await readOptionalText(join(targetRoot, targetPath));

      files.push({
        path: targetPath,
        operation:
          mode === "patch" && existingContent !== undefined
            ? "patch"
            : "create",
        ownerPackage: "@shandapha/templates",
        reason: `Install ${template.name} asset.`,
        content,
        sourcePath,
        existedBefore: existingContent !== undefined,
        previousContent: existingContent,
        checksum: createChecksum(content),
      });
    }
  }

  return files;
}

async function createVerificationPatch(
  targetRoot: string,
  plan: GenerationPlan,
) {
  const existingContent = await readOptionalText(
    join(targetRoot, plan.frameworkTarget.verificationPath),
  );
  const content = renderVerificationFile(plan.input.framework, plan);

  return {
    path: plan.frameworkTarget.verificationPath,
    operation: existingContent ? "patch" : "create",
    ownerPackage: "@shandapha/generator",
    reason: "Create generated verification surface.",
    content,
    existedBefore: Boolean(existingContent),
    previousContent: existingContent,
    checksum: createChecksum(content),
  } satisfies GeneratedOutputFile;
}

function createMetadataFiles(
  plan: GenerationPlan,
  kind: "patch" | "starter",
): GeneratedOutputFile[] {
  const metadata = JSON.stringify(
    {
      kind,
      plan,
    },
    null,
    2,
  );

  return [
    {
      path: ".shandapha/install-manifest.json",
      operation: "create",
      ownerPackage: "@shandapha/generator",
      reason: "Persist install manifest for drift checks.",
      content: `${metadata}\n`,
      existedBefore: false,
      checksum: createChecksum(metadata),
    },
  ];
}

async function createProjectDependencyPatch(
  targetRoot: string,
  plan: GenerationPlan,
) {
  if (plan.frameworkTarget.projectManager !== "pnpm") {
    return undefined;
  }

  const dependencies = Object.fromEntries(
    unique([
      ...plan.selectedModules.map((module) => module.packageName),
      ...plan.selectedTemplates.flatMap(
        (template) => template.install.requiredPackages,
      ),
    ]).map((dependency) => [dependency, "workspace:*"]),
  );

  if (Object.keys(dependencies).length === 0) {
    return undefined;
  }

  return createPackageJsonPatch({
    absolutePath: join(targetRoot, plan.frameworkTarget.projectManifestPath),
    dependencies,
    reason: "Register generated dependencies.",
    targetPath: plan.frameworkTarget.projectManifestPath,
  });
}

async function createProviderImportPatch(
  targetRoot: string,
  plan: GenerationPlan,
) {
  if (plan.frameworkTarget.projectManager !== "pnpm") {
    return undefined;
  }

  if (plan.input.framework === "next-app-router") {
    return createImportPatch({
      absolutePath: join(targetRoot, plan.frameworkTarget.providerPath),
      importStatement: 'import "./theme.css";',
      reason: "Ensure theme.css is loaded.",
      targetPath: plan.frameworkTarget.providerPath,
    });
  }

  if (plan.input.framework === "react-vite") {
    return createImportPatch({
      absolutePath: join(targetRoot, plan.frameworkTarget.providerPath),
      importStatement: 'import "./theme.css";',
      reason: "Ensure theme.css is loaded.",
      targetPath: plan.frameworkTarget.providerPath,
    });
  }

  if (plan.input.framework === "wc-universal") {
    return createImportPatch({
      absolutePath: join(targetRoot, plan.frameworkTarget.providerPath),
      importStatement: 'import "./theme/theme.css";',
      reason: "Ensure WC theme.css is loaded.",
      targetPath: plan.frameworkTarget.providerPath,
    });
  }

  return undefined;
}

async function loadTemplateAssetContent(
  sourcePath: string,
  framework: FrameworkAdapterId,
  slug: string,
) {
  const content = await readFile(resolveTemplateSourcePath(sourcePath), "utf8");

  if (framework === "blazor-wc" && !content.includes("@page")) {
    return [`@page "/generated/${slug}"`, "", content].join("\n");
  }

  if (framework === "wc-universal") {
    return content.replace(
      new RegExp(`render${pascalCase(slug)}Template`, "g"),
      `render${pascalCase(slug)}Template`,
    );
  }

  return content;
}

function getRequiredTemplateBundle(slug: string) {
  const bundle = getTemplateAssetBundle(slug);

  if (!bundle) {
    throw new Error(`Missing template asset bundle for "${slug}".`);
  }

  return bundle;
}

function getCatalogTemplateAssetForPlan(
  plan: GenerationPlan,
  template: TemplateManifest,
) {
  if (
    !plan.input.catalogConfigPath &&
    (plan.input.templateRegistryIds?.length ?? 0) === 0
  ) {
    return undefined;
  }

  const catalog = resolveRegistryCatalog({
    catalogConfigPath: plan.input.catalogConfigPath,
    workspaceId: plan.input.catalogWorkspaceId,
  });

  return getCatalogTemplateAsset(catalog, template.registryId);
}

function listTemplateSourceFiles(
  plan: GenerationPlan,
  template: TemplateManifest,
) {
  const asset = getCatalogTemplateAssetForPlan(plan, template);

  if (asset) {
    return asset.files[plan.input.framework] ?? [];
  }

  return getRequiredTemplateBundle(template.slug).files[plan.input.framework];
}

function resolveTemplateSourcePath(sourcePath: string) {
  if (sourcePath.startsWith("catalog/")) {
    return join(TEMPLATE_PACKAGE_ROOT, sourcePath);
  }

  return join(REPO_ROOT, sourcePath);
}

function starterFile(path: string, content: string, reason: string) {
  return {
    path,
    operation: "create",
    ownerPackage: "@shandapha/generator",
    reason,
    content,
    existedBefore: false,
    checksum: createChecksum(content),
  } satisfies GeneratedOutputFile;
}

function pascalCase(value: string) {
  return value
    .split("/")
    .flatMap((part) => part.split("-"))
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toRoutePath(outputPath: string) {
  return `/${outputPath}`
    .replace(/^\/(src\/pages|src\/views|app|Components)\//, "/")
    .replace(/\/(page|template|index)\.[^.]+$/, "")
    .replace(/\.[^.]+$/, "");
}
