import { describe, expect, it } from "vitest";
import {
  assertCatalogConfig,
  assertCatalogSourceManifest,
  assertRegistryManifest,
  assertTemplateManifest,
  createRegistryId,
  defineCatalogConfig,
  defineCatalogSourceManifest,
  defineGenerationInput,
  defineModuleManifest,
  definePackManifest,
  defineRegistryManifest,
  defineTemplateManifest,
  safeParseGenerationInput,
} from "./index";

describe("contracts", () => {
  it("builds versioned template manifests with install metadata defaults", () => {
    const template = defineTemplateManifest({
      slug: "dashboard-home",
      name: "Dashboard Home",
      group: "saas",
      shell: "AdminShell",
      summary: "Baseline starter.",
      states: ["loading", "success"],
      variants: ["default"],
      blocks: ["hero"],
      related: [],
      surfaces: ["card"],
      featuredPackIds: ["normal"],
      dataContract: {
        entities: ["workspace"],
        slots: ["hero"],
        outputs: ["summary"],
        samples: ["workspace.json"],
      },
    });

    expect(template.version).toBe(1);
    expect(template.layoutPreset).toBe("dashboard");
    expect(template.install.themeDependencies).toEqual([
      "theme.css",
      "tokens.json",
    ]);
    expect(template.frameworks[0]?.adapterKind).toBe("react");
    expect(template.frameworks).toHaveLength(4);
    expect(assertTemplateManifest(template)).toEqual(template);
  });

  it("rejects generation inputs without an explicit contract version", () => {
    const result = safeParseGenerationInput({
      framework: "next-app-router",
      intent: "existing-project",
      packId: "normal",
      planId: "free",
      templates: ["dashboard-home"],
      modules: [],
    });

    expect(result.success).toBe(false);
  });

  it("validates registry manifests before execution", () => {
    const registry = defineRegistryManifest({
      packs: [
        definePackManifest({
          id: "normal",
          slug: "normal",
          name: "Normal",
          tier: "free",
          tagline: "Baseline pack.",
          description: "A calm baseline.",
          knobs: ["contrast"],
        }),
      ],
      templates: [
        defineTemplateManifest({
          slug: "dashboard-home",
          name: "Dashboard Home",
          group: "saas",
          shell: "AdminShell",
          summary: "Baseline starter.",
          states: ["loading", "success"],
          variants: ["default"],
          blocks: ["hero"],
          related: [],
          surfaces: ["card"],
          featuredPackIds: ["normal"],
          dataContract: {
            entities: ["workspace"],
            slots: ["hero"],
            outputs: ["summary"],
            samples: ["workspace.json"],
          },
        }),
      ],
      modules: [
        defineModuleManifest({
          id: "seo",
          name: "SEO",
          packageName: "@shandapha/module-seo",
          description: "SEO helpers.",
          premium: false,
          capabilities: {
            free: ["metadata"],
          },
          install: {
            requiredRoutes: ["/sitemap.xml"],
          },
        }),
      ],
      components: [],
      blocks: [],
      charts: [],
      shells: [],
      workspaces: [
        {
          name: "web",
          path: "apps/web",
          ownerPackage: "@shandapha/web",
          cssPath: "apps/web/src/app.css",
          aliases: {
            "@": "apps/web/src",
          },
        },
      ],
    });

    expect(assertRegistryManifest(registry).version).toBe(1);
    expect(assertRegistryManifest(registry).modules[0]?.minimumPlan).toBe(
      "free",
    );
  });

  it("creates generation inputs that downstream packages can pass through unchanged", () => {
    const input = defineGenerationInput({
      framework: "next-app-router",
      intent: "existing-project",
      packId: "normal",
      planId: "free",
      templates: ["dashboard-home"],
      modules: ["seo"],
    });

    expect(input.version).toBe(1);
    expect(input.templates).toEqual(["dashboard-home"]);
  });

  it("normalizes legacy framework compatibility rules and inferred layout presets", () => {
    const template = assertTemplateManifest({
      version: 1,
      slug: "docs-article",
      name: "Docs Article",
      group: "docs",
      shell: "DocsShell",
      summary: "Article template.",
      states: ["loading", "success"],
      variants: ["default"],
      blocks: ["docs-content"],
      related: [],
      surfaces: ["article"],
      featuredPackIds: ["normal"],
      dataContract: {
        entities: ["article"],
        slots: ["body"],
        outputs: ["article page"],
        samples: ["article.json"],
      },
      frameworks: [
        {
          adapter: "wc-universal",
          support: "experimental",
          notes: "Legacy manifest shape should normalize forward.",
          requiredCapabilities: ["custom-elements"],
        },
      ],
      install: {
        requiredPackages: [],
        requiredRoutes: [],
        themeDependencies: ["theme.css", "tokens.json"],
        sampleDataBindings: ["article.json"],
      },
    });

    expect(template.layoutPreset).toBe("docs");
    expect(template.frameworks[0]?.adapterKind).toBe("wc");
    expect(template.frameworks[0]?.portabilityLayer).toBe("web-components");
  });

  it("validates catalog config and layered source manifests", () => {
    const config = assertCatalogConfig(
      defineCatalogConfig({
        sources: [
          {
            id: "builtin:first-party",
            kind: "builtin",
            label: "Builtin",
            enabled: true,
            namespace: "shandapha",
            workspaceIds: [],
            allowedNamespaces: ["shandapha"],
          },
          {
            id: "community-demo",
            kind: "api",
            label: "Community demo",
            enabled: true,
            namespace: "community/demo-labs",
            url: "https://catalog.example.test/api/catalog",
            workspaceIds: [],
            allowedNamespaces: ["community/demo-labs"],
          },
        ],
        policies: [],
      }),
    );
    const source = assertCatalogSourceManifest(
      defineCatalogSourceManifest({
        source: {
          id: "community-demo",
          kind: "file",
          label: "Community demo",
          enabled: true,
          namespace: "community/demo-labs",
          workspaceIds: [],
          allowedNamespaces: ["community/demo-labs"],
        },
        packs: [],
        templates: [],
        templateAssets: [],
        modules: [
          defineModuleManifest({
            registryId: createRegistryId(
              "community/demo-labs",
              "module",
              "release-notes",
            ),
            namespace: "community/demo-labs",
            sourceKind: "community",
            visibility: "public",
            supportLevel: "community",
            trustLevel: "self-declared",
            stability: "experimental",
            tags: ["community"],
            owner: {
              id: "community/demo-labs",
              label: "Community demo",
            },
            provenance: {
              sourceId: "community-demo",
              checksum: "community-demo-release-notes",
            },
            installability: {
              installable: true,
              target: "patch",
            },
            id: "release-notes",
            name: "Release Notes",
            packageName: "@demo-labs/shandapha-release-notes",
            description: "Community module manifest.",
            premium: false,
            capabilities: {
              free: ["release-feed"],
            },
            install: {
              requiredPackages: ["@demo-labs/shandapha-release-notes"],
              requiredRoutes: ["/release-notes"],
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

    expect(config.sources[1]?.kind).toBe("api");
    expect(source.modules[0]?.registryId).toBe(
      "community/demo-labs::module::release-notes",
    );
  });
});
