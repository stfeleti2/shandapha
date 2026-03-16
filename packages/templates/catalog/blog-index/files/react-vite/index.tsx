type BlogIndexTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type BlogIndexTemplateVariant = "product" | "culture";

export interface BlogIndexTemplateProps {
  state?: BlogIndexTemplateState;
  variant?: BlogIndexTemplateVariant;
}

export function BlogIndexTemplate({
  state = "no access",
  variant = "product",
}: BlogIndexTemplateProps) {
  return (
    <main data-template="blog-index" data-state={state} data-variant={variant}>
      <header>
        <p>
          Journal index for product updates, launch stories, and registry notes.
        </p>
        <ul>
          <li>cards</li>
          <li>filters</li>
          <li>empty state</li>
        </ul>
      </header>
    </main>
  );
}

export default BlogIndexTemplate;
