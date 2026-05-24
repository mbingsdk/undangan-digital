import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login Admin | Undangan Digital",
};

type AdminLoginPageProps = {
  searchParams?: Promise<{
    next?: string | string[];
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = Array.isArray(params?.next) ? params.next[0] : params?.next;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-100 px-6 py-12 text-stone-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,113,133,0.12),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(120,113,108,0.16),transparent_34%)]" />
      <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 p-6 shadow-2xl shadow-stone-300/40 backdrop-blur-xl sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-300 via-stone-900 to-amber-300" />
        <div className="mb-8">
          <div className="mb-6 grid size-12 place-items-center rounded-2xl bg-stone-950 text-white shadow-sm">
            <Sparkles aria-hidden="true" className="size-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-700">
            Admin internal
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Masuk dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Gunakan akun admin yang dibuat dari seed database.
          </p>
        </div>

        <LoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}
