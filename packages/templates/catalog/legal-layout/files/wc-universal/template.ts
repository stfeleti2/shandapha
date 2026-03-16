export function renderLegalLayoutTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="legal-layout" data-state="${state}"><h1>Legal Layout</h1><p>Legal content layout with side navigation, trust accents, and article framing.</p></section>`;
}
