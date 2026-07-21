import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { scheduleOutboxFlush } from "@/lib/email/send";

async function activateListing(playerId: string) {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      firstName: true,
      lastName: true,
      listingStatus: true,
      parentId: true,
      parent: { select: { email: true } },
    },
  });
  if (!player) return;

  const playerName = `${player.firstName} ${player.lastName}`;

  await prisma.$transaction([
    // Payment plans re-enter this on every successful installment; only
    // (re-)notify the parent and bump publishedAt the first time it goes live.
    ...(player.listingStatus !== "ACTIVE"
      ? [
          prisma.player.update({
            where: { id: playerId },
            data: { listingStatus: "ACTIVE" as const, publishedAt: new Date() },
          }),
        ]
      : []),
    ...(player.listingStatus !== "ACTIVE" && player.parentId
      ? [
          prisma.notification.create({
            data: {
              userId: player.parentId,
              type: "LISTING_PAID" as const,
              payload: { playerId, playerName },
            },
          }),
        ]
      : []),
    ...(player.listingStatus !== "ACTIVE" && player.parent?.email
      ? [
          prisma.emailOutbox.create({
            data: {
              toEmail: player.parent.email,
              templateKey: "listing-paid",
              payload: { playerName },
            },
          }),
        ]
      : []),
  ]);
  scheduleOutboxFlush();
}

/**
 * Converts the subscription Stripe auto-created at Checkout into a
 * Subscription Schedule with an exact number of cycles: the existing trial
 * phase (deposit already billed as a one-time invoice item, recurring price
 * deferred until trial_end) is preserved exactly as-is, followed by the
 * regular monthly amount for every remaining installment, then one final,
 * differently-sized installment, after which Stripe cancels the
 * subscription automatically.
 */
async function attachInstallmentSchedule(
  stripeClient: NonNullable<typeof stripe>,
  subscriptionId: string,
  finalInstallmentCents: number,
  fullInstallments: number
) {
  const schedule = await stripeClient.subscriptionSchedules.create({ from_subscription: subscriptionId });
  const trialPhase = schedule.phases[0];
  const priceField = trialPhase.items[0].price;
  const monthlyPriceId = typeof priceField === "string" ? priceField : priceField.id;
  const monthlyPrice = await stripeClient.prices.retrieve(monthlyPriceId);
  if (monthlyPrice.deleted) {
    throw new Error(`Price ${monthlyPriceId} was deleted before the schedule could be built`);
  }
  const productField = monthlyPrice.product;
  const productId = typeof productField === "string" ? productField : productField.id;

  const finalPrice = await stripeClient.prices.create({
    currency: "usd",
    unit_amount: finalInstallmentCents,
    recurring: { interval: "month" },
    product: productId,
  });

  const updated = await stripeClient.subscriptionSchedules.update(schedule.id, {
    end_behavior: "cancel",
    proration_behavior: "none",
    phases: [
      {
        // Reproduce the trial phase exactly: end_date must equal trial_end
        // (not a `duration`) or Stripe leaves a billable gap between the
        // trial ending and the next phase starting.
        items: [{ price: monthlyPriceId, quantity: 1 }],
        start_date: trialPhase.start_date,
        end_date: trialPhase.end_date,
        trial_end: trialPhase.end_date,
      },
      {
        items: [{ price: monthlyPriceId, quantity: 1 }],
        duration: { interval: "month", interval_count: Math.max(fullInstallments, 1) },
      },
      {
        items: [{ price: finalPrice.id, quantity: 1 }],
        duration: { interval: "month", interval_count: 1 },
      },
    ],
  });

  return updated.id;
}

export async function POST(req: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const playerId = session.metadata?.playerId;

    if (session.mode === "subscription") {
      const plan = await prisma.paymentPlanSubscription.findUnique({
        where: { stripeCheckoutSessionId: session.id },
      });
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

      // Guard against Stripe redelivering this event: without this, a retry
      // would create a second schedule/price against the same subscription.
      if (plan && playerId && subscriptionId && !plan.stripeSubscriptionId) {
        const fullInstallments = plan.totalInstallments - 1;
        const scheduleId = await attachInstallmentSchedule(
          stripe,
          subscriptionId,
          plan.finalInstallmentCents,
          fullInstallments
        );

        await prisma.paymentPlanSubscription.update({
          where: { id: plan.id },
          data: {
            stripeSubscriptionId: subscriptionId,
            stripeScheduleId: scheduleId,
            // Only the deposit has been charged so far (billed immediately
            // as a one-time invoice item); the first real installment isn't
            // due until the trial ends one month from now.
            installmentsPaid: 0,
            status: "ACTIVE",
          },
        });

        await activateListing(playerId);
      }
    } else if (playerId) {
      const payment = await prisma.payment.findUnique({
        where: { stripeCheckoutSessionId: session.id },
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            paidAt: new Date(),
            stripePaymentIntentId:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
          },
        });
        await activateListing(playerId);
      }
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = invoice.parent?.subscription_details?.subscription;
    const subId = typeof subscriptionId === "string" ? subscriptionId : subscriptionId?.id;

    if (subId) {
      const plan = await prisma.paymentPlanSubscription.findUnique({
        where: { stripeSubscriptionId: subId },
      });
      // The checkout-time invoice only contains the deposit (billing_reason
      // "subscription_create") -- not a real installment, so skip it here.
      if (plan && invoice.billing_reason !== "subscription_create") {
        await prisma.paymentPlanSubscription.update({
          where: { id: plan.id },
          data: {
            installmentsPaid: { increment: 1 },
            status: "ACTIVE",
            lastPaymentError: null,
          },
        });
      }
    }
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = invoice.parent?.subscription_details?.subscription;
    const subId = typeof subscriptionId === "string" ? subscriptionId : subscriptionId?.id;

    if (subId) {
      await prisma.paymentPlanSubscription.updateMany({
        where: { stripeSubscriptionId: subId },
        data: {
          status: "PAST_DUE",
          lastPaymentError: "Most recent installment charge failed. Stripe will retry automatically.",
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const plan = await prisma.paymentPlanSubscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });
    if (plan && plan.status !== "CANCELED") {
      const completed = plan.installmentsPaid >= plan.totalInstallments;
      await prisma.paymentPlanSubscription.update({
        where: { id: plan.id },
        data: {
          status: completed ? "COMPLETED" : "CANCELED",
          completedAt: completed ? new Date() : null,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
