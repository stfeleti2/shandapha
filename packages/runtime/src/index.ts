import type {
  BrandKit,
  DensityMode,
  MotionMode,
  PackId,
  ThemeMode,
} from "@shandapha/contracts";
import { createTokenSet, toCssVariables } from "@shandapha/tokens";

export interface ThemeApplicationOptions {
  target?: HTMLElement | null;
  mode?: ThemeMode;
  density?: DensityMode;
  motion?: MotionMode;
}

export interface TelemetryEvent<TDetail extends Record<string, string>> {
  event: string;
  detail: TDetail;
  mode: "privacy-safe";
  emittedAt: string;
}

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

export function getThemeTarget(target?: HTMLElement | null) {
  return (
    target ??
    (typeof document !== "undefined" ? document.documentElement : null)
  );
}

export function resolveThemeMode(
  mode: ThemeMode,
  target?: HTMLElement | null,
): Exclude<ThemeMode, "system"> {
  if (mode !== "system") {
    return mode;
  }

  if (typeof window === "undefined") {
    return target?.classList.contains("dark") ? "dark" : "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(
  packId: PackId,
  brandKit: BrandKit,
  options: ThemeApplicationOptions = {},
) {
  const target = getThemeTarget(options.target);

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

  const resolvedMode = resolveThemeMode(mode, target);
  target.classList.toggle("dark", resolvedMode === "dark");
  target.classList.toggle("light", resolvedMode === "light");
  target.style.colorScheme = resolvedMode;
}

export function unapplyTheme(target?: HTMLElement | null) {
  const resolvedTarget = getThemeTarget(target);

  if (!resolvedTarget) {
    return;
  }

  ["data-theme", "data-density", "data-motion", "data-theme-mode"].forEach(
    (attribute) => {
      resolvedTarget.removeAttribute(attribute);
    },
  );
  resolvedTarget.classList.remove("dark", "light");
  resolvedTarget.style.colorScheme = "";

  Array.from(resolvedTarget.style)
    .filter((property) => property.startsWith("--sh-"))
    .forEach((property) => {
      resolvedTarget.style.removeProperty(property);
    });
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function shouldReduceMotion(mode: MotionMode) {
  return mode === "reduced" || prefersReducedMotion();
}

export function getFocusRingStyle(
  options: { width?: string; offset?: string; color?: string } = {},
) {
  return {
    outline: `${options.width ?? "2px"} solid ${options.color ?? "var(--color-ring, var(--sh-ring-light))"}`,
    outlineOffset: options.offset ?? "2px",
  };
}

export function isActivationKey(value: string) {
  return value === "Enter" || value === " ";
}

export function isDismissKey(value: string) {
  return value === "Escape";
}

export function isNextNavigationKey(value: string) {
  return value === "ArrowRight" || value === "ArrowDown";
}

export function isPreviousNavigationKey(value: string) {
  return value === "ArrowLeft" || value === "ArrowUp";
}

export function createTelemetryEvent<TDetail extends Record<string, string>>(
  event: string,
  detail: TDetail,
): TelemetryEvent<TDetail> {
  return {
    event,
    detail,
    mode: "privacy-safe",
    emittedAt: new Date().toISOString(),
  };
}
