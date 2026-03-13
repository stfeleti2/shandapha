export const workspaceSections = [
  "overview",
  "themes",
  "templates",
  "exports",
  "billing",
  "usage",
  "members",
  "api-keys",
  "policies",
  "audit",
] as const;

export type WorkspaceSection = (typeof workspaceSections)[number];

export interface WorkspaceState {
  selectedWorkspace: string;
  section: WorkspaceSection;
}

export const workspaceStore: WorkspaceState = {
  selectedWorkspace: "acme",
  section: "overview",
};

export function createWorkspaceRoute(
  workspaceId: string,
  section: WorkspaceSection = workspaceStore.section,
) {
  return `/workspaces/${workspaceId}/${section}`;
}
