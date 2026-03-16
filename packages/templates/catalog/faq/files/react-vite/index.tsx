type FaqTemplateState = "loading" | "empty" | "error" | "success" | "no access";
type FaqTemplateVariant = "product" | "security";

export interface FaqTemplateProps {
  state?: FaqTemplateState;
  variant?: FaqTemplateVariant;
}

export function FaqTemplate({
  state = "no access",
  variant = "product",
}: FaqTemplateProps) {
  return (
    <main data-template="faq" data-state={state} data-variant={variant}>
      <header>
        <p>
          FAQ accordion with conversion support slots and legal/trust framing.
        </p>
        <ul>
          <li>accordion</li>
          <li>alerts</li>
          <li>contact cards</li>
        </ul>
      </header>
    </main>
  );
}

export default FaqTemplate;
