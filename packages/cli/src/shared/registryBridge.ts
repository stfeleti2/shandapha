import {
  findCatalogItem,
  loadCatalogConfig,
  resolveRegistryCatalog,
} from "@shandapha/registry";

export type RegistryKind = "pack" | "template" | "module";
type CatalogSnapshot = ReturnType<typeof resolveRegistryCatalog>;

export interface RegistryBridgeOptions {
  catalogConfigPath?: string;
  workspaceId?: string;
}

function loadCatalog(options?: RegistryBridgeOptions) {
  return resolveRegistryCatalog({
    catalogConfigPath: options?.catalogConfigPath,
    workspaceId: options?.workspaceId,
  });
}

function listKindItems(kind: RegistryKind, catalog: CatalogSnapshot) {
  return catalog.items.filter((item) => item.kind === kind);
}

export function registryBridge(defaultOptions: RegistryBridgeOptions = {}) {
  return {
    catalog(options?: RegistryBridgeOptions) {
      return loadCatalog({
        ...defaultOptions,
        ...options,
      });
    },
    list(kind: RegistryKind, options?: RegistryBridgeOptions) {
      return listKindItems(kind, this.catalog(options)).map(
        (item) => item.registryId,
      );
    },
    find(kind: RegistryKind, slugOrRegistryId: string, options?: RegistryBridgeOptions) {
      return findCatalogItem(
        this.catalog(options),
        slugOrRegistryId,
        kind,
      );
    },
    describe(options?: RegistryBridgeOptions) {
      const catalog = this.catalog(options);

      return {
        packs: catalog.items.filter((item) => item.kind === "pack").length,
        templates: catalog.items.filter((item) => item.kind === "template")
          .length,
        modules: catalog.items.filter((item) => item.kind === "module").length,
        sources: catalog.sources.length,
        warnings: catalog.warnings.length,
      };
    },
    validateConfig(options?: RegistryBridgeOptions) {
      const config = loadCatalogConfig(options?.catalogConfigPath);
      const catalog = this.catalog(options);

      return {
        config,
        catalog,
      };
    },
  };
}
