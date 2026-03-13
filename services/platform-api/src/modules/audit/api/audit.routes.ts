import type { PlatformRoute } from "../../../server/routes";
import { getAuditSummary } from "../application/audit.service";

export const auditRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/audit/summary",
    handler: ({ query }) => getAuditSummary(query.get("workspaceId") ?? "acme"),
  },
];
