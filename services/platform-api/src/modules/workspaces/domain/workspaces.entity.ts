import type { PackId, PlanId } from "@shandapha/contracts";

export interface WorkspaceUsageSnapshot {
  starterExportsUsed: number;
  starterExportsLimit: number;
  themeRevisionsUsed: number;
  themeRevisionsLimit: number;
  patchInstallsUsed: number;
  patchInstallsLimit: number;
}

export interface WorkspaceRecord {
  id: string;
  name: string;
  planId: PlanId;
  packId: PackId;
  savedThemeCount: number;
  templateSlugs: string[];
  memberIds: string[];
  apiKeyCount: number;
  policyCount: number;
  usage: WorkspaceUsageSnapshot;
  lastExportAt: string;
}

export function summarizeWorkspace(record: WorkspaceRecord) {
  return {
    id: record.id,
    name: record.name,
    planId: record.planId,
    packId: record.packId,
    memberCount: record.memberIds.length,
    templateCount: record.templateSlugs.length,
    savedThemeCount: record.savedThemeCount,
    apiKeyCount: record.apiKeyCount,
    policyCount: record.policyCount,
    lastExportAt: record.lastExportAt,
  };
}
