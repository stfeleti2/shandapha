import type {
  CatalogApproval,
  CatalogSourceManifest,
  PolicyCheckResult,
  ResolvedCatalog,
  ResolvedCatalogItem,
} from "@shandapha/contracts";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(payload?.message ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function withQuery(
  baseUrl: string,
  path: string,
  query?: Record<string, string | string[] | undefined>,
) {
  const url = new URL(path, baseUrl);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => url.searchParams.append(key, entry));
      return;
    }

    url.searchParams.set(key, value);
  });

  return url.toString();
}

export const studioClient = (baseUrl: string) => ({
  workspaces: () =>
    request(withQuery(baseUrl, "/api/workspaces/summary")) as Promise<unknown>,
});

export const registryClient = (baseUrl: string) => ({
  catalog: (options?: { workspaceId?: string }) =>
    request<ResolvedCatalog>(
      withQuery(baseUrl, "/api/registry/catalog", {
        workspaceId: options?.workspaceId,
      }),
    ),
  item: (registryId: string, options?: { workspaceId?: string }) =>
    request<ResolvedCatalogItem>(
      withQuery(baseUrl, "/api/registry/item", {
        registryId,
        workspaceId: options?.workspaceId,
      }),
    ),
  sources: () =>
    request<
      Array<{
        id: string;
        label: string;
        namespace?: string;
        kind: string;
        approvals: number;
        items: number;
      }>
    >(withQuery(baseUrl, "/api/registry/sources")),
  addSource: (manifest: CatalogSourceManifest) =>
    request<CatalogSourceManifest>(withQuery(baseUrl, "/api/registry/sources"), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(manifest),
    }),
  addApproval: (approval: CatalogApproval) =>
    request<CatalogApproval>(
      withQuery(baseUrl, "/api/registry/approvals"),
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(approval),
      },
    ),
});

export const policyClient = (baseUrl: string) => ({
  check: (input?: { workspaceId?: string; registryIds?: string[] }) =>
    request<PolicyCheckResult>(withQuery(baseUrl, "/api/policies/check"), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(input ?? {}),
    }),
});

export const billingClient = (baseUrl: string) => ({
  plans: () => request(withQuery(baseUrl, "/api/billing/summary")) as Promise<unknown>,
});
