// Base one-time listing rate is $800/year of eligibility remaining.
// Packages lock in a lower per-year rate the earlier an athlete signs up,
// paid as a single one-time fee covering all years through graduation.
export const BASE_ANNUAL_RATE_CENTS = 80_000;

export type PackageTierId = "freshman" | "sophomore" | "junior" | "senior" | "juco" | "transfer";

export type PackageTier = {
  id: PackageTierId;
  name: string;
  gradeLabel: string;
  years: number;
  discountPercent: number;
};

// High-school packages — 4 grad-year tiers, discount scales with years of
// eligibility remaining (the earlier you sign up, the more you save).
export const PACKAGE_TIERS: PackageTier[] = [
  { id: "freshman", name: "Freshman Launch", gradeLabel: "Freshman", years: 4, discountPercent: 30 },
  { id: "sophomore", name: "Sophomore Rise", gradeLabel: "Sophomore", years: 3, discountPercent: 20 },
  { id: "junior", name: "Junior Push", gradeLabel: "Junior", years: 2, discountPercent: 10 },
  { id: "senior", name: "Senior Signing", gradeLabel: "Senior", years: 1, discountPercent: 0 },
];

// JUCO and Transfer players aren't tiered by grad year — each is a single
// flat package, identical in price/structure to Senior Signing (full
// $800 rate, no early-signup discount, one year of listing coverage).
export type FlatPackageCategory = {
  tierId: "juco" | "transfer";
  sectionName: string;
  playerType: "JUCO" | "TRANSFER";
};

export const FLAT_PACKAGE_CATEGORIES: FlatPackageCategory[] = [
  { tierId: "juco", sectionName: "JUCO Grind", playerType: "JUCO" },
  { tierId: "transfer", sectionName: "Portal Entry", playerType: "TRANSFER" },
];

export const FLAT_PACKAGE_TIERS: PackageTier[] = FLAT_PACKAGE_CATEGORIES.map((cat) => ({
  id: cat.tierId,
  name: cat.sectionName,
  gradeLabel: cat.sectionName,
  years: 1,
  discountPercent: 0,
}));

// JUCO/Transfer athletes are often old enough to sign themselves up, not
// just a parent, so their "Get Started" links flag that on the sign-up page.
export function signUpHrefForTier(tier: PackageTier) {
  return tier.id === "juco" || tier.id === "transfer" ? "/sign-up?audience=player" : "/sign-up";
}

export function priceForTier(tier: PackageTier) {
  const annualRateCents = Math.round(BASE_ANNUAL_RATE_CENTS * (1 - tier.discountPercent / 100));
  const totalCents = annualRateCents * tier.years;
  return { annualRateCents, totalCents };
}

/** Undiscounted total ($800/yr x years) — what subscription plans pay in exchange for spreading payment out. */
export function fullPriceForTier(tier: PackageTier) {
  return BASE_ANNUAL_RATE_CENTS * tier.years;
}

// ── Subscription (installment) plans ────────────────────────────────
// Each tier offers two financing options that pay off the *full,
// undiscounted* price (no early-signup discount) via an upfront
// percentage plus a fixed monthly charge. Billing stops once the
// balance is paid off — the final installment is reduced so the total
// collected exactly equals the full price.

export type SubscriptionPlan = {
  upfrontPercent: 20 | 30;
  monthlyCents: number;
};

export const SUBSCRIPTION_PLANS: Record<PackageTierId, SubscriptionPlan[]> = {
  senior: [
    { upfrontPercent: 20, monthlyCents: 9_995 },
    // Rounded up from $79.95 to $80.00 — divides the $560 balance into
    // 7 clean, equal payments instead of 7 payments + a $0.35 final one.
    { upfrontPercent: 30, monthlyCents: 8_000 },
  ],
  // JUCO/Transfer are single flat packages priced identically to Senior
  // Signing (same $800 total, same installment options).
  juco: [
    { upfrontPercent: 20, monthlyCents: 9_995 },
    { upfrontPercent: 30, monthlyCents: 8_000 },
  ],
  transfer: [
    { upfrontPercent: 20, monthlyCents: 9_995 },
    { upfrontPercent: 30, monthlyCents: 8_000 },
  ],
  junior: [
    { upfrontPercent: 20, monthlyCents: 6_995 },
    { upfrontPercent: 30, monthlyCents: 5_995 },
  ],
  sophomore: [
    // Rounded up from $59.95 to $60.00 — divides the $1,920 balance into
    // 32 clean, equal payments instead of 32 payments + a $1.60 final one.
    { upfrontPercent: 20, monthlyCents: 6_000 },
    { upfrontPercent: 30, monthlyCents: 5_495 },
  ],
  freshman: [
    { upfrontPercent: 20, monthlyCents: 5_995 },
    { upfrontPercent: 30, monthlyCents: 4_995 },
  ],
};

export type InstallmentSchedule = {
  totalCents: number;
  upfrontCents: number;
  monthlyCents: number;
  /** Number of full-price monthly charges before the final (reduced) one. */
  fullInstallments: number;
  /** The last, smaller charge that closes the balance to exactly zero. */
  finalInstallmentCents: number;
  /** Total number of monthly charges, including the final reduced one. */
  totalInstallments: number;
};

export function calculateInstallmentSchedule(
  tier: PackageTier,
  plan: SubscriptionPlan
): InstallmentSchedule {
  const totalCents = fullPriceForTier(tier);
  const upfrontCents = Math.round((totalCents * plan.upfrontPercent) / 100);
  const remainingCents = totalCents - upfrontCents;

  const totalInstallments = Math.ceil(remainingCents / plan.monthlyCents);
  const fullInstallments = totalInstallments - 1;
  const finalInstallmentCents = remainingCents - fullInstallments * plan.monthlyCents;

  return {
    totalCents,
    upfrontCents,
    monthlyCents: plan.monthlyCents,
    fullInstallments,
    finalInstallmentCents,
    totalInstallments,
  };
}

export function formatCents(cents: number) {
  const hasCents = cents % 100 !== 0;
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
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

/**
 * Determines which package tier a given player's listing fee should be
 * priced at, matching the tiers shown on the public pricing page. JUCO and
 * Transfer players always get their flat package; High School players are
 * priced by years of eligibility remaining until their grad year, clamped
 * to the tiers we actually offer (Senior..Freshman) so an out-of-range grad
 * year still resolves to a sensible tier instead of failing to match.
 */
export function tierForPlayer(
  player: { playerType: "HIGH_SCHOOL" | "JUCO" | "TRANSFER"; gradYear: number },
  referenceDate = new Date()
): PackageTier {
  if (player.playerType === "JUCO") {
    return FLAT_PACKAGE_TIERS.find((t) => t.id === "juco")!;
  }
  if (player.playerType === "TRANSFER") {
    return FLAT_PACKAGE_TIERS.find((t) => t.id === "transfer")!;
  }

  const yearsRemaining = player.gradYear - currentSeniorGradYear(referenceDate) + 1;
  const maxYears = Math.max(...PACKAGE_TIERS.map((t) => t.years));
  const clamped = Math.min(Math.max(yearsRemaining, 1), maxYears);
  return PACKAGE_TIERS.find((t) => t.years === clamped) ?? PACKAGE_TIERS[PACKAGE_TIERS.length - 1];
}
