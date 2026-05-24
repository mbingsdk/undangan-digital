import { prisma } from "@/lib/prisma";
import type { InvitationFormInput } from "./schemas";

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
