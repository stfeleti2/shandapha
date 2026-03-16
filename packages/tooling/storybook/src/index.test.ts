import { describe, expect, it } from "vitest";
import { createStorybookSummary, storyGroups } from "./index";

describe("storybook catalog", () => {
  it("tracks non-empty coverage groups", () => {
    const summary = createStorybookSummary();
    expect(summary.groups).toBeGreaterThan(0);
    expect(summary.components).toBeGreaterThan(0);
    expect(storyGroups.every((group) => group.stories.length > 0)).toBe(true);
  });
});
