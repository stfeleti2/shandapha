import type { PlatformRoute } from "../../../server/routes";
import { getBillingSummary } from "../application/billing.service";

export const billingRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/billing/summary",
    handler: ({ query }) =>
      getBillingSummary(query.get("workspaceId") ?? "acme"),
  },
];
