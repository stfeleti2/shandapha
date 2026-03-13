import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

async function collectPackageFiles(base) {
  const packageFiles = [];

  async function walk(current) {
    let entries;

    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".next") {
        continue;
      }

      const fullPath = join(current, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name === "package.json") {
        packageFiles.push(fullPath);
      }
    }
  }

  await walk(base);
  return packageFiles;
}

const packageFiles = [
  ...(await collectPackageFiles("apps")),
  ...(await collectPackageFiles("services")),
  ...(await collectPackageFiles("packages")),
  ...(await collectPackageFiles("examples")),
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
