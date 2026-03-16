import { afterEach, describe, expect, it, vi } from "vitest";
import { policyClient, registryClient } from "./index";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("sdk", () => {
  it("requests the registry catalog with workspace query params", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ version: 1, sources: [], items: [] }), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      }),
    );
    globalThis.fetch = fetchMock as typeof fetch;

    await registryClient("https://platform.example.test").catalog({
      workspaceId: "acme",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://platform.example.test/api/registry/catalog?workspaceId=acme",
      undefined,
    );
  });

  it("posts policy checks with typed registry id payloads", async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) =>
      new Response(
        JSON.stringify({
          status: "fail",
          findings: [],
          checkedRegistryIds: [],
          policyIds: [],
          mode: "enforce",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );
    globalThis.fetch = fetchMock as typeof fetch;

    await policyClient("https://platform.example.test").check({
      workspaceId: "acme",
      registryIds: ["community/demo-labs::module::release-notes"],
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "https://platform.example.test/api/policies/check",
    );
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
    expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(
      JSON.stringify({
        workspaceId: "acme",
        registryIds: ["community/demo-labs::module::release-notes"],
      }),
    );
  });
});
