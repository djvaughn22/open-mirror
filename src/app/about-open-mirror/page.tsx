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
  { emoji: "🤖", name: "WhatAmIAI.com", text: "A self-reflection tool. Seven quick questions, a reflection back, then a prompt for any AI. Won't put you in a box.", href: "https://whatamiai.com" },
  { emoji: "🪞", name: "Reflect", text: "The five-second version. One prompt, a few honest lines, a little clarity. That's it.", href: "/reflect" },
  { emoji: "🧰", name: "PleaseBeReady.com", text: "Friendly emergency preparedness for everyone. Calm, practical, one small step at a time — no doomsday.", href: "https://pleasebeready.com" },
  { emoji: "🎵", name: "TheDJCares.com", text: "Hand-picked Christian music, sermons, podcasts, and encouragement — Gospel first, no algorithm.", href: "https://thedjcares.com" },
  { emoji: "🐶", name: "DontCloneMeTom.com", text: "A rescue-dog campaign with a wagging tail. Don't clone me, Tom — adopt an original.", href: "https://dontclonemetom.com" },
  { emoji: "😂", name: "iDontCry.com", text: "The Vaughn family's digital playground. Dad jokes, mini games, and absolutely zero crying.", href: "https://idontcry.com" },
  { emoji: "🥊", name: "StepInTheRing.com", text: "Turn any idea into a real first plan — with AI as your corner. Free to start.", href: "https://stepinthering.com" },
  { emoji: "🎬", name: "WatchedNotWatched.com", text: "Safer viewing for families — watch what you love, the way you want to. (In development.)", href: "https://watchednotwatched.com" },
  { emoji: "👨‍👩‍👧‍👦", name: "Fambookagram.com", text: "Your family's private feed. Photos and moments — no ads, no algorithm, no strangers. (Waitlist.)", href: "https://fambookagram.com" },
  { emoji: "🫂", name: "Friendbookagram.com", text: "Where your friends actually stay in touch. Private, calm, invite-only. (Waitlist.)", href: "https://friendbookagram.com" },
];

export default function AboutOpenMirror() {
  return (
    <main className="min-h-screen bg-[#0C0C0C] text-[#F5F0E8]">
      <OpenMirrorNav />
      <div className="mx-auto max-w-2xl px-5 py-12">

        <section className="mb-12 text-center">
          <div className="mb-5 text-5xl">🪞</div>
          <h1 className="mb-4 text-4xl font-black leading-tight sm:text-5xl">About Open Mirror</h1>
          <p className="mx-auto max-w-lg text-lg font-semibold leading-8 text-[#9A9188]">
            Open Mirror LLC builds simple tools that help people see clearly, reflect honestly,
            and take the next useful step. No gurus. No jargon. No 40-tab dashboards.
          </p>
        </section>

        <section className="mb-10 rounded-3xl border border-[#262626] bg-[#151515] p-7">
          <h2 className="mb-3 text-xl font-black">The short version</h2>
          <p className="mb-4 text-sm font-semibold leading-7 text-[#9A9188]">
            Most software wants your attention. Ours wants to give you a minute of clarity and then
            get out of the way. Each Open Mirror tool does one small thing well: help you think,
            find a bit of hope, or take a practical next step.
          </p>
          <p className="text-sm font-semibold leading-7 text-[#9A9188]">
            <strong className="text-[#F5F0E8]">CrossHeartPray is one Open Mirror project — but Open Mirror is not only CrossHeartPray.</strong>{" "}
            It&apos;s a small family of tools, and it&apos;s still growing.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-2 text-xl font-black">Every site in the family</h2>
          <p className="mb-5 text-sm font-semibold text-[#9A9188]">Reflection tools, faith tools, prep, and a few that just make people smile — tap any one to open it.</p>
          <div className="flex flex-col gap-3">
            {family.map((f) => (
              <a
                key={f.name}
                href={f.href}
                {...(f.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-start gap-4 rounded-2xl border border-[#262626] bg-[#151515] p-5 transition hover:border-[#3a3a3a]"
              >
                <span className="text-2xl">{f.emoji}</span>
                <div>
                  <h3 className="text-base font-black">{f.name}</h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#9A9188]">{f.text}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-3xl border border-[#262626] bg-[#151515] p-7 text-center">
          <p className="text-base font-semibold leading-8 text-[#9A9188]">
            Tools that help you <strong className="text-[#F5F0E8]">see clearly, reflect honestly, build better, and take the next useful step.</strong>
            {" "}That&apos;s the whole idea.
          </p>
        </section>

        <footer className="border-t border-[#1E1E1E] pt-8 text-center">
          <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] text-[#7A736B] transition hover:text-[#F5F0E8]">
            ← Open Mirror Home
          </Link>
        </footer>

      </div>
    </main>
  );
}
