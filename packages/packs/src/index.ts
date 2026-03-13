import type { BrandKit, PackId, PackManifest } from "@shandapha/contracts";
import {
  createTokenSet,
  defaultBrandKit,
  toCssVariables,
} from "@shandapha/tokens";

export const packs: PackManifest[] = [
  {
    id: "normal",
    slug: "normal",
    name: "Normal",
    tier: "free",
    tagline:
      "Clean depth, calm surfaces, and a premium default that stays trusted.",
    description:
      "Normal is the default premium baseline for teams that want semantic tokens, balanced contrast, and minimal visual noise.",
    knobs: ["contrast-safe palette", "steady motion", "balanced radii"],
  },
  {
    id: "glass",
    slug: "glass",
    name: "Glass",
    tier: "premium",
    tagline:
      "Translucent layers, softer edges, and tasteful motion that stays opt-in.",
    description:
      "Glass layers blur, translucency, and subtle sheen on top of the same component contracts without forking the runtime.",
    knobs: ["frost intensity", "shadow softness", "sheen level"],
  },
  {
    id: "neon",
    slug: "neon",
    name: "Neon",
    tier: "premium",
    tagline:
      "High-energy accents, editorial type contrast, and bold presentation.",
    description:
      "Neon pushes the token system toward expressive product launches and dashboards while preserving accessibility and reduced-motion fallbacks.",
    knobs: ["glow strength", "headline contrast", "accent saturation"],
  },
] as PackManifest[];

export function getPackBySlug(slug: string) {
  return packs.find((pack) => pack.slug === slug);
}

export function getPackById(packId: PackId) {
  return packs.find((pack) => pack.id === packId);
}

export function createPackTheme(
  packId: PackId,
  brandKit: BrandKit = defaultBrandKit,
) {
  const pack = getPackById(packId) ?? packs[0];
  const tokens = createTokenSet(brandKit, pack.id);
  return {
    pack,
    tokens,
    cssVariables: toCssVariables(tokens),
  };
}

export function validatePack(packId: string) {
  return packs.some((pack) => pack.id === packId);
}
