import {
  assertValidationResult,
  type ContractIssue,
  createValidationResult,
  expectArray,
  expectBoolean,
  expectEnum,
  expectLiteral,
  expectOptionalPositiveInteger,
  expectOptionalString,
  expectOptionalStringArray,
  expectRecord,
  expectString,
  expectStringArray,
} from "../shared/validation";
import {
  APPROVAL_STATUSES,
  ADAPTER_KINDS,
  ADAPTER_RENDERERS,
  CATALOG_CONFIG_VERSION,
  CATALOG_SOURCE_CONFIG_KINDS,
  CATALOG_SOURCE_KINDS,
  CATALOG_SOURCE_MANIFEST_VERSION,
  CATALOG_STABILITY_LEVELS,
  CATALOG_SUPPORT_LEVELS,
  CATALOG_TRUST_LEVELS,
  CATALOG_VISIBILITIES,
  type CatalogApproval,
  type CatalogConfig,
  type CatalogDeprecation,
  type CatalogInstallability,
  type CatalogOwner,
  type CatalogPolicy,
  type CatalogPreview,
  type CatalogProvenance,
  type CatalogSourceConfig,
  type CatalogSourceManifest,
  type CatalogTemplateAssetManifest,
  FRAMEWORK_SUPPORT_STATUSES,
  type FrameworkCompatibilityRule,
  inferLayoutPreset,
  LAYOUT_PRESET_IDS,
  MODULE_STATUSES,
  type ModuleManifest,
  normalizeFrameworkCompatibilityRule,
  PACK_IDS,
  PACK_MANIFEST_VERSION,
  type PackManifest,
  PLAN_IDS,
  PORTABILITY_LAYERS,
  REGISTRY_FILE_ROLES,
  REGISTRY_ITEM_MANIFEST_VERSION,
  REGISTRY_ITEM_TYPES,
  REGISTRY_MANIFEST_VERSION,
  type RegistryFileManifest,
  type RegistryInstallMetadata,
  type RegistryItemManifest,
  type RegistryManifest,
  type RegistryWorkspaceManifest,
  SHELL_IDS,
  TEMPLATE_MANIFEST_VERSION,
  type TemplateDataContract,
  type TemplateInstallMetadata,
  type TemplateManifest,
  POLICY_MODES,
} from "./stable.contracts";

function parseFrameworkCompatibilityRule(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): FrameworkCompatibilityRule | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const adapter = expectString(record.adapter, `${path}.adapter`, issues);
  const support = expectEnum(
    record.support,
    FRAMEWORK_SUPPORT_STATUSES,
    `${path}.support`,
    issues,
  );
  const notes = expectOptionalString(record.notes, `${path}.notes`, issues);
  const minimumAdapterVersion = expectOptionalPositiveInteger(
    record.minimumAdapterVersion,
    `${path}.minimumAdapterVersion`,
    issues,
  );
  const adapterKind =
    record.adapterKind === undefined
      ? undefined
      : expectEnum(
          record.adapterKind,
          ADAPTER_KINDS,
          `${path}.adapterKind`,
          issues,
        );
  const renderer =
    record.renderer === undefined
      ? undefined
      : expectEnum(
          record.renderer,
          ADAPTER_RENDERERS,
          `${path}.renderer`,
          issues,
        );
  const portabilityLayer =
    record.portabilityLayer === undefined
      ? undefined
      : expectEnum(
          record.portabilityLayer,
          PORTABILITY_LAYERS,
          `${path}.portabilityLayer`,
          issues,
        );
  const supportsSSR =
    record.supportsSSR === undefined
      ? undefined
      : expectBoolean(record.supportsSSR, `${path}.supportsSSR`, issues);
  const requiredCapabilities = expectStringArray(
    record.requiredCapabilities,
    `${path}.requiredCapabilities`,
    issues,
  );

  if (!adapter || !support) {
    return undefined;
  }

  return {
    ...normalizeFrameworkCompatibilityRule({
      adapter,
      support,
      adapterKind,
      renderer,
      portabilityLayer,
      supportsSSR,
      notes,
      minimumAdapterVersion,
      requiredCapabilities,
    }),
  };
}

function parseTemplateDataContract(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): TemplateDataContract | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  return {
    entities: expectStringArray(record.entities, `${path}.entities`, issues),
    slots: expectStringArray(record.slots, `${path}.slots`, issues),
    outputs: expectStringArray(record.outputs, `${path}.outputs`, issues),
    samples: expectStringArray(record.samples, `${path}.samples`, issues),
  };
}

