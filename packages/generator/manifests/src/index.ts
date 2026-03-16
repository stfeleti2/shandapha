import {
  assertGenerationInput,
  defineDoctorResult,
  defineFrameworkTargetDescriptor,
  type DoctorCheck,
  type FrameworkAdapterId,
  type GenerationInput,
  type ModuleManifest,
  type PackManifest,
  type TemplateManifest,
} from "@shandapha/contracts";
import { resolveEntitlements } from "@shandapha/entitlements";
import { resolveRegistryCatalog } from "@shandapha/registry-client";

export interface GenerationPreview {
  selectedPack: PackManifest;
  selectedTemplates: TemplateManifest[];
  selectedModules: ModuleManifest[];
  checklist: string[];
  doctorChecks: DoctorCheck[];
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
        routesRoot: "src/pages/generated",
        projectManifestPath: "package.json",
        themePath: "src/theme.css",
        tokensPath: "src/tokens.json",
        providerPath: "src/main.tsx",
        verificationPath: "src/pages/generated/shandapha-verification.tsx",
        supportsRuntimeBootstrap: true,
      });
  }
}

function buildDoctorChecks(
  framework: FrameworkAdapterId,
  selectedTemplates: GenerationPreview["selectedTemplates"],
) {
  const target = resolveFrameworkTarget(framework);

  return defineDoctorResult({
    status: "pass",
    summary: "Preview uses the deterministic Shandapha wiring model.",
    checks: [
      {
        id: "theme-loaded",
        label: "Theme loaded",
        status: "pass",
        detail: `Expected theme assets at ${target.themePath} and ${target.tokensPath}.`,
      },
      {
        id: "provider-wrapped",
        label: "Provider wrapped",
        status: target.supportsRuntimeBootstrap ? "pass" : "pass",
        detail: target.supportsRuntimeBootstrap
          ? `Runtime provider is expected at ${target.providerPath}.`
          : "This target does not require a React-style provider wrapper.",
      },
      {
        id: "styles-present",
        label: "Styles present",
        status: "pass",
        detail: "Semantic CSS variable assets are part of the preview contract.",
      },
      {
        id: "wc-imported",
        label: "WC bundle imported",
        status:
          framework === "wc-universal" || framework === "blazor-wc"
            ? "pass"
            : "pass",
        detail:
          framework === "wc-universal" || framework === "blazor-wc"
            ? `WC bootstrap is expected at ${target.providerPath}.`
            : "WC bootstrap is not required for this preview target.",
      },
      {
        id: "focus-visible",
        label: "Focus visibility sane",
        status: "pass",
        detail: "Focus-visible styling is part of the runtime preview baseline.",
      },
      {
        id: "template-assets",
        label: "Template assets resolved",
        status: selectedTemplates.length > 0 ? "pass" : "warn",
        detail:
          selectedTemplates.length > 0
            ? `${selectedTemplates.length} template manifest(s) resolved for preview.`
            : "No template manifests selected for preview.",
      },
    ],
  }).checks;
}

export function createGenerationPreview(input: GenerationInput): GenerationPreview {
  const validatedInput = assertGenerationInput(input);
  const catalog = resolveRegistryCatalog({
    workspaceId: validatedInput.catalogWorkspaceId,
  });
  const entitlements = resolveEntitlements(validatedInput.planId);
  const selectedPack = catalog.manifest.packs.find(
    (pack) =>
      pack.registryId === validatedInput.packRegistryId ||
      pack.id === validatedInput.packId,
  );

  if (!selectedPack) {
    throw new Error(`Unknown pack "${validatedInput.packId}".`);
  }

  const selectedTemplates = validatedInput.templates.map((templateId) => {
    const match = catalog.manifest.templates.find(
      (template) =>
        template.registryId === templateId || template.slug === templateId,
    );

    if (!match) {
      throw new Error(`Unknown template "${templateId}".`);
    }

    return match;
  });

  const selectedModules = validatedInput.modules.map((moduleId) => {
    const match = catalog.manifest.modules.find(
      (module) => module.registryId === moduleId || module.id === moduleId,
    );

    if (!match) {
      throw new Error(`Unknown module "${moduleId}".`);
    }

    return match;
  });

  const gatedModules = selectedModules.filter(
    (module) => !entitlements.enabledModules.includes(module.id),
  );

  if (gatedModules.length > 0) {
    throw new Error(
      `Modules require a higher plan before preview: ${gatedModules
        .map((module) => module.id)
        .join(", ")}.`,
    );
  }

  return {
    selectedPack,
    selectedTemplates,
    selectedModules,
    checklist: [
      `Map semantic tokens for ${selectedPack.name}.`,
      `Generate ${selectedTemplates.length || "0"} template surface(s) with deterministic manifests.`,
      `Install ${selectedModules.length || "0"} opt-in module(s) only where needed.`,
      `Verify provider wiring, styles, WC bootstrap, and focus visibility with Doctor.`,
    ],
    doctorChecks: buildDoctorChecks(
      validatedInput.framework,
      selectedTemplates,
    ),
  };
}
