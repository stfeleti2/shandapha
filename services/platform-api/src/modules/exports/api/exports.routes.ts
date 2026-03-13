import type { PlatformRoute } from "../../../server/routes";

export const exportsRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/exports/summary",
    handler: () => ({
      module: "exports",
      summary:
        "Starter zip, patch install, theme-only output, and uninstall manifests.",
      layers: ["domain", "application", "infrastructure", "api"],
    }),
  },
];