function parseTemplateInstallMetadata(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): TemplateInstallMetadata | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  return {
    requiredPackages: expectStringArray(
      record.requiredPackages,
      `${path}.requiredPackages`,
      issues,
    ),
    requiredRoutes: expectStringArray(
      record.requiredRoutes,
      `${path}.requiredRoutes`,
      issues,
    ),
    themeDependencies: expectStringArray(
      record.themeDependencies,
      `${path}.themeDependencies`,
      issues,
    ),
    sampleDataBindings: expectStringArray(
      record.sampleDataBindings,
      `${path}.sampleDataBindings`,
      issues,
    ),
  };
}

function parseCatalogDeprecation(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): CatalogDeprecation | undefined {
  if (value === undefined) {
    return undefined;
  }

  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const message = expectString(record.message, `${path}.message`, issues);
  const replacedByRegistryId = expectOptionalString(
    record.replacedByRegistryId,
    `${path}.replacedByRegistryId`,
    issues,
  );
  const removalVersion = expectOptionalString(
    record.removalVersion,
    `${path}.removalVersion`,
    issues,
  );

  if (!message) {
    return undefined;
  }

  return {
    message,
    replacedByRegistryId,
    removalVersion,
  };
}

function parseCatalogPreview(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): CatalogPreview | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const title = expectString(record.title, `${path}.title`, issues);
  const href = expectString(record.href, `${path}.href`, issues);
  const type = expectEnum(
    record.type,
    ["image", "story", "doc"] as const,
    `${path}.type`,
    issues,
  );

  if (!title || !href || !type) {
    return undefined;
  }

  return {
    title,
    href,
    type,
  };
}

function parseCatalogOwner(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): CatalogOwner | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const id = expectString(record.id, `${path}.id`, issues);
  const label = expectString(record.label, `${path}.label`, issues);
  const homepage = expectOptionalString(
    record.homepage,
    `${path}.homepage`,
    issues,
  );
  const packageName = expectOptionalString(
    record.packageName,
    `${path}.packageName`,
    issues,
  );

  if (!id || !label) {
    return undefined;
  }

  return {
    id,
    label,
    homepage,
    packageName,
  };
}

function parseCatalogProvenance(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): CatalogProvenance | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const sourceId = expectString(record.sourceId, `${path}.sourceId`, issues);
  const checksum = expectOptionalString(
    record.checksum,
    `${path}.checksum`,
    issues,
  );
  const manifestPath = expectOptionalString(
    record.manifestPath,
    `${path}.manifestPath`,
    issues,
  );
  const assetPath = expectOptionalString(
    record.assetPath,
    `${path}.assetPath`,
    issues,
  );

  if (!sourceId) {
    return undefined;
  }

  return {
    sourceId,
    checksum,
    manifestPath,
    assetPath,
  };
}

function parseCatalogInstallability(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): CatalogInstallability | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const installable = expectBoolean(
    record.installable,
    `${path}.installable`,
    issues,
  );
  const target = expectEnum(
    record.target,
    ["starter", "patch", "theme-only", "discovery"] as const,
    `${path}.target`,
    issues,
  );
  const notes = expectOptionalString(record.notes, `${path}.notes`, issues);

  if (installable === undefined || !target) {
    return undefined;
  }

  return {
    installable,
    target,
    notes,
  };
}

