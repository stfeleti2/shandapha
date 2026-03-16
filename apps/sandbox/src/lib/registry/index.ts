import { resolveRegistryCatalog } from "@shandapha/registry";

export async function loadSiteCatalog(options?: {
  apiBaseUrl?: string;
  workspaceId?: string;
}) {
  if (options?.apiBaseUrl) {
    try {
      const url = new URL("/api/registry/catalog", options.apiBaseUrl);

      if (options.workspaceId) {
        url.searchParams.set("workspaceId", options.workspaceId);
      }

      const response = await fetch(url.toString(), {
        cache: "no-store",
      });

      if (response.ok) {
        return response.json();
      }
    } catch {
      // Fall back to the local-first catalog below.
    }
  }

  return resolveRegistryCatalog();
}

export function getSiteCatalog() {
  return resolveRegistryCatalog();
}

export function getCatalogSummary() {
  const catalog = getSiteCatalog();
  const registry = catalog.manifest;

  return {
    templateGroups: Array.from(
      new Set(registry.templates.map((template) => template.group)),
    ),
    premiumPacks: registry.packs
      .filter((pack) => pack.tier !== "free")
      .map((pack) => pack.slug),
    heavyModules: registry.modules
      .filter((module) => module.minimumPlan !== "free")
      .map((module) => module.registryId),
    sources: catalog.sources.length,
  };
}
