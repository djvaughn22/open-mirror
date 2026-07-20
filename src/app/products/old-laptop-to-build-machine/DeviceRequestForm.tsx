"use client";

// Device request form — the Build Machine intake.
//
// When server delivery is configured, submission POSTs to
// /api/device-request; the server validates again, generates the request
// number, and emails the owner. When delivery is not configured (or fails),
// the same validated answers fall back to a composed email so nothing a
// customer typed is ever lost and no false success is ever shown.
//
// This form never collects passwords, PINs, encryption keys, payment
// details, or file uploads — and must never grow fields for them.

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ACKNOWLEDGEMENTS,
  buildRequestSummaryText,
  CONDITIONS,
  CONFIRMATION_PATH,
  DEVICE_TYPES,
  POWERS_ON,
  PREFERRED_CONTACT,
  validateDeviceRequest,
  type AcknowledgementKey,
} from "../../../lib/deviceRequest";
import { SERVICE_EMAIL } from "../../../lib/services";

type Values = Record<string, string>;
type Acks = Partial<Record<AcknowledgementKey, boolean>>;

const FIELD_LABELS: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email address",
  phone: "Phone number",
  deviceType: "Device type",
  manufacturer: "Manufacturer",
  model: "Model",
  approximateAge: "Approximate device age",
  powersOn: "Does it power on",
  operatingSystem: "Operating system",
  sizeOrWeight: "Approximate size or weight",
  condition: "General device condition",
  intendedUse: "What you want to use it for",
  notes: "Notes",
  zip: "ZIP code",
  preferredContact: "Preferred contact method",
};

function fieldClasses(invalid: boolean) {
  return `w-full rounded-xl border bg-[#0f1826] px-3.5 py-3 text-base font-semibold text-[#e8edf5] outline-none focus-visible:border-[#38BDF8] focus-visible:ring-2 focus-visible:ring-[#38BDF8]/40 sm:text-sm ${
    invalid ? "border-[#f87171]" : "border-[#26324c]"
  }`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs font-bold text-[#f87171]">
      {message}
    </p>
  );
}

