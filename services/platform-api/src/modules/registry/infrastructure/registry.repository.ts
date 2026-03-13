import { buildRegistry } from "@shandapha/registry";
import { getPlatformStore } from "../../../db/store";

export function registryRepository() {
  const store = getPlatformStore();
  const registry = buildRegistry();

  return {
    getRegistry() {
      return registry;
    },
    listSyncJobs() {
      return store.registry.syncJobs;
    },
  };
}
