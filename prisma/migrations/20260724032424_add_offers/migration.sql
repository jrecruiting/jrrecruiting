-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "playerSportId" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedBy" TEXT NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "offers_playerSportId_idx" ON "offers"("playerSportId");

-- CreateIndex
CREATE INDEX "offers_status_idx" ON "offers"("status");

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_playerSportId_fkey" FOREIGN KEY ("playerSportId") REFERENCES "player_sports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
