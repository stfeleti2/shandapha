import type { BrandKit, PackId } from "@shandapha/contracts";

export interface TokenSet {
  color: Record<string, string>;
  surface: Record<string, string>;
  typography: Record<string, string>;
  radius: Record<string, string>;
  motion: Record<string, string>;
  density: string;
}

export const defaultBrandKit: BrandKit = {
  primary: "#0f766e",
  accent: "#f97316",
  font: "Space Grotesk",
  radius: "18px",
  density: "comfortable",
};

export function createTokenSet(
  brand: BrandKit = defaultBrandKit,
  packId: PackId = "normal",
): TokenSet {
  return {
    color: {
      primary: brand.primary,
      accent: brand.accent,
      text: "#0f172a",
      textMuted: "#475569",
      background: packId === "neon" ? "#04111f" : "#f5f2e9",
    },
    surface: {
      canvas: packId === "glass" ? "rgba(255,255,255,0.72)" : "#fffdf7",
      raised: packId === "neon" ? "#09203a" : "#ffffff",
      border: packId === "glass" ? "rgba(15, 23, 42, 0.18)" : "#d6d3d1",
    },
    typography: {
      body: brand.font,
      display:
        packId === "neon"
          ? "'IBM Plex Sans', sans-serif"
          : "'Space Grotesk', sans-serif",
    },
    radius: {
      md: brand.radius,
      lg: "24px",
    },
    motion: {
      duration: packId === "normal" ? "140ms" : "180ms",
    },
    density: brand.density,
  };
}

export function toCssVariables(tokens: TokenSet): Record<string, string> {
  return {
    "--sh-color-primary": tokens.color.primary,
    "--sh-color-accent": tokens.color.accent,
    "--sh-color-text": tokens.color.text,
    "--sh-color-text-muted": tokens.color.textMuted,
    "--sh-surface-canvas": tokens.surface.canvas,
    "--sh-surface-raised": tokens.surface.raised,
    "--sh-border-default": tokens.surface.border,
    "--sh-font-body": tokens.typography.body,
    "--sh-font-display": tokens.typography.display,
    "--sh-radius-md": tokens.radius.md,
    "--sh-radius-lg": tokens.radius.lg,
    "--sh-motion-duration": tokens.motion.duration,
    "--sh-density": tokens.density,
  };
}

export function toTokensJson(tokens: TokenSet): string {
  return JSON.stringify(tokens, null, 2);
}

export function checkContrast(tokens: TokenSet): string[] {
  const warnings: string[] = [];
  if (
    tokens.color.primary.toLowerCase() ===
    tokens.color.background?.toLowerCase()
  ) {
    warnings.push("Primary color is too close to the background.");
  }
  return warnings;
}
