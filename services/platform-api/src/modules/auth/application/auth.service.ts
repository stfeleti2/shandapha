import { authMiddleware } from "../../../server/middleware/auth";
import { summarizeSessions } from "../domain/auth.entity";
import { authRepository } from "../infrastructure/auth.repository";

export function getAuthSummary(workspaceId?: string) {
  const repository = authRepository();
  const activeIdentity = repository.getActiveIdentity();
  const sessions = repository.listSessions(workspaceId);

  return {
    module: "auth",
    sessionStrategy: authMiddleware,
    activeIdentity,
    memberships: activeIdentity.workspaceIds.map((id) => ({
      workspaceId: id,
      workspaceName:
        id === "acme"
          ? "Acme"
          : id === "studio-labs"
            ? "Studio Labs"
            : "Unknown workspace",
      role: id === activeIdentity.defaultWorkspaceId ? "owner" : "member",
    })),
    sessions: summarizeSessions(sessions),
    recentSessions: sessions.slice(0, 3),
  };
}
