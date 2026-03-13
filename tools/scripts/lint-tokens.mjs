import { access } from "node:fs/promises";

const required = [
  "packages/tokens/src/presets/normal/README.md",
  "packages/tokens/src/presets/glass-lite/README.md",
  "packages/tokens/src/presets/neon-lite/README.md",
];

await Promise.all(required.map((file) => access(file)));
console.log("Token presets verified.");
