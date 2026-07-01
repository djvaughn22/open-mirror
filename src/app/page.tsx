import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Mirror LLC",
  description: "Open Mirror LLC builds simple web apps with heart, purpose, and real-world usefulness.",
};

const projects = [
  {
    name: "CrossHeartPray",
    emoji: "✝️",
    tagline: "Bible verses, prayer, Daily Hope, and Bible Bingo — your daily faith routine.",
    status: "Live",
    color: "#059669",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    href: "https://crossheartpray.com",
    cta: "Open CrossHeartPray",
  },
  {
    name: "Reflect",
    emoji: "🪞",
    tagline: "Read a verse. Sit with it. Write what you notice. Simple and quiet.",
    status: "Live",
    color: "#059669",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    href: "https://crossheartpray.com/reflect",
    cta: "Open Reflect",
  },
  {
    name: "WhatAmIAI",
    emoji: "🤖",
    tagline: "A Gospel-first reflection tool — AI asks questions, you find your own answers.",
    status: "Coming Soon",
    color: "#7C3AED",
    bg: "#FAF5FF",
    border: "#DDD6FE",
    href: "https://whatamiai.com",
    cta: "View WhatAmIAI",
  },
  {
    name: "theDJcares",
    emoji: "🎵",
    tagline: "Music, sermons, podcasts, churches, and encouragement — Gospel first.",
    status: "Coming Soon",
    color: "#BE185D",
    bg: "#FFF1F2",
    border: "#FECDD3",
    href: "https://thedjcares.com",
    cta: "View theDJcares",
  },
  {
    name: "Step In The Ring",
    emoji: "🥊",
    tagline: "Turn any idea into a real first plan — with AI as your partner. Free to start.",
    status: "Live",
    color: "#EA580C",
    bg: "#FFF7ED",
    border: "#FED7AA",
    href: "https://step-in-the-ring.vercel.app",
    cta: "Open Step In The Ring",
  },
  {
    name: "Watched Not Watched",
    emoji: "🎬",
    tagline: "Safer viewing for families — watch what you love, the way you want to watch it.",
    status: "In Development",
    color: "#0284C7",
    bg: "#F0F9FF",
    border: "#BAE6FD",
    href: "https://watchednotwatched.com",
    cta: "View Project",
  },
  {
    name: "iDontCry",
    emoji: "💙",
    tagline: "Honest healing. For grief, hard moments, and the feelings you carry alone.",
    status: "Coming Soon",
    color: "#4338CA",
    bg: "#EEF2FF",
    border: "#C7D2FE",
    href: "https://idontcry.com",
    cta: "View Project",
  },
  {
    name: "DontCloneMeTom",
    emoji: "🐶",
    tagline: "Rescue dogs are waiting. Original, one-of-a-kind, ready to love you.",
    status: "Campaign",
    color: "#92400E",
    bg: "#FFFBEB",
    border: "#FDE68A",
    href: "/dont-clone-me-tom",
    cta: "View Campaign",
    internal: true,
  },
];

export default function OpenMirrorHub() {
  return (
    <main style={{ background: "#FEFCF9", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px 80px" }}>

        <header style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🪞</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#1C1917", margin: "0 0 16px", lineHeight: 1.1 }}>
            Open Mirror LLC
          </h1>
          <p style={{ fontSize: 18, color: "#57534E", lineHeight: 1.7, margin: 0, maxWidth: 480, marginInline: "auto" }}>
            Simple apps built with heart, purpose, and real usefulness —
            for everyone, every age, every walk of life.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {projects.map((p) => {
            const card = (
              <div style={{
                background: p.bg,
                border: `2px solid ${p.border}`,
                borderRadius: 20,
                padding: "24px 28px",
                cursor: "pointer",
                transition: "transform 0.1s",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 32, flexShrink: 0 }}>{p.emoji}</span>
                    <div>
                      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1C1917", margin: "0 0 6px", lineHeight: 1.2 }}>
                        {p.name}
                      </h2>
                      <p style={{ fontSize: 16, color: "#57534E", margin: 0, lineHeight: 1.6 }}>
                        {p.tagline}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: p.color,
                    flexShrink: 0,
                    paddingTop: 4,
                  }}>
                    {p.status}
                  </span>
                </div>
                <div style={{ marginTop: 18 }}>
                  <span style={{
                    display: "inline-block",
                    background: p.color,
                    color: "#fff",
                    borderRadius: 50,
                    padding: "10px 22px",
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: "0.02em",
                  }}>
                    {p.cta} →
                  </span>
                </div>
              </div>
            );

            return p.internal ? (
              <Link key={p.name} href={p.href} style={{ textDecoration: "none" }}>
                {card}
              </Link>
            ) : (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                {card}
              </a>
            );
          })}
        </div>

        <footer style={{ marginTop: 64, textAlign: "center", borderTop: "1px solid #E7E5E4", paddingTop: 32 }}>
          <p style={{ fontSize: 14, color: "#A8A29E", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
            Open Mirror LLC — Built project by project.
          </p>
        </footer>
      </div>
    </main>
  );
}