function LabelText({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block text-xs font-bold text-[#94a3b8]">{children}</span>
  );
}

function Legend({ children }: { children: React.ReactNode }) {
  return (
    <legend className="px-1 text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
      {children}
    </legend>
  );
}

export default function DeviceRequestForm({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [v, setV] = useState<Values>({});
  const [acks, setAcks] = useState<Acks>({});
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "submitting" }
    | { kind: "server-error"; message: string }
    | { kind: "fallback"; mailBody: string; reason: string }
    | { kind: "inline-success"; requestNumber: string; submittedAt: string }
  >({ kind: "idle" });
  const summaryRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  const set =
    (key: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setV((prev) => ({ ...prev, [key]: e.target.value }));

  const announce = (message: string) => {
    if (liveRef.current) liveRef.current.textContent = message;
  };

  function payload() {
    return {
      ...v,
      acknowledgements: Object.fromEntries(
        ACKNOWLEDGEMENTS.map((a) => [a.key, acks[a.key] === true])
      ),
      website: honeypot,
    };
  }

  function showErrors(fieldErrors: Record<string, string>) {
    setErrors(fieldErrors);
    announce("The request was not submitted. Please fix the highlighted answers.");
    // setTimeout, not requestAnimationFrame: rAF never fires in throttled or
    // backgrounded tabs, and the focus move is an accessibility requirement.
    setTimeout(() => summaryRef.current?.focus(), 0);
  }

  function openMailFallback(reason: string) {
    const validated = validateDeviceRequest(payload());
    if (!validated.ok) return; // callers validate first
    const body = buildRequestSummaryText(validated.data);
    setStatus({ kind: "fallback", mailBody: body, reason });
    announce(
      "Online submission is unavailable. Your answers are ready to send by email instead."
    );
    window.location.href = `mailto:${SERVICE_EMAIL}?subject=${encodeURIComponent(
      "Build Machine device request"
    )}&body=${encodeURIComponent(body)}`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status.kind === "submitting") return;

    const validated = validateDeviceRequest(payload());
    if (!validated.ok) {
      showErrors(validated.fieldErrors);
      return;
    }
    setErrors({});

    if (!enabled) {
      openMailFallback(
        "Online submission is temporarily unavailable, so the request goes by email instead."
      );
      return;
    }

    setStatus({ kind: "submitting" });
    announce("Submitting your device request…");
    try {
      const res = await fetch("/api/device-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const json = await res.json().catch(() => null);

      if (json?.ok && json.requestNumber) {
        const confirmation = {
          requestNumber: json.requestNumber as string,
          submittedAt: json.submittedAt as string,
          termsVersion: json.termsVersion as string,
          customerEmailSent: Boolean(json.customerEmailSent),
          email: validated.data.email,
          deviceType: validated.data.deviceType,
          summary: buildRequestSummaryText(validated.data, {
            requestNumber: json.requestNumber,
            submittedAt: json.submittedAt,
          }),
        };
        announce("Request received. Do not ship your device yet.");
        try {
          sessionStorage.setItem(
            "om-device-request-confirmation",
            JSON.stringify(confirmation)
          );
          router.push(CONFIRMATION_PATH);
        } catch {
          // Storage unavailable (private mode, etc.) — confirm right here.
          setStatus({
            kind: "inline-success",
            requestNumber: confirmation.requestNumber,
            submittedAt: confirmation.submittedAt,
          });
        }
        return;
      }

      const code = json?.error?.code;
      if (code === "validation" && json.error.fieldErrors) {
        setStatus({ kind: "idle" });
        showErrors(json.error.fieldErrors);
        return;
      }
      if (code === "unconfigured" || code === "delivery_failed") {
        openMailFallback(json.error.message);
        return;
      }
      setStatus({
        kind: "server-error",
        message:
          json?.error?.message ??
          "Something went wrong on our side. Your answers are still here — please try again.",
      });
      announce("The request was not submitted. Please try again.");
    } catch {
      setStatus({
        kind: "server-error",
        message:
          "The request could not reach Open Mirror — check your connection and try again. Your answers are still here.",
      });
      announce("The request was not submitted. Please try again.");
    }
  }

  function text(
    key: string,
    opts?: {
      required?: boolean;
      type?: string;
      hint?: string;
      autoComplete?: string;
      inputMode?: "numeric" | "tel" | "email";
    }
  ) {
    const err = errors[key];
    const errId = `err-${key}`;
    return (
      <label className="block">
        <LabelText>
          {FIELD_LABELS[key]}
          {opts?.required ? " *" : " (optional)"}
        </LabelText>
        <input
          id={`f-${key}`}
          type={opts?.type ?? "text"}
          name={key}
          value={v[key] ?? ""}
          onChange={set(key)}
          autoComplete={opts?.autoComplete}
          inputMode={opts?.inputMode}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? errId : undefined}
          className={fieldClasses(Boolean(err))}
        />
        {opts?.hint && (
          <span className="mt-1 block text-xs font-semibold text-[#64748b]">
            {opts.hint}
          </span>
        )}
        <FieldError id={errId} message={err} />
      </label>
    );
  }

  function select(
    key: string,
    options: readonly string[],
    opts?: { required?: boolean; hint?: string }
  ) {
    const err = errors[key];
    const errId = `err-${key}`;
    return (
      <label className="block">
        <LabelText>
          {FIELD_LABELS[key]}
          {opts?.required ? " *" : " (optional)"}
        </LabelText>
        <select
          id={`f-${key}`}
          name={key}
          value={v[key] ?? ""}
          onChange={set(key)}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? errId : undefined}
          className={fieldClasses(Boolean(err))}
        >
          <option value="">Choose…</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {opts?.hint && (
          <span className="mt-1 block text-xs font-semibold text-[#64748b]">
            {opts.hint}
          </span>
        )}
        <FieldError id={errId} message={err} />
      </label>
    );
  }

  const errorEntries = Object.entries(errors);
  const submitting = status.kind === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <p className="text-sm font-semibold leading-6 text-[#94a3b8]">
        Answer what you know — “Unknown” and “Not sure” are fine answers.
        Submitting sends the request to Open Mirror for review. Nothing is
        paid here, and nothing ships until you receive approval and shipping
        instructions.
      </p>
      <p className="rounded-xl border border-[#f59e0b]/40 bg-[#1c1608] px-4 py-3 text-sm font-bold leading-6 text-[#fbbf24]">
        Never enter a password, PIN, encryption key, financial information, or
        private file contents in this form.
      </p>

      {/* Screen-reader announcements for progress, success, and failure. */}
      <p ref={liveRef} aria-live="polite" role="status" className="sr-only" />

      {errorEntries.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border border-[#f87171]/50 bg-[#2a1215] px-4 py-3"
        >
          <p className="text-sm font-black text-[#fca5a5]">
            The request was not submitted — please fix{" "}
            {errorEntries.length === 1 ? "this answer" : "these answers"}:
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            {errorEntries.map(([key, message]) => (
              <li key={key}>
                <a
                  href={`#f-${key}`}
                  className="text-sm font-bold text-[#fca5a5] underline"
                >
                  {FIELD_LABELS[key] ??
                    ACKNOWLEDGEMENTS.find((a) => `ack-${a.key}` === key)?.label ??
                    key}
                  : {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!enabled && status.kind !== "fallback" && (
        <p className="rounded-xl border border-[#26324c] bg-[#141d2e] px-4 py-3 text-sm font-semibold leading-6 text-[#94a3b8]">
          Online submission is temporarily unavailable. You can still fill the
          form out — submitting will compose the request in your own email app
          addressed to{" "}
          <a href={`mailto:${SERVICE_EMAIL}`} className="font-black text-[#7dd3fc] underline">
            {SERVICE_EMAIL}
          </a>
          , and nothing you type is lost.
        </p>
      )}

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

      <fieldset className="grid gap-4 rounded-2xl border border-[#26324c] p-4 sm:grid-cols-2">
        <Legend>About you</Legend>
        {text("firstName", { required: true, autoComplete: "given-name" })}
        {text("lastName", { required: true, autoComplete: "family-name" })}
        {text("email", { required: true, type: "email", autoComplete: "email", inputMode: "email" })}
        {text("phone", { type: "tel", autoComplete: "tel", inputMode: "tel" })}
        {select("preferredContact", PREFERRED_CONTACT, { required: true })}
        {text("zip", {
          required: true,
          autoComplete: "postal-code",
          inputMode: "numeric",
          hint: "US ZIP code — used only for preliminary shipping context.",
        })}
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl border border-[#26324c] p-4 sm:grid-cols-2">
        <Legend>The device</Legend>
        {select("deviceType", DEVICE_TYPES, { required: true })}
        {text("manufacturer", {
          required: true,
          hint: "For example: Dell, HP, Lenovo, ASUS.",
        })}
        {text("model", { hint: "The exact model, if you know it." })}
        {text("approximateAge", { hint: "A guess is fine — “about 8 years old.”" })}
        {select("powersOn", POWERS_ON, { required: true })}
        {text("operatingSystem", { hint: "For example: Windows 10, Windows 11." })}
        {text("sizeOrWeight", {
          hint: "Especially helpful for desktops — “mini PC,” “mid tower, maybe 25 lbs.”",
        })}
        {select("condition", CONDITIONS, { required: true })}
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl border border-[#26324c] p-4">
        <Legend>Your plans</Legend>
        <label className="block">
          <LabelText>{FIELD_LABELS.intendedUse} *</LabelText>
          <textarea
            id="f-intendedUse"
            name="intendedUse"
            rows={3}
            value={v.intendedUse ?? ""}
            onChange={set("intendedUse")}
            aria-invalid={errors.intendedUse ? true : undefined}
            aria-describedby={errors.intendedUse ? "err-intendedUse" : undefined}
            className={fieldClasses(Boolean(errors.intendedUse))}
          />
          <span className="mt-1 block text-xs font-semibold text-[#64748b]">
            What should the finished machine help you do?
          </span>
          <FieldError id="err-intendedUse" message={errors.intendedUse} />
        </label>
        <label className="block">
          <LabelText>{FIELD_LABELS.notes} (optional)</LabelText>
          <textarea
            id="f-notes"
            name="notes"
            rows={3}
            value={v.notes ?? ""}
            onChange={set("notes")}
            aria-invalid={errors.notes ? true : undefined}
            aria-describedby={errors.notes ? "err-notes" : undefined}
            className={fieldClasses(Boolean(errors.notes))}
          />
          <span className="mt-1 block text-xs font-semibold text-[#64748b]">
            Anything else worth knowing — nothing sensitive or confidential.
          </span>
          <FieldError id="err-notes" message={errors.notes} />
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-3 rounded-2xl border border-[#26324c] p-4">
        <Legend>Required confirmations</Legend>
        <p className="text-xs font-semibold leading-5 text-[#64748b]">
          Each confirmation below is required. Please read them — they are the
          working agreement for this service.
        </p>
        {ACKNOWLEDGEMENTS.map((a) => {
          const err = errors[`ack-${a.key}`];
          return (
            <div key={a.key}>
              <label className="flex items-start gap-3 text-sm font-semibold leading-6">
                <input
                  id={`f-ack-${a.key}`}
                  type="checkbox"
                  checked={acks[a.key] === true}
                  onChange={(e) =>
                    setAcks((prev) => ({ ...prev, [a.key]: e.target.checked }))
                  }
                  aria-invalid={err ? true : undefined}
                  aria-describedby={err ? `err-ack-${a.key}` : undefined}
                  className="mt-1 h-6 w-6 shrink-0 accent-[#38BDF8]"
                />
                <span>{a.label} *</span>
              </label>
              <FieldError id={`err-ack-${a.key}`} message={err} />
            </div>
          );
        })}
      </fieldset>

      {status.kind === "server-error" && (
        <p role="alert" className="rounded-xl border border-[#f87171]/50 bg-[#2a1215] px-4 py-3 text-sm font-bold leading-6 text-[#fca5a5]">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting || undefined}
        className="mt-1 inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-sm font-black text-[#0C0C0C] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit device request"}
      </button>
      <p className="text-xs font-semibold leading-5 text-[#64748b]">
        Submitting sends your request for review. It does not accept the
        request, send an invoice, take a payment, or mean you should ship
        anything yet.
      </p>

      {status.kind === "inline-success" && (
        <div role="status" className="rounded-2xl border border-[#34D399]/40 bg-[#0e1f19] p-4">
          <p className="text-sm font-black leading-6 text-[#a7f3d0]">
            Request received. Please do not ship your device yet.
          </p>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#a7f3d0]">
            Your request number is {status.requestNumber}. Keep it — every
            update about this device uses it. Open Mirror will review the
            request and reply by your preferred contact method.
          </p>
        </div>
      )}

      {status.kind === "fallback" && (
        <div className="rounded-2xl border border-[#34D399]/40 bg-[#0e1f19] p-4">
          <p className="text-sm font-bold leading-6 text-[#a7f3d0]">
            {status.reason} Your email app should have opened with everything
            filled in. If it did not, copy the text below and email it to{" "}
            <a href={`mailto:${SERVICE_EMAIL}`} className="underline">
              {SERVICE_EMAIL}
            </a>
            .
          </p>
          <textarea
            readOnly
            aria-label="Your request, ready to copy"
            rows={10}
            value={status.mailBody}
            className="mt-3 w-full rounded-xl border border-[#26324c] bg-[#0f1826] px-3 py-2 text-xs font-medium text-[#94a3b8]"
          />
        </div>
      )}
    </form>
  );
}
