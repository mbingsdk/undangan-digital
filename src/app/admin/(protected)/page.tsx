import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard Admin | Undangan Digital",
};

export default async function AdminDashboardPage() {
  const [totalInvitations, publishedInvitations, totalRsvps, totalWishes, latestInvitations] =
    await Promise.all([
      prisma.invitation.count({
        where: {
          deletedAt: null,
        },
      }),
      prisma.invitation.count({
        where: {
          deletedAt: null,
          status: "PUBLISHED",
        },
      }),
      prisma.rSVP.count(),
      prisma.wish.count(),
      prisma.invitation.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          slug: true,
          status: true,
          title: true,
        },
        take: 5,
        where: {
          deletedAt: null,
        },
      }),
    ]);

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
          Shell awal untuk panel admin. Fitur CRUD undangan akan dikerjakan pada
          sprint berikutnya.
        </p>
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
                  <p className="font-medium">{invitation.title}</p>
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
