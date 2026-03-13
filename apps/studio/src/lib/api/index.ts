export const apiBaseUrl =
  process.env.NEXT_PUBLIC_PLATFORM_API_URL ?? "http://localhost:4000";

export const studioApiRoutes = {
  health: "/health",
  registryCatalog: "/api/registry/catalog",
  exportsSummary: "/api/exports/summary",
  billingSummary: "/api/billing/summary",
  usageSummary: "/api/telemetry/summary",
} as const;

export type StudioApiRoute = keyof typeof studioApiRoutes;

export function createStudioApiUrl(
  route: StudioApiRoute,
  query?: Record<string, string | number | boolean | undefined>,
) {
  const base = apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  const url = new URL(`${base}${studioApiRoutes[route]}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined) {
      continue;
    }
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}
