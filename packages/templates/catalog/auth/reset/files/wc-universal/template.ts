export function renderAuthResetTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="auth/reset" data-state="${state}"><h1>Auth Reset Password</h1><p>Reset form with inline validation and success state.</p></section>`;
}
