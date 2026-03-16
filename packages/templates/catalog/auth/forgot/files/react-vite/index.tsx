type AuthForgotTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type AuthForgotTemplateVariant = "email-only";

export interface AuthForgotTemplateProps {
  state?: AuthForgotTemplateState;
  variant?: AuthForgotTemplateVariant;
}

export function AuthForgotTemplate({
  state = "no access",
  variant = "email-only",
}: AuthForgotTemplateProps) {
  return (
    <main data-template="auth/forgot" data-state={state} data-variant={variant}>
      <header>
        <p>Recovery flow with email feedback and reassurance copy.</p>
        <ul>
          <li>card</li>
          <li>alert</li>
          <li>field</li>
        </ul>
      </header>
    </main>
  );
}

export default AuthForgotTemplate;
