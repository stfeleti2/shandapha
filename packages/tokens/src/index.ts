import type { BrandKit, PackId, ThemeMode } from "@shandapha/contracts";

export interface ThemeScale {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
  surface: string;
  surfaceForeground: string;
  code: string;
  codeForeground: string;
  codeHighlight: string;
  codeNumber: string;
  selection: string;
  selectionForeground: string;
}

export interface TokenSet {
  light: ThemeScale;
  dark: ThemeScale;
  typography: Record<string, string>;
  radius: Record<string, string>;
  motion: Record<string, string>;
  density: string;
  packId: PackId;
}

export const defaultBrandKit: BrandKit = {
  primary: "#18181b",
  accent: "#52525b",
  font: "Inter",
  radius: "0.625rem",
  density: "comfortable",
};

function resolveFontStack(value: string, fallback: string) {
  const trimmed = value.trim();

  if (trimmed.startsWith("var(")) {
    return `${trimmed}, ${fallback}`;
  }

  return `'${trimmed}', ${fallback}`;
}

function parseHexColor(value: string) {
  const normalized = value.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }

  const numeric = Number.parseInt(normalized, 16);
  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255,
  };
}

function getContrastForeground(value: string) {
  const rgb = parseHexColor(value);
  if (!rgb) {
    return "#ffffff";
  }

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.68 ? "#0a0a0a" : "#ffffff";
}

function mix(value: string, percentage: number, target: string) {
  return `color-mix(in srgb, ${value} ${percentage}%, ${target})`;
}

function isDefaultColorToken(value: string, fallback: string) {
  return value.trim().toLowerCase() === fallback.trim().toLowerCase();
}

function createLightScale(brand: BrandKit, packId: PackId): ThemeScale {
  const glass = packId === "glass";
  const neon = packId === "neon";
  const usesBaselinePrimary = isDefaultColorToken(
    brand.primary,
    defaultBrandKit.primary,
  );
  const usesBaselineAccent = isDefaultColorToken(
    brand.accent,
    defaultBrandKit.accent,
  );
  const primary = usesBaselinePrimary ? "oklch(0.205 0 0)" : brand.primary;
  const primaryForeground = usesBaselinePrimary
    ? "oklch(0.985 0 0)"
    : getContrastForeground(brand.primary);
  const secondary = glass
    ? "oklch(0.985 0 0)"
    : neon
      ? "oklch(0.97 0.004 247.858)"
      : "oklch(0.97 0 0)";
  const accent = usesBaselineAccent
    ? secondary
    : neon
      ? mix(brand.accent, 10, "#ffffff")
      : glass
        ? mix(brand.accent, 8, "#ffffff")
        : mix(brand.accent, 10, "#ffffff");
  const chartPalette = {
    chart1: "#93c5fd",
    chart2: "#3b82f6",
    chart3: "#2563eb",
    chart4: "#1d4ed8",
    chart5: "#1e40af",
  };

  return {
    background: glass
      ? "oklch(0.995 0 0)"
      : neon
        ? "oklch(0.99 0.004 247.858)"
        : "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(1 0 0)",
    cardForeground: "oklch(0.145 0 0)",
    popover: "oklch(1 0 0)",
    popoverForeground: "oklch(0.145 0 0)",
    primary,
    primaryForeground,
    secondary,
    secondaryForeground: "oklch(0.205 0 0)",
    muted: secondary,
    mutedForeground: "oklch(0.556 0 0)",
    accent,
    accentForeground: "oklch(0.205 0 0)",
    destructive: "oklch(0.577 0.245 27.325)",
    destructiveForeground: "oklch(0.97 0.01 17)",
    border: glass
      ? "oklch(0.94 0 0)"
      : neon
        ? "oklch(0.93 0.004 247.858)"
        : "oklch(0.922 0 0)",
    input: glass
      ? "oklch(0.94 0 0)"
      : neon
        ? "oklch(0.93 0.004 247.858)"
        : "oklch(0.922 0 0)",
    ring: usesBaselinePrimary
      ? "oklch(0.708 0 0)"
      : mix(brand.primary, 35, "#ffffff"),
    chart1: chartPalette.chart1,
    chart2: chartPalette.chart2,
    chart3: chartPalette.chart3,
    chart4: chartPalette.chart4,
    chart5: chartPalette.chart5,
    sidebar: glass
      ? "oklch(0.99 0 0)"
      : neon
        ? "oklch(0.985 0.004 247.858)"
        : "oklch(0.985 0 0)",
    sidebarForeground: "oklch(0.145 0 0)",
    sidebarPrimary: primary,
    sidebarPrimaryForeground: primaryForeground,
    sidebarAccent: secondary,
    sidebarAccentForeground: "oklch(0.205 0 0)",
    sidebarBorder: glass
      ? "oklch(0.94 0 0)"
      : neon
        ? "oklch(0.93 0.004 247.858)"
        : "oklch(0.922 0 0)",
    sidebarRing: usesBaselinePrimary
      ? "oklch(0.708 0 0)"
      : mix(brand.primary, 40, "#ffffff"),
    surface: glass
      ? "oklch(0.985 0 0)"
      : neon
        ? "oklch(0.98 0.004 247.858)"
        : "oklch(0.98 0 0)",
    surfaceForeground: "oklch(0.145 0 0)",
    code: glass
      ? "oklch(0.985 0 0)"
      : neon
        ? "oklch(0.98 0.004 247.858)"
        : "oklch(0.98 0 0)",
    codeForeground: "oklch(0.145 0 0)",
    codeHighlight: glass
      ? "oklch(0.97 0 0)"
      : neon
        ? "oklch(0.96 0.004 247.858)"
        : "oklch(0.96 0 0)",
    codeNumber: "oklch(0.56 0 0)",
    selection: "oklch(0.145 0 0)",
    selectionForeground: "oklch(1 0 0)",
  };
}

