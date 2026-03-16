import {
  FRAMEWORK_ADAPTER_IDS,
  PACK_IDS,
  type PackManifest,
  PLAN_IDS,
} from "../public/stable.contracts";
import {
  assertModuleManifest,
  assertPackManifest,
  assertTemplateManifest,
} from "../public/validators";
import {
  addIssue,
  assertValidationResult,
  type ContractIssue,
  createValidationResult,
  expectArray,
  expectBoolean,
  expectEnum,
  expectLiteral,
  expectOptionalString,
  expectOptionalStringArray,
  expectRecord,
  expectString,
  expectStringArray,
} from "../shared/validation";
import {
  DIFF_REPORT_MODES,
  DIFF_REPORT_VERSION,
  type DiffReport,
  DOCTOR_CHECK_STATUSES,
  DOCTOR_RESULT_VERSION,
  type DoctorCheck,
  type DoctorResult,
  FILE_TRANSFORM_SOURCES,
  FILE_TRANSFORM_VERSION,
  type FileTransform,
  FRAMEWORK_TARGET_DESCRIPTOR_VERSION,
  type FrameworkTargetDescriptor,
  GENERATION_INPUT_VERSION,
  GENERATION_INTENTS,
  GENERATION_PLAN_VERSION,
  type GenerationInput,
  type GenerationPlan,
  PATCH_OPERATION_KINDS,
  PATCH_OPERATION_VERSION,
  type PatchOperation,
  STARTER_RECIPE_VERSION,
  type StarterRecipe,
  UNINSTALL_ACTIONS,
  UNINSTALL_MANIFEST_VERSION,
  type UninstallManifest,
} from "./generation.contracts";

function parseGenerationInput(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): GenerationInput | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    GENERATION_INPUT_VERSION,
    `${path}.version`,
    issues,
  );
  const framework = expectEnum(
    record.framework,
    FRAMEWORK_ADAPTER_IDS,
    `${path}.framework`,
    issues,
  );
  const intent = expectEnum(
    record.intent,
    GENERATION_INTENTS,
    `${path}.intent`,
    issues,
  );
  const packId = expectEnum(record.packId, PACK_IDS, `${path}.packId`, issues);
  const planId = expectEnum(record.planId, PLAN_IDS, `${path}.planId`, issues);
  const templates = expectStringArray(
    record.templates,
    `${path}.templates`,
    issues,
  );
  const modules = expectStringArray(record.modules, `${path}.modules`, issues);
  const packRegistryId = expectOptionalString(
    record.packRegistryId,
    `${path}.packRegistryId`,
    issues,
  );
  const templateRegistryIds = expectOptionalStringArray(
    record.templateRegistryIds,
    `${path}.templateRegistryIds`,
    issues,
  );
  const moduleRegistryIds = expectOptionalStringArray(
    record.moduleRegistryIds,
    `${path}.moduleRegistryIds`,
    issues,
  );
  const catalogConfigPath = expectOptionalString(
    record.catalogConfigPath,
    `${path}.catalogConfigPath`,
    issues,
  );
  const catalogWorkspaceId = expectOptionalString(
    record.catalogWorkspaceId,
    `${path}.catalogWorkspaceId`,
    issues,
  );

  if (!version || !framework || !intent || !packId || !planId) {
    return undefined;
  }

  return {
    version,
    framework,
    intent,
    packId,
    planId,
    templates,
    modules,
    packRegistryId,
    templateRegistryIds,
    moduleRegistryIds,
    catalogConfigPath,
    catalogWorkspaceId,
  };
}

