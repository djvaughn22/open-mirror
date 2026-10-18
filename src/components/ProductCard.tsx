"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Homepage portfolio card: left-aligned brand intro (mark, name, description)
// that's always visible, plus a collapsible feature list for the product's
// direct sub-links, and one share icon that copies the site's address.
// Client component (needs useState for the expand toggle and copy status);
// src/app/page.tsx stays a server component and just maps the registry into
// these.
// ─────────────────────────────────────────────────────────────────────────────

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { copySiteLink } from "../lib/copyLink";
import { STATUS_LABEL, type Product } from "../lib/products";

const card = "#141d2e";
const border = "#26324c";
const text = "#e8edf5";
const sub = "#94a3b8";

const BADGED_STATUSES = new Set(["beta", "building", "exploring", "archived"]);

// Feature-link labels carry a leading emoji for other surfaces (nav, About);
// the expanded list reads as typography-led navigation, so it's stripped
// here at render time only — the registry string itself is untouched.
const LEADING_EMOJI = new RegExp(
  "^[\\p{Extended_Pictographic}\\u200D\\uFE0F]+\\s*",
  "u"
);
function stripEmoji(label: string): string {
  return label.replace(LEADING_EMOJI, "");
}

// A plain link icon (two chain links), drawn in currentColor so it follows
// the theme. No emoji, no brand glyph.
function LinkIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  );
}

export default function ProductCard({ p }: { p: Product }) {
  const [open, setOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const panelId = useId();
  const isCom = p.href.startsWith("http");
  // A registry name may already carry its own ".com" (DontCloneMeTom.com,
  // owner 2026-09-09). Split it back off so the accent still lands on the
  // suffix instead of the card rendering a second one.
  const nameHasCom = p.name.endsWith(".com");
  const baseName = nameHasCom ? p.name.slice(0, -4) : p.name;
  const dot = nameHasCom || isCom ? ".com" : "";
  // A live experiment reads as a Beta (owner, 2026-10-08); one still being
  // built keeps its honest "Building".
  const badge = BADGED_STATUSES.has(p.status) ? STATUS_LABEL[p.status] : p.experiment ? STATUS_LABEL.beta : null;
  // The Foundation is the one card that should read with more compositional
  // confidence than the rest of the portfolio, and the one product with a
  // real dedicated brand mark on disk (public/crossheartpray-icon.svg) rather
  // than the shared emoji-tile treatment. Driven by the registry's own
  // status field, never the name.
  const isFoundation = p.status === "foundation";
  const word = p.expandLabel ?? "features";
  const hasFeatures = !!p.links && p.links.length > 0;

  const clearTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(clearTimer.current), []);

  // The share icon copies this card's own site address. "Link copied" shows
  // only once the clipboard write has succeeded, then fades; if the clipboard
  // is missing or refuses, the address itself stays on screen so it can be
  // copied by hand. Each click cancels the previous fade so it can never wipe
  // a newer message. Nothing is tracked.
  async function copyLink() {
    window.clearTimeout(clearTimer.current);
    const url = new URL(p.href, window.location.href).href;
    const result = await copySiteLink(url, typeof navigator === "undefined" ? undefined : navigator.clipboard);
    setCopyStatus(result.message);
    if (result.copied) clearTimer.current = window.setTimeout(() => setCopyStatus(""), 2500);
  }

  return (
    // The card's one link is the visible "Visit …" line; its ::after (globals.css,
    // .om-card-link) stretches over the card so a click anywhere opens the site
    // as a normal link (new tab, copy address and middle-click all work), while
    // keyboard and screen-reader users meet a single real link. The share icon
    // and the Features toggle sit above that layer.
    <div
      style={{
        position: "relative",
        background: card,
        // var(--om-border), not the literal hex: the light-theme override
        // matches on the literal "#26324c" substring anywhere in an
        // element's style attribute and rewrites the whole border-color
        // shorthand !important — which would also flatten the accent
        // borderLeft below to gray if this border used the same literal.
        border: "1px solid var(--om-border)",
        borderLeft: `3px solid ${p.accent}`,
        borderRadius: 14,
        padding: isFoundation ? "20px 20px 18px" : "18px 20px 16px",
        transition: "all 0.2s ease",
      }}
      className="om-product-card"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {isFoundation ? (
          // The real established mark — cross, heart, pray — already on disk
          // from CrossHeartPray's own brand work.
          <Image src="/crossheartpray-icon.svg" alt="" width={52} height={52} priority style={{ borderRadius: 14, display: "block", flexShrink: 0 }} />
        ) : (
          // Every product's real, already-shipped icon.svg favicon is this
          // exact template — a dark rounded tile holding its emoji glyph
          // (see AGENTS/browser-tab-branding standard). Reproduced here at
          // card scale with a thin accent ring, not invented from scratch.
          <span
            aria-hidden
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "var(--om-inset)",
              border: `1px solid ${p.accent}55`,
              fontSize: 22,
            }}
          >
            {p.emoji}
          </span>
        )}
        <h2
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: isFoundation ? "clamp(1.1rem, 5.4vw, 1.5rem)" : "clamp(1.02rem, 5vw, 1.35rem)",
            fontWeight: 900,
            color: text,
            margin: 0,
            letterSpacing: "-0.01em",
            overflowWrap: "anywhere",
          }}
        >
          {baseName}
          {dot ? <span style={{ color: p.accent }}>{dot}</span> : null}
        </h2>
        {badge ? (
          <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: p.accent }}>
            {badge}
          </span>
        ) : null}
        <button
          type="button"
          onClick={copyLink}
          aria-label={`Copy link to ${baseName}${dot}`}
          title={`Copy link to ${baseName}${dot}`}
          className="om-card-share"
        >
          <LinkIcon />
        </button>
      </div>
      <p aria-live="polite" className="om-card-share-status">{copyStatus}</p>

      <p style={{ fontSize: isFoundation ? 15 : 14.5, color: sub, margin: "12px 0 0", lineHeight: 1.55 }}>
        {p.description}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "4px 16px", marginTop: 12 }}>
        <a
          href={p.href}
          {...(isCom ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="om-cta om-card-link"
          style={{ color: p.accent }}
        >
          <span>Visit {baseName}{dot}</span>
          <span aria-hidden className="om-arrow">→</span>
        </a>
        {hasFeatures ? (
          <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)} className="om-expand-btn">
            <span>{word[0].toUpperCase()}{word.slice(1)}</span>
            <span aria-hidden className={open ? "om-chevron is-open" : "om-chevron"}>⌄</span>
          </button>
        ) : null}
      </div>

      {hasFeatures && p.links ? (
        <div id={panelId} className={open ? "om-expand is-open" : "om-expand"} inert={!open}>
          <div style={{ marginTop: 14, paddingTop: 2, borderTop: `1px solid ${border}` }}>
            {p.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="om-row">
                <span>{stripEmoji(l.label)}</span>
                <span aria-hidden className="om-arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
