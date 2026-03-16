import { describe, expect, it } from "vitest";
import { resolveRegistryCatalog as resolveClientCatalog } from "../../packages/registry/client/src/index";
import { resolveRegistryCatalog as resolveServerCatalog } from "../../packages/registry/server/src/index";

describe("registry client/server boundary", () => {
  it("keeps first-party catalog shape aligned across browser-safe and server-safe entrypoints", () => {
    const clientCatalog = resolveClientCatalog({ workspaceId: "acme" });
    const serverCatalog = resolveServerCatalog({ workspaceId: "acme" });

    expect(clientCatalog.manifest.packs.length).toBe(serverCatalog.manifest.packs.length);
    expect(clientCatalog.manifest.templates.length).toBe(serverCatalog.manifest.templates.length);
    expect(clientCatalog.sources.map((source) => source.id)).toEqual(
      serverCatalog.sources.map((source) => source.id),
    );
  });
});
