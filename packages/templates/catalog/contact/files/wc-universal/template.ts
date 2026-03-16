export function renderContactTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="contact" data-state="${state}"><h1>Contact</h1><p>Contact page with sales paths, support routing, and trust framing.</p></section>`;
}
