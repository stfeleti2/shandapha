import { resolveRegistryCatalog } from "@shandapha/registry";

export async function loadStudioCatalog(options?: {
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
      // Studio falls back to the local-first catalog when the API is absent.
    }
  }

  return resolveRegistryCatalog({
    workspaceId: options?.workspaceId,
  });
}

export function getStudioCatalog(workspaceId = "acme") {
  return resolveRegistryCatalog({
    workspaceId,
  });
}

export function getStudioRegistrySummary(workspaceId = "acme") {
  const catalog = getStudioCatalog(workspaceId);
  const registry = catalog.manifest;

  return {
    packs: registry.packs.map((pack) => ({
      id: pack.id,
      registryId: pack.registryId,
      name: pack.name,
      tier: pack.tier,
    })),
    templates: registry.templates.map((template) => ({
      slug: template.slug,
      registryId: template.registryId,
      name: template.name,
      group: template.group,
      supportLevel: template.supportLevel,
    })),
    modules: registry.modules.map((module) => ({
      id: module.id,
      registryId: module.registryId,
      name: module.name,
      minimumPlan: module.minimumPlan,
      supportLevel: module.supportLevel,
    })),
    sources: catalog.sources,
  };
}
