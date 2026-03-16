import { describe, expect, it } from "vitest";
import {
  loadCatalogConfig,
  resolveRegistryCatalog,
} from "../../packages/registry/client/src/index";

describe("registry contracts", () => {
  it("keeps versioned catalog and policy metadata available to browser-safe consumers", () => {
    const config = loadCatalogConfig();
    const catalog = resolveRegistryCatalog({ workspaceId: "acme" });

    expect(config.version).toBe(1);
    expect(config.policies.length).toBeGreaterThan(0);
    expect(catalog.version).toBe(1);
    expect(catalog.manifest.templates.length).toBeGreaterThan(0);
    expect(catalog.sources.some((source) => source.id === "acme-internal")).toBe(true);
  });
});