function parseCatalogMetadata(
  value: unknown,
  path: string,
  issues: ContractIssue[],
  fallback: {
    kind: "pack" | "template" | "module" | "component" | "block" | "chart" | "shell";
    slug: string;
    ownerPackage?: string;
    sourceId?: string;
    sourceKind?: "first-party" | "org" | "community";
    supportLevel?: "first-party" | "internal" | "verified" | "community";
    visibility?: "public" | "org" | "workspace";
    installability: CatalogInstallability;
    tags?: string[];
  },
) {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const namespaceValue =
    record.namespace === undefined
      ? "shandapha"
      : expectString(record.namespace, `${path}.namespace`, issues);
  const namespace = namespaceValue ?? "shandapha";
  const registryId =
    record.registryId === undefined
      ? `${namespace}::${fallback.kind}::${fallback.slug}`
      : expectString(record.registryId, `${path}.registryId`, issues);
  const sourceKind =
    record.sourceKind === undefined
      ? fallback.sourceKind ?? "first-party"
      : expectEnum(
          record.sourceKind,
          CATALOG_SOURCE_KINDS,
          `${path}.sourceKind`,
          issues,
        );
  const visibility =
    record.visibility === undefined
      ? fallback.visibility ??
        ((fallback.sourceKind ?? "first-party") === "first-party"
          ? "public"
          : "org")
      : expectEnum(
          record.visibility,
          CATALOG_VISIBILITIES,
          `${path}.visibility`,
          issues,
        );
  const supportLevel =
    record.supportLevel === undefined
      ? fallback.supportLevel ?? "first-party"
      : expectEnum(
          record.supportLevel,
          CATALOG_SUPPORT_LEVELS,
          `${path}.supportLevel`,
          issues,
        );
  const trustLevel =
    record.trustLevel === undefined
      ? sourceKind === "first-party"
        ? "verified"
        : "checksum-verified"
      : expectEnum(
          record.trustLevel,
          CATALOG_TRUST_LEVELS,
          `${path}.trustLevel`,
          issues,
        );
  const stability =
    record.stability === undefined
      ? "stable"
      : expectEnum(
          record.stability,
          CATALOG_STABILITY_LEVELS,
          `${path}.stability`,
          issues,
        );
  const deprecation = parseCatalogDeprecation(
    record.deprecation,
    `${path}.deprecation`,
    issues,
  );
  const previews =
    record.previews === undefined
      ? []
      : expectArray(
          record.previews,
          `${path}.previews`,
          issues,
          parseCatalogPreview,
        );
  const tags =
    record.tags === undefined
      ? [...(fallback.tags ?? [])]
      : expectStringArray(record.tags, `${path}.tags`, issues);
  const owner =
    record.owner === undefined
      ? {
          id: namespace,
          label:
            sourceKind === "first-party"
              ? "Shandapha"
              : namespace.replace(/^org\//, "").replace(/^community\//, ""),
          packageName: fallback.ownerPackage,
        }
      : parseCatalogOwner(record.owner, `${path}.owner`, issues);
  const provenance =
    record.provenance === undefined
      ? {
          sourceId: fallback.sourceId ?? "builtin:first-party",
        }
      : parseCatalogProvenance(record.provenance, `${path}.provenance`, issues);
  const installability =
    record.installability === undefined
      ? fallback.installability
      : parseCatalogInstallability(
          record.installability,
          `${path}.installability`,
          issues,
        );

  if (
    !registryId ||
    !namespace ||
    !sourceKind ||
    !visibility ||
    !supportLevel ||
    !trustLevel ||
    !stability ||
    !owner ||
    !provenance ||
    !installability
  ) {
    return undefined;
  }

  return {
    registryId,
    namespace,
    sourceKind,
    visibility,
    supportLevel,
    trustLevel,
    stability,
    deprecation,
    previews,
    tags,
    owner,
    provenance,
    installability,
  };
}

function parsePackManifest(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): PackManifest | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    PACK_MANIFEST_VERSION,
    `${path}.version`,
    issues,
  );
  const id = expectEnum(record.id, PACK_IDS, `${path}.id`, issues);
  const slug = expectString(record.slug, `${path}.slug`, issues);
  const name = expectString(record.name, `${path}.name`, issues);
  const tier = expectEnum(record.tier, PLAN_IDS, `${path}.tier`, issues);
  const tagline = expectString(record.tagline, `${path}.tagline`, issues);
  const description = expectString(
    record.description,
    `${path}.description`,
    issues,
  );
  const knobs = expectStringArray(record.knobs, `${path}.knobs`, issues);
  const metadata = parseCatalogMetadata(record, path, issues, {
    kind: "pack",
    slug: slug ?? id ?? "unknown-pack",
    sourceId: "builtin:first-party",
    installability: {
      installable: true,
      target: "theme-only",
      notes: "Pack ships through the token/runtime theme pipeline.",
    },
    tags: ["pack", tier ?? "free"],
  });

  if (
    !version ||
    !id ||
    !slug ||
    !name ||
    !tier ||
    !tagline ||
    !description ||
    !metadata
  ) {
    return undefined;
  }

  return {
    version,
    ...metadata,
    id,
    slug,
    name,
    tier,
    tagline,
    description,
    knobs,
  };
}

