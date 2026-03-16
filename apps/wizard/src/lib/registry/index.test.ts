import { describe, expect, it } from "vitest";
import { getStudioCatalog, getStudioRegistrySummary } from "./index";

describe("studio catalog loader", () => {
  it("exposes workspace-scoped internal assets in the operator surface", () => {
    const catalog = getStudioCatalog("acme");

    expect(catalog.sources.some((source) => source.id === "acme-internal")).toBe(
      true,
    );
    expect(
      catalog.itemsById["org/acme::template::workspace-review-hub"]?.supportLevel,
    ).toBe("internal");
  });

  it("summarizes registry data from the shared resolved catalog", () => {
    const summary = getStudioRegistrySummary("acme");

    expect(summary.sources.length).toBeGreaterThanOrEqual(3);
    expect(
      summary.templates.some(
        (template) => template.registryId === "org/acme::template::workspace-review-hub",
      ),
    ).toBe(true);
  });
});
