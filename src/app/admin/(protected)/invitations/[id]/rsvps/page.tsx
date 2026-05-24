import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AdminEmptyState,
  AdminMetricCard,
  AdminPageHeader,
  AdminPanel,
  adminButtonSecondaryClass,
} from "@/components/admin/admin-ui";
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
        eyebrow="RSVP"
        title={invitation.title}
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <AdminMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </section>

      <AdminPanel title="Daftar RSVP">
        {rsvps.length > 0 ? (
          <ul className="-m-5 divide-y divide-stone-100 sm:-m-6">
            {rsvps.map((rsvp) => (
              <li className="px-5 py-5 sm:px-6" key={rsvp.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold">{rsvp.name}</h2>
                    <p className="mt-1 text-sm text-stone-600">
                      {getAttendanceLabel(rsvp.attendanceStatus)} -{" "}
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
          <AdminEmptyState
            description="Data akan muncul setelah tamu mengirim konfirmasi kehadiran."
            title="Belum ada RSVP"
          />
        )}
      </AdminPanel>
    </div>
  );
}
