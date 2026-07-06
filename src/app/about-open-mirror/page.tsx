import type { Metadata } from "next";
import Link from "next/link";
import OpenMirrorNav from "../../components/OpenMirrorNav";

export const metadata: Metadata = {
  title: "About Open Mirror",
  description:
    "Open Mirror LLC builds simple tools that help people see clearly, reflect honestly, and take the next useful step. CrossHeartPray is one of them — not all of them.",
};

const family = [
  { emoji: "✝️", name: "CrossHeartPray.com", text: "A daily faith routine — verses, prayer, Daily Hope, Bible Bingo, and source-backed Deep Dive. One project, fully its own thing.", href: "https://crossheartpray.com" },
  { emoji: "🎵", name: "TheDJCares.com", text: "Hand-picked Christian music, sermons, podcasts, and encouragement — Gospel first, no algorithm.", href: "https://thedjcares.com" },
  { emoji: "🐶", name: "DontCloneMeTom.com", text: "A rescue-dog campaign with a wagging tail. Don't clone me, Tom — adopt an original.", href: "https://dontclonemetom.com" },
  { emoji: "😂", name: "iDontCry.com", text: "The family's digital playground. Dad jokes, mini games, and absolutely zero crying.", href: "https://idontcry.com" },
  { emoji: "🥊", name: "StepInTheRing.com", text: "Turn any idea into a real first plan — with AI as your corner. Free to start.", href: "https://stepinthering.com" },
  { emoji: "👨‍👩‍👧‍👦", name: "Fambookagram.com", text: "Your family's private feed. Photos and moments — no ads, no algorithm, no strangers. (Waitlist.)", href: "https://fambookagram.com" },
  { emoji: "🫂", name: "Friendbookagram.com", text: "Where your friends actually stay in touch. Private, calm, invite-only. (Waitlist.)", href: "https://friendbookagram.com" },
  { emoji: "🤖", name: "WhatAmIAI.com", text: "Seven quick questions, then a real reflection with a verse or two matched to what you shared.", href: "https://whatamiai.com" },
  { emoji: "🪞", name: "Reflect", text: "The five-second version. One prompt, then Scripture matched to what you wrote.", href: "/reflect" },
  { emoji: "🎬", name: "WatchedNotWatched.com", text: "Safer viewing for families — watch what you love, the way you want to. (In development.)", href: "https://watchednotwatched.com" },
  { emoji: "🧰", name: "PleaseBeReady.com", text: "Friendly emergency preparedness for everyone. Calm, practical, one small step at a time — no doomsday.", href: "https://pleasebeready.com" },
];

export default function AboutOpenMirror() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <OpenMirrorNav />
      <div className="mx-auto max-w-2xl px-5 py-12">

        <section className="mb-12 text-center">
          <div className="mb-5" style={{ fontSize: 30, letterSpacing: 6 }}>✝️ 🤖 🧰 🎵 🐶</div>
          <h1 className="mb-4 text-4xl font-black leading-tight sm:text-5xl">About Open Mirror</h1>
          <p className="mx-auto max-w-lg text-lg font-semibold leading-8 text-[#94a3b8]">
            Open Mirror LLC builds simple tools that help people see clearly, reflect honestly,
            and take the next useful step. Each one is small, honest, and built to actually help.
          </p>
        </section>

        <section className="mb-10 rounded-3xl border border-[#26324c] bg-[#141d2e] p-7">
          <h2 className="mb-3 text-xl font-black">The short version</h2>
          <p className="mb-4 text-sm font-semibold leading-7 text-[#94a3b8]">
            Most software wants your attention. Ours wants to give you a minute of clarity and then
            get out of the way. Each Open Mirror tool does one small thing well: help you think,
            find a bit of hope, or take a practical next step.
          </p>
          <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
            <strong className="text-[#e8edf5]">CrossHeartPray is one Open Mirror project — but Open Mirror is not only CrossHeartPray.</strong>{" "}
            It&apos;s a small family of tools, and it&apos;s still growing.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-2 text-xl font-black">Every site in the family</h2>
          <p className="mb-5 text-sm font-semibold text-[#94a3b8]">Reflection tools, faith tools, prep, and a few that just make people smile.</p>
          <div className="flex flex-col gap-3">
            {family.map((f) => (
              <a
                key={f.name}
                href={f.href}
                {...(f.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="pop flex items-start gap-4 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 transition hover:border-[#1c2740]"
              >
                <span className="text-2xl">{f.emoji}</span>
                <div>
                  <h3 className="text-base font-black">{f.name}</h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">{f.text}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-2 text-xl font-black">Free resources</h2>
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
        </section>

        <section className="mb-12 rounded-3xl border border-[#26324c] bg-[#141d2e] p-7 text-center">
          <p className="text-base font-semibold leading-8 text-[#94a3b8]">
            Tools that help you <strong className="text-[#e8edf5]">see clearly, reflect honestly, build better, and take the next useful step.</strong>
            {" "}That&apos;s the whole idea.
          </p>
        </section>

        <footer className="border-t border-[#26324c] pt-8 text-center">
          <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8] transition hover:text-[#e8edf5]">
            ← Open Mirror Home
          </Link>
        </footer>

      </div>
    </main>
  );
}
