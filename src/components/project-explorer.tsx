"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, projects } from "@/content/projects";
import type { ProjectCategory } from "@/content/types";
import { categoryColor } from "@/content/categories";
import { ProjectCard } from "./project-card";
import { ProjectSpotlight } from "./project-spotlight";

const SPOTLIGHT = "rag-scheduler";

const ordered = [...projects].sort(
  (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.year - a.year,
);

export function ProjectExplorer() {
  const [category, setCategory] = useState<ProjectCategory | "All">("All");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ordered.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      const hay = [p.name, p.summary, p.problem, p.category, ...p.tech, ...p.features].join(" ").toLowerCase();
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [category, query]);

  const spotlight = category === "All" && !query.trim() ? projects.find((p) => p.slug === SPOTLIGHT) : undefined;
  const grid = spotlight ? results.filter((p) => p.slug !== SPOTLIGHT) : results;

  const count = (c: ProjectCategory | "All") =>
    c === "All" ? projects.length : projects.filter((p) => p.category === c).length;

  const reset = () => {
    setCategory("All");
    setQuery("");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="-mx-1 flex flex-wrap gap-1.5">
          {(["All", ...categories] as const).map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-ink bg-ink text-bg"
                    : "border-line bg-surface text-muted hover:border-muted hover:text-ink"
                }`}
              >
                {c !== "All" && (
                  <span
                    className="mr-1.5 inline-block size-2 rounded-full align-middle"
                    style={{ background: categoryColor[c] }}
                    aria-hidden="true"
                  />
                )}
                {c} <span className={`tabular-nums ${active ? "opacity-70" : "opacity-60"}`}>{count(c)}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or tool"
            className="h-10 w-full rounded-full border border-line bg-surface pl-9 pr-9 text-sm outline-none placeholder:text-muted/70 focus:border-accent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        Showing {results.length} of {projects.length} projects
      </p>

      {spotlight && (
        <div className="mt-5">
          <ProjectSpotlight project={spotlight} />
        </div>
      )}

      {results.length > 0 ? (
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((p, i) => (
            <li key={p.slug}>
              <ProjectCard project={p} priority={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-line px-6 py-14 text-center">
          <p className="font-semibold">No projects match {query ? `“${query}”` : "this filter"}</p>
          <p className="mt-1 text-sm text-muted">Try a broader term like Python or dashboard, or clear the filters.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:border-ink"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
