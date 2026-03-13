import { readFile, writeFile } from "node:fs/promises";

const registry = await readFile("data/seed/registry/catalog.json", "utf8");
await writeFile("data/seed/registry/catalog.generated.json", registry);
console.log("Generated registry snapshot.");
