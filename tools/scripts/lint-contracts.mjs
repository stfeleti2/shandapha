import { access } from "node:fs/promises";

const required = [
  "packages/contracts/src/tokens/tokens.schema.json",
  "packages/contracts/src/templates/template.manifest.schema.json",
  "packages/contracts/src/packs/pack.manifest.schema.json",
  "packages/contracts/src/registry/registry.schema.json",
];

await Promise.all(required.map((file) => access(file)));
console.log("Contracts verified.");
