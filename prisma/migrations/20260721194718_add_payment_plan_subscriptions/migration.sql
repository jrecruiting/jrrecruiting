-- CreateEnum
CREATE TYPE "PaymentPlanStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'COMPLETED', 'CANCELED');

-- CreateTable
CREATE TABLE "payment_plan_subscriptions" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripeScheduleId" TEXT,
    "tierId" TEXT NOT NULL,
    "upfrontPercent" INTEGER NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "upfrontCents" INTEGER NOT NULL,
    "monthlyCents" INTEGER NOT NULL,
    "finalInstallmentCents" INTEGER NOT NULL,
    "totalInstallments" INTEGER NOT NULL,
    "installmentsPaid" INTEGER NOT NULL DEFAULT 0,
    "status" "PaymentPlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastPaymentError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "payment_plan_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_plan_subscriptions_playerId_key" ON "payment_plan_subscriptions"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_plan_subscriptions_stripeCheckoutSessionId_key" ON "payment_plan_subscriptions"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_plan_subscriptions_stripeSubscriptionId_key" ON "payment_plan_subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "payment_plan_subscriptions_status_idx" ON "payment_plan_subscriptions"("status");

-- AddForeignKey
ALTER TABLE "payment_plan_subscriptions" ADD CONSTRAINT "payment_plan_subscriptions_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_plan_subscriptions" ADD CONSTRAINT "payment_plan_subscriptions_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
