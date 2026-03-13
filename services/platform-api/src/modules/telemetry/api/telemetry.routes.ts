import type { PlatformRoute } from "../../../server/routes";
import { getTelemetrySummary } from "../application/telemetry.service";

export const telemetryRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/telemetry/summary",
    handler: ({ query }) =>
      getTelemetrySummary(query.get("workspaceId") ?? "acme"),
  },
];
