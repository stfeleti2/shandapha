import { plans } from "@shandapha/entitlements";

export const pricingPath = "/pricing";

export function getPricingCards() {
  return plans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: plan.price,
    summary: plan.summary,
    includes: plan.includes,
    cta:
      plan.id === "free"
        ? "Start free"
        : plan.id === "premium"
          ? "Upgrade to Premium"
          : "Talk to sales",
  }));
}
