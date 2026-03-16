import { cloneStringArray } from "../shared/validation";

export const PACK_MANIFEST_VERSION = 1 as const;
export const TEMPLATE_MANIFEST_VERSION = 1 as const;
export const REGISTRY_MANIFEST_VERSION = 1 as const;
export const REGISTRY_ITEM_MANIFEST_VERSION = 1 as const;
export const CATALOG_CONFIG_VERSION = 1 as const;
export const CATALOG_SOURCE_MANIFEST_VERSION = 1 as const;

export const DENSITY_MODES = ["comfortable", "compact"] as const;
export const MOTION_MODES = ["full", "reduced"] as const;
export const THEME_MODES = ["light", "dark", "system"] as const;
export const PACK_IDS = ["normal", "glass", "neon"] as const;
export const PLAN_IDS = ["free", "premium", "business"] as const;
export const LAYOUT_PRESET_IDS = [
  "dashboard",
  "list",
  "detail",
  "form",
  "marketing",
  "docs",
] as const;
export const SHELL_IDS = [
  "AdminShell",
  "MarketingShell",
  "DocsShell",
  "SidebarShell",
  "AuthShell",
] as const;
export const ADAPTER_KINDS = ["react", "wc", "bridge"] as const;
export const ADAPTER_RENDERERS = ["csr", "ssr", "hybrid"] as const;
export const PORTABILITY_LAYERS = ["native", "web-components"] as const;
export const FRAMEWORK_ADAPTER_IDS = [
  "react-vite",
  "next-app-router",
  "wc-universal",
  "blazor-wc",
] as const;
export const FRAMEWORK_SUPPORT_STATUSES = [
  "supported",
  "experimental",
  "blocked",
] as const;
export const REGISTRY_FILE_ROLES = [
  "component",
  "block",
  "layout",
  "style",
  "hook",
  "data",
] as const;
export const REGISTRY_ITEM_TYPES = [
  "component",
  "block",
  "chart",
  "shell",
] as const;
export const MODULE_STATUSES = ["installable", "deferred"] as const;
export const CATALOG_ITEM_KINDS = [
  "pack",
  "template",
  "module",
  "component",
  "block",
  "chart",
  "shell",
] as const;
export const CATALOG_SOURCE_CONFIG_KINDS = [
  "builtin",
  "file",
  "api",
] as const;
export const CATALOG_SOURCE_KINDS = [
  "first-party",
  "org",
  "community",
] as const;
export const CATALOG_VISIBILITIES = ["public", "org", "workspace"] as const;
export const CATALOG_SUPPORT_LEVELS = [
  "first-party",
  "internal",
  "verified",
  "community",
] as const;
export const CATALOG_TRUST_LEVELS = [
  "verified",
  "checksum-verified",
  "self-declared",
] as const;
export const CATALOG_STABILITY_LEVELS = [
  "stable",
  "preview",
  "experimental",
  "deprecated",
] as const;
export const POLICY_MODES = ["report-only", "enforce"] as const;
export const APPROVAL_STATUSES = ["approved", "pending", "rejected"] as const;
export const POLICY_FINDING_SEVERITIES = ["info", "warn", "error"] as const;

export type DensityMode = (typeof DENSITY_MODES)[number];
export type MotionMode = (typeof MOTION_MODES)[number];
export type ThemeMode = (typeof THEME_MODES)[number];
export type PackId = (typeof PACK_IDS)[number];
export type PlanId = (typeof PLAN_IDS)[number];
export type LayoutPreset = (typeof LAYOUT_PRESET_IDS)[number];
export type ShellId = (typeof SHELL_IDS)[number];
export type AdapterKind = (typeof ADAPTER_KINDS)[number];
export type AdapterRenderer = (typeof ADAPTER_RENDERERS)[number];
export type PortabilityLayer = (typeof PORTABILITY_LAYERS)[number];
export type FrameworkAdapterId = (typeof FRAMEWORK_ADAPTER_IDS)[number];
export type FrameworkSupportStatus =
  (typeof FRAMEWORK_SUPPORT_STATUSES)[number];
