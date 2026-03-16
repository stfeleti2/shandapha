import { defineModuleManifest } from "@shandapha/contracts";

export interface SeoMetadataInput {
  title: string;
  description: string;
  canonicalUrl?: string;
  imageUrl?: string;
  noIndex?: boolean;
  keywords?: string[];
  locale?: string;
  siteName?: string;
  type?: "website" | "article";
}

export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export interface RobotsPolicy {
  userAgent?: string;
  allow?: string[];
  disallow?: string[];
  sitemap?: string;
}

export const seoManifest = defineModuleManifest({
  id: "seo",
  name: "SEO",
  packageName: "@shandapha/module-seo",
  description: "Metadata, sitemap, robots, and structured data helpers.",
  premium: false,
  minimumPlan: "free",
  status: "installable",
  capabilities: {
    free: ["metadata", "json-ld", "canonical", "sitemap", "robots"],
  },
  install: {
    requiredRoutes: ["/sitemap.xml", "/robots.txt"],
  },
});

export function createCanonicalUrl(url: string) {
  return `<link rel="canonical" href="${url}" />`;
}

export function createSeoMetadata(input: SeoMetadataInput) {
  const metadata = {
    title: input.title,
    description: input.description,
    keywords: input.keywords ?? [],
    robots: input.noIndex ? "noindex, nofollow" : "index, follow",
    alternates: input.canonicalUrl
      ? { canonical: input.canonicalUrl }
      : undefined,
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.canonicalUrl,
      siteName: input.siteName ?? "Shandapha",
      locale: input.locale ?? "en_US",
      type: input.type ?? "website",
      images: input.imageUrl ? [input.imageUrl] : [],
    },
    twitter: {
      card: input.imageUrl ? "summary_large_image" : "summary",
      title: input.title,
      description: input.description,
      images: input.imageUrl ? [input.imageUrl] : [],
    },
  };

  return metadata;
}

export function createJsonLd<T extends Record<string, unknown>>(schema: T) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(schema, null, 2),
  } as const;
}

export function createOrganizationJsonLd(input: {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}) {
  return createJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    url: input.url,
    logo: input.logo,
    sameAs: input.sameAs ?? [],
  });
}

export function createArticleJsonLd(input: {
  headline: string;
  description: string;
  url: string;
  publishedAt: string;
  modifiedAt?: string;
  authorName: string;
}) {
  return createJsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: input.url,
    datePublished: input.publishedAt,
    dateModified: input.modifiedAt ?? input.publishedAt,
    author: {
      "@type": "Person",
      name: input.authorName,
    },
  });
}

export function createSitemap(entries: SitemapEntry[]) {
  const urls = entries
    .map((entry) => {
      const parts = [
        "<url>",
        `  <loc>${entry.url}</loc>`,
        entry.lastModified
          ? `  <lastmod>${entry.lastModified}</lastmod>`
          : undefined,
        entry.changeFrequency
          ? `  <changefreq>${entry.changeFrequency}</changefreq>`
          : undefined,
        entry.priority !== undefined
          ? `  <priority>${entry.priority.toFixed(1)}</priority>`
          : undefined,
        "</url>",
      ].filter(Boolean);

      return parts.join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
  ].join("\n");
}

export function createRobotsTxt(policy: RobotsPolicy) {
  return [
    `User-agent: ${policy.userAgent ?? "*"}`,
    ...(policy.allow ?? []).map((entry) => `Allow: ${entry}`),
    ...(policy.disallow ?? []).map((entry) => `Disallow: ${entry}`),
    policy.sitemap ? `Sitemap: ${policy.sitemap}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}
