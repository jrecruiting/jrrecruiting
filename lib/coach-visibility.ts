/**
 * Unverified coach accounts can browse and search, but don't get
 * identifying details on a minor's profile until an admin has verified
 * them. Verified-only fields: full last name, exact city, bio, and
 * highlight video links. Recruiting stats (sport, position, grad year,
 * state, height/weight/GPA) stay visible to any signed-in coach.
 */
export function maskLastName(lastName: string): string {
  const initial = lastName.trim().charAt(0).toUpperCase();
  return initial ? `${initial}.` : "";
}
