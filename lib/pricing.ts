// Base one-time listing rate is $800/year of eligibility remaining.
// Packages lock in a lower per-year rate the earlier an athlete signs up,
// paid as a single one-time fee covering all years through graduation.
export const BASE_ANNUAL_RATE_CENTS = 80_000;

export type PackageTier = {
  id: "freshman" | "sophomore" | "junior" | "senior";
  name: string;
  gradeLabel: string;
  years: number;
  discountPercent: number;
};

export const PACKAGE_TIERS: PackageTier[] = [
  { id: "freshman", name: "Freshman Launch", gradeLabel: "Freshman", years: 4, discountPercent: 30 },
  { id: "sophomore", name: "Sophomore Rise", gradeLabel: "Sophomore", years: 3, discountPercent: 20 },
  { id: "junior", name: "Junior Push", gradeLabel: "Junior", years: 2, discountPercent: 10 },
  { id: "senior", name: "Senior Signing", gradeLabel: "Senior", years: 1, discountPercent: 0 },
];

export function priceForTier(tier: PackageTier) {
  const annualRateCents = Math.round(BASE_ANNUAL_RATE_CENTS * (1 - tier.discountPercent / 100));
  const totalCents = annualRateCents * tier.years;
  return { annualRateCents, totalCents };
}

export function formatCents(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Illustrative "Class of 20XX" grad year for the current recruiting cycle,
 * used only for display on the pricing page. Recruiting cycles are treated
 * as rolling over each summer (May onward counts as the upcoming cycle).
 */
export function currentSeniorGradYear(referenceDate = new Date()) {
  return referenceDate.getMonth() >= 4 ? referenceDate.getFullYear() + 1 : referenceDate.getFullYear();
}

export function gradYearForTier(tier: PackageTier, referenceDate = new Date()) {
  return currentSeniorGradYear(referenceDate) + (tier.years - 1);
}
