import type { Metadata } from "next";
import Link from "next/link";
import { ACCESS_TONE, STUDIO, type AccessLabel } from "../../lib/products";

export const metadata: Metadata = {
  title: "About Open Mirror",
  description:
    "CrossHeartPray came first. One personal Bible routine became something real. Then one build led to another. That became Open Mirror.",
  alternates: { canonical: "/about-open-mirror" },
};

// The three haikus — new words (owner-approved, July 2026), verified 5-7-5.
// Presented as verse only; never wrapped in an explanatory paragraph.
const HAIKUS: { title: string; lines: string[] }[] = [
  {
    title: "First",
    lines: ["Cross Heart Pray came first", "One daily practice became", "Something real to share"],
  },
  {
    title: "More",
    lines: ["One build led to more", "Each new thought became a thing", "Open Mirror grew"],
  },
  {
    title: "Keep going",
    lines: ["Build what feels alive", "Keep it useful, keep it fun", "Then see where it goes"],
  },
];

// The restrained story progression — a few real builds, chosen to show the
// range (help, fun, a building tool, an early experiment, a product). The full
// portfolio lives on the homepage; this is the story, not the catalogue.
// CrossHeartPray is shown above, on its own, as the Foundation.
const PROGRESSION: {
  emoji: string;
  name: string;
  label: AccessLabel;
  note: string;
  sentence: string;
  action: string;
  href: string;
  external: boolean;
  accent: string;
}[] = [
  {
    emoji: "🐶", name: "DontCloneMeTom", label: "Free", note: "",
    sentence: "A joke about a cloned dog that gets real dogs adopted.",
    action: "Meet the dogs", href: "https://dontclonemetom.com", external: true, accent: "#2DD4BF",
  },
  {
    emoji: "🧩", name: "OpenDoku", label: "Free", note: "",
    sentence: "One puzzle engine, a growing family of games.",
    action: "Play", href: "https://opendoku.com", external: true, accent: "#7DD3FC",
  },
  {
    emoji: "🥊", name: "StepInTheRing", label: "Free", note: "",
    sentence: "Turn an idea into a real first build plan.",
    action: "Start building", href: "https://stepinthering.com", external: true, accent: "#60A5FA",
  },
  {
    emoji: "👨‍👩‍👧‍👦", name: "Fambookagram", label: "Exploring", note: "",
    sentence: "A private family feed — an idea still being tested.",
    action: "Take a look", href: "https://fambookagram.com", external: true, accent: "#C084FC",
  },
  {
    emoji: "💻", name: "Old Laptop to Build Machine", label: "Product", note: "Preparing for release",
    sentence: "Turn an old laptop into a build machine.",
    action: "Free readiness check", href: "/downloads/old-laptop-readiness-check.pdf", external: false, accent: "#F59E0B",
  },
];

function AccessChip({ label, note }: { label: AccessLabel; note?: string }) {
  const tone = ACCESS_TONE[label];
  return (
    <span
      className="shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider"
      style={{ color: tone, borderColor: `${tone}55` }}
    >
      {label}
      {note ? ` · ${note}` : ""}
    </span>
  );
}

export default function AboutOpenMirror() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-10">

        {/* The true origin — plain, no second paragraph. */}
        <section className="mb-8 text-center">
          <h1 className="mb-3 text-balance text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl">
            CrossHeartPray came first.
          </h1>
          <p className="mx-auto max-w-md text-balance text-base font-semibold leading-7 text-[#94a3b8]">
            One personal Bible routine became something real. Then one build led
            to another. That became Open Mirror.
          </p>
        </section>

        {/* CrossHeartPray — the protected Foundation and first build. Prominent,
            one direct link. Not a funnel, not a sales example. */}
        <section className="mb-10">
          <Link
            href="https://crossheartpray.com"
            target="_blank"
            rel="noopener noreferrer"
            className="pop block rounded-3xl border border-[#26324c] bg-[#141d2e] p-6 transition hover:border-[#C4B5FD]"
            style={{ borderLeft: "5px solid #C4B5FD" }}
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#C4B5FD] text-2xl">
                ✝️
              </span>
              <AccessChip label="Foundation" note="First Build" />
            </div>
            <h2 className="text-xl font-black">
              CrossHeartPray<span className="text-[#C4B5FD]">.com</span>
            </h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">
              A daily faith routine — Daily Hope, a Bible reading plan, Life
              Essentials, and Bible Bingo. Gospel first.
            </p>
            <span className="mt-3 inline-block text-sm font-black text-[#C4B5FD]">
              Open CrossHeartPray →
            </span>
          </Link>
        </section>

        {/* The three haikus — verse only, no explanation. */}
        <section className="mb-10 border-y border-[#26324c] py-6">
          <div className="grid gap-6 text-center md:grid-cols-3">
            {HAIKUS.map((verse) => (
              <div key={verse.title}>
                <h2 className="mb-1 text-sm font-black tracking-tight text-[#7dd3fc]">
                  {verse.title}
                </h2>
                <p className="text-[13px] font-semibold leading-6 text-[#94a3b8] md:text-[12px]">
                  {verse.lines.map((line) => (
                    <span key={line} className="block whitespace-nowrap">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The progression — a few real builds tell the rest. */}
        <section className="mb-10">
          <div className="flex flex-col gap-3">
            {PROGRESSION.map((p) => (
              <a
                key={p.name}
                href={p.href}
                {...(p.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="pop flex items-start gap-4 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 transition hover:border-[#1c2740]"
                style={{ borderLeft: `5px solid ${p.accent}` }}
              >
                <span className="text-2xl">{p.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black">{p.name}</h3>
                    <AccessChip label={p.label} note={p.note} />
                  </div>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">
                    {p.sentence}
                  </p>
                  <span
                    className="mt-2 inline-block text-sm font-black"
                    style={{ color: p.accent }}
                  >
                    {p.action} →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* The whole business, in three lines. No pricing, no revenue model. */}
        <section className="mb-10 border-y border-[#26324c] py-6 text-center">
          <p className="mx-auto max-w-md text-sm font-semibold leading-7 text-[#e8edf5]">
            Many Open Mirror projects are free to explore. Some become finished
            products.{" "}
            <Link href="/contact" className="text-[#7dd3fc] underline">
              Limited project help
            </Link>{" "}
            is available when the fit is right.
          </p>
        </section>

        {/* Free resources & credits — attribution stays; some content is used
            with permission. */}
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
          <p className="mb-3 mt-6 text-sm font-black text-[#e8edf5]">
            Credit where credit is due
          </p>
          <div className="flex flex-col gap-2">
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

        {/* Keep a small anchor here so existing #disclaimer deep links still
            land, but the full legal text now lives on its own /disclaimer
            page — off the main About copy. */}
        <section id="disclaimer" className="mb-8 scroll-mt-24 border-t border-[#26324c] pt-6 text-center">
          <p className="text-xs font-medium leading-6 text-[#64748b]">
            Open Mirror LLC is a small independent company.{" "}
            <Link href="/disclaimer" className="font-semibold text-[#94a3b8] underline">
              Read the full disclaimer
            </Link>
            .
          </p>
        </section>

        <p className="text-center text-xs font-semibold text-[#64748b]">
          {STUDIO.name} ·{" "}
          <a href={`mailto:${STUDIO.email}`} className="font-black text-[#7dd3fc]">
            {STUDIO.email}
          </a>
        </p>

      </div>
    </main>
  );
}
