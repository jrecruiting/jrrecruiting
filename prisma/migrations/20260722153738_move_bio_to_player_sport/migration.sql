-- Move bio from a single player-level field to a per-sport field, since bio
-- content differs by sport. Existing bios are copied onto each player's
-- primary sport before the column is dropped.

-- AlterTable
ALTER TABLE "player_sports" ADD COLUMN "bio" TEXT;

-- Data migration: carry existing bios onto the primary PlayerSport row
UPDATE "player_sports" ps
SET "bio" = p."bio"
FROM "players" p
WHERE ps."playerId" = p.id
  AND ps."isPrimary" = true
  AND p."bio" IS NOT NULL;

-- AlterTable
ALTER TABLE "players" DROP COLUMN "bio";
