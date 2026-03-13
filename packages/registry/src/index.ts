import type { RegistryManifest } from "@shandapha/contracts";
import { getPackBySlug, packs } from "@shandapha/packs";
import { getTemplateBySlug, templates } from "@shandapha/templates";
import modules from "./data/modules.json";

export function buildRegistry(): RegistryManifest {
  return {
    packs,
    templates,
    modules,
  };
}

export function getRegistryJson() {
  return JSON.stringify(buildRegistry(), null, 2);
}

export { getPackBySlug, getTemplateBySlug };
