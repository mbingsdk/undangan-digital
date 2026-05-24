import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getInvitationById,
  getInvitationRsvps,
} from "@/features/invitations/service";

type AdminRsvpsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "RSVP | Admin Undangan Digital",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getAttendanceLabel(status: string) {
  if (status === "ATTENDING") {
    return "Hadir";
  }

  if (status === "NOT_ATTENDING") {
    return "Tidak hadir";
  }

  return "Ragu-ragu";
}

export default async function AdminRsvpsPage({ params }: AdminRsvpsPageProps) {
  const { id } = await params;
  const invitation = await getInvitationById(id);

  if (!invitation) {
    notFound();
  }

  const { rsvps, summary } = await getInvitationRsvps(invitation.id);
  const metrics = [
    {
      label: "Hadir",
      value: summary.attending,
    },
    {
      label: "Tidak hadir",
      value: summary.notAttending,
    },
    {
      label: "Ragu-ragu",
      value: summary.maybe,
    },
    {
      label: "Estimasi tamu",
      value: summary.estimatedGuests,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-rose-700">RSVP</p>
          <h1 className="mt-3 text-3xl font-semibold">{invitation.title}</h1>
          <p className="mt-3 text-sm text-stone-600">/{invitation.slug}</p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
          href={`/admin/invitations/${invitation.id}`}
        >
          Kembali ke undangan
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <article
            className="border border-stone-200 bg-white p-5 shadow-sm"
            key={metric.label}
          >
            <p className="text-sm text-stone-600">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="border border-stone-200 bg-white shadow-sm">
        {rsvps.length > 0 ? (
          <ul className="divide-y divide-stone-200">
            {rsvps.map((rsvp) => (
              <li className="p-5" key={rsvp.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold">{rsvp.name}</h2>
                    <p className="mt-1 text-sm text-stone-600">
                      {getAttendanceLabel(rsvp.attendanceStatus)} ·{" "}
                      {rsvp.guestCount} tamu
                    </p>
                    {rsvp.guest ? (
                      <p className="mt-1 text-sm text-stone-600">
                        Link tamu: {rsvp.guest.name}
                      </p>
                    ) : null}
                    {rsvp.message ? (
                      <p className="mt-3 text-sm leading-6 text-stone-700">
                        {rsvp.message}
                      </p>
                    ) : null}
                  </div>
                  <p className="text-sm text-stone-500">
                    {formatDate(rsvp.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-10">
            <h2 className="text-lg font-semibold">Belum ada RSVP</h2>
            <p className="mt-2 text-sm text-stone-600">
              Data akan muncul setelah tamu mengirim konfirmasi kehadiran.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
