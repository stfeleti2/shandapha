import type {
  CatalogApproval,
  CatalogPolicy,
  CatalogSourceManifest,
  PackId,
  PlanId,
} from "@shandapha/contracts";
import type { AuditEventRecord } from "../../modules/audit/domain/audit.entity";
import type {
  AuthIdentity,
  AuthSession,
} from "../../modules/auth/domain/auth.entity";
import type { InvoiceRecord } from "../../modules/billing/domain/billing.entity";
import type { ExportRecord } from "../../modules/exports/domain/exports.entity";
import type { NotificationRecord } from "../../modules/notifications/domain/notifications.entity";
import type { RegistrySyncStatus } from "../../modules/registry/domain/registry.entity";
import type { TelemetryEventRecord } from "../../modules/telemetry/domain/telemetry.entity";
import type { WorkspaceRecord } from "../../modules/workspaces/domain/workspaces.entity";

export interface ExportBuildJob {
  id: string;
  workspaceId: string;
  exportId: string;
  status: "queued" | "running" | "completed";
  createdAt: string;
}

export interface EmailJob {
  id: string;
  workspaceId: string;
  notificationId: string;
  status: "queued" | "completed";
  createdAt: string;
}

export interface PlatformStore {
  schema: {
    version: string;
    engine: "in-memory";
    supportedPlans: readonly PlanId[];
    supportedPacks: readonly PackId[];
  };
  auth: {
    identities: AuthIdentity[];
    sessions: AuthSession[];
  };
  workspaces: WorkspaceRecord[];
  billing: {
    invoices: InvoiceRecord[];
  };
  exports: {
    records: ExportRecord[];
    jobs: ExportBuildJob[];
  };
  audit: {
    events: AuditEventRecord[];
  };
  telemetry: {
    events: TelemetryEventRecord[];
  };
  notifications: {
    items: NotificationRecord[];
    jobs: EmailJob[];
  };
  registry: {
    syncJobs: RegistrySyncStatus[];
    sourceManifests: CatalogSourceManifest[];
    approvals: CatalogApproval[];
    policies: CatalogPolicy[];
  };
}

export const platformSchema = {
  version: "2026.03.13",
  engine: "in-memory",
  supportedPlans: ["free", "premium", "business"],
  supportedPacks: ["normal", "glass", "neon"],
} as const;
