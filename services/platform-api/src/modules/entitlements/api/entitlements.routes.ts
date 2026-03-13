import type { PlatformRoute } from "../../../server/routes";
import { getEntitlementsSummary } from "../application/entitlements.service";

export const entitlementsRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/entitlements/summary",
    handler: ({ query }) =>
      getEntitlementsSummary(query.get("workspaceId") ?? "acme"),
  },
];
