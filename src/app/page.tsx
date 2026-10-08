import type { Metadata } from "next";
import DoorMeasure from "../components/DoorMeasure";
import ProductCard from "../components/ProductCard";
import {
  BOTTOM_PIN_LABEL,
  bottomPinnedProducts,
  doorProducts,
  productsByStatus,
  STATUS_LABEL,
  STATUS_ORDER,
  STUDIO,
} from "../lib/products";

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

export default function OpenMirrorHub() {
  const groups = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABEL[status],
    items: productsByStatus(status),
  })).filter((g) => g.items.length > 0);
  const pinned = bottomPinnedProducts();
  const doors = doorProducts();

  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "44px 24px 90px" }}>

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

        {/* The three doors: one obvious step to the right product. */}
        <section aria-labelledby="doors-title" style={{ marginBottom: 52 }}>
          <h2 id="doors-title" style={{ fontSize: 18, fontWeight: 900, color: text, margin: "0 0 14px", textAlign: "center" }}>
            Where do you want to start?
          </h2>
          <DoorMeasure />
          <div className="om-doors">
            {doors.map((d) => (
              <a key={d.key} href={d.href} data-door={d.key} className="om-door" style={{ border: "1px solid var(--om-border)", borderTop: `3px solid ${d.accent}`, background: "#141d2e", borderRadius: 16, padding: "18px 18px 16px", textDecoration: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: text }}>
                  <span aria-hidden style={{ marginRight: 8 }}>{d.emoji}</span>{d.title}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: sub, lineHeight: 1.55, flex: 1 }}>{d.line}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: d.accent }}>{d.cta} →</span>
              </a>
            ))}
          </div>
        </section>

        <GroupLabel>Everything Open Mirror makes</GroupLabel>
        <p style={{ fontSize: 13, fontWeight: 600, color: sub, margin: "-6px 0 28px", lineHeight: 1.6 }}>
          Each project shows its honest status. Some are finished, some are still being tested.
        </p>

        {/* CrossHeartPray is the Foundation and stays first.
            Featured products no longer appear on the homepage. */}
        {groups.map((g, i) => (
          <div key={g.status}>
            <div style={{ marginTop: i === 0 ? 0 : 44 }}>
              <GroupLabel>{g.label}</GroupLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {g.items.map((p) => <ProductCard key={p.name} p={p} />)}
              </div>
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
