import { getPlatformStore } from "../../../db/store";

export function authRepository() {
  const store = getPlatformStore();

  return {
    getActiveIdentity() {
      return store.auth.identities[0];
    },
    listIdentities() {
      return store.auth.identities;
    },
    listSessions(workspaceId?: string) {
      return workspaceId
        ? store.auth.sessions.filter(
            (session) => session.workspaceId === workspaceId,
          )
        : store.auth.sessions;
    },
  };
}
