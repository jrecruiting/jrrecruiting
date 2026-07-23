-- Player Projection becomes a multi-select per sport (e.g. a player can be
-- tagged both FCS and D2 for the same sport), replacing the single-value
-- column with an array.

-- AlterTable
ALTER TABLE "player_sports" ADD COLUMN "projections" "PlayerProjection"[] NOT NULL DEFAULT '{}';

-- Data migration: carry the existing single value into the new array
UPDATE "player_sports" SET "projections" = ARRAY["projection"] WHERE "projection" IS NOT NULL;

-- DropIndex
DROP INDEX "player_sports_sportId_projection_idx";

-- AlterTable
ALTER TABLE "player_sports" DROP COLUMN "projection";
