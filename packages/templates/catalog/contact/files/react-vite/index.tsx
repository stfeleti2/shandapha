type ContactTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type ContactTemplateVariant = "sales" | "support";

export interface ContactTemplateProps {
  state?: ContactTemplateState;
  variant?: ContactTemplateVariant;
}

export function ContactTemplate({
  state = "no access",
  variant = "sales",
}: ContactTemplateProps) {
  return (
    <main data-template="contact" data-state={state} data-variant={variant}>
      <header>
        <p>
          Contact page with sales paths, support routing, and trust framing.
        </p>
        <ul>
          <li>cards</li>
          <li>field</li>
          <li>alert</li>
        </ul>
      </header>
    </main>
  );
}

export default ContactTemplate;
