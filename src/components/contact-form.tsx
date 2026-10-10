"use client";

import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { contact, site } from "@/content/site";

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const EMPTY: Fields = { name: "", email: "", subject: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Enter your name.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter a valid email address, like name@company.com.";
  if (f.subject.trim().length < 3) e.subject = "Add a short subject.";
  if (f.message.trim().length < 20) e.message = "Write at least 20 characters so I know how I can help.";
  return e;
}

export function ContactForm() {
  const configured = contact.web3formsKey.length > 0;
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const set = (k: keyof Fields) => (v: string) => {
    setFields((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(fields.subject || "Hello from your portfolio")}&body=${encodeURIComponent(
    [fields.message, fields.name && `\n— ${fields.name}`].filter(Boolean).join("\n"),
  )}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    if (!configured) return;
    const honeypot = (e.currentTarget.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked;
    if (honeypot) return;

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: contact.web3formsKey,
          from_name: "Portfolio contact form",
          subject: `Portfolio: ${fields.subject.trim()}`,
          name: fields.name.trim(),
          email: fields.email.trim(),
          message: fields.message.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) throw new Error(data.message || `Request failed (${res.status})`);
      setStatus({ kind: "sent" });
      setFields(EMPTY);
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "The message couldn't be sent.",
      });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-line bg-surface p-8">
        <CheckCircle2 className="size-6 text-accent" aria-hidden="true" />
        <p className="mt-4 text-lg font-semibold">Message sent</p>
        <p className="mt-1 text-muted">Thanks for reaching out. I&apos;ll reply to the email address you gave.</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-6 rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  const input =
    "mt-1.5 w-full rounded-lg border bg-surface px-3.5 py-2.5 outline-none transition-colors placeholder:text-muted/60 focus:border-accent";
  const field = (k: keyof Fields, label: string, el: "input" | "textarea", type = "text", auto?: string) => (
    <div className={k === "message" || k === "subject" ? "sm:col-span-2" : ""}>
      <label htmlFor={`cf-${k}`} className="text-sm font-medium">
        {label}
      </label>
      {el === "input" ? (
        <input
          id={`cf-${k}`}
          name={k}
          type={type}
          autoComplete={auto}
          value={fields[k]}
          onChange={(e) => set(k)(e.target.value)}
          aria-invalid={Boolean(errors[k])}
          aria-describedby={errors[k] ? `cf-${k}-err` : undefined}
          className={`${input} ${errors[k] ? "border-red-500" : "border-line"}`}
        />
      ) : (
        <textarea
          id={`cf-${k}`}
          name={k}
          rows={6}
          value={fields[k]}
          onChange={(e) => set(k)(e.target.value)}
          aria-invalid={Boolean(errors[k])}
          aria-describedby={errors[k] ? `cf-${k}-err` : undefined}
          className={`${input} resize-y ${errors[k] ? "border-red-500" : "border-line"}`}
        />
      )}
      {errors[k] && (
        <p id={`cf-${k}-err`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="rounded-2xl border border-line bg-surface/60 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Name", "input", "text", "name")}
        {field("email", "Email", "input", "email", "email")}
        {field("subject", "Subject", "input", "text", "off")}
        {field("message", "Message", "textarea")}
      </div>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {status.kind === "error" && (
        <p role="alert" className="mt-5 flex gap-2 rounded-lg border border-red-500/40 bg-red-500/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
          <span>
            The message wasn&apos;t sent: {status.message}. Try again, or email me at{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>
            .
          </span>
        </p>
      )}

      {configured ? (
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {status.kind === "sending" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
      ) : (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={mailto}
            onClick={(e) => {
              // An empty form just opens a blank email; a partly filled one is validated first.
              if (Object.values(fields).every((v) => v.trim() === "")) return;
              const found = validate(fields);
              delete found.email; // the email app supplies the sender address
              setErrors(found);
              if (Object.keys(found).length) e.preventDefault();
            }}
            className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-bg transition-opacity hover:opacity-85"
          >
            Open in my email app
          </a>
          <p className="text-sm text-muted">This form opens your email app with your message filled in.</p>
        </div>
      )}
    </form>
  );
}
