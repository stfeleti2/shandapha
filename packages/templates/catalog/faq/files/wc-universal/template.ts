export function renderFaqTemplate(target: HTMLElement, state = "no access") {
  target.innerHTML = `<section data-template="faq" data-state="${state}"><h1>FAQ</h1><p>FAQ accordion with conversion support slots and legal/trust framing.</p></section>`;
}
