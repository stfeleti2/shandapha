type ChangelogTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type ChangelogTemplateVariant = "product" | "package";

export interface ChangelogTemplateProps {
  state?: ChangelogTemplateState;
  variant?: ChangelogTemplateVariant;
}

export function ChangelogTemplate({
  state = "no access",
  variant = "product",
}: ChangelogTemplateProps) {
  return (
    <main data-template="changelog" data-state={state} data-variant={variant}>
      <header>
        <p>
          Release note stream with upgrade guidance, registry updates, and issue
          tracking hooks.
        </p>
        <ul>
          <li>timeline</li>
          <li>badge</li>
          <li>article cards</li>
        </ul>
      </header>
    </main>
  );
}

export default ChangelogTemplate;
