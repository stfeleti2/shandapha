export function renderSettingsSectionedTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="settings-sectioned" data-state="${state}"><h1>Settings Sectioned</h1><p>Settings shell with grouped controls, policy messaging, and status helpers.</p></section>`;
}
