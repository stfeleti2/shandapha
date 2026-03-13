import type { DoctorCheck, GenerationInput, GenerationPlan } from "@shandapha/contracts";
import type { EntitlementPlan } from "@shandapha/contracts";
import type { RegistryManifest } from "@shandapha/contracts";

interface CommandDependencies {
  createGenerationPlan: (input: GenerationInput) => GenerationPlan;
  runDoctor: (input: {
    hasProvider: boolean;
    hasStyles: boolean;
    hasTokens: boolean;
    packLocked: boolean;
  }) => DoctorCheck[];
  buildRegistry: () => RegistryManifest;
  resolveEntitlements: (planId: "free" | "premium" | "business") => {
    plan: EntitlementPlan;
    features: string[];
  };
}

export function runCommand(
  command: string,
  args: string[],
  deps: CommandDependencies,
) {
  switch (command) {
    case "init":
      return deps.createGenerationPlan({
        framework: args.includes("--framework=react")
          ? "react-vite"
          : "next-app-router",
        intent: args.includes("--existing")
          ? "existing-project"
          : "new-project",
        packId: args.includes("--pack=glass") ? "glass" : "normal",
        planId: args.includes("--business")
          ? "business"
          : args.includes("--premium")
            ? "premium"
            : "free",
        templates: ["dashboard-home", "pricing-basic"],
        modules: args.includes("--datatable") ? ["datatable"] : [],
      });
    case "add-template":
      return { added: args[0] ?? "dashboard-home" };
    case "add-pack":
      return { added: args[0] ?? "normal" };
    case "add-module":
      return { added: args[0] ?? "datatable" };
    case "doctor":
      return deps.runDoctor({
        hasProvider: true,
        hasStyles: true,
        hasTokens: true,
        packLocked: true,
      });
    case "upgrade":
      return deps.resolveEntitlements("premium");
    default:
      return `Unknown command: ${command}`;
  }
}
