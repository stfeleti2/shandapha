export type DensityMode = "comfortable" | "compact";
export type MotionMode = "full" | "reduced";
export type ThemeMode = "light" | "dark" | "system";
export type PackId = "normal" | "glass" | "neon";
export type PlanId = "free" | "premium" | "business";

export interface BrandKit {
  primary: string;
  accent: string;
  font: string;
  radius: string;
  density: DensityMode;
}

export interface PackManifest {
  id: PackId;
  slug: string;
  name: string;
  tier: PlanId;
  tagline: string;
  description: string;
  knobs: string[];
}

export interface TemplateDataContract {
  entities: string[];
  slots: string[];
  outputs: string[];
  samples: string[];
}

export interface TemplateManifest {
  slug: string;
  name: string;
  group: string;
  shell: "AdminShell" | "MarketingShell" | "DocsShell" | "SidebarShell" | "AuthShell";
  summary: string;
  states: string[];
  variants: string[];
  blocks: string[];
  related: string[];
  surfaces: string[];
  featuredPackIds: PackId[];
  dataContract: TemplateDataContract;
}

export interface ModuleManifest {
  id: string;
  name: string;
  packageName: string;
  description: string;
  premium: boolean;
}

export interface RegistryFileManifest {
  path: string;
  target: string;
  role: "component" | "block" | "layout" | "style" | "hook" | "data";
  ownerPackage: string;
}

export interface RegistryItemManifest {
  name: string;
  title: string;
  description: string;
  type: "component" | "block" | "chart" | "shell";
  ownerPackage: string;
  installTarget: string;
  categories: string[];
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFileManifest[];
}

export interface RegistryWorkspaceManifest {
  name: string;
  path: string;
  ownerPackage: string;
  cssPath: string;
  aliases: Record<string, string>;
}

export interface RegistryManifest {
  packs: PackManifest[];
  templates: TemplateManifest[];
  modules: ModuleManifest[];
  components: RegistryItemManifest[];
  blocks: RegistryItemManifest[];
  charts: RegistryItemManifest[];
  shells: RegistryItemManifest[];
  workspaces: RegistryWorkspaceManifest[];
}

export interface EntitlementPlan {
  id: PlanId;
  name: string;
  price: string;
  summary: string;
  includes: string[];
}

export interface GenerationInput {
  framework: "react-vite" | "next-app-router" | "wc-universal" | "blazor-wc";
  intent: "new-project" | "existing-project" | "preview-only";
  packId: PackId;
  planId: PlanId;
  templates: string[];
  modules: string[];
}

export interface DoctorCheck {
  id: string;
  label: string;
  status: "pass" | "warn";
  detail: string;
}

export interface GenerationPlan {
  input: GenerationInput;
  selectedPack: PackManifest;
  selectedTemplates: TemplateManifest[];
  selectedModules: ModuleManifest[];
  checklist: string[];
  diffReport: string[];
  uninstallManifest: string[];
  doctorChecks: DoctorCheck[];
}
