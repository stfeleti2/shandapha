import type { PlatformRoute } from "../../../server/routes";

export const authRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/auth/summary",
    handler: () => ({
      module: "auth",
      summary: "Identity, session, and workspace membership handoff.",
      layers: ["domain", "application", "infrastructure", "api"],
    }),
  },
];
