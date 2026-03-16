import type { DoctorResult, PolicyCheckResult } from "@shandapha/contracts";
import type { GenerationExecutionResult } from "@shandapha/generator-core";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isExecutionResult(value: unknown): value is GenerationExecutionResult {
  return (
    isRecord(value) &&
    typeof value.kind === "string" &&
    Array.isArray(value.files) &&
    isRecord(value.plan) &&
    isRecord(value.diff) &&
    isRecord(value.doctor)
  );
}

function isDoctorResult(value: unknown): value is DoctorResult {
  return (
    isRecord(value) &&
    typeof value.status === "string" &&
    typeof value.summary === "string" &&
    Array.isArray(value.checks)
  );
}

function isPolicyCheckResult(value: unknown): value is PolicyCheckResult {
  return (
    isRecord(value) &&
    typeof value.status === "string" &&
    Array.isArray(value.findings) &&
    Array.isArray(value.checkedRegistryIds)
  );
}

function isCatalogValidationResult(
  value: unknown,
): value is {
  config: {
    sources?: unknown[];
    policies?: unknown[];
  };
  catalog: {
    sources?: unknown[];
    warnings?: unknown[];
    items?: unknown[];
  };
} {
  return isRecord(value) && isRecord(value.config) && isRecord(value.catalog);
}

function formatDoctorResult(result: DoctorResult) {
  return [
    `Doctor: ${result.status}`,
    result.summary,
    "",
    "Checks:",
    ...result.checks.map(
      (check) => `- [${check.status}] ${check.label}: ${check.detail}`,
    ),
  ].join("\n");
}

function formatPolicyCheckResult(result: PolicyCheckResult) {
  return [
    `Policy: ${result.status} (${result.mode})`,
    `Policies: ${result.policyIds.join(", ") || "none"}`,
    `Checked: ${result.checkedRegistryIds.join(", ") || "catalog"}`,
    "",
    "Findings:",
    ...(result.findings.length > 0
      ? result.findings.map(
          (finding) =>
            `- [${finding.severity}] ${finding.code}: ${finding.message}`,
        )
      : ["- none"]),
  ].join("\n");
}

function formatCatalogValidationResult(value: {
  config: {
    sources?: unknown[];
    policies?: unknown[];
  };
  catalog: {
    sources?: unknown[];
    warnings?: unknown[];
    items?: unknown[];
  };
}) {
  return [
    "Catalog validation",
    `Configured sources: ${value.config.sources?.length ?? 0}`,
    `Policies: ${value.config.policies?.length ?? 0}`,
    `Resolved sources: ${value.catalog.sources?.length ?? 0}`,
    `Resolved items: ${value.catalog.items?.length ?? 0}`,
    `Warnings: ${value.catalog.warnings?.length ?? 0}`,
  ].join("\n");
}

function formatExecutionResult(
  result: GenerationExecutionResult,
  options: {
    showDiff?: boolean;
  },
) {
  const catalogLines = [
    `- pack ${result.plan.selectedPack.registryId} [${result.plan.selectedPack.supportLevel}/${result.plan.selectedPack.trustLevel}/${result.plan.selectedPack.visibility}] via ${result.plan.selectedPack.provenance.sourceId}`,
    ...result.plan.selectedTemplates.map(
      (template) =>
        `- template ${template.registryId} [${template.supportLevel}/${template.trustLevel}/${template.visibility}] via ${template.provenance.sourceId}`,
    ),
    ...result.plan.selectedModules.map(
      (module) =>
        `- module ${module.registryId} [${module.supportLevel}/${module.trustLevel}/${module.visibility}] via ${module.provenance.sourceId}`,
    ),
  ];
  const lines = [
    `${result.kind.toUpperCase()} ${result.dryRun ? "(dry-run)" : ""}`.trim(),
    `Target: ${result.targetRoot}`,
    `Framework: ${result.plan.input.framework}`,
    `Pack: ${result.plan.selectedPack.name}`,
    `Templates: ${result.plan.selectedTemplates.map((template) => template.slug).join(", ") || "none"}`,
    `Modules: ${result.plan.selectedModules.map((module) => module.id).join(", ") || "none"}`,
    `Manifest: ${result.manifestPath ?? "none"}`,
    `Written: ${result.writtenPaths.length}`,
    `Removed: ${result.removedPaths.length}`,
    `Doctor: ${result.doctor.status} - ${result.doctor.summary}`,
  ];

  if (catalogLines.length > 0) {
    lines.push("", "Catalog:", ...catalogLines);
  }

  if (result.plan.checklist.length > 0) {
    lines.push(
      "",
      "Checklist:",
      ...result.plan.checklist.map((item) => `- ${item}`),
    );
  }

  if (options.showDiff && result.diff.entries.length > 0) {
    lines.push(
      "",
      "Diff:",
      ...result.diff.entries.map(
        (entry) =>
          `- ${entry.operation.toUpperCase()} ${entry.path}: ${entry.reason}`,
      ),
    );
  }

  if (result.plan.uninstall.steps.length > 0) {
    lines.push(
      "",
      "Rollback:",
      ...result.plan.uninstall.steps.map(
        (step) => `- ${step.action} ${step.path}: ${step.detail}`,
      ),
    );
  }

  return lines.join("\n");
}

export function formatOutput(
  value: unknown,
  options: {
    showDiff?: boolean;
    writeJson?: boolean;
  } = {},
) {
  if (options.writeJson) {
    return JSON.stringify(value, null, 2);
  }

  if (isExecutionResult(value)) {
    return formatExecutionResult(value, options);
  }

  if (isDoctorResult(value)) {
    return formatDoctorResult(value);
  }

  if (isPolicyCheckResult(value)) {
    return formatPolicyCheckResult(value);
  }

  if (isCatalogValidationResult(value)) {
    return formatCatalogValidationResult(value);
  }

  if (isRecord(value) && typeof value.message === "string") {
    return [
      value.message,
      ...Object.entries(value)
        .filter(([key]) => key !== "message")
        .map(
          ([key, entry]) =>
            `${key}: ${
              typeof entry === "string" ? entry : JSON.stringify(entry, null, 2)
            }`,
        ),
    ].join("\n");
  }

  return JSON.stringify(value, null, 2);
}
