import Image from "next/image";
import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { photoAvailable, resumeAvailable, resumeRequestHref } from "@/lib/assets";
import { GitHubIcon, KaggleIcon, LinkedInIcon } from "./brand-icons";
import { HeroField } from "./hero-field";
import { RetrievalConsole } from "./retrieval-console";

const proof = [
  { value: "2022–24", label: "shipping conversational AI at HCLTech", color: "var(--cat-ai)" },
  { value: "15+", label: "enterprise clients, incl. Barclays and Honda", color: "var(--cat-bi)" },
  { value: "IEEE Access", label: "M.Sc. thesis accepted for publication", color: "var(--cat-ml)" },
  { value: `${projects.length}`, label: "projects with code on GitHub", color: "var(--cat-de)" },
];

export function Hero() {
  const hasResume = resumeAvailable();
  const hasPhoto = photoAvailable();

  return (
    <section aria-labelledby="hero-title" className="relative isolate">
      <HeroField />
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 md:pb-20 md:pt-20">
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-4">
            {hasPhoto && site.photo ? (
              <Image
                src={site.photo}
                alt={`Portrait of ${site.name}`}
                width={64}
                height={64}
                priority
                className="size-16 rounded-full object-cover ring-1 ring-line"
              />
            ) : (
              <span
                role="img"
                aria-label={`${site.name} monogram`}
                className="grid size-16 place-items-center rounded-full bg-accent text-xl font-semibold text-accent-ink"
              >
                {site.initials}
              </span>
            )}
            <p className="text-sm leading-snug text-muted">
              {site.location}
              <br />
              {site.availability.split(".")[0]}
            </p>
          </div>

          <h1 id="hero-title" className="display mt-8 text-5xl font-semibold sm:text-6xl lg:text-7xl">
            {site.name}
          </h1>
          <p className="mt-4 text-xl font-medium sm:text-2xl">
            {site.headline}
            <span className="text-muted">, working across {site.focus.join(", ").replace(/, ([^,]*)$/, " and $1")}.</span>
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{site.intro}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="#projects"
              className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-bg transition-opacity hover:opacity-85"
            >
              Explore my projects
            </Link>
            {hasResume ? (
              <a
                href={site.resumePath}
                download
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-semibold transition-colors hover:border-ink"
              >
                <Download className="size-4" aria-hidden="true" />
                Download resume
              </a>
            ) : (
              <a
                href={resumeRequestHref()}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-semibold transition-colors hover:border-ink"
              >
                <Mail className="size-4" aria-hidden="true" />
                Request my resume
              </a>
            )}
          </div>

          <ul className="mt-8 flex items-center gap-1" aria-label="Profiles">
            <li>
              <a href={site.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="inline-flex size-10 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-ink">
                <GitHubIcon className="size-5" />
              </a>
            </li>
            <li>
              <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="inline-flex size-10 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-ink">
                <LinkedInIcon className="size-5" />
              </a>
            </li>
            <li>
              <a href={site.links.kaggle} target="_blank" rel="noopener noreferrer" aria-label="Kaggle profile" className="inline-flex size-10 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-ink">
                <KaggleIcon className="size-5" />
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="ml-2 text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-ink">
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-5 lg:pt-4">
          <RetrievalConsole />
        </div>
      </div>

      <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
        {proof.map((p) => (
          <div key={p.label} className="flex flex-col-reverse bg-surface/90 px-5 py-5 backdrop-blur">
            <dt className="mt-1 text-sm leading-snug text-muted">{p.label}</dt>
            <dd className="display text-2xl font-semibold sm:text-3xl" style={{ color: p.color }}>
              {p.value}
            </dd>
          </div>
        ))}
      </dl>
      </div>
    </section>
  );
}
