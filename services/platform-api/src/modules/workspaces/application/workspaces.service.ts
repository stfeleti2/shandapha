import { PlatformHttpError } from "../../../server/middleware/errors";
import { summarizeWorkspace } from "../domain/workspaces.entity";
import { workspacesRepository } from "../infrastructure/workspaces.repository";

export function getWorkspacesSummary() {
  const repository = workspacesRepository();
  const workspaces = repository.listWorkspaces();

  return {
    module: "workspaces",
    total: workspaces.length,
    defaultWorkspaceId: workspaces[0]?.id ?? null,
    workspaces: workspaces.map(summarizeWorkspace),
  };
}

export function getWorkspaceDetail(workspaceId: string) {
  const repository = workspacesRepository();
  const workspace = repository.getWorkspace(workspaceId);

  if (!workspace) {
    throw new PlatformHttpError(404, `Unknown workspace "${workspaceId}".`);
  }

  return {
    module: "workspaces",
    workspace: summarizeWorkspace(workspace),
    usage: workspace.usage,
    templates: workspace.templateSlugs,
  };
}
