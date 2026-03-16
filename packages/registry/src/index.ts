import { getPackBySlug } from "@shandapha/packs";
import {
  getTemplateAssetBundle,
  getTemplateBySlug,
  listTemplateAssetBundles,
} from "@shandapha/templates";

export {
  buildRegistry,
  DEFAULT_CATALOG_CONFIG_PATH,
  findCatalogItem,
  getCatalogTemplateAsset,
  getFirstPartyTemplateAssetBundle,
  getResolvedCatalogJson,
  loadCatalogConfig,
  resolveRegistryCatalog,
} from "./catalog";

export {
  getPackBySlug,
  getTemplateAssetBundle,
  getTemplateBySlug,
  listTemplateAssetBundles,
};

export { evaluateCatalogPolicies, groupApprovalsByRegistryId } from "./policy";

export type { TemplateAssetBundle } from "@shandapha/templates";
