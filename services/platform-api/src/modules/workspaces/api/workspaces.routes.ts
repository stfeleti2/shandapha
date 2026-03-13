import type { PlatformRoute } from "../../../server/routes";
import {
  getWorkspaceDetail,
  getWorkspacesSummary,
} from "../application/workspaces.service";

export const workspacesRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/workspaces/summary",
    handler: () => getWorkspacesSummary(),
  },
  {
    method: "GET",
    path: "/api/workspaces/detail",
    handler: ({ query }) =>
      getWorkspaceDetail(query.get("workspaceId") ?? "acme"),
  },
];
