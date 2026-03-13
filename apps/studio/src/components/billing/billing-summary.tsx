import { Badge, Button } from "@shandapha/core";
import { GridPreset, Stack, Surface } from "@shandapha/layouts";

interface BillingPlan {
  id: string;
  name: string;
  price: string;
  summary: string;
  includes: string[];
}

interface BillingSummaryProps {
  currentPlanId: string;
  plans: BillingPlan[];
  nextInvoiceLabel: string;
  usageHeadline: string;
}

export function BillingSummary({
  currentPlanId,
  plans,
  nextInvoiceLabel,
  usageHeadline,
}: BillingSummaryProps) {
  return (
    <Stack gap={20}>
      <Surface title="Billing posture">
        <Stack gap={12}>
          <Badge>Current plan: {currentPlanId}</Badge>
          <p style={{ margin: 0, lineHeight: 1.65 }}>{usageHeadline}</p>
          <span style={{ color: "rgba(226, 232, 240, 0.8)" }}>
            Next invoice: {nextInvoiceLabel}
          </span>
        </Stack>
      </Surface>
      <GridPreset preset="dashboard">
        {plans.map((plan) => (
          <Surface key={plan.id} title={plan.name}>
            <Stack gap={12}>
              <strong style={{ fontSize: "1.8rem" }}>{plan.price}</strong>
              <p style={{ margin: 0, lineHeight: 1.65 }}>{plan.summary}</p>
              <ul style={{ margin: 0, paddingLeft: "1.15rem" }}>
                {plan.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Button type="button">
                {plan.id === currentPlanId
                  ? "Current plan"
                  : `Move to ${plan.name}`}
              </Button>
            </Stack>
          </Surface>
        ))}
      </GridPreset>
    </Stack>
  );
}
