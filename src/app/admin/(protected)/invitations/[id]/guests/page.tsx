import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-rose-700">
            Tamu undangan
          </p>
          <h1 className="mt-3 text-3xl font-semibold">{invitation.title}</h1>
          <p className="mt-3 break-all text-sm text-stone-600">
            /{invitation.slug}
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
          href={`/admin/invitations/${invitation.id}`}
        >
          Kembali ke undangan
        </Link>
      </section>

      <section className="border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold">Tambah tamu</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Sistem akan membuat guest code otomatis untuk link personal.
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <GuestForm
            action={createGuestAction.bind(null, invitation.id)}
            submitLabel="Tambah tamu"
          />
        </div>
      </section>

      <section className="border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold">Daftar tamu</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Copy link personal atau kirim pesan WhatsApp untuk setiap tamu.
          </p>
        </div>

        {invitation.guests.length > 0 ? (
          <ul className="divide-y divide-stone-200">
            {invitation.guests.map((guest) => {
              const personalizedUrl = getPersonalizedUrl(
                invitation.slug,
                guest.guestCode,
              );

              return (
                <li className="p-5 sm:p-6" key={guest.id}>
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
                    <div className="mt-4 border-t border-stone-200 pt-4">
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
                      className="inline-flex h-9 items-center justify-center border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-800 transition hover:bg-red-100"
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
          <div className="px-5 py-10">
            <h3 className="text-lg font-semibold">Belum ada tamu</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Tambahkan nama penerima untuk membuat link undangan personal.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
