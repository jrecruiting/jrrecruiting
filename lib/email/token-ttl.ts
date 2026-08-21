// 7 days -- a coach welcome/set-password link is a first-time setup step,
// not an urgent lockout reset, so it gets a longer window than the 1-hour
// forgot-password flow. Shared between actions/coaches.ts (initial send)
// and actions/admin-email-log.ts (resend) -- kept out of either "use
// server" file since those can only export async functions.
export const WELCOME_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
