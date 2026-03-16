import { defineModuleManifest } from "@shandapha/contracts";

export {
  DataTable,
  DataTableEmptyState,
  DataTableErrorState,
  DataTableLoadingState,
  type DataTableProps,
  DataTableToolbar,
} from "./react";

export const datatableManifest = defineModuleManifest({
  id: "datatable",
  name: "Advanced DataTable",
  packageName: "@shandapha/module-datatable",
  description:
    "Client/server table workflows with saved views, pinning, resizing, and export.",
  premium: true,
  minimumPlan: "premium",
  status: "installable",
  capabilities: {
    free: [
      "client-mode",
      "filtering",
      "sorting",
      "selection",
      "sticky-header",
      "pagination",
      "toolbar-baseline",
    ],
    premium: [
      "virtualization",
      "pinning",
      "resizing",
      "csv-export",
      "toolbar-variants",
      "personal-saved-views",
    ],
    business: [
      "server-mode-helpers",
      "org-saved-views",
      "audit-export",
      "permissions-hooks",
      "shared-view-state",
    ],
  },
  install: {
    requiredPackages: ["@tanstack/react-table"],
    requiredRoutes: ["/verification/datatable"],
  },
});
export const datatableFeatures = [
  "client mode",
  "server mode",
  "filtering",
  "sorting",
  "virtualization",
  "pinning",
  "resizing",
  "export-csv",
  "saved-views",
  "DataToolbar",
  "ColumnPicker",
] as const;
