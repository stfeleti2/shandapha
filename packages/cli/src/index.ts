import { resolveEntitlements } from "@shandapha/entitlements";
import { createGenerationPlan, runDoctor } from "@shandapha/generator";
import { runCommand } from "./shared/generatorBridge";
import { registryBridge } from "./shared/registryBridge";

const [command = "init", ...args] = process.argv.slice(2);

const output = runCommand(command, args, {
  createGenerationPlan,
  runDoctor,
  registry: registryBridge(),
  resolveEntitlements,
});

if (typeof output === "string") {
  console.log(output);
} else {
  console.log(JSON.stringify(output, null, 2));
}
