import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Open Mirror",
  description:
    "Open Mirror begins with CrossHeartPray — the foundation. The rest is the workshop: useful digital projects across faith, family, creativity, and whatever comes next.",
};

type FamilyItem = { emoji: string; name: string; accent: string; text: string; href: string; status?: string };
const family: FamilyItem[] = [
  { emoji: "✝️", name: "CrossHeartPray.com", accent: "#C4B5FD", text: "A daily faith routine — verses, prayer, Daily Hope, Bible Bingo, and source-backed Deep Dive. One project, fully its own thing.", href: "https://crossheartpray.com" },
  { emoji: "🎵", name: "TheDJCares.com", accent: "#A78BFA", text: "Hand-picked Christian music, sermons, podcasts, and encouragement — Gospel first, no algorithm.", href: "https://thedjcares.com" },
  { emoji: "🐶", name: "DontCloneMeTom.com", accent: "#2DD4BF", text: "A rescue-dog campaign with a wagging tail. Don't clone me, Tom — adopt an original.", href: "https://dontclonemetom.com" },
  { emoji: "😂", name: "iDontCry.com", accent: "#38BDF8", text: "Obviously. The family's digital playground. Dad jokes, mini games, and the Dream Lab — dream up anything with AI, free, then step in the ring and build it for real. Absolutely zero crying.", href: "https://idontcry.com" },
  { emoji: "🥊", name: "StepInTheRing.com", accent: "#60A5FA", text: "Turn any idea into a real first plan — with AI as your corner. Free to start.", href: "https://stepinthering.com" },
  { emoji: "🧩", name: "OpenDoku.com", accent: "#7DD3FC", text: "The puzzle-games family. SlopeDoku (winter) and SurfDoku (beach) climb from one easy rule to two full sudokus in every tile. Born on iDontCry, built through StepInTheRing — more dokus to come.", href: "https://opendoku.com" },
  { emoji: "👨‍👩‍👧‍👦", name: "Fambookagram.com", accent: "#C084FC", status: "Parked", text: "Your family's private feed. Photos and moments — no ads, no algorithm, no strangers. (Waitlist.)", href: "https://fambookagram.com" },
  { emoji: "🫂", name: "Friendbookagram.com", accent: "#818CF8", status: "Parked", text: "Where your friends actually stay in touch. Private, calm, invite-only. (Waitlist.)", href: "https://friendbookagram.com" },
  { emoji: "🤖", name: "WhatAmIAI.com", accent: "#E879F9", status: "Prototype", text: "Seven quick questions — mostly taps, not typing — then turn your answers into a reflection prompt for any AI. No labels, no accounts.", href: "https://whatamiai.com" },
  { emoji: "🪞", name: "Reflect", accent: "#93C5FD", status: "Prototype", text: "The five-second version. One prompt, a few honest lines, a little clarity.", href: "/reflect" },
  { emoji: "🎬", name: "WatchedNotWatched.com", accent: "#22D3EE", status: "Prototype", text: "Safer viewing for families — watch what you love, the way you want to. (In development.)", href: "https://watchednotwatched.com" },
  { emoji: "🧰", name: "PleaseBeReady.com", accent: "#34D399", status: "Evergreen", text: "Friendly emergency preparedness for everyone. Calm, practical, one small step at a time — no doomsday.", href: "https://pleasebeready.com" },
];

const groups: { label: string; names: string[] }[] = [
  { label: "Foundation", names: ["CrossHeartPray.com"] },
  { label: "Active Builds", names: ["TheDJCares.com", "DontCloneMeTom.com", "iDontCry.com", "StepInTheRing.com", "OpenDoku.com"] },
  { label: "Playable / Usable Starts", names: ["WatchedNotWatched.com", "WhatAmIAI.com", "Reflect"] },
  { label: "Evergreen + Parked", names: ["PleaseBeReady.com", "Fambookagram.com", "Friendbookagram.com"] },
];

