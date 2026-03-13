import { summarizeEmailJobs } from "../../../jobs/emails/email.job";
import { PlatformHttpError } from "../../../server/middleware/errors";
import { workspacesRepository } from "../../workspaces/infrastructure/workspaces.repository";
import { summarizeNotifications } from "../domain/notifications.entity";
import { notificationsRepository } from "../infrastructure/notifications.repository";

export function getNotificationsSummary(workspaceId: string) {
  const workspace = workspacesRepository().getWorkspace(workspaceId);

  if (!workspace) {
    throw new PlatformHttpError(404, `Unknown workspace "${workspaceId}".`);
  }

  const notifications =
    notificationsRepository().listNotifications(workspaceId);

  return {
    module: "notifications",
    workspaceId,
    summary: summarizeNotifications(notifications),
    jobs: summarizeEmailJobs(workspaceId),
    notifications,
  };
}
