import type { PlatformRoute } from "../../../server/routes";

export const auditRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/audit/summary",
    handler: () => ({
      module: "audit",
      summary: "Audit timelines, policy surfaces, and retention seams.",
      layers: ["domain", "application", "infrastructure", "api"],
    }),
  },
];
