"use client";

import { useState } from "react";
import {
  liveDestinations,
  type DestinationCardContent,
  type ProjectDestination,
} from "../lib/destinations";

// ─────────────────────────────────────────────────────────────────────────────
// AboutDestinationCard — the reusable lower-About-page container.
//
// Generic by design: it renders whatever DestinationCardContent it is given —
// a free resource, another project, a product, a service, or a contact path.
// Nothing about any specific site, product, or destination may be hard-coded
// in this file; configuration lives in src/lib/destinations.ts.
//
// Share behavior: native Web Share first; a canceled native share is quiet
// (never an error). Fallback copies the message and link; if copying is
// blocked, the address itself is shown so an action always works. Results are
// announced through an aria-live region.
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_NOTE: Record<NonNullable<ProjectDestination["status"]>, string> = {
  available: "",
  preparing: "Preparing",
  limited: "Limited",
  unavailable: "Unavailable",
};

function isShareCancel(err: unknown): boolean {
  return (
    err instanceof Error &&
    (err.name === "AbortError" || /cancel|abort/i.test(err.message))
  );
}

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]";

function DestinationLink({
  destination,
  primary,
}: {
  destination: ProjectDestination;
  primary: boolean;
}) {
  const note = destination.status ? STATUS_NOTE[destination.status] : "";
  const cls = primary
    ? `inline-flex min-h-11 items-center rounded-full px-5 py-2.5 text-sm font-black transition hover:opacity-90 ${focusRing}`
    : `inline-flex min-h-11 items-center px-1 text-sm font-black text-[#7dd3fc] underline decoration-[#26324c] underline-offset-4 transition hover:decoration-[#7dd3fc] ${focusRing}`;
  return (
    <a
      href={destination.href}
      {...(destination.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cls}
      style={
        primary
          ? { background: "var(--om-accent)", color: "var(--om-ink)" }
          : undefined
      }
    >
      <span className="min-w-0 break-words">{destination.label}</span>
      {note && (
        <span className="ml-2 shrink-0 text-[10px] font-black uppercase tracking-wider opacity-80">
          {note}
        </span>
      )}
    </a>
  );
}

export default function AboutDestinationCard({
  card,
}: {
  card: DestinationCardContent;
}) {
  const [status, setStatus] = useState("");
  const destinations = liveDestinations(card.destinations);
  if (destinations.length === 0) return null;
  const [primary, ...secondary] = destinations;

  async function onShare() {
    const share = card.share;
    if (!share) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: share.title,
          text: share.text,
          url: share.url,
        });
        setStatus("");
        return;
      } catch (err) {
        // Closing the share sheet is a normal choice, not a failure.
        if (isShareCancel(err)) return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${share.text}\n${share.url}`);
      setStatus("Copied — paste it anywhere.");
    } catch {
      setStatus(`Copying is blocked here. The address is ${share.url}`);
    }
  }

  return (
    <section
      aria-label={card.heading}
      className="rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 sm:p-6"
    >
      {card.eyebrow && (
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7dd3fc]">
          {card.emblem && (
            <span aria-hidden className="mr-2">
              {card.emblem}
            </span>
          )}
          {card.eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-xl font-black leading-tight tracking-tight text-[#e8edf5]">
        {card.heading}
      </h2>
      {card.body.map((line) => (
        <p
          key={line}
          className="mt-3 text-pretty text-sm font-semibold leading-7 text-[#94a3b8]"
        >
          {line}
        </p>
      ))}
      {card.closing && (
        <p className="mt-3 text-sm font-black leading-7 text-[#e8edf5]">
          {card.closing}
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <DestinationLink destination={primary} primary />
        {card.share && (
          <button
            type="button"
            onClick={onShare}
            className={`inline-flex min-h-11 items-center rounded-full border border-[#26324c] bg-[#0f1826] px-5 py-2.5 text-sm font-black text-[#e8edf5] transition hover:bg-[#1c2740] ${focusRing}`}
          >
            {card.share.label}
          </button>
        )}
        {secondary.map((d) => (
          <DestinationLink key={d.href} destination={d} primary={false} />
        ))}
      </div>
      <p aria-live="polite" role="status" className="mt-3 min-h-5 text-sm font-semibold text-[#94a3b8]">
        {status}
      </p>
      {card.attribution && (
        <p className="mt-1 text-xs font-semibold text-[#64748b]">
          {card.attribution}
        </p>
      )}
    </section>
  );
}
