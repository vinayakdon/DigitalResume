export type ProjectCategory =
  | "AI & NLP"
  | "Machine Learning"
  | "Data Analytics & BI"
  | "Data Engineering & Automation"
  | "Software Engineering";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectImage {
  /** Local path under /public (e.g. "/projects/x.webp") or an absolute https URL. */
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  name: string;
  /** One-line summary for cards. */
  summary: string;
  /** The problem the project addresses. */
  problem: string;
  category: ProjectCategory;
  tech: string[];
  features: string[];
  /** Verified numbers only — taken from the repository's own notebook output or README. */
  metrics?: ProjectMetric[];
  repo: string;
  /** Only set when the README links a deployment. */
  demo?: string;
  /** Set to "learning" for course work or guided projects so they're labelled honestly. */
  kind?: "personal" | "coursework" | "learning";
  images?: ProjectImage[];
  featured?: boolean;
  /** Optional deep-dive shown on /projects/[slug]. */
  details?: {
    methodology?: string[];
    architecture?: string[];
    results?: string[];
    lessons?: string[];
  };
  year: number;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location?: string;
  start: string;
  end: string;
  summary: string;
  highlights: string[];
  tech: string[];
}

export interface EducationItem {
  degree: string;
  school: string;
  location?: string;
  period?: string;
  details: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  /** Add the credential URL (Credly, Coursera, …) when you have it. */
  url?: string;
  /** Optional badge image under /public/certificates/. */
  image?: string;
  year?: string;
}

export interface Publication {
  title: string;
  venue: string;
  status: string;
  summary: string;
  /** Add the DOI / IEEE Xplore link once it is published. */
  url?: string;
}

export interface SkillGroup {
  title: string;
  description: string;
  items: string[];
}
