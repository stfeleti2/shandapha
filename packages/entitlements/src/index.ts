import type { EntitlementPlan, PackId, PlanId } from "@shandapha/contracts";

export const plans: EntitlementPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    summary:
      "Shippable baseline for founders and teams evaluating the platform.",
    includes: [
      "semantic tokens and theming",
      "accessibility behaviors",
      "core components",
      "basic templates",
      "basic table",
      "docs and playground",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$49/mo",
    summary:
      "Faster shipping through polished packs, richer variants, and convenience flows.",
    includes: [
      "Glass and Neon packs",
      "advanced presets",
      "starter exports",
      "patch install recipes",
      "richer template bundles",
      "priority upgrades",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "$299/mo",
    summary:
      "Enterprise boundaries without enterprise sprawl: governance, scale, and confidence.",
    includes: [
      "governance defaults",
      "policy reports",
      "token approvals",
      "advanced data workflows",
      "audit exports",
      "support and compliance guidance",
    ],
  },
] as EntitlementPlan[];

export const featureMap: Record<PlanId, string[]> = {
  free: ["normal", "core-components", "basic-templates", "basic-table", "docs"],
  premium: [
    "normal",
    "glass",
    "neon",
    "patch-install",
    "starter-export",
    "advanced-templates",
    "datatable",
  ],
  business: [
    "normal",
    "glass",
    "neon",
    "patch-install",
    "starter-export",
    "advanced-templates",
    "datatable",
    "governance",
    "audit",
    "policy-reports",
  ],
};

export function resolveEntitlements(planId: PlanId) {
  return {
    plan: plans.find((plan) => plan.id === planId) ?? plans[0],
    features: featureMap[planId],
  };
}

export function requireFeature(planId: PlanId, feature: string) {
  return featureMap[planId].includes(feature);
}

export function requirePack(planId: PlanId, packId: PackId) {
  return packId === "normal" ? true : featureMap[planId].includes(packId);
}

export function upgradeCopy(planId: PlanId) {
  return planId === "free"
    ? "Upgrade when you want more polish, not because the free tier is artificially crippled."
    : planId === "premium"
      ? "Business adds governance, policy reports, and scale confidence."
      : "You already have the full governance surface.";
}
