import { PlatformHttpError } from "../../../server/middleware/errors";
import { workspacesRepository } from "../../workspaces/infrastructure/workspaces.repository";
import { summarizeAuditEvents } from "../domain/audit.entity";
import { auditRepository } from "../infrastructure/audit.repository";

export function getAuditSummary(workspaceId: string) {
  const workspace = workspacesRepository().getWorkspace(workspaceId);

  if (!workspace) {
    throw new PlatformHttpError(404, `Unknown workspace "${workspaceId}".`);
  }

  const events = auditRepository().listEvents(workspaceId);

  return {
    module: "audit",
    workspaceId,
    summary: summarizeAuditEvents(events),
    events: events.slice(0, 5),
  };
}
