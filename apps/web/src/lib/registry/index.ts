import { buildRegistry } from "@shandapha/registry";

export { buildRegistry };

export function getCatalogSummary() {
  const registry = buildRegistry();

  return {
    templateGroups: Array.from(
      new Set(registry.templates.map((template) => template.group)),
    ),
    premiumPacks: registry.packs
      .filter((pack) => pack.tier !== "free")
      .map((pack) => pack.slug),
    heavyModules: registry.modules
      .filter((module) => module.premium)
      .map((module) => module.id),
  };
}
