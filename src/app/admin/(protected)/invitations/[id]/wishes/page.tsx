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
  deleteWishAction,
  hideWishAction,
  showWishAction,
} from "@/features/invitations/actions";
import {
  getInvitationById,
  getInvitationWishes,
} from "@/features/invitations/service";

type AdminWishesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Ucapan | Admin Undangan Digital",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminWishesPage({ params }: AdminWishesPageProps) {
  const { id } = await params;
  const invitation = await getInvitationById(id);

  if (!invitation) {
    notFound();
  }

  const wishes = await getInvitationWishes(invitation.id);

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
        eyebrow="Ucapan"
        title={invitation.title}
      />

      <AdminPanel title="Daftar ucapan">
        {wishes.length > 0 ? (
          <ul className="-m-5 divide-y divide-stone-100 sm:-m-6">
            {wishes.map((wish) => (
              <li className="px-5 py-5 sm:px-6" key={wish.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-semibold">{wish.name}</h2>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
                        wish.isVisible
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-stone-200 bg-stone-100 text-stone-700"
                      }`}
                      >
                        {wish.isVisible ? "Tampil" : "Hidden"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-stone-700">
                      {wish.message}
                    </p>
                    <p className="mt-3 text-sm text-stone-500">
                      {formatDate(wish.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {wish.isVisible ? (
                      <form
                        action={hideWishAction.bind(
                          null,
                          invitation.id,
                          wish.id,
                        )}
                      >
                        <button
                          className={`${adminButtonSecondaryClass} h-10 px-3`}
                          type="submit"
                        >
                          Hide
                        </button>
                      </form>
                    ) : (
                      <form
                        action={showWishAction.bind(
                          null,
                          invitation.id,
                          wish.id,
                        )}
                      >
                        <button
                          className={`${adminButtonSecondaryClass} h-10 px-3`}
                          type="submit"
                        >
                          Show
                        </button>
                      </form>
                    )}

                    <form
                      action={deleteWishAction.bind(
                        null,
                        invitation.id,
                        wish.id,
                      )}
                    >
                      <button
                        className={`${adminButtonDangerClass} h-10 px-3`}
                        type="submit"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <AdminEmptyState
            description="Ucapan tamu akan muncul di sini setelah dikirim dari halaman publik."
            title="Belum ada ucapan"
          />
        )}
      </AdminPanel>
    </div>
  );
}
