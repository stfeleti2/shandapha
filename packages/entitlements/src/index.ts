import type { EntitlementPlan, PackId, PlanId } from "@shandapha/contracts";

export interface PlanLimits {
  exportsPerMonth: number;
  themeRevisions: number;
  patchInstalls: number;
  members: number;
}

export interface UpgradeHint {
  kind: "pack" | "module" | "limit";
  target: string;
  minimumPlan: PlanId;
  reason: string;
}

export interface EntitlementResolution {
  plan: EntitlementPlan;
  enabledPacks: PackId[];
  enabledModules: string[];
  limits: PlanLimits;
  upgradeHints: UpgradeHint[];
  features: string[];
}

const planOrder: PlanId[] = ["free", "premium", "business"];

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
      "wc portability baseline",
      "seo helpers",
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
      "starter exports",
      "patch install recipes",
      "advanced templates",
      "advanced datatable conveniences",
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

const packAccess: Record<PlanId, PackId[]> = {
  free: ["normal"],
  premium: ["normal", "glass", "neon"],
  business: ["normal", "glass", "neon"],
};

const moduleAccess: Record<PlanId, string[]> = {
  free: ["seo"],
  premium: ["seo", "datatable"],
  business: ["seo", "datatable", "governance"],
};

const limitsByPlan: Record<PlanId, PlanLimits> = {
  free: {
    exportsPerMonth: 3,
    themeRevisions: 8,
    patchInstalls: 1,
    members: 3,
  },
  premium: {
    exportsPerMonth: 25,
    themeRevisions: 24,
    patchInstalls: 10,
    members: 12,
  },
  business: {
    exportsPerMonth: 100,
    themeRevisions: 80,
    patchInstalls: 40,
    members: 50,
  },
};

export const featureMap: Record<PlanId, string[]> = {
  free: [
    "normal",
    "core-components",
    "basic-templates",
    "basic-table",
    "docs",
    "seo",
    "wc-baseline",
  ],
  premium: [
    "normal",
    "glass",
    "neon",
    "patch-install",
    "starter-export",
    "advanced-templates",
    "datatable",
    "seo",
  ],
  business: [
    "normal",
    "glass",
    "neon",
    "patch-install",
    "starter-export",
    "advanced-templates",
    "datatable",
    "seo",
    "governance",
    "audit",
    "policy-reports",
  ],
};

export function limitsForPlan(planId: PlanId): PlanLimits {
  return limitsByPlan[planId];
}

function includesForPlan(planId: PlanId) {
  return plans.find((plan) => plan.id === planId)?.includes ?? [];
}

function nextPlan(planId: PlanId): PlanId | null {
  const index = planOrder.indexOf(planId);
  return index >= 0 && index < planOrder.length - 1
    ? planOrder[index + 1]
    : null;
}

export function resolveEntitlements(planId: PlanId): EntitlementResolution {
  const plan = plans.find((entry) => entry.id === planId) ?? plans[0];
  const enabledPacks = [...packAccess[planId]];
  const enabledModules = [...moduleAccess[planId]];
  const limits = limitsForPlan(planId);
  const upgradeHints: UpgradeHint[] = [];
  const recommendedUpgrade = nextPlan(planId);

  if (planId === "free") {
    upgradeHints.push(
      {
        kind: "pack",
        target: "glass",
        minimumPlan: "premium",
        reason:
          "Premium unlocks extra presentation packs without shrinking the free baseline.",
      },
      {
        kind: "module",
        target: "datatable",
        minimumPlan: "premium",
        reason:
          "Premium adds advanced table convenience features while keeping a free basic table path.",
      },
    );
  }

  if (planId !== "business" && recommendedUpgrade) {
    upgradeHints.push({
      kind: "limit",
      target: "workspace-scale",
      minimumPlan: recommendedUpgrade,
      reason:
        recommendedUpgrade === "premium"
          ? "Premium raises export and patch limits for faster iteration."
          : "Business adds governance, org workflows, and larger operational limits.",
    });
  }

  return {
    plan,
    enabledPacks,
    enabledModules,
    limits,
    upgradeHints,
    features: [
      ...featureMap[planId],
      ...enabledPacks,
      ...enabledModules,
      ...includesForPlan(planId),
    ],
  };
}

export function requireFeature(planId: PlanId, feature: string) {
  return resolveEntitlements(planId).features.includes(feature);
}

export function requirePack(planId: PlanId, packId: PackId) {
  return resolveEntitlements(planId).enabledPacks.includes(packId);
}

export function requireModule(planId: PlanId, moduleId: string) {
  return resolveEntitlements(planId).enabledModules.includes(moduleId);
}

export function upgradeCopy(planId: PlanId, target?: string) {
  const resolved = resolveEntitlements(planId);
  const hint = target
    ? resolved.upgradeHints.find((entry) => entry.target === target)
    : resolved.upgradeHints[0];

  if (hint) {
    return hint.reason;
  }

  return planId === "business"
    ? "You already have the full governance surface."
    : "Upgrade only when you want more polish, scale, or governance, not because the free tier is artificially crippled.";
}
