export interface AuditEventRecord {
  id: string;
  workspaceId: string;
  actor: string;
  action: string;
  detail: string;
  createdAt: string;
  severity: "info" | "attention";
}

export function summarizeAuditEvents(events: AuditEventRecord[]) {
  return {
    total: events.length,
    latest: events[0] ?? null,
    attention: events.filter((event) => event.severity === "attention").length,
  };
}
