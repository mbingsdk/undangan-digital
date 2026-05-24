import { prisma } from "@/lib/prisma";
import type {
  EventFormInput,
  GalleryImageFormInput,
  GiftAccountFormInput,
  InvitationFormInput,
} from "./schemas";

export class InvitationSlugConflictError extends Error {
  constructor() {
    super("Slug sudah digunakan undangan lain.");
    this.name = "InvitationSlugConflictError";
  }
}

export class InvitationNotFoundError extends Error {
  constructor() {
    super("Undangan tidak ditemukan.");
    this.name = "InvitationNotFoundError";
  }
}

export class InvitationContentNotFoundError extends Error {
  constructor() {
    super("Konten undangan tidak ditemukan.");
    this.name = "InvitationContentNotFoundError";
  }
}

function getPublishedAt(status: InvitationFormInput["status"]) {
  return status === "PUBLISHED" ? new Date() : null;
}

async function assertUniqueSlug(slug: string, currentId?: string) {
  const existingInvitation = await prisma.invitation.findFirst({
    select: {
      id: true,
    },
    where: {
      slug,
      ...(currentId
        ? {
            NOT: {
              id: currentId,
            },
          }
        : {}),
    },
  });

  if (existingInvitation) {
    throw new InvitationSlugConflictError();
  }
}

async function assertInvitationExists(id: string) {
  const invitation = await prisma.invitation.findFirst({
    select: {
      id: true,
    },
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!invitation) {
    throw new InvitationNotFoundError();
  }
}

export async function listInvitations() {
  return prisma.invitation.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      status: true,
      title: true,
      groomName: true,
      brideName: true,
      publishedAt: true,
      updatedAt: true,
    },
    where: {
      deletedAt: null,
    },
  });
}

export async function getInvitationDashboardSummary() {
  const [
    totalInvitations,
    publishedInvitations,
    totalRsvps,
    totalWishes,
    latestInvitations,
  ] = await Promise.all([
    prisma.invitation.count({
      where: {
        deletedAt: null,
      },
    }),
    prisma.invitation.count({
      where: {
        deletedAt: null,
        status: "PUBLISHED",
      },
    }),
    prisma.rSVP.count(),
    prisma.wish.count(),
    prisma.invitation.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        slug: true,
        status: true,
        title: true,
      },
      take: 5,
      where: {
        deletedAt: null,
      },
    }),
  ]);

  return {
    latestInvitations,
    publishedInvitations,
    totalInvitations,
    totalRsvps,
    totalWishes,
  };
}

export async function getInvitationById(id: string) {
  return prisma.invitation.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
}

export async function getInvitationEditorData(id: string) {
  return prisma.invitation.findFirst({
    include: {
      events: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            date: "asc",
          },
        ],
      },
      galleries: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      },
      gifts: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      },
    },
    where: {
      id,
      deletedAt: null,
    },
  });
}

export async function createInvitation(input: InvitationFormInput) {
  await assertUniqueSlug(input.slug);

  return prisma.invitation.create({
    data: {
      ...input,
      publishedAt: getPublishedAt(input.status),
    },
  });
}

export async function updateInvitation(id: string, input: InvitationFormInput) {
  await assertInvitationExists(id);
  await assertUniqueSlug(input.slug, id);

  const currentInvitation = await prisma.invitation.findUnique({
    select: {
      publishedAt: true,
    },
    where: {
      id,
    },
  });

  if (!currentInvitation) {
    throw new InvitationNotFoundError();
  }

  return prisma.invitation.update({
    data: {
      ...input,
      publishedAt:
        input.status === "PUBLISHED"
          ? (currentInvitation.publishedAt ?? new Date())
          : null,
    },
    where: {
      id,
    },
  });
}

export async function softDeleteInvitation(id: string) {
  await assertInvitationExists(id);

  return prisma.invitation.update({
    data: {
      deletedAt: new Date(),
      publishedAt: null,
      status: "ARCHIVED",
    },
    where: {
      id,
    },
  });
}

