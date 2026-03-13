import type { PlatformRoute } from "../../../server/routes";
import {
  getExportPlanPreview,
  getExportsSummary,
} from "../application/exports.service";

export const exportsRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/exports/summary",
    handler: ({ query }) =>
      getExportsSummary(query.get("workspaceId") ?? "acme"),
  },
  {
    method: "GET",
    path: "/api/exports/plan",
    handler: () => getExportPlanPreview(),
  },
];