function createDarkScale(brand: BrandKit, packId: PackId): ThemeScale {
  const glass = packId === "glass";
  const neon = packId === "neon";
  const usesBaselinePrimary = isDefaultColorToken(
    brand.primary,
    defaultBrandKit.primary,
  );
  const usesBaselineAccent = isDefaultColorToken(
    brand.accent,
    defaultBrandKit.accent,
  );
  const primary = usesBaselinePrimary
    ? "oklch(0.922 0 0)"
    : mix(brand.primary, neon ? 86 : 82, "#ffffff");
  const secondary = glass
    ? "oklch(0.24 0 0)"
    : neon
      ? "oklch(0.28 0.01 247.858)"
      : "oklch(0.269 0 0)";
  const accent = usesBaselineAccent
    ? neon
      ? "oklch(0.33 0.01 247.858)"
      : "oklch(0.371 0 0)"
    : neon
      ? mix(brand.accent, 20, "#111827")
      : glass
        ? mix(brand.accent, 16, "#111113")
        : mix(brand.accent, 18, "#18181b");
  const chartPalette = {
    chart1: "#93c5fd",
    chart2: "#3b82f6",
    chart3: "#2563eb",
    chart4: "#1d4ed8",
    chart5: "#1e40af",
  };

  return {
    background: glass
      ? "oklch(0.14 0 0)"
      : neon
        ? "oklch(0.17 0.01 247.858)"
        : "oklch(0.145 0 0)",
    foreground: "oklch(0.985 0 0)",
    card: glass
      ? "oklch(0.19 0 0)"
      : neon
        ? "oklch(0.22 0.01 247.858)"
        : "oklch(0.205 0 0)",
    cardForeground: "oklch(0.985 0 0)",
    popover: glass
      ? "oklch(0.19 0 0)"
      : neon
        ? "oklch(0.22 0.01 247.858)"
        : "oklch(0.205 0 0)",
    popoverForeground: "oklch(0.985 0 0)",
    primary,
    primaryForeground: usesBaselinePrimary ? "oklch(0.205 0 0)" : "#0a0a0a",
    secondary,
    secondaryForeground: "oklch(0.985 0 0)",
    muted: secondary,
    mutedForeground: "oklch(0.708 0 0)",
    accent,
    accentForeground: "oklch(0.985 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    destructiveForeground: "oklch(0.58 0.22 27)",
    border: glass
      ? "oklch(1 0 0 / 8%)"
      : neon
        ? "oklch(1 0 0 / 12%)"
        : "oklch(1 0 0 / 10%)",
    input: glass
      ? "oklch(1 0 0 / 12%)"
      : neon
        ? "oklch(1 0 0 / 16%)"
        : "oklch(1 0 0 / 15%)",
    ring: usesBaselinePrimary
      ? "oklch(0.556 0 0)"
      : mix(brand.primary, 48, "#ffffff"),
    chart1: chartPalette.chart1,
    chart2: chartPalette.chart2,
    chart3: chartPalette.chart3,
    chart4: chartPalette.chart4,
    chart5: chartPalette.chart5,
    sidebar: glass
      ? "oklch(0.19 0 0)"
      : neon
        ? "oklch(0.2 0.01 247.858)"
        : "oklch(0.205 0 0)",
    sidebarForeground: "oklch(0.985 0 0)",
    sidebarPrimary: primary,
    sidebarPrimaryForeground: usesBaselinePrimary
      ? "oklch(0.205 0 0)"
      : "#0a0a0a",
    sidebarAccent: secondary,
    sidebarAccentForeground: "oklch(0.985 0 0)",
    sidebarBorder: glass
      ? "oklch(1 0 0 / 8%)"
      : neon
        ? "oklch(1 0 0 / 12%)"
        : "oklch(1 0 0 / 10%)",
    sidebarRing: usesBaselinePrimary
      ? "oklch(0.556 0 0)"
      : mix(brand.primary, 50, "#ffffff"),
    surface: glass
      ? "oklch(0.18 0 0)"
      : neon
        ? "oklch(0.21 0.01 247.858)"
        : "oklch(0.2 0 0)",
    surfaceForeground: "oklch(0.708 0 0)",
    code: glass
      ? "oklch(0.18 0 0)"
      : neon
        ? "oklch(0.21 0.01 247.858)"
        : "oklch(0.2 0 0)",
    codeForeground: "oklch(0.708 0 0)",
    codeHighlight: glass
      ? "oklch(0.25 0 0)"
      : neon
        ? "oklch(0.28 0.01 247.858)"
        : "oklch(0.27 0 0)",
    codeNumber: "oklch(0.72 0 0)",
    selection: primary,
    selectionForeground: usesBaselinePrimary ? "oklch(0.205 0 0)" : "#0a0a0a",
  };
}

