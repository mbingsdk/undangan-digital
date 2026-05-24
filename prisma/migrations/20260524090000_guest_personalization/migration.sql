-- CreateTable
CREATE TABLE "invitation_guests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "guestCode" TEXT NOT NULL,
    "maxGuest" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "openedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "invitation_guests_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_rsvps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL,
    "guestId" TEXT,
    "name" TEXT NOT NULL,
    "attendanceStatus" TEXT NOT NULL,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rsvps_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "rsvps_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "invitation_guests" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_rsvps" ("attendanceStatus", "createdAt", "guestCount", "id", "invitationId", "ipAddress", "message", "name") SELECT "attendanceStatus", "createdAt", "guestCount", "id", "invitationId", "ipAddress", "message", "name" FROM "rsvps";
DROP TABLE "rsvps";
ALTER TABLE "new_rsvps" RENAME TO "rsvps";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "invitation_guests_guestCode_key" ON "invitation_guests"("guestCode");

-- CreateIndex
CREATE INDEX "invitation_guests_invitationId_idx" ON "invitation_guests"("invitationId");

-- CreateIndex
CREATE INDEX "invitation_guests_openedAt_idx" ON "invitation_guests"("openedAt");

-- CreateIndex
CREATE INDEX "rsvps_invitationId_idx" ON "rsvps"("invitationId");

-- CreateIndex
CREATE INDEX "rsvps_guestId_idx" ON "rsvps"("guestId");
