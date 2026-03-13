import { resolveEntitlements } from "@shandapha/entitlements";
import { createGenerationPlan, runDoctor } from "@shandapha/generator";
import { buildRegistry } from "@shandapha/registry";
import { runCommand } from "./shared/generatorBridge";

const [command = "init", ...args] = process.argv.slice(2);

const output = runCommand(command, args, {
  createGenerationPlan,
  runDoctor,
  buildRegistry,
  resolveEntitlements,
});

if (typeof output === "string") {
  console.log(output);
} else {
  console.log(JSON.stringify(output, null, 2));
}