function parseModuleManifest(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): ModuleManifest | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const id = expectString(record.id, `${path}.id`, issues);
  const name = expectString(record.name, `${path}.name`, issues);
  const packageName = expectString(
    record.packageName,
    `${path}.packageName`,
    issues,
  );
  const description = expectString(
    record.description,
    `${path}.description`,
    issues,
  );
  const premium = expectBoolean(record.premium, `${path}.premium`, issues);
  const minimumPlan =
    record.minimumPlan === undefined
      ? premium
        ? "premium"
        : "free"
      : expectEnum(record.minimumPlan, PLAN_IDS, `${path}.minimumPlan`, issues);
  const status =
    record.status === undefined
      ? "installable"
      : expectEnum(record.status, MODULE_STATUSES, `${path}.status`, issues);
  const capabilitiesRecord = record.capabilities
    ? expectRecord(record.capabilities, `${path}.capabilities`, issues)
    : undefined;
  const installRecord = record.install
    ? expectRecord(record.install, `${path}.install`, issues)
    : undefined;
  const metadata = parseCatalogMetadata(record, path, issues, {
    kind: "module",
    slug: id ?? "unknown-module",
    ownerPackage: packageName ?? undefined,
    sourceId: "builtin:first-party",
    installability: {
      installable: status === "installable",
      target: "patch",
      notes: "Module installs through generator patch and package registration.",
    },
    tags: ["module", minimumPlan ?? "free"],
  });

  if (
    !id ||
    !name ||
    !packageName ||
    !description ||
    premium === undefined ||
    !minimumPlan ||
    !status ||
    !metadata
  ) {
    return undefined;
  }

  return {
    ...metadata,
    id,
    name,
    packageName,
    description,
    premium,
    minimumPlan,
    status,
    capabilities: {
      free: expectStringArray(
        capabilitiesRecord?.free ?? [],
        `${path}.capabilities.free`,
        issues,
      ),
      premium: expectStringArray(
        capabilitiesRecord?.premium ?? [],
        `${path}.capabilities.premium`,
        issues,
      ),
      business: expectStringArray(
        capabilitiesRecord?.business ?? [],
        `${path}.capabilities.business`,
        issues,
      ),
    },
    install: {
      requiredPackages: expectStringArray(
        installRecord?.requiredPackages ?? [],
        `${path}.install.requiredPackages`,
        issues,
      ),
      requiredRoutes: expectStringArray(
        installRecord?.requiredRoutes ?? [],
        `${path}.install.requiredRoutes`,
        issues,
      ),
      frameworks: installRecord?.frameworks
        ? expectArray(
            installRecord.frameworks,
            `${path}.install.frameworks`,
            issues,
            parseFrameworkCompatibilityRule,
          )
        : [],
    },
  };
}

function parseTemplateManifest(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): TemplateManifest | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    TEMPLATE_MANIFEST_VERSION,
    `${path}.version`,
    issues,
  );
  const slug = expectString(record.slug, `${path}.slug`, issues);
  const name = expectString(record.name, `${path}.name`, issues);
  const group = expectString(record.group, `${path}.group`, issues);
  const layoutPreset =
    record.layoutPreset === undefined
      ? undefined
      : expectEnum(
          record.layoutPreset,
          LAYOUT_PRESET_IDS,
          `${path}.layoutPreset`,
          issues,
        );
  const shell = expectEnum(record.shell, SHELL_IDS, `${path}.shell`, issues);
  const summary = expectString(record.summary, `${path}.summary`, issues);
  const states = expectStringArray(record.states, `${path}.states`, issues);
  const variants = expectStringArray(
    record.variants,
    `${path}.variants`,
    issues,
  );
  const blocks = expectStringArray(record.blocks, `${path}.blocks`, issues);
  const related = expectStringArray(record.related, `${path}.related`, issues);
  const surfaces = expectStringArray(
    record.surfaces,
    `${path}.surfaces`,
    issues,
  );
  const featuredPackIds = expectArray(
    record.featuredPackIds,
    `${path}.featuredPackIds`,
    issues,
    (item, itemPath, itemIssues) =>
      expectEnum(item, PACK_IDS, itemPath, itemIssues),
  );
  const dataContract = parseTemplateDataContract(
    record.dataContract,
    `${path}.dataContract`,
    issues,
  );
  const frameworks = expectArray(
    record.frameworks,
    `${path}.frameworks`,
    issues,
    parseFrameworkCompatibilityRule,
  );
  const install = parseTemplateInstallMetadata(
    record.install,
    `${path}.install`,
    issues,
  );
  const metadata = parseCatalogMetadata(record, path, issues, {
    kind: "template",
    slug: slug ?? "unknown-template",
    ownerPackage: "@shandapha/templates",
    sourceId: "builtin:first-party",
    installability: {
      installable: true,
      target: "starter",
      notes: "Template assets can be rendered into starter or patch output.",
    },
    tags: ["template", group ?? "unknown"],
  });

  if (
    !version ||
    !slug ||
    !name ||
    !group ||
    !shell ||
    !summary ||
    !dataContract ||
    !install ||
    !metadata
  ) {
    return undefined;
  }

  return {
    version,
    ...metadata,
    slug,
    name,
    group,
    layoutPreset: layoutPreset ?? inferLayoutPreset(slug, group),
    shell,
    summary,
    states,
    variants,
    blocks,
    related,
    surfaces,
    featuredPackIds,
    dataContract,
    frameworks,
    install,
  };
}

