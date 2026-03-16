import type { BrandKit, DensityMode, MotionMode, PackId, ThemeMode } from "@shandapha/contracts";
import { createTokenSet, toCssVariables } from "@shandapha/tokens";

export function createThemeAttributes(
  packId: PackId,
  density: DensityMode,
  motion: MotionMode,
  mode: ThemeMode,
) {
  return {
    "data-theme": packId,
    "data-density": density,
    "data-motion": motion,
    "data-theme-mode": mode,
  };
}

function resolveMode(mode: ThemeMode, target: HTMLElement) {
  if (mode !== "system") {
    return mode;
  }

  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(
  packId: PackId,
  brandKit: BrandKit,
  options: {
    target?: HTMLElement | null;
    mode?: ThemeMode;
    density?: DensityMode;
    motion?: MotionMode;
  } = {},
) {
  const target =
    options.target ??
    (typeof document !== "undefined" ? document.documentElement : null);

  if (!target) {
    return;
  }

  const density = options.density ?? brandKit.density;
  const motion = options.motion ?? "full";
  const mode = options.mode ?? "system";
  const tokens = createTokenSet({ ...brandKit, density }, packId);
  const vars = toCssVariables(tokens);

  for (const [key, value] of Object.entries(vars)) {
    target.style.setProperty(key, value);
  }

  const attributes = createThemeAttributes(packId, density, motion, mode);
  Object.entries(attributes).forEach(([key, value]) => {
    target.setAttribute(key, value);
  });

  const resolvedMode = resolveMode(mode, target);
  target.classList.toggle("dark", resolvedMode === "dark");
  target.classList.toggle("light", resolvedMode === "light");
  target.style.colorScheme = resolvedMode;
}

export function shouldReduceMotion(mode: MotionMode) {
  return mode === "reduced";
}

export function getFocusRingStyle() {
  return {
    outline: "2px solid var(--color-ring, var(--sh-ring-light))",
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
