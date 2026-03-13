export function renderPlanSummary(plan: { checklist: string[] }) {
  return plan.checklist.join("\n");
}
