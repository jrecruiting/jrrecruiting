-- CreateEnum
CREATE TYPE "PlayerType" AS ENUM ('HIGH_SCHOOL', 'JUCO', 'TRANSFER');

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "playerType" "PlayerType" NOT NULL DEFAULT 'HIGH_SCHOOL';

-- CreateIndex
CREATE INDEX "players_playerType_idx" ON "players"("playerType");
