"use client";

// Partnership intake — three short steps, then confirm by emailed code.
//
// The browser validates each step so people see problems early; the server
// validates again and is the only check that counts. The inquiry reaches the
// owner only after the six-digit code sent to the visitor's address is
// entered — there is no path around that. When online sending is not
// configured, the same answers go out through the visitor's own email app,
// and the page says so plainly; it never pretends a code was sent.
//
// Never add fields for amounts, proof of funds, or financial details.

import { useEffect, useRef, useState } from "react";

import {
  buildInquirySummaryText,
  FIELD_LABELS,
  PARTNERSHIP_LIMITS as L,
  STEPS,
  stepErrors,
  validatePartnershipInquiry,
  WAYS,
  type PartnershipField,
  type Way,
} from "../../lib/partnership";

type Values = {
  name: string;
  email: string;
  role: string;
  firm: string;
  profileUrl: string;
  experience: string;
  ways: Way[];
  otherWay: string;
  resonates: string;
};

const EMPTY: Values = {
  name: "",
  email: "",
  role: "",
  firm: "",
  profileUrl: "",
  experience: "",
  ways: [],
  otherWay: "",
  resonates: "",
};

type Errors = Partial<Record<PartnershipField, string>>;

type Verify =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "code"; token: string; sentTo: string; sentAt: number }
  | { kind: "checking"; token: string; sentTo: string; sentAt: number };

type Done =
  | { kind: "sent"; reference: string | null; email: string; firstName: string }
  | { kind: "mail-app"; text: string };

const PROGRESS = [...STEPS.map((s) => s.short), "Confirm"];
const CONFIRM_STEP = STEPS.length;
const RESEND_SECONDS = 30;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]";
const primaryBtn = `inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-sm font-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;
const secondaryBtn = `inline-flex min-h-12 items-center justify-center rounded-full border border-[#26324c] px-6 py-3 text-sm font-black text-[#e8edf5] transition hover:border-[#7dd3fc] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;
const linkBtn = `text-sm font-black text-[#7dd3fc] underline-offset-4 hover:underline ${focusRing}`;
const accent = { background: "var(--om-accent)", color: "var(--om-ink)" };

function fieldClasses(invalid: boolean) {
  return `w-full rounded-xl border bg-[#0f1826] px-3.5 py-3 text-base font-semibold text-[#e8edf5] outline-none focus-visible:border-[#7dd3fc] focus-visible:ring-2 focus-visible:ring-[#7dd3fc]/40 ${
    invalid ? "border-[#f59e0b]" : "border-[#26324c]"
  }`;
}

function Hint({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <span id={id} className="mt-1.5 block text-xs font-semibold leading-5 text-[#64748b]">
      {children}
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} className="mt-1.5 block text-xs font-bold leading-5 text-[#f59e0b]">
      {message}
    </span>
  );
}

const firstNameOf = (name: string) => name.trim().split(/\s+/)[0] ?? "";

// Read the clock only from handlers and timers, never while rendering.
const clock = () => Date.now();

