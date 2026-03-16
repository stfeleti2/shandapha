export function renderAuthSignInTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="auth/sign-in" data-state="${state}"><h1>Auth Sign In</h1><p>Sign in screen with trust copy, field groups, and help states.</p></section>`;
}
