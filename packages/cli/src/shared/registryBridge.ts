import { buildRegistry } from "@shandapha/registry";

export type RegistryKind = "pack" | "template" | "module";

export function registryBridge() {
  const registry = buildRegistry();

  return {
    registry,
    list(kind: RegistryKind) {
      if (kind === "pack") {
        return registry.packs.map((pack) => pack.slug);
      }
      if (kind === "template") {
        return registry.templates.map((template) => template.slug);
      }
      return registry.modules.map((module) => module.id);
    },
    find(kind: RegistryKind, slug: string) {
      if (kind === "pack") {
        return registry.packs.find(
          (pack) => pack.slug === slug || pack.id === slug,
        );
      }
      if (kind === "template") {
        return registry.templates.find((template) => template.slug === slug);
      }
      return registry.modules.find((module) => module.id === slug);
    },
    describe() {
      return {
        packs: registry.packs.length,
        templates: registry.templates.length,
        modules: registry.modules.length,
      };
    },
  };
}
