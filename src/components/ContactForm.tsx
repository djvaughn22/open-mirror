"use client";

// Intake for /contact. Five fields, one Send button. Posts to /api/intake,
// which sends the message when RESEND_API_KEY is configured. If it isn't (or
// the send fails), the same click falls back to opening the visitor's email
// app prefilled — nothing pretends to have been sent.

import { useRef, useState } from "react";
import { SERVICE_EMAIL } from "../lib/services";

// GA4 is loaded in the root layout; guard so the form works without it.
// Events carry no intake text.
function track(event: string) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", event, {});
}

type Fields = {
  name: string;
  email: string;
  creating: string;
  done: string;
  stuck: string;
};

const EMPTY: Fields = {
  name: "",
  email: "",
  creating: "",
  done: "",
  stuck: "",
};

const REQUIRED: (keyof Fields)[] = ["name", "email", "creating"];

const LABELS: Record<keyof Fields, string> = {
  name: "Name",
  email: "Email",
  creating: "What do you want to build?",
  done: "What already exists?",
  stuck: "Where are you stuck?",
};

const FIELD_ORDER: (keyof Fields)[] = ["name", "email", "creating", "done", "stuck"];

function buildEmailBody(f: Fields): string {
  const line = (key: keyof Fields) =>
    f[key].trim() ? `${LABELS[key]}\n${f[key].trim()}` : "";
  return FIELD_ORDER.map(line).filter(Boolean).join("\n\n");
}

// Native focus outline stays on: the light theme forces border-color with
// !important, so a border-only focus indicator would vanish there.
const inputClass =
  "w-full rounded-xl border border-[#26324c] bg-[#0b1220] px-4 py-3 text-sm font-semibold text-[#e8edf5] placeholder:text-[#64748b] focus:border-[#38BDF8]";
const labelClass = "mb-1.5 block text-xs font-black uppercase tracking-wider text-[#94a3b8]";

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto">("idle");
  const started = useRef(false);
  // Honeypot: real users never see or fill this; bots that fill every field
  // will. Its value is sent as `company` and the server drops those quietly.
  const honeypot = useRef<HTMLInputElement | null>(null);

  function set(key: keyof Fields, value: string) {
    if (!started.current) {
      started.current = true;
      track("begin_intake");
    }
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
    setStatus((s) => (s === "idle" || s === "sending" ? s : "idle"));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Fields, string>> = {};
    for (const key of REQUIRED) {
      if (!fields[key].trim()) next[key] = "Required";
    }
    if (fields.email.trim() && !/^\S+@\S+\.\S+$/.test(fields.email.trim())) {
      next.email = "Enter a valid email address";
    }
    setErrors(next);
    const firstBad = REQUIRED.find((k) => next[k]) ?? (next.email ? "email" : undefined);
    if (firstBad) document.getElementById(`intake-${firstBad}`)?.focus();
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending" || !validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(
            Object.entries(fields).map(([k, v]) => [k, v.trim()])
          ),
          company: honeypot.current?.value ?? "",
        }),
      });
      if (res.ok) {
        track("intake_sent");
        setStatus("sent");
        return;
      }
    } catch {
      // Fall through to the email-app fallback below.
    }
    track("intake_email_opened");
    const subject = `Open Mirror — ${fields.name.trim()}`;
    window.location.href = `mailto:${SERVICE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildEmailBody(fields))}`;
    setStatus("mailto");
  }

  const err = (key: keyof Fields) =>
    errors[key] ? (
      <p role="alert" className="mt-1 text-xs font-bold text-[#f87171]">
        {errors[key]}
      </p>
    ) : null;

  const textField = (key: keyof Fields, required: boolean, rows?: number) => (
    <div>
      <label htmlFor={`intake-${key}`} className={labelClass}>
        {LABELS[key]}
        {required ? " *" : ""}
      </label>
      {rows ? (
        <textarea
          id={`intake-${key}`}
          rows={rows}
          value={fields[key]}
          onChange={(e) => set(key, e.target.value)}
          className={inputClass}
        />
      ) : (
        <input
          id={`intake-${key}`}
          type={key === "email" ? "email" : "text"}
          autoComplete={key === "name" ? "name" : key === "email" ? "email" : "off"}
          value={fields[key]}
          onChange={(e) => set(key, e.target.value)}
          className={inputClass}
        />
      )}
      {err(key)}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-5">
      {/* Honeypot — hidden from people, tempting to bots. Off-screen rather
          than display:none so more bots still fill it. Never focusable. */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="intake-company">Company (leave blank)</label>
        <input
          id="intake-company"
          ref={honeypot}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {textField("name", true)}
        {textField("email", true)}
      </div>

      {textField("creating", true, 3)}
      {textField("done", false, 2)}
      {textField("stuck", false, 2)}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 rounded-full bg-[#38BDF8] px-8 py-3.5 text-base font-black text-[#0C0C0C] disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send a project inquiry"}
      </button>

      {status === "sent" && (
        <p role="status" className="text-center text-sm font-bold text-[#34D399]">
          Sent. If it&apos;s a good fit, you&apos;ll hear back.
        </p>
      )}
      {status === "mailto" && (
        <p role="status" className="text-center text-sm font-semibold text-[#94a3b8]">
          Your email app opened with the message. If it didn&apos;t, send it to{" "}
          <a href={`mailto:${SERVICE_EMAIL}`} className="font-black text-[#7dd3fc]">
            {SERVICE_EMAIL}
          </a>
          .
        </p>
      )}
    </form>
  );
}
