import { getPlatformStore } from "../../../db/store";

export function entitlementsRepository() {
  const store = getPlatformStore();

  return {
    getPlanId(workspaceId: string) {
      return (
        store.workspaces.find((workspace) => workspace.id === workspaceId)
          ?.planId ?? null
      );
    },
  };
}
