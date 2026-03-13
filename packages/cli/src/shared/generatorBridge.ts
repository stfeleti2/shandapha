import type {
  DoctorCheck,
  EntitlementPlan,
  GenerationInput,
  GenerationPlan,
} from "@shandapha/contracts";
import type { registryBridge } from "./registryBridge";

interface CommandDependencies {
  createGenerationPlan: (input: GenerationInput) => GenerationPlan;
  runDoctor: (input: {
    hasProvider: boolean;
    hasStyles: boolean;
    hasTokens: boolean;
    packLocked: boolean;
  }) => DoctorCheck[];
  registry: ReturnType<typeof registryBridge>;
  resolveEntitlements: (planId: "free" | "premium" | "business") => {
    plan: EntitlementPlan;
    features: string[];
  };
}

function resolveSelection(
  bridge: ReturnType<typeof registryBridge>,
  kind: "pack" | "template" | "module",
  requested: string,
) {
  const match = bridge.find(kind, requested);

  if (match) {
    return {
      added: requested,
      kind,
      available: bridge.list(kind).slice(0, 5),
    };
  }

  return {
    added: null,
    kind,
    requested,
    available: bridge.list(kind),
    message: `Unknown ${kind} "${requested}".`,
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
      return resolveSelection(
        deps.registry,
        "template",
        args[0] ?? "dashboard-home",
      );
    case "add-pack":
      return resolveSelection(deps.registry, "pack", args[0] ?? "normal");
    case "add-module":
      return resolveSelection(deps.registry, "module", args[0] ?? "datatable");
    case "doctor":
      return deps.runDoctor({
        hasProvider: true,
        hasStyles: true,
        hasTokens: true,
        packLocked: true,
      });
    case "upgrade":
      return {
        ...deps.resolveEntitlements("premium"),
        registryCounts: deps.registry.describe(),
      };
    default:
      return {
        message: `Unknown command: ${command}`,
        availableCommands: [
          "init",
          "add-template",
          "add-pack",
          "add-module",
          "doctor",
          "upgrade",
        ],
      };
  }
}
