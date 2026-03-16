import { describe, expect, it } from "vitest";
import { getSiteCatalog, getCatalogSummary } from "./index";

describe("site catalog loader", () => {
  it("keeps workspace-private catalog items hidden from the public site catalog", () => {
    const catalog = getSiteCatalog();

    expect(catalog.sources.some((source) => source.id === "acme-internal")).toBe(
      false,
    );
    expect(
      catalog.itemsById["org/acme::template::workspace-review-hub"],
    ).toBeUndefined();
    expect(
      catalog.itemsById["community/demo-labs::module::release-notes"]?.sourceKind,
    ).toBe("community");
  });

  it("summarizes registry-backed discovery metrics from the shared catalog", () => {
    const summary = getCatalogSummary();

    expect(summary.sources).toBeGreaterThanOrEqual(2);
    expect(summary.templateGroups).toContain("saas");
  });
});
