import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-rose-700">Ucapan</p>
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

      <section className="border border-stone-200 bg-white shadow-sm">
        {wishes.length > 0 ? (
          <ul className="divide-y divide-stone-200">
            {wishes.map((wish) => (
              <li className="p-5" key={wish.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-semibold">{wish.name}</h2>
                      <span className="border border-stone-300 px-2 py-1 text-xs font-medium uppercase text-stone-700">
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
                          className="inline-flex h-10 items-center justify-center border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
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
                          className="inline-flex h-10 items-center justify-center border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
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
                        className="inline-flex h-10 items-center justify-center border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-800 transition hover:bg-red-100"
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
          <div className="px-5 py-10">
            <h2 className="text-lg font-semibold">Belum ada ucapan</h2>
            <p className="mt-2 text-sm text-stone-600">
              Ucapan tamu akan muncul di sini setelah dikirim dari halaman publik.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
