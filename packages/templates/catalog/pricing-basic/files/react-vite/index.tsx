type PricingBasicTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type PricingBasicTemplateVariant = "self-serve" | "hybrid";

export interface PricingBasicTemplateProps {
  state?: PricingBasicTemplateState;
  variant?: PricingBasicTemplateVariant;
}

export function PricingBasicTemplate({
  state = "no access",
  variant = "self-serve",
}: PricingBasicTemplateProps) {
  return (
    <main
      data-template="pricing-basic"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Simple pricing surface with trust copy, FAQ handoff, and upgrade
          moments.
        </p>
        <ul>
          <li>cards</li>
          <li>comparison rows</li>
          <li>badge highlights</li>
        </ul>
      </header>
    </main>
  );
}

export default PricingBasicTemplate;
