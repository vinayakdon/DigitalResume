import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { categoryColor } from "@/content/categories";
import type { Project } from "@/content/types";
import { GitHubIcon } from "./brand-icons";
import { ProjectCover } from "./project-cover";

export const kindLabel: Record<NonNullable<Project["kind"]>, string | null> = {
  personal: null,
  coursework: "Coursework",
  learning: "Learning project",
};

export function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  const metric = project.metrics?.[0];
  const label = project.kind ? kindLabel[project.kind] : null;
  const shown = project.tech.slice(0, 4);
  const more = project.tech.length - shown.length;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-muted/60">
      <Link href={`/projects/${project.slug}`} tabIndex={-1} aria-hidden="true" className="block aspect-[16/9] overflow-hidden border-b border-line">
        <div className="size-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          <ProjectCover project={project} priority={priority} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-2 text-xs text-muted">
          <span className="size-2 rounded-full" style={{ background: categoryColor[project.category] }} aria-hidden="true" />
          {project.category}
          {label ? `, ${label.toLowerCase()}` : ""}
        </p>
        <h3 className="mt-1.5 text-lg font-semibold leading-snug">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent">
            {project.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>

        {metric && (
          <p className="mt-4 text-sm">
            <span className="font-semibold tabular-nums text-signal">{metric.value}</span>{" "}
            <span className="text-muted">{metric.label.charAt(0).toLowerCase() + metric.label.slice(1)}</span>
          </p>
        )}

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
          {shown.map((t) => (
            <li key={t} className="rounded-md bg-sunken px-2 py-0.5 text-xs text-muted">
              {t}
            </li>
          ))}
          {more > 0 && <li className="px-1 py-0.5 text-xs text-muted">+{more}</li>}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 text-sm font-medium">
          <Link href={`/projects/${project.slug}`} className="text-accent hover:underline">
            Details<span className="sr-only"> about {project.name}</span>
          </Link>
          <a href={project.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-ink">
            <GitHubIcon className="size-3.5" /> Code<span className="sr-only"> for {project.name} on GitHub</span>
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-ink">
              <ExternalLink className="size-3.5" aria-hidden="true" /> Live demo<span className="sr-only"> of {project.name}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