export default function AboutOpenMirror() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-12">

        <section className="mb-12 text-center">
          <div className="mb-5" style={{ fontSize: 30, letterSpacing: 6 }}>✝️ 🤖 🧰 🎵 🐶</div>
          <h1 className="mb-4 text-4xl font-black leading-tight sm:text-5xl">About Open Mirror</h1>
          <p className="mx-auto max-w-lg text-lg font-semibold leading-8 text-[#94a3b8]">
            Open Mirror begins with CrossHeartPray.
          </p>
        </section>

        <section className="mb-10 rounded-3xl border border-[#26324c] bg-[#141d2e] p-7">
          <h2 className="mb-3 text-xl font-black">The short version</h2>
          <p className="mb-4 text-sm font-semibold leading-7 text-[#94a3b8]">
            CrossHeartPray is the foundation: a Bible-first app built around daily Scripture, prayer,
            reflection, and consistency.
          </p>
          <p className="mb-4 text-sm font-semibold leading-7 text-[#94a3b8]">
            The rest of Open Mirror grew from that same foundation — a place to make, test, and
            share useful digital projects across faith, family, creativity, music, writing, web
            apps, and whatever comes next.
          </p>
          <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
            <strong className="text-[#e8edf5]">CrossHeartPray is the anchor. Open Mirror is the workshop.</strong>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-5 text-xl font-black">Every site in the hub</h2>
          {groups.map((g) => (
          <div key={g.label} className="mb-6">
            <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">{g.label}</p>
          <div className="flex flex-col gap-3">
            {family.filter((f) => g.names.includes(f.name)).map((f) => (
              <a
                key={f.name}
                href={f.href}
                {...(f.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="pop flex items-start gap-4 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 transition hover:border-[#1c2740]"
              >
                <span className="text-2xl">{f.emoji}</span>
                <div>
                  <h3 className="text-base font-black">
                    {f.name.endsWith(".com") ? (
                      <>
                        {f.name.slice(0, -4)}
                        <span style={{ color: f.accent }}>.com</span>
                      </>
                    ) : (
                      f.name
                    )}
                  </h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">{f.text}</p>
                </div>
                {f.status ? (
                  <span className="ml-auto shrink-0 self-start rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em]" style={{ color: f.accent, borderColor: `${f.accent}55` }}>{f.status}</span>
                ) : null}
              </a>
            ))}
          </div>
          </div>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="mb-2 text-xl font-black">Free resources</h2>
          <p className="mb-4 text-sm font-semibold text-[#94a3b8]">
            What we share, and the free tools and data our sites are built on — credit where credit is due.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="/resources/52-week-bible-reading-plan.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="pop flex items-start gap-4 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 transition hover:border-[#1c2740]"
            >
              <span className="text-2xl">📖</span>
              <div>
                <h3 className="text-base font-black">Bible Reading Plan <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8]">PDF</span></h3>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">A 52-week plan to read through the Bible — print it or keep it on your phone.</p>
              </div>
            </a>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {[
              { name: "52-Week Bible Reading Plan", credit: "© 1995–2009 Michael Coley, Bible-Reading.com — used with permission (CrossHeartPray)", href: "http://www.bible-reading.com" },
              { name: "Life Essentials · Bible Principles", credit: "Dr. Gene Getz / B&H Publishing — principles & official videos (CrossHeartPray, TheDJCares)", href: "https://bibleprinciples.org" },
              { name: "YouVersion Bible App", credit: "bible.com — verse and chapter links across the family", href: "https://www.bible.com" },
              { name: "BibleHub", credit: "Original-language and Strong's references (CrossHeartPray Deep Dive)", href: "https://biblehub.com" },
              { name: "RescueGroups.org", credit: "Free adoptable-pets API behind DontCloneMeTom's live dogs", href: "https://rescuegroups.org" },
              { name: "Petfinder & Adopt-a-Pet", credit: "Adoption searches linked from DontCloneMeTom", href: "https://www.petfinder.com" },
              { name: "YouTube", credit: "Video and music embeds (TheDJCares, iDontCry)", href: "https://www.youtube.com" },
            ].map((r) => (
              <a
                key={r.name}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#26324c] bg-[#141d2e] px-4 py-3 transition hover:border-[#1c2740]"
              >
                <span className="text-sm font-black text-[#e8edf5]">{r.name}</span>
                <span className="block text-xs font-semibold leading-5 text-[#94a3b8]">{r.credit}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-3xl border border-[#26324c] bg-[#141d2e] p-7 text-center">
          <p className="text-base font-semibold leading-8 text-[#94a3b8]">
            <strong className="text-[#e8edf5]">Start with faith. Build from there.</strong>
            {" "}Games, tools, and sites for the whole family.
          </p>
          <p className="mt-4">
            <a href="mailto:ask@openmirrorllc.com" className="text-sm font-black text-[#7dd3fc]">
              Contact us
            </a>
          </p>
        </section>

      </div>
    </main>
  );
}
