export function renderBlogArticleTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="blog-article" data-state="${state}"><h1>Blog Article</h1><p>Editorial article template with pull quotes, metadata, and related strips.</p></section>`;
}
