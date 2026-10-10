/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit this file to update the portfolio.
 *  Projects live in ./projects.ts.
 * ─────────────────────────────────────────────────────────────
 */
import type {
  Certification,
  EducationItem,
  ExperienceItem,
  Publication,
  SkillGroup,
} from "./types";

export const site = {
  /** Production URL — used for SEO, Open Graph and the sitemap. Update after deploying. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinayak-donawad.vercel.app",
  name: "Vinayak Donawad",
  fullName: "Vinayak Shivappa Donawad",
  initials: "VD",
  headline: "AI & Data Engineer",
  focus: ["LLMs & RAG", "Machine Learning", "Data Analytics", "Data Engineering"],
  location: "Berlin, Germany",
  tagline: "Building reliable AI and data systems — from model to production.",
  intro:
    "I build LLM and RAG applications, machine-learning models and data pipelines. Before my M.Sc. in Data Science, I spent nearly two years as a software engineer at HCLTech shipping conversational AI to enterprise clients.",
  availability: "Open to AI, ML, Data Science and Data Engineering roles in Germany and the EU.",

  /**
   * Profile photo. Put a square image (min 600×600) at public/profile.jpg and set
   * the path below. Leave as null to show the initials monogram.
   */
  photo: null as string | null,

  /**
   * Resume. Drop your PDF at public/resume/Vinayak_Donawad_Resume.pdf.
   * If the file is missing, the site automatically swaps the download button
   * for a "Request my resume" email link — no dead buttons.
   */
  resumePath: "/resume/Vinayak_Donawad_Resume.pdf",

  email: "vinayakdon25@gmail.com",
  links: {
    github: "https://github.com/vinayakdon",
    linkedin: "https://www.linkedin.com/in/vinayak-donawad-a018171b8/",
    kaggle: "https://www.kaggle.com/vinayaksdonawad",
  },
  githubUsername: "vinayakdon",

  languages: [
    { name: "English", level: "C1" },
    { name: "German", level: "A2 — actively improving" },
  ],
} as const;

export const about = {
  paragraphs: [
    "I started in electronics engineering, moved into software, and found the work I enjoy most where software meets data: systems that understand language, learn from data, and stay dependable once real users rely on them.",
    "At HCLTech I built end-to-end conversational AI on the Lucy platform — conversation design, NLP intent and entity models, backend logic and production deployments — for more than 15 enterprise clients including Barclays, Honda and KONE. Integrating LLMs through prompt engineering improved response accuracy by 25%, and I connected the bots to ServiceNow and Microsoft Teams for IT service management.",
    "My M.Sc. in Data Science in Berlin gave that experience a stronger statistical foundation. My thesis on reliability-aware retrieval-augmented generation for medical question answering has been accepted for publication in IEEE Access — and taught me to be precise about what a model can and can't claim.",
    "I'm looking for a team where I can build AI and data products end to end: designing the pipeline, evaluating models honestly, and writing software that holds up in production.",
  ],
  approach: [
    {
      title: "Evaluate before you claim",
      text: "I pick metrics that fit the problem — recall on imbalanced fraud data, precision for spam — and report limitations alongside results.",
    },
    {
      title: "Ship the whole thing",
      text: "Models are only useful behind a working interface. I take projects from data cleaning to an API, UI or dashboard people can use.",
    },
    {
      title: "Keep it maintainable",
      text: "Clear module boundaries, tests where they matter and READMEs that let someone else run the project in minutes.",
    },
  ],
};

export const experience: ExperienceItem[] = [
  {
    role: "Software Engineer — Conversational AI",
    company: "HCLTech",
    location: "India",
    start: "Sep 2022",
    end: "Jun 2024",
    summary:
      "Built and deployed AI-powered chatbot systems on the Lucy platform for enterprise IT service management.",
    highlights: [
      "Designed end-to-end chatbot solutions — conversation flows, NLP intent and entity models, backend logic and production-scale deployments.",
      "Improved response accuracy by 25% by integrating large language models through prompt engineering.",
      "Built ServiceNow and Microsoft Teams integrations so users could raise and track IT tickets directly from the chat.",
      "Worked directly with 15+ enterprise clients, including Barclays, Honda and KONE, from requirements to go-live.",
    ],
    tech: [
      "Python",
      "JavaScript",
      "Node.js",
      "React",
      "FastAPI",
      "REST APIs & JWT",
      "MongoDB",
      "IBM Cloudant",
      "Docker",
      "Kubernetes",
      "AWS (S3, Lambda, CloudWatch)",
      "ServiceNow",
      "Microsoft Teams",
      "LLMs & prompt engineering",
    ],
  },
];

