import type { RegistryManifest } from "@shandapha/contracts";
import { getPackBySlug, packs } from "@shandapha/packs";
import { getTemplateBySlug, templates } from "@shandapha/templates";
import {
  blockManifests,
  chartManifests,
  componentManifests,
  shellManifests,
  workspaceManifests,
} from "./data/catalog";
import modules from "./data/modules.json";

export function buildRegistry(): RegistryManifest {
  return {
    packs,
    templates,
    modules,
    components: componentManifests,
    blocks: blockManifests,
    charts: chartManifests,
    shells: shellManifests,
    workspaces: workspaceManifests,
  };
}

export function getRegistryJson() {
  return JSON.stringify(buildRegistry(), null, 2);
}

export { getPackBySlug, getTemplateBySlug };
