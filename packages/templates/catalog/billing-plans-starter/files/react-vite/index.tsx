type BillingPlansStarterTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type BillingPlansStarterTemplateVariant = "founder" | "enterprise";

export interface BillingPlansStarterTemplateProps {
  state?: BillingPlansStarterTemplateState;
  variant?: BillingPlansStarterTemplateVariant;
}

export function BillingPlansStarterTemplate({
  state = "no access",
  variant = "founder",
}: BillingPlansStarterTemplateProps) {
  return (
    <main
      data-template="billing-plans-starter"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Pricing and usage starter with entitlements framing, usage bars, and
          trust copy.
        </p>
        <ul>
          <li>cards</li>
          <li>progress bars</li>
          <li>badges</li>
          <li>comparison table</li>
        </ul>
      </header>
    </main>
  );
}

export default BillingPlansStarterTemplate;
