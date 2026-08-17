import type { Metadata } from "next";
import ProductCard from "../components/ProductCard";
import {
  BOTTOM_PIN_LABEL,
  bottomPinnedProducts,
  STUDIO,
} from "../lib/products";
import { shelves, START_HERE } from "../lib/orientation";

export const metadata: Metadata = {
  description: STUDIO.mission,
  alternates: { canonical: "/" },
};

// Cool, flat palette — matched to CrossHeartPray / TheDJCares so the family feels connected.
const bg = "#0b1220";
const border = "#26324c";
const text = "#e8edf5";
const sub = "#94a3b8";

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: sub, margin: "0 0 16px", paddingBottom: 10, borderBottom: `1px solid ${border}`, textAlign: "left" }}>
      {children}
    </p>
  );
}

// The homepage groups by what a visitor can DO, not by internal development
// stage. Status groups (Foundation / Live / Building) told a first-time
// visitor which things were finished — a studio question, not theirs. Try
// This First answers "what should I try?"; the shelves answer "where do I
// look for the kind of thing I want?". Both read from lib/orientation.ts,
// whose route contract is proven against the product registry in tests.
export default function OpenMirrorHub() {
  const shelfList = shelves();
  const pinned = bottomPinnedProducts();

  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "44px 24px 90px" }}>

        <header style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(2rem, 9vw, 2.9rem)", fontWeight: 900, color: text, margin: "0 0 10px", lineHeight: 1.05 }}>
            Open Mirror <span style={{ color: "#38BDF8" }}>LLC</span>
          </h1>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#93C5FD", margin: "0 0 12px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {STUDIO.label}
          </p>
          <p style={{ fontSize: 15, fontWeight: 600, color: sub, margin: "0 auto", maxWidth: 440, lineHeight: 1.6, whiteSpace: "pre-line" }}>
            {STUDIO.missionShort}
          </p>
        </header>

        {/* Try this first — five real experiences, one tap each, no account,
            nothing to install. A visitor should never have to read a
            directory to find something worth doing. */}
        <section aria-labelledby="try-this-first" style={{ marginBottom: 46 }}>
          <p id="try-this-first" style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.16em", color: "#93C5FD", margin: "0 0 14px", paddingBottom: 10, borderBottom: `1px solid ${border}` }}>
            Try this first
          </p>
          <div className="om-start-here">
            {START_HERE.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="om-start-card"
                style={{ borderLeft: `3px solid ${s.accent}` }}
              >
                <span aria-hidden className="om-start-emoji" style={{ border: `1px solid ${s.accent}55` }}>
                  {s.emoji}
                </span>
                <span className="om-start-body">
                  <span className="om-start-title">{s.title}</span>
                  <span className="om-start-doing">{s.doing}</span>
                  <span className="om-start-product" style={{ color: s.accent }}>{s.product}</span>
                </span>
                <span aria-hidden className="om-arrow">→</span>
              </a>
            ))}
          </div>
        </section>

        {/* The shelves — the whole public family, organized by what it is
            for. CrossHeartPray is the Foundation and leads the Faith shelf
            by registry order; its card keeps its own treatment. */}
        {shelfList.map((s, i) => (
          <div key={s.key} style={{ marginTop: i === 0 ? 0 : 44 }}>
            <GroupLabel>{s.label}</GroupLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {s.items.map((p) => <ProductCard key={p.name} p={p} />)}
            </div>
          </div>
        ))}


        {pinned.length > 0 && (
          <div style={{ marginTop: 44 }}>
            <GroupLabel>{BOTTOM_PIN_LABEL}</GroupLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {pinned.map((p) => <ProductCard key={p.name} p={p} />)}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
