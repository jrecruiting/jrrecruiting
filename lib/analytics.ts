export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// No-ops if GA hasn't loaded yet (blocked by an ad blocker, or the env var
// isn't set in this environment) rather than throwing.
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}
