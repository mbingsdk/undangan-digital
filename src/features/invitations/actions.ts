"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  formDataToInvitationInput,
  formDataToInvitationValues,
  type InvitationActionState,
} from "./schemas";
import { invitationFormSchema } from "./schemas";
import {
  createInvitation,
  InvitationNotFoundError,
  InvitationSlugConflictError,
  publishInvitation,
  softDeleteInvitation,
  unpublishInvitation,
  updateInvitation,
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

  return {
    form: ["Terjadi kesalahan. Coba lagi."],
  };
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

  revalidatePath("/admin");
  revalidatePath("/admin/invitations");
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

  revalidatePath("/admin");
  revalidatePath("/admin/invitations");
  revalidatePath(`/admin/invitations/${id}`);
  redirect("/admin/invitations");
}

export async function softDeleteInvitationAction(id: string) {
  await requireAdmin();
  await softDeleteInvitation(id);

  revalidatePath("/admin");
  revalidatePath("/admin/invitations");
  redirect("/admin/invitations");
}

export async function publishInvitationAction(id: string) {
  await requireAdmin();
  await publishInvitation(id);

  revalidatePath("/admin");
  revalidatePath("/admin/invitations");
  revalidatePath(`/admin/invitations/${id}`);
}

export async function unpublishInvitationAction(id: string) {
  await requireAdmin();
  await unpublishInvitation(id);

  revalidatePath("/admin");
  revalidatePath("/admin/invitations");
  revalidatePath(`/admin/invitations/${id}`);
}
