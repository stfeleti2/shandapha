type AuthSignUpTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type AuthSignUpTemplateVariant = "invite" | "self-serve";

export interface AuthSignUpTemplateProps {
  state?: AuthSignUpTemplateState;
  variant?: AuthSignUpTemplateVariant;
}

export function AuthSignUpTemplate({
  state = "no access",
  variant = "invite",
}: AuthSignUpTemplateProps) {
  return (
    <main
      data-template="auth/sign-up"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Sign up flow with value framing, workspace defaults, and reassurance
          copy.
        </p>
        <ul>
          <li>card</li>
          <li>field</li>
          <li>button group</li>
          <li>benefit list</li>
        </ul>
      </header>
    </main>
  );
}

export default AuthSignUpTemplate;
