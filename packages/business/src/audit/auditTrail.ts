export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  scope: string;
  detail: string;
  createdAt: string;
}

export function createAuditEntry(
  input: Omit<AuditEntry, "id" | "createdAt"> & {
    createdAt?: string;
  },
): AuditEntry {
  return {
    id: `${input.scope}:${input.action}:${input.actor}`
      .toLowerCase()
      .replace(/[^a-z0-9:]+/g, "-"),
    actor: input.actor,
    action: input.action,
    scope: input.scope,
    detail: input.detail,
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

export function createAuditTimeline(entries: AuditEntry[]) {
  return [...entries].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function summarizeAuditTrail(entries: AuditEntry[]) {
  const timeline = createAuditTimeline(entries);

  return {
    total: timeline.length,
    latest: timeline[0] ?? null,
    actors: Array.from(new Set(timeline.map((entry) => entry.actor))),
    scopes: Array.from(new Set(timeline.map((entry) => entry.scope))),
  };
}

export function exportAuditTrailMarkdown(entries: AuditEntry[]) {
  const timeline = createAuditTimeline(entries);
  return timeline
    .map(
      (entry) =>
        `- ${entry.createdAt} | ${entry.actor} | ${entry.action} | ${entry.scope} | ${entry.detail}`,
    )
    .join("\n");
}
