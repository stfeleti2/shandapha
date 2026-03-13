export const analyticsMode = "privacy-safe";

export const analyticsEvents = {
  landingViewed: "web.landing.viewed",
  pricingViewed: "web.pricing.viewed",
  playgroundViewed: "web.playground.viewed",
  docsViewed: "web.docs.viewed",
} as const;

export type AnalyticsEvent =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];

export function createAnalyticsPayload(
  event: AnalyticsEvent,
  pathname: string,
  attributes: Record<string, string | number | boolean> = {},
) {
  return {
    event,
    pathname,
    attributes,
    mode: analyticsMode,
  };
}
