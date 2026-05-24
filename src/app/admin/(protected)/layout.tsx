import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link className="text-lg font-semibold" href="/admin">
              Undangan Digital
            </Link>
            <p className="mt-1 text-sm text-stone-600">{admin.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              className="inline-flex h-10 items-center justify-center border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
              href="/admin"
            >
              Dashboard
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
              href="/admin/invitations"
            >
              Undangan
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
