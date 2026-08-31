/*
  Warnings:

  - Added the required column `updatedAt` to the `media_assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Backfill existing rows with createdAt (best available approximation of
-- "not updated since"), then drop the temporary default so future inserts
-- must supply it explicitly via Prisma's @updatedAt.
ALTER TABLE "media_assets" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now();
UPDATE "media_assets" SET "updatedAt" = "createdAt";
ALTER TABLE "media_assets" ALTER COLUMN "updatedAt" DROP DEFAULT;
