import type { Metadata } from "next";
import {
  BOTTOM_PIN_LABEL,
  bottomPinnedProducts,
  productsByStatus,
  STATUS_LABEL,
  STATUS_ORDER,
  STUDIO,
  type Product,
} from "../lib/products";

export const metadata: Metadata = {
  description: STUDIO.mission,
  alternates: { canonical: "/" },
};

// Cool, flat palette — matched to CrossHeartPray / TheDJCares so the family feels connected.
const bg = "#0b1220";
const card = "#141d2e";
const border = "#26324c";
const text = "#e8edf5";
const sub = "#94a3b8";

// Group headings carry the status for Foundation and Live; the quieter
// statuses also get a small badge on the card.
const BADGED_STATUSES = new Set(["beta", "building", "exploring", "archived"]);

function Card({ p }: { p: Product }) {
  const isCom = p.href.startsWith("http");
  const dot = isCom ? ".com" : "";
  const badge = BADGED_STATUSES.has(p.status) ? STATUS_LABEL[p.status] : null;
  if (p.links) {
    // card with direct game links: stretched main link + real pills on top
    return (
      <div className="pop" style={{ position: "relative", background: card, border: `1px solid ${border}`, borderLeft: `5px solid ${p.accent}`, borderRadius: 18, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
        <a href={p.href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.name}${dot}`} style={{ position: "absolute", inset: 0, borderRadius: 18 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <span aria-hidden style={{ flexShrink: 0, height: 46, width: 46, borderRadius: 14, background: p.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{p.emoji}</span>
          {badge ? (
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: p.accent, border: `1px solid ${p.accent}55`, background: "transparent", borderRadius: 50, padding: "3px 10px", flexShrink: 0 }}>{badge}</span>
          ) : null}
        </div>
        <h2 style={{ fontSize: "clamp(1rem, 5.2vw, 1.4rem)", fontWeight: 900, color: text, margin: 0, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
          {p.name}{isCom && <span style={{ color: p.accent }}>{dot}</span>}
        </h2>
        <p style={{ fontSize: 14.5, color: sub, margin: 0, lineHeight: 1.55 }}>{p.description}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          {p.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" style={{ background: p.accent, color: "#0C0C0C", borderRadius: 50, padding: "9px 18px", fontSize: 14, fontWeight: 900, textDecoration: "none" }}>
              {l.label} →
            </a>
          ))}
        </div>
      </div>
    );
  }
  return (
    <a href={p.href} {...(isCom ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={{ textDecoration: "none" }}>
      <div className="pop" style={{ background: card, border: `1px solid ${border}`, borderLeft: `5px solid ${p.accent}`, borderRadius: 18, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12, cursor: "pointer" }}>
        {/* Icon on top, status to the right — frees the full width for the name */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <span aria-hidden style={{ flexShrink: 0, height: 46, width: 46, borderRadius: 14, background: p.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{p.emoji}</span>
          {badge ? (
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: p.accent, border: `1px solid ${p.accent}55`, background: "transparent", borderRadius: 50, padding: "3px 10px", flexShrink: 0 }}>{badge}</span>
          ) : null}
        </div>
        {/* Domain always on one line — font scales down on narrow phones so it fits */}
        <h2 style={{ fontSize: "clamp(1rem, 5.2vw, 1.4rem)", fontWeight: 900, color: text, margin: 0, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
          {p.name}{isCom && <span style={{ color: p.accent }}>{dot}</span>}
        </h2>
        <p style={{ fontSize: 14.5, color: sub, margin: 0, lineHeight: 1.55 }}>{p.description}</p>
      </div>
    </a>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: sub, margin: "0 0 16px", textAlign: "center" }}>
      {children}
    </p>
  );
}

export default function OpenMirrorHub() {
  const groups = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABEL[status],
    items: productsByStatus(status),
  })).filter((g) => g.items.length > 0);
  const pinned = bottomPinnedProducts();

  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "44px 24px 90px" }}>

        <header style={{ textAlign: "center", marginBottom: 44 }}>
          <div aria-hidden style={{ fontSize: 30, marginBottom: 14, letterSpacing: 6 }}>✝️ 🧩 🧰 🎵 🐶</div>
          <h1 style={{ fontSize: "clamp(2rem, 9vw, 2.9rem)", fontWeight: 900, color: text, margin: "0 0 10px", lineHeight: 1.05 }}>
            Open Mirror <span style={{ color: "#38BDF8" }}>LLC</span>
          </h1>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#93C5FD", margin: "0 0 10px", letterSpacing: "0.02em", textTransform: "uppercase" }}>
            {STUDIO.label}
          </p>
          <p style={{ fontSize: 15, fontWeight: 600, color: sub, margin: "0 auto", maxWidth: 440, lineHeight: 1.6, whiteSpace: "pre-line" }}>
            {STUDIO.missionShort}
          </p>
        </header>

        {/* CrossHeartPray is the Foundation and stays first.
            Featured products no longer appear on the homepage. */}
        {groups.map((g, i) => (
          <div key={g.status}>
            <div style={{ marginTop: i === 0 ? 0 : 40 }}>
              <GroupLabel>{g.label}</GroupLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {g.items.map((p) => <Card key={p.name} p={p} />)}
              </div>
            </div>
          </div>
        ))}

        {pinned.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <GroupLabel>{BOTTOM_PIN_LABEL}</GroupLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {pinned.map((p) => <Card key={p.name} p={p} />)}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
