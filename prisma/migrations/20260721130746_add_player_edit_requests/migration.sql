-- CreateEnum
CREATE TYPE "EditRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'EDIT_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE 'EDIT_REJECTED';

-- CreateTable
CREATE TABLE "player_edit_requests" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "submittedBy" TEXT NOT NULL,
    "proposedData" JSONB NOT NULL,
    "status" "EditRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "rejectionReason" TEXT,

    CONSTRAINT "player_edit_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "player_edit_requests_status_idx" ON "player_edit_requests"("status");

-- AddForeignKey
ALTER TABLE "player_edit_requests" ADD CONSTRAINT "player_edit_requests_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_edit_requests" ADD CONSTRAINT "player_edit_requests_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_edit_requests" ADD CONSTRAINT "player_edit_requests_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
