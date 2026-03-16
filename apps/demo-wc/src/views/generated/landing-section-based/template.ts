export function renderLandingSectionBasedTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="landing-section-based" data-state="${state}"><h1>Landing Section Based</h1><p>Modular marketing shell for hero-to-CTA launches with registry-backed sections.</p></section>`;
}
