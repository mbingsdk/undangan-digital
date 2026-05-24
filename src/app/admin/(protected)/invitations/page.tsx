import type { Metadata } from "next";
import Link from "next/link";
import {
  publishInvitationAction,
  softDeleteInvitationAction,
  unpublishInvitationAction,
} from "@/features/invitations/actions";
import { listInvitations } from "@/features/invitations/service";

export const metadata: Metadata = {
  title: "Undangan | Admin Undangan Digital",
};

function formatStatus(status: string) {
  if (status === "PUBLISHED") {
    return "Published";
  }

  if (status === "ARCHIVED") {
    return "Archived";
  }

  return "Draft";
}

export default async function InvitationListPage() {
  const invitations = await listInvitations();

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-rose-700">
            Undangan
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Kelola undangan</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Buat, edit, publish, unpublish, dan arsipkan undangan customer.
          </p>
        </div>
        <Link
          className="inline-flex h-11 items-center justify-center bg-stone-950 px-4 text-sm font-medium text-white transition hover:bg-stone-800"
          href="/admin/invitations/new"
        >
          Buat undangan
        </Link>
      </section>

      <section className="border border-stone-200 bg-white shadow-sm">
        {invitations.length > 0 ? (
          <ul className="divide-y divide-stone-200">
            {invitations.map((invitation) => (
              <li className="p-5" key={invitation.id}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold">
                        {invitation.title}
                      </h2>
                      <span className="border border-stone-300 px-2 py-1 text-xs font-medium uppercase text-stone-700">
                        {formatStatus(invitation.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-stone-600">
                      {invitation.groomName} & {invitation.brideName}
                    </p>
                    <p className="mt-1 break-all text-sm text-stone-600">
                      /{invitation.slug}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="inline-flex h-10 items-center justify-center border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
                      href={`/admin/invitations/${invitation.id}`}
                    >
                      Edit
                    </Link>

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
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-10">
            <h2 className="text-lg font-semibold">Belum ada undangan</h2>
            <p className="mt-2 text-sm text-stone-600">
              Mulai dengan membuat undangan pertama untuk customer.
            </p>
            <Link
              className="mt-5 inline-flex h-11 items-center justify-center bg-stone-950 px-4 text-sm font-medium text-white transition hover:bg-stone-800"
              href="/admin/invitations/new"
            >
              Buat undangan
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
