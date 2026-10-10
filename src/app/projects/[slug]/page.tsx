import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/brand-icons";
import { Figure, ProjectCover } from "@/components/project-cover";
import { hasVisual } from "@/components/project-visuals";
import { kindLabel } from "@/components/project-card";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.name, description: p.summary, url: `/projects/${p.slug}` },
  };
}

function Block({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((t) => (
          <li key={t} className="flex gap-3 leading-relaxed">
            <span className="mt-3 h-px w-3 shrink-0 bg-muted" aria-hidden="true" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const label = p.kind ? kindLabel[p.kind] : null;
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];
  // The cover shows the data visual; every screenshot goes in the gallery (or all but the cover image).
  const gallery = hasVisual(p.slug) ? (p.images ?? []) : (p.images ?? []).slice(1);

  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:px-8 md:pt-14">
      <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" /> All projects
      </Link>

      <p className="mt-10 text-sm text-muted">
        {p.category}
        {label ? `, ${label.toLowerCase()}` : ""}, {p.year}
      </p>
      <h1 className="display mt-2 text-4xl font-semibold sm:text-5xl">{p.name}</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">{p.summary}</p>

      <div className="mt-7 flex flex-wrap gap-3">
        <a
          href={p.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-bg hover:opacity-85"
        >
          <GitHubIcon className="size-4" /> View code on GitHub
        </a>
        {p.demo && (
          <a
            href={p.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-semibold hover:border-ink"
          >
            <ExternalLink className="size-4" aria-hidden="true" /> Open live demo
          </a>
        )}
      </div>
      {p.demo?.includes("streamlit.app") && (
        <p className="mt-3 text-xs text-muted">Streamlit apps sleep when idle and can take up to a minute to wake.</p>
      )}

      <div className="mt-10 aspect-[16/9] overflow-hidden rounded-xl border border-line">
        <ProjectCover project={p} priority />
      </div>

      {p.metrics && (
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
          {p.metrics.map((m) => (
            <div key={m.label} className="bg-surface p-4">
              <dt className="text-xs text-muted">{m.label}</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums text-signal">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold">The problem</h2>
        <p className="mt-4 leading-relaxed">{p.problem}</p>
      </section>

      <Block title="What it does" items={p.features} />
      <Block title="Architecture" items={p.details?.architecture} />
      <Block title="Method" items={p.details?.methodology} />
      <Block title="Results" items={p.details?.results} />
      <Block title="Lessons and next steps" items={p.details?.lessons} />

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Built with</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <li key={t} className="rounded-md border border-line bg-surface px-2.5 py-1 text-sm">
              {t}
            </li>
          ))}
        </ul>
      </section>

      {gallery.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">From the repository</h2>
          <p className="mt-2 text-sm text-muted">Screenshots and charts as they appear in the project&apos;s code and notebooks.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {gallery.map((img) => (
              <Figure key={img.src} img={img} />
            ))}
          </div>
        </section>
      )}

      <nav aria-label="Next project" className="mt-20 border-t border-line pt-8">
        <p className="text-sm text-muted">Next project</p>
        <Link href={`/projects/${next.slug}`} className="mt-1 inline-block text-2xl font-semibold hover:text-accent">
          {next.name}
        </Link>
      </nav>
    </article>
  );
}
