type Onboarding3StepTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type Onboarding3StepTemplateVariant = "self-serve" | "team";

export interface Onboarding3StepTemplateProps {
  state?: Onboarding3StepTemplateState;
  variant?: Onboarding3StepTemplateVariant;
}

export function Onboarding3StepTemplate({
  state = "no access",
  variant = "self-serve",
}: Onboarding3StepTemplateProps) {
  return (
    <main
      data-template="onboarding-3-step"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>Three-step activation flow that leads into the wizard or export.</p>
        <ul>
          <li>step cards</li>
          <li>alerts</li>
          <li>checklist</li>
          <li>support rail</li>
        </ul>
      </header>
    </main>
  );
}

export default Onboarding3StepTemplate;
