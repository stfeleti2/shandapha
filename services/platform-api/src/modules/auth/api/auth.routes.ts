import type { PlatformRoute } from "../../../server/routes";
import { getAuthSummary } from "../application/auth.service";

export const authRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/auth/summary",
    handler: ({ query }) =>
      getAuthSummary(query.get("workspaceId") ?? undefined),
  },
  {
    method: "GET",
    path: "/api/auth/sessions",
    handler: ({ query }) => {
      const summary = getAuthSummary(query.get("workspaceId") ?? undefined);
      return summary.recentSessions;
    },
  },
];
