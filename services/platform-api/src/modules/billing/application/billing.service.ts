import { plans } from "@shandapha/entitlements";
import { PlatformHttpError } from "../../../server/middleware/errors";
import { workspacesRepository } from "../../workspaces/infrastructure/workspaces.repository";
import { summarizeInvoices } from "../domain/billing.entity";
import { billingRepository } from "../infrastructure/billing.repository";

export function getBillingSummary(workspaceId: string) {
  const workspace = workspacesRepository().getWorkspace(workspaceId);
  const repository = billingRepository();

  if (!workspace) {
    throw new PlatformHttpError(404, `Unknown workspace "${workspaceId}".`);
  }

  const invoices = repository.listInvoices(workspaceId);
  const plan = plans.find((entry) => entry.id === workspace.planId) ?? plans[0];

  return {
    module: "billing",
    workspaceId,
    plan,
    invoices,
    invoiceSummary: summarizeInvoices(invoices),
    usage: repository.getUsage(workspaceId),
  };
}
