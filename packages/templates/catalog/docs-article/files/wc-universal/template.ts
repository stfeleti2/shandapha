export function renderDocsArticleTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="docs-article" data-state="${state}"><h1>Docs Article</h1><p>Article layout with metadata, code samples, registry notes, and sibling nav.</p></section>`;
}
