type BlogArticleTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type BlogArticleTemplateVariant = "announcement" | "essay";

export interface BlogArticleTemplateProps {
  state?: BlogArticleTemplateState;
  variant?: BlogArticleTemplateVariant;
}

export function BlogArticleTemplate({
  state = "no access",
  variant = "announcement",
}: BlogArticleTemplateProps) {
  return (
    <main
      data-template="blog-article"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Editorial article template with pull quotes, metadata, and related
          strips.
        </p>
        <ul>
          <li>article shell</li>
          <li>quote panel</li>
          <li>related strip</li>
        </ul>
      </header>
    </main>
  );
}

export default BlogArticleTemplate;
