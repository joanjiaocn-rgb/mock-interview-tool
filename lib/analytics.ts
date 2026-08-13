export const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_ID?.trim() || "G-7D52S17CK7";

export const analyticsEnabled = Boolean(ga4MeasurementId);

type AnalyticsValue = string | number | boolean;

type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackAnalyticsEvent(eventName: string, params: AnalyticsParams = {}) {
  if (!analyticsEnabled || typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}

export function trackPageView(pagePath: string) {
  trackAnalyticsEvent("page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
}
