"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  formDataToGuestInput,
  formDataToGuestValues,
  guestFormSchema,
  type GuestActionState,
} from "./schemas";
import {
  createInvitationGuest,
  deleteInvitationGuest,
  GuestNotFoundError,
  updateInvitationGuest,
} from "./service";

function getActionError(error: unknown) {
  if (error instanceof GuestNotFoundError) {
    return {
      form: [error.message],
    };
  }

  return {
    form: ["Terjadi kesalahan. Coba lagi."],
  };
}

function revalidateGuestPages(invitationId: string) {
  revalidatePath(`/admin/invitations/${invitationId}`);
  revalidatePath(`/admin/invitations/${invitationId}/guests`);
}

export async function createGuestAction(
  invitationId: string,
  _previousState: GuestActionState,
  formData: FormData,
): Promise<GuestActionState> {
  await requireAdmin();

  const values = formDataToGuestValues(formData);
  const parsed = guestFormSchema.safeParse(formDataToGuestInput(formData));

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    await createInvitationGuest(invitationId, parsed.data);
  } catch (error) {
    return {
      errors: getActionError(error),
      values,
    };
  }

  revalidateGuestPages(invitationId);
  return {};
}

export async function updateGuestAction(
  invitationId: string,
  guestId: string,
  _previousState: GuestActionState,
  formData: FormData,
): Promise<GuestActionState> {
  await requireAdmin();

  const values = formDataToGuestValues(formData);
  const parsed = guestFormSchema.safeParse(formDataToGuestInput(formData));

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    await updateInvitationGuest(invitationId, guestId, parsed.data);
  } catch (error) {
    return {
      errors: getActionError(error),
      values,
    };
  }

  revalidateGuestPages(invitationId);
  return {};
}

export async function deleteGuestAction(invitationId: string, guestId: string) {
  await requireAdmin();
  await deleteInvitationGuest(invitationId, guestId);

  revalidateGuestPages(invitationId);
}
