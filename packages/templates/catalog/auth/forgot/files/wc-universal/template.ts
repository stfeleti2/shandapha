export function renderAuthForgotTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="auth/forgot" data-state="${state}"><h1>Auth Forgot Password</h1><p>Recovery flow with email feedback and reassurance copy.</p></section>`;
}
