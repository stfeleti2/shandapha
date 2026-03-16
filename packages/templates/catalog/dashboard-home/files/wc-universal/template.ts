export function renderDashboardHomeTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="dashboard-home" data-state="${state}"><h1>Dashboard Home</h1><p>Overview shell with KPI rails, chart cards, activity cards, and action slots.</p></section>`;
}
