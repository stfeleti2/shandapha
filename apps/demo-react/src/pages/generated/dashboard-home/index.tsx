type DashboardHomeTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type DashboardHomeTemplateVariant = "executive" | "ops" | "support";

export interface DashboardHomeTemplateProps {
  state?: DashboardHomeTemplateState;
  variant?: DashboardHomeTemplateVariant;
}

export function DashboardHomeTemplate({
  state = "no access",
  variant = "executive",
}: DashboardHomeTemplateProps) {
  return (
    <main
      data-template="dashboard-home"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Overview shell with KPI rails, chart cards, activity cards, and action
          slots.
        </p>
        <ul>
          <li>chart container</li>
          <li>data table baseline</li>
          <li>sidebar shell</li>
          <li>section cards</li>
        </ul>
      </header>
    </main>
  );
}

export default DashboardHomeTemplate;
