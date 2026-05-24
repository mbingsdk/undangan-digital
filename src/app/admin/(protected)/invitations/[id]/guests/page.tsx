import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  adminButtonDangerClass,
  adminButtonSecondaryClass,
} from "@/components/admin/admin-ui";
import {
  createGuestAction,
  deleteGuestAction,
  updateGuestAction,
} from "@/features/guests/actions";
import { GuestForm } from "@/features/guests/components/guest-form";
import { GuestLinkActions } from "@/features/guests/components/guest-link-actions";
import { getInvitationGuestAdminData } from "@/features/guests/service";

type AdminGuestsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Tamu Undangan | Admin Undangan Digital",
};

function formatDate(date: Date | null) {
  if (!date) {
    return "Belum dibuka";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getAppUrl() {
  return process.env.APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

function getPersonalizedUrl(slug: string, guestCode: string) {
  return `${getAppUrl()}/${slug}?guest=${guestCode}`;
}

export default async function AdminGuestsPage({ params }: AdminGuestsPageProps) {
  const { id } = await params;
  const invitation = await getInvitationGuestAdminData(id);

  if (!invitation) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        actions={
        <Link
            className={`${adminButtonSecondaryClass} h-10 px-3`}
          href={`/admin/invitations/${invitation.id}`}
        >
          Kembali ke undangan
        </Link>
        }
        description={`/${invitation.slug}`}
        eyebrow="Tamu undangan"
        title={invitation.title}
      />

      <AdminPanel
        description="Sistem akan membuat guest code otomatis untuk link personal."
        title="Tambah tamu"
      >
        <GuestForm
          action={createGuestAction.bind(null, invitation.id)}
          submitLabel="Tambah tamu"
        />
      </AdminPanel>

      <AdminPanel
        description="Copy link personal atau kirim pesan WhatsApp untuk setiap tamu."
        title="Daftar tamu"
      >
        {invitation.guests.length > 0 ? (
          <ul className="-m-5 divide-y divide-stone-100 sm:-m-6">
            {invitation.guests.map((guest) => {
              const personalizedUrl = getPersonalizedUrl(
                invitation.slug,
                guest.guestCode,
              );

              return (
                <li className="px-5 py-5 sm:px-6" key={guest.id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold">{guest.name}</h3>
                      <div className="mt-2 space-y-1 text-sm leading-6 text-stone-600">
                        {guest.phone ? <p>WA: {guest.phone}</p> : null}
                        <p>Maksimal tamu: {guest.maxGuest}</p>
                        <p>Dibuka: {formatDate(guest.openedAt)}</p>
                        <p className="break-all">Link: {personalizedUrl}</p>
                        {guest.notes ? <p>Catatan: {guest.notes}</p> : null}
                      </div>
                    </div>
                    <GuestLinkActions
                      brideName={invitation.brideName}
                      groomName={invitation.groomName}
                      guestName={guest.name}
                      phone={guest.phone}
                      url={personalizedUrl}
                    />
                  </div>

                  <details className="mt-5">
                    <summary className="cursor-pointer text-sm font-medium text-stone-700">
                      Edit tamu
                    </summary>
                    <div className="mt-4 border-t border-stone-100 pt-4">
                      <GuestForm
                        action={updateGuestAction.bind(
                          null,
                          invitation.id,
                          guest.id,
                        )}
                        defaultValues={{
                          name: guest.name,
                          phone: guest.phone ?? "",
                          maxGuest: String(guest.maxGuest),
                          notes: guest.notes ?? "",
                        }}
                        submitLabel="Simpan tamu"
                      />
                    </div>
                  </details>

                  <form
                    action={deleteGuestAction.bind(
                      null,
                      invitation.id,
                      guest.id,
                    )}
                    className="mt-4"
                  >
                    <button
                      className={`${adminButtonDangerClass} h-9 px-3`}
                      type="submit"
                    >
                      Hapus tamu
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        ) : (
          <AdminEmptyState
            description="Tambahkan nama penerima untuk membuat link undangan personal."
            title="Belum ada tamu"
          />
        )}
      </AdminPanel>
    </div>
  );
}
