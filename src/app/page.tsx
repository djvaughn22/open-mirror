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
// statuses also get a small label on the card.
const BADGED_STATUSES = new Set(["beta", "building", "exploring", "archived"]);

// Feature-link labels carry a leading emoji for other surfaces (nav, About);
// the homepage portfolio reads as typography-led navigation, so it is
// stripped here at render time only — the registry string itself is untouched.
const LEADING_EMOJI = new RegExp(
  "^[\\p{Extended_Pictographic}\\u200D\\uFE0F]+\\s*",
  "u"
);
function stripEmoji(label: string): string {
  return label.replace(LEADING_EMOJI, "");
}

function Card({ p }: { p: Product }) {
  const isCom = p.href.startsWith("http");
  const dot = isCom ? ".com" : "";
  const badge = BADGED_STATUSES.has(p.status) ? STATUS_LABEL[p.status] : null;
  // The Foundation is the one card that should read with more compositional
  // confidence than the rest of the portfolio — a touch more room, a touch
  // larger type. Driven by the registry's own status field, never the name.
  const isFoundation = p.status === "foundation";

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
        padding: isFoundation ? "30px 26px" : "24px 24px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "4px 12px" }}>
        <h2 style={{ fontSize: isFoundation ? "clamp(1.15rem, 5.8vw, 1.65rem)" : "clamp(1.05rem, 5.2vw, 1.4rem)", fontWeight: 900, color: text, margin: 0, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
          {p.name}{isCom && <span style={{ color: p.accent }}>{dot}</span>}
        </h2>
        {badge ? (
          <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: p.accent }}>{badge}</span>
        ) : null}
      </div>

      <p style={{ fontSize: isFoundation ? 15.5 : 14.5, color: sub, margin: "10px 0 0", lineHeight: 1.6, maxWidth: "58ch" }}>
        {p.description}
      </p>

      {p.links ? (
        <div style={{ marginTop: 18, paddingTop: 2, borderTop: `1px solid ${border}` }}>
          {p.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="om-row">
              <span>{stripEmoji(l.label)}</span>
              <span aria-hidden className="om-arrow">→</span>
            </a>
          ))}
        </div>
      ) : null}

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
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: sub, margin: "0 0 16px", paddingBottom: 10, borderBottom: `1px solid ${border}`, textAlign: "left" }}>
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

        <header style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontSize: "clamp(2rem, 9vw, 2.9rem)", fontWeight: 900, color: text, margin: "0 0 10px", lineHeight: 1.05 }}>
            Open Mirror <span style={{ color: "#38BDF8" }}>LLC</span>
          </h1>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#93C5FD", margin: "0 0 12px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {STUDIO.label}
          </p>
          <p style={{ fontSize: 15, fontWeight: 600, color: sub, margin: "0 auto", maxWidth: 440, lineHeight: 1.6, whiteSpace: "pre-line" }}>
            {STUDIO.missionShort}
          </p>
          <div aria-hidden style={{ height: 1, width: 64, background: border, margin: "28px auto 0" }} />
        </header>

        {/* CrossHeartPray is the Foundation and stays first.
            Featured products no longer appear on the homepage. */}
        {groups.map((g, i) => (
          <div key={g.status}>
            <div style={{ marginTop: i === 0 ? 0 : 44 }}>
              <GroupLabel>{g.label}</GroupLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {g.items.map((p) => <Card key={p.name} p={p} />)}
              </div>
            </div>
          </div>
        ))}

        {pinned.length > 0 && (
          <div style={{ marginTop: 44 }}>
            <GroupLabel>{BOTTOM_PIN_LABEL}</GroupLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {pinned.map((p) => <Card key={p.name} p={p} />)}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
