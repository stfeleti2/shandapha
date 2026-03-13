import { access } from "node:fs/promises";

const required = [
  "README.md",
  "ARCHITECTURE.md",
  ".github/workflows/ci.yml",
  ".changeset/config.json",
];

await Promise.all(required.map((file) => access(file)));
console.log("Release health looks good.");
