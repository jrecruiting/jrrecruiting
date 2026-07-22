-- Add back a general bio field on the player record, alongside the
-- per-sport bios added earlier -- the client wants both.

-- AlterTable
ALTER TABLE "players" ADD COLUMN "bio" TEXT;
