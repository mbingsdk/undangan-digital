import Link from "next/link";
import { LayoutDashboard, ListChecks, Sparkles } from "lucide-react";
import { adminButtonSecondaryClass } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fafaf9_0%,#f5f5f4_45%,#fafaf9_100%)] text-stone-950">
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Link
              className="grid size-11 place-items-center rounded-2xl bg-stone-950 text-white shadow-sm"
              href="/admin"
            >
              <Sparkles aria-hidden="true" className="size-5" />
              <span className="sr-only">Undangan Digital</span>
            </Link>
            <div>
              <Link
                className="text-lg font-semibold tracking-tight"
                href="/admin"
              >
                Undangan Digital
              </Link>
              <p className="mt-0.5 text-sm text-stone-500">{admin.email}</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <Link
              className={`${adminButtonSecondaryClass} h-10 gap-2 px-3`}
              href="/admin"
            >
              <LayoutDashboard aria-hidden="true" className="size-4" />
              Dashboard
            </Link>
            <Link
              className={`${adminButtonSecondaryClass} h-10 gap-2 px-3`}
              href="/admin/invitations"
            >
              <ListChecks aria-hidden="true" className="size-4" />
              Undangan
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {children}
      </main>
    </div>
  );
}