export type RegistryFileRole = (typeof REGISTRY_FILE_ROLES)[number];
export type RegistryItemType = (typeof REGISTRY_ITEM_TYPES)[number];
export type ModuleStatus = (typeof MODULE_STATUSES)[number];
export type CatalogItemKind = (typeof CATALOG_ITEM_KINDS)[number];
export type CatalogSourceConfigKind =
  (typeof CATALOG_SOURCE_CONFIG_KINDS)[number];
export type CatalogSourceKind = (typeof CATALOG_SOURCE_KINDS)[number];
export type CatalogVisibility = (typeof CATALOG_VISIBILITIES)[number];
export type CatalogSupportLevel = (typeof CATALOG_SUPPORT_LEVELS)[number];
export type CatalogTrustLevel = (typeof CATALOG_TRUST_LEVELS)[number];
export type CatalogStability = (typeof CATALOG_STABILITY_LEVELS)[number];
export type PolicyMode = (typeof POLICY_MODES)[number];
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];
export type PolicyFindingSeverity = (typeof POLICY_FINDING_SEVERITIES)[number];

export interface CatalogDeprecation {
  message: string;
  replacedByRegistryId?: string;
  removalVersion?: string;
}

export interface CatalogPreview {
  title: string;
  href: string;
  type: "image" | "story" | "doc";
}

export interface CatalogOwner {
  id: string;
  label: string;
  homepage?: string;
  packageName?: string;
}

export interface CatalogProvenance {
  sourceId: string;
  checksum?: string;
  manifestPath?: string;
  assetPath?: string;
}

export interface CatalogInstallability {
  installable: boolean;
  target: "starter" | "patch" | "theme-only" | "discovery";
  notes?: string;
}

export interface CatalogMetadata {
  registryId: string;
  namespace: string;
  sourceKind: CatalogSourceKind;
  visibility: CatalogVisibility;
  supportLevel: CatalogSupportLevel;
  trustLevel: CatalogTrustLevel;
  stability: CatalogStability;
  deprecation?: CatalogDeprecation;
  previews: CatalogPreview[];
  tags: string[];
  owner: CatalogOwner;
  provenance: CatalogProvenance;
  installability: CatalogInstallability;
}

export interface BrandKit {
  primary: string;
  accent: string;
  font: string;
  radius: string;
  density: DensityMode;
}

export interface FrameworkCompatibilityRule {
  adapter: string;
  support: FrameworkSupportStatus;
  adapterKind: AdapterKind;
  renderer: AdapterRenderer;
  portabilityLayer: PortabilityLayer;
  supportsSSR: boolean;
  notes?: string;
  minimumAdapterVersion?: number;
  requiredCapabilities: string[];
}

export interface PackManifest extends CatalogMetadata {
  version: typeof PACK_MANIFEST_VERSION;
  id: PackId;
  slug: string;
  name: string;
  tier: PlanId;
  tagline: string;
  description: string;
  knobs: string[];
}

export interface TemplateDataContract {
  entities: string[];
  slots: string[];
  outputs: string[];
  samples: string[];
}

export interface TemplateInstallMetadata {
  requiredPackages: string[];
  requiredRoutes: string[];
  themeDependencies: string[];
  sampleDataBindings: string[];
}

export interface TemplateManifest extends CatalogMetadata {
  version: typeof TEMPLATE_MANIFEST_VERSION;
  slug: string;
  name: string;
  group: string;
  layoutPreset: LayoutPreset;
  shell: ShellId;
  summary: string;
  states: string[];
  variants: string[];
  blocks: string[];
  related: string[];
  surfaces: string[];
  featuredPackIds: PackId[];
  dataContract: TemplateDataContract;
  frameworks: FrameworkCompatibilityRule[];
  install: TemplateInstallMetadata;
}

export interface ModuleManifest extends CatalogMetadata {
  id: string;
  name: string;
  packageName: string;
  description: string;
  premium: boolean;
  minimumPlan: PlanId;
  status: ModuleStatus;
  capabilities: {
    free: string[];
    premium: string[];
    business: string[];
  };
  install: {
    requiredPackages: string[];
    requiredRoutes: string[];
    frameworks: FrameworkCompatibilityRule[];
  };
}

