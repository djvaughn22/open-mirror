"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Homepage portfolio card: a centered brand intro (mark, name, description)
// that's always visible, plus a collapsible feature list for the product's
// direct sub-links. Client component (needs useState for the expand toggle);
// src/app/page.tsx stays a server component and just maps the registry into
// these.
// ─────────────────────────────────────────────────────────────────────────────

import Image from "next/image";
import { useId, useState } from "react";
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

export default function ProductCard({ p }: { p: Product }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const isCom = p.href.startsWith("http");
  const dot = isCom ? ".com" : "";
  const badge = BADGED_STATUSES.has(p.status) ? STATUS_LABEL[p.status] : null;
  // The Foundation is the one card that should read with more compositional
  // confidence than the rest of the portfolio, and the one product with a
  // real dedicated brand mark on disk (public/crossheartpray-icon.svg) rather
  // than the shared emoji-tile treatment. Driven by the registry's own
  // status field, never the name.
  const isFoundation = p.status === "foundation";
  const word = p.expandLabel ?? "features";
  const hasFeatures = !!p.links && p.links.length > 0;

  return (
    <div
      style={{
        background: card,
        // var(--om-border), not the literal hex: the light-theme override
        // matches on the literal "#26324c" substring anywhere in an
        // element's style attribute and rewrites the whole border-color
        // shorthand !important — which would also flatten the accent
        // borderLeft below to gray if this border used the same literal.
        border: "1px solid var(--om-border)",
        borderLeft: `3px solid ${p.accent}`,
        borderRadius: 14,
        padding: isFoundation ? "34px 26px" : "28px 24px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <a
          href={p.href}
          {...(isCom ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          aria-label={`Open ${p.name}${dot}`}
          style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          {isFoundation ? (
            // The real established mark — cross, heart, pray — already on
            // disk from CrossHeartPray's own brand work.
            <Image src="/crossheartpray-icon.svg" alt="" width={80} height={80} priority style={{ borderRadius: 18, display: "block" }} />
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
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "var(--om-inset)",
                border: `1px solid ${p.accent}55`,
                fontSize: 32,
              }}
            >
              {p.emoji}
            </span>
          )}
          <h2
            style={{
              fontSize: isFoundation ? "clamp(1.15rem, 5.8vw, 1.65rem)" : "clamp(1.05rem, 5.2vw, 1.4rem)",
              fontWeight: 900,
              color: text,
              margin: "14px 0 0",
              letterSpacing: "-0.01em",
            }}
          >
            {p.name}
            {isCom && <span style={{ color: p.accent }}>{dot}</span>}
          </h2>
        </a>

        {badge ? (
          <span style={{ marginTop: 6, fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: p.accent }}>
            {badge}
          </span>
        ) : null}

        <p style={{ fontSize: isFoundation ? 15.5 : 14.5, color: sub, margin: "10px 0 0", lineHeight: 1.6, maxWidth: "42ch" }}>
          {p.description}
        </p>

        {hasFeatures ? (
          <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)} className="om-expand-btn">
            <span>{open ? `Hide ${word}` : `View ${word}`}</span>
            <span aria-hidden className={open ? "om-chevron is-open" : "om-chevron"}>⌄</span>
          </button>
        ) : null}
      </div>

      {hasFeatures && p.links ? (
        <div id={panelId} className={open ? "om-expand is-open" : "om-expand"} inert={!open}>
          <div style={{ marginTop: 20, paddingTop: 2, borderTop: `1px solid ${border}` }}>
            {p.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="om-row">
                <span>{stripEmoji(l.label)}</span>
                <span aria-hidden className="om-arrow">→</span>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${border}` }}>
            <a
              href={p.href}
              {...(isCom ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="om-cta"
              style={{ color: p.accent }}
            >
              <span>Explore {p.name}</span>
              <span aria-hidden className="om-arrow">→</span>
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
