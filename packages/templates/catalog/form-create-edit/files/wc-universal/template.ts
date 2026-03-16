export function renderFormCreateEditTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="form-create-edit" data-state="${state}"><h1>Form Create Edit</h1><p>Structured create/edit flows with helper copy, sections, and action rails.</p></section>`;
}
