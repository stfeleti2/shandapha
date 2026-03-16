export function renderChangelogTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="changelog" data-state="${state}"><h1>Changelog</h1><p>Release note stream with upgrade guidance, registry updates, and issue tracking hooks.</p></section>`;
}
