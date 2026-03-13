import { PlatformHttpError } from "../../../server/middleware/errors";
import { workspacesRepository } from "../../workspaces/infrastructure/workspaces.repository";
import { summarizeTelemetry } from "../domain/telemetry.entity";
import { telemetryRepository } from "../infrastructure/telemetry.repository";

export function getTelemetrySummary(workspaceId: string) {
  const workspace = workspacesRepository().getWorkspace(workspaceId);

  if (!workspace) {
    throw new PlatformHttpError(404, `Unknown workspace "${workspaceId}".`);
  }

  const events = telemetryRepository().listEvents(workspaceId);

  return {
    module: "telemetry",
    workspaceId,
    summary: summarizeTelemetry(events),
    events: events.slice(-5),
  };
}