export default function PartnershipForm({
  initiallyOnline,
  fallbackEmail,
}: {
  initiallyOnline: boolean;
  fallbackEmail: string;
}) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [step, setStep] = useState(0);
  const [returnToReview, setReturnToReview] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypot] = useState("");
  const [online, setOnline] = useState(initiallyOnline);
  const [stamp, setStamp] = useState<string | null>(null);
  const [verify, setVerify] = useState<Verify>({ kind: "idle" });
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [now, setNow] = useState(0);
  const [copied, setCopied] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const moved = useRef(false);

  const announce = (message: string) => {
    if (liveRef.current) liveRef.current.textContent = message;
  };

  async function loadStamp(): Promise<string | null> {
    try {
      const res = await fetch("/api/partnership", { cache: "no-store" });
      const json = (await res.json()) as { enabled?: boolean; stamp?: string | null };
      setOnline(Boolean(json.enabled));
      setStamp(json.stamp ?? null);
      return json.stamp ?? null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    // The signed "page opened" time the server checks before sending a code.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one fetch on mount
    void loadStamp();
  }, []);

  // Move focus to the new step's heading — but never on first load, so the
  // page doesn't jump to the form before anyone touches it.
  useEffect(() => {
    if (!moved.current) return;
    headingRef.current?.focus();
  }, [step, done]);

  // When a code has just been sent, put the cursor in the code box.
  const codeSentAt = verify.kind === "code" ? verify.sentAt : 0;
  useEffect(() => {
    if (codeSentAt) codeRef.current?.focus();
  }, [codeSentAt]);

  // Tick once a second only while the "send a new code" wait is running.
  const sentAt = verify.kind === "code" || verify.kind === "checking" ? verify.sentAt : 0;
  const waitLeft = sentAt ? Math.max(0, RESEND_SECONDS - Math.floor((now - sentAt) / 1000)) : 0;
  useEffect(() => {
    if (!sentAt) return;
    const id = window.setInterval(() => {
      const t = clock();
      setNow(t);
      if (t - sentAt > RESEND_SECONDS * 1000) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [sentAt]);

  const set = (key: Exclude<PartnershipField, "ways">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
      // A code proves one address. A new address needs a new code.
      if (key === "email" && verify.kind !== "idle") {
        setVerify({ kind: "idle" });
        setCode("");
      }
    };

  const toggleWay = (way: Way) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValues((prev) => ({
      ...prev,
      ways: checked ? [...prev.ways, way] : prev.ways.filter((w) => w !== way),
    }));
    setErrors((prev) => ({ ...prev, ways: undefined, ...(way === "Other" ? { otherWay: undefined } : {}) }));
  };

  function goTo(next: number) {
    moved.current = true;
    setNotice(null);
    setStep(next);
  }

  function focusFirstError(errs: Errors) {
    const first = Object.keys(errs)[0];
    if (!first) return;
    setTimeout(() => {
      const el = document.getElementById(first === "ways" ? "f-ways-0" : `f-${first}`);
      el?.focus();
    }, 0);
  }

  function onContinue(e: React.FormEvent) {
    e.preventDefault();
    const errs = stepErrors(step, values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      announce(
        `${Object.keys(errs).length === 1 ? "One answer needs" : "A few answers need"} another look before continuing.`
      );
      focusFirstError(errs);
      return;
    }
    setErrors({});
    const next = returnToReview ? CONFIRM_STEP : step + 1;
    if (next === CONFIRM_STEP) setReturnToReview(false);
    goTo(next);
  }

  function edit(index: number) {
    setReturnToReview(true);
    goTo(index);
  }

  function payload(extra: Record<string, unknown>) {
    return { ...values, website: honeypot, stamp, ...extra };
  }

  async function post(body: Record<string, unknown>) {
    const res = await fetch("/api/partnership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await res.json().catch(() => null)) as
      | {
          ok: true;
          stage: "code_sent" | "sent";
          token?: string;
          sentTo?: string;
          reference?: string;
        }
      | {
          ok: false;
          error: {
            code: string;
            message: string;
            fieldErrors?: Errors;
            attemptsLeft?: number;
          };
        }
      | null;
  }

  function showServerFieldErrors(fieldErrors: Errors) {
    setErrors(fieldErrors);
    const firstStep = STEPS.findIndex((s) => s.fields.some((f) => fieldErrors[f]));
    setReturnToReview(true);
    goTo(firstStep >= 0 ? firstStep : 0);
    announce("A few answers need another look.");
    focusFirstError(fieldErrors);
  }

  const offlineMessage =
    "Online sending isn't switched on yet. Your answers are still here — you can send them from your own email instead.";

  async function requestCode() {
    if (verify.kind === "sending" || verify.kind === "checking") return;
    setNotice(null);
    setCodeError(null);
    const previous = verify;
    setVerify({ kind: "sending" });
    announce("Sending a code…");
    try {
      const json = await post(payload({ action: "start" }));
      if (json?.ok && json.stage === "code_sent" && json.token) {
        const at = clock();
        setVerify({ kind: "code", token: json.token, sentTo: json.sentTo ?? values.email, sentAt: at });
        setNow(at);
        setCode("");
        announce(`A code is on its way to ${json.sentTo ?? values.email}.`);
        return;
      }
      setVerify(previous.kind === "code" ? previous : { kind: "idle" });
      const err = json && !json.ok ? json.error : null;
      if (err?.code === "validation" && err.fieldErrors) return showServerFieldErrors(err.fieldErrors);
      if (err?.code === "unconfigured") {
        setOnline(false);
        setNotice(offlineMessage);
        return;
      }
      if (err?.code === "stale_page") void loadStamp();
      setNotice(err?.message ?? "Something went wrong on our side. Your answers are still here — please try again.");
      announce(err?.message ?? "The code was not sent.");
    } catch {
      setVerify(previous.kind === "code" ? previous : { kind: "idle" });
      setNotice("Couldn't reach Open Mirror. Check your connection and try again — your answers are still here.");
    }
  }

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (verify.kind !== "code") return;
    const digits = code.replace(/\D/g, "");
    if (digits.length !== L.codeLength) {
      setCodeError(`Enter the ${L.codeLength}-digit code from the email.`);
      codeRef.current?.focus();
      return;
    }
    setCodeError(null);
    setNotice(null);
    const current = verify;
    setVerify({ ...current, kind: "checking" });
    announce("Checking the code…");
    try {
      const json = await post(payload({ action: "verify", token: current.token, code: digits }));
      if (json?.ok && json.stage === "sent") {
        moved.current = true;
        setDone({
          kind: "sent",
          reference: json.reference ?? null,
          email: values.email,
          firstName: firstNameOf(values.name),
        });
        announce("Thank you. Your note was sent.");
        return;
      }
      const err = json && !json.ok ? json.error : null;
      switch (err?.code) {
        case "wrong_code":
          if ((err.attemptsLeft ?? 0) > 0) {
            setVerify(current);
            setCodeError(err.message);
            setTimeout(() => codeRef.current?.select(), 0);
          } else {
            setVerify({ kind: "idle" });
            setNotice(err.message);
          }
          return;
        case "already_sent":
          moved.current = true;
          setDone({ kind: "sent", reference: null, email: values.email, firstName: firstNameOf(values.name) });
          return;
        case "code_expired":
        case "email_changed":
        case "too_many_attempts":
          setVerify({ kind: "idle" });
          setCode("");
          setNotice(err.message);
          return;
        case "validation":
          setVerify(current);
          if (err.fieldErrors) showServerFieldErrors(err.fieldErrors);
          return;
        case "unconfigured":
          setVerify({ kind: "idle" });
          setOnline(false);
          setNotice(offlineMessage);
          return;
        default:
          setVerify(current);
          setNotice(err?.message ?? "Something went wrong on our side. Your answers are still here — please try again.");
      }
    } catch {
      setVerify(current);
      setNotice("Couldn't reach Open Mirror. Check your connection and try again — your answers are still here.");
    }
  }

  function sendWithMailApp() {
    const validated = validatePartnershipInquiry(values);
    if (!validated.ok) return showServerFieldErrors(validated.fieldErrors as Errors);
    const text = buildInquirySummaryText(validated.data);
    moved.current = true;
    setDone({ kind: "mail-app", text });
    window.location.assign(
      `mailto:${fallbackEmail}?subject=${encodeURIComponent(
        `Partnership — ${validated.data.name}, ${validated.data.firm}`
      )}&body=${encodeURIComponent(text)}`
    );
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      announce("Copied.");
    } catch {
      setCopied(false);
    }
  }

  // Screen-reader announcements. Rendered first and identically in every view:
  // announce() writes into it directly, so React must never reuse this node
  // for visible text.
  const live = <p ref={liveRef} aria-live="polite" role="status" className="sr-only" />;

  // ── Finished ──────────────────────────────────────────────────────────────

  if (done?.kind === "sent") {
    return (
      <>
        {live}
        <div key="sent" className="rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#34d399]">Sent</p>
          <h3 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-black tracking-tight outline-none">
            Thank you{done.firstName ? `, ${done.firstName}` : ""}.
          </h3>
          <p className="mt-3 text-pretty text-base font-semibold leading-8 text-[#94a3b8]">
            Your note is with Open Mirror, and it will be read personally. If there seems to be a fit,
            you&apos;ll get a reply at <span className="font-black text-[#e8edf5]">{done.email}</span>.
          </p>
          {done.reference && (
            <p className="mt-4 text-sm font-semibold text-[#64748b]">
              Reference <span className="font-mono font-black text-[#94a3b8]">{done.reference}</span>
            </p>
          )}
          <p className="mt-6">
            <a href="/about-open-mirror" className={linkBtn}>
              Back to About Open Mirror
            </a>
          </p>
        </div>
      </>
    );
  }

  if (done?.kind === "mail-app") {
    return (
      <>
        {live}
        <div key="mail-app" className="rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 sm:p-7">
          <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-black tracking-tight outline-none">
            Finish in your email app
          </h3>
          <p className="mt-3 text-pretty text-base font-semibold leading-8 text-[#94a3b8]">
            Your email app should have opened with your note filled in — press send there and it&apos;s on
            its way. If it didn&apos;t open, copy the text below and email it to{" "}
            <a href={`mailto:${fallbackEmail}`} className="font-black text-[#7dd3fc] underline underline-offset-4">
              {fallbackEmail}
            </a>
            .
          </p>
          <label className="mt-5 block">
            <span className="mb-1.5 block text-xs font-bold text-[#94a3b8]">Your note</span>
            <textarea readOnly rows={10} value={done.text} className={`${fieldClasses(false)} font-mono text-sm`} />
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => copyText(done.text)} className={secondaryBtn}>
              {copied ? "Copied" : "Copy the text"}
            </button>
            <button type="button" onClick={() => setDone(null)} className={secondaryBtn}>
              Back to my answers
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Steps ─────────────────────────────────────────────────────────────────

  const onConfirm = step === CONFIRM_STEP;
  const busy = verify.kind === "sending" || verify.kind === "checking";

  function textField(
    key: Exclude<PartnershipField, "ways">,
    opts: {
      hint?: string;
      type?: string;
      autoComplete?: string;
      inputMode?: "email" | "url" | "text";
      max: number;
      rows?: number;
    }
  ) {
    const err = errors[key];
    const describedBy = [opts.hint ? `h-${key}` : "", err ? `e-${key}` : ""].filter(Boolean).join(" ") || undefined;
    const common = {
      id: `f-${key}`,
      name: key,
      value: values[key],
      onChange: set(key),
      maxLength: opts.max,
      "aria-invalid": err ? true : undefined,
      "aria-describedby": describedBy,
      className: fieldClasses(Boolean(err)),
    } as const;
    return (
      <div>
        <label htmlFor={`f-${key}`} className="mb-1.5 block text-sm font-bold text-[#e8edf5]">
          {FIELD_LABELS[key]}
        </label>
        {opts.rows ? (
          <textarea {...common} rows={opts.rows} />
        ) : (
          <input
            {...common}
            type={opts.type ?? "text"}
            autoComplete={opts.autoComplete}
            inputMode={opts.inputMode}
            spellCheck={opts.type === "email" || opts.inputMode === "url" ? false : undefined}
            autoCapitalize={opts.type === "email" || opts.inputMode === "url" ? "none" : undefined}
          />
        )}
        {opts.hint && <Hint id={`h-${key}`}>{opts.hint}</Hint>}
        <FieldError id={`e-${key}`} message={err} />
      </div>
    );
  }

  const summaryRows: { label: string; value: string }[][] = [
    [
      { label: "Name", value: values.name },
      { label: "Work email", value: values.email },
      { label: "Role", value: values.role },
      { label: "Firm", value: values.firm },
    ],
    [
      { label: "Profile", value: values.profileUrl },
      { label: "Experience", value: values.experience },
    ],
    [
      {
        label: "Interested in",
        value: values.ways
          .map((w) => (w === "Other" && values.otherWay ? `Other: ${values.otherWay}` : w))
          .join(", "),
      },
      { label: "What resonates", value: values.resonates },
    ],
  ];

  return (
    <>
      {live}
      <div key="steps" className="rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 sm:p-7">
        {/* Progress: four short labels and bars; the current one is marked. */}
        <ol className="grid grid-cols-4 gap-2" aria-label="Progress">
          {PROGRESS.map((label, i) => (
            <li key={label} aria-current={i === step ? "step" : undefined}>
              <span
                aria-hidden
                className="block h-1.5 rounded-full"
                style={{ background: i <= step ? "var(--om-accent)" : "var(--om-border)" }}
              />
              <span
                className={`mt-2 block whitespace-nowrap text-[10px] font-black uppercase tracking-normal sm:text-[11px] sm:tracking-[0.08em] ${
                  i === step ? "text-[#e8edf5]" : "text-[#64748b]"
                }`}
              >
                {label}
                <span className="sr-only">
                  {i < step ? " (done)" : i === step ? " (current step)" : ""}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs font-bold text-[#64748b]">
          Step {step + 1} of {PROGRESS.length}
        </p>

        {!onConfirm && (
          <form onSubmit={onContinue} noValidate className="mt-1">
            <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-black tracking-tight outline-none">
              {STEPS[step].title}
            </h3>

            {/* Honeypot — invisible to people, tempting to bots. */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-5">
              {step === 0 && (
                <>
                  {textField("name", { autoComplete: "name", max: L.name })}
                  {textField("email", {
                    type: "email",
                    autoComplete: "email",
                    inputMode: "email",
                    max: L.email,
                    hint: "A code goes here to confirm it's you before anything is sent.",
                  })}
                  {textField("role", { autoComplete: "organization-title", max: L.role, hint: "For example: Managing Partner, Operating Partner, Advisor." })}
                  {textField("firm", { autoComplete: "organization", max: L.firm, hint: "“Independent” is fine." })}
                </>
              )}

              {step === 1 && (
                <>
                  {textField("profileUrl", {
                    type: "url",
                    inputMode: "url",
                    autoComplete: "url",
                    max: L.url,
                    hint: "Your firm's site or a professional profile, such as LinkedIn.",
                  })}
                  {textField("experience", {
                    rows: 5,
                    max: L.experience,
                    hint: "A few lines is plenty — the kinds of companies you've backed or built, and the work you know best. Please leave out figures, fund sizes, and personal financial details.",
                  })}
                </>
              )}

              {step === 2 && (
                <>
                  <fieldset aria-describedby={errors.ways ? "h-ways e-ways" : "h-ways"}>
                    <legend className="text-sm font-bold text-[#e8edf5]">{FIELD_LABELS.ways}</legend>
                    <Hint id="h-ways">Choose any that fit.</Hint>
                    <div className="mt-3 flex flex-col gap-2">
                      {WAYS.map((w, i) => {
                        const checked = values.ways.includes(w.value);
                        return (
                          <label
                            key={w.value}
                            htmlFor={`f-ways-${i}`}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
                              checked ? "border-[#7dd3fc] bg-[#0f1826]" : "border-[#26324c]"
                            }`}
                          >
                            <input
                              id={`f-ways-${i}`}
                              type="checkbox"
                              checked={checked}
                              onChange={toggleWay(w.value)}
                              aria-invalid={errors.ways ? true : undefined}
                              className="mt-0.5 h-5 w-5 shrink-0 accent-[#7dd3fc]"
                            />
                            <span>
                              <span className="block text-sm font-black text-[#e8edf5]">{w.value}</span>
                              <span className="block text-xs font-semibold leading-5 text-[#94a3b8]">{w.hint}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <FieldError id="e-ways" message={errors.ways} />
                  </fieldset>
                  {values.ways.includes("Other") && textField("otherWay", { max: L.otherWay })}
                  {textField("resonates", {
                    rows: 4,
                    max: L.resonates,
                    hint: "A sentence or two is enough.",
                  })}
                </>
              )}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
              {step > 0 ? (
                <button type="button" onClick={() => goTo(step - 1)} className={secondaryBtn}>
                  Back
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className={primaryBtn} style={accent}>
                {returnToReview ? "Back to review" : step === STEPS.length - 1 ? "Review" : "Continue"}
              </button>
            </div>
          </form>
        )}

        {onConfirm && (
          <div className="mt-1">
            <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-black tracking-tight outline-none">
              Review and send
            </h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#94a3b8]">
              Here&apos;s what you wrote. Change anything you like.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {STEPS.map((s, i) => (
                <section key={s.key} aria-label={s.title} className="rounded-xl border border-[#26324c] bg-[#0f1826] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-black text-[#e8edf5]">{s.title}</h4>
                    <button
                      type="button"
                      onClick={() => edit(i)}
                      className={`${linkBtn} min-h-11 px-2`}
                      aria-label={`Edit: ${s.title}`}
                    >
                      Edit
                    </button>
                  </div>
                  <dl className="mt-2 flex flex-col gap-2">
                    {summaryRows[i].map((row) => (
                      <div key={row.label}>
                        <dt className="text-[11px] font-black uppercase tracking-[0.08em] text-[#64748b]">{row.label}</dt>
                        <dd className="whitespace-pre-line break-words text-sm font-semibold leading-6 text-[#94a3b8]">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>

            {notice && (
              <p role="alert" className="mt-5 rounded-xl border border-[#f59e0b]/50 bg-[#1c1608] px-4 py-3 text-sm font-bold leading-6 text-[#f59e0b]">
                {notice}
              </p>
            )}

            {online ? (
              verify.kind === "code" || verify.kind === "checking" ? (
                <form onSubmit={confirm} noValidate className="mt-6">
                  <p className="text-sm font-semibold leading-6 text-[#94a3b8]">
                    A code is on its way to{" "}
                    <span className="font-black text-[#e8edf5]">{verify.sentTo}</span>. It works for 15
                    minutes. Your note is sent once you enter it.
                  </p>
                  <label htmlFor="f-code" className="mt-4 mb-1.5 block text-sm font-bold text-[#e8edf5]">
                    6-digit code
                  </label>
                  <input
                    ref={codeRef}
                    id="f-code"
                    name="code"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/\D/g, "").slice(0, L.codeLength));
                      setCodeError(null);
                    }}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    maxLength={L.codeLength}
                    aria-invalid={codeError ? true : undefined}
                    aria-describedby={codeError ? "e-code" : undefined}
                    className={`${fieldClasses(Boolean(codeError))} max-w-[14rem] text-center font-mono text-2xl tracking-[0.4em]`}
                  />
                  <FieldError id="e-code" message={codeError ?? undefined} />
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={verify.kind === "checking"}
                      aria-busy={verify.kind === "checking" || undefined}
                      className={primaryBtn}
                      style={accent}
                    >
                      {verify.kind === "checking" ? "Sending…" : "Confirm and send"}
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                    <button type="button" onClick={requestCode} disabled={waitLeft > 0 || busy} className={`${linkBtn} min-h-11 disabled:cursor-not-allowed disabled:text-[#64748b] disabled:no-underline`}>
                      {waitLeft > 0 ? `Send a new code in ${waitLeft}s` : "Send a new code"}
                    </button>
                    <button type="button" onClick={() => edit(0)} className={`${linkBtn} min-h-11`}>
                      Use a different email
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6">
                  <p className="text-sm font-semibold leading-6 text-[#94a3b8]">
                    One last step: a 6-digit code goes to{" "}
                    <span className="font-black text-[#e8edf5]">{values.email}</span> to confirm it&apos;s
                    yours. Nothing is sent until you enter it.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <button type="button" onClick={() => goTo(CONFIRM_STEP - 1)} className={secondaryBtn}>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={requestCode}
                      disabled={busy}
                      aria-busy={verify.kind === "sending" || undefined}
                      className={primaryBtn}
                      style={accent}
                    >
                      {verify.kind === "sending" ? "Sending code…" : "Email me a code"}
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="mt-6">
                <p className="text-sm font-semibold leading-6 text-[#94a3b8]">
                  Online sending isn&apos;t switched on yet, so this note goes out from your own email app
                  instead. Everything you wrote will be filled in for you.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <button type="button" onClick={() => goTo(CONFIRM_STEP - 1)} className={secondaryBtn}>
                    Back
                  </button>
                  <button type="button" onClick={sendWithMailApp} className={primaryBtn} style={accent}>
                    Open my email app
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