export interface RegistryFileManifest {
  path: string;
  target: string;
  role: RegistryFileRole;
  ownerPackage: string;
}

export interface RegistryInstallMetadata {
  targetPaths: string[];
  runtimeDependencies: string[];
  peerDependencies: string[];
  templateDependencies: string[];
  routeNeeds: string[];
  minimumPlan: PlanId;
  freeAlternative?: string;
  frameworks: FrameworkCompatibilityRule[];
  patchRules: string[];
}

export interface RegistryItemManifest extends CatalogMetadata {
  version: typeof REGISTRY_ITEM_MANIFEST_VERSION;
  name: string;
  title: string;
  description: string;
  type: RegistryItemType;
  ownerPackage: string;
  installTarget: string;
  categories: string[];
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFileManifest[];
  install: RegistryInstallMetadata;
}

export interface RegistryWorkspaceManifest {
  name: string;
  path: string;
  ownerPackage: string;
  cssPath: string;
  aliases: Record<string, string>;
}

export interface RegistryManifest {
  version: typeof REGISTRY_MANIFEST_VERSION;
  frameworkAdapters: FrameworkCompatibilityRule[];
  packs: PackManifest[];
  templates: TemplateManifest[];
  modules: ModuleManifest[];
  components: RegistryItemManifest[];
  blocks: RegistryItemManifest[];
  charts: RegistryItemManifest[];
  shells: RegistryItemManifest[];
  workspaces: RegistryWorkspaceManifest[];
}

export interface CatalogSourceConfig {
  id: string;
  kind: CatalogSourceConfigKind;
  label: string;
  enabled: boolean;
  namespace?: string;
  path?: string;
  url?: string;
  workspaceIds: string[];
  allowedNamespaces: string[];
}

export interface CatalogPolicy {
  id: string;
  name: string;
  mode: PolicyMode;
  allowedNamespaces: string[];
  allowedSupportLevels: CatalogSupportLevel[];
  allowedStabilities: CatalogStability[];
  approvedRegistryIds: string[];
  approvedVersions: string[];
  lockedPackRegistryIds: string[];
  lockedTemplateRegistryIds: string[];
  lockedModuleRegistryIds: string[];
  allowCommunity: boolean;
  allowExperimental: boolean;
  allowDeprecated: boolean;
}

export interface CatalogConfig {
  version: typeof CATALOG_CONFIG_VERSION;
  sources: CatalogSourceConfig[];
  policies: CatalogPolicy[];
}

export interface CatalogApproval {
  id: string;
  registryId: string;
  sourceId: string;
  status: ApprovalStatus;
  approver: string;
  scope: "org" | "workspace";
  notes?: string;
  approvedVersion?: string;
  approvedAt: string;
}

export interface CatalogTemplateAssetManifest {
  registryId: string;
  rootDir: string;
  readmePath: string;
  previewPath: string;
  files: Partial<Record<FrameworkAdapterId, string[]>>;
  states: string[];
  variants: string[];
  samples: string[];
}

export interface CatalogSourceManifest {
  version: typeof CATALOG_SOURCE_MANIFEST_VERSION;
  source: CatalogSourceConfig;
  packs: PackManifest[];
  templates: TemplateManifest[];
  templateAssets: CatalogTemplateAssetManifest[];
  modules: ModuleManifest[];
  components: RegistryItemManifest[];
  blocks: RegistryItemManifest[];
  charts: RegistryItemManifest[];
  shells: RegistryItemManifest[];
  approvals: CatalogApproval[];
}

export interface ResolvedCatalogSource {
  id: string;
  label: string;
  kind: CatalogSourceConfigKind;
  sourceKind: CatalogSourceKind;
  namespace: string;
  enabled: boolean;
  visibility: CatalogVisibility;
}

export interface ResolvedCatalogWarning {
  code: string;
  message: string;
  registryId?: string;
  sourceId?: string;
}

