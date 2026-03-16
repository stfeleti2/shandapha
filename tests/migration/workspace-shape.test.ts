import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("workspace migration shape", () => {
  it("creates the new product surfaces", () => {
    expect(existsSync("apps/website/package.json")).toBe(true);
    expect(existsSync("apps/docs/package.json")).toBe(true);
    expect(existsSync("apps/wizard/package.json")).toBe(true);
    expect(existsSync("apps/control-plane/package.json")).toBe(true);
    expect(existsSync("apps/sandbox/package.json")).toBe(true);
  });

  it("creates the split registry and generator boundaries", () => {
    expect(existsSync("packages/registry/client/package.json")).toBe(true);
    expect(existsSync("packages/registry/server/package.json")).toBe(true);
    expect(existsSync("packages/generator/core/package.json")).toBe(true);
    expect(existsSync("packages/generator/manifests/package.json")).toBe(true);
  });
});
