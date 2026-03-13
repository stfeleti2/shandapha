import type { PlatformRoute } from "../../../server/routes";
import { getNotificationsSummary } from "../application/notifications.service";

export const notificationsRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/notifications/summary",
    handler: ({ query }) =>
      getNotificationsSummary(query.get("workspaceId") ?? "acme"),
  },
];
