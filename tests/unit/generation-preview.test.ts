import { describe, expect, it } from "vitest";
import { createGenerationPreview } from "../../packages/generator/manifests/src/index";

describe("generation preview", () => {
  it("builds a deterministic browser-safe preview for the wizard", () => {
    const preview = createGenerationPreview({
      version: 1,
      framework: "next-app-router",
      intent: "existing-project",
      packId: "glass",
      planId: "premium",
      templates: ["dashboard-home", "billing-plans-starter"],
      modules: ["datatable"],
    });

    expect(preview.selectedPack.id).toBe("glass");
    expect(preview.selectedTemplates).toHaveLength(2);
    expect(preview.selectedModules[0]?.id).toBe("datatable");
    expect(preview.doctorChecks.some((check) => check.id === "theme-loaded")).toBe(true);
  });
});
