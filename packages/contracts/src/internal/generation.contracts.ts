import type {
  FrameworkAdapterId,
  ModuleManifest,
  PackId,
  PackManifest,
  PlanId,
  TemplateManifest,
} from "../public/stable.contracts";
import { cloneStringArray } from "../shared/validation";

export const GENERATION_INPUT_VERSION = 1 as const;
export const GENERATION_PLAN_VERSION = 1 as const;
export const STARTER_RECIPE_VERSION = 1 as const;
export const PATCH_OPERATION_VERSION = 1 as const;
export const FILE_TRANSFORM_VERSION = 1 as const;
export const UNINSTALL_MANIFEST_VERSION = 1 as const;
export const DOCTOR_RESULT_VERSION = 1 as const;
export const FRAMEWORK_TARGET_DESCRIPTOR_VERSION = 1 as const;
export const DIFF_REPORT_VERSION = 1 as const;

export const GENERATION_INTENTS = [
  "new-project",
  "existing-project",
  "preview-only",
] as const;
export const PATCH_OPERATION_KINDS = ["create", "patch", "remove"] as const;
export const FILE_TRANSFORM_SOURCES = [
  "template",
  "registry",
  "generator",
] as const;
export const UNINSTALL_ACTIONS = [
  "remove-file",
  "restore-file",
  "revert-patch",
] as const;
export const DOCTOR_CHECK_STATUSES = ["pass", "warn"] as const;
export const DIFF_REPORT_MODES = [
  "starter",
  "patch",
  "theme-only",
  "uninstall",
] as const;

export type GenerationIntent = (typeof GENERATION_INTENTS)[number];
export type PatchOperationKind = (typeof PATCH_OPERATION_KINDS)[number];
export type FileTransformSource = (typeof FILE_TRANSFORM_SOURCES)[number];
export type UninstallAction = (typeof UNINSTALL_ACTIONS)[number];
export type DoctorCheckStatus = (typeof DOCTOR_CHECK_STATUSES)[number];
export type DiffReportMode = (typeof DIFF_REPORT_MODES)[number];

export interface GenerationInput {
  version: typeof GENERATION_INPUT_VERSION;
  framework: FrameworkAdapterId;
  intent: GenerationIntent;
  packId: PackId;
  planId: PlanId;
  templates: string[];
  modules: string[];
  packRegistryId?: string;
  templateRegistryIds?: string[];
  moduleRegistryIds?: string[];
  catalogConfigPath?: string;
  catalogWorkspaceId?: string;
}

export interface StarterRecipe {
  version: typeof STARTER_RECIPE_VERSION;
  framework: FrameworkAdapterId;
  intent: GenerationIntent;
  targetRoot: string;
  templates: string[];
  modules: string[];
  requiredPackages: string[];
  requiredRoutes: string[];
  themeDependencies: string[];
  sampleDataBindings: string[];
}

export interface FrameworkTargetDescriptor {
  version: typeof FRAMEWORK_TARGET_DESCRIPTOR_VERSION;
  framework: FrameworkAdapterId;
  projectManager: "pnpm" | "dotnet";
  projectManifestPath: string;
  routesRoot: string;
  themePath: string;
  tokensPath: string;
  providerPath: string;
  verificationPath: string;
  supportsRuntimeBootstrap: boolean;
}

export interface PatchOperation {
  version: typeof PATCH_OPERATION_VERSION;
  id: string;
  kind: PatchOperationKind;
  targetPath: string;
  ownerPackage: string;
  reason: string;
  reversible: boolean;
  framework: FrameworkAdapterId;
}

export interface FileTransform {
  version: typeof FILE_TRANSFORM_VERSION;
  path: string;
  operation: PatchOperationKind;
  source: FileTransformSource;
  description: string;
}

export interface UninstallStep {
  action: UninstallAction;
  path: string;
  detail: string;
}

export interface UninstallManifest {
  version: typeof UNINSTALL_MANIFEST_VERSION;
  steps: UninstallStep[];
}

export interface DoctorCheck {
  id: string;
  label: string;
  status: DoctorCheckStatus;
  detail: string;
}

export interface DoctorResult {
  version: typeof DOCTOR_RESULT_VERSION;
  status: DoctorCheckStatus;
  summary: string;
  checks: DoctorCheck[];
}

