// Server-rendered timestamps default to the server's clock (UTC on
// Vercel), which doesn't match where the business actually operates.
// Admin-facing timestamps are shown in Pacific time instead, with an
// explicit "PT" suffix so it's never ambiguous which timezone is shown.
const PACIFIC_TZ = "America/Los_Angeles";

export function formatPacificDateTime(date: Date): string {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: PACIFIC_TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  return `${formatted} PT`;
}

export function formatPacificDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: PACIFIC_TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);
}
