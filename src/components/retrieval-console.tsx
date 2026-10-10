"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { search } from "@/lib/search";

const SAMPLE = "Where have you used RAG?";
const SUGGESTIONS = ["Imbalanced data", "Power BI", "Testing", "Chatbots", "AWS"];

export function RetrievalConsole() {
  const [query, setQuery] = useState("");
  const [typing, setTyping] = useState(true);
  const touched = useRef(false);

  // One orchestrated moment: type a sample question on first load.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setQuery(SAMPLE);
      setTyping(false);
      return;
    }
    let i = 0;
    const start = setTimeout(function tick() {
      if (touched.current) return;
      i += 1;
      setQuery(SAMPLE.slice(0, i));
      if (i < SAMPLE.length) timer = setTimeout(tick, 38 + Math.random() * 40);
      else setTyping(false);
    }, 650);
    let timer = start;
    return () => clearTimeout(timer);
  }, []);

  const hits = useMemo(() => (typing ? [] : search(query, 3)), [query, typing]);

  const onChange = (v: string) => {
    touched.current = true;
    setTyping(false);
    setQuery(v);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_0_var(--line),0_24px_48px_-32px_rgba(24,32,46,0.35)]">
      <div className="flex items-baseline justify-between gap-3 border-b border-line px-5 py-3">
        <p className="text-sm font-semibold">Ask my portfolio</p>
        <p className="text-xs text-muted">BM25 retrieval, runs in your browser</p>
      </div>

      <div className="px-5 pt-4">
        <label htmlFor="ask" className="sr-only">
          Search my projects, experience and skills
        </label>
        <div className="flex items-center gap-2.5 rounded-lg border border-line bg-bg px-3 py-2.5 focus-within:border-accent">
          <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            id="ask"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => (touched.current = true)}
            placeholder="Ask about a tool or topic"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent font-mono text-[13px] outline-none placeholder:text-muted/70"
          />
          {typing && <span className="caret -ml-2 h-4 w-px bg-ink" aria-hidden="true" />}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Example questions">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className="rounded-full border border-line px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 min-h-[16.5rem] border-t border-line bg-sunken/40 px-5 py-4" aria-live="polite">
        {typing ? (
          <p className="text-sm text-muted">Retrieving…</p>
        ) : hits.length === 0 ? (
          <p className="text-sm text-muted">
            {query.trim()
              ? "No matches. Try a tool or topic, like Python, dashboards or NLP."
              : "Type a question, or pick an example above."}
          </p>
        ) : (
          <ol className="space-y-3.5" key={query}>
            {hits.map((h, i) => (
              <li key={h.doc.id} className="arrive" style={{ animationDelay: `${i * 90}ms` }}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted">{h.doc.kind}</span>
                  <span className="font-mono text-[11px] tabular-nums text-signal">{h.score.toFixed(2)}</span>
                </div>
                <Link href={h.doc.href} className="mt-0.5 block font-semibold leading-snug hover:text-accent">
                  {h.doc.title}
                </Link>
                <p className="mt-0.5 line-clamp-2 text-sm text-muted">{h.doc.snippet}</p>
                <div className="mt-2 h-0.5 rounded-full bg-line">
                  <div
                    className="grow h-full rounded-full bg-accent"
                    style={{ width: `${Math.max(8, h.relative * 100)}%`, animationDelay: `${i * 90 + 80}ms` }}
                  />
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
