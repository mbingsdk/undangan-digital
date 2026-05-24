import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminEmptyState,
  AdminMetricCard,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
} from "@/components/admin/admin-ui";
import { getInvitationDashboardSummary } from "@/features/invitations/service";

export const metadata: Metadata = {
  title: "Dashboard Admin | Undangan Digital",
};

export default async function AdminDashboardPage() {
  const {
    latestInvitations,
    publishedInvitations,
    totalInvitations,
    totalRsvps,
    totalWishes,
  } = await getInvitationDashboardSummary();

  const metrics = [
    {
      label: "Total undangan",
      value: totalInvitations,
    },
    {
      label: "Published",
      value: publishedInvitations,
    },
    {
      label: "RSVP",
      value: totalRsvps,
    },
    {
      label: "Ucapan",
      value: totalWishes,
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        actions={
          <>
          <Link
              className={adminButtonPrimaryClass}
            href="/admin/invitations/new"
          >
            Buat undangan
          </Link>
          <Link
              className={adminButtonSecondaryClass}
            href="/admin/invitations"
          >
            Lihat daftar undangan
          </Link>
          </>
        }
        description="Pantau data undangan dan lanjutkan pekerjaan admin dari satu tempat."
        eyebrow="Dashboard admin"
        title="Ringkasan operasional"
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

      <AdminPanel title="Undangan terbaru">
        {latestInvitations.length > 0 ? (
          <ul className="-m-5 divide-y divide-stone-100 sm:-m-6">
            {latestInvitations.map((invitation) => (
              <li
                className="flex flex-col gap-3 px-5 py-4 transition hover:bg-stone-50/80 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                key={invitation.id}
              >
                <div>
                  <Link
                    className="font-medium transition hover:text-rose-700"
                    href={`/admin/invitations/${invitation.id}`}
                  >
                    {invitation.title}
                  </Link>
                  <p className="mt-1 text-sm text-stone-600">
                    /{invitation.slug}
                  </p>
                </div>
                <AdminStatusBadge status={invitation.status} />
              </li>
            ))}
          </ul>
        ) : (
          <AdminEmptyState
            description="Buat undangan pertama untuk mulai mengisi data customer."
            title="Belum ada undangan"
          />
        )}
      </AdminPanel>
    </div>
  );
}
