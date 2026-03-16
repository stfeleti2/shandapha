import { defineModuleManifest } from "@shandapha/contracts";

export const richtextManifest = defineModuleManifest({
  id: "richtext",
  name: "Rich Text",
  packageName: "@shandapha/module-richtext",
  description:
    "Deferred rich text seam kept parked until there is a real install path.",
  premium: true,
  minimumPlan: "premium",
  status: "deferred",
  capabilities: {
    premium: ["deferred"],
  },
  install: {},
});
