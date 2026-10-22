import type { Metadata } from "next";
import DoorMeasure from "../components/DoorMeasure";
import ProductCard from "../components/ProductCard";
import {
  BOTTOM_PIN_LABEL,
  bottomPinnedProducts,
  doorProducts,
  foundationProduct,
  products,
  homeSections,
  STUDIO,
} from "../lib/products";

export const metadata: Metadata = {
  description: STUDIO.welcome,
  openGraph: {
    siteName: STUDIO.name,
    title: `${STUDIO.name} — ${STUDIO.label}`,
    description: STUDIO.welcome,
    url: STUDIO.url,
    type: "website",
  },
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
  const foundation = foundationProduct();
  const sections = homeSections()
    .map((s) => ({ ...s, items: s.items.filter((p) => p !== foundation) }))
    .filter((s) => s.items.length > 0);
  const pinned = bottomPinnedProducts();
  const doors = doorProducts();

  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "44px 24px 90px" }}>

        {/* Quiet header: the name and one welcoming line. The fuller purpose
            lives on About, never here as a block (owner, 2026-10-08). */}
        <header style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: "clamp(2rem, 9vw, 2.9rem)", fontWeight: 900, color: text, margin: "0 0 8px", lineHeight: 1.05 }}>
            Welcome to Open Mirror <span style={{ color: "#38BDF8" }}>LLC</span>
          </h1>
          <p style={{ fontSize: 14, fontWeight: 600, color: sub, margin: 0 }}>
            {STUDIO.welcome} <a href="/about-open-mirror" style={{ color: sub, textDecoration: "underline", textUnderlineOffset: 3 }}>About</a>
          </p>
        </header>

        {foundation && (
          <section aria-label="CrossHeartPray" style={{ marginBottom: 18 }}>
            <ProductCard p={foundation} />
          </section>
        )}

        <section aria-label="Family and making things" style={{ marginBottom: 44 }}>
          <DoorMeasure />
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {doors.map((d) => {
              const product = products.find((p) => p.name === d.product)!;
              return <ProductCard key={d.key} p={{ ...product, emoji: d.icon, description: d.line }} subtitle={d.title} doorKey={d.key} />;
            })}
          </div>
        </section>

        {sections.map((s, i) => (
          <section key={s.key} aria-label={s.label} style={{ marginTop: i === 0 ? 0 : 44 }}>
            <GroupLabel>{s.label}</GroupLabel>
            {s.note && (
              <p style={{ fontSize: 13, fontWeight: 600, color: sub, margin: "-6px 0 18px", lineHeight: 1.6 }}>{s.note}</p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {s.items.map((p) => <ProductCard key={p.name} p={p} />)}
            </div>
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
