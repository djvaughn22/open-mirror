import type { Metadata } from "next";
import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  featuresByCategory,
  startHereFeatures,
  STARTHERE_LABEL,
  type Feature,
} from "../lib/features";
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

// ─────────────────────────────────────────────────────────────────────────────
// Feature cards — "things you can actually try." Every card has exactly one
// destination, so the whole card is one link (easy to tap, no dead zones).
// Data comes entirely from src/lib/features.ts; nothing product-specific is
// hard-coded here.
// ─────────────────────────────────────────────────────────────────────────────

function FeatureCTA({ label, accent }: { label: string; accent: string }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignSelf: "flex-start",
        background: accent,
        color: "#0C0C0C",
        borderRadius: 50,
        padding: "9px 18px",
        fontSize: 14,
        fontWeight: 900,
      }}
    >
      {label} →
    </span>
  );
}

/** The 3-5 curated "Try This First" cards — bigger, unmissable. */
function HeroCard({ f }: { f: Feature }) {
  return (
    <a
      href={f.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${STARTHERE_LABEL[f.category]}: ${f.title} — ${f.cta}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="pop"
        style={{
          background: card,
          border: `1px solid ${border}`,
          borderLeft: `5px solid ${f.productAccent}`,
          borderRadius: 18,
          padding: "22px 22px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          cursor: "pointer",
          height: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              height: 46,
              width: 46,
              borderRadius: 14,
              background: f.productAccent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            {f.icon}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: f.productAccent,
            }}
          >
            {STARTHERE_LABEL[f.category]}
          </span>
        </div>
        <h2 style={{ fontSize: "clamp(1.1rem, 5vw, 1.4rem)", fontWeight: 900, color: text, margin: 0, letterSpacing: "-0.01em" }}>
          {f.title}
        </h2>
        <p style={{ fontSize: 14.5, color: sub, margin: 0, lineHeight: 1.55, flexGrow: 1 }}>{f.description}</p>
        <FeatureCTA label={f.cta} accent={f.productAccent} />
        <p style={{ fontSize: 11, color: sub, margin: 0, fontWeight: 700 }}>from {f.productName}</p>
      </div>
    </a>
  );
}

/** A compact "More to Try" tile — smaller than a hero card, still one clear tap. */
function FeatureTile({ f }: { f: Feature }) {
  return (
    <a href={f.href} target="_blank" rel="noopener noreferrer" aria-label={`${f.title} — ${f.cta}`} style={{ textDecoration: "none" }}>
      <div
        className="pop"
        style={{
          background: card,
          border: `1px solid ${border}`,
          borderLeft: `4px solid ${f.productAccent}`,
          borderRadius: 16,
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          cursor: "pointer",
          height: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span aria-hidden style={{ fontSize: 18 }}>{f.icon}</span>
          <h3 style={{ fontSize: 15.5, fontWeight: 900, color: text, margin: 0, letterSpacing: "-0.01em" }}>{f.title}</h3>
        </div>
        <p style={{ fontSize: 13.5, color: sub, margin: 0, lineHeight: 1.5, flexGrow: 1 }}>{f.description}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 12.5, fontWeight: 900, color: f.productAccent }}>{f.cta} →</span>
          <span style={{ fontSize: 10.5, color: sub, fontWeight: 700 }}>{f.productName}</span>
        </div>
      </div>
    </a>
  );
}

function CategorySection({ category }: { category: (typeof CATEGORY_ORDER)[number] }) {
  const items = featuresByCategory(category);
  if (items.length === 0) return null;
  return (
    <div style={{ marginTop: 30 }}>
      <p style={{ fontSize: 13, fontWeight: 900, color: text, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <span aria-hidden>{CATEGORY_ICON[category]}</span>
        {CATEGORY_LABEL[category].toUpperCase()}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
        {items.map((f) => (
          <FeatureTile key={f.id} f={f} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// The Studio — the full portfolio, one destination per product. Demoted below
// the feature deck (2026-08-11): this is where a visitor lands if they want
// the whole picture, not the first thing they see.
// ─────────────────────────────────────────────────────────────────────────────

function Card({ p }: { p: Product }) {
  const isCom = p.href.startsWith("http");
  const dot = isCom ? ".com" : "";
  const badge = BADGED_STATUSES.has(p.status) ? STATUS_LABEL[p.status] : null;
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
  const hero = startHereFeatures();

  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "44px 24px 90px" }}>

        <header style={{ textAlign: "center", marginBottom: 40 }}>
          <div aria-hidden style={{ fontSize: 30, marginBottom: 14, letterSpacing: 6 }}>✝️ 🧩 🧰 🎵 🐶</div>
          <h1 style={{ fontSize: "clamp(2rem, 9vw, 2.9rem)", fontWeight: 900, color: text, margin: "0 0 10px", lineHeight: 1.05 }}>
            Open Mirror <span style={{ color: "#38BDF8" }}>LLC</span>
          </h1>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#93C5FD", margin: "0 0 10px", letterSpacing: "0.02em", textTransform: "uppercase" }}>
            {STUDIO.label}
          </p>
          <p style={{ fontSize: 15, fontWeight: 600, color: sub, margin: "0 auto", maxWidth: 460, lineHeight: 1.6, whiteSpace: "pre-line" }}>
            {STUDIO.missionShort}
          </p>
        </header>

        {/* ── Try This First ─────────────────────────────────────────────── */}
        <section aria-label="Try this first" style={{ marginBottom: 44 }}>
          <GroupLabel>Try This First</GroupLabel>
          <p style={{ fontSize: 13.5, color: sub, textAlign: "center", margin: "-8px 0 18px", fontWeight: 600 }}>
            Pick one. See what happens.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {hero.map((f) => (
              <HeroCard key={f.id} f={f} />
            ))}
          </div>
        </section>

        {/* ── More to Try ─────────────────────────────────────────────────── */}
        <section aria-label="More to try">
          <GroupLabel>More To Try</GroupLabel>
          {CATEGORY_ORDER.map((cat) => (
            <CategorySection key={cat} category={cat} />
          ))}
        </section>

        {/* ── The Studio — every project, one destination each ─────────────── */}
        <div style={{ marginTop: 56, paddingTop: 40, borderTop: `1px solid ${border}` }}>
          <GroupLabel>The Whole Studio</GroupLabel>
          <p style={{ fontSize: 13.5, color: sub, textAlign: "center", margin: "-8px 0 26px", fontWeight: 600 }}>
            Every Open Mirror project, one place each.
          </p>
          {groups.map((g, i) => (
            <div key={g.status}>
              <div style={{ marginTop: i === 0 ? 0 : 30 }}>
                <GroupLabel>{g.label}</GroupLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {g.items.map((p) => <Card key={p.name} p={p} />)}
                </div>
              </div>
            </div>
          ))}

          {pinned.length > 0 && (
            <div style={{ marginTop: 30 }}>
              <GroupLabel>{BOTTOM_PIN_LABEL}</GroupLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {pinned.map((p) => <Card key={p.name} p={p} />)}
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
