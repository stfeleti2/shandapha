import type { PlatformRoute } from "../../../server/routes";

export const notificationsRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/notifications/summary",
    handler: () => ({
      module: "notifications",
      summary: "Email, product notifications, and async export status.",
      layers: ["domain", "application", "infrastructure", "api"],
    }),
  },
];
