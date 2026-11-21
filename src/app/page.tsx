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
  const { hero } = STUDIO;

  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Hero (owner direction 2026-11-20, night): the Open Mirror identity, one plain sentence
          about what the studio makes, and one action into the directory. No sales copy
          here; the fuller story is on About. Classes in globals.css ("Homepage hero"). */}
      <section className="om-hero" aria-labelledby="om-hero-title">
        <h1 id="om-hero-title" className="om-hero-title">Open Mirror <span className="om-hero-llc">LLC</span></h1>
        <p className="om-hero-lede">{hero.lede}</p>
        <a href={hero.primary.href} className="om-hero-primary">{hero.primary.label}</a>
      </section>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "8px 24px 90px" }}>

        {/* The directory. "Explore the apps" lands here. The hero already says what the studio
            makes, so this header is just the heading and a pointer to the fuller story on About. */}
        <header id="projects" className="om-projects-head">
          <h2 className="om-projects-title">The apps</h2>
          <p className="om-projects-intro">
            Each site has its own name and purpose. All are welcome.{" "}
            <a href="/about-open-mirror" style={{ color: sub, textDecoration: "underline", textUnderlineOffset: 3 }}>About the studio</a>
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
      </div>
    </main>
  );
}
