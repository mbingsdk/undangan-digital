"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  eventFormSchema,
  formDataToEventInput,
  formDataToEventValues,
  formDataToGalleryImageInput,
  formDataToGalleryImageValues,
  formDataToGiftAccountInput,
  formDataToGiftAccountValues,
  formDataToInvitationInput,
  formDataToInvitationValues,
  galleryImageFormSchema,
  giftAccountFormSchema,
  type EventActionState,
  type GalleryImageActionState,
  type GiftAccountActionState,
  type InvitationActionState,
} from "./schemas";
import { invitationFormSchema } from "./schemas";
import {
  createGalleryImage,
  createGiftAccount,
  createInvitationEvent,
  deleteGalleryImage,
  deleteGiftAccount,
  deleteInvitationEvent,
  InvitationContentNotFoundError,
  createInvitation,
  deleteWish,
  InvitationNotFoundError,
  InvitationSlugConflictError,
  publishInvitation,
  setWishVisibility,
  softDeleteInvitation,
  unpublishInvitation,
  updateGalleryImage,
  updateGiftAccount,
  updateInvitation,
  updateInvitationEvent,
} from "./service";

function getActionError(error: unknown) {
  if (error instanceof InvitationSlugConflictError) {
    return {
      slug: [error.message],
    };
  }

  if (error instanceof InvitationNotFoundError) {
    return {
      form: [error.message],
    };
  }

  if (error instanceof InvitationContentNotFoundError) {
    return {
      form: [error.message],
    };
  }

  return {
    form: ["Terjadi kesalahan. Coba lagi."],
  };
}

function revalidateInvitationEditor(id: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/invitations");
  revalidatePath(`/admin/invitations/${id}`);
  revalidatePath(`/admin/invitations/${id}/rsvps`);
  revalidatePath(`/admin/invitations/${id}/wishes`);
}

export async function createInvitationAction(
  _previousState: InvitationActionState,
  formData: FormData,
): Promise<InvitationActionState> {
  await requireAdmin();

  const values = formDataToInvitationValues(formData);
  const parsed = invitationFormSchema.safeParse(
    formDataToInvitationInput(formData),
  );

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  let invitationId: string;

  try {
    const invitation = await createInvitation(parsed.data);
    invitationId = invitation.id;
  } catch (error) {
    return {
      errors: getActionError(error),
      values,
    };
  }

  revalidateInvitationEditor(invitationId);
  redirect(`/admin/invitations/${invitationId}`);
}

export async function updateInvitationAction(
  id: string,
  _previousState: InvitationActionState,
  formData: FormData,
): Promise<InvitationActionState> {
  await requireAdmin();

  const values = formDataToInvitationValues(formData);
  const parsed = invitationFormSchema.safeParse(
    formDataToInvitationInput(formData),
  );

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    await updateInvitation(id, parsed.data);
  } catch (error) {
    return {
      errors: getActionError(error),
      values,
    };
  }

  revalidateInvitationEditor(id);
  redirect("/admin/invitations");
}

export async function softDeleteInvitationAction(id: string) {
  await requireAdmin();
  await softDeleteInvitation(id);

  revalidateInvitationEditor(id);
  redirect("/admin/invitations");
}

export async function publishInvitationAction(id: string) {
  await requireAdmin();
  await publishInvitation(id);

  revalidateInvitationEditor(id);
}

export async function unpublishInvitationAction(id: string) {
  await requireAdmin();
  await unpublishInvitation(id);

  revalidateInvitationEditor(id);
}

export async function createEventAction(
  invitationId: string,
  _previousState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  await requireAdmin();

  const values = formDataToEventValues(formData);
  const parsed = eventFormSchema.safeParse(formDataToEventInput(formData));

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    await createInvitationEvent(invitationId, parsed.data);
  } catch (error) {
    return {
      errors: getActionError(error),
      values,
    };
  }

  revalidateInvitationEditor(invitationId);
  return {};
}

