type ListFiltersTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type ListFiltersTemplateVariant = "simple" | "advanced";

export interface ListFiltersTemplateProps {
  state?: ListFiltersTemplateState;
  variant?: ListFiltersTemplateVariant;
}

export function ListFiltersTemplate({
  state = "no access",
  variant = "simple",
}: ListFiltersTemplateProps) {
  return (
    <main
      data-template="list-filters"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Dense index page with filters, saved views, bulk actions, and table
          affordances.
        </p>
        <ul>
          <li>data toolbar</li>
          <li>table baseline</li>
          <li>bulk action bar</li>
        </ul>
      </header>
    </main>
  );
}

export default ListFiltersTemplate;
