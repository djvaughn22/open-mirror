"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const projects = [
  {
    name: "CrossHeartPray",
    emoji: "✝️",
    tagline: "Bible verses, prayer, Daily Hope, and Bible Bingo — your daily faith routine.",
    status: "Live",
    accent: "#4ADE80",
    cardDark: "#0A1F12",
    cardLight: "#F0FDF4",
    borderDark: "#1A3A22",
    borderLight: "#BBF7D0",
    href: "https://crossheartpray.com",
  },
  {
    name: "Reflect",
    emoji: "🪞",
    tagline: "Read a verse. Sit with it. Write what you notice. Simple and quiet.",
    status: "Live",
    accent: "#4ADE80",
    cardDark: "#0A1F12",
    cardLight: "#F0FDF4",
    borderDark: "#1A3A22",
    borderLight: "#BBF7D0",
    href: "https://crossheartpray.com/reflect",
  },
  {
    name: "WhatAmIAI",
    emoji: "🤖",
    tagline: "A Gospel-first reflection tool — AI asks questions, you find your own answers.",
    status: "Live",
    accent: "#A78BFA",
    cardDark: "#130F20",
    cardLight: "#FAF5FF",
    borderDark: "#2A1F40",
    borderLight: "#DDD6FE",
    href: "https://whatamiai.com",
  },
  {
    name: "theDJcares",
    emoji: "🎵",
    tagline: "Music, sermons, podcasts, churches, and encouragement — Gospel first.",
    status: "Live",
    accent: "#FB7185",
    cardDark: "#1F0A10",
    cardLight: "#FFF1F2",
    borderDark: "#3A1520",
    borderLight: "#FECDD3",
    href: "https://thedjcares.com",
  },
  {
    name: "Step In The Ring",
    emoji: "🥊",
    tagline: "Turn any idea into a real first plan — with AI as your partner. Free to start.",
    status: "Live",
    accent: "#FB923C",
    cardDark: "#1F1108",
    cardLight: "#FFF7ED",
    borderDark: "#3A2010",
    borderLight: "#FED7AA",
    href: "https://step-in-the-ring.vercel.app",
  },
  {
    name: "Watched Not Watched",
    emoji: "🎬",
    tagline: "Safer viewing for families — watch what you love, the way you want to watch it.",
    status: "In Dev",
    accent: "#38BDF8",
    cardDark: "#071520",
    cardLight: "#F0F9FF",
    borderDark: "#0E2A3A",
    borderLight: "#BAE6FD",
    href: "https://watchednotwatched.com",
  },
  {
    name: "iDontCry",
    emoji: "😭",
    tagline: "The Vaughn Family's Digital Playground. Dad jokes, mini games, and absolutely zero crying.",
    status: "Live",
    accent: "#818CF8",
    cardDark: "#0D0F20",
    cardLight: "#EEF2FF",
    borderDark: "#1A1F3A",
    borderLight: "#C7D2FE",
    href: "https://idontcry.com",
  },
  {
    name: "DontCloneMeTom",
    emoji: "🐶",
    tagline: "Rescue dogs are waiting. Original, one-of-a-kind, ready to love you.",
    status: "Campaign",
    accent: "#FBBF24",
    cardDark: "#1A1400",
    cardLight: "#FFFBEB",
    borderDark: "#332800",
    borderLight: "#FDE68A",
    href: "/dont-clone-me-tom",
    internal: true,
  },
];

export default function OpenMirrorHub() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("om-theme");
    if (saved) setDark(saved === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("om-theme", next ? "dark" : "light");
  };

  const bg = dark ? "#0C0C0C" : "#FEFCF9";
  const text = dark ? "#F5F0E8" : "#1C1917";
  const sub = dark ? "#8A8078" : "#57534E";
  const footerBorder = dark ? "#1E1E1E" : "#E7E5E4";
  const footerText = dark ? "#4A4540" : "#A8A29E";

  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", transition: "background 0.2s" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px 80px" }}>

        <header style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
            <button onClick={toggle} aria-label="Toggle theme" style={{
              background: "none", border: `1px solid ${footerBorder}`, borderRadius: 50,
              padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              color: sub, letterSpacing: "0.04em",
            }}>
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🪞</div>
          <h1 style={{ fontSize: 38, fontWeight: 900, color: text, margin: "0 0 16px", lineHeight: 1.05 }}>
            Open Mirror LLC
          </h1>
          <p style={{ fontSize: 18, color: sub, lineHeight: 1.75, margin: 0, maxWidth: 460, marginInline: "auto" }}>
            Simple apps built with heart, purpose, and real usefulness — for everyone, every age, every walk of life.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {projects.map((p) => {
            const card = (
              <div style={{
                background: dark ? p.cardDark : p.cardLight,
                border: `2px solid ${dark ? p.borderDark : p.borderLight}`,
                borderRadius: 20,
                padding: "22px 26px",
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 30, flexShrink: 0, marginTop: 2 }}>{p.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                      <h2 style={{ fontSize: 20, fontWeight: 800, color: text, margin: 0 }}>{p.name}</h2>
                      <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: p.accent, flexShrink: 0 }}>{p.status}</span>
                    </div>
                    <p style={{ fontSize: 15, color: sub, margin: "6px 0 14px", lineHeight: 1.6 }}>{p.tagline}</p>
                    <span style={{
                      display: "inline-block", background: p.accent, color: "#0C0C0C",
                      borderRadius: 50, padding: "8px 20px", fontSize: 13, fontWeight: 800,
                    }}>
                      Open {p.name} →
                    </span>
                  </div>
                </div>
              </div>
            );

            return p.internal ? (
              <Link key={p.name} href={p.href} target="_blank" style={{ textDecoration: "none" }}>{card}</Link>
            ) : (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{card}</a>
            );
          })}
        </div>

        <footer style={{ marginTop: 60, textAlign: "center", borderTop: `1px solid ${footerBorder}`, paddingTop: 28 }}>
          <p style={{ fontSize: 13, color: footerText, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
            Open Mirror LLC — Built project by project.
          </p>
        </footer>
      </div>
    </main>
  );
}
