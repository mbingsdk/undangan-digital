-- Preserve all existing invitations as SINGLE.
ALTER TABLE "invitations" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'SINGLE';

CREATE TABLE "invitation_couples" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL,
    "groomName" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "invitation_couples_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "invitation_couples_invitationId_sortOrder_key" ON "invitation_couples"("invitationId", "sortOrder");
CREATE INDEX "invitation_couples_invitationId_idx" ON "invitation_couples"("invitationId");
