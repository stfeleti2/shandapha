export type DensityMode = "comfortable" | "compact";
export type MotionMode = "full" | "reduced";
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

export interface TemplateManifest {
  slug: string;
  name: string;
  group: string;
  summary: string;
  states: string[];
  variants: string[];
}

export interface ModuleManifest {
  id: string;
  name: string;
  packageName: string;
  description: string;
  premium: boolean;
}

export interface RegistryManifest {
  packs: PackManifest[];
  templates: TemplateManifest[];
  modules: ModuleManifest[];
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
