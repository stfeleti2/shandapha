export const telemetryStrategy = "privacy-safe";

export const studioTelemetryEvents = {
  wizardStarted: "studio.wizard.started",
  exportPlanned: "studio.export.planned",
  workspaceViewed: "studio.workspace.viewed",
  billingViewed: "studio.billing.viewed",
} as const;

export type StudioTelemetryEvent =
  (typeof studioTelemetryEvents)[keyof typeof studioTelemetryEvents];

export function createStudioTelemetryPayload(
  event: StudioTelemetryEvent,
  context: Record<string, string | number | boolean>,
) {
  return {
    event,
    context,
    strategy: telemetryStrategy,
    timestamp: new Date().toISOString(),
  };
}
