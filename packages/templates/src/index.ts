import type {
  FrameworkAdapterId,
  TemplateManifest,
} from "@shandapha/contracts";
import {
  type TemplateAssetBundle,
  templateCatalog,
} from "./generated/catalog.generated";

function buildTemplateGroups(templates: TemplateManifest[]) {
  const shells = new Set<string>();
  const blocks = new Set<string>();
  const groups = new Map<string, string[]>();

  templates.forEach((template) => {
    shells.add(template.shell);
    template.blocks.forEach((block) => {
      blocks.add(block);
    });

    const entries = groups.get(template.group) ?? [];
    entries.push(template.slug);
    groups.set(template.group, entries);
  });

  return {
    shells: [...shells],
    blocks: [...blocks],
    ...Object.fromEntries(groups),
  } as const;
}

export const templateAssets: TemplateAssetBundle[] = templateCatalog;
export const templates: TemplateManifest[] = templateAssets.map(
  (template) => template.manifest,
);
export const templateGroups = buildTemplateGroups(templates);

export function listTemplates(group?: string) {
  return group
    ? templates.filter((template) => template.group === group)
    : templates;
}

export function listTemplateAssetBundles() {
  return templateAssets;
}

export function getTemplateBySlug(slug: string) {
  return templates.find((template) => template.slug === slug);
}

export function getTemplateAssetBundle(slug: string) {
  return templateAssets.find((template) => template.slug === slug);
}

export function listTemplateStates(slug: string) {
  return getTemplateBySlug(slug)?.states ?? [];
}

export function listTemplateVariantAssets(slug: string) {
  return getTemplateAssetBundle(slug)?.variants ?? [];
}

export function listTemplateSampleAssets(slug: string) {
  return getTemplateAssetBundle(slug)?.samples ?? [];
}

export function getTemplateFrameworkFiles(
  slug: string,
  framework: FrameworkAdapterId,
) {
  return getTemplateAssetBundle(slug)?.files[framework] ?? [];
}

export type { TemplateAssetBundle };
