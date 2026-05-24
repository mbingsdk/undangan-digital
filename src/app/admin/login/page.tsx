import type { Metadata } from "next";
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
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-12 text-stone-950">
      <section className="w-full max-w-md border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase text-rose-700">
            Admin internal
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Masuk dashboard</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Gunakan akun admin yang dibuat dari seed database.
          </p>
        </div>

        <LoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}
