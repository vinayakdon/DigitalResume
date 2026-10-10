"use client";

import { useEffect, useState } from "react";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { GitHubIcon } from "./brand-icons";

interface Profile {
  public_repos: number;
  followers: number;
  created_at: string;
}
interface Repo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  stargazers_count: number;
}
type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; profile: Profile; repos: Repo[]; fetchedAt: number };

const CACHE_KEY = `gh:${site.githubUsername}`;
const TTL = 60 * 60 * 1000;

async function load(): Promise<{ profile: Profile; repos: Repo[]; fetchedAt: number }> {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      const c = JSON.parse(raw);
      if (Date.now() - c.at < TTL) return c.data;
    }
  } catch {
    /* storage unavailable — fetch fresh */
  }
  const u = site.githubUsername;
  const headers = { Accept: "application/vnd.github+json" };
  const [p, r] = await Promise.all([
    fetch(`https://api.github.com/users/${u}`, { headers }),
    fetch(`https://api.github.com/users/${u}/repos?per_page=100&sort=pushed`, { headers }),
  ]);
  if (!p.ok || !r.ok) throw new Error(`GitHub API ${p.status}/${r.status}`);
  const data = { profile: (await p.json()) as Profile, repos: (await r.json()) as Repo[], fetchedAt: Date.now() };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* ignore */
  }
  return data;
}

const fmt = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" });

export function GitHubActivity() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [chartOk, setChartOk] = useState(true);

  useEffect(() => {
    let alive = true;
    load()
      .then((d) => alive && setState({ status: "ready", ...d }))
      .catch(() => alive && setState({ status: "error" }));
    return () => {
      alive = false;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div aria-busy="true" aria-label="Loading GitHub activity">
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
        <div className="skeleton mt-6 h-3 rounded-full" />
        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-12 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    const curated = projects.filter((p) => p.featured).slice(0, 4);
    return (
      <div>
        <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">
          Live GitHub data didn&apos;t load — the public API may be rate-limited for your network. These are selected
          repositories instead.
        </p>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {curated.map((p) => (
            <li key={p.slug} className="py-3.5">
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-accent">
                {p.repo.split("/").pop()}
              </a>
              <p className="mt-0.5 text-sm text-muted">{p.summary}</p>
            </li>
          ))}
        </ul>
        <ProfileLink />
      </div>
    );
  }

  const own = state.repos.filter((r) => !r.fork);
  const langCounts = new Map<string, number>();
  for (const r of own) if (r.language) langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
  const langs = [...langCounts.entries()].sort((a, b) => b[1] - a[1]);
  const top = langs.slice(0, 5);
  const otherCount = langs.slice(5).reduce((s, [, n]) => s + n, 0);
  const totalLang = langs.reduce((s, [, n]) => s + n, 0) || 1;
  const recent = own.slice(0, 5);
  const shades = ["var(--accent)", "var(--signal)", "var(--ink)", "var(--muted)", "var(--line)"];

  return (
    <div>
      <dl className="grid grid-cols-3 gap-4">
        {[
          ["Public repositories", state.profile.public_repos],
          ["Updated in the last year", own.filter((r) => state.fetchedAt - new Date(r.pushed_at).getTime() < 365 * 864e5).length],
          ["On GitHub since", new Date(state.profile.created_at).getFullYear()],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-xl border border-line bg-surface p-4">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-10 text-sm font-semibold">Languages across my repositories</h3>
      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-sunken" role="img" aria-label={top.map(([l, n]) => `${l} ${n}`).join(", ")}>
        {top.map(([l, n], i) => (
          <span key={l} style={{ width: `${(n / totalLang) * 100}%`, background: shades[i] }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
        {top.map(([l, n], i) => (
          <li key={l} className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ background: shades[i] }} aria-hidden="true" />
            {l} <span className="tabular-nums text-muted">{n}</span>
          </li>
        ))}
        {otherCount > 0 && <li className="text-muted">Other {otherCount}</li>}
      </ul>

      <h3 className="mt-10 text-sm font-semibold">Recently updated</h3>
      <ul className="mt-3 divide-y divide-line border-y border-line">
        {recent.map((r) => (
          <li key={r.name} className="flex items-baseline justify-between gap-4 py-3.5">
            <div className="min-w-0">
              <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-accent">
                {r.name}
              </a>
              {r.description && <p className="mt-0.5 truncate text-sm text-muted">{r.description}</p>}
            </div>
            <p className="shrink-0 text-right text-xs text-muted">
              {r.language && <span className="block">{r.language}</span>}
              {fmt.format(new Date(r.pushed_at))}
            </p>
          </li>
        ))}
      </ul>

      {chartOk && (
        <figure className="mt-10">
          <figcaption className="text-sm font-semibold">Contributions in the last year</figcaption>
          <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://ghchart.rshah.org/2346d8/${site.githubUsername}`}
              alt={`GitHub contribution calendar for ${site.githubUsername}`}
              loading="lazy"
              onError={() => setChartOk(false)}
              className="min-w-[640px]"
            />
          </div>
        </figure>
      )}
      <ProfileLink />
    </div>
  );
}

function ProfileLink() {
  return (
    <a
      href={site.links.github}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:text-accent"
    >
      <GitHubIcon className="size-4" /> View all repositories on GitHub
    </a>
  );
}
