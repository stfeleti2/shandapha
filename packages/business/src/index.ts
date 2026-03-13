export const orgDefaults = {
  approvalsRequired: true,
  retentionDays: 90,
  exportReview: true,
} as const;

export const policyReports = [
  "token approvals",
  "template approvals",
  "drift detection",
  "audit export",
] as const;

export type { AuditEntry } from "./audit/auditTrail";
export {
  createAuditEntry,
  createAuditTimeline,
  exportAuditTrailMarkdown,
  summarizeAuditTrail,
} from "./audit/auditTrail";
