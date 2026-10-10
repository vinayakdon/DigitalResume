import { Download, FileText, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { GitHubActivity } from "@/components/github-activity";
import { Hero } from "@/components/hero";
import { ProjectExplorer } from "@/components/project-explorer";
import { Section } from "@/components/section";
import { About, Education, Experience, Research, Skills } from "@/components/sections";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { site } from "@/content/site";
import { resumeAvailable, resumeRequestHref } from "@/lib/assets";

export default function Home() {
  const hasResume = resumeAvailable();
  return (
    <>
      <Hero />
      <About />
      <Experience />

      <Section
        id="projects"
        wide
        title="Projects"
        intro="Selected work from my GitHub — NLP and RAG systems, ML models, analytics dashboards and tested software. Each card links to the code; details pages cover methods and results."
      >
        <ProjectExplorer />
      </Section>

      <Research />
      <Skills />
      <Education />

      <Section id="github" title="GitHub activity" intro="Live from the GitHub API, refreshed each visit.">
        <GitHubActivity />
      </Section>

      <Section id="resume" title="Resume" intro="A one-page summary of my experience, education and skills.">
        <div className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <FileText className="size-10 shrink-0 text-accent" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold">{site.fullName} — Resume</p>
            <p className="mt-1 text-sm text-muted">
              {hasResume ? "PDF, one page." : "I tailor my resume to each role — ask and I'll send the latest version."}
            </p>
          </div>
          {hasResume ? (
            <a
              href={site.resumePath}
              download
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-bg hover:opacity-85"
            >
              <Download className="size-4" aria-hidden="true" /> Download PDF
            </a>
          ) : (
            <a
              href={resumeRequestHref()}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-bg hover:opacity-85"
            >
              <Mail className="size-4" aria-hidden="true" /> Request my resume
            </a>
          )}
        </div>
      </Section>

      <Section
        id="contact"
        title="Contact"
        intro={
          <>
            {site.availability} The quickest way to reach me is email.
          </>
        }
      >
        <div className="mb-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 font-semibold hover:text-accent">
            <Mail className="size-4" aria-hidden="true" /> {site.email}
          </a>
          <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold hover:text-accent">
            <LinkedInIcon className="size-4" /> LinkedIn
          </a>
          <a href={site.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold hover:text-accent">
            <GitHubIcon className="size-4" /> GitHub
          </a>
        </div>
        <ContactForm />
      </Section>
    </>
  );
}
