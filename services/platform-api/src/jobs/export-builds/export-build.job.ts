import { getPlatformStore } from "../../db/store";

export function listExportBuildJobs(workspaceId?: string) {
  const jobs = getPlatformStore().exports.jobs;
  return workspaceId
    ? jobs.filter((job) => job.workspaceId === workspaceId)
    : jobs;
}

export function summarizeExportBuildJobs(workspaceId?: string) {
  const jobs = listExportBuildJobs(workspaceId);
  return {
    total: jobs.length,
    queued: jobs.filter((job) => job.status === "queued").length,
    running: jobs.filter((job) => job.status === "running").length,
    completed: jobs.filter((job) => job.status === "completed").length,
  };
}
