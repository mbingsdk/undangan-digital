import type { ReactNode } from "react";

export const adminInputClass =
  "h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-4 focus:ring-stone-200/70";

export const adminTextareaClass =
  "min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-4 focus:ring-stone-200/70";

export const adminSelectClass = adminInputClass;

export const adminButtonPrimaryClass =
  "inline-flex h-11 items-center justify-center rounded-xl bg-stone-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-stone-400 disabled:shadow-none";

export const adminButtonSecondaryClass =
  "inline-flex h-11 items-center justify-center rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-950 hover:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:text-stone-400 disabled:shadow-none";

export const adminButtonDangerClass =
  "inline-flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md";

export function AdminPageHeader({
  actions,
  description,
  eyebrow,
  meta,
  title,
}: {
  actions?: ReactNode;
  description?: ReactNode;
  eyebrow: string;
  meta?: ReactNode;
  title: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-700">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            {description}
          </p>
        ) : null}
        {meta ? <div className="mt-3">{meta}</div> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          {actions}
        </div>
      ) : null}
    </section>
  );
}

export function AdminPanel({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: ReactNode;
  title?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm shadow-stone-200/60">
      {title || description ? (
        <div className="border-b border-stone-100 bg-stone-50/70 px-5 py-4 sm:px-6">
          {title ? (
            <h2 className="text-lg font-semibold tracking-tight text-stone-950">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function AdminMetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm shadow-stone-200/60">
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
        {value}
      </p>
    </article>
  );
}

export function AdminStatusBadge({ status }: { status: string }) {
  const tone =
    status === "PUBLISHED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : status === "ARCHIVED"
        ? "border-stone-200 bg-stone-100 text-stone-700"
        : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${tone}`}
    >
      {status === "PUBLISHED"
        ? "Published"
        : status === "ARCHIVED"
          ? "Archived"
          : "Draft"}
    </span>
  );
}

export function AdminEmptyState({
  action,
  description,
  title,
}: {
  action?: ReactNode;
  description: ReactNode;
  title: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/70 px-5 py-10 text-center">
      <h2 className="text-lg font-semibold tracking-tight text-stone-950">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
