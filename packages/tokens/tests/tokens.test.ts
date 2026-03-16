import { describe, expect, it } from "vitest";
import { createTokenSet, defaultBrandKit, toCssVariables } from "../src/index";

describe("tokens", () => {
  it("creates semantic tokens", () => {
    const tokens = createTokenSet();
    expect(tokens.light.primary).toBeTruthy();
    expect(tokens.dark.background).toBeTruthy();
  });

  it("matches the neutral shared baseline by default", () => {
    const tokens = createTokenSet();

    expect(defaultBrandKit.primary).toBe("#18181b");
    expect(defaultBrandKit.accent).toBe("#52525b");
    expect(defaultBrandKit.radius).toBe("0.625rem");

    expect(tokens.light.background).toBe("oklch(1 0 0)");
    expect(tokens.light.primary).toBe("oklch(0.205 0 0)");
    expect(tokens.light.accent).toBe("oklch(0.97 0 0)");
    expect(tokens.dark.background).toBe("oklch(0.145 0 0)");
    expect(tokens.dark.primary).toBe("oklch(0.922 0 0)");
    expect(tokens.dark.accent).toBe("oklch(0.371 0 0)");
    expect(tokens.light.chart2).toBe("#3b82f6");
    expect(tokens.radius.lg).toBe("0.625rem");
    expect(tokens.radius.md).toBe("calc(0.625rem * 0.8)");
  });

  it("exports css variables for the semantic runtime", () => {
    const vars = toCssVariables(createTokenSet());

    expect(vars["--sh-background-light"]).toBe("oklch(1 0 0)");
    expect(vars["--sh-primary-dark"]).toBe("oklch(0.922 0 0)");
    expect(vars["--sh-chart-3-light"]).toBe("#2563eb");
    expect(vars["--sh-radius-lg"]).toBe("0.625rem");
  });
});
