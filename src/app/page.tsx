export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 items-center bg-stone-50 px-6 py-16 text-stone-950">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-12 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase text-rose-700">
            Undangan Digital MVP
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Platform internal untuk membuat dan menerbitkan undangan pernikahan
            digital.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-700">
            Sprint 0 menyiapkan fondasi Next.js App Router, Tailwind CSS,
            Prisma 7, SQLite, seed admin, dan deployment standalone sesuai PRD.
          </p>
        </div>

        <div className="w-full max-w-sm border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Foundation status</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-6">
              <dt className="text-stone-600">Runtime</dt>
              <dd className="font-medium">Next.js App Router</dd>
            </div>
            <div className="flex items-center justify-between gap-6">
              <dt className="text-stone-600">Database</dt>
              <dd className="font-medium">SQLite + Prisma 7</dd>
            </div>
            <div className="flex items-center justify-between gap-6">
              <dt className="text-stone-600">Mode</dt>
              <dd className="font-medium">Internal admin MVP</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
