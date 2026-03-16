import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertCatalogConfig,
  assertCatalogSourceManifest,
  assertModuleManifest,
  assertRegistryManifest,
  createRegistryId,
  defineRegistryManifest,
  REGISTRY_MANIFEST_VERSION,
  type CatalogConfig,
  type CatalogItemKind,
  type CatalogSourceConfig,
  type CatalogSourceKind,
  type CatalogSourceManifest,
  type CatalogTemplateAssetManifest,
  type FrameworkCompatibilityRule,
  type ModuleManifest,
  type PackManifest,
  type RegistryItemManifest,
  type RegistryManifest,
  type ResolvedCatalog,
  type ResolvedCatalogItem,
  type ResolvedCatalogSource,
  type ResolvedCatalogWarning,
  type TemplateManifest,
} from "@shandapha/contracts";
import { packs } from "@shandapha/packs";
import {
  getTemplateAssetBundle,
  listTemplateAssetBundles,
  templates,
} from "@shandapha/templates";
import {
  blockManifests,
  chartManifests,
  componentManifests,
  shellManifests,
  workspaceManifests,
} from "./data/catalog";
import modules from "./data/modules.json";

const REPO_ROOT = fileURLToPath(new URL("../../../../", import.meta.url));
export const DEFAULT_CATALOG_CONFIG_PATH = resolve(
  REPO_ROOT,
  "shandapha.catalog.json",
);

