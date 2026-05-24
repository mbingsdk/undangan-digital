type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  description,
  eyebrow,
  title,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center" data-invitation-reveal="up">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/60">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-4xl font-medium leading-tight text-amber-50 sm:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-5 max-w-lg text-sm font-light leading-7 text-slate-300">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function PublicEmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.04] px-5 py-8 text-center backdrop-blur-md">
      <p className="text-sm leading-6 text-slate-300">{children}</p>
    </div>
  );
}
import type { ReactNode } from "react";
