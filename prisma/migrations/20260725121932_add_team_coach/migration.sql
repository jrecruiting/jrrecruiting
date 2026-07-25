-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'TEAM_COACH_PROFILE_VIEWED';
ALTER TYPE "NotificationType" ADD VALUE 'TEAM_COACH_PROFILE_UPDATED';

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'TEAM_COACH';

-- CreateTable
CREATE TABLE "team_coach_access" (
    "id" TEXT NOT NULL,
    "teamCoachId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_coach_access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "team_coach_access_playerId_idx" ON "team_coach_access"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "team_coach_access_teamCoachId_playerId_key" ON "team_coach_access"("teamCoachId", "playerId");

-- AddForeignKey
ALTER TABLE "team_coach_access" ADD CONSTRAINT "team_coach_access_teamCoachId_fkey" FOREIGN KEY ("teamCoachId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_coach_access" ADD CONSTRAINT "team_coach_access_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