export function createTokenSet(
  brand: BrandKit = defaultBrandKit,
  packId: PackId = "normal",
): TokenSet {
  return {
    light: createLightScale(brand, packId),
    dark: createDarkScale(brand, packId),
    typography: {
      body: resolveFontStack(
        brand.font,
        "ui-sans-serif, system-ui, sans-serif",
      ),
      display: brand.font.trim().startsWith("var(")
        ? "var(--font-display), var(--font-body), ui-sans-serif, system-ui, sans-serif"
        : resolveFontStack(brand.font, "ui-sans-serif, system-ui, sans-serif"),
      mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace",
    },
    radius: {
      sm: `calc(${brand.radius} * 0.6)`,
      md: `calc(${brand.radius} * 0.8)`,
      lg: brand.radius,
      xl: `calc(${brand.radius} * 1.4)`,
      full: "999px",
    },
    motion: {
      fast: packId === "glass" ? "180ms" : "150ms",
      normal: packId === "neon" ? "210ms" : "170ms",
      slow: packId === "neon" ? "280ms" : "240ms",
    },
    density: brand.density,
    packId,
  };
}

function mapScale(prefix: "light" | "dark", scale: ThemeScale) {
  return Object.entries(scale).reduce<Record<string, string>>((vars, entry) => {
    const [key, value] = entry;
    const cssKey = key
      .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
      .replace(/(\d+)/g, "-$1");
    vars[`--sh-${cssKey}-${prefix}`] = value;
    return vars;
  }, {});
}

