import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  publishInvitationAction,
  softDeleteInvitationAction,
  unpublishInvitationAction,
  updateInvitationAction,
} from "@/features/invitations/actions";
import { InvitationForm } from "@/features/invitations/components/invitation-form";
import { getInvitationById } from "@/features/invitations/service";

type EditInvitationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Edit Undangan | Admin Undangan Digital",
};

export default async function EditInvitationPage({
  params,
}: EditInvitationPageProps) {
  const { id } = await params;
  const invitation = await getInvitationById(id);

  if (!invitation) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-rose-700">
            Edit undangan
          </p>
          <h1 className="mt-3 text-3xl font-semibold">{invitation.title}</h1>
          <p className="mt-3 max-w-2xl break-all text-sm leading-6 text-stone-600">
            /{invitation.slug}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {invitation.status === "PUBLISHED" ? (
            <form action={unpublishInvitationAction.bind(null, invitation.id)}>
              <button
                className="inline-flex h-10 items-center justify-center border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
                type="submit"
              >
                Unpublish
              </button>
            </form>
          ) : (
            <form action={publishInvitationAction.bind(null, invitation.id)}>
              <button
                className="inline-flex h-10 items-center justify-center border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
                type="submit"
              >
                Publish
              </button>
            </form>
          )}

          <form action={softDeleteInvitationAction.bind(null, invitation.id)}>
            <button
              className="inline-flex h-10 items-center justify-center border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-800 transition hover:bg-red-100"
              type="submit"
            >
              Hapus
            </button>
          </form>
        </div>
      </section>

      <section className="border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <InvitationForm
          action={updateInvitationAction.bind(null, invitation.id)}
          defaultValues={{
            title: invitation.title,
            slug: invitation.slug,
            groomName: invitation.groomName,
            brideName: invitation.brideName,
            openingText: invitation.openingText,
            closingText: invitation.closingText,
            coverImage: invitation.coverImage,
            musicUrl: invitation.musicUrl,
            status: invitation.status,
          }}
          submitLabel="Simpan perubahan"
        />
      </section>
    </div>
  );
}
