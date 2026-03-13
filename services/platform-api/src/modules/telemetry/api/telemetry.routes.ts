import type { PlatformRoute } from "../../../server/routes";

export const telemetryRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/telemetry/summary",
    handler: () => ({
      module: "telemetry",
      summary: "Privacy-safe usage and doctor telemetry.",
      layers: ["domain", "application", "infrastructure", "api"],
    }),
  },
];
