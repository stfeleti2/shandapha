export function renderTeamRolesStarterTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="team-roles-starter" data-state="${state}"><h1>Team Roles Starter</h1><p>Membership management starter with invites, roles, seats, and audit framing.</p></section>`;
}
