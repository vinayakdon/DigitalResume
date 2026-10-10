import { BarChart3, Blocks, BrainCircuit, Code2, Database, ExternalLink, Network, type LucideIcon } from "lucide-react";
import { ResearchDiagram } from "./research-diagram";
import { about, certifications, education, experience, publication, site, skills } from "@/content/site";
import { Section, Tag } from "./section";

export function About() {
  return (
    <Section id="about" title="About" intro="Software engineer turned data scientist, focused on AI that holds up in production.">
      <div className="max-w-2xl space-y-5 text-lg leading-relaxed">
        {about.paragraphs.map((p, i) => (
          <p key={i} className={i === 0 ? "" : "text-muted"}>
            {p}
          </p>
        ))}
      </div>

      <h3 className="mt-14 text-sm font-semibold">How I work</h3>
      <dl className="mt-5 grid gap-6 sm:grid-cols-3">
        {about.approach.map((a) => (
          <div key={a.title} className="border-l-2 border-accent pl-4">
            <dt className="font-semibold">{a.title}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-muted">{a.text}</dd>
          </div>
        ))}
      </dl>

      <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-3 text-sm">
        {site.languages.map((l) => (
          <div key={l.name} className="flex gap-2">
            <dt className="font-semibold">{l.name}</dt>
            <dd className="text-muted">{l.level}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" title="Experience" intro="Production software for enterprise clients, before moving into data science.">
      <ol className="relative space-y-12 border-l border-line pl-8">
        <li className="relative">
          <span className="absolute -left-[37px] top-1.5 size-2.5 rounded-full border-2 border-accent bg-bg" aria-hidden="true" />
          <p className="text-sm text-muted">Graduated Sep 2026, Berlin</p>
          <h3 className="mt-1 text-xl font-semibold">
            M.Sc. Data Science <span className="font-normal text-muted">at University of Europe for Applied Sciences</span>
          </h3>
          <p className="mt-3 text-muted">
            Completed with a thesis on reliable retrieval-augmented generation, accepted in IEEE Access. More under{" "}
            <a href="#research" className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
              Research
            </a>
            .
          </p>
        </li>
        {experience.map((e) => (
          <li key={e.company + e.start} className="relative">
            <span className="absolute -left-[37px] top-1.5 size-2.5 rounded-full bg-accent ring-4 ring-bg" aria-hidden="true" />
            <p className="text-sm tabular-nums text-muted">
              {e.start} – {e.end}
              {e.location ? `, ${e.location}` : ""}
            </p>
            <h3 className="mt-1 text-xl font-semibold">
              {e.role} <span className="font-normal text-muted">at {e.company}</span>
            </h3>
            <p className="mt-3 text-muted">{e.summary}</p>
            <ul className="mt-4 space-y-2.5">
              {e.highlights.map((h) => (
                <li key={h} className="flex gap-3 leading-relaxed">
                  <span className="mt-2.5 h-px w-3 shrink-0 bg-muted" aria-hidden="true" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies used">
              {e.tech.map((t) => (
                <li key={t}>
                  <Tag>{t}</Tag>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Research() {
  return (
    <section id="research" aria-labelledby="research-title" className="border-t border-line bg-sunken/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-12 md:gap-12 md:py-24">
        <header className="md:col-span-4">
          <h2 id="research-title" className="display text-3xl font-semibold sm:text-4xl">
            Research
          </h2>
          <p className="mt-4 max-w-md text-muted">My M.Sc. thesis, {publication.status.toLowerCase()} in {publication.venue}.</p>
        </header>
        <article className="md:col-span-8">
          <p className="text-sm font-semibold text-accent">{publication.venue}, {publication.status.toLowerCase()}</p>
          <h3 className="mt-3 text-2xl font-semibold leading-snug sm:text-[1.7rem]">{publication.title}</h3>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">{publication.summary}</p>
          <div className="mt-8">
            <ResearchDiagram />
          </div>
          {publication.url && (
            <a
              href={publication.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
            >
              Read the paper <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </article>
      </div>
    </section>
  );
}

const skillStyle: Record<string, { Icon: LucideIcon; color: string }> = {
  Programming: { Icon: Code2, color: "var(--cat-sw)" },
  "AI, LLMs & NLP": { Icon: BrainCircuit, color: "var(--cat-ai)" },
  "Machine Learning": { Icon: Network, color: "var(--cat-ml)" },
  "Data Analytics & BI": { Icon: BarChart3, color: "var(--cat-bi)" },
  "Data Engineering & Cloud": { Icon: Database, color: "var(--cat-de)" },
  "Software Development": { Icon: Blocks, color: "var(--cat-sw)" },
};

export function Skills() {
  return (
    <Section id="skills" title="Skills" intro="Tools I've used in shipped work, my thesis or the projects on this page.">
      <dl className="divide-y divide-line border-y border-line">
        {skills.map((g) => (
          <div key={g.title} className="grid gap-3 py-6 sm:grid-cols-3 sm:gap-6">
            <dt className="flex gap-3">
              {(() => {
                const st = skillStyle[g.title] ?? { Icon: Code2, color: "var(--accent)" };
                return (
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-lg"
                    style={{ background: `color-mix(in oklab, ${st.color} 14%, var(--surface))`, color: st.color }}
                    aria-hidden="true"
                  >
                    <st.Icon className="size-[18px]" />
                  </span>
                );
              })()}
              <span>
                <span className="font-semibold">{g.title}</span>
                <span className="mt-0.5 block text-sm text-muted">{g.description}</span>
              </span>
            </dt>
            <dd className="sm:col-span-2">
              <ul className="flex flex-wrap gap-x-2 gap-y-2">
                {g.items.map((s) => (
                  <li key={s} className="rounded-md border border-line bg-surface px-2.5 py-1 text-sm">
                    {s}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education" title="Education" intro="Degrees and certifications.">
      <ul className="space-y-10">
        {education.map((ed) => (
          <li key={ed.degree}>
            <h3 className="text-xl font-semibold">{ed.degree}</h3>
            <p className="mt-1 text-muted">
              {ed.school}
              {ed.location ? `, ${ed.location}` : ""}
              {ed.period ? ` — ${ed.period}` : ""}
            </p>
            <ul className="mt-3 space-y-1.5">
              {ed.details.map((d) => (
                <li key={d} className="leading-relaxed">
                  {d}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h3 className="mt-16 text-sm font-semibold">Certifications</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {certifications.map((c) => {
          const body = (
            <>
              {c.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" className="size-12 shrink-0 object-contain" />
              )}
              <span>
                <span className="block font-semibold">{c.name}</span>
                <span className="text-sm text-muted">
                  {c.issuer}
                  {c.year ? `, ${c.year}` : ""}
                </span>
              </span>
              {c.url && <ExternalLink className="ml-auto size-4 shrink-0 text-muted" aria-hidden="true" />}
            </>
          );
          return (
            <li key={c.name}>
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-ink"
                >
                  {body}
                  <span className="sr-only">(view credential)</span>
                </a>
              ) : (
                <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
