-- CreateEnum
CREATE TYPE "SchoolInterestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "school_interests" (
    "id" TEXT NOT NULL,
    "playerSportId" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "status" "SchoolInterestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedBy" TEXT NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,

    CONSTRAINT "school_interests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "school_interests_playerSportId_idx" ON "school_interests"("playerSportId");

-- CreateIndex
CREATE INDEX "school_interests_status_idx" ON "school_interests"("status");

-- AddForeignKey
ALTER TABLE "school_interests" ADD CONSTRAINT "school_interests_playerSportId_fkey" FOREIGN KEY ("playerSportId") REFERENCES "player_sports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_interests" ADD CONSTRAINT "school_interests_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_interests" ADD CONSTRAINT "school_interests_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
