import { prisma } from "@/lib/prisma";
import {
  assertGuestCountAllowed,
  getPublishedGuestForRsvp,
} from "@/features/guests/service";
import type {
  EventFormInput,
  GalleryImageFormInput,
  GiftAccountFormInput,
  InvitationFormInput,
  RsvpSubmissionInput,
  WishSubmissionInput,
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

export class PublicInvitationUnavailableError extends Error {
  constructor() {
    super("Undangan tidak tersedia.");
    this.name = "PublicInvitationUnavailableError";
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

export async function getPublicInvitationBySlug(slug: string) {
  return prisma.invitation.findFirst({
    select: {
      title: true,
      id: true,
      slug: true,
      groomName: true,
      brideName: true,
      openingText: true,
      closingText: true,
      coverImage: true,
      musicUrl: true,
      events: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            date: "asc",
          },
        ],
        select: {
          title: true,
          date: true,
          startTime: true,
          endTime: true,
          venueName: true,
          address: true,
          mapsUrl: true,
          sortOrder: true,
        },
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
        select: {
          imageUrl: true,
          caption: true,
          sortOrder: true,
        },
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
        select: {
          providerName: true,
          accountNumber: true,
          accountHolder: true,
          qrImage: true,
          note: true,
          sortOrder: true,
        },
      },
      wishes: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          message: true,
          createdAt: true,
        },
        take: 20,
        where: {
          isVisible: true,
        },
      },
    },
    where: {
      slug,
      status: "PUBLISHED",
      deletedAt: null,
    },
  });
}

async function getPublishedInvitationIdBySlug(slug: string) {
  const invitation = await prisma.invitation.findFirst({
    select: {
      id: true,
    },
    where: {
      slug,
      status: "PUBLISHED",
      deletedAt: null,
    },
  });

  if (!invitation) {
    throw new PublicInvitationUnavailableError();
  }

  return invitation.id;
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

export async function createPublicRsvp({
  guestCode,
  input,
  ipAddress,
  slug,
}: {
  guestCode?: string | null;
  input: RsvpSubmissionInput;
  ipAddress?: string | null;
  slug: string;
}) {
  const invitationId = await getPublishedInvitationIdBySlug(slug);
  const guest = await getPublishedGuestForRsvp({
    guestCode,
    slug,
  });

  if (guest && input.attendanceStatus === "ATTENDING") {
    assertGuestCountAllowed(input.guestCount, guest.maxGuest);
  }

  return prisma.rSVP.create({
    data: {
      invitationId,
      guestId: guest?.id,
      name: input.name,
      attendanceStatus: input.attendanceStatus,
      guestCount: input.guestCount,
      message: input.message,
      ipAddress,
    },
    select: {
      id: true,
      name: true,
      attendanceStatus: true,
      guestCount: true,
      message: true,
      createdAt: true,
    },
  });
}

export async function createPublicWish({
  input,
  ipAddress,
  slug,
}: {
  input: WishSubmissionInput;
  ipAddress?: string | null;
  slug: string;
}) {
  const invitationId = await getPublishedInvitationIdBySlug(slug);

  return prisma.wish.create({
    data: {
      invitationId,
      name: input.name,
      message: input.message,
      isVisible: true,
      ipAddress,
    },
    select: {
      id: true,
      name: true,
      message: true,
      createdAt: true,
      isVisible: true,
    },
  });
}

export async function getInvitationRsvps(invitationId: string) {
  await assertInvitationExists(invitationId);

  const rsvps = await prisma.rSVP.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      attendanceStatus: true,
      guestCount: true,
      message: true,
      createdAt: true,
      guest: {
        select: {
          name: true,
        },
      },
    },
    where: {
      invitationId,
    },
  });

  const summary = rsvps.reduce(
    (current, rsvp) => {
      if (rsvp.attendanceStatus === "ATTENDING") {
        current.attending += 1;
        current.estimatedGuests += rsvp.guestCount;
      } else if (rsvp.attendanceStatus === "NOT_ATTENDING") {
        current.notAttending += 1;
      } else {
        current.maybe += 1;
      }

      return current;
    },
    {
      attending: 0,
      estimatedGuests: 0,
      maybe: 0,
      notAttending: 0,
    },
  );

  return {
    rsvps,
    summary,
  };
}

export async function getInvitationWishes(invitationId: string) {
  await assertInvitationExists(invitationId);

  return prisma.wish.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      message: true,
      isVisible: true,
      createdAt: true,
    },
    where: {
      invitationId,
    },
  });
}

async function assertWishExists(invitationId: string, wishId: string) {
  const wish = await prisma.wish.findFirst({
    select: {
      id: true,
    },
    where: {
      id: wishId,
      invitationId,
      invitation: {
        deletedAt: null,
      },
    },
  });

  if (!wish) {
    throw new InvitationContentNotFoundError();
  }
}

export async function setWishVisibility({
  invitationId,
  isVisible,
  wishId,
}: {
  invitationId: string;
  isVisible: boolean;
  wishId: string;
}) {
  await assertWishExists(invitationId, wishId);

  return prisma.wish.update({
    data: {
      isVisible,
    },
    where: {
      id: wishId,
    },
  });
}

export async function deleteWish(invitationId: string, wishId: string) {
  await assertWishExists(invitationId, wishId);

  return prisma.wish.delete({
    where: {
      id: wishId,
    },
  });
}