export const education: EducationItem[] = [
  {
    degree: "M.Sc. Data Science",
    school: "University of Europe for Applied Sciences",
    location: "Berlin, Germany",
    period: "Graduated Sep 2026",
    details: [
      "Thesis: Reliability-Aware Retrieval-Augmented Generation for Grounded Medical Question Answering — accepted in IEEE Access.",
      "Coursework projects in machine learning, decision support systems and data visualization.",
    ],
  },
  {
    degree: "B.E. Electronics and Communication Engineering",
    school: "KLE Technological University",
    location: "Hubballi, India",
    details: ["GPA 8.25 / 10", "Digital design, VLSI and CMOS fundamentals."],
  },
];

export const publication: Publication = {
  title:
    "Reliability-Aware Retrieval-Augmented Generation for Grounded Medical Question Answering: A Reproducible and Leakage-Controlled MedQuAD Study",
  venue: "IEEE Access",
  status: "Accepted for publication",
  summary:
    "A fully local RAG pipeline (LangChain, FAISS, all-MiniLM-L6-v2 embeddings, Mistral 7B via Ollama) evaluated with RAGAS, plus a composite reliability score built with Platt scaling, temperature scaling and conformal prediction. The study documents its limits openly: query–document leakage, no clinical validation and manually set weights.",
  url: undefined,
};

export const certifications: Certification[] = [
  { name: "AWS Certified Data Engineer", issuer: "Amazon Web Services" },
  { name: "Google Data Analytics Professional Certificate", issuer: "Google" },
];

export const skills: SkillGroup[] = [
  {
    title: "Programming",
    description: "Languages I use day to day",
    items: ["Python", "SQL", "JavaScript", "Java"],
  },
  {
    title: "AI, LLMs & NLP",
    description: "Retrieval, generation and language models",
    items: [
      "LangChain",
      "RAG pipelines",
      "Prompt engineering",
      "FAISS",
      "ChromaDB",
      "HNSWLib",
      "Sentence Transformers",
      "Ollama (Mistral, Llama 2)",
      "OpenAI embeddings",
      "RAGAS evaluation",
      "NLTK",
      "TF-IDF",
    ],
  },
  {
    title: "Machine Learning",
    description: "Modelling and evaluation",
    items: [
      "scikit-learn",
      "Pandas",
      "NumPy",
      "TensorFlow",
      "PyTorch",
      "Classification (SVM, Naive Bayes, LR, RF)",
      "Clustering & KNN",
      "Model evaluation & calibration",
      "Imbalanced data",
    ],
  },
  {
    title: "Data Analytics & BI",
    description: "From raw data to decisions",
    items: [
      "Power BI",
      "Streamlit",
      "Matplotlib",
      "Seaborn",
      "Excel",
      "Exploratory data analysis",
      "Data cleaning",
      "Time-series forecasting",
    ],
  },
  {
    title: "Data Engineering & Cloud",
    description: "Storage, processing and infrastructure",
    items: [
      "AWS (S3, Lambda, CloudWatch)",
      "Apache Spark",
      "Databricks",
      "Snowflake",
      "PostgreSQL",
      "MongoDB",
      "IBM Cloudant",
      "Docker",
      "Kubernetes",
      "Splunk",
    ],
  },
  {
    title: "Software Development",
    description: "APIs, interfaces and testing",
    items: [
      "React",
      "Node.js",
      "Express",
      "FastAPI",
      "Spring Boot",
      "REST APIs & JWT",
      "pytest & unittest.mock",
      "Git",
      "Tailwind CSS",
    ],
  },
];

/** Contact form: set NEXT_PUBLIC_WEB3FORMS_KEY (see README). Without it the form stays disabled and says so. */
export const contact = {
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
};
