import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

async function collectPackages(base) {
  try {
    const entries = await readdir(base, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(base, entry.name, "package.json"));
  } catch {
    return [];
  }
}

const packageFiles = [
  ...(await collectPackages("apps")),
  ...(await collectPackages("services")),
  ...(await collectPackages("packages")),
];

for (const file of packageFiles) {
  try {
    const data = JSON.parse(await readFile(file, "utf8"));
    const dependencies = Object.keys(data.dependencies ?? {});
    if (
      dependencies.some(
        (dep) =>
          dep.startsWith("@shandapha/web") ||
          dep.startsWith("@shandapha/studio"),
      )
    ) {
      throw new Error(`Package boundary violation in ${file}`);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw error;
    }
    if (error.message?.includes("ENOENT")) {
      continue;
    }
    throw error;
  }
}

console.log("Package boundaries verified.");
