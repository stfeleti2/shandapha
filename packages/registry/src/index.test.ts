import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildRegistry } from "./index";

const modulesRoot = fileURLToPath(new URL("../../modules/", import.meta.url));

describe("registry", () => {
  it("builds pack and template data", () => {
    const registry = buildRegistry();
    expect(registry.packs.length).toBeGreaterThanOrEqual(3);
    expect(registry.templates.length).toBeGreaterThan(0);
  });

  it("keeps module data aligned with workspace module packages", async () => {
    const entries = await readdir(modulesRoot, {
      withFileTypes: true,
    });
    const moduleDirectories = entries.filter((entry) => entry.isDirectory());
    const manifests = await Promise.all(
      moduleDirectories.map(async (entry) => {
        const packageJson = JSON.parse(
          await readFile(`${modulesRoot}/${entry.name}/package.json`, "utf8"),
        );
        return packageJson.shandapha?.moduleManifest?.id;
      }),
    );

    expect(
      buildRegistry()
        .modules.map((module) => module.id)
        .sort(),
    ).toEqual(manifests.filter(Boolean).sort());
  });
});
