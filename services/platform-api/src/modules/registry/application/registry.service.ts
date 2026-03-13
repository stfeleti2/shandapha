import { summarizeRegistrySyncJobs } from "../../../jobs/registry-sync/registry-sync.job";
import { summarizeRegistryCounts } from "../domain/registry.entity";
import { registryRepository } from "../infrastructure/registry.repository";

export function getRegistrySummary() {
  const repository = registryRepository();
  const registry = repository.getRegistry();

  return {
    module: "registry",
    counts: summarizeRegistryCounts({
      packs: registry.packs.length,
      templates: registry.templates.length,
      modules: registry.modules.length,
    }),
    modules: registry.modules.map((manifest) => ({
      id: manifest.id,
      packageName: manifest.packageName,
      premium: manifest.premium,
    })),
    jobs: summarizeRegistrySyncJobs(),
  };
}