function parseRegistryFileManifest(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): RegistryFileManifest | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const filePath = expectString(record.path, `${path}.path`, issues);
  const target = expectString(record.target, `${path}.target`, issues);
  const role = expectEnum(
    record.role,
    REGISTRY_FILE_ROLES,
    `${path}.role`,
    issues,
  );
  const ownerPackage = expectString(
    record.ownerPackage,
    `${path}.ownerPackage`,
    issues,
  );

  if (!filePath || !target || !role || !ownerPackage) {
    return undefined;
  }

  return {
    path: filePath,
    target,
    role,
    ownerPackage,
  };
}

function parseRegistryInstallMetadata(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): RegistryInstallMetadata | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const minimumPlan =
    record.minimumPlan === undefined
      ? "free"
      : expectEnum(record.minimumPlan, PLAN_IDS, `${path}.minimumPlan`, issues);

  return {
    targetPaths: expectStringArray(
      record.targetPaths,
      `${path}.targetPaths`,
      issues,
    ),
    runtimeDependencies: expectStringArray(
      record.runtimeDependencies,
      `${path}.runtimeDependencies`,
      issues,
    ),
    peerDependencies: expectStringArray(
      record.peerDependencies,
      `${path}.peerDependencies`,
      issues,
    ),
    templateDependencies: expectStringArray(
      record.templateDependencies,
      `${path}.templateDependencies`,
      issues,
    ),
    routeNeeds: expectStringArray(
      record.routeNeeds ?? [],
      `${path}.routeNeeds`,
      issues,
    ),
    minimumPlan: minimumPlan ?? "free",
    freeAlternative: expectOptionalString(
      record.freeAlternative,
      `${path}.freeAlternative`,
      issues,
    ),
    frameworks: expectArray(
      record.frameworks,
      `${path}.frameworks`,
      issues,
      parseFrameworkCompatibilityRule,
    ),
    patchRules: expectStringArray(
      record.patchRules,
      `${path}.patchRules`,
      issues,
    ),
  };
}

function parseRegistryItemManifest(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): RegistryItemManifest | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    REGISTRY_ITEM_MANIFEST_VERSION,
    `${path}.version`,
    issues,
  );
  const name = expectString(record.name, `${path}.name`, issues);
  const title = expectString(record.title, `${path}.title`, issues);
  const description = expectString(
    record.description,
    `${path}.description`,
    issues,
  );
  const type = expectEnum(
    record.type,
    REGISTRY_ITEM_TYPES,
    `${path}.type`,
    issues,
  );
  const ownerPackage = expectString(
    record.ownerPackage,
    `${path}.ownerPackage`,
    issues,
  );
  const installTarget = expectString(
    record.installTarget,
    `${path}.installTarget`,
    issues,
  );
  const categories = expectStringArray(
    record.categories,
    `${path}.categories`,
    issues,
  );
  const dependencies = expectOptionalStringArray(
    record.dependencies,
    `${path}.dependencies`,
    issues,
  );
  const registryDependencies = expectOptionalStringArray(
    record.registryDependencies,
    `${path}.registryDependencies`,
    issues,
  );
  const files = record.files
    ? expectArray(
        record.files,
        `${path}.files`,
        issues,
        parseRegistryFileManifest,
      )
    : undefined;
  const install = parseRegistryInstallMetadata(
    record.install,
    `${path}.install`,
    issues,
  );
  const metadata = parseCatalogMetadata(record, path, issues, {
    kind: type ?? "component",
    slug: name ?? "unknown-item",
    ownerPackage: ownerPackage ?? undefined,
    sourceId: "builtin:first-party",
    installability: {
      installable: true,
      target: "patch",
      notes: "Registry item can be installed or referenced from catalog surfaces.",
    },
    tags: categories,
  });

  if (
    !version ||
    !name ||
    !title ||
    !description ||
    !type ||
    !ownerPackage ||
    !installTarget ||
    !install ||
    !metadata
  ) {
    return undefined;
  }

  return {
    version,
    ...metadata,
    name,
    title,
    description,
    type,
    ownerPackage,
    installTarget,
    categories,
    dependencies,
    registryDependencies,
    files,
    install,
  };
}

