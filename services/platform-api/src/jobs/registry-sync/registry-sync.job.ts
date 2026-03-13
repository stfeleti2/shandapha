import { getPlatformStore } from "../../db/store";

export function listRegistrySyncJobs() {
  return getPlatformStore().registry.syncJobs;
}

export function summarizeRegistrySyncJobs() {
  const jobs = listRegistrySyncJobs();
  return {
    total: jobs.length,
    queued: jobs.filter((job) => job.status === "queued").length,
    completed: jobs.filter((job) => job.status === "completed").length,
    latestChecksum: jobs[0]?.checksum ?? null,
  };
}
