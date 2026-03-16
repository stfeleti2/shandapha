export function renderBlogIndexTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="blog-index" data-state="${state}"><h1>Blog Index</h1><p>Journal index for product updates, launch stories, and registry notes.</p></section>`;
}
