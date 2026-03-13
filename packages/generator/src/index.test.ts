import { describe, expect, it } from "vitest";
import { createGenerationPlan } from "./index";

describe("generator", () => {
  it("creates a reversible plan", () => {
    const plan = createGenerationPlan({
      framework: "next-app-router",
      intent: "existing-project",
      packId: "normal",
      planId: "free",
      templates: ["dashboard-home"],
      modules: [],
    });
    expect(plan.uninstallManifest.length).toBeGreaterThan(0);
  });
});
