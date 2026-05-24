import type { Metadata } from "next";
import Link from "next/link";
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
      <section>
        <p className="text-sm font-medium uppercase text-rose-700">
          Dashboard admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Ringkasan operasional</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Pantau data undangan dan lanjutkan pekerjaan admin dari satu tempat.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex h-11 items-center justify-center bg-stone-950 px-4 text-sm font-medium text-white transition hover:bg-stone-800"
            href="/admin/invitations/new"
          >
            Buat undangan
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center border border-stone-300 bg-white px-4 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
            href="/admin/invitations"
          >
            Lihat daftar undangan
          </Link>
        </div>
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
        <div className="border-b border-stone-200 px-5 py-4">
          <h2 className="text-lg font-semibold">Undangan terbaru</h2>
        </div>

        {latestInvitations.length > 0 ? (
          <ul className="divide-y divide-stone-200">
            {latestInvitations.map((invitation) => (
              <li
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
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
                <span className="w-fit border border-stone-300 px-2 py-1 text-xs font-medium uppercase text-stone-700">
                  {invitation.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-8 text-sm text-stone-600">
            Belum ada undangan. Data akan muncul setelah Sprint 2 selesai.
          </p>
        )}
      </section>
    </div>
  );
}
