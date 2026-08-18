-- CreateTable
CREATE TABLE "alumni_updates" (
    "id" TEXT NOT NULL,
    "athleteName" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "updateText" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "photoUrl" TEXT,
    "linkUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "alumni_updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "alumni_updates_eventDate_idx" ON "alumni_updates"("eventDate");

-- AddForeignKey
ALTER TABLE "alumni_updates" ADD CONSTRAINT "alumni_updates_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumni_updates" ADD CONSTRAINT "alumni_updates_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
