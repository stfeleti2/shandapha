import { stat } from "node:fs/promises";

const roots = [
  "packages/core/src/index.tsx",
  "packages/layouts/src/index.tsx",
  "packages/generator/src/index.ts",
];
const sizes = await Promise.all(
  roots.map(async (file) => ({ file, size: (await stat(file)).size })),
);
console.log(JSON.stringify(sizes, null, 2));
