import type { Metadata } from "next";
import DoorMeasure from "../components/DoorMeasure";
import ProductCard from "../components/ProductCard";
import { homeSections, siteKey, STUDIO } from "../lib/products";

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

  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "44px 24px 90px" }}>

        {/* What Open Mirror is, in plain words, before anything else
            (owner brief 2026-11-14: the ten-second test). */}
        <header style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: "clamp(2rem, 9vw, 2.9rem)", fontWeight: 900, color: text, margin: "0 0 10px", lineHeight: 1.05 }}>
            Open Mirror <span style={{ color: "#38BDF8" }}>LLC</span>
          </h1>
          <p style={{ fontSize: 16, fontWeight: 600, color: text, margin: "0 auto", maxWidth: 560, lineHeight: 1.55 }}>
            {STUDIO.welcome}{" "}
            <a href="/about-open-mirror" style={{ color: sub, textDecoration: "underline", textUnderlineOffset: 3 }}>About</a>
          </p>
        </header>

        {/* Four groups named for what a visitor comes to do. CrossHeartPray
            leads the first group and the page, as it always has. */}
        <DoorMeasure />
        {sections.map((s, i) => (
          <section key={s.key} aria-label={s.label} style={{ marginTop: i === 0 ? 0 : 44 }}>
            <GroupLabel>{s.label}</GroupLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {s.items.map((p) => <ProductCard key={p.name} p={p} doorKey={siteKey(p)} />)}
            </div>
          </section>
        ))}

        <p style={{ marginTop: 44, textAlign: "center", fontSize: 14, fontWeight: 600, color: sub }}>
          Want a version of one of these sites for your business or group?{" "}
          <a href="/editions" style={{ color: "#38BDF8", textDecoration: "underline", textUnderlineOffset: 3 }}>Ask about an edition</a>
        </p>

      </div>
    </main>
  );
}