export interface DiffReportEntry {
  path: string;
  operation: PatchOperationKind;
  ownerPackage: string;
  reason: string;
  checksum: string;
  existedBefore: boolean;
  sourcePath?: string;
}

export interface DiffReport {
  version: typeof DIFF_REPORT_VERSION;
  mode: DiffReportMode;
  targetRoot: string;
  entries: DiffReportEntry[];
}

export interface GenerationPlan {
  version: typeof GENERATION_PLAN_VERSION;
  input: GenerationInput;
  frameworkTarget: FrameworkTargetDescriptor;
  selectedPack: PackManifest;
  selectedTemplates: TemplateManifest[];
  selectedModules: ModuleManifest[];
  starterRecipe: StarterRecipe;
  patchOperations: PatchOperation[];
  fileTransforms: FileTransform[];
  diff: DiffReport;
  uninstall: UninstallManifest;
  doctor: DoctorResult;
  checklist: string[];
  diffReport: string[];
  uninstallManifest: string[];
  doctorChecks: DoctorCheck[];
}

export function defineGenerationInput(
  input: Omit<GenerationInput, "version">,
): GenerationInput {
  return {
    version: GENERATION_INPUT_VERSION,
    ...input,
    templates: cloneStringArray(input.templates),
    modules: cloneStringArray(input.modules),
    packRegistryId: input.packRegistryId,
    templateRegistryIds: cloneStringArray(input.templateRegistryIds),
    moduleRegistryIds: cloneStringArray(input.moduleRegistryIds),
    catalogConfigPath: input.catalogConfigPath,
    catalogWorkspaceId: input.catalogWorkspaceId,
  };
}

export function defineStarterRecipe(
  recipe: Omit<StarterRecipe, "version">,
): StarterRecipe {
  return {
    version: STARTER_RECIPE_VERSION,
    ...recipe,
    templates: cloneStringArray(recipe.templates),
    modules: cloneStringArray(recipe.modules),
    requiredPackages: cloneStringArray(recipe.requiredPackages),
    requiredRoutes: cloneStringArray(recipe.requiredRoutes),
    themeDependencies: cloneStringArray(recipe.themeDependencies),
    sampleDataBindings: cloneStringArray(recipe.sampleDataBindings),
  };
}

export function defineFrameworkTargetDescriptor(
  descriptor: Omit<FrameworkTargetDescriptor, "version">,
): FrameworkTargetDescriptor {
  return {
    version: FRAMEWORK_TARGET_DESCRIPTOR_VERSION,
    ...descriptor,
  };
}

export function definePatchOperation(
  operation: Omit<PatchOperation, "version">,
): PatchOperation {
  return {
    version: PATCH_OPERATION_VERSION,
    ...operation,
  };
}

export function defineFileTransform(
  transform: Omit<FileTransform, "version">,
): FileTransform {
  return {
    version: FILE_TRANSFORM_VERSION,
    ...transform,
  };
}

export function defineUninstallManifest(
  manifest: Omit<UninstallManifest, "version">,
): UninstallManifest {
  return {
    version: UNINSTALL_MANIFEST_VERSION,
    steps: manifest.steps.map((step) => ({ ...step })),
  };
}

export function defineDoctorResult(
  result: Omit<DoctorResult, "version">,
): DoctorResult {
  return {
    version: DOCTOR_RESULT_VERSION,
    summary: result.summary,
    status: result.status,
    checks: result.checks.map((check) => ({ ...check })),
  };
}

export function defineDiffReport(
  report: Omit<DiffReport, "version">,
): DiffReport {
  return {
    version: DIFF_REPORT_VERSION,
    mode: report.mode,
    targetRoot: report.targetRoot,
    entries: report.entries.map((entry) => ({ ...entry })),
  };
}

export function defineGenerationPlan(
  plan: Omit<GenerationPlan, "version">,
): GenerationPlan {
  return {
    version: GENERATION_PLAN_VERSION,
    ...plan,
    checklist: cloneStringArray(plan.checklist),
    diffReport: cloneStringArray(plan.diffReport),
    uninstallManifest: cloneStringArray(plan.uninstallManifest),
    doctorChecks: plan.doctorChecks.map((check) => ({ ...check })),
  };
}
