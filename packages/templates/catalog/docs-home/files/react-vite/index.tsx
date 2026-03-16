type DocsHomeTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type DocsHomeTemplateVariant = "product" | "developer";

export interface DocsHomeTemplateProps {
  state?: DocsHomeTemplateState;
  variant?: DocsHomeTemplateVariant;
}

export function DocsHomeTemplate({
  state = "no access",
  variant = "product",
}: DocsHomeTemplateProps) {
  return (
    <main data-template="docs-home" data-state={state} data-variant={variant}>
      <header>
        <p>
          Documentation landing page with category rails, quickstarts, and
          install guidance.
        </p>
        <ul>
          <li>docs shell</li>
          <li>cards</li>
          <li>search strip</li>
        </ul>
      </header>
    </main>
  );
}

export default DocsHomeTemplate;
