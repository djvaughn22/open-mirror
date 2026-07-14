"use client";

// Intake for /work-with-the-founder. There is no form backend in this repo, so this
// stays honest: it validates, builds a clean email addressed to the real
// studio address, opens the visitor's mail app prefilled, and offers a
// copy-to-clipboard fallback. Nothing pretends to have been "sent".

import { useEffect, useRef, useState } from "react";
import { INTAKE_STAGES, SERVICE_EMAIL, offers } from "../lib/services";

// GA4 is loaded in the root layout; guard so the form works without it.
// Events carry only the offer label — never the intake text.
function track(event: string, params?: Record<string, string>) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", event, params ?? {});
}

type Fields = {
  name: string;
  email: string;
  project: string;
  creating: string;
  stage: string;
  link: string;
  offer: string;
  obstacle: string;
  outcome: string;
  deadline: string;
  heard: string;
};

const EMPTY: Fields = {
  name: "",
  email: "",
  project: "",
  creating: "",
  stage: "",
  link: "",
  offer: "",
  obstacle: "",
  outcome: "",
  deadline: "",
  heard: "",
};

const REQUIRED: (keyof Fields)[] = ["name", "email", "creating", "offer"];

const LABELS: Record<keyof Fields, string> = {
  name: "Name",
  email: "Email",
  project: "Business, organization, or project name",
  creating: "What are you trying to create or improve?",
  stage: "Current stage",
  link: "Existing website or relevant link",
  offer: "Which offer interests you?",
  obstacle: "Biggest current obstacle",
  outcome: "What would a great outcome look like?",
  deadline: "Any relevant deadline",
  heard: "How did you hear about Open Mirror?",
};

