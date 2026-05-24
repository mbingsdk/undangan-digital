import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
  adminButtonDangerClass,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
} from "@/components/admin/admin-ui";
import {
  createEventAction,
  createGalleryImageAction,
  createGiftAccountAction,
  deleteEventAction,
  deleteGalleryImageAction,
  deleteGiftAccountAction,
  publishInvitationAction,
  softDeleteInvitationAction,
  unpublishInvitationAction,
  updateEventAction,
  updateGalleryImageAction,
  updateGiftAccountAction,
  updateInvitationAction,
} from "@/features/invitations/actions";
import {
  EventForm,
  GalleryImageForm,
  GiftAccountForm,
} from "@/features/invitations/components/content-forms";
import { InvitationForm } from "@/features/invitations/components/invitation-form";
import { getInvitationEditorData } from "@/features/invitations/service";

type EditInvitationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Edit Undangan | Admin Undangan Digital",
};

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function Section({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <AdminPanel description={description} title={title}>
      {children}
    </AdminPanel>
  );
}

export default async function EditInvitationPage({
  params,
}: EditInvitationPageProps) {
  const { id } = await params;
  const invitation = await getInvitationEditorData(id);

  if (!invitation) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        actions={<AdminStatusBadge status={invitation.status} />}
        description={`/${invitation.slug}`}
        eyebrow="Edit undangan"
        title={invitation.title}
      />

      <Section
        description="Data utama undangan yang tampil pada cover dan metadata admin."
        title="Basic Info"
      >
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
      </Section>

      <Section
        description="Publish mengaktifkan undangan untuk fase public page nanti. Unpublish mengembalikan status ke draft."
        title="Publish Status"
      >
        <div className="flex flex-wrap gap-2">
          {invitation.status === "PUBLISHED" ? (
            <form action={unpublishInvitationAction.bind(null, invitation.id)}>
              <button
                className={`${adminButtonSecondaryClass} h-10 px-3`}
                type="submit"
              >
                Unpublish
              </button>
            </form>
          ) : (
            <form action={publishInvitationAction.bind(null, invitation.id)}>
              <button
                className={`${adminButtonPrimaryClass} h-10 px-3`}
                type="submit"
              >
                Publish
              </button>
            </form>
          )}

          <form action={softDeleteInvitationAction.bind(null, invitation.id)}>
            <button
              className={`${adminButtonDangerClass} h-10 px-3`}
              type="submit"
            >
              Hapus undangan
            </button>
          </form>
          <Link
            className={`${adminButtonSecondaryClass} h-10 px-3`}
            href={`/admin/invitations/${invitation.id}/rsvps`}
          >
            Lihat RSVP
          </Link>
          <Link
            className={`${adminButtonSecondaryClass} h-10 px-3`}
            href={`/admin/invitations/${invitation.id}/guests`}
          >
            Kelola Tamu
          </Link>
          <Link
            className={`${adminButtonSecondaryClass} h-10 px-3`}
            href={`/admin/invitations/${invitation.id}/wishes`}
          >
            Lihat Ucapan
          </Link>
        </div>
      </Section>

      <Section
        description="Tambahkan satu atau lebih rangkaian acara seperti akad, resepsi, pemberkatan, atau ngunduh mantu."
        title="Events"
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
            <h3 className="mb-4 font-medium">Tambah acara</h3>
            <EventForm
              action={createEventAction.bind(null, invitation.id)}
              submitLabel="Tambah acara"
            />
          </div>

          {invitation.events.length > 0 ? (
            <div className="space-y-4">
              {invitation.events.map((event) => (
                <article
                  className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                  key={event.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        {formatDateInput(event.date)} - {event.startTime}
                        {event.endTime ? `-${event.endTime}` : ""}
                      </p>
                      {event.venueName ? (
                        <p className="mt-1 text-sm text-stone-600">
                          {event.venueName}
                        </p>
                      ) : null}
                    </div>
                    <form
                      action={deleteEventAction.bind(
                        null,
                        invitation.id,
                        event.id,
                      )}
                    >
                      <button
                        className={`${adminButtonDangerClass} h-9 px-3`}
                        type="submit"
                      >
                        Hapus
                      </button>
                    </form>
                  </div>
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-stone-700">
                      Edit acara
                    </summary>
                    <div className="mt-4 border-t border-stone-100 pt-4">
                      <EventForm
                        action={updateEventAction.bind(
                          null,
                          invitation.id,
                          event.id,
                        )}
                        defaultValues={{
                          title: event.title,
                          date: formatDateInput(event.date),
                          startTime: event.startTime,
                          endTime: event.endTime ?? "",
                          venueName: event.venueName ?? "",
                          address: event.address ?? "",
                          mapsUrl: event.mapsUrl ?? "",
                          sortOrder: String(event.sortOrder),
                        }}
                        submitLabel="Simpan acara"
                      />
                    </div>
                  </details>
                </article>
              ))}
            </div>
          ) : (
            <AdminEmptyState
              description="Tambahkan minimal satu acara sebelum undangan dipublish ke publik."
              title="Belum ada acara"
            />
          )}
        </div>
      </Section>

      <Section
        description="Masukkan path gambar secara manual atau upload gambar lokal. Reorder memakai angka sort order."
        title="Gallery"
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
            <h3 className="mb-4 font-medium">Tambah gambar</h3>
            <GalleryImageForm
              action={createGalleryImageAction.bind(null, invitation.id)}
              submitLabel="Tambah gambar"
            />
          </div>

          {invitation.galleries.length > 0 ? (
            <div className="space-y-4">
              {invitation.galleries.map((image) => (
                <article
                  className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                  key={image.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="break-all font-semibold">
                        {image.imageUrl}
                      </h3>
                      <p className="mt-1 text-sm text-stone-600">
                        Sort order: {image.sortOrder}
                      </p>
                      {image.caption ? (
                        <p className="mt-1 text-sm text-stone-600">
                          {image.caption}
                        </p>
                      ) : null}
                    </div>
                    <form
                      action={deleteGalleryImageAction.bind(
                        null,
                        invitation.id,
                        image.id,
                      )}
                    >
                      <button
                        className={`${adminButtonDangerClass} h-9 px-3`}
                        type="submit"
                      >
                        Hapus
                      </button>
                    </form>
                  </div>
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-stone-700">
                      Edit gambar
                    </summary>
                    <div className="mt-4 border-t border-stone-100 pt-4">
                      <GalleryImageForm
                        action={updateGalleryImageAction.bind(
                          null,
                          invitation.id,
                          image.id,
                        )}
                        defaultValues={{
                          imageUrl: image.imageUrl,
                          caption: image.caption ?? "",
                          sortOrder: String(image.sortOrder),
                        }}
                        submitLabel="Simpan gambar"
                      />
                    </div>
                  </details>
                </article>
              ))}
            </div>
          ) : (
            <AdminEmptyState
              description="Masukkan gambar gallery untuk memperkaya halaman undangan publik."
              title="Belum ada gambar gallery"
            />
          )}
        </div>
      </Section>

      <Section
        description="Tambahkan rekening atau e-wallet untuk hadiah digital. QR image opsional."
        title="Gifts"
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
            <h3 className="mb-4 font-medium">Tambah gift account</h3>
            <GiftAccountForm
              action={createGiftAccountAction.bind(null, invitation.id)}
              submitLabel="Tambah gift"
            />
          </div>

          {invitation.gifts.length > 0 ? (
            <div className="space-y-4">
              {invitation.gifts.map((gift) => (
                <article
                  className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                  key={gift.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{gift.providerName}</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        {gift.accountNumber} - {gift.accountHolder}
                      </p>
                      <p className="mt-1 text-sm text-stone-600">
                        Sort order: {gift.sortOrder}
                      </p>
                    </div>
                    <form
                      action={deleteGiftAccountAction.bind(
                        null,
                        invitation.id,
                        gift.id,
                      )}
                    >
                      <button
                        className={`${adminButtonDangerClass} h-9 px-3`}
                        type="submit"
                      >
                        Hapus
                      </button>
                    </form>
                  </div>
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-stone-700">
                      Edit gift
                    </summary>
                    <div className="mt-4 border-t border-stone-100 pt-4">
                      <GiftAccountForm
                        action={updateGiftAccountAction.bind(
                          null,
                          invitation.id,
                          gift.id,
                        )}
                        defaultValues={{
                          providerName: gift.providerName,
                          accountNumber: gift.accountNumber,
                          accountHolder: gift.accountHolder,
                          qrImage: gift.qrImage ?? "",
                          note: gift.note ?? "",
                          sortOrder: String(gift.sortOrder),
                        }}
                        submitLabel="Simpan gift"
                      />
                    </div>
                  </details>
                </article>
              ))}
            </div>
          ) : (
            <AdminEmptyState
              description="Gift bersifat opsional. Tambahkan hanya jika customer membutuhkan rekening atau QR."
              title="Belum ada gift account"
            />
          )}
        </div>
      </Section>
    </div>
  );
}
