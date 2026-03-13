import type { PlatformRoute } from "../../../server/routes";

export const workspacesRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/workspaces/summary",
    handler: () => ({
      module: "workspaces",
      summary: "Workspace lifecycle, saved themes, exports, and members.",
      layers: ["domain", "application", "infrastructure", "api"],
    }),
  },
];
