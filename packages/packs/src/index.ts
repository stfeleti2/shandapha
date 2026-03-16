import {
  type BrandKit,
  type CatalogMetadata,
  definePackManifest,
  type PackId,
  type PackManifest,
  type ThemeMode,
} from "@shandapha/contracts";
import {
  checkContrast,
  createTokenSet,
  defaultBrandKit,
  resolveThemeScale,
  toCssVariables,
} from "@shandapha/tokens";

const packDefinitions = [
  {
    id: "normal",
    slug: "normal",
    name: "Normal",
    tier: "free",
    tagline:
      "Neutral, editorial, and calm. The clearest expression of the shared Shandapha baseline.",
    description:
      "Normal is the default premium-feeling baseline with restrained contrast, balanced spacing, and the full shared UI surface.",
    knobs: ["neutral surface depth", "balanced radii", "steady motion"],
  },
  {
    id: "glass",
    slug: "glass",
    name: "Glass",
    tier: "premium",
    tagline:
      "Same component contracts, with softer surfaces and lower-contrast separation.",
    description:
      "Glass keeps the shared baseline intact while easing surface contrast and dividers for a quieter premium feel.",
    knobs: ["surface softness", "divider contrast", "motion softness"],
  },
  {
    id: "neon",
    slug: "neon",
    name: "Neon",
    tier: "premium",
    tagline:
      "Higher accent contrast and darker canvases without leaving the shared ownership model.",
    description:
      "Neon raises chart and action contrast while staying inside the same semantic-token, layout, and component grammar.",
    knobs: ["accent emphasis", "chart contrast", "surface depth"],
  },
] satisfies Array<Omit<PackManifest, "version" | keyof CatalogMetadata>>;

export const packs: PackManifest[] = packDefinitions.map((pack) =>
  definePackManifest(pack),
);

export function getPackBySlug(slug: string) {
  return packs.find((pack) => pack.slug === slug);
}

export function getPackById(packId: PackId) {
  return packs.find((pack) => pack.id === packId);
}

export function createPackTheme(
  packId: PackId,
  brandKit: BrandKit = defaultBrandKit,
  mode: ThemeMode = "light",
) {
  const pack = getPackById(packId) ?? packs[0];
  const tokens = createTokenSet(brandKit, pack.id);
  const resolvedMode = mode === "system" ? "light" : mode;

  return {
    pack,
    tokens,
    scale: resolveThemeScale(tokens, resolvedMode),
    cssVariables: toCssVariables(tokens),
  };
}

export function validatePack(packId: string) {
  return packs.some((pack) => pack.id === packId);
}

export function validatePackTheme(
  packId: PackId,
  brandKit: BrandKit = defaultBrandKit,
) {
  return checkContrast(createTokenSet(brandKit, packId));
}

export function createPackPreviewDescriptors(
  templateSlugs = ["dashboard-home", "pricing-basic", "auth/sign-in"],
) {
  return packs.map((pack) => ({
    packId: pack.id,
    tier: pack.tier,
    templateSlugs,
    contrastWarnings: validatePackTheme(pack.id),
  }));
}
