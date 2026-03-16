type LandingSectionBasedTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type LandingSectionBasedTemplateVariant = "product launch" | "enterprise";

export interface LandingSectionBasedTemplateProps {
  state?: LandingSectionBasedTemplateState;
  variant?: LandingSectionBasedTemplateVariant;
}

export function LandingSectionBasedTemplate({
  state = "no access",
  variant = "product launch",
}: LandingSectionBasedTemplateProps) {
  return (
    <main
      data-template="landing-section-based"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Modular marketing shell for hero-to-CTA launches with registry-backed
          sections.
        </p>
        <ul>
          <li>marketing shell</li>
          <li>hero cards</li>
          <li>feature grids</li>
          <li>cta footer</li>
        </ul>
      </header>
    </main>
  );
}

export default LandingSectionBasedTemplate;
