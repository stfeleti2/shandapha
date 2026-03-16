import { coreComponentCatalog } from "@shandapha/core";
import { gridPresets } from "@shandapha/layouts";
import { datatableFeatures } from "@shandapha/module-datatable";
import { packs } from "@shandapha/packs";
import { templates } from "@shandapha/templates";
import { storyGroups } from "./stories/catalog";

export function createStorybookSummary() {
  return {
    groups: storyGroups.length,
    components: coreComponentCatalog.length,
    layoutPresets: Object.keys(gridPresets).length,
    packs: packs.length,
    templates: templates.length,
    datatableFeatures: datatableFeatures.length,
  };
}

export { storyGroups };
