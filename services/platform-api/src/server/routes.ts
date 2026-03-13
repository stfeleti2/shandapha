import { buildRegistry } from "@shandapha/registry";
import { platformMigrations } from "../db/migrations/platform-migrations";
import { platformSchema } from "../db/schema/platform-schema";
import { summarizeEmailJobs } from "../jobs/emails/email.job";
import { summarizeExportBuildJobs } from "../jobs/export-builds/export-build.job";
import { summarizeRegistrySyncJobs } from "../jobs/registry-sync/registry-sync.job";
import { auditRoutes } from "../modules/audit/api/audit.routes";
import { authRoutes } from "../modules/auth/api/auth.routes";
import { billingRoutes } from "../modules/billing/api/billing.routes";
import { entitlementsRoutes } from "../modules/entitlements/api/entitlements.routes";
import { exportsRoutes } from "../modules/exports/api/exports.routes";
import { notificationsRoutes } from "../modules/notifications/api/notifications.routes";
import { registryRoutes } from "../modules/registry/api/registry.routes";
import { telemetryRoutes } from "../modules/telemetry/api/telemetry.routes";
import { workspacesRoutes } from "../modules/workspaces/api/workspaces.routes";

export interface PlatformRouteContext {
  pathname: string;
  query: URLSearchParams;
  request: Request;
  requestId: string;
}

export interface PlatformRoute {
  method: "GET";
  path: string;
  handler: (context: PlatformRouteContext) => Promise<unknown> | unknown;
}

export function createRoutes(): PlatformRoute[] {
  const registry = buildRegistry();

  return [
    {
      method: "GET",
      path: "/health",
      handler: () => ({
        ok: true,
        service: "platform-api",
        modules: 9,
        schema: platformSchema,
        migrations: platformMigrations.map((migration) => ({
          id: migration.id,
          appliesTo: migration.appliesTo,
        })),
        jobs: {
          exports: summarizeExportBuildJobs(),
          emails: summarizeEmailJobs(),
          registrySync: summarizeRegistrySyncJobs(),
        },
      }),
    },
    {
      method: "GET",
      path: "/api/registry/catalog",
      handler: () => registry,
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