function parseAliases(value: unknown, path: string, issues: ContractIssue[]) {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const aliases: Record<string, string> = {};

  Object.entries(record).forEach(([key, aliasValue]) => {
    const parsed = expectString(aliasValue, `${path}.${key}`, issues);

    if (parsed !== undefined) {
      aliases[key] = parsed;
    }
  });

  return aliases;
}

function parseRegistryWorkspaceManifest(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): RegistryWorkspaceManifest | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const name = expectString(record.name, `${path}.name`, issues);
  const workspacePath = expectString(record.path, `${path}.path`, issues);
  const ownerPackage = expectString(
    record.ownerPackage,
    `${path}.ownerPackage`,
    issues,
  );
  const cssPath = expectString(record.cssPath, `${path}.cssPath`, issues);
  const aliases = parseAliases(record.aliases, `${path}.aliases`, issues);

  if (!name || !workspacePath || !ownerPackage || !cssPath || !aliases) {
    return undefined;
  }

  return {
    name,
    path: workspacePath,
    ownerPackage,
    cssPath,
    aliases,
  };
}

function parseRegistryManifest(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): RegistryManifest | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    REGISTRY_MANIFEST_VERSION,
    `${path}.version`,
    issues,
  );
  const frameworkAdapters = expectArray(
    record.frameworkAdapters,
    `${path}.frameworkAdapters`,
    issues,
    parseFrameworkCompatibilityRule,
  );
  const packs = expectArray(
    record.packs,
    `${path}.packs`,
    issues,
    parsePackManifest,
  );
  const templates = expectArray(
    record.templates,
    `${path}.templates`,
    issues,
    parseTemplateManifest,
  );
  const modules = expectArray(
    record.modules,
    `${path}.modules`,
    issues,
    parseModuleManifest,
  );
  const components = expectArray(
    record.components,
    `${path}.components`,
    issues,
    parseRegistryItemManifest,
  );
  const blocks = expectArray(
    record.blocks,
    `${path}.blocks`,
    issues,
    parseRegistryItemManifest,
  );
  const charts = expectArray(
    record.charts,
    `${path}.charts`,
    issues,
    parseRegistryItemManifest,
  );
  const shells = expectArray(
    record.shells,
    `${path}.shells`,
    issues,
    parseRegistryItemManifest,
  );
  const workspaces = expectArray(
    record.workspaces,
    `${path}.workspaces`,
    issues,
    parseRegistryWorkspaceManifest,
  );

  if (!version) {
    return undefined;
  }

  return {
    version,
    frameworkAdapters,
    packs,
    templates,
    modules,
    components,
    blocks,
    charts,
    shells,
    workspaces,
  };
}

function parseCatalogSourceConfig(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): CatalogSourceConfig | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const id = expectString(record.id, `${path}.id`, issues);
  const kind = expectEnum(
    record.kind,
    CATALOG_SOURCE_CONFIG_KINDS,
    `${path}.kind`,
    issues,
  );
  const label = expectString(record.label, `${path}.label`, issues);
  const enabled =
    record.enabled === undefined
      ? true
      : expectBoolean(record.enabled, `${path}.enabled`, issues);
  const namespace = expectOptionalString(
    record.namespace,
    `${path}.namespace`,
    issues,
  );
  const sourcePath = expectOptionalString(record.path, `${path}.path`, issues);
  const url = expectOptionalString(record.url, `${path}.url`, issues);
  const workspaceIds = expectStringArray(
    record.workspaceIds ?? [],
    `${path}.workspaceIds`,
    issues,
  );
  const allowedNamespaces = expectStringArray(
    record.allowedNamespaces ?? [],
    `${path}.allowedNamespaces`,
    issues,
  );

  if (!id || !kind || !label || enabled === undefined) {
    return undefined;
  }

  return {
    id,
    kind,
    label,
    enabled,
    namespace,
    path: sourcePath,
    url,
    workspaceIds,
    allowedNamespaces,
  };
}

