import { defineModuleManifest } from "@shandapha/contracts";

export const chartsManifest = defineModuleManifest({
  id: "charts",
  name: "Charts",
  packageName: "@shandapha/module-charts",
  description:
    "Deferred charting seam kept out of active install and pricing claims.",
  premium: true,
  minimumPlan: "premium",
  status: "deferred",
  capabilities: {
    premium: ["deferred"],
  },
  install: {},
});
