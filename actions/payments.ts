"use server";

import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  tierForPlayer,
  priceForTier,
  SUBSCRIPTION_PLANS,
  calculateInstallmentSchedule,
} from "@/lib/pricing";

export type CheckoutState = { error?: string } | undefined;

/** Unix timestamp exactly one calendar month from now, used as the trial_end
 * that defers the first recurring installment charge until then — the
 * upfront deposit still bills immediately as a separate invoice item. */
function oneMonthFromNow(): number {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return Math.floor(d.getTime() / 1000);
}

export async function createListingCheckoutSession(
  playerId: string,
  _prevState: CheckoutState,
  _formData: FormData
): Promise<CheckoutState> {
  const session = await requireRole("PARENT");

  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player || player.parentId !== session.user.id) notFound();

  if (player.listingStatus === "ACTIVE") {
    redirect("/dashboard");
  }

  if (!stripe) {
    return {
      error:
        "Payments aren't configured yet on this environment. Add STRIPE_SECRET_KEY to enable checkout.",
    };
  }

  const tier = tierForPlayer(player);
  const { totalCents } = priceForTier(tier);

  const headersList = await headers();
  const origin = headersList.get("origin") ?? process.env.AUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: totalCents,
          product_data: {
            name: `J.R. Recruiting listing — ${player.firstName} ${player.lastName} (${tier.name})`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/dashboard/players/${playerId}/payment?success=1`,
    cancel_url: `${origin}/dashboard/players/${playerId}/payment?canceled=1`,
    metadata: { playerId, parentId: session.user.id },
  });

  if (!checkoutSession.url) {
    return { error: "Could not start checkout. Please try again." };
  }

  await prisma.payment.create({
    data: {
      playerId,
      parentId: session.user.id,
      stripeCheckoutSessionId: checkoutSession.id,
      amountCents: totalCents,
      status: "PENDING",
    },
  });

  await prisma.player.update({ where: { id: playerId }, data: { listingStatus: "PENDING_PAYMENT" } });

  redirect(checkoutSession.url);
}

export async function createPaymentPlanCheckoutSession(
  playerId: string,
  _prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const session = await requireRole("PARENT");

  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player || player.parentId !== session.user.id) notFound();

  if (player.listingStatus === "ACTIVE") {
    redirect("/dashboard");
  }

  if (!stripe) {
    return {
      error:
        "Payments aren't configured yet on this environment. Add STRIPE_SECRET_KEY to enable checkout.",
    };
  }

  const upfrontPercent = formData.get("upfrontPercent") === "30" ? 30 : 20;
  const tier = tierForPlayer(player);
  const plan = SUBSCRIPTION_PLANS[tier.id].find((p) => p.upfrontPercent === upfrontPercent);
  if (!plan) {
    return { error: "Invalid payment plan selected." };
  }

  const schedule = calculateInstallmentSchedule(tier, plan);

  const headersList = await headers();
  const origin = headersList.get("origin") ?? process.env.AUTH_URL ?? "http://localhost:3000";
  const playerLabel = `${player.firstName} ${player.lastName} (${tier.name})`;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: schedule.upfrontCents,
          product_data: { name: `J.R. Recruiting listing deposit — ${playerLabel}` },
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "usd",
          unit_amount: schedule.monthlyCents,
          recurring: { interval: "month" },
          product_data: { name: `J.R. Recruiting monthly installment — ${playerLabel}` },
        },
        quantity: 1,
      },
    ],
    subscription_data: { trial_end: oneMonthFromNow() },
    success_url: `${origin}/dashboard/players/${playerId}/payment?success=1`,
    cancel_url: `${origin}/dashboard/players/${playerId}/payment?canceled=1`,
    metadata: { playerId, parentId: session.user.id, kind: "payment_plan" },
  });

  if (!checkoutSession.url) {
    return { error: "Could not start checkout. Please try again." };
  }

  await prisma.paymentPlanSubscription.upsert({
    where: { playerId },
    create: {
      playerId,
      parentId: session.user.id,
      stripeCheckoutSessionId: checkoutSession.id,
      tierId: tier.id,
      upfrontPercent,
      totalCents: schedule.totalCents,
      upfrontCents: schedule.upfrontCents,
      monthlyCents: schedule.monthlyCents,
      finalInstallmentCents: schedule.finalInstallmentCents,
      totalInstallments: schedule.totalInstallments,
      status: "ACTIVE",
    },
    update: {
      stripeCheckoutSessionId: checkoutSession.id,
      stripeSubscriptionId: null,
      stripeScheduleId: null,
      tierId: tier.id,
      upfrontPercent,
      totalCents: schedule.totalCents,
      upfrontCents: schedule.upfrontCents,
      monthlyCents: schedule.monthlyCents,
      finalInstallmentCents: schedule.finalInstallmentCents,
      totalInstallments: schedule.totalInstallments,
      installmentsPaid: 0,
      status: "ACTIVE",
      lastPaymentError: null,
      completedAt: null,
    },
  });

  await prisma.player.update({ where: { id: playerId }, data: { listingStatus: "PENDING_PAYMENT" } });

  redirect(checkoutSession.url);
}
