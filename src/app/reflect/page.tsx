"use client";

import { useEffect, useState } from "react";

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

const FOLLOWUPS = [
  "What surprised you as you wrote that down?",
  "If a friend wrote this, what would you gently tell them?",
  "What's the smallest next step hiding in what you wrote?",
  "What did you leave out because it felt too big — or too small?",
  "Which part of this do you most want to be different a month from now?",
  "What's one thing you're grateful for, even inside this?",
];

export default function ReflectPage() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  const followups = [FOLLOWUPS[idx % FOLLOWUPS.length], FOLLOWUPS[(idx + 2) % FOLLOWUPS.length], FOLLOWUPS[(idx + 4) % FOLLOWUPS.length]];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE);
    // Restoring the draft after hydration is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setText(saved);
  }, []);

  useEffect(() => {
    if (text) localStorage.setItem(STORAGE, text);
  }, [text]);

  const nextPrompt = () => { setIdx((i) => (i + 1) % PROMPTS.length); setShowReflection(false); };

  const doReflect = () => {
    if (!text.trim()) return;
    setShowReflection(true);
  };

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
              onClick={doReflect}
              disabled={!text.trim()}
              style={{ background: text.trim() ? A : "#262626", color: text.trim() ? "#0C0C0C" : "#7A736B" }}
              className="flex-1 rounded-full px-6 py-3 text-sm font-black uppercase tracking-[0.12em] transition hover:opacity-90 disabled:cursor-not-allowed"
            >
              Reflect on this →
            </button>
            <button
              onClick={nextPrompt}
              className="rounded-full border-2 border-[#262626] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#9A9188] transition hover:border-[#3a3a3a]"
            >
              Another prompt →
            </button>
          </div>
        </section>

        {showReflection && text.trim() && (
          <section className="mt-4 rounded-3xl border border-[#262626] bg-[#151515] p-6">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em]" style={{ color: A }}>A few things to sit with 🪞</p>
            <div className="flex flex-col gap-3">
              {followups.map((f, i) => (
                <div key={i} className="flex gap-2 text-[15px] leading-6 text-[#F5F0E8]">
                  <span style={{ color: A }}>•</span><span>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={copyForAI}
              style={{ background: A, color: "#0C0C0C" }}
              className="mt-4 w-full rounded-full px-6 py-3 text-sm font-black uppercase tracking-[0.12em] transition hover:opacity-90"
            >
              {copied ? "✓ Copied — paste into any AI" : "Take it deeper with any AI"}
            </button>
            <p className="mt-4 text-xs font-semibold leading-6 text-[#9A9188]">
              Patterns to notice, not a verdict — you&apos;re not a category.
            </p>
          </section>
        )}

        <p className="mt-6 text-center text-xs font-semibold text-[#7A736B]">
          Want the deeper version? Try{" "}
          <a href="https://whatamiai.com" target="_blank" rel="noopener noreferrer" className="font-black underline" style={{ color: A }}>WhatAmIAI</a>.
          {" "}Prefer to reflect through faith and Scripture? Visit{" "}
          <a href="https://crossheartpray.com" target="_blank" rel="noopener noreferrer" className="font-black underline" style={{ color: A }}>CrossHeartPray</a>.
        </p>

      </div>
    </main>
  );
}
