"use client";

// Reads the confirmation the form stored in sessionStorage. Handles the
// no-confirmation case honestly (deep link, cleared storage, new browser)
// instead of showing a fake success.

import { useMemo, useSyncExternalStore } from "react";

import { SERVICE_EMAIL } from "../../../../lib/services";

type Confirmation = {
  requestNumber: string;
  submittedAt: string;
  termsVersion: string;
  customerEmailSent: boolean;
  email: string;
  deviceType: string;
  summary: string;
};

const STATUS_STEPS = [
  "Request submitted",
  "Open Mirror review",
  "Invoice and payment",
  "Shipping instructions",
  "Device received",
];

// sessionStorage is an external store: read it with useSyncExternalStore so
// the server render (which has no storage) shows "loading" and the client
// swaps in the real confirmation at hydration.
const STORAGE_KEY = "om-device-request-confirmation";
const SSR_SENTINEL = "__ssr-loading__";
const subscribeNever = () => () => {};
const readStoredConfirmation = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export default function RequestReceived() {
  const raw = useSyncExternalStore(
    subscribeNever,
    readStoredConfirmation,
    () => SSR_SENTINEL
  );

  const state = useMemo<
    | { kind: "loading" }
    | { kind: "missing" }
    | { kind: "found"; confirmation: Confirmation }
  >(() => {
    if (raw === SSR_SENTINEL) return { kind: "loading" };
    if (!raw) return { kind: "missing" };
    try {
      const parsed = JSON.parse(raw) as Confirmation;
      if (parsed?.requestNumber && parsed?.email) {
        return { kind: "found", confirmation: parsed };
      }
      return { kind: "missing" };
    } catch {
      return { kind: "missing" };
    }
  }, [raw]);

  if (state.kind === "loading") {
    return (
      <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <p role="status" className="text-center text-sm font-semibold text-[#94a3b8]">
            Loading your confirmation…
          </p>
        </div>
      </main>
    );
  }

  if (state.kind === "missing") {
    return (
      <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <h1 className="mb-4 text-balance text-center text-3xl font-black leading-[1.1] tracking-tight">
            No request confirmation found
          </h1>
          <p className="mx-auto mb-6 max-w-md text-center text-sm font-semibold leading-7 text-[#94a3b8]">
            This page shows a confirmation right after a device request is
            submitted in the same browser tab. If you already submitted a
            request, your request number is in the confirmation email — and if
            you can&apos;t find it, email{" "}
            <a href={`mailto:${SERVICE_EMAIL}`} className="font-black text-[#7dd3fc] underline">
              {SERVICE_EMAIL}
            </a>{" "}
            and Open Mirror will look it up.
          </p>
          <p className="text-center">
            <a
              href="/products/old-laptop-to-build-machine#request"
              className="inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-sm font-black text-[#0C0C0C]"
            >
              Start a device request
            </a>
          </p>
        </div>
      </main>
    );
  }

  const c = state.confirmation;
  const submittedDate = new Date(c.submittedAt);
  const submittedDisplay = Number.isNaN(submittedDate.getTime())
    ? c.submittedAt
    : submittedDate.toLocaleString(undefined, {
        dateStyle: "long",
        timeStyle: "short",
      });

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5] print:bg-white print:text-black">
      <div className="mx-auto max-w-2xl px-5 py-14">
        <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.2em] text-[#34D399]">
          Submitted for review
        </p>
        <h1 className="mb-6 text-balance text-center text-3xl font-black leading-[1.15] tracking-tight sm:text-4xl">
          Request received. Please do not ship your device yet.
        </h1>

        <section
          aria-label="Your request"
          className="mb-8 rounded-3xl border border-[#26324c] bg-[#141d2e] p-6 print:border-black"
        >
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold text-[#94a3b8]">Request number</dt>
              <dd className="text-lg font-black tracking-wide">{c.requestNumber}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-[#94a3b8]">Status</dt>
              <dd className="text-sm font-black text-[#34D399]">Submitted for review</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-[#94a3b8]">Email</dt>
              <dd className="break-all text-sm font-bold">{c.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-[#94a3b8]">Device type</dt>
              <dd className="text-sm font-bold">{c.deviceType}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-[#94a3b8]">Submitted</dt>
              <dd className="text-sm font-bold">{submittedDisplay}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-[#94a3b8]">Terms version</dt>
              <dd className="text-sm font-bold">{c.termsVersion}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs font-semibold leading-5 text-[#64748b]">
            Keep this request number — every update about this device uses it.
            {c.customerEmailSent
              ? " A confirmation email with the same details is on its way."
              : " If a confirmation email doesn't arrive, that's okay — this page and your request number are your record."}
          </p>
        </section>

        <section aria-label="What happens next" className="mb-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
            What happens next
          </p>
          <ol className="flex flex-col gap-2">
            {STATUS_STEPS.map((step, i) => {
              const done = i === 0;
              return (
                <li
                  key={step}
                  className="flex items-center gap-3 rounded-xl border border-[#26324c] bg-[#141d2e] px-4 py-3 text-sm font-bold"
                >
                  <span
                    aria-hidden
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                      done
                        ? "bg-[#34D399] text-[#0b1220]"
                        : "border border-[#26324c] bg-[#0f1826] text-[#64748b]"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span className={done ? "" : "text-[#94a3b8]"}>
                    {step}
                    {done && <span className="sr-only"> — complete</span>}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-sm font-semibold leading-6 text-[#94a3b8]">
            Open Mirror reviews every request individually and replies by your
            preferred contact method: accepted, more information needed, or
            declined. If accepted, you&apos;ll receive a secure Novo invoice by
            email — no payment happens on this website. Shipping instructions
            come only after payment is confirmed.
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-[#f59e0b]/40 bg-[#1c1608] p-5 print:border-black print:bg-white">
          <p className="text-sm font-bold leading-6 text-[#fbbf24] print:text-black">
            Do not ship your device yet — wait for written approval and
            shipping instructions. And never send passwords, PINs, encryption
            keys, or financial information by email or with a device.
          </p>
        </section>

        {c.summary && (
          <section aria-label="Printable request summary" className="mb-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
              Your request summary
            </p>
            <textarea
              readOnly
              aria-label="Request summary, ready to copy"
              rows={12}
              value={c.summary}
              className="w-full rounded-xl border border-[#26324c] bg-[#0f1826] px-3 py-2 text-xs font-medium text-[#94a3b8] print:border-black print:text-black"
            />
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-3 inline-block rounded-full border border-[#26324c] bg-[#141d2e] px-6 py-3 text-sm font-black text-[#e8edf5] print:hidden"
            >
              Print this page
            </button>
          </section>
        )}

        <p className="text-center text-sm font-semibold leading-6 text-[#94a3b8]">
          Questions about this request? Email{" "}
          <a href={`mailto:${SERVICE_EMAIL}`} className="font-black text-[#7dd3fc] underline">
            {SERVICE_EMAIL}
          </a>{" "}
          and include your request number.
        </p>
      </div>
    </main>
  );
}
