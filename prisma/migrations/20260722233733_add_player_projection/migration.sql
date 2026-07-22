-- CreateEnum
CREATE TYPE "PlayerProjection" AS ENUM ('FBS', 'FCS', 'D2', 'D3', 'NAIA');

-- AlterTable
ALTER TABLE "player_sports" ADD COLUMN "projection" "PlayerProjection";

-- CreateIndex
CREATE INDEX "player_sports_sportId_projection_idx" ON "player_sports"("sportId", "projection");
