"use client";

import { useState } from "react";
import type { Project, ProjectImage } from "@/content/types";
import { hasVisual, ProjectVisual } from "./project-visuals";

/** Card / hero cover: the project's data visual, falling back to its first screenshot. */
export function ProjectCover({ project, priority = false }: { project: Project; priority?: boolean }) {
  const img = project.images?.[0];
  const [failed, setFailed] = useState(false);
  if (hasVisual(project.slug) || !img || failed) return <ProjectVisual project={project} />;
  return (
    // Plain <img>: some screenshots are hosted on GitHub and can't go through the image optimiser.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={(el) => {
        if (el && el.complete && el.naturalWidth === 0) setFailed(true);
      }}
      src={img.src}
      alt={img.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className="size-full object-cover object-top"
    />
  );
}

/** A screenshot or notebook figure that removes itself if the image can't load. */
export function Figure({ img }: { img: ProjectImage }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={(el) => {
          if (el && el.complete && el.naturalWidth === 0) setFailed(true);
        }}
        src={img.src}
        alt={img.alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full"
      />
      <figcaption className="border-t border-line bg-surface px-4 py-2.5 text-sm text-muted">{img.alt}</figcaption>
    </figure>
  );
}
