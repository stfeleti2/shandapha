import { resolveEntitlements } from "@shandapha/entitlements";
import { PlatformHttpError } from "../../../server/middleware/errors";
import { entitlementsRepository } from "../infrastructure/entitlements.repository";

export function getEntitlementsSummary(workspaceId: string) {
  const planId = entitlementsRepository().getPlanId(workspaceId);

  if (!planId) {
    throw new PlatformHttpError(404, `Unknown workspace "${workspaceId}".`);
  }

  const resolved = resolveEntitlements(planId);

  return {
    module: "entitlements",
    workspaceId,
    plan: resolved.plan,
    enabledPacks: resolved.enabledPacks,
    enabledModules: resolved.enabledModules,
    features: resolved.features,
    upgradeHints: resolved.upgradeHints,
    limits: resolved.limits,
  };
}
