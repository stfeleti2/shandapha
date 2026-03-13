export interface RegistrySyncStatus {
  id: string;
  status: "queued" | "completed";
  startedAt: string;
  finishedAt: string | null;
  checksum: string;
}

export function summarizeRegistryCounts(counts: {
  packs: number;
  templates: number;
  modules: number;
}) {
  return {
    totalAssets: counts.packs + counts.templates + counts.modules,
    ...counts,
  };
}