function parseCatalogPolicy(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): CatalogPolicy | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const id = expectString(record.id, `${path}.id`, issues);
  const name = expectString(record.name, `${path}.name`, issues);
  const mode = expectEnum(record.mode, POLICY_MODES, `${path}.mode`, issues);
  const allowedNamespaces = expectStringArray(
    record.allowedNamespaces ?? [],
    `${path}.allowedNamespaces`,
    issues,
  );
  const allowedSupportLevels = expectArray(
    record.allowedSupportLevels ?? [],
    `${path}.allowedSupportLevels`,
    issues,
    (entry, entryPath, entryIssues) =>
      expectEnum(entry, CATALOG_SUPPORT_LEVELS, entryPath, entryIssues),
  );
  const allowedStabilities = expectArray(
    record.allowedStabilities ?? [],
    `${path}.allowedStabilities`,
    issues,
    (entry, entryPath, entryIssues) =>
      expectEnum(entry, CATALOG_STABILITY_LEVELS, entryPath, entryIssues),
  );
  const approvedRegistryIds = expectStringArray(
    record.approvedRegistryIds ?? [],
    `${path}.approvedRegistryIds`,
    issues,
  );
  const approvedVersions = expectStringArray(
    record.approvedVersions ?? [],
    `${path}.approvedVersions`,
    issues,
  );
  const lockedPackRegistryIds = expectStringArray(
    record.lockedPackRegistryIds ?? [],
    `${path}.lockedPackRegistryIds`,
    issues,
  );
  const lockedTemplateRegistryIds = expectStringArray(
    record.lockedTemplateRegistryIds ?? [],
    `${path}.lockedTemplateRegistryIds`,
    issues,
  );
  const lockedModuleRegistryIds = expectStringArray(
    record.lockedModuleRegistryIds ?? [],
    `${path}.lockedModuleRegistryIds`,
    issues,
  );
  const allowCommunity =
    record.allowCommunity === undefined
      ? false
      : expectBoolean(record.allowCommunity, `${path}.allowCommunity`, issues);
  const allowExperimental =
    record.allowExperimental === undefined
      ? false
      : expectBoolean(
          record.allowExperimental,
          `${path}.allowExperimental`,
          issues,
        );
  const allowDeprecated =
    record.allowDeprecated === undefined
      ? false
      : expectBoolean(
          record.allowDeprecated,
          `${path}.allowDeprecated`,
          issues,
        );

  if (
    !id ||
    !name ||
    !mode ||
    allowCommunity === undefined ||
    allowExperimental === undefined ||
    allowDeprecated === undefined
  ) {
    return undefined;
  }

  return {
    id,
    name,
    mode,
    allowedNamespaces,
    allowedSupportLevels,
    allowedStabilities,
    approvedRegistryIds,
    approvedVersions,
    lockedPackRegistryIds,
    lockedTemplateRegistryIds,
    lockedModuleRegistryIds,
    allowCommunity,
    allowExperimental,
    allowDeprecated,
  };
}

function parseCatalogApproval(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): CatalogApproval | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const id = expectString(record.id, `${path}.id`, issues);
  const registryId = expectString(record.registryId, `${path}.registryId`, issues);
  const sourceId = expectString(record.sourceId, `${path}.sourceId`, issues);
  const status = expectEnum(
    record.status,
    APPROVAL_STATUSES,
    `${path}.status`,
    issues,
  );
  const approver = expectString(record.approver, `${path}.approver`, issues);
  const scope = expectEnum(
    record.scope,
    ["org", "workspace"] as const,
    `${path}.scope`,
    issues,
  );
  const notes = expectOptionalString(record.notes, `${path}.notes`, issues);
  const approvedVersion = expectOptionalString(
    record.approvedVersion,
    `${path}.approvedVersion`,
    issues,
  );
  const approvedAt = expectString(record.approvedAt, `${path}.approvedAt`, issues);

  if (
    !id ||
    !registryId ||
    !sourceId ||
    !status ||
    !approver ||
    !scope ||
    !approvedAt
  ) {
    return undefined;
  }

  return {
    id,
    registryId,
    sourceId,
    status,
    approver,
    scope,
    notes,
    approvedVersion,
    approvedAt,
  };
}

function parseCatalogTemplateAssetManifest(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): CatalogTemplateAssetManifest | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const registryId = expectString(record.registryId, `${path}.registryId`, issues);
  const rootDir = expectString(record.rootDir, `${path}.rootDir`, issues);
  const readmePath = expectString(record.readmePath, `${path}.readmePath`, issues);
  const previewPath = expectString(
    record.previewPath,
    `${path}.previewPath`,
    issues,
  );
  const filesRecord = expectRecord(record.files, `${path}.files`, issues);
  const files: Partial<Record<string, string[]>> = {};

  Object.entries(filesRecord ?? {}).forEach(([framework, fileList]) => {
    files[framework] = expectStringArray(
      fileList,
      `${path}.files.${framework}`,
      issues,
    );
  });

  if (!registryId || !rootDir || !readmePath || !previewPath) {
    return undefined;
  }

  return {
    registryId,
    rootDir,
    readmePath,
    previewPath,
    files,
    states: expectStringArray(record.states ?? [], `${path}.states`, issues),
    variants: expectStringArray(
      record.variants ?? [],
      `${path}.variants`,
      issues,
    ),
    samples: expectStringArray(record.samples ?? [], `${path}.samples`, issues),
  };
}

