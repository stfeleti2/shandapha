export interface TelemetryEventRecord {
  id: string;
  workspaceId: string;
  event: string;
  surface: "wizard" | "workspace" | "export";
  createdAt: string;
}

export function summarizeTelemetry(events: TelemetryEventRecord[]) {
  const counts = new Map<string, number>();

  for (const event of events) {
    counts.set(event.event, (counts.get(event.event) ?? 0) + 1);
  }

  return {
    total: events.length,
    topEvents: Array.from(counts.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 3)
      .map(([event, count]) => ({ event, count })),
    lastSeenAt:
      events
        .map((event) => event.createdAt)
        .sort()
        .at(-1) ?? null,
  };
}