function parseStarterRecipe(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): StarterRecipe | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    STARTER_RECIPE_VERSION,
    `${path}.version`,
    issues,
  );
  const framework = expectEnum(
    record.framework,
    FRAMEWORK_ADAPTER_IDS,
    `${path}.framework`,
    issues,
  );
  const intent = expectEnum(
    record.intent,
    GENERATION_INTENTS,
    `${path}.intent`,
    issues,
  );
  const targetRoot = expectString(
    record.targetRoot,
    `${path}.targetRoot`,
    issues,
  );

  if (!version || !framework || !intent || !targetRoot) {
    return undefined;
  }

  return {
    version,
    framework,
    intent,
    targetRoot,
    templates: expectStringArray(record.templates, `${path}.templates`, issues),
    modules: expectStringArray(record.modules, `${path}.modules`, issues),
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

function parseFrameworkTargetDescriptor(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): FrameworkTargetDescriptor | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    FRAMEWORK_TARGET_DESCRIPTOR_VERSION,
    `${path}.version`,
    issues,
  );
  const framework = expectEnum(
    record.framework,
    FRAMEWORK_ADAPTER_IDS,
    `${path}.framework`,
    issues,
  );
  let projectManager: FrameworkTargetDescriptor["projectManager"] | undefined;

  if (record.projectManager === "pnpm" || record.projectManager === "dotnet") {
    projectManager = record.projectManager;
  } else {
    addIssue(
      issues,
      `${path}.projectManager`,
      'Expected one of "pnpm" or "dotnet".',
    );
  }
  const projectManifestPath = expectString(
    record.projectManifestPath,
    `${path}.projectManifestPath`,
    issues,
  );
  const routesRoot = expectString(
    record.routesRoot,
    `${path}.routesRoot`,
    issues,
  );
  const themePath = expectString(record.themePath, `${path}.themePath`, issues);
  const tokensPath = expectString(
    record.tokensPath,
    `${path}.tokensPath`,
    issues,
  );
  const providerPath = expectString(
    record.providerPath,
    `${path}.providerPath`,
    issues,
  );
  const verificationPath = expectString(
    record.verificationPath,
    `${path}.verificationPath`,
    issues,
  );
  const supportsRuntimeBootstrap = expectBoolean(
    record.supportsRuntimeBootstrap,
    `${path}.supportsRuntimeBootstrap`,
    issues,
  );

  if (
    !version ||
    !framework ||
    !projectManager ||
    !projectManifestPath ||
    !routesRoot ||
    !themePath ||
    !tokensPath ||
    !providerPath ||
    !verificationPath ||
    supportsRuntimeBootstrap === undefined
  ) {
    return undefined;
  }

  return {
    version,
    framework,
    projectManager,
    projectManifestPath,
    routesRoot,
    themePath,
    tokensPath,
    providerPath,
    verificationPath,
    supportsRuntimeBootstrap,
  };
}

function parsePatchOperation(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): PatchOperation | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    PATCH_OPERATION_VERSION,
    `${path}.version`,
    issues,
  );
  const id = expectString(record.id, `${path}.id`, issues);
  const kind = expectEnum(
    record.kind,
    PATCH_OPERATION_KINDS,
    `${path}.kind`,
    issues,
  );
  const targetPath = expectString(
    record.targetPath,
    `${path}.targetPath`,
    issues,
  );
  const ownerPackage = expectString(
    record.ownerPackage,
    `${path}.ownerPackage`,
    issues,
  );
  const reason = expectString(record.reason, `${path}.reason`, issues);
  const reversible = expectBoolean(
    record.reversible,
    `${path}.reversible`,
    issues,
  );
  const framework = expectEnum(
    record.framework,
    FRAMEWORK_ADAPTER_IDS,
    `${path}.framework`,
    issues,
  );

  if (
    !version ||
    !id ||
    !kind ||
    !targetPath ||
    !ownerPackage ||
    !reason ||
    reversible === undefined ||
    !framework
  ) {
    return undefined;
  }

  return {
    version,
    id,
    kind,
    targetPath,
    ownerPackage,
    reason,
    reversible,
    framework,
  };
}

function parseFileTransform(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): FileTransform | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    FILE_TRANSFORM_VERSION,
    `${path}.version`,
    issues,
  );
  const filePath = expectString(record.path, `${path}.path`, issues);
  const operation = expectEnum(
    record.operation,
    PATCH_OPERATION_KINDS,
    `${path}.operation`,
    issues,
  );
  const source = expectEnum(
    record.source,
    FILE_TRANSFORM_SOURCES,
    `${path}.source`,
    issues,
  );
  const description = expectString(
    record.description,
    `${path}.description`,
    issues,
  );

  if (!version || !filePath || !operation || !source || !description) {
    return undefined;
  }

  return {
    version,
    path: filePath,
    operation,
    source,
    description,
  };
}

function parseUninstallManifest(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): UninstallManifest | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    UNINSTALL_MANIFEST_VERSION,
    `${path}.version`,
    issues,
  );
  const steps = expectArray(
    record.steps,
    `${path}.steps`,
    issues,
    (stepValue, stepPath, stepIssues) => {
      const stepRecord = expectRecord(stepValue, stepPath, stepIssues);

      if (!stepRecord) {
        return undefined;
      }

      const action = expectEnum(
        stepRecord.action,
        UNINSTALL_ACTIONS,
        `${stepPath}.action`,
        stepIssues,
      );
      const uninstallPath = expectString(
        stepRecord.path,
        `${stepPath}.path`,
        stepIssues,
      );
      const detail = expectString(
        stepRecord.detail,
        `${stepPath}.detail`,
        stepIssues,
      );

      if (!action || !uninstallPath || !detail) {
        return undefined;
      }

      return {
        action,
        path: uninstallPath,
        detail,
      };
    },
  );

  if (!version) {
    return undefined;
  }

  return {
    version,
    steps,
  };
}

