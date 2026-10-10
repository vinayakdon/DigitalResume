import { site } from "@/content/site";
import { GitHubIcon, KaggleIcon, LinkedInIcon } from "./brand-icons";
import { CurrentYear } from "./current-year";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-semibold">{site.name}</p>
          <p className="mt-1 text-sm text-muted">{site.tagline}</p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <ul className="flex gap-1" aria-label="Profiles">
            {[
              { href: site.links.github, label: "GitHub", Icon: GitHubIcon },
              { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
              { href: site.links.kaggle, label: "Kaggle", Icon: KaggleIcon },
            ].map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-ink"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">
            © <CurrentYear /> {site.fullName}
          </p>
        </div>
      </div>
    </footer>
  );
}
