/**
 * A tiny BM25 retriever over the site's own content. It powers the
 * "ask my portfolio" console in the hero — keyword retrieval only, no LLM,
 * and it runs entirely in the visitor's browser.
 */
import { projects } from "@/content/projects";
import { certifications, education, experience, publication, skills } from "@/content/site";

export interface Doc {
  id: string;
  kind: "Project" | "Experience" | "Research" | "Skills" | "Education" | "Certification";
  title: string;
  snippet: string;
  href: string;
  text: string;
}

const STOP = new Set(
  "a an and are as at be by for from has have he his how i in is it its my of on or so that the this to was were what when where which who with you your do does did use used using about any work worked".split(
    " ",
  ),
);

/** Map common phrasings onto the vocabulary the content actually uses. */
const SYNONYMS: Record<string, string[]> = {
  llm: ["llms", "ollama", "rag", "language"],
  genai: ["llm", "rag", "generation"],
  chatbot: ["chatbots", "conversational"],
  bi: ["power", "dashboard"],
  dashboards: ["dashboard"],
  powerbi: ["power", "bi"],
  test: ["tests", "testing", "pytest"],
  tests: ["test", "testing", "pytest"],
  testing: ["tests", "pytest", "mock"],
  cloud: ["aws", "lambda", "s3"],
  etl: ["pipeline", "spark", "databricks", "cleaning"],
  fraud: ["fake", "scam", "imbalanced"],
  imbalance: ["imbalanced"],
  nlp: ["text", "language", "tfidf", "nltk"],
  ml: ["machine", "learning", "scikit"],
  vector: ["faiss", "hnswlib", "chromadb", "embeddings"],
  embeddings: ["embedding", "vector", "minilm"],
  frontend: ["react", "ui"],
  backend: ["express", "node", "fastapi", "api"],
  api: ["rest", "fastapi", "express"],
};

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/tf-idf/g, "tfidf")
    .replace(/power bi/g, "powerbi power bi")
    .split(/[^a-z0-9+#]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function buildDocs(): Doc[] {
  const docs: Doc[] = [];
  for (const p of projects) {
    docs.push({
      id: `p-${p.slug}`,
      kind: "Project",
      title: p.name,
      snippet: p.summary,
      href: `/projects/${p.slug}`,
      text: [p.name, p.name, p.summary, p.problem, p.category, p.tech.join(" "), p.tech.join(" "), p.features.join(" ")].join(" "),
    });
  }
  for (const e of experience) {
    docs.push({
      id: `e-${e.company}`,
      kind: "Experience",
      title: `${e.role}, ${e.company}`,
      snippet: e.summary,
      href: "/#experience",
      text: [e.role, e.company, e.summary, e.highlights.join(" "), e.tech.join(" "), "chatbot chatbots conversational ai enterprise llm"].join(" "),
    });
  }
  docs.push({
    id: "research",
    kind: "Research",
    title: "M.Sc. thesis — IEEE Access",
    snippet: "Reliability-aware RAG for grounded medical question answering, accepted in IEEE Access.",
    href: "/#research",
    text: [publication.title, publication.summary, publication.venue, "rag llm research paper thesis calibration medical"].join(" "),
  });
  for (const g of skills) {
    docs.push({
      id: `s-${g.title}`,
      kind: "Skills",
      title: g.title,
      snippet: g.items.slice(0, 6).join(", ") + (g.items.length > 6 ? "…" : ""),
      href: "/#skills",
      text: [g.title, g.description, g.items.join(" ")].join(" "),
    });
  }
  for (const ed of education) {
    docs.push({
      id: `ed-${ed.degree}`,
      kind: "Education",
      title: ed.degree,
      snippet: `${ed.school}${ed.period ? `, ${ed.period}` : ""}`,
      href: "/#education",
      text: [ed.degree, ed.school, ed.location ?? "", ed.details.join(" ")].join(" "),
    });
  }
  for (const c of certifications) {
    docs.push({
      id: `c-${c.name}`,
      kind: "Certification",
      title: c.name,
      snippet: c.issuer,
      href: "/#education",
      text: `${c.name} ${c.issuer} certificate certification`,
    });
  }
  return docs;
}

interface Index {
  docs: Doc[];
  tf: Map<string, number>[];
  len: number[];
  df: Map<string, number>;
  avgLen: number;
}

let cached: Index | null = null;

function index(): Index {
  if (cached) return cached;
  const docs = buildDocs();
  const tf: Map<string, number>[] = [];
  const len: number[] = [];
  const df = new Map<string, number>();
  for (const d of docs) {
    const toks = tokenize(d.text);
    const m = new Map<string, number>();
    for (const t of toks) m.set(t, (m.get(t) ?? 0) + 1);
    for (const t of m.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    tf.push(m);
    len.push(toks.length);
  }
  cached = { docs, tf, len, df, avgLen: len.reduce((a, b) => a + b, 0) / len.length };
  return cached;
}

export interface Hit {
  doc: Doc;
  score: number;
  /** Score relative to the best hit, 0–1. */
  relative: number;
  matched: string[];
}

export function search(query: string, k = 3): Hit[] {
  const { docs, tf, len, df, avgLen } = index();
  const base = tokenize(query);
  if (base.length === 0) return [];
  const terms = new Map<string, number>();
  for (const t of base) {
    terms.set(t, 1);
    for (const s of SYNONYMS[t] ?? []) if (!terms.has(s)) terms.set(s, 0.5);
  }
  const N = docs.length;
  const k1 = 1.4;
  const b = 0.75;
  const scored = docs.map((doc, i) => {
    let score = 0;
    const matched: string[] = [];
    for (const [t, w] of terms) {
      const f = tf[i].get(t);
      if (!f) continue;
      const n = df.get(t) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += w * idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * len[i]) / avgLen)));
      if (w === 1) matched.push(t);
    }
    // Prefer concrete evidence (projects, roles) over broad skill lists.
    const weight = doc.kind === "Project" || doc.kind === "Experience" ? 1.2 : doc.kind === "Skills" ? 0.6 : 1;
    return { doc, score: score * weight, matched };
  });
  const hits = scored.filter((h) => h.score > 0).sort((a, b) => b.score - a.score).slice(0, k);
  const top = hits[0]?.score ?? 1;
  return hits.map((h) => ({ ...h, relative: h.score / top }));
}
