import type { Metadata } from "next";

export const defaultSeo = {
  metadataBase: new URL("https://shandapha.com"),
  title: "Shandapha",
  description:
    "UI platform with semantic tokens, packs, templates, wizard, CLI, and reversible patch installs.",
  openGraphType: "website",
} as const;

export function createPageMetadata(
  title: string,
  description: string,
  pathname = "/",
): Metadata {
  return {
    metadataBase: defaultSeo.metadataBase,
    title: `${title} | ${defaultSeo.title}`,
    description,
    openGraph: {
      type: defaultSeo.openGraphType,
      title,
      description,
      url: pathname,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
