export const sessionStrategy = "cookie";

export const sessionCookie = {
  name: "shandapha_studio",
  sameSite: "lax",
  secure: true,
  maxAgeDays: 30,
} as const;

export function getSessionCookieMaxAgeSeconds() {
  return sessionCookie.maxAgeDays * 24 * 60 * 60;
}

export function createSessionCookieHeader(value: string) {
  return [
    `${sessionCookie.name}=${encodeURIComponent(value)}`,
    `Max-Age=${getSessionCookieMaxAgeSeconds()}`,
    "Path=/",
    `SameSite=${sessionCookie.sameSite}`,
    sessionCookie.secure ? "Secure" : null,
    "HttpOnly",
  ]
    .filter(Boolean)
    .join("; ");
}