function readJsonFile<T>(path: string) {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function sourceKindFromNamespace(namespace?: string): CatalogSourceKind {
  if (namespace?.startsWith("org/")) {
    return "org";
  }

  if (namespace?.startsWith("community/")) {
    return "community";
  }

  return "first-party";
}

function resolveConfigPath(catalogConfigPath?: string) {
  if (catalogConfigPath) {
    return resolve(REPO_ROOT, catalogConfigPath);
  }

  return DEFAULT_CATALOG_CONFIG_PATH;
}

function createFirstPartyRegistry(): RegistryManifest {
  return assertRegistryManifest(
    defineRegistryManifest({
      packs,
      templates,
      modules: modules.map((module) => assertModuleManifest(module)),
      components: componentManifests,
      blocks: blockManifests,
      charts: chartManifests,
      shells: shellManifests,
      workspaces: workspaceManifests,
    }),
  );
}

function createDefaultCatalogConfig(): CatalogConfig {
  return assertCatalogConfig({
    version: 1,
    sources: [
      {
        id: "builtin:first-party",
        kind: "builtin",
        label: "Shandapha first-party",
        enabled: true,
        namespace: "shandapha",
        workspaceIds: [],
        allowedNamespaces: ["shandapha"],
      },
    ],
    policies: [],
  });
}

export function loadCatalogConfig(catalogConfigPath?: string) {
  const path = resolveConfigPath(catalogConfigPath);

  if (!existsSync(path)) {
    return createDefaultCatalogConfig();
  }

  return assertCatalogConfig(readJsonFile(path));
}

function firstPartySource(): ResolvedCatalogSource {
  return {
    id: "builtin:first-party",
    label: "Shandapha first-party",
    kind: "builtin",
    sourceKind: "first-party",
    namespace: "shandapha",
    enabled: true,
    visibility: "public",
  };
}

function normalizeFrameworks(
  item:
    | PackManifest
    | TemplateManifest
    | ModuleManifest
    | RegistryItemManifest,
) {
  if ("frameworks" in item) {
    return item.frameworks;
  }

  if ("install" in item && "frameworks" in item.install) {
    return item.install.frameworks;
  }

  return [] as FrameworkCompatibilityRule[];
}

function resolvedVersion(
  item:
    | PackManifest
    | TemplateManifest
    | ModuleManifest
    | RegistryItemManifest,
) {
  return "version" in item ? item.version : REGISTRY_MANIFEST_VERSION;
}

function createResolvedItem(options: {
  kind: CatalogItemKind;
  manifest: PackManifest | TemplateManifest | ModuleManifest | RegistryItemManifest;
  title: string;
  description: string;
  slug: string;
  categories: string[];
  aliases: string[];
  templateAsset?: CatalogTemplateAssetManifest;
}): ResolvedCatalogItem {
  const { manifest } = options;

  return {
    registryId: manifest.registryId,
    kind: options.kind,
    slug: options.slug,
    title: options.title,
    description: options.description,
    version: resolvedVersion(manifest),
    namespace: manifest.namespace,
    sourceKind: manifest.sourceKind,
    visibility: manifest.visibility,
    supportLevel: manifest.supportLevel,
    trustLevel: manifest.trustLevel,
    stability: manifest.stability,
    categories: [...options.categories],
    tags: [...manifest.tags],
    owner: { ...manifest.owner },
    provenance: { ...manifest.provenance },
    installability: { ...manifest.installability },
    frameworks: normalizeFrameworks(manifest),
    aliases: [...options.aliases],
    deprecation: manifest.deprecation ? { ...manifest.deprecation } : undefined,
    previews: manifest.previews.map((preview) => ({ ...preview })),
    manifest,
    templateAsset: options.templateAsset
      ? {
          ...options.templateAsset,
          files: Object.fromEntries(
            Object.entries(options.templateAsset.files).map(
              ([framework, paths]) => [framework, [...paths]],
            ),
          ),
          states: [...options.templateAsset.states],
          variants: [...options.templateAsset.variants],
          samples: [...options.templateAsset.samples],
        }
      : undefined,
  };
}

function buildResolvedItems(manifest: RegistryManifest) {
  const templateAssets = new Map(
    listTemplateAssetBundles().map((bundle) => [
      createRegistryId("shandapha", "template", bundle.slug),
      {
        registryId: createRegistryId("shandapha", "template", bundle.slug),
        rootDir: bundle.rootDir,
        readmePath: bundle.readmePath,
        previewPath: bundle.previewPath,
        files: bundle.files,
        states: bundle.states,
        variants: bundle.variants,
        samples: bundle.samples,
      } satisfies CatalogTemplateAssetManifest,
    ]),
  );

  return [
    ...manifest.packs.map((pack) =>
      createResolvedItem({
        kind: "pack",
        manifest: pack,
        slug: pack.slug,
        title: pack.name,
        description: pack.description,
        categories: ["packs", pack.tier],
        aliases: [pack.id, pack.slug],
      }),
    ),
    ...manifest.templates.map((template) =>
      createResolvedItem({
        kind: "template",
        manifest: template,
        slug: template.slug,
        title: template.name,
        description: template.summary,
        categories: [template.group, template.layoutPreset],
        aliases: [template.slug],
        templateAsset: templateAssets.get(template.registryId),
      }),
    ),
    ...manifest.modules.map((module) =>
      createResolvedItem({
        kind: "module",
        manifest: module,
        slug: module.id,
        title: module.name,
        description: module.description,
        categories: ["modules", module.minimumPlan, module.status],
        aliases: [module.id],
      }),
    ),
    ...manifest.components.map((item) =>
      createResolvedItem({
        kind: "component",
        manifest: item,
        slug: item.name,
        title: item.title,
        description: item.description,
        categories: item.categories,
        aliases: [item.name],
      }),
    ),
    ...manifest.blocks.map((item) =>
      createResolvedItem({
        kind: "block",
        manifest: item,
        slug: item.name,
        title: item.title,
        description: item.description,
        categories: item.categories,
        aliases: [item.name],
      }),
    ),
    ...manifest.charts.map((item) =>
      createResolvedItem({
        kind: "chart",
        manifest: item,
        slug: item.name,
        title: item.title,
        description: item.description,
        categories: item.categories,
        aliases: [item.name],
      }),
    ),
    ...manifest.shells.map((item) =>
      createResolvedItem({
        kind: "shell",
        manifest: item,
        slug: item.name,
        title: item.title,
        description: item.description,
        categories: item.categories,
        aliases: [item.name],
      }),
    ),
  ];
}

function shouldIncludeSource(
  source: CatalogSourceConfig,
  workspaceId?: string,
) {
  if (!source.enabled || source.kind === "builtin") {
    return false;
  }

  if (source.workspaceIds.length === 0) {
    return true;
  }

  if (!workspaceId) {
    return false;
  }

  return source.workspaceIds.includes(workspaceId);
}

function shouldIncludeSourceManifest(
  source: CatalogSourceConfig,
  workspaceId?: string,
) {
  if (!source.enabled) {
    return false;
  }

  if (source.workspaceIds.length === 0) {
    return true;
  }

  if (!workspaceId) {
    return false;
  }

  return source.workspaceIds.includes(workspaceId);
}

function readCatalogSourceManifest(
  source: CatalogSourceConfig,
  configPath: string,
): CatalogSourceManifest {
  if (source.kind !== "file" || !source.path) {
    throw new Error(`Catalog source "${source.id}" does not point at a file manifest.`);
  }

  const absolutePath = resolve(REPO_ROOT, resolve(configPath, ".."), source.path);
  return assertCatalogSourceManifest(readJsonFile(absolutePath));
}

function pushItem(
  merged: {
    manifest: RegistryManifest;
    items: ResolvedCatalogItem[];
    itemsById: Record<string, ResolvedCatalogItem>;
    warnings: ResolvedCatalogWarning[];
  },
  item: ResolvedCatalogItem,
) {
  if (item.sourceKind !== "first-party" && item.namespace === "shandapha") {
    throw new Error(`External catalog item "${item.registryId}" cannot reuse the first-party namespace.`);
  }

  if (
    item.sourceKind !== "first-party" &&
    item.registryId.startsWith("shandapha::")
  ) {
    throw new Error(
      `External catalog item "${item.registryId}" cannot override first-party registry ids.`,
    );
  }

  if (merged.itemsById[item.registryId]) {
    throw new Error(`Duplicate registryId "${item.registryId}" detected while resolving the catalog.`);
  }

  if (
    item.kind === "template" &&
    item.installability.installable &&
    !item.templateAsset
  ) {
    merged.warnings.push({
      code: "template-asset-missing",
      message: `${item.registryId} is installable but does not declare template asset files.`,
      registryId: item.registryId,
      sourceId: item.provenance.sourceId,
    });
  }

  merged.items.push(item);
  merged.itemsById[item.registryId] = item;

  if (item.kind === "pack") {
    merged.manifest.packs.push(item.manifest as PackManifest);
    return;
  }

  if (item.kind === "template") {
    merged.manifest.templates.push(item.manifest as TemplateManifest);
    return;
  }

  if (item.kind === "module") {
    merged.manifest.modules.push(item.manifest as ModuleManifest);
    return;
  }

  if (item.kind === "component") {
    merged.manifest.components.push(item.manifest as RegistryItemManifest);
    return;
  }

  if (item.kind === "block") {
    merged.manifest.blocks.push(item.manifest as RegistryItemManifest);
    return;
  }

  if (item.kind === "chart") {
    merged.manifest.charts.push(item.manifest as RegistryItemManifest);
    return;
  }

  merged.manifest.shells.push(item.manifest as RegistryItemManifest);
}

function createResolvedItemsFromSource(
  manifest: CatalogSourceManifest,
) {
  const assetsById = new Map(
    manifest.templateAssets.map((asset) => [asset.registryId, asset]),
  );

  return [
    ...manifest.packs.map((pack) =>
      createResolvedItem({
        kind: "pack",
        manifest: pack,
        slug: pack.slug,
        title: pack.name,
        description: pack.description,
        categories: ["packs", pack.tier],
        aliases: [pack.id, pack.slug],
      }),
    ),
    ...manifest.templates.map((template) =>
      createResolvedItem({
        kind: "template",
        manifest: template,
        slug: template.slug,
        title: template.name,
        description: template.summary,
        categories: [template.group, template.layoutPreset],
        aliases: [template.slug],
        templateAsset: assetsById.get(template.registryId),
      }),
    ),
    ...manifest.modules.map((module) =>
      createResolvedItem({
        kind: "module",
        manifest: module,
        slug: module.id,
        title: module.name,
        description: module.description,
        categories: ["modules", module.minimumPlan, module.status],
        aliases: [module.id],
      }),
    ),
    ...manifest.components.map((item) =>
      createResolvedItem({
        kind: "component",
        manifest: item,
        slug: item.name,
        title: item.title,
        description: item.description,
        categories: item.categories,
        aliases: [item.name],
      }),
    ),
    ...manifest.blocks.map((item) =>
      createResolvedItem({
        kind: "block",
        manifest: item,
        slug: item.name,
        title: item.title,
        description: item.description,
        categories: item.categories,
        aliases: [item.name],
      }),
    ),
    ...manifest.charts.map((item) =>
      createResolvedItem({
        kind: "chart",
        manifest: item,
        slug: item.name,
        title: item.title,
        description: item.description,
        categories: item.categories,
        aliases: [item.name],
      }),
    ),
    ...manifest.shells.map((item) =>
      createResolvedItem({
        kind: "shell",
        manifest: item,
        slug: item.name,
        title: item.title,
        description: item.description,
        categories: item.categories,
        aliases: [item.name],
      }),
    ),
  ];
}

export function buildRegistry() {
  return createFirstPartyRegistry();
}

export function resolveRegistryCatalog(options?: {
  catalogConfigPath?: string;
  sourceManifests?: CatalogSourceManifest[];
  workspaceId?: string;
}) {
  const firstPartyManifest = createFirstPartyRegistry();
  const configPath = resolveConfigPath(options?.catalogConfigPath);
  const config = loadCatalogConfig(options?.catalogConfigPath);
  const merged: ResolvedCatalog = {
    version: REGISTRY_MANIFEST_VERSION,
    manifestVersion: firstPartyManifest.version,
    sources: [firstPartySource()],
    approvals: [],
    warnings: [],
    items: [],
    itemsById: {},
    manifest: defineRegistryManifest({
      frameworkAdapters: firstPartyManifest.frameworkAdapters,
      packs: [],
      templates: [],
      modules: [],
      components: [],
      blocks: [],
      charts: [],
      shells: [],
      workspaces: firstPartyManifest.workspaces,
    }),
  };
  const seenSourceIds = new Set<string>(["builtin:first-party"]);
  const overlaySourceManifests = new Map(
    (options?.sourceManifests ?? []).map((manifest) => [
      manifest.source.id,
      manifest,
    ]),
  );
  const configuredSourceIds = new Set<string>();

  buildResolvedItems(firstPartyManifest).forEach((item) => pushItem(merged, item));

  config.sources
    .filter((source) => shouldIncludeSource(source, options?.workspaceId))
    .forEach((source) => {
      configuredSourceIds.add(source.id);
      const overlaySourceManifest = overlaySourceManifests.get(source.id);
      const sourceManifest = overlaySourceManifest
        ? assertCatalogSourceManifest(overlaySourceManifest)
        : source.kind === "file"
          ? readCatalogSourceManifest(source, configPath)
          : undefined;

      if (!sourceManifest) {
        if (source.kind === "api") {
          merged.warnings.push({
            code: "api-source-deferred",
            message: `Catalog source "${source.id}" is API-backed and unavailable in local-first resolution.`,
            sourceId: source.id,
          });
          return;
        }

        throw new Error(`Catalog source "${source.id}" did not resolve to a manifest.`);
      }

      if (seenSourceIds.has(sourceManifest.source.id)) {
        throw new Error(
          `Duplicate catalog source "${sourceManifest.source.id}" detected while resolving the catalog.`,
        );
      }

      seenSourceIds.add(sourceManifest.source.id);
      merged.sources.push({
        id: sourceManifest.source.id,
        label: sourceManifest.source.label,
        kind: sourceManifest.source.kind,
        sourceKind: sourceKindFromNamespace(
          sourceManifest.source.namespace ?? source.namespace,
        ),
        namespace: sourceManifest.source.namespace ?? source.namespace ?? "shandapha",
        enabled: sourceManifest.source.enabled,
        visibility:
          sourceManifest.source.workspaceIds.length > 0 ? "workspace" : "org",
      });
      merged.approvals.push(...sourceManifest.approvals.map((approval) => ({ ...approval })));
      createResolvedItemsFromSource(sourceManifest).forEach((item) => pushItem(merged, item));
    });

  (options?.sourceManifests ?? []).forEach((sourceManifest) => {
    if (configuredSourceIds.has(sourceManifest.source.id)) {
      return;
    }

    if (
      !shouldIncludeSourceManifest(sourceManifest.source, options?.workspaceId)
    ) {
      return;
    }

    if (seenSourceIds.has(sourceManifest.source.id)) {
      throw new Error(
        `Duplicate catalog source "${sourceManifest.source.id}" detected while resolving the catalog.`,
      );
    }

    seenSourceIds.add(sourceManifest.source.id);
    merged.sources.push({
      id: sourceManifest.source.id,
      label: sourceManifest.source.label,
      kind: sourceManifest.source.kind,
      sourceKind: sourceKindFromNamespace(sourceManifest.source.namespace),
      namespace: sourceManifest.source.namespace ?? "shandapha",
      enabled: sourceManifest.source.enabled,
      visibility:
        sourceManifest.source.workspaceIds.length > 0 ? "workspace" : "org",
    });
    merged.approvals.push(...sourceManifest.approvals.map((approval) => ({ ...approval })));
    createResolvedItemsFromSource(sourceManifest).forEach((item) => pushItem(merged, item));
  });

  return merged;
}

export function findCatalogItem(
  catalog: ResolvedCatalog,
  registryIdOrAlias: string,
  kind?: CatalogItemKind,
) {
  const direct = catalog.itemsById[registryIdOrAlias];

  if (direct && (!kind || direct.kind === kind)) {
    return direct;
  }

  return catalog.items.find(
    (item) =>
      (!kind || item.kind === kind) &&
      (item.aliases.includes(registryIdOrAlias) ||
        item.registryId === registryIdOrAlias),
  );
}

export function getResolvedCatalogJson(options?: {
  catalogConfigPath?: string;
  workspaceId?: string;
}) {
  return JSON.stringify(resolveRegistryCatalog(options), null, 2);
}

export function getCatalogTemplateAsset(
  catalog: ResolvedCatalog,
  registryIdOrAlias: string,
) {
  const item = findCatalogItem(catalog, registryIdOrAlias, "template");
  return item?.templateAsset;
}

export function getFirstPartyTemplateAssetBundle(slug: string) {
  return getTemplateAssetBundle(slug);
}
