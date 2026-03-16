export function renderPricingBasicTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="pricing-basic" data-state="${state}"><h1>Pricing Basic</h1><p>Simple pricing surface with trust copy, FAQ handoff, and upgrade moments.</p></section>`;
}
