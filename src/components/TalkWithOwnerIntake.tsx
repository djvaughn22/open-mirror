"use client";

// Intake for /talk-with-the-owner. Posts to /api/intake, which sends the
// message when RESEND_API_KEY is configured. If it isn't (or the send
// fails), the same click falls back to opening the visitor's email app
// prefilled — nothing pretends to have been sent.

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
  link: string;
};

const EMPTY: Fields = { name: "", email: "", creating: "", link: "" };

const REQUIRED: (keyof Fields)[] = ["name", "email", "creating"];

const LABELS: Record<keyof Fields, string> = {
  name: "Name",
  email: "Email",
  creating: "What are you trying to create or improve?",
  link: "Existing website or relevant link",
};

function buildEmailBody(f: Fields): string {
  return [
    `Name:\n${f.name.trim()}`,
    `Email:\n${f.email.trim()}`,
    `${LABELS.creating}\n${f.creating.trim()}`,
    f.link.trim() ? `Link:\n${f.link.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

// Native focus outline stays on: the light theme forces border-color with
// !important, so a border-only focus indicator would vanish there.
const inputClass =
  "w-full rounded-xl border border-[#26324c] bg-[#0b1220] px-4 py-3 text-sm font-semibold text-[#e8edf5] placeholder:text-[#64748b] focus:border-[#38BDF8]";
const labelClass = "mb-1.5 block text-xs font-black uppercase tracking-wider text-[#94a3b8]";

export default function TalkWithOwnerIntake() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto">("idle");
  const started = useRef(false);

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
          name: fields.name.trim(),
          email: fields.email.trim(),
          creating: fields.creating.trim(),
          link: fields.link.trim(),
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
    const subject = `Talk with the Owner — ${fields.name.trim()}`;
    window.location.href = `mailto:${SERVICE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildEmailBody(fields))}`;
    setStatus("mailto");
  }

  const err = (key: keyof Fields) =>
    errors[key] ? (
      <p role="alert" className="mt-1 text-xs font-bold text-[#f87171]">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="intake-name" className={labelClass}>
            {LABELS.name} *
          </label>
          <input
            id="intake-name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor="intake-email" className={labelClass}>
            {LABELS.email} *
          </label>
          <input
            id="intake-email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass}
          />
          {err("email")}
        </div>
      </div>

      <div>
        <label htmlFor="intake-creating" className={labelClass}>
          {LABELS.creating} *
        </label>
        <textarea
          id="intake-creating"
          rows={4}
          value={fields.creating}
          onChange={(e) => set("creating", e.target.value)}
          className={inputClass}
        />
        {err("creating")}
      </div>

      <div>
        <label htmlFor="intake-link" className={labelClass}>
          {LABELS.link}
        </label>
        <input
          id="intake-link"
          type="url"
          placeholder="https://"
          value={fields.link}
          onChange={(e) => set("link", e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 rounded-full bg-[#38BDF8] px-8 py-3.5 text-base font-black text-[#0C0C0C] disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>

      {status === "sent" && (
        <p role="status" className="text-center text-sm font-bold text-[#34D399]">
          Sent.
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
