-- CreateTable
CREATE TABLE "school_football_schedules" (
    "id" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "scheduleUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_football_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "school_football_schedules_schoolName_key" ON "school_football_schedules"("schoolName");