export async function publishInvitation(id: string) {
  await assertInvitationExists(id);

  return prisma.invitation.update({
    data: {
      publishedAt: new Date(),
      status: "PUBLISHED",
    },
    where: {
      id,
    },
  });
}

export async function unpublishInvitation(id: string) {
  await assertInvitationExists(id);

  return prisma.invitation.update({
    data: {
      publishedAt: null,
      status: "DRAFT",
    },
    where: {
      id,
    },
  });
}

async function assertInvitationEventExists(invitationId: string, eventId: string) {
  const event = await prisma.invitationEvent.findFirst({
    select: {
      id: true,
    },
    where: {
      id: eventId,
      invitationId,
      invitation: {
        deletedAt: null,
      },
    },
  });

  if (!event) {
    throw new InvitationContentNotFoundError();
  }
}

async function assertGalleryImageExists(invitationId: string, imageId: string) {
  const image = await prisma.galleryImage.findFirst({
    select: {
      id: true,
    },
    where: {
      id: imageId,
      invitationId,
      invitation: {
        deletedAt: null,
      },
    },
  });

  if (!image) {
    throw new InvitationContentNotFoundError();
  }
}

async function assertGiftAccountExists(invitationId: string, giftId: string) {
  const gift = await prisma.giftAccount.findFirst({
    select: {
      id: true,
    },
    where: {
      id: giftId,
      invitationId,
      invitation: {
        deletedAt: null,
      },
    },
  });

  if (!gift) {
    throw new InvitationContentNotFoundError();
  }
}

export async function createInvitationEvent(
  invitationId: string,
  input: EventFormInput,
) {
  await assertInvitationExists(invitationId);

  return prisma.invitationEvent.create({
    data: {
      ...input,
      invitationId,
    },
  });
}

export async function updateInvitationEvent(
  invitationId: string,
  eventId: string,
  input: EventFormInput,
) {
  await assertInvitationEventExists(invitationId, eventId);

  return prisma.invitationEvent.update({
    data: input,
    where: {
      id: eventId,
    },
  });
}

export async function deleteInvitationEvent(
  invitationId: string,
  eventId: string,
) {
  await assertInvitationEventExists(invitationId, eventId);

  return prisma.invitationEvent.delete({
    where: {
      id: eventId,
    },
  });
}

export async function createGalleryImage(
  invitationId: string,
  input: GalleryImageFormInput,
) {
  await assertInvitationExists(invitationId);

  return prisma.galleryImage.create({
    data: {
      ...input,
      invitationId,
    },
  });
}

export async function updateGalleryImage(
  invitationId: string,
  imageId: string,
  input: GalleryImageFormInput,
) {
  await assertGalleryImageExists(invitationId, imageId);

  return prisma.galleryImage.update({
    data: input,
    where: {
      id: imageId,
    },
  });
}

export async function deleteGalleryImage(
  invitationId: string,
  imageId: string,
) {
  await assertGalleryImageExists(invitationId, imageId);

  return prisma.galleryImage.delete({
    where: {
      id: imageId,
    },
  });
}

export async function createGiftAccount(
  invitationId: string,
  input: GiftAccountFormInput,
) {
  await assertInvitationExists(invitationId);

  return prisma.giftAccount.create({
    data: {
      ...input,
      invitationId,
    },
  });
}

export async function updateGiftAccount(
  invitationId: string,
  giftId: string,
  input: GiftAccountFormInput,
) {
  await assertGiftAccountExists(invitationId, giftId);

  return prisma.giftAccount.update({
    data: input,
    where: {
      id: giftId,
    },
  });
}

export async function deleteGiftAccount(invitationId: string, giftId: string) {
  await assertGiftAccountExists(invitationId, giftId);

  return prisma.giftAccount.delete({
    where: {
      id: giftId,
    },
  });
}
