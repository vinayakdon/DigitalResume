import type { ReactNode } from "react";

export function Section({
  id,
  title,
  intro,
  children,
  wide = false,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  /** Wide sections stack the heading above the content instead of beside it. */
  wide?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line">
      <div
        className={`mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28 ${
          wide ? "" : "grid gap-10 md:grid-cols-12 md:gap-12"
        }`}
      >
        <header className={wide ? "mb-10 max-w-2xl" : "md:col-span-4"}>
          <h2 id={`${id}-title`} className="display text-3xl font-semibold sm:text-4xl">
            {title}
          </h2>
          {intro && <p className="mt-4 max-w-md text-muted">{intro}</p>}
        </header>
        <div className={wide ? "min-w-0" : "min-w-0 md:col-span-8"}>{children}</div>
      </div>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-sunken px-2 py-0.5 text-xs text-muted">{children}</span>
  );
}
