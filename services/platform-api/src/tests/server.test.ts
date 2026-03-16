import { once } from "node:events";
import { afterEach, describe, expect, it } from "vitest";
import { createServer } from "../server/app";
import type { PlatformRoute } from "../server/routes";
import { resetPlatformStore } from "../db/store";

const servers = new Set<ReturnType<typeof createServer>>();

afterEach(async () => {
  await Promise.all(
    Array.from(servers).map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => {
            if (error) {
              reject(error);
              return;
            }

            resolve();
          });
        }),
    ),
  );
  servers.clear();
});

async function listenWithRoutes(routes?: PlatformRoute[]) {
  const server = routes ? createServer(routes) : createServer();
  servers.add(server);
  server.listen(0);
  await once(server, "listening");
  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Failed to bind test server.");
  }

  return `http://127.0.0.1:${address.port}`;
}

describe("platform server", () => {
  it("matches routes by pathname when query strings are present", async () => {
    const baseUrl = await listenWithRoutes([
      {
        method: "GET",
        path: "/api/test",
        handler: ({ query }) => ({
          workspaceId: query.get("workspaceId"),
        }),
      },
    ]);

    const response = await fetch(`${baseUrl}/api/test?workspaceId=acme`);
    const payload = (await response.json()) as { workspaceId: string | null };

    expect(response.status).toBe(200);
    expect(payload.workspaceId).toBe("acme");
  });

  it("returns a structured 500 when a handler throws", async () => {
    const baseUrl = await listenWithRoutes([
      {
        method: "GET",
        path: "/api/test-error",
        handler: () => {
          throw new Error("boom");
        },
      },
    ]);

    const response = await fetch(`${baseUrl}/api/test-error`);
    const payload = (await response.json()) as {
      error: string;
      message: string;
      requestId: string;
    };

    expect(response.status).toBe(500);
    expect(payload.error).toBe("InternalServerError");
    expect(payload.message).toBe("boom");
    expect(payload.requestId).toBeTruthy();
  });

  it("serves the resolved catalog with workspace-scoped sources", async () => {
    resetPlatformStore();
    const baseUrl = await listenWithRoutes();

    const response = await fetch(
      `${baseUrl}/api/registry/catalog?workspaceId=acme`,
    );
    const payload = (await response.json()) as {
      sources: Array<{ id: string }>;
      itemsById: Record<string, { registryId: string }>;
    };

    expect(response.status).toBe(200);
    expect(payload.sources.some((source) => source.id === "acme-internal")).toBe(
      true,
    );
    expect(
      payload.itemsById["org/acme::template::workspace-review-hub"]?.registryId,
    ).toBe("org/acme::template::workspace-review-hub");
  });

  it("evaluates policies over selected registry ids through the POST endpoint", async () => {
    resetPlatformStore();
    const baseUrl = await listenWithRoutes();

    const response = await fetch(`${baseUrl}/api/policies/check`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        registryIds: ["community/demo-labs::module::release-notes"],
      }),
    });
    const payload = (await response.json()) as {
      status: string;
      findings: Array<{ code: string }>;
    };

    expect(response.status).toBe(200);
    expect(payload.status).toBe("fail");
    expect(payload.findings.some((finding) => finding.code === "community-blocked")).toBe(
      true,
    );
  });

  it("persists approval records through the registry approval endpoint", async () => {
    resetPlatformStore();
    const baseUrl = await listenWithRoutes();

    const response = await fetch(`${baseUrl}/api/registry/approvals`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "approval_demo_release_notes",
        registryId: "community/demo-labs::module::release-notes",
        sourceId: "community-demo",
        status: "approved",
        approver: "platform@acme.dev",
        scope: "workspace",
        approvedVersion: "1",
        approvedAt: "2026-03-16T12:00:00.000Z",
      }),
    });
    const payload = (await response.json()) as { id: string; status: string };

    expect(response.status).toBe(200);
    expect(payload.id).toBe("approval_demo_release_notes");
    expect(payload.status).toBe("approved");
  });
});
