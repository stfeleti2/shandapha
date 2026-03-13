import { once } from "node:events";
import { afterEach, describe, expect, it } from "vitest";
import { createServer } from "../server/app";
import type { PlatformRoute } from "../server/routes";

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

async function listenWithRoutes(routes: PlatformRoute[]) {
  const server = createServer(routes);
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
});
