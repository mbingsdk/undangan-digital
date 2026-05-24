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
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-3xl font-light leading-tight text-zinc-800 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-5 max-w-lg text-sm font-light leading-7 text-zinc-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function PublicEmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="border border-dashed border-zinc-200 bg-white/70 px-5 py-8 text-center">
      <p className="text-sm leading-6 text-zinc-500">{children}</p>
    </div>
  );
}
import type { ReactNode } from "react";
