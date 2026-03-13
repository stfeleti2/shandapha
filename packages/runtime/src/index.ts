import type { BrandKit, PackId } from "@shandapha/contracts";
import { createTokenSet, toCssVariables } from "@shandapha/tokens";

export function createThemeAttributes(
  packId: PackId,
  density: BrandKit["density"],
) {
  return {
    "data-theme": packId,
    "data-density": density,
  };
}

export function applyTheme(
  packId: PackId,
  brandKit: BrandKit,
  target: HTMLElement | null = typeof document !== "undefined"
    ? document.documentElement
    : null,
) {
  if (!target) {
    return;
  }

  const tokens = createTokenSet(brandKit, packId);
  const vars = toCssVariables(tokens);

  for (const [key, value] of Object.entries(vars)) {
    target.style.setProperty(key, value);
  }

  const attributes = createThemeAttributes(packId, brandKit.density);
  Object.entries(attributes).forEach(([key, value]) => {
    target.setAttribute(key, value);
  });
}

export function shouldReduceMotion(mode: "full" | "reduced") {
  return mode === "reduced";
}

export function getFocusRingStyle() {
  return {
    outline: "2px solid var(--sh-color-accent, #f97316)",
    outlineOffset: "2px",
  };
}

export function createTelemetryEvent(
  event: string,
  detail: Record<string, string>,
) {
  return {
    event,
    detail,
    mode: "privacy-safe",
    emittedAt: new Date().toISOString(),
  };
}
