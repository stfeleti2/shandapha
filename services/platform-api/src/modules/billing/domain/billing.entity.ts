import type { PlanId } from "@shandapha/contracts";

export interface InvoiceRecord {
  id: string;
  workspaceId: string;
  planId: PlanId;
  amount: number;
  currency: "USD";
  status: "paid" | "open";
  issuedAt: string;
  dueAt: string;
}

export function summarizeInvoices(invoices: InvoiceRecord[]) {
  return {
    total: invoices.length,
    open: invoices.filter((invoice) => invoice.status === "open").length,
    paid: invoices.filter((invoice) => invoice.status === "paid").length,
    amountDue: invoices
      .filter((invoice) => invoice.status === "open")
      .reduce((total, invoice) => total + invoice.amount, 0),
  };
}
