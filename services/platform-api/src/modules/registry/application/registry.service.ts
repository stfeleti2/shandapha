import {
  assertCatalogApproval,
  assertCatalogSourceManifest,
  type CatalogApproval,
  type CatalogSourceManifest,
} from "@shandapha/contracts";
import { evaluateCatalogPolicies } from "@shandapha/registry";
import { summarizeRegistrySyncJobs } from "../../../jobs/registry-sync/registry-sync.job";
import { PlatformHttpError } from "../../../server/middleware/errors";
import { summarizeRegistryCounts } from "../domain/registry.entity";
import { registryRepository } from "../infrastructure/registry.repository";

export function getRegistrySummary(workspaceId?: string) {
  const repository = registryRepository();
  const catalog = repository.getCatalog(workspaceId);

  return {
    module: "registry",
    counts: summarizeRegistryCounts({
      packs: catalog.manifest.packs.length,
      templates: catalog.manifest.templates.length,
      modules: catalog.manifest.modules.length,
    }),
    sources: catalog.sources,
    warnings: catalog.warnings,
    modules: catalog.manifest.modules.map((manifest) => ({
      registryId: manifest.registryId,
      id: manifest.id,
      packageName: manifest.packageName,
      premium: manifest.premium,
      sourceKind: manifest.sourceKind,
      supportLevel: manifest.supportLevel,
    })),
    jobs: summarizeRegistrySyncJobs(),
  };
}

export function getRegistryCatalog(workspaceId?: string) {
  return registryRepository().getCatalog(workspaceId);
}

export function getRegistryItem(registryId: string, workspaceId?: string) {
  const catalog = registryRepository().getCatalog(workspaceId);
  const item = catalog.itemsById[registryId];

  if (!item) {
    throw new PlatformHttpError(404, `Unknown registry item "${registryId}".`);
  }

  return item;
}

export function listRegistrySources() {
  return registryRepository().listSources().map((sourceManifest) => ({
    id: sourceManifest.source.id,
    label: sourceManifest.source.label,
    namespace: sourceManifest.source.namespace,
    kind: sourceManifest.source.kind,
    approvals: sourceManifest.approvals.length,
    items:
      sourceManifest.packs.length +
      sourceManifest.templates.length +
      sourceManifest.modules.length +
      sourceManifest.components.length +
      sourceManifest.blocks.length +
      sourceManifest.charts.length +
      sourceManifest.shells.length,
  }));
}

export function addRegistrySource(sourceManifest: CatalogSourceManifest) {
  return registryRepository().addSourceManifest(
    assertCatalogSourceManifest(sourceManifest),
  );
}

export function saveRegistryApproval(approval: CatalogApproval) {
  return registryRepository().saveApproval(assertCatalogApproval(approval));
}

export function checkPolicies(input: {
  registryIds?: string[];
  workspaceId?: string;
}) {
  const repository = registryRepository();
  const catalog = repository.getCatalog(input.workspaceId);
  const policies = repository.listPolicies();

  return evaluateCatalogPolicies({
    catalog,
    policies,
    selectedRegistryIds:
      input.registryIds && input.registryIds.length > 0
        ? input.registryIds
        : undefined,
  });
}
