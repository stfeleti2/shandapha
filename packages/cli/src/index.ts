import {
  doctorProject,
  generatePatch,
  generateStarter,
  generateThemeOnly,
} from "@shandapha/generator";
import { runCommand } from "./shared/generatorBridge";
import { registryBridge } from "./shared/registryBridge";
import { formatOutput } from "./ui/output";

const result = await runCommand(process.argv.slice(2), {
  doctorProject,
  generatePatch,
  generateStarter,
  generateThemeOnly,
  registry: registryBridge(),
});

console.log(
  formatOutput(result.value, {
    showDiff: result.showDiff,
    writeJson: result.writeJson,
  }),
);

process.exitCode = result.exitCode;
