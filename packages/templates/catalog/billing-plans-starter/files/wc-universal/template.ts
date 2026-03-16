export function renderBillingPlansStarterTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="billing-plans-starter" data-state="${state}"><h1>Billing Plans Starter</h1><p>Pricing and usage starter with entitlements framing, usage bars, and trust copy.</p></section>`;
}