function parseCatalogConfig(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): CatalogConfig | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    CATALOG_CONFIG_VERSION,
    `${path}.version`,
    issues,
  );
  const sources = expectArray(
    record.sources,
    `${path}.sources`,
    issues,
    parseCatalogSourceConfig,
  );
  const policies = expectArray(
    record.policies ?? [],
    `${path}.policies`,
    issues,
    parseCatalogPolicy,
  );

  if (!version) {
    return undefined;
  }

  return {
    version,
    sources,
    policies,
  };
}

function parseCatalogSourceManifest(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): CatalogSourceManifest | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    CATALOG_SOURCE_MANIFEST_VERSION,
    `${path}.version`,
    issues,
  );
  const source = parseCatalogSourceConfig(record.source, `${path}.source`, issues);

  if (!version || !source) {
    return undefined;
  }

  return {
    version,
    source,
    packs: expectArray(record.packs ?? [], `${path}.packs`, issues, parsePackManifest),
    templates: expectArray(
      record.templates ?? [],
      `${path}.templates`,
      issues,
      parseTemplateManifest,
    ),
    templateAssets: expectArray(
      record.templateAssets ?? [],
      `${path}.templateAssets`,
      issues,
      parseCatalogTemplateAssetManifest,
    ),
    modules: expectArray(
      record.modules ?? [],
      `${path}.modules`,
      issues,
      parseModuleManifest,
    ),
    components: expectArray(
      record.components ?? [],
      `${path}.components`,
      issues,
      parseRegistryItemManifest,
    ),
    blocks: expectArray(
      record.blocks ?? [],
      `${path}.blocks`,
      issues,
      parseRegistryItemManifest,
    ),
    charts: expectArray(
      record.charts ?? [],
      `${path}.charts`,
      issues,
      parseRegistryItemManifest,
    ),
    shells: expectArray(
      record.shells ?? [],
      `${path}.shells`,
      issues,
      parseRegistryItemManifest,
    ),
    approvals: expectArray(
      record.approvals ?? [],
      `${path}.approvals`,
      issues,
      parseCatalogApproval,
    ),
  };
}

export function safeParsePackManifest(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parsePackManifest(value, "pack", issues),
    issues,
  );
}

export function safeParseTemplateManifest(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parseTemplateManifest(value, "template", issues),
    issues,
  );
}

export function safeParseModuleManifest(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parseModuleManifest(value, "module", issues),
    issues,
  );
}

export function safeParseRegistryManifest(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parseRegistryManifest(value, "registry", issues),
    issues,
  );
}

export function safeParseCatalogConfig(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parseCatalogConfig(value, "catalogConfig", issues),
    issues,
  );
}

export function safeParseCatalogSourceManifest(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parseCatalogSourceManifest(value, "catalogSourceManifest", issues),
    issues,
  );
}

export function safeParseCatalogApproval(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parseCatalogApproval(value, "catalogApproval", issues),
    issues,
  );
}

export function assertPackManifest(value: unknown) {
  const issues: ContractIssue[] = [];

  return assertValidationResult(
    "PackManifest",
    createValidationResult(parsePackManifest(value, "pack", issues), issues),
  );
}

export function assertTemplateManifest(value: unknown) {
  return assertValidationResult(
    "TemplateManifest",
    safeParseTemplateManifest(value),
  );
}

export function assertModuleManifest(value: unknown) {
  return assertValidationResult(
    "ModuleManifest",
    safeParseModuleManifest(value),
  );
}

export function assertRegistryManifest(value: unknown) {
  return assertValidationResult(
    "RegistryManifest",
    safeParseRegistryManifest(value),
  );
}

export function assertCatalogConfig(value: unknown) {
  return assertValidationResult("CatalogConfig", safeParseCatalogConfig(value));
}

export function assertCatalogSourceManifest(value: unknown) {
  return assertValidationResult(
    "CatalogSourceManifest",
    safeParseCatalogSourceManifest(value),
  );
}

export function assertCatalogApproval(value: unknown) {
  return assertValidationResult(
    "CatalogApproval",
    safeParseCatalogApproval(value),
  );
}
