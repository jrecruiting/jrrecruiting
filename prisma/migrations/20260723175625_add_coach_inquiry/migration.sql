-- CreateTable
CREATE TABLE "coach_inquiries" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coach_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "coach_inquiries_createdAt_idx" ON "coach_inquiries"("createdAt");

-- AddForeignKey
ALTER TABLE "coach_inquiries" ADD CONSTRAINT "coach_inquiries_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
