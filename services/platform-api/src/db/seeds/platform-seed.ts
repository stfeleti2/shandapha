import {
  assertCatalogConfig,
  assertCatalogSourceManifest,
} from "@shandapha/contracts";
import rootCatalogConfig from "../../../../../shandapha.catalog.json";
import acmeInternalCatalog from "../../../../../data/seed/catalogs/acme.internal.catalog.json";
import communityDemoCatalog from "../../../../../data/seed/catalogs/community.demo.catalog.json";
import type { PlatformStore } from "../schema/platform-schema";
import { platformSchema } from "../schema/platform-schema";

export function createSeededPlatformStore(): PlatformStore {
  const catalogConfig = assertCatalogConfig(rootCatalogConfig);
  const acmeCatalog = assertCatalogSourceManifest(acmeInternalCatalog);
  const communityCatalog = assertCatalogSourceManifest(communityDemoCatalog);

  return {
    schema: platformSchema,
    auth: {
      identities: [
        {
          id: "user_promise",
          email: "promise@shandapha.dev",
          name: "Promise Feliti",
          role: "founder",
          workspaceIds: ["acme", "studio-labs"],
          defaultWorkspaceId: "acme",
          lastSignInAt: "2026-03-13T08:30:00.000Z",
        },
        {
          id: "user_ops",
          email: "ops@shandapha.dev",
          name: "Studio Ops",
          role: "operator",
          workspaceIds: ["studio-labs"],
          defaultWorkspaceId: "studio-labs",
          lastSignInAt: "2026-03-12T17:05:00.000Z",
        },
      ],
      sessions: [
        {
          id: "session_1",
          userId: "user_promise",
          workspaceId: "acme",
          deviceLabel: "MacBook Pro",
          createdAt: "2026-03-13T08:25:00.000Z",
          lastSeenAt: "2026-03-13T09:02:00.000Z",
          state: "active",
        },
        {
          id: "session_2",
          userId: "user_promise",
          workspaceId: "studio-labs",
          deviceLabel: "Safari iPad",
          createdAt: "2026-03-12T14:10:00.000Z",
          lastSeenAt: "2026-03-12T14:55:00.000Z",
          state: "active",
        },
      ],
    },
    workspaces: [
      {
        id: "acme",
        name: "Acme",
        planId: "premium",
        packId: "glass",
        savedThemeCount: 4,
        templateSlugs: ["dashboard-home", "pricing-basic", "auth/sign-in"],
        memberIds: ["user_promise"],
        apiKeyCount: 2,
        policyCount: 3,
        catalogSourceIds: ["acme-internal"],
        allowedNamespaces: ["shandapha", "org/acme"],
        policyIds: ["org-approved-assets"],
        usage: {
          starterExportsUsed: 9,
          starterExportsLimit: 25,
          themeRevisionsUsed: 14,
          themeRevisionsLimit: 20,
          patchInstallsUsed: 3,
          patchInstallsLimit: 10,
        },
        lastExportAt: "2026-03-13T08:42:00.000Z",
      },
      {
        id: "studio-labs",
        name: "Studio Labs",
        planId: "business",
        packId: "neon",
        savedThemeCount: 7,
        templateSlugs: ["dashboard-home", "docs-home", "settings-sectioned"],
        memberIds: ["user_promise", "user_ops"],
        apiKeyCount: 5,
        policyCount: 6,
        catalogSourceIds: ["acme-internal"],
        allowedNamespaces: ["shandapha", "org/acme"],
        policyIds: ["org-approved-assets", "community-review"],
        usage: {
          starterExportsUsed: 22,
          starterExportsLimit: 100,
          themeRevisionsUsed: 31,
          themeRevisionsLimit: 100,
          patchInstallsUsed: 14,
          patchInstallsLimit: 50,
        },
        lastExportAt: "2026-03-12T16:10:00.000Z",
      },
    ],
    billing: {
      invoices: [
        {
          id: "invoice_acme_open",
          workspaceId: "acme",
          planId: "premium",
          amount: 49,
          currency: "USD",
          status: "open",
          issuedAt: "2026-03-01T00:00:00.000Z",
          dueAt: "2026-04-01T00:00:00.000Z",
        },
        {
          id: "invoice_studio_paid",
          workspaceId: "studio-labs",
          planId: "business",
          amount: 299,
          currency: "USD",
          status: "paid",
          issuedAt: "2026-03-01T00:00:00.000Z",
          dueAt: "2026-03-05T00:00:00.000Z",
        },
      ],
    },
    exports: {
      records: [
        {
          id: "export_acme_patch",
          workspaceId: "acme",
          type: "patch-install",
          framework: "next-app-router",
          status: "completed",
          packId: "glass",
          templates: ["dashboard-home", "pricing-basic"],
          modules: ["datatable"],
          createdAt: "2026-03-13T08:35:00.000Z",
          updatedAt: "2026-03-13T08:42:00.000Z",
        },
        {
          id: "export_acme_theme",
          workspaceId: "acme",
          type: "theme-only",
          framework: "react-vite",
          status: "queued",
          packId: "glass",
          templates: ["auth/sign-in"],
          modules: [],
          createdAt: "2026-03-13T09:00:00.000Z",
          updatedAt: "2026-03-13T09:00:00.000Z",
        },
        {
          id: "export_studio_starter",
          workspaceId: "studio-labs",
          type: "starter-zip",
          framework: "wc-universal",
          status: "running",
          packId: "neon",
          templates: ["docs-home", "settings-sectioned"],
          modules: ["seo"],
          createdAt: "2026-03-12T15:48:00.000Z",
          updatedAt: "2026-03-12T16:10:00.000Z",
        },
      ],
      jobs: [
        {
          id: "job_export_1",
          workspaceId: "acme",
          exportId: "export_acme_theme",
          status: "queued",
          createdAt: "2026-03-13T09:00:00.000Z",
        },
        {
          id: "job_export_2",
          workspaceId: "studio-labs",
          exportId: "export_studio_starter",
          status: "running",
          createdAt: "2026-03-12T15:49:00.000Z",
        },
      ],
    },
    audit: {
      events: [
        {
          id: "audit_1",
          workspaceId: "acme",
          actor: "promise.feliti",
          action: "export.created",
          detail: "Created a patch-install plan for the dashboard starter.",
          createdAt: "2026-03-13T08:35:00.000Z",
          severity: "info",
        },
        {
          id: "audit_2",
          workspaceId: "acme",
          actor: "studio-bot",
          action: "theme.saved",
          detail: "Saved a Glass variant with compact density.",
          createdAt: "2026-03-13T08:40:00.000Z",
          severity: "info",
        },
        {
          id: "audit_3",
          workspaceId: "studio-labs",
          actor: "ops-review",
          action: "policy.reviewed",
          detail: "Retention policy needs database enforcement before launch.",
          createdAt: "2026-03-12T17:10:00.000Z",
          severity: "attention",
        },
      ],
    },
    telemetry: {
      events: [
        {
          id: "telemetry_1",
          workspaceId: "acme",
          event: "wizard.step.completed",
          surface: "wizard",
          createdAt: "2026-03-13T08:31:00.000Z",
        },
        {
          id: "telemetry_2",
          workspaceId: "acme",
          event: "export.plan.generated",
          surface: "export",
          createdAt: "2026-03-13T08:35:00.000Z",
        },
        {
          id: "telemetry_3",
          workspaceId: "studio-labs",
          event: "workspace.usage.viewed",
          surface: "workspace",
          createdAt: "2026-03-12T16:55:00.000Z",
        },
      ],
    },
    notifications: {
      items: [
        {
          id: "notification_1",
          workspaceId: "acme",
          channel: "email",
          kind: "export-ready",
          status: "queued",
          recipient: "promise@shandapha.dev",
          createdAt: "2026-03-13T09:00:00.000Z",
        },
        {
          id: "notification_2",
          workspaceId: "studio-labs",
          channel: "in-app",
          kind: "policy-review",
          status: "sent",
          recipient: "ops@shandapha.dev",
          createdAt: "2026-03-12T17:11:00.000Z",
        },
      ],
      jobs: [
        {
          id: "job_email_1",
          workspaceId: "acme",
          notificationId: "notification_1",
          status: "queued",
          createdAt: "2026-03-13T09:00:30.000Z",
        },
      ],
    },
    registry: {
      syncJobs: [
        {
          id: "registry_sync_1",
          status: "completed",
          startedAt: "2026-03-13T07:00:00.000Z",
          finishedAt: "2026-03-13T07:00:02.000Z",
          checksum: "registry-20260313-a",
        },
        {
          id: "registry_sync_2",
          status: "queued",
          startedAt: "2026-03-13T09:05:00.000Z",
          finishedAt: null,
          checksum: "registry-20260313-b",
        },
      ],
      sourceManifests: [acmeCatalog, communityCatalog],
      approvals: [...acmeCatalog.approvals],
      policies: catalogConfig.policies,
    },
  };
}
