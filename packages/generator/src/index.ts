import type {
  DoctorCheck,
  GenerationInput,
  GenerationPlan,
} from "@shandapha/contracts";
import { resolveEntitlements } from "@shandapha/entitlements";
import { buildRegistry } from "@shandapha/registry";

export const recipes = [
  "react-vite",
  "next-app-router",
  "wc-universal",
  "blazor-wc",
] as const;

export function createGenerationPlan(input: GenerationInput): GenerationPlan {
  const registry = buildRegistry();
  const selectedPack =
    registry.packs.find((pack) => pack.id === input.packId) ??
    registry.packs[0];
  const selectedTemplates = registry.templates.filter((template) =>
    input.templates.includes(template.slug),
  );
  const selectedModules = registry.modules.filter((module) =>
    input.modules.includes(module.id),
  );
  const entitlements = resolveEntitlements(input.planId);
  const checklist = [
    "Install dependencies",
    "Confirm theme.css and tokens.json are present",
    "Wrap the app with ThemeProvider where applicable",
    "Run doctor and verify starter routes",
  ];
  const diffReport = [
    `Add ${selectedTemplates.length} template files`,
    `Enable pack: ${selectedPack.name}`,
    input.intent === "existing-project"
      ? "Apply minimal, reversible patch install"
      : "Create starter structure",
  ];
  const uninstallManifest = [
    "remove theme.css",
    "remove tokens.json",
    "remove generated template folder",
    "revert provider wrapper changes",
  ];

  return {
    input,
    selectedPack,
    selectedTemplates,
    selectedModules,
    checklist,
    diffReport,
    uninstallManifest,
    doctorChecks: runDoctor({
      hasProvider:
        input.framework !== "wc-universal" && input.framework !== "blazor-wc",
      hasStyles: true,
      hasTokens: true,
      packLocked: entitlements.features.includes(selectedPack.id),
    }),
  };
}

export function runDoctor(input: {
  hasProvider: boolean;
  hasStyles: boolean;
  hasTokens: boolean;
  packLocked: boolean;
}): DoctorCheck[] {
  return [
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
        ? "React/Next provider detected."
        : "Web Components mode can skip the provider.",
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
}
