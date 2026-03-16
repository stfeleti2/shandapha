type AuthResetTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type AuthResetTemplateVariant = "single-step";

export interface AuthResetTemplateProps {
  state?: AuthResetTemplateState;
  variant?: AuthResetTemplateVariant;
}

export function AuthResetTemplate({
  state = "no access",
  variant = "single-step",
}: AuthResetTemplateProps) {
  return (
    <main data-template="auth/reset" data-state={state} data-variant={variant}>
      <header>
        <p>Reset form with inline validation and success state.</p>
        <ul>
          <li>field</li>
          <li>progress</li>
          <li>alert</li>
        </ul>
      </header>
    </main>
  );
}

export default AuthResetTemplate;
