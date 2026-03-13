import { spawnSync } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

async function loadModuleManifests() {
  const modulesDirectory = join(repoRoot, "packages/modules");
  const entries = await readdir(modulesDirectory, { withFileTypes: true });
  const manifests = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const packageJsonPath = join(modulesDirectory, entry.name, "package.json");
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
    const manifest = packageJson.shandapha?.moduleManifest;

    if (!manifest) {
      throw new Error(`Missing shandapha.moduleManifest in ${packageJsonPath}`);
    }

    manifests.push(manifest);
  }

  return manifests.sort((left, right) => left.id.localeCompare(right.id));
}

const registry = JSON.parse(
  await readFile(join(repoRoot, "data/seed/registry/catalog.json"), "utf8"),
);
const modules = await loadModuleManifests();

await writeFile(
  join(repoRoot, "packages/registry/src/data/modules.json"),
  `${JSON.stringify(modules, null, 2)}\n`,
);

await writeFile(
  join(repoRoot, "data/seed/registry/catalog.generated.json"),
  `${JSON.stringify(
    {
      ...registry,
      modules,
    },
    null,
    2,
  )}\n`,
);

const formatResult = spawnSync(
  "pnpm",
  [
    "exec",
    "biome",
    "format",
    "--config-path",
    join(repoRoot, "configs/biome.json"),
    "--write",
    join(repoRoot, "packages/registry/src/data/modules.json"),
    join(repoRoot, "data/seed/registry/catalog.generated.json"),
  ],
  {
    cwd: repoRoot,
    stdio: "inherit",
  },
);

if (formatResult.status !== 0) {
  throw new Error("Failed to format generated registry artifacts.");
}

console.log(`Generated registry snapshot for ${modules.length} modules.`);
