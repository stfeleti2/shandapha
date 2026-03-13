import { getPlatformStore } from "../../../db/store";

export function billingRepository() {
  const store = getPlatformStore();

  return {
    listInvoices(workspaceId: string) {
      return store.billing.invoices.filter(
        (invoice) => invoice.workspaceId === workspaceId,
      );
    },
    getUsage(workspaceId: string) {
      return (
        store.workspaces.find((workspace) => workspace.id === workspaceId)
          ?.usage ?? null
      );
    },
  };
}
