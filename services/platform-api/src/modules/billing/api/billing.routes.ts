import type { PlatformRoute } from "../../../server/routes";

export const billingRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/billing/summary",
    handler: () => ({
      module: "billing",
      summary:
        "Pricing, subscriptions, invoices, and founder-friendly upgrade moments.",
      layers: ["domain", "application", "infrastructure", "api"],
    }),
  },
];
