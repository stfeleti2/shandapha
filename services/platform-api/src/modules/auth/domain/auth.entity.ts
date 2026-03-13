export interface AuthIdentity {
  id: string;
  email: string;
  name: string;
  role: string;
  workspaceIds: string[];
  defaultWorkspaceId: string;
  lastSignInAt: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  workspaceId: string;
  deviceLabel: string;
  createdAt: string;
  lastSeenAt: string;
  state: "active" | "expired";
}

export interface AuthMembership {
  workspaceId: string;
  workspaceName: string;
  role: string;
}

export function summarizeSessions(sessions: AuthSession[]) {
  return {
    total: sessions.length,
    active: sessions.filter((session) => session.state === "active").length,
    lastSeenAt:
      sessions
        .map((session) => session.lastSeenAt)
        .sort()
        .at(-1) ?? null,
  };
}
