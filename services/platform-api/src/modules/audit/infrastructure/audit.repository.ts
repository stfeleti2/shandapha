import { getPlatformStore } from "../../../db/store";

export function auditRepository() {
  const store = getPlatformStore();

  return {
    listEvents(workspaceId: string) {
      return store.audit.events
        .filter((event) => event.workspaceId === workspaceId)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    },
  };
}
