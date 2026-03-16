import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  assertCatalogSourceManifest,
  createRegistryId,
  defineCatalogSourceManifest,
  defineModuleManifest,
} from "@shandapha/contracts";
import { describe, expect, it } from "vitest";
import { buildRegistry, findCatalogItem, resolveRegistryCatalog } from "./index";

const modulesRoot = fileURLToPath(new URL("../../../modules/", import.meta.url));

describe("registry", () => {
  it("builds pack and template data", () => {
    const registry = buildRegistry();
    expect(registry.version).toBe(1);
    expect(registry.packs.length).toBeGreaterThanOrEqual(3);
    expect(registry.templates.length).toBeGreaterThan(0);
    expect(registry.components.length).toBeGreaterThan(30);
    expect(registry.blocks.length).toBeGreaterThan(5);
    expect(registry.charts).toEqual([]);
    expect(registry.shells.length).toBeGreaterThan(3);
    expect(registry.workspaces.length).toBeGreaterThan(2);
    expect(
      registry.templates[0]?.install.themeDependencies.length,
    ).toBeGreaterThan(0);
    expect(registry.components[0]?.install.targetPaths.length).toBeGreaterThan(
      0,
    );
    expect(
      registry.modules.find((module) => module.id === "charts")?.status,
    ).toBe("deferred");
    expect(registry.modules.find((module) => module.id === "seo")?.status).toBe(
      "installable",
    );
  });

  it("keeps module data aligned with workspace module packages", async () => {
    const entries = await readdir(modulesRoot, {
      withFileTypes: true,
    });
    const moduleDirectories = entries.filter((entry) => entry.isDirectory());
    const manifests = await Promise.all(
      moduleDirectories.map(async (entry) => {
        try {
          const packageJson = JSON.parse(
            await readFile(`${modulesRoot}/${entry.name}/package.json`, "utf8"),
          );
          return packageJson.shandapha?.moduleManifest?.id;
        } catch {
          return undefined;
        }
      }),
    );

    expect(
      buildRegistry()
        .modules.map((module) => module.id)
        .sort(),
    ).toEqual(manifests.filter(Boolean).sort());
  });

  it("layers public and workspace catalogs without letting externals override first-party truth", () => {
    const publicCatalog = resolveRegistryCatalog();
    const workspaceCatalog = resolveRegistryCatalog({
      workspaceId: "acme",
    });

    expect(
      findCatalogItem(publicCatalog, "org/acme::template::workspace-review-hub"),
    ).toBeUndefined();
    expect(publicCatalog.sources.some((source) => source.id === "acme-internal")).toBe(
      false,
    );
    expect(
      findCatalogItem(
        workspaceCatalog,
        "org/acme::template::workspace-review-hub",
        "template",
      )?.supportLevel,
    ).toBe("internal");
    expect(
      findCatalogItem(
        workspaceCatalog,
        "community/demo-labs::module::release-notes",
        "module",
      )?.sourceKind,
    ).toBe("community");
  });

  it("rejects external sources that try to override first-party registry ids", () => {
    const overrideSource = assertCatalogSourceManifest(
      defineCatalogSourceManifest({
        source: {
          id: "community-override",
          kind: "file",
          label: "Community override",
          enabled: true,
          namespace: "community/override",
          workspaceIds: [],
          allowedNamespaces: ["community/override"],
        },
        packs: [],
        templates: [],
        templateAssets: [],
        modules: [
          defineModuleManifest({
            registryId: createRegistryId("shandapha", "module", "seo"),
            namespace: "community/override",
            sourceKind: "community",
            visibility: "public",
            supportLevel: "community",
            trustLevel: "self-declared",
            stability: "experimental",
            tags: ["override"],
            owner: {
              id: "community/override",
              label: "Community override",
            },
            provenance: {
              sourceId: "community-override",
              checksum: "community-override-seo",
            },
            installability: {
              installable: true,
              target: "patch",
            },
            id: "seo",
            name: "SEO override",
            packageName: "@community/override-seo",
            description: "Attempted override of first-party SEO.",
            premium: false,
            capabilities: {
              free: ["metadata"],
            },
            install: {
              requiredPackages: ["@community/override-seo"],
              requiredRoutes: [],
            },
          }),
        ],
        components: [],
        blocks: [],
        charts: [],
        shells: [],
        approvals: [],
      }),
    );

    expect(() =>
      resolveRegistryCatalog({
        sourceManifests: [overrideSource],
      }),
    ).toThrow(/cannot override first-party registry ids/i);
  });
});
