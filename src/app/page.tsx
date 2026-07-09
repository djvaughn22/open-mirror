
type Project = { name: string; emoji: string; tagline: string; status?: string; accent: string; href: string; links?: { label: string; href: string }[] };

// Grouped by current status. Names, taglines, links and accents unchanged —
// only grouping, order, and status badges.
const foundation: Project[] = [
  { name: "CrossHeartPray", emoji: "✝️", tagline: "Bible Bingo, Daily Hope, a reading plan, and Deep Dive with Gene Getz's Life Essentials — your daily faith routine.", accent: "#C4B5FD", href: "https://crossheartpray.com" },
];

const active: Project[] = [
  { name: "TheDJCares", emoji: "🎵", tagline: "Hand-picked music, sermons, podcasts, and encouragement — Gospel first.", accent: "#A78BFA", href: "https://thedjcares.com" },
  { name: "DontCloneMeTom", emoji: "🐶", tagline: "Real adoptable dogs looking for homes — meet them right on the page. A kind rescue campaign.", accent: "#2DD4BF", href: "https://dontclonemetom.com" },
  { name: "iDontCry", emoji: "😂", tagline: "The family's playground — dad jokes, games, and a Dream Lab to create anything with AI, free.", accent: "#38BDF8", href: "https://idontcry.com" },
  { name: "StepInTheRing", emoji: "🥊", tagline: "Take any idea — even one you dreamed up on iDontCry — and turn it into a real first build. AI in your corner.", accent: "#60A5FA", href: "https://stepinthering.com" },
  { name: "OpenDoku", emoji: "🧩", tagline: "Puzzle games that start easy and climb to two puzzles in every tile — same brain, different weather. More dokus on the way.", accent: "#7DD3FC", href: "https://opendoku.com",
    links: [
      { label: "🏔️ SlopeDoku", href: "https://opendoku.com/slopedoku/" },
      { label: "🌞 SurfDoku", href: "https://opendoku.com/surfdoku/" },
    ] },
];

const starts: Project[] = [
  { name: "WatchedNotWatched", emoji: "🎬", tagline: "Safer viewing for families — watch what you love, the way you want to.", status: "Prototype", accent: "#22D3EE", href: "https://watchednotwatched.com" },
  { name: "WhatAmIAI", emoji: "🤖", tagline: "Seven quick questions, then patterns worth noticing. No labels — you're not a category.", status: "Prototype", accent: "#E879F9", href: "https://whatamiai.com" },
  { name: "Reflect", emoji: "🪞", tagline: "A quiet minute — one honest prompt, then a few things to sit with.", status: "Prototype", accent: "#93C5FD", href: "/reflect" },
];

const parked: Project[] = [
  { name: "PleaseBeReady", emoji: "🧰", tagline: "Friendly emergency prep for everyone. Calm, practical, one step at a time.", status: "Evergreen", accent: "#34D399", href: "https://pleasebeready.com" },
  { name: "Fambookagram", emoji: "👨‍👩‍👧‍👦", tagline: "Your family's private feed. Photos and moments — no ads, no algorithm, no strangers.", status: "Parked", accent: "#C084FC", href: "https://fambookagram.com" },
  { name: "Friendbookagram", emoji: "🫂", tagline: "Where your friends actually stay in touch. Private, calm, invite-only.", status: "Parked", accent: "#818CF8", href: "https://friendbookagram.com" },
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
  if (p.links) {
    // card with direct game links: stretched main link + real pills on top
    return (
      <div className="pop" style={{ position: "relative", background: card, border: `1px solid ${border}`, borderLeft: `5px solid ${p.accent}`, borderRadius: 18, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
        <a href={p.href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.name}${dot}`} style={{ position: "absolute", inset: 0, borderRadius: 18 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <span style={{ flexShrink: 0, height: 46, width: 46, borderRadius: 14, background: p.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{p.emoji}</span>
          {p.status ? (
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: p.accent, border: `1px solid ${p.accent}55`, background: "transparent", borderRadius: 50, padding: "3px 10px", flexShrink: 0 }}>{p.status}</span>
          ) : null}
        </div>
        <h2 style={{ fontSize: "clamp(1rem, 5.2vw, 1.4rem)", fontWeight: 900, color: text, margin: 0, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
          {p.name}{isCom && <span style={{ color: p.accent }}>{dot}</span>}
        </h2>
        <p style={{ fontSize: 14.5, color: sub, margin: 0, lineHeight: 1.55 }}>{p.tagline}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          {p.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" style={{ background: p.accent, color: "#0C0C0C", borderRadius: 50, padding: "9px 18px", fontSize: 14, fontWeight: 900, textDecoration: "none" }}>
              {l.label} →
            </a>
          ))}
        </div>
      </div>
    );
  }
  return (
    <a href={p.href} {...(isCom ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={{ textDecoration: "none" }}>
      <div className="pop" style={{ background: card, border: `1px solid ${border}`, borderLeft: `5px solid ${p.accent}`, borderRadius: 18, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12, cursor: "pointer" }}>
        {/* Icon on top, status to the right — frees the full width for the name */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <span style={{ flexShrink: 0, height: 46, width: 46, borderRadius: 14, background: p.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{p.emoji}</span>
          {p.status ? (
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: p.accent, border: `1px solid ${p.accent}55`, background: "transparent", borderRadius: 50, padding: "3px 10px", flexShrink: 0 }}>{p.status}</span>
          ) : null}
        </div>
        {/* Domain always on one line — font scales down on narrow phones so it fits */}
        <h2 style={{ fontSize: "clamp(1rem, 5.2vw, 1.4rem)", fontWeight: 900, color: text, margin: 0, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
          {p.name}{isCom && <span style={{ color: p.accent }}>{dot}</span>}
        </h2>
        <p style={{ fontSize: 14.5, color: sub, margin: 0, lineHeight: 1.55 }}>{p.tagline}</p>
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
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "44px 24px 90px" }}>

        <header style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ fontSize: 30, marginBottom: 14, letterSpacing: 6 }}>✝️ 🤖 🧰 🎵 🐶</div>
          <h1 style={{ fontSize: 46, fontWeight: 900, color: text, margin: "0 0 10px", lineHeight: 1.05 }}>
            Open Mirror <span style={{ color: "#38BDF8" }}>LLC</span>
          </h1>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#93C5FD", margin: 0, letterSpacing: "0.02em" }}>
            Choose your own adventure
          </p>
        </header>

        <div>
          <GroupLabel>Foundation</GroupLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {foundation.map((p) => <Card key={p.name} p={p} />)}
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <GroupLabel>Active Builds</GroupLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {active.map((p) => <Card key={p.name} p={p} />)}
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <GroupLabel>Playable / Usable Starts</GroupLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {starts.map((p) => <Card key={p.name} p={p} />)}
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <GroupLabel>Evergreen + Parked</GroupLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {parked.map((p) => <Card key={p.name} p={p} />)}
          </div>
        </div>

      </div>
    </main>
  );
}
