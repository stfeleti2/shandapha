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
          <Badge variant="outline">Current plan: {currentPlanId}</Badge>
          <p className="text-sm leading-6 text-muted-foreground">{usageHeadline}</p>
          <span className="text-sm text-muted-foreground">
            Next invoice: {nextInvoiceLabel}
          </span>
        </Stack>
      </Surface>
      <GridPreset preset="dashboard">
        {plans.map((plan) => (
          <Surface key={plan.id} title={plan.name}>
            <Stack gap={12}>
              <strong className="text-3xl font-semibold tracking-tight">
                {plan.price}
              </strong>
              <p className="text-sm leading-6 text-muted-foreground">{plan.summary}</p>
              <ul className="grid gap-2 pl-5 text-sm text-muted-foreground">
                {plan.includes.map((item) => (
                  <li key={item} className="list-disc">
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                variant={plan.id === currentPlanId ? "secondary" : "default"}
              >
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
