import { resolveEntitlements } from "@shandapha/entitlements";
import { createGenerationPlan } from "@shandapha/generator";
import { buildRegistry } from "@shandapha/registry";
import { auditRoutes } from "../modules/audit/api/audit.routes";
import { authRoutes } from "../modules/auth/api/auth.routes";
import { billingRoutes } from "../modules/billing/api/billing.routes";
import { entitlementsRoutes } from "../modules/entitlements/api/entitlements.routes";
import { exportsRoutes } from "../modules/exports/api/exports.routes";
import { notificationsRoutes } from "../modules/notifications/api/notifications.routes";
import { registryRoutes } from "../modules/registry/api/registry.routes";
import { telemetryRoutes } from "../modules/telemetry/api/telemetry.routes";
import { workspacesRoutes } from "../modules/workspaces/api/workspaces.routes";

export interface PlatformRoute {
  method: "GET";
  path: string;
  handler: () => Promise<unknown> | unknown;
}

export function createRoutes(): PlatformRoute[] {
  return [
    {
      method: "GET",
      path: "/health",
      handler: () => ({ ok: true, service: "platform-api", modules: 9 }),
    },
    {
      method: "GET",
      path: "/api/registry/catalog",
      handler: () => buildRegistry(),
    },
    {
      method: "GET",
      path: "/api/exports/plan",
      handler: () =>
        createGenerationPlan({
          framework: "next-app-router",
          intent: "existing-project",
          packId: "normal",
          planId: "premium",
          templates: ["dashboard-home", "pricing-basic"],
          modules: ["datatable"],
        }),
    },
    {
      method: "GET",
      path: "/api/billing/plans",
      handler: () => resolveEntitlements("premium"),
    },
    ...authRoutes,
    ...workspacesRoutes,
    ...billingRoutes,
    ...entitlementsRoutes,
    ...registryRoutes,
    ...exportsRoutes,
    ...auditRoutes,
    ...telemetryRoutes,
    ...notificationsRoutes,
  ];
}
