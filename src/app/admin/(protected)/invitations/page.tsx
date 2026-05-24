import type { Metadata } from "next";
import Link from "next/link";
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
  publishInvitationAction,
  softDeleteInvitationAction,
  unpublishInvitationAction,
} from "@/features/invitations/actions";
import { listInvitations } from "@/features/invitations/service";

export const metadata: Metadata = {
  title: "Undangan | Admin Undangan Digital",
};

export default async function InvitationListPage() {
  const invitations = await listInvitations();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        actions={
        <Link
            className={adminButtonPrimaryClass}
          href="/admin/invitations/new"
        >
          Buat undangan
        </Link>
        }
        description="Buat, edit, publish, unpublish, dan arsipkan undangan customer."
        eyebrow="Undangan"
        title="Kelola undangan"
      />

      <AdminPanel>
        {invitations.length > 0 ? (
          <ul className="-m-5 divide-y divide-stone-100 sm:-m-6">
            {invitations.map((invitation) => (
              <li
                className="px-5 py-5 transition hover:bg-stone-50/80 sm:px-6"
                key={invitation.id}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold tracking-tight">
                        {invitation.title}
                      </h2>
                      <AdminStatusBadge status={invitation.status} />
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
                      className={`${adminButtonSecondaryClass} h-10 px-3`}
                      href={`/admin/invitations/${invitation.id}`}
                    >
                      Edit
                    </Link>

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
                          className={`${adminButtonSecondaryClass} h-10 px-3`}
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
                        Hapus
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <AdminEmptyState
            action={
              <Link
                className={adminButtonPrimaryClass}
                href="/admin/invitations/new"
              >
                Buat undangan
              </Link>
            }
            description="Mulai dengan membuat undangan pertama untuk customer."
            title="Belum ada undangan"
          />
        )}
      </AdminPanel>
    </div>
  );
}