function parseDoctorCheck(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): DoctorCheck | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const id = expectString(record.id, `${path}.id`, issues);
  const label = expectString(record.label, `${path}.label`, issues);
  const status = expectEnum(
    record.status,
    DOCTOR_CHECK_STATUSES,
    `${path}.status`,
    issues,
  );
  const detail = expectString(record.detail, `${path}.detail`, issues);

  if (!id || !label || !status || !detail) {
    return undefined;
  }

  return {
    id,
    label,
    status,
    detail,
  };
}

function parseDoctorResult(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): DoctorResult | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    DOCTOR_RESULT_VERSION,
    `${path}.version`,
    issues,
  );
  const status = expectEnum(
    record.status,
    DOCTOR_CHECK_STATUSES,
    `${path}.status`,
    issues,
  );
  const summary = expectString(record.summary, `${path}.summary`, issues);
  const checks = expectArray(
    record.checks,
    `${path}.checks`,
    issues,
    parseDoctorCheck,
  );

  if (!version || !status || !summary) {
    return undefined;
  }

  return {
    version,
    status,
    summary,
    checks,
  };
}

function parseDiffReport(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): DiffReport | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    DIFF_REPORT_VERSION,
    `${path}.version`,
    issues,
  );
  const mode = expectEnum(
    record.mode,
    DIFF_REPORT_MODES,
    `${path}.mode`,
    issues,
  );
  const targetRoot = expectString(
    record.targetRoot,
    `${path}.targetRoot`,
    issues,
  );
  const entries = expectArray(
    record.entries,
    `${path}.entries`,
    issues,
    (entryValue, entryPath, entryIssues) => {
      const entryRecord = expectRecord(entryValue, entryPath, entryIssues);

      if (!entryRecord) {
        return undefined;
      }

      const entryPathValue = expectString(
        entryRecord.path,
        `${entryPath}.path`,
        entryIssues,
      );
      const operation = expectEnum(
        entryRecord.operation,
        PATCH_OPERATION_KINDS,
        `${entryPath}.operation`,
        entryIssues,
      );
      const ownerPackage = expectString(
        entryRecord.ownerPackage,
        `${entryPath}.ownerPackage`,
        entryIssues,
      );
      const reason = expectString(
        entryRecord.reason,
        `${entryPath}.reason`,
        entryIssues,
      );
      const checksum = expectString(
        entryRecord.checksum,
        `${entryPath}.checksum`,
        entryIssues,
      );
      const existedBefore = expectBoolean(
        entryRecord.existedBefore,
        `${entryPath}.existedBefore`,
        entryIssues,
      );
      const sourcePath = expectOptionalString(
        entryRecord.sourcePath,
        `${entryPath}.sourcePath`,
        entryIssues,
      );

      if (
        !entryPathValue ||
        !operation ||
        !ownerPackage ||
        !reason ||
        !checksum ||
        existedBefore === undefined
      ) {
        return undefined;
      }

      return {
        path: entryPathValue,
        operation,
        ownerPackage,
        reason,
        checksum,
        existedBefore,
        sourcePath,
      };
    },
  );

  if (!version || !mode || !targetRoot) {
    return undefined;
  }

  return {
    version,
    mode,
    targetRoot,
    entries,
  };
}

