import { readFile } from "node:fs/promises";

const file = await readFile(
  "packages/layouts/src/drift/allowedPresets.ts",
  "utf8",
);
if (!file.includes("dashboard")) {
  throw new Error("Allowed presets are missing dashboard.");
}
console.log("Drift constraints verified.");
