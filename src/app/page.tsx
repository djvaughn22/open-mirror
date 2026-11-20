import type { Metadata } from "next";
import Image from "next/image";
import DoorMeasure from "../components/DoorMeasure";
import ProductCard from "../components/ProductCard";
import { homeSections, products, siteKey, STUDIO } from "../lib/products";

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
  const shown = products.find((p) => p.name === hero.preview.product);

  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Hero (owner brief 2026-11-19): what the studio makes and where to go, left-aligned with one
          real product beside it on wide screens; headline and actions first on phones. Classes in
          globals.css ("Homepage hero") so both themes follow the --om-* tokens. */}
      <section className="om-hero" aria-labelledby="om-hero-title">
        <div className="om-hero-copy">
          <p className="om-hero-eyebrow">{hero.eyebrow}</p>
          <h1 id="om-hero-title" className="om-hero-title">{hero.title}</h1>
          <p className="om-hero-lede">{hero.lede}</p>
          <div className="om-hero-actions">
            <a href={hero.primary.href} className="om-hero-primary">{hero.primary.label}</a>
            <a href={hero.secondary.href} className="om-hero-secondary">{hero.secondary.label} <span aria-hidden>→</span></a>
          </div>
        </div>
        {shown && (
          <figure className="om-hero-preview">
            <a href={shown.href} className="om-hero-phone" aria-label={`${shown.name}: ${hero.preview.caption}`}>
              <Image className="om-hero-shot om-hero-shot-dark" src={hero.preview.dark} width={hero.preview.width} height={hero.preview.height} sizes="300px" alt={hero.preview.alt} />
              <Image className="om-hero-shot om-hero-shot-light" src={hero.preview.light} width={hero.preview.width} height={hero.preview.height} sizes="300px" alt={hero.preview.alt} />
            </a>
            <figcaption className="om-hero-caption"><a href={shown.href}>{shown.name}</a> · {hero.preview.caption}</figcaption>
          </figure>
        )}
      </section>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "8px 24px 90px" }}>

        {/* The directory. "Explore our projects" lands here; the welcome line (2026-11-14, family
            history named 2026-11-19) introduces it instead of filling the hero. */}
        <header id="projects" className="om-projects-head">
          <h2 className="om-projects-title">Our projects</h2>
          <p className="om-projects-intro">
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
