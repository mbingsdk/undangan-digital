import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { GuestFormInput } from "./schemas";

export class GuestNotFoundError extends Error {
  constructor() {
    super("Tamu undangan tidak ditemukan.");
    this.name = "GuestNotFoundError";
  }
}

export class GuestLimitExceededError extends Error {
  constructor(maxGuest: number) {
    super(`Jumlah tamu maksimal ${maxGuest} untuk link undangan ini.`);
    this.name = "GuestLimitExceededError";
  }
}

async function assertInvitationExists(invitationId: string) {
  const invitation = await prisma.invitation.findFirst({
    select: {
      id: true,
    },
    where: {
      id: invitationId,
      deletedAt: null,
    },
  });

  if (!invitation) {
    throw new GuestNotFoundError();
  }
}

async function assertGuestExists(invitationId: string, guestId: string) {
  const guest = await prisma.invitationGuest.findFirst({
    select: {
      id: true,
    },
    where: {
      id: guestId,
      invitationId,
      invitation: {
        deletedAt: null,
      },
    },
  });

  if (!guest) {
    throw new GuestNotFoundError();
  }
}

function generateGuestCode() {
  return randomBytes(5).toString("base64url");
}

async function createUniqueGuestCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const guestCode = generateGuestCode();
    const existingGuest = await prisma.invitationGuest.findUnique({
      select: {
        id: true,
      },
      where: {
        guestCode,
      },
    });

    if (!existingGuest) {
      return guestCode;
    }
  }

  return `${generateGuestCode()}${generateGuestCode()}`;
}

export async function getInvitationGuestAdminData(invitationId: string) {
  const invitation = await prisma.invitation.findFirst({
    select: {
      id: true,
      slug: true,
      title: true,
      groomName: true,
      brideName: true,
      guests: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    where: {
      id: invitationId,
      deletedAt: null,
    },
  });

  if (!invitation) {
    return null;
  }

  return invitation;
}

export async function createInvitationGuest(
  invitationId: string,
  input: GuestFormInput,
) {
  await assertInvitationExists(invitationId);

  return prisma.invitationGuest.create({
    data: {
      ...input,
      guestCode: await createUniqueGuestCode(),
      invitationId,
    },
  });
}

export async function updateInvitationGuest(
  invitationId: string,
  guestId: string,
  input: GuestFormInput,
) {
  await assertGuestExists(invitationId, guestId);

  return prisma.invitationGuest.update({
    data: input,
    where: {
      id: guestId,
    },
  });
}

export async function deleteInvitationGuest(
  invitationId: string,
  guestId: string,
) {
  await assertGuestExists(invitationId, guestId);

  return prisma.invitationGuest.delete({
    where: {
      id: guestId,
    },
  });
}

export async function getPublicGuestForInvitation({
  guestCode,
  invitationId,
}: {
  guestCode?: string | null;
  invitationId: string;
}) {
  if (!guestCode) {
    return null;
  }

  return prisma.invitationGuest.findFirst({
    select: {
      id: true,
      name: true,
      guestCode: true,
      maxGuest: true,
      openedAt: true,
    },
    where: {
      guestCode,
      invitationId,
    },
  });
}

export async function markGuestOpened(guestId: string) {
  return prisma.invitationGuest.updateMany({
    data: {
      openedAt: new Date(),
    },
    where: {
      id: guestId,
      openedAt: null,
    },
  });
}

export async function getPublishedGuestForRsvp({
  guestCode,
  slug,
}: {
  guestCode?: string | null;
  slug: string;
}) {
  if (!guestCode) {
    return null;
  }

  return prisma.invitationGuest.findFirst({
    select: {
      id: true,
      maxGuest: true,
      name: true,
    },
    where: {
      guestCode,
      invitation: {
        slug,
        status: "PUBLISHED",
        deletedAt: null,
      },
    },
  });
}

export function assertGuestCountAllowed(guestCount: number, maxGuest: number) {
  if (guestCount > maxGuest) {
    throw new GuestLimitExceededError(maxGuest);
  }
}
