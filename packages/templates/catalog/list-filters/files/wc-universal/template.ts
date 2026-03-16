export function renderListFiltersTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="list-filters" data-state="${state}"><h1>List Filters</h1><p>Dense index page with filters, saved views, bulk actions, and table affordances.</p></section>`;
}
