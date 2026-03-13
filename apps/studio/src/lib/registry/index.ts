import { buildRegistry } from "@shandapha/registry";

export { buildRegistry };

export function getStudioRegistrySummary() {
  const registry = buildRegistry();

  return {
    packs: registry.packs.map((pack) => ({
      id: pack.id,
      name: pack.name,
      tier: pack.tier,
    })),
    templates: registry.templates.map((template) => ({
      slug: template.slug,
      name: template.name,
      group: template.group,
    })),
    modules: registry.modules.map((module) => ({
      id: module.id,
      name: module.name,
      premium: module.premium,
    })),
  };
}
