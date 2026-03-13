import { describe, expect, it } from "vitest";
import { createRoutes } from "../server/routes";

describe("platform routes", () => {
  it("includes health and registry routes", () => {
    const routes = createRoutes();
    expect(routes.some((route) => route.path === "/health")).toBe(true);
    expect(routes.some((route) => route.path === "/api/registry/catalog")).toBe(
      true,
    );
  });
});
