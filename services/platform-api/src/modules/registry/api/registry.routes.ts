import type { PlatformRoute } from "../../../server/routes";
import { getRegistrySummary } from "../application/registry.service";

export const registryRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/registry/summary",
    handler: () => getRegistrySummary(),
  },
];
