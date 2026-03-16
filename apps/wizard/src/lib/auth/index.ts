export const authMode = "workspace-scoped";

export const publicStudioRoutes = ["/sign-in", "/sign-up"] as const;

export function isPublicStudioRoute(pathname: string) {
  return publicStudioRoutes.some((route) => pathname === route);
}

export function getAuthNarrative(pathname: string) {
  return isPublicStudioRoute(pathname)
    ? "Public access routes stay lightweight so the product shell can focus on wizard and workspace flows."
    : "Authenticated routes keep wizard, exports, billing, and governance inside one product surface.";
}
