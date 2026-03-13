export const mdxMode = "registry-backed";

export const docsCategories = [
  "components",
  "templates",
  "packs",
  "cli",
] as const;

export function normalizeDocSlug(slug: string[]) {
  return slug.length === 0 ? "index" : slug.join("/");
}

export function inferDocCategory(slug: string[]) {
  const [category] = slug;
  return docsCategories.includes(category as (typeof docsCategories)[number])
    ? category
    : "components";
}
