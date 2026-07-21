-- DropForeignKey
ALTER TABLE "payment_plan_subscriptions" DROP CONSTRAINT "payment_plan_subscriptions_playerId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_playerId_fkey";

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_plan_subscriptions" ADD CONSTRAINT "payment_plan_subscriptions_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
