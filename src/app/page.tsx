import type { Metadata } from "next";
import DoorMeasure from "../components/DoorMeasure";
import ProductCard from "../components/ProductCard";
import ShareLink from "../components/ShareLink";
import {
  BOTTOM_PIN_LABEL,
  bottomPinnedProducts,
  doorProducts,
  foundationProduct,
  homeSections,
  STUDIO,
} from "../lib/products";

export const metadata: Metadata = {
  description: STUDIO.welcome,
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

export default function OpenMirrorHub() {
  const sections = homeSections();
  const pinned = bottomPinnedProducts();
  const doors = doorProducts();
  const foundation = foundationProduct();

  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "44px 24px 90px" }}>

        {/* Quiet header: the name and one welcoming line. The fuller purpose
            lives on About, never here as a block (owner, 2026-10-08). */}
        <header style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: "clamp(2rem, 9vw, 2.9rem)", fontWeight: 900, color: text, margin: "0 0 8px", lineHeight: 1.05 }}>
            Open Mirror <span style={{ color: "#38BDF8" }}>LLC</span>
          </h1>
          <p style={{ fontSize: 14, fontWeight: 600, color: sub, margin: 0 }}>
            {STUDIO.welcome} <a href="/about-open-mirror" style={{ color: sub, textDecoration: "underline", textUnderlineOffset: 3 }}>About</a>
          </p>
        </header>

        {/* The two doors: one obvious step to the right product. */}
        <section aria-labelledby="doors-title" style={{ marginBottom: 52 }}>
          <h2 id="doors-title" style={{ fontSize: 18, fontWeight: 900, color: text, margin: "0 0 14px", textAlign: "center" }}>
            Where do you want to start?
          </h2>
          <DoorMeasure />
          <div className="om-doors">
            {doors.map((d) => (
              <a key={d.key} href={d.href} data-door={d.key} className="om-door" style={{ border: "1px solid var(--om-border)", borderTop: `3px solid ${d.accent}`, background: "#141d2e", borderRadius: 16, padding: "18px 18px 16px", textDecoration: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 19, fontWeight: 900, color: text, lineHeight: 1.2 }}>
                    <span aria-hidden style={{ marginRight: 8 }}>{d.icon}</span>
                    {d.headline.replace(/\.com$/, "")}
                    {d.headline.endsWith(".com") && <span style={{ color: d.accent }}>.com</span>}
                  </span>
                  <span data-door-subtitle style={{ fontSize: 13, fontWeight: 800, color: d.accent, letterSpacing: "0.01em" }}>{d.title}</span>
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: sub, lineHeight: 1.55, flex: 1 }}>{d.line}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: d.accent }}>{d.cta} →</span>
              </a>
            ))}
          </div>
        </section>

        {/* Below the doors, in the owner's order (2026-10-08): prayer and
            faithful media first — CrossHeartPray easy to find and to share,
            never a door or a sales path — then the rescue project, then the
            betas and experiments, then PleaseBeReady as a quiet resource. */}
        {sections.map((s, i) => (
          <section key={s.key} aria-label={s.label} style={{ marginTop: i === 0 ? 0 : 44 }}>
            <GroupLabel>{s.label}</GroupLabel>
            {s.note && (
              <p style={{ fontSize: 13, fontWeight: 600, color: sub, margin: "-6px 0 18px", lineHeight: 1.6 }}>{s.note}</p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {s.items.map((p) => <ProductCard key={p.name} p={p} />)}
            </div>
            {s.key === "faith" && foundation && (
              <p style={{ margin: "14px 0 0" }}>
                <ShareLink
                  label={`Share ${foundation.name}`}
                  title={foundation.name}
                  text={foundation.aboutLine ?? foundation.description}
                  url={foundation.href}
                />
              </p>
            )}
          </section>
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
