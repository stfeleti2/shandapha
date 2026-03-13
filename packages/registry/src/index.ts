import type { RegistryManifest } from "@shandapha/contracts";
import { chartsManifest } from "@shandapha/module-charts";
import { datatableManifest } from "@shandapha/module-datatable";
import { richtextManifest } from "@shandapha/module-richtext";
import { seoManifest } from "@shandapha/module-seo";
import { getPackBySlug, packs } from "@shandapha/packs";
import { getTemplateBySlug, templates } from "@shandapha/templates";

export function buildRegistry(): RegistryManifest {
  return {
    packs,
    templates,
    modules: [datatableManifest, chartsManifest, richtextManifest, seoManifest],
  };
}

export function getRegistryJson() {
  return JSON.stringify(buildRegistry(), null, 2);
}

export { getPackBySlug, getTemplateBySlug };