export interface ResolvedCatalogItem {
  registryId: string;
  kind: CatalogItemKind;
  slug: string;
  title: string;
  description: string;
  version: number;
  namespace: string;
  sourceKind: CatalogSourceKind;
  visibility: CatalogVisibility;
  supportLevel: CatalogSupportLevel;
  trustLevel: CatalogTrustLevel;
  stability: CatalogStability;
  categories: string[];
  tags: string[];
  owner: CatalogOwner;
  provenance: CatalogProvenance;
  installability: CatalogInstallability;
  frameworks: FrameworkCompatibilityRule[];
  aliases: string[];
  deprecation?: CatalogDeprecation;
  previews: CatalogPreview[];
  manifest: PackManifest | TemplateManifest | ModuleManifest | RegistryItemManifest;
  templateAsset?: CatalogTemplateAssetManifest;
}

export interface ResolvedCatalog {
  version: typeof REGISTRY_MANIFEST_VERSION;
  manifestVersion: typeof REGISTRY_MANIFEST_VERSION;
  sources: ResolvedCatalogSource[];
  approvals: CatalogApproval[];
  warnings: ResolvedCatalogWarning[];
  items: ResolvedCatalogItem[];
  itemsById: Record<string, ResolvedCatalogItem>;
  manifest: RegistryManifest;
}

export interface PolicyFinding {
  severity: PolicyFindingSeverity;
  code: string;
  message: string;
  registryId?: string;
  sourceId?: string;
}

export interface PolicyCheckResult {
  policyIds: string[];
  mode: PolicyMode;
  status: "pass" | "warn" | "fail";
  checkedRegistryIds: string[];
  findings: PolicyFinding[];
}

export interface EntitlementPlan {
  id: PlanId;
  name: string;
  price: string;
  summary: string;
  includes: string[];
}

type CatalogMetadataInput = Partial<CatalogMetadata>;

type CompatibilityOverrides = Partial<
  Record<
    FrameworkAdapterId,
    Partial<Omit<FrameworkCompatibilityRule, "adapter">>
  >
>;

export function createRegistryId(
  namespace: string,
  kind: CatalogItemKind,
  slug: string,
) {
  return `${namespace}::${kind}::${slug}`;
}

function normalizeCatalogOwner(
  value: Partial<CatalogOwner> | undefined,
  fallback: {
    id: string;
    label: string;
    packageName?: string;
  },
): CatalogOwner {
  return {
    id: value?.id ?? fallback.id,
    label: value?.label ?? fallback.label,
    homepage: value?.homepage,
    packageName: value?.packageName ?? fallback.packageName,
  };
}

function normalizeCatalogProvenance(
  value: Partial<CatalogProvenance> | undefined,
  fallbackSourceId: string,
): CatalogProvenance {
  return {
    sourceId: value?.sourceId ?? fallbackSourceId,
    checksum: value?.checksum,
    manifestPath: value?.manifestPath,
    assetPath: value?.assetPath,
  };
}

function normalizeCatalogInstallability(
  value: Partial<CatalogInstallability> | undefined,
  fallback: CatalogInstallability,
): CatalogInstallability {
  return {
    installable: value?.installable ?? fallback.installable,
    target: value?.target ?? fallback.target,
    notes: value?.notes ?? fallback.notes,
  };
}

