import Link from "next/link";
import { categoryColor } from "@/content/categories";
import type { Project } from "@/content/types";
import { GitHubIcon } from "./brand-icons";
import { ProjectVisual } from "./project-visuals";

/** Large two-column card for the flagship project, shown above the grid. */
export function ProjectSpotlight({ project }: { project: Project }) {
  return (
    <article className="group grid overflow-hidden rounded-2xl border border-line bg-surface lg:grid-cols-5">
      <Link href={`/projects/${project.slug}`} tabIndex={-1}
        aria-hidden="true"
        className="flex items-center overflow-hidden border-b border-line lg:col-span-3 lg:border-b-0 lg:border-r"
        style={{ background: `color-mix(in oklab, ${categoryColor[project.category]} 7%, var(--surface))` }}
      >
        <div className="aspect-[16/9] w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]">
          <ProjectVisual project={project} />
        </div>
      </Link>
      <div className="flex flex-col p-6 sm:p-8 lg:col-span-2">
        <p className="flex items-center gap-2 text-xs text-muted">
          <span className="size-2 rounded-full" style={{ background: categoryColor[project.category] }} aria-hidden="true" />
          Featured project, {project.category}
        </p>
        <h3 className="display mt-2 text-2xl font-semibold sm:text-3xl">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent">
            {project.name}
          </Link>
        </h3>
        <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>
        <ul className="mt-5 space-y-2 text-sm">
          {project.features.slice(0, 3).map((f) => (
            <li key={f} className="flex gap-3 leading-relaxed">
              <span className="mt-2.5 h-px w-3 shrink-0 bg-muted" aria-hidden="true" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t} className="rounded-md bg-sunken px-2 py-0.5 text-xs text-muted">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-semibold text-bg hover:opacity-85"
          >
            Read the case study
          </Link>
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold hover:border-ink"
          >
            <GitHubIcon className="size-4" /> Code
          </a>
        </div>
      </div>
    </article>
  );
}