export async function updateEventAction(
  invitationId: string,
  eventId: string,
  _previousState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  await requireAdmin();

  const values = formDataToEventValues(formData);
  const parsed = eventFormSchema.safeParse(formDataToEventInput(formData));

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    await updateInvitationEvent(invitationId, eventId, parsed.data);
  } catch (error) {
    return {
      errors: getActionError(error),
      values,
    };
  }

  revalidateInvitationEditor(invitationId);
  return {};
}

export async function deleteEventAction(invitationId: string, eventId: string) {
  await requireAdmin();
  await deleteInvitationEvent(invitationId, eventId);

  revalidateInvitationEditor(invitationId);
}

export async function createGalleryImageAction(
  invitationId: string,
  _previousState: GalleryImageActionState,
  formData: FormData,
): Promise<GalleryImageActionState> {
  await requireAdmin();

  const values = formDataToGalleryImageValues(formData);
  const parsed = galleryImageFormSchema.safeParse(
    formDataToGalleryImageInput(formData),
  );

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    await createGalleryImage(invitationId, parsed.data);
  } catch (error) {
    return {
      errors: getActionError(error),
      values,
    };
  }

  revalidateInvitationEditor(invitationId);
  return {};
}

export async function updateGalleryImageAction(
  invitationId: string,
  imageId: string,
  _previousState: GalleryImageActionState,
  formData: FormData,
): Promise<GalleryImageActionState> {
  await requireAdmin();

  const values = formDataToGalleryImageValues(formData);
  const parsed = galleryImageFormSchema.safeParse(
    formDataToGalleryImageInput(formData),
  );

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    await updateGalleryImage(invitationId, imageId, parsed.data);
  } catch (error) {
    return {
      errors: getActionError(error),
      values,
    };
  }

  revalidateInvitationEditor(invitationId);
  return {};
}

export async function deleteGalleryImageAction(
  invitationId: string,
  imageId: string,
) {
  await requireAdmin();
  await deleteGalleryImage(invitationId, imageId);

  revalidateInvitationEditor(invitationId);
}

export async function createGiftAccountAction(
  invitationId: string,
  _previousState: GiftAccountActionState,
  formData: FormData,
): Promise<GiftAccountActionState> {
  await requireAdmin();

  const values = formDataToGiftAccountValues(formData);
  const parsed = giftAccountFormSchema.safeParse(
    formDataToGiftAccountInput(formData),
  );

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    await createGiftAccount(invitationId, parsed.data);
  } catch (error) {
    return {
      errors: getActionError(error),
      values,
    };
  }

  revalidateInvitationEditor(invitationId);
  return {};
}

export async function updateGiftAccountAction(
  invitationId: string,
  giftId: string,
  _previousState: GiftAccountActionState,
  formData: FormData,
): Promise<GiftAccountActionState> {
  await requireAdmin();

  const values = formDataToGiftAccountValues(formData);
  const parsed = giftAccountFormSchema.safeParse(
    formDataToGiftAccountInput(formData),
  );

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    await updateGiftAccount(invitationId, giftId, parsed.data);
  } catch (error) {
    return {
      errors: getActionError(error),
      values,
    };
  }

  revalidateInvitationEditor(invitationId);
  return {};
}

export async function deleteGiftAccountAction(
  invitationId: string,
  giftId: string,
) {
  await requireAdmin();
  await deleteGiftAccount(invitationId, giftId);

  revalidateInvitationEditor(invitationId);
}

export async function hideWishAction(invitationId: string, wishId: string) {
  await requireAdmin();
  await setWishVisibility({
    invitationId,
    isVisible: false,
    wishId,
  });

  revalidateInvitationEditor(invitationId);
}

export async function showWishAction(invitationId: string, wishId: string) {
  await requireAdmin();
  await setWishVisibility({
    invitationId,
    isVisible: true,
    wishId,
  });

  revalidateInvitationEditor(invitationId);
}

export async function deleteWishAction(invitationId: string, wishId: string) {
  await requireAdmin();
  await deleteWish(invitationId, wishId);

  revalidateInvitationEditor(invitationId);
}
