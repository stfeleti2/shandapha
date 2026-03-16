type DocsArticleTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type DocsArticleTemplateVariant = "api" | "concept";

export interface DocsArticleTemplateProps {
  state?: DocsArticleTemplateState;
  variant?: DocsArticleTemplateVariant;
}

export function DocsArticleTemplate({
  state = "no access",
  variant = "api",
}: DocsArticleTemplateProps) {
  return (
    <main
      data-template="docs-article"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Article layout with metadata, code samples, registry notes, and
          sibling nav.
        </p>
        <ul>
          <li>article shell</li>
          <li>toc</li>
          <li>code panel</li>
        </ul>
      </header>
    </main>
  );
}

export default DocsArticleTemplate;
