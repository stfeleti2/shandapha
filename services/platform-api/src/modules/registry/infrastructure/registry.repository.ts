import type {
  CatalogApproval,
  CatalogPolicy,
  CatalogSourceManifest,
} from "@shandapha/contracts";
import { resolveRegistryCatalog } from "@shandapha/registry-server";
import { getPlatformStore } from "../../../db/store";

export function registryRepository() {
  const store = getPlatformStore();

  return {
    getCatalog(workspaceId?: string) {
      return resolveRegistryCatalog({
        workspaceId,
        sourceManifests: store.registry.sourceManifests,
      });
    },
    listSources() {
      return store.registry.sourceManifests;
    },
    addSourceManifest(sourceManifest: CatalogSourceManifest) {
      store.registry.sourceManifests = [
        ...store.registry.sourceManifests.filter(
          (entry) => entry.source.id !== sourceManifest.source.id,
        ),
        sourceManifest,
      ];
      return sourceManifest;
    },
    listApprovals() {
      return store.registry.approvals;
    },
    saveApproval(approval: CatalogApproval) {
      store.registry.approvals = [
        ...store.registry.approvals.filter((entry) => entry.id !== approval.id),
        approval,
      ];
      return approval;
    },
    listPolicies() {
      return store.registry.policies;
    },
    savePolicies(policies: CatalogPolicy[]) {
      store.registry.policies = policies;
      return store.registry.policies;
    },
    listSyncJobs() {
      return store.registry.syncJobs;
    },
  };
}
