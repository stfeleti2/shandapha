import type { ModuleManifest } from "@shandapha/contracts";

export const datatableManifest: ModuleManifest = {
  id: "datatable",
  name: "Advanced DataTable",
  packageName: "@shandapha/module-datatable",
  description:
    "Client/server table workflows with saved views, pinning, resizing, and export.",
  premium: true,
} as ModuleManifest;
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
