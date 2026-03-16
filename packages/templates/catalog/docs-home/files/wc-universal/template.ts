export function renderDocsHomeTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="docs-home" data-state="${state}"><h1>Docs Home</h1><p>Documentation landing page with category rails, quickstarts, and install guidance.</p></section>`;
}
