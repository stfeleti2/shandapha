export interface PlatformMigration {
  id: string;
  description: string;
  appliesTo: string[];
  sqlPreview: string;
}

export const platformMigrations: PlatformMigration[] = [
  {
    id: "2026_03_13_001_workspace_core",
    description: "Create workspace, membership, and session tables.",
    appliesTo: ["workspaces", "auth"],
    sqlPreview:
      "create table workspaces (...); create table memberships (...); create table sessions (...);",
  },
  {
    id: "2026_03_13_002_exports_audit",
    description:
      "Create export records, audit events, and notification queues.",
    appliesTo: ["exports", "audit", "notifications"],
    sqlPreview:
      "create table exports (...); create table audit_events (...); create table notifications (...);",
  },
  {
    id: "2026_03_13_003_registry_telemetry",
    description: "Track registry syncs and privacy-safe telemetry events.",
    appliesTo: ["registry", "telemetry"],
    sqlPreview:
      "create table registry_syncs (...); create table telemetry_events (...);",
  },
] as const;
