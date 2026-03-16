type AuthSignInTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type AuthSignInTemplateVariant = "email-first";

export interface AuthSignInTemplateProps {
  state?: AuthSignInTemplateState;
  variant?: AuthSignInTemplateVariant;
}

export function AuthSignInTemplate({
  state = "no access",
  variant = "email-first",
}: AuthSignInTemplateProps) {
  return (
    <main
      data-template="auth/sign-in"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>Sign in screen with trust copy, field groups, and help states.</p>
        <ul>
          <li>card</li>
          <li>field</li>
          <li>alert</li>
          <li>badge</li>
        </ul>
      </header>
    </main>
  );
}

export default AuthSignInTemplate;
