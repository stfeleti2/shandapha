export function renderAuthSignUpTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="auth/sign-up" data-state="${state}"><h1>Auth Sign Up</h1><p>Sign up flow with value framing, workspace defaults, and reassurance copy.</p></section>`;
}
