import type {
  CatalogApproval,
  CatalogSourceManifest,
} from "@shandapha/contracts";
import type { PlatformRoute } from "../../../server/routes";
import {
  addRegistrySource,
  checkPolicies,
  getRegistryCatalog,
  getRegistryItem,
  getRegistrySummary,
  listRegistrySources,
  saveRegistryApproval,
} from "../application/registry.service";

export const registryRoutes: PlatformRoute[] = [
  {
    method: "GET",
    path: "/api/registry/catalog",
    handler: ({ query }) =>
      getRegistryCatalog(query.get("workspaceId") ?? undefined),
  },
  {
    method: "GET",
    path: "/api/registry/summary",
    handler: ({ query }) => getRegistrySummary(query.get("workspaceId") ?? undefined),
  },
  {
    method: "GET",
    path: "/api/registry/item",
    handler: ({ query }) =>
      getRegistryItem(
        query.get("registryId") ?? "",
        query.get("workspaceId") ?? undefined,
      ),
  },
  {
    method: "GET",
    path: "/api/registry/sources",
    handler: () => listRegistrySources(),
  },
  {
    method: "POST",
    path: "/api/registry/sources",
    handler: ({ body }) => addRegistrySource(body as CatalogSourceManifest),
  },
  {
    method: "POST",
    path: "/api/registry/approvals",
    handler: ({ body }) => saveRegistryApproval(body as CatalogApproval),
  },
  {
    method: "GET",
    path: "/api/policies/check",
    handler: ({ query }) =>
      checkPolicies({
        workspaceId: query.get("workspaceId") ?? undefined,
        registryIds: query.getAll("registryId"),
      }),
  },
  {
    method: "POST",
    path: "/api/policies/check",
    handler: ({ body }) =>
      checkPolicies({
        workspaceId:
          typeof body === "object" &&
          body !== null &&
          "workspaceId" in body &&
          typeof body.workspaceId === "string"
            ? body.workspaceId
            : undefined,
        registryIds:
          typeof body === "object" &&
          body !== null &&
          "registryIds" in body &&
          Array.isArray(body.registryIds)
            ? body.registryIds.filter(
                (value): value is string => typeof value === "string",
              )
            : undefined,
      }),
  },
];
