import type { PlatformRoute } from "../../../server/routes";

export const entitlementsRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/entitlements/summary",
    handler: () => ({
      module: "entitlements",
      summary: "Typed feature gating for free, premium, and business tiers.",
      layers: ["domain", "application", "infrastructure", "api"],
    }),
  },
];
