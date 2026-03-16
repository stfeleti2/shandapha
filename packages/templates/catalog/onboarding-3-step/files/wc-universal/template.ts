export function renderOnboarding3StepTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="onboarding-3-step" data-state="${state}"><h1>Onboarding 3 Step</h1><p>Three-step activation flow that leads into the wizard or export.</p></section>`;
}
