import OpenMirrorNav from "../components/OpenMirrorNav";

type Project = { name: string; emoji: string; tagline: string; status: string; accent: string; href: string };

const live: Project[] = [
  { name: "CrossHeartPray", emoji: "✝️", tagline: "Verses, prayer, Daily Hope, and Bible Bingo — your daily faith routine.", status: "Live", accent: "#4ADE80", href: "https://crossheartpray.com" },
  { name: "TheDJCares", emoji: "🎵", tagline: "Hand-picked music, sermons, podcasts, and encouragement — Gospel first.", status: "Live", accent: "#A78BFA", href: "https://thedjcares.com" },
  { name: "DontCloneMeTom", emoji: "🐶", tagline: "Don't clone me, Tom — adopt an original. A rescue campaign with a wagging tail.", status: "Live", accent: "#2DD4BF", href: "https://dontclonemetom.com" },
  { name: "iDontCry", emoji: "😂", tagline: "The family's digital playground. Dad jokes, mini games, zero crying.", status: "Live", accent: "#38BDF8", href: "https://idontcry.com" },
  { name: "StepInTheRing", emoji: "🥊", tagline: "Turn any idea into a real first plan — with AI as your corner. Free to start.", status: "Live", accent: "#38BDF8", href: "https://stepinthering.com" },
];

const soon: Project[] = [
  { name: "Fambookagram", emoji: "👨‍👩‍👧‍👦", tagline: "Your family's private feed. Photos and moments — no ads, no algorithm, no strangers.", status: "Coming Soon", accent: "#C084FC", href: "https://fambookagram.com" },
  { name: "Friendbookagram", emoji: "🫂", tagline: "Where your friends actually stay in touch. Private, calm, invite-only.", status: "Coming Soon", accent: "#818CF8", href: "https://friendbookagram.com" },
];

const reflect: Project[] = [
  { name: "WhatAmIAI", emoji: "🤖", tagline: "Seven quick questions, then a real reflection with a verse or two matched to you.", status: "Live", accent: "#A78BFA", href: "https://whatamiai.com" },
  { name: "Reflect", emoji: "🪞", tagline: "A quiet minute — one prompt, then Scripture matched to what you wrote.", status: "Live", accent: "#93C5FD", href: "/reflect" },
];

// Still being figured out, plus PleaseBeReady parked at the very bottom.
const more: Project[] = [
  { name: "WatchedNotWatched", emoji: "🎬", tagline: "Safer viewing for families — watch what you love, the way you want to.", status: "In Dev", accent: "#22D3EE", href: "https://watchednotwatched.com" },
  { name: "PleaseBeReady", emoji: "🧰", tagline: "Friendly emergency prep for everyone. Calm, practical, one step at a time.", status: "Live", accent: "#34D399", href: "https://pleasebeready.com" },
];

// Cool, flat palette — matched to CrossHeartPray / TheDJCares so the family feels connected.
const bg = "#0b1220";
const card = "#141d2e";
const border = "#26324c";
const text = "#e8edf5";
const sub = "#94a3b8";

function Card({ p }: { p: Project }) {
  const isCom = p.href.startsWith("http");
  const dot = isCom ? ".com" : "";
  return (
    <a href={p.href} {...(isCom ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={{ textDecoration: "none" }}>
      <div className="pop" style={{ background: card, border: `1px solid ${border}`, borderLeft: `5px solid ${p.accent}`, borderRadius: 18, padding: "20px 22px", display: "flex", gap: 16, alignItems: "flex-start", cursor: "pointer" }}>
        <span style={{ flexShrink: 0, height: 46, width: 46, borderRadius: 14, background: p.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{p.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: text, margin: 0, letterSpacing: "-0.01em" }}>
              {p.name}{isCom && <span style={{ color: p.accent }}>{dot}</span>}
            </h2>
            <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#0C0C0C", background: p.accent, borderRadius: 50, padding: "3px 10px", flexShrink: 0 }}>{p.status}</span>
          </div>
          <p style={{ fontSize: 14.5, color: sub, margin: "6px 0 14px", lineHeight: 1.55 }}>{p.tagline}</p>
          <span style={{ display: "inline-block", background: p.accent, color: "#0C0C0C", borderRadius: 50, padding: "8px 18px", fontSize: 13, fontWeight: 900 }}>
            Open {p.name}{dot} →
          </span>
        </div>
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
  return (
    <main style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <OpenMirrorNav />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "44px 24px 90px" }}>

        <header style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ fontSize: 30, marginBottom: 14, letterSpacing: 6 }}>✝️ 🤖 🧰 🎵 🐶</div>
          <h1 style={{ fontSize: 46, fontWeight: 900, color: text, margin: "0 0 10px", lineHeight: 1.05 }}>
            Open Mirror <span style={{ color: "#38BDF8" }}>LLC</span>
          </h1>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#93C5FD", margin: 0, letterSpacing: "0.02em" }}>
            Choose your own adventure.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {live.map((p) => <Card key={p.name} p={p} />)}
        </div>

        <div style={{ marginTop: 44 }}>
          <GroupLabel>🔜 Coming Soon</GroupLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {soon.map((p) => <Card key={p.name} p={p} />)}
          </div>
        </div>

        <div style={{ marginTop: 44 }}>
          <GroupLabel>🪞 Reflect with AI</GroupLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {reflect.map((p) => <Card key={p.name} p={p} />)}
          </div>
        </div>

        <div style={{ marginTop: 44 }}>
          <GroupLabel>✨ More from Open Mirror</GroupLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {more.map((p) => <Card key={p.name} p={p} />)}
          </div>
        </div>

        <footer style={{ marginTop: 56, textAlign: "center", borderTop: `1px solid ${border}`, paddingTop: 28 }}>
          <p style={{ fontSize: 13, color: sub, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 6px" }}>
            Open Mirror LLC — built project by project
          </p>
          <a href="/about-open-mirror" style={{ fontSize: 13, fontWeight: 800, color: "#38BDF8", textDecoration: "none" }}>About Open Mirror →</a>
        </footer>
      </div>
    </main>
  );
}
