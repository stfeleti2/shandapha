type LegalLayoutTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type LegalLayoutTemplateVariant = "privacy" | "terms" | "security";

export interface LegalLayoutTemplateProps {
  state?: LegalLayoutTemplateState;
  variant?: LegalLayoutTemplateVariant;
}

export function LegalLayoutTemplate({
  state = "no access",
  variant = "privacy",
}: LegalLayoutTemplateProps) {
  return (
    <main
      data-template="legal-layout"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Legal content layout with side navigation, trust accents, and article
          framing.
        </p>
        <ul>
          <li>docs shell</li>
          <li>sidebar</li>
          <li>article layout</li>
        </ul>
      </header>
    </main>
  );
}

export default LegalLayoutTemplate;