function parseGenerationPlan(
  value: unknown,
  path: string,
  issues: ContractIssue[],
): GenerationPlan | undefined {
  const record = expectRecord(value, path, issues);

  if (!record) {
    return undefined;
  }

  const version = expectLiteral(
    record.version,
    GENERATION_PLAN_VERSION,
    `${path}.version`,
    issues,
  );
  const input = parseGenerationInput(record.input, `${path}.input`, issues);
  const frameworkTarget = parseFrameworkTargetDescriptor(
    record.frameworkTarget,
    `${path}.frameworkTarget`,
    issues,
  );
  const starterRecipe = parseStarterRecipe(
    record.starterRecipe,
    `${path}.starterRecipe`,
    issues,
  );
  const patchOperations = expectArray(
    record.patchOperations,
    `${path}.patchOperations`,
    issues,
    parsePatchOperation,
  );
  const fileTransforms = expectArray(
    record.fileTransforms,
    `${path}.fileTransforms`,
    issues,
    parseFileTransform,
  );
  const diff = parseDiffReport(record.diff, `${path}.diff`, issues);
  const uninstall = parseUninstallManifest(
    record.uninstall,
    `${path}.uninstall`,
    issues,
  );
  const doctor = parseDoctorResult(record.doctor, `${path}.doctor`, issues);
  const checklist = expectStringArray(
    record.checklist,
    `${path}.checklist`,
    issues,
  );
  const diffReport = expectStringArray(
    record.diffReport,
    `${path}.diffReport`,
    issues,
  );
  const uninstallManifest = expectStringArray(
    record.uninstallManifest,
    `${path}.uninstallManifest`,
    issues,
  );
  const doctorChecks = expectArray(
    record.doctorChecks,
    `${path}.doctorChecks`,
    issues,
    parseDoctorCheck,
  );
  let selectedPack: PackManifest | undefined;

  try {
    selectedPack = assertPackManifest(record.selectedPack);
  } catch (error) {
    addContractErrorIssues(error, `${path}.selectedPack`, issues);
  }

  const selectedTemplates = expectArray(
    record.selectedTemplates,
    `${path}.selectedTemplates`,
    issues,
    (item, itemPath, itemIssues) => {
      try {
        return assertTemplateManifest(item);
      } catch (error) {
        addContractErrorIssues(error, itemPath, itemIssues);
        return undefined;
      }
    },
  );
  const selectedModules = expectArray(
    record.selectedModules,
    `${path}.selectedModules`,
    issues,
    (item, itemPath, itemIssues) => {
      try {
        return assertModuleManifest(item);
      } catch (error) {
        addContractErrorIssues(error, itemPath, itemIssues);
        return undefined;
      }
    },
  );

  if (!selectedPack) {
    addIssue(issues, `${path}.selectedPack`, "Expected a valid PackManifest.");
  }

  if (
    doctor &&
    doctorChecks.length > 0 &&
    doctor.checks.length !== doctorChecks.length
  ) {
    addIssue(
      issues,
      `${path}.doctorChecks`,
      "Doctor checks must mirror doctor.checks.",
    );
  }

  if (
    !version ||
    !input ||
    !frameworkTarget ||
    !selectedPack ||
    !starterRecipe ||
    !diff ||
    !uninstall ||
    !doctor
  ) {
    return undefined;
  }

  return {
    version,
    input,
    frameworkTarget,
    selectedPack,
    selectedTemplates,
    selectedModules,
    starterRecipe,
    patchOperations,
    fileTransforms,
    diff,
    uninstall,
    doctor,
    checklist,
    diffReport,
    uninstallManifest,
    doctorChecks,
  };
}

function addContractErrorIssues(
  error: unknown,
  path: string,
  issues: ContractIssue[],
) {
  if (
    typeof error === "object" &&
    error !== null &&
    "issues" in error &&
    Array.isArray(error.issues)
  ) {
    error.issues.forEach((issue) => {
      if (
        typeof issue === "object" &&
        issue !== null &&
        "path" in issue &&
        "message" in issue &&
        typeof issue.path === "string" &&
        typeof issue.message === "string"
      ) {
        issues.push({
          path: `${path}.${issue.path}`,
          message: issue.message,
        });
      }
    });

    return;
  }

  issues.push({
    path,
    message: "Expected a valid nested contract.",
  });
}

export function safeParseGenerationInput(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parseGenerationInput(value, "generationInput", issues),
    issues,
  );
}

export function safeParseStarterRecipe(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parseStarterRecipe(value, "starterRecipe", issues),
    issues,
  );
}

export function safeParsePatchOperation(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parsePatchOperation(value, "patchOperation", issues),
    issues,
  );
}

export function safeParseFileTransform(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parseFileTransform(value, "fileTransform", issues),
    issues,
  );
}

export function safeParseUninstallManifest(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parseUninstallManifest(value, "uninstallManifest", issues),
    issues,
  );
}

export function safeParseDoctorResult(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parseDoctorResult(value, "doctorResult", issues),
    issues,
  );
}

export function safeParseGenerationPlan(value: unknown) {
  const issues: ContractIssue[] = [];

  return createValidationResult(
    parseGenerationPlan(value, "generationPlan", issues),
    issues,
  );
}

export function assertGenerationInput(value: unknown) {
  return assertValidationResult(
    "GenerationInput",
    safeParseGenerationInput(value),
  );
}

export function assertStarterRecipe(value: unknown) {
  return assertValidationResult("StarterRecipe", safeParseStarterRecipe(value));
}

export function assertPatchOperation(value: unknown) {
  return assertValidationResult(
    "PatchOperation",
    safeParsePatchOperation(value),
  );
}

export function assertFileTransform(value: unknown) {
  return assertValidationResult("FileTransform", safeParseFileTransform(value));
}

export function assertUninstallManifest(value: unknown) {
  return assertValidationResult(
    "UninstallManifest",
    safeParseUninstallManifest(value),
  );
}

export function assertDoctorResult(value: unknown) {
  return assertValidationResult("DoctorResult", safeParseDoctorResult(value));
}

export function assertGenerationPlan(value: unknown) {
  return assertValidationResult(
    "GenerationPlan",
    safeParseGenerationPlan(value),
  );
}
