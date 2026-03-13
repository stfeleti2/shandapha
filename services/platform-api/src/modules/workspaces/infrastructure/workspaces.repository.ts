import { getPlatformStore } from "../../../db/store";

export function workspacesRepository() {
  const store = getPlatformStore();

  return {
    listWorkspaces() {
      return store.workspaces;
    },
    getWorkspace(workspaceId: string) {
      return (
        store.workspaces.find((workspace) => workspace.id === workspaceId) ??
        null
      );
    },
  };
}
