-- CreateTable
CREATE TABLE "parent_view_events" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_view_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "parent_view_events_playerId_viewedAt_idx" ON "parent_view_events"("playerId", "viewedAt");

-- AddForeignKey
ALTER TABLE "parent_view_events" ADD CONSTRAINT "parent_view_events_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_view_events" ADD CONSTRAINT "parent_view_events_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
