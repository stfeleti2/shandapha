import { resolveEntitlements } from "@shandapha/entitlements";
import { PlatformHttpError } from "../../../server/middleware/errors";
import { limitsForPlan } from "../domain/entitlements.entity";
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
    features: resolved.features,
    limits: limitsForPlan(planId),
  };
}
