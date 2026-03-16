type TeamRolesStarterTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type TeamRolesStarterTemplateVariant = "internal team" | "customer admin";

export interface TeamRolesStarterTemplateProps {
  state?: TeamRolesStarterTemplateState;
  variant?: TeamRolesStarterTemplateVariant;
}

export function TeamRolesStarterTemplate({
  state = "no access",
  variant = "internal team",
}: TeamRolesStarterTemplateProps) {
  return (
    <main
      data-template="team-roles-starter"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Membership management starter with invites, roles, seats, and audit
          framing.
        </p>
        <ul>
          <li>avatar list</li>
          <li>table</li>
          <li>badge</li>
          <li>sheet</li>
        </ul>
      </header>
    </main>
  );
}

export default TeamRolesStarterTemplate;
