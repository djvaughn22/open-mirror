"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Homepage portfolio card: left-aligned brand intro (mark, name, description)
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
        padding: isFoundation ? "24px 22px" : "20px 22px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        {isFoundation ? (
          // The real established mark — cross, heart, pray — already on disk
          // from CrossHeartPray's own brand work.
          <Image src="/crossheartpray-icon.svg" alt="" width={56} height={56} priority style={{ borderRadius: 14, display: "block" }} />
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
        {badge ? (
          <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: p.accent }}>
            {badge}
          </span>
        ) : null}
      </div>

      <a
        href={p.href}
        {...(isCom ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        style={{ textDecoration: "none", display: "inline-block" }}
      >
        <h2
          style={{
            fontSize: isFoundation ? "clamp(1.1rem, 5.4vw, 1.5rem)" : "clamp(1.02rem, 5vw, 1.35rem)",
            fontWeight: 900,
            color: text,
            margin: "12px 0 0",
            letterSpacing: "-0.01em",
          }}
        >
          {p.name}
          {isCom && <span style={{ color: p.accent }}>{dot}</span>}
        </h2>
      </a>

      <p style={{ fontSize: isFoundation ? 15 : 14.5, color: sub, margin: "8px 0 0", lineHeight: 1.55 }}>
        {p.description}
      </p>

      {hasFeatures ? (
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)} className="om-expand-btn">
          <span>{word[0].toUpperCase()}{word.slice(1)}</span>
          <span aria-hidden className={open ? "om-chevron is-open" : "om-chevron"}>⌄</span>
        </button>
      ) : null}

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
