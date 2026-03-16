import type {
  CatalogApproval,
  CatalogPolicy,
  PolicyCheckResult,
  PolicyFinding,
  ResolvedCatalog,
  ResolvedCatalogItem,
} from "@shandapha/contracts";

function createFinding(
  finding: PolicyFinding,
  mode: CatalogPolicy["mode"],
): PolicyFinding {
  if (mode === "report-only" && finding.severity === "error") {
    return {
      ...finding,
      severity: "warn",
    };
  }

  return finding;
}

function evaluateItemAgainstPolicy(
  item: ResolvedCatalogItem,
  policy: CatalogPolicy,
  approvals: CatalogApproval[],
): PolicyFinding[] {
  const findings: PolicyFinding[] = [];

  if (
    policy.allowedNamespaces.length > 0 &&
    !policy.allowedNamespaces.includes(item.namespace)
  ) {
    findings.push({
      severity: "error",
      code: "namespace-blocked",
      message: `${item.registryId} is outside the allowed namespaces for policy "${policy.name}".`,
      registryId: item.registryId,
    });
  }

  if (!policy.allowedSupportLevels.includes(item.supportLevel)) {
    findings.push({
      severity: "error",
      code: "support-level-blocked",
      message: `${item.registryId} has support level "${item.supportLevel}", which policy "${policy.name}" does not allow.`,
      registryId: item.registryId,
    });
  }

  if (!policy.allowedStabilities.includes(item.stability)) {
    findings.push({
      severity: "error",
      code: "stability-blocked",
      message: `${item.registryId} is "${item.stability}" and is blocked by policy "${policy.name}".`,
      registryId: item.registryId,
    });
  }

  if (!policy.allowCommunity && item.sourceKind === "community") {
    findings.push({
      severity: "error",
      code: "community-blocked",
      message: `${item.registryId} comes from a community source and policy "${policy.name}" does not allow community items.`,
      registryId: item.registryId,
    });
  }

  if (!policy.allowExperimental && item.stability === "experimental") {
    findings.push({
      severity: "error",
      code: "experimental-blocked",
      message: `${item.registryId} is experimental and policy "${policy.name}" requires stable or preview items only.`,
      registryId: item.registryId,
    });
  }

  if (!policy.allowDeprecated && item.stability === "deprecated") {
    findings.push({
      severity: "error",
      code: "deprecated-blocked",
      message: `${item.registryId} is deprecated and policy "${policy.name}" blocks deprecated items.`,
      registryId: item.registryId,
    });
  }

  if (
    policy.approvedRegistryIds.length > 0 &&
    !policy.approvedRegistryIds.includes(item.registryId)
  ) {
    findings.push({
      severity: "error",
      code: "approval-required",
      message: `${item.registryId} is not in the approved registry id list for policy "${policy.name}".`,
      registryId: item.registryId,
    });
  }

  if (
    policy.approvedVersions.length > 0 &&
    !policy.approvedVersions.includes(String(item.version))
  ) {
    findings.push({
      severity: "error",
      code: "version-not-approved",
      message: `${item.registryId} uses version "${item.version}", which policy "${policy.name}" has not approved.`,
      registryId: item.registryId,
    });
  }

  const approval = approvals.find(
    (candidate) => candidate.registryId === item.registryId,
  );

  if (
    item.sourceKind !== "first-party" &&
    !approval &&
    policy.mode === "enforce"
  ) {
    findings.push({
      severity: "error",
      code: "missing-approval",
      message: `${item.registryId} is not first-party and has no explicit approval record.`,
      registryId: item.registryId,
    });
  }

  if (
    approval &&
    approval.status === "rejected" &&
    policy.mode === "enforce"
  ) {
    findings.push({
      severity: "error",
      code: "approval-rejected",
      message: `${item.registryId} is explicitly rejected by approval ${approval.id}.`,
      registryId: item.registryId,
      sourceId: approval.sourceId,
    });
  }

  return findings;
}

function evaluateLockedSelections(
  selected: ResolvedCatalogItem[],
  policy: CatalogPolicy,
): PolicyFinding[] {
  return selected.flatMap((item) => {
    if (
      item.kind === "pack" &&
      policy.lockedPackRegistryIds.length > 0 &&
      !policy.lockedPackRegistryIds.includes(item.registryId)
    ) {
      return [
        {
          severity: "error" as const,
          code: "locked-pack-mismatch",
          message: `${item.registryId} is outside the locked pack set for policy "${policy.name}".`,
          registryId: item.registryId,
        },
      ];
    }

    if (
      item.kind === "template" &&
      policy.lockedTemplateRegistryIds.length > 0 &&
      !policy.lockedTemplateRegistryIds.includes(item.registryId)
    ) {
      return [
        {
          severity: "error" as const,
          code: "locked-template-mismatch",
          message: `${item.registryId} is outside the locked template set for policy "${policy.name}".`,
          registryId: item.registryId,
        },
      ];
    }

    if (
      item.kind === "module" &&
      policy.lockedModuleRegistryIds.length > 0 &&
      !policy.lockedModuleRegistryIds.includes(item.registryId)
    ) {
      return [
        {
          severity: "error" as const,
          code: "locked-module-mismatch",
          message: `${item.registryId} is outside the locked module set for policy "${policy.name}".`,
          registryId: item.registryId,
        },
      ];
    }

    return [];
  });
}

export function evaluateCatalogPolicies(options: {
  catalog: ResolvedCatalog;
  policies: CatalogPolicy[];
  selectedRegistryIds?: string[];
}): PolicyCheckResult {
  const selectedItems =
    options.selectedRegistryIds?.map(
      (registryId) => options.catalog.itemsById[registryId],
    ) ?? options.catalog.items;
  const filteredSelected = selectedItems.filter(Boolean);
  const findings = options.policies.flatMap((policy) => {
    const itemFindings = filteredSelected.flatMap((item) =>
      evaluateItemAgainstPolicy(item, policy, options.catalog.approvals),
    );
    const lockedFindings = evaluateLockedSelections(filteredSelected, policy);

    return [...itemFindings, ...lockedFindings].map((finding) =>
      createFinding(finding, policy.mode),
    );
  });

  const hasError = findings.some((finding) => finding.severity === "error");
  const hasWarn = findings.some((finding) => finding.severity === "warn");

  return {
    policyIds: options.policies.map((policy) => policy.id),
    mode:
      options.policies.some((policy) => policy.mode === "enforce")
        ? "enforce"
        : "report-only",
    status: hasError ? "fail" : hasWarn ? "warn" : "pass",
    checkedRegistryIds: filteredSelected.map((item) => item.registryId),
    findings,
  };
}

export function groupApprovalsByRegistryId(approvals: CatalogApproval[]) {
  return approvals.reduce<Record<string, CatalogApproval[]>>((acc, approval) => {
    acc[approval.registryId] = [...(acc[approval.registryId] ?? []), approval];
    return acc;
  }, {});
}