function normalizeCatalogMetadata(
  value: Partial<CatalogMetadata> | undefined,
  fallback: {
    kind: CatalogItemKind;
    slug: string;
    ownerPackage?: string;
    sourceId: string;
    supportLevel?: CatalogSupportLevel;
    installability: CatalogInstallability;
    tags?: readonly string[];
  },
): CatalogMetadata {
  const namespace = value?.namespace ?? "shandapha";
  const sourceKind = value?.sourceKind ?? "first-party";
  const supportLevel = value?.supportLevel ?? fallback.supportLevel ?? "first-party";
  const visibility =
    value?.visibility ?? (sourceKind === "first-party" ? "public" : "org");

  return {
    registryId:
      value?.registryId ??
      createRegistryId(namespace, fallback.kind, fallback.slug),
    namespace,
    sourceKind,
    visibility,
    supportLevel,
    trustLevel:
      value?.trustLevel ??
      (sourceKind === "first-party" ? "verified" : "checksum-verified"),
    stability: value?.stability ?? "stable",
    deprecation: value?.deprecation
      ? { ...value.deprecation }
      : undefined,
    previews: value?.previews?.map((preview) => ({ ...preview })) ?? [],
    tags: cloneStringArray(value?.tags ?? fallback.tags ?? []),
    owner: normalizeCatalogOwner(value?.owner, {
      id: namespace,
      label:
        sourceKind === "first-party"
          ? "Shandapha"
          : namespace.replace(/^org\//, "").replace(/^community\//, ""),
      packageName: fallback.ownerPackage,
    }),
    provenance: normalizeCatalogProvenance(value?.provenance, fallback.sourceId),
    installability: normalizeCatalogInstallability(
      value?.installability,
      fallback.installability,
    ),
  };
}

export const defaultFrameworkCompatibility: Record<
  FrameworkAdapterId,
  FrameworkCompatibilityRule
> = {
  "react-vite": {
    adapter: "react-vite",
    support: "supported",
    adapterKind: "react",
    renderer: "csr",
    portabilityLayer: "native",
    supportsSSR: false,
    notes: "Reference adapter and fastest path for local starters.",
    requiredCapabilities: [],
  },
  "next-app-router": {
    adapter: "next-app-router",
    support: "supported",
    adapterKind: "react",
    renderer: "hybrid",
    portabilityLayer: "native",
    supportsSSR: true,
    notes: "Reference SSR-capable adapter for product starters.",
    requiredCapabilities: ["server-components"],
  },
  "wc-universal": {
    adapter: "wc-universal",
    support: "experimental",
    adapterKind: "wc",
    renderer: "csr",
    portabilityLayer: "web-components",
    supportsSSR: false,
    notes:
      "Portable surface area is still being rebuilt around the WC baseline.",
    requiredCapabilities: ["custom-elements"],
  },
  "blazor-wc": {
    adapter: "blazor-wc",
    support: "experimental",
    adapterKind: "bridge",
    renderer: "hybrid",
    portabilityLayer: "web-components",
    supportsSSR: true,
    notes:
      "Blazor currently installs through the WC bridge rather than a native adapter.",
    requiredCapabilities: ["custom-elements", "wc-interop"],
  },
};

export function inferLayoutPreset(slug: string, group: string): LayoutPreset {
  if (slug === "dashboard-home" || slug === "team-roles-starter") {
    return "dashboard";
  }

  if (slug === "list-filters") {
    return "list";
  }

  if (slug === "detail-tabs-timeline") {
    return "detail";
  }

  if (
    slug === "form-create-edit" ||
    slug === "settings-sectioned" ||
    slug === "onboarding-3-step" ||
    slug.startsWith("auth/")
  ) {
    return "form";
  }

  if (slug === "docs-home" || slug === "docs-article") {
    return "docs";
  }

  if (group === "docs") {
    return "docs";
  }

  return "marketing";
}

export function normalizeFrameworkCompatibilityRule(
  rule: Pick<FrameworkCompatibilityRule, "adapter" | "support"> &
    Partial<Omit<FrameworkCompatibilityRule, "adapter" | "support">>,
): FrameworkCompatibilityRule {
  const adapter = rule.adapter as FrameworkAdapterId;
  const base =
    defaultFrameworkCompatibility[adapter] ??
    ({
      adapter: rule.adapter,
      support: rule.support,
      adapterKind: "wc",
      renderer: "csr",
      portabilityLayer: "web-components",
      supportsSSR: false,
      notes: undefined,
      minimumAdapterVersion: undefined,
      requiredCapabilities: [],
    } satisfies FrameworkCompatibilityRule);

  return {
    ...base,
    adapter: rule.adapter,
    support: rule.support,
    adapterKind: rule.adapterKind ?? base.adapterKind,
    renderer: rule.renderer ?? base.renderer,
    portabilityLayer: rule.portabilityLayer ?? base.portabilityLayer,
    supportsSSR: rule.supportsSSR ?? base.supportsSSR,
    notes: rule.notes ?? base.notes,
    minimumAdapterVersion:
      rule.minimumAdapterVersion ?? base.minimumAdapterVersion,
    requiredCapabilities: cloneStringArray(
      rule.requiredCapabilities ?? base.requiredCapabilities,
    ),
  };
}

export function createFrameworkCompatibilityRules(
  overrides: CompatibilityOverrides = {},
) {
  return FRAMEWORK_ADAPTER_IDS.map((adapter) => {
    const base = defaultFrameworkCompatibility[adapter];
    const override = overrides[adapter];

    return {
      ...normalizeFrameworkCompatibilityRule({
        ...base,
        ...override,
        adapter,
        support: override?.support ?? base.support,
      }),
    };
  });
}

export function definePackManifest(
  manifest: Omit<PackManifest, "version" | keyof CatalogMetadata> &
    CatalogMetadataInput,
): PackManifest {
  const metadata = normalizeCatalogMetadata(manifest, {
    kind: "pack",
    slug: manifest.slug,
    sourceId: manifest.provenance?.sourceId ?? "builtin:first-party",
    installability: {
      installable: true,
      target: "theme-only",
      notes: "Pack ships through the token/runtime theme pipeline.",
    },
    tags: ["pack", manifest.tier],
  });

  return {
    version: PACK_MANIFEST_VERSION,
    ...metadata,
    ...manifest,
    knobs: cloneStringArray(manifest.knobs),
  };
}

export function defineTemplateManifest(
  manifest: Omit<
    TemplateManifest,
    "version" | "frameworks" | "install" | "layoutPreset" | keyof CatalogMetadata
  > & {
    frameworks?: FrameworkCompatibilityRule[];
    install?: Partial<TemplateInstallMetadata>;
    layoutPreset?: LayoutPreset;
  } & CatalogMetadataInput,
): TemplateManifest {
  const metadata = normalizeCatalogMetadata(manifest, {
    kind: "template",
    slug: manifest.slug,
    ownerPackage: "@shandapha/templates",
    sourceId: manifest.provenance?.sourceId ?? "builtin:first-party",
    installability: {
      installable: true,
      target: "starter",
      notes: "Template assets can be rendered into starter or patch output.",
    },
    tags: ["template", manifest.group],
  });

  return {
    version: TEMPLATE_MANIFEST_VERSION,
    ...metadata,
    ...manifest,
    layoutPreset:
      manifest.layoutPreset ?? inferLayoutPreset(manifest.slug, manifest.group),
    dataContract: {
      entities: cloneStringArray(manifest.dataContract.entities),
      slots: cloneStringArray(manifest.dataContract.slots),
      outputs: cloneStringArray(manifest.dataContract.outputs),
      samples: cloneStringArray(manifest.dataContract.samples),
    },
    states: cloneStringArray(manifest.states),
    variants: cloneStringArray(manifest.variants),
    blocks: cloneStringArray(manifest.blocks),
    related: cloneStringArray(manifest.related),
    surfaces: cloneStringArray(manifest.surfaces),
    featuredPackIds: [...manifest.featuredPackIds],
    frameworks:
      manifest.frameworks?.map((rule) =>
        normalizeFrameworkCompatibilityRule(rule),
      ) ?? createFrameworkCompatibilityRules(),
    install: {
      requiredPackages: cloneStringArray(manifest.install?.requiredPackages),
      requiredRoutes: cloneStringArray(manifest.install?.requiredRoutes),
      themeDependencies: cloneStringArray(
        manifest.install?.themeDependencies ?? ["theme.css", "tokens.json"],
      ),
      sampleDataBindings: cloneStringArray(
        manifest.install?.sampleDataBindings ?? manifest.dataContract.samples,
      ),
    },
  };
}

export function defineModuleManifest(
  manifest: Omit<
    ModuleManifest,
    "install" | "capabilities" | "minimumPlan" | "status" | keyof CatalogMetadata
  > & {
    capabilities?: Partial<ModuleManifest["capabilities"]>;
    install?: Partial<ModuleManifest["install"]>;
    minimumPlan?: PlanId;
    status?: ModuleStatus;
  } & CatalogMetadataInput,
): ModuleManifest {
  const minimumPlan =
    manifest.minimumPlan ?? (manifest.premium ? "premium" : "free");
  const metadata = normalizeCatalogMetadata(manifest, {
    kind: "module",
    slug: manifest.id,
    ownerPackage: manifest.packageName,
    sourceId: manifest.provenance?.sourceId ?? "builtin:first-party",
    supportLevel: manifest.sourceKind === "first-party" ? "first-party" : "community",
    installability: {
      installable: (manifest.status ?? "installable") === "installable",
      target: "patch",
      notes: "Module installs through generator patch and package registration.",
    },
    tags: ["module", minimumPlan],
  });

  return {
    ...metadata,
    ...manifest,
    minimumPlan,
    status: manifest.status ?? "installable",
    capabilities: {
      free: cloneStringArray(manifest.capabilities?.free),
      premium: cloneStringArray(manifest.capabilities?.premium),
      business: cloneStringArray(manifest.capabilities?.business),
    },
    install: {
      requiredPackages: cloneStringArray(manifest.install?.requiredPackages),
      requiredRoutes: cloneStringArray(manifest.install?.requiredRoutes),
      frameworks:
        manifest.install?.frameworks?.map((rule) =>
          normalizeFrameworkCompatibilityRule(rule),
        ) ?? createFrameworkCompatibilityRules(),
    },
  };
}

export function defineRegistryManifest(
  manifest: Omit<RegistryManifest, "version" | "frameworkAdapters"> & {
    frameworkAdapters?: FrameworkCompatibilityRule[];
  },
): RegistryManifest {
  return {
    version: REGISTRY_MANIFEST_VERSION,
    frameworkAdapters:
      manifest.frameworkAdapters?.map((rule) =>
        normalizeFrameworkCompatibilityRule(rule),
      ) ?? createFrameworkCompatibilityRules(),
    ...manifest,
  };
}

export function defineRegistryItemManifest(
  manifest: Omit<
    RegistryItemManifest,
    "version" | "install" | keyof CatalogMetadata
  > & {
    install: Omit<RegistryInstallMetadata, "frameworks"> & {
      frameworks?: FrameworkCompatibilityRule[];
    };
  } & CatalogMetadataInput,
): RegistryItemManifest {
  const metadata = normalizeCatalogMetadata(manifest, {
    kind: manifest.type,
    slug: manifest.name,
    ownerPackage: manifest.ownerPackage,
    sourceId: manifest.provenance?.sourceId ?? "builtin:first-party",
    installability: {
      installable: true,
      target: "patch",
      notes: "Registry item can be installed or referenced from catalog surfaces.",
    },
    tags: manifest.categories,
  });

  return {
    version: REGISTRY_ITEM_MANIFEST_VERSION,
    ...metadata,
    ...manifest,
    categories: cloneStringArray(manifest.categories),
    dependencies: cloneStringArray(manifest.dependencies),
    registryDependencies: cloneStringArray(manifest.registryDependencies),
    files: manifest.files?.map((file) => ({ ...file })) ?? [],
    install: {
      targetPaths: cloneStringArray(manifest.install.targetPaths),
      runtimeDependencies: cloneStringArray(
        manifest.install.runtimeDependencies,
      ),
      peerDependencies: cloneStringArray(manifest.install.peerDependencies),
      templateDependencies: cloneStringArray(
        manifest.install.templateDependencies,
      ),
      routeNeeds: cloneStringArray(manifest.install.routeNeeds),
      minimumPlan: manifest.install.minimumPlan,
      freeAlternative: manifest.install.freeAlternative,
      frameworks:
        manifest.install.frameworks?.map((rule) =>
          normalizeFrameworkCompatibilityRule(rule),
        ) ?? createFrameworkCompatibilityRules(),
      patchRules: cloneStringArray(manifest.install.patchRules),
    },
  };
}

export function defineCatalogSourceConfig(
  source: Omit<CatalogSourceConfig, "workspaceIds" | "allowedNamespaces"> & {
    workspaceIds?: string[];
    allowedNamespaces?: string[];
  },
): CatalogSourceConfig {
  return {
    ...source,
    enabled: source.enabled ?? true,
    workspaceIds: cloneStringArray(source.workspaceIds),
    allowedNamespaces: cloneStringArray(source.allowedNamespaces),
  };
}

export function defineCatalogPolicy(
  policy: Omit<
    CatalogPolicy,
    | "allowedNamespaces"
    | "allowedSupportLevels"
    | "allowedStabilities"
    | "approvedRegistryIds"
    | "approvedVersions"
    | "lockedPackRegistryIds"
    | "lockedTemplateRegistryIds"
    | "lockedModuleRegistryIds"
  > & {
    allowedNamespaces?: string[];
    allowedSupportLevels?: CatalogSupportLevel[];
    allowedStabilities?: CatalogStability[];
    approvedRegistryIds?: string[];
    approvedVersions?: string[];
    lockedPackRegistryIds?: string[];
    lockedTemplateRegistryIds?: string[];
    lockedModuleRegistryIds?: string[];
  },
): CatalogPolicy {
  return {
    ...policy,
    allowedNamespaces: cloneStringArray(policy.allowedNamespaces),
    allowedSupportLevels:
      policy.allowedSupportLevels?.map((value) => value) ?? [
        "first-party",
        "internal",
        "verified",
      ],
    allowedStabilities:
      policy.allowedStabilities?.map((value) => value) ?? ["stable", "preview"],
    approvedRegistryIds: cloneStringArray(policy.approvedRegistryIds),
    approvedVersions: cloneStringArray(policy.approvedVersions),
    lockedPackRegistryIds: cloneStringArray(policy.lockedPackRegistryIds),
    lockedTemplateRegistryIds: cloneStringArray(policy.lockedTemplateRegistryIds),
    lockedModuleRegistryIds: cloneStringArray(policy.lockedModuleRegistryIds),
  };
}

export function defineCatalogConfig(
  config: Omit<CatalogConfig, "version" | "sources" | "policies"> & {
    sources?: CatalogSourceConfig[];
    policies?: CatalogPolicy[];
  },
): CatalogConfig {
  return {
    version: CATALOG_CONFIG_VERSION,
    sources: (config.sources ?? []).map((source) =>
      defineCatalogSourceConfig(source),
    ),
    policies: (config.policies ?? []).map((policy) =>
      defineCatalogPolicy(policy),
    ),
  };
}

export function defineCatalogApproval(
  approval: CatalogApproval,
): CatalogApproval {
  return {
    ...approval,
  };
}

export function defineCatalogTemplateAssetManifest(
  asset: CatalogTemplateAssetManifest,
): CatalogTemplateAssetManifest {
  return {
    ...asset,
    files: Object.fromEntries(
      Object.entries(asset.files).map(([framework, paths]) => [
        framework,
        cloneStringArray(paths),
      ]),
    ) as Partial<Record<FrameworkAdapterId, string[]>>,
    states: cloneStringArray(asset.states),
    variants: cloneStringArray(asset.variants),
    samples: cloneStringArray(asset.samples),
  };
}

export function defineCatalogSourceManifest(
  manifest: Omit<CatalogSourceManifest, "version">,
): CatalogSourceManifest {
  return {
    version: CATALOG_SOURCE_MANIFEST_VERSION,
    source: defineCatalogSourceConfig(manifest.source),
    packs: manifest.packs.map((pack) => definePackManifest(pack)),
    templates: manifest.templates.map((template) =>
      defineTemplateManifest(template),
    ),
    templateAssets: manifest.templateAssets.map((asset) =>
      defineCatalogTemplateAssetManifest(asset),
    ),
    modules: manifest.modules.map((module) => defineModuleManifest(module)),
    components: manifest.components.map((item) =>
      defineRegistryItemManifest(item),
    ),
    blocks: manifest.blocks.map((item) => defineRegistryItemManifest(item)),
    charts: manifest.charts.map((item) => defineRegistryItemManifest(item)),
    shells: manifest.shells.map((item) => defineRegistryItemManifest(item)),
    approvals: manifest.approvals.map((approval) =>
      defineCatalogApproval(approval),
    ),
  };
}
