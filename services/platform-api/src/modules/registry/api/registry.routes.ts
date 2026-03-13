import type { PlatformRoute } from "../../../server/routes";

export const registryRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/registry/summary",
    handler: () => ({
      module: "registry",
      summary: "Templates, packs, and modules for web, studio, CLI, and docs.",
      layers: ["domain", "application", "infrastructure", "api"],
    }),
  },
];
