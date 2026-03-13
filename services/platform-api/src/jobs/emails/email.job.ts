import { getPlatformStore } from "../../db/store";

export function listEmailJobs(workspaceId?: string) {
  const jobs = getPlatformStore().notifications.jobs;
  return workspaceId
    ? jobs.filter((job) => job.workspaceId === workspaceId)
    : jobs;
}

export function summarizeEmailJobs(workspaceId?: string) {
  const jobs = listEmailJobs(workspaceId);
  return {
    total: jobs.length,
    queued: jobs.filter((job) => job.status === "queued").length,
    completed: jobs.filter((job) => job.status === "completed").length,
  };
}
