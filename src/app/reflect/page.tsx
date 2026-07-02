"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import OpenMirrorNav from "../../components/OpenMirrorNav";

const A = "#93C5FD"; // calm accent
const STORAGE = "om-reflect-v1";

const PROMPTS = [
  "What's actually on your mind right now — the real thing, not the tidy version?",
  "What went well recently that you haven't given yourself credit for?",
  "What's one thing you're avoiding, and what's the smallest first step?",
  "If a good friend described your week back to you, what would they notice?",
  "What are you carrying that isn't actually yours to carry?",
  "What would 'a good next week' actually look like — specifically?",
  "What drained you lately, and what filled you back up?",
  "What are you pretending not to know?",
  "What's one small thing that would make tomorrow 10% better?",
  "When did you last feel most like yourself?",
];

export default function ReflectPage() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE);
    // Restoring the draft after hydration is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setText(saved);
  }, []);

  useEffect(() => {
    if (text) localStorage.setItem(STORAGE, text);
  }, [text]);

  const nextPrompt = () => setIdx((i) => (i + 1) % PROMPTS.length);

  const copyForAI = () => {
    if (!text.trim()) return;
    const p = `I've been reflecting on this question: "${PROMPTS[idx]}"\n\nHere's what I wrote:\n\n${text.trim()}\n\nHelp me think about it more clearly — notice any patterns and ask a gentle follow-up or two. Please don't tell me who I am or put me in a box.`;
    navigator.clipboard.writeText(p).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <main className="min-h-screen bg-[#0C0C0C] text-[#F5F0E8]">
      <OpenMirrorNav />
      <div className="mx-auto max-w-xl px-5 py-12">

        <section className="mb-8 text-center">
          <div className="mb-4 text-4xl">🪞</div>
          <h1 className="mb-3 text-4xl font-black">Reflect</h1>
          <p className="mx-auto max-w-sm text-base font-semibold leading-7 text-[#9A9188]">
            A quiet minute to think. One question, a few honest lines, a little clarity. Not a test, not a diagnosis.
          </p>
        </section>

        <section className="rounded-3xl border border-[#262626] bg-[#151515] p-6">
          <p className="mb-1 text-xs font-black uppercase tracking-[0.2em]" style={{ color: A }}>Today&apos;s prompt</p>
          <p className="mb-5 text-xl font-black leading-snug">{PROMPTS[idx]}</p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write honestly. Nobody sees this but you — it stays on your device."
            rows={7}
            className="w-full resize-y rounded-2xl border-2 border-[#262626] bg-[#1C1C1C] p-4 text-base leading-relaxed text-[#F5F0E8] outline-none placeholder:text-[#6B6B6B] focus:border-[#93C5FD]"
          />

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={copyForAI}
              disabled={!text.trim()}
              style={{ background: text.trim() ? A : "#262626", color: text.trim() ? "#0C0C0C" : "#7A736B" }}
              className="flex-1 rounded-full px-6 py-3 text-sm font-black uppercase tracking-[0.12em] transition hover:opacity-90 disabled:cursor-not-allowed"
            >
              {copied ? "✓ Copied — paste into any AI" : "Think it through with AI"}
            </button>
            <button
              onClick={nextPrompt}
              className="rounded-full border-2 border-[#262626] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#9A9188] transition hover:border-[#3a3a3a]"
            >
              Another prompt →
            </button>
          </div>
        </section>

        <p className="mt-6 text-center text-xs font-semibold text-[#7A736B]">
          Want the deeper version? Try{" "}
          <a href="https://whatamiai.com" target="_blank" rel="noopener noreferrer" className="font-black underline" style={{ color: A }}>WhatAmIAI</a>.
        </p>

        <footer className="mt-10 border-t border-[#1E1E1E] pt-8 text-center">
          <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] text-[#7A736B] transition hover:text-[#F5F0E8]">
            ← Open Mirror Home
          </Link>
        </footer>

      </div>
    </main>
  );
}