export function toCssVariables(tokens: TokenSet): Record<string, string> {
  return {
    ...mapScale("light", tokens.light),
    ...mapScale("dark", tokens.dark),
    "--sh-font-body": tokens.typography.body,
    "--sh-font-display": tokens.typography.display,
    "--sh-font-mono": tokens.typography.mono,
    "--sh-radius-sm": tokens.radius.sm,
    "--sh-radius-md": tokens.radius.md,
    "--sh-radius-lg": tokens.radius.lg,
    "--sh-radius-xl": tokens.radius.xl,
    "--sh-radius-full": tokens.radius.full,
    "--sh-motion-fast": tokens.motion.fast,
    "--sh-motion-normal": tokens.motion.normal,
    "--sh-motion-slow": tokens.motion.slow,
    "--sh-density": tokens.density,
    "--sh-pack-id": tokens.packId,
  };
}

export function resolveThemeScale(
  tokens: TokenSet,
  mode: Exclude<ThemeMode, "system"> = "light",
) {
  return mode === "dark" ? tokens.dark : tokens.light;
}

export function toTokensJson(tokens: TokenSet): string {
  return JSON.stringify(tokens, null, 2);
}

export function fromTokensJson(value: string): TokenSet {
  return JSON.parse(value) as TokenSet;
}

export function toTailwindTheme(tokens: TokenSet) {
  return {
    colors: {
      background: "var(--sh-background-light)",
      foreground: "var(--sh-foreground-light)",
      card: "var(--sh-card-light)",
      primary: "var(--sh-primary-light)",
      secondary: "var(--sh-secondary-light)",
      muted: "var(--sh-muted-light)",
      accent: "var(--sh-accent-light)",
      border: "var(--sh-border-light)",
      ring: "var(--sh-ring-light)",
    },
    borderRadius: {
      sm: tokens.radius.sm,
      md: tokens.radius.md,
      lg: tokens.radius.lg,
      xl: tokens.radius.xl,
      full: tokens.radius.full,
    },
    fontFamily: {
      sans: [tokens.typography.body],
      display: [tokens.typography.display],
      mono: [tokens.typography.mono],
    },
  };
}

export function checkContrast(tokens: TokenSet): string[] {
  const warnings: string[] = [];

  if (tokens.light.primary === tokens.light.background) {
    warnings.push("Light theme primary token is too close to the background.");
  }

  if (tokens.dark.primary === tokens.dark.background) {
    warnings.push("Dark theme primary token is too close to the background.");
  }

  if (tokens.light.border === tokens.light.background) {
    warnings.push("Light theme borders need more separation from the canvas.");
  }

  return warnings;
}

export function validateBrandKit(brand: BrandKit) {
  const repairs = suggestBrandKitRepair(brand);

  return {
    valid: repairs.length === 0,
    repairs,
  };
}

export function suggestBrandKitRepair(brand: BrandKit) {
  const suggestions: string[] = [];

  if (!parseHexColor(brand.primary)) {
    suggestions.push("Primary color must be a six-digit hex value.");
  }

  if (!parseHexColor(brand.accent)) {
    suggestions.push("Accent color must be a six-digit hex value.");
  }

  if (
    brand.primary.trim().toLowerCase() === brand.accent.trim().toLowerCase()
  ) {
    suggestions.push("Primary and accent colors should not be identical.");
  }

  if (!brand.font.trim()) {
    suggestions.push("Font must be a non-empty string.");
  }

  if (!brand.radius.trim()) {
    suggestions.push(
      "Radius must be provided so token output remains deterministic.",
    );
  }

  return suggestions;
}
