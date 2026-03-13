import { describe, expect, it } from "vitest";
import { buildRegistry } from "./index";

describe("registry", () => {
  it("builds pack and template data", () => {
    const registry = buildRegistry();
    expect(registry.packs.length).toBeGreaterThanOrEqual(3);
    expect(registry.templates.length).toBeGreaterThan(0);
  });
});