function buildEmailBody(f: Fields): string {
  const line = (key: keyof Fields) => {
    if (!f[key].trim()) return "";
    const label = LABELS[key].endsWith("?") ? LABELS[key] : `${LABELS[key]}:`;
    return `${label}\n${f[key].trim()}\n`;
  };
  return [
    "Work with the Founder — intake",
    "",
    line("name"),
    line("email"),
    line("project"),
    line("offer"),
    line("creating"),
    line("stage"),
    line("link"),
    line("obstacle"),
    line("outcome"),
    line("deadline"),
    line("heard"),
  ]
    .filter(Boolean)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Native focus outline stays on: the light theme forces border-color with
// !important, so a border-only focus indicator would vanish there.
const inputClass =
  "w-full rounded-xl border border-[#26324c] bg-[#0b1220] px-4 py-3 text-sm font-semibold text-[#e8edf5] placeholder:text-[#64748b] focus:border-[#38BDF8]";
const labelClass = "mb-1.5 block text-xs font-black uppercase tracking-wider text-[#94a3b8]";

export default function WorkWithFounderIntake() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [composed, setComposed] = useState<string | null>(null);
  const [copied, setCopied] = useState<"ok" | "fail" | null>(null);
  const started = useRef(false);
  const composedRef = useRef<HTMLTextAreaElement | null>(null);

  // Offer cards up the page carry data-offer buttons; clicking one preselects
  // that offer here and jumps to the form. Keeps the offer section server-rendered.
  useEffect(() => {
    const onClick = (e: Event) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-offer]");
      if (!el?.dataset.offer) return;
      setFields((f) => ({ ...f, offer: el.dataset.offer! }));
      track("select_offer", { offer: el.dataset.offer! });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function set(key: keyof Fields, value: string) {
    if (!started.current) {
      started.current = true;
      track("begin_intake");
    }
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
    setComposed(null);
    setCopied(null);
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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const body = buildEmailBody(fields);
    setComposed(body);
    track("intake_email_opened", { offer: fields.offer });
    const subject = `Work with the Founder — ${fields.offer} — ${fields.name.trim()}`;
    window.location.href = `mailto:${SERVICE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function copyToClipboard() {
    if (!composed) return;
    track("intake_copied", { offer: fields.offer });
    try {
      await navigator.clipboard.writeText(
        `To: ${SERVICE_EMAIL}\nSubject: Work with the Founder — ${fields.offer} — ${fields.name.trim()}\n\n${composed}`
      );
      setCopied("ok");
    } catch {
      // Clipboard API can be unavailable — select the text so a manual copy works.
      composedRef.current?.focus();
      composedRef.current?.select();
      setCopied("fail");
    }
  }

  const err = (key: keyof Fields) =>
    errors[key] ? (
      <p role="alert" className="mt-1 text-xs font-bold text-[#f87171]">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <p className="text-sm font-semibold leading-6 text-[#94a3b8]">
        No form backend, no account, no spam list. When you hit the button, this
        opens in your own email app — filled in and addressed to{" "}
        <span className="font-black text-[#e8edf5]">{SERVICE_EMAIL}</span> — so
        you can read it over and send it yourself.
      </p>

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
        <label htmlFor="intake-project" className={labelClass}>
          {LABELS.project}
        </label>
        <input
          id="intake-project"
          type="text"
          value={fields.project}
          onChange={(e) => set("project", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="intake-offer" className={labelClass}>
          {LABELS.offer} *
        </label>
        <select
          id="intake-offer"
          value={fields.offer}
          onChange={(e) => set("offer", e.target.value)}
          className={inputClass}
        >
          <option value="">Choose one…</option>
          {offers.map((o) => (
            <option key={o.id} value={o.name}>
              {o.name} — {o.price}
            </option>
          ))}
          <option value="Not sure yet">Not sure yet — tell me what fits</option>
        </select>
        {err("offer")}
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="intake-stage" className={labelClass}>
            {LABELS.stage}
          </label>
          <select
            id="intake-stage"
            value={fields.stage}
            onChange={(e) => set("stage", e.target.value)}
            className={inputClass}
          >
            <option value="">Choose one…</option>
            {INTAKE_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
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
      </div>

      <div>
        <label htmlFor="intake-obstacle" className={labelClass}>
          {LABELS.obstacle}
        </label>
        <textarea
          id="intake-obstacle"
          rows={2}
          value={fields.obstacle}
          onChange={(e) => set("obstacle", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="intake-outcome" className={labelClass}>
          {LABELS.outcome}
        </label>
        <textarea
          id="intake-outcome"
          rows={2}
          value={fields.outcome}
          onChange={(e) => set("outcome", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="intake-deadline" className={labelClass}>
            {LABELS.deadline}
          </label>
          <input
            id="intake-deadline"
            type="text"
            value={fields.deadline}
            onChange={(e) => set("deadline", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="intake-heard" className={labelClass}>
            {LABELS.heard}
          </label>
          <input
            id="intake-heard"
            type="text"
            value={fields.heard}
            onChange={(e) => set("heard", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-1 rounded-full bg-[#38BDF8] px-8 py-3.5 text-base font-black text-[#0C0C0C]"
      >
        Open this in my email app →
      </button>

      {composed && (
        <div className="rounded-2xl border border-[#26324c] bg-[#0b1220] p-5">
          <p className="mb-3 text-sm font-bold leading-6 text-[#e8edf5]">
            Your email app should have opened with everything below. If it
            didn&apos;t, copy this and send it to{" "}
            <a href={`mailto:${SERVICE_EMAIL}`} className="font-black text-[#7dd3fc]">
              {SERVICE_EMAIL}
            </a>
            .
          </p>
          <textarea
            ref={composedRef}
            readOnly
            value={composed}
            rows={10}
            aria-label="Your intake, ready to copy"
            className="w-full rounded-xl border border-[#26324c] bg-[#141d2e] p-4 font-mono text-xs leading-5 text-[#94a3b8]"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copyToClipboard}
              className="rounded-full border border-[#26324c] bg-[#141d2e] px-6 py-2.5 text-sm font-black text-[#e8edf5] transition hover:border-[#38BDF8]"
            >
              Copy to clipboard
            </button>
            {copied === "ok" && (
              <span role="status" className="text-sm font-bold text-[#34D399]">
                Copied — paste it into an email to {SERVICE_EMAIL}
              </span>
            )}
            {copied === "fail" && (
              <span role="status" className="text-sm font-bold text-[#94a3b8]">
                Couldn&apos;t reach your clipboard — the text is selected above, copy it manually.
              </span>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
