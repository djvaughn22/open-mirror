import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ACCESS_TONE,
  aboutFamilyProducts,
  featuredProduct,
  foundationProduct,
  STUDIO,
  type AccessLabel,
  type Product,
} from "../../lib/products";

export const metadata: Metadata = {
  title: "About",
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

const CREDITS = [
  { name: "52-Week Bible Reading Plan", credit: "© 1995–2009 Michael Coley, Bible-Reading.com — used with permission (CrossHeartPray)", href: "http://www.bible-reading.com" },
  { name: "Life Essentials · Bible Principles", credit: "Dr. Gene Getz / B&H Publishing — principles & official videos (CrossHeartPray, TheDJCares)", href: "https://bibleprinciples.org" },
  { name: "YouVersion Bible App", credit: "bible.com — verse and chapter links across the family", href: "https://www.bible.com" },
  { name: "BibleHub", credit: "Original-language and Strong's references (CrossHeartPray Deep Dive)", href: "https://biblehub.com" },
  { name: "RescueGroups.org", credit: "Free adoptable-pets API behind DontCloneMeTom's live dogs", href: "https://rescuegroups.org" },
  { name: "Petfinder & Adopt-a-Pet", credit: "Adoption searches linked from DontCloneMeTom", href: "https://www.petfinder.com" },
  { name: "YouTube", credit: "Video and music embeds (TheDJCares, iDontCry)", href: "https://www.youtube.com" },
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

function linkProps(href: string) {
  return href.startsWith("http")
    ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
    : {};
}

/** One compact family entry: name, honest label, one sentence, one action. */
function FamilyCard({ p }: { p: Product }) {
  return (
    <a
      href={p.href}
      {...linkProps(p.href)}
      className="pop flex items-start gap-3 rounded-2xl border border-[#26324c] bg-[#141d2e] p-4 transition hover:border-[#1c2740]"
      style={{ borderLeft: `4px solid ${p.accent}` }}
    >
      <span aria-hidden className="text-xl leading-none">{p.emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-black">{p.name}</h3>
          <AccessChip label={p.access} note={p.accessNote} />
        </div>
        <p className="mt-1 text-[13px] font-semibold leading-5 text-[#94a3b8]">
          {p.aboutLine ?? p.description}
        </p>
        <span
          className="mt-1.5 inline-block text-[13px] font-black"
          style={{ color: p.accent }}
        >
          {p.aboutAction ?? "Open"} →
        </span>
      </div>
    </a>
  );
}

/**
 * The featured product card — integrated into the family, not a poster.
 * Compact horizontal layout: left side for content, right side for a small
 * contained image. Two honest actions, no price, no checkout.
 */
function FeaturedPanel({ p }: { p: Product }) {
  return (
    <section
      className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#26324c] bg-[#141d2e] p-4 sm:flex-row sm:p-5"
      style={{ borderLeft: `4px solid ${p.accent}` }}
      aria-labelledby="featured-product"
    >
      {/* Left: content */}
      <div className="flex-1 min-w-0">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span aria-hidden className="text-lg leading-none">{p.emoji}</span>
          <AccessChip label={p.access} note={p.accessNote} />
        </div>
        <h3 id="featured-product" className="text-sm font-black sm:text-base">
          {p.name}
        </h3>
        <p className="mt-0.5 text-[13px] font-semibold leading-5 text-[#94a3b8]">
          {p.aboutLine ?? p.description}
        </p>

        {/* Transformation row — compact, single line */}
        <ol className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] font-bold text-[#94a3b8]">
          {["Old laptop", "Linux", "Dev tools", "GitHub", "First site"].map((step, i, all) => (
            <li key={step} className="flex items-center gap-1.5">
              <span
                className="rounded-full border border-[#26324c] bg-[#0f1826] px-1.5 py-0.5"
                style={i === all.length - 1 ? { color: p.accent, borderColor: `${p.accent}55` } : undefined}
              >
                {step}
              </span>
              {i < all.length - 1 && <span aria-hidden>→</span>}
            </li>
          ))}
        </ol>

        {/* Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={p.href}
            className="rounded-full px-3 py-1.5 text-xs font-black text-[#0C0C0C]"
            style={{ background: p.accent }}
          >
            {p.aboutAction ?? "View"} →
          </Link>
          <a
            href="/downloads/old-laptop-readiness-check.pdf"
            className="rounded-full border border-[#26324c] px-3 py-1.5 text-xs font-black text-[#e8edf5] transition hover:border-[#1c2740]"
          >
            Readiness check
          </a>
        </div>
      </div>

      {/* Right: image in a frame */}
      {p.image && (
        <div className="w-full shrink-0 sm:w-56">
          <div className="overflow-hidden rounded-lg border border-[#26324c] bg-[#0f1826] p-1.5">
            <Image
              src={p.image}
              alt={p.imageAlt ?? ""}
              width={1080}
              height={1080}
              sizes="(min-width: 1024px) 220px, 100vw"
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default function AboutOpenMirror() {
  const foundation = foundationProduct();
  const featured = featuredProduct();
  const family = aboutFamilyProducts();

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-5xl px-5 py-10">

        {/* Two lanes on desktop; on phones they stack in reading order —
            where it started, then what grew from it. */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-12">

          {/* ── LEFT LANE — where it started ───────────────────────────── */}
          <div>
            <h1 className="mb-3 text-balance text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl">
              CrossHeartPray came first.
            </h1>
            <p className="text-balance text-base font-semibold leading-7 text-[#94a3b8]">
              One personal Bible routine became something real. Then one build
              led to another. That became Open Mirror.
            </p>

            {/* The protected Foundation. One direct link. */}
            {foundation && (
              <Link
                href={foundation.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pop mt-6 block rounded-3xl border border-[#26324c] bg-[#141d2e] p-5 transition hover:border-[#C4B5FD]"
                style={{ borderLeft: `5px solid ${foundation.accent}` }}
              >
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl"
                    style={{ background: foundation.accent }}
                  >
                    {foundation.emoji}
                  </span>
                  <AccessChip label={foundation.access} note={foundation.accessNote} />
                </div>
                <h2 className="text-lg font-black">
                  CrossHeartPray<span style={{ color: foundation.accent }}>.com</span>
                </h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">
                  {foundation.aboutLine ?? foundation.description}
                </p>
                <span
                  className="mt-3 inline-block text-sm font-black"
                  style={{ color: foundation.accent }}
                >
                  {foundation.aboutAction ?? "Open"} →
                </span>
              </Link>
            )}

            {/* The three haikus — verse only, no explanation. */}
            <div className="mt-8 flex flex-col gap-5 border-t border-[#26324c] pt-6">
              {HAIKUS.map((verse) => (
                <div key={verse.title}>
                  <h3 className="mb-1 text-sm font-black tracking-tight text-[#7dd3fc]">
                    {verse.title}
                  </h3>
                  <p className="text-[13px] font-semibold leading-6 text-[#94a3b8]">
                    {verse.lines.map((line) => (
                      <span key={line} className="block whitespace-nowrap">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT LANE — what grew from it ─────────────────────────── */}
          <div>
            <h2 className="mb-4 text-xl font-black tracking-tight sm:text-2xl">
              What grew from it
            </h2>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {family.map((p) => (
                <FamilyCard key={p.name} p={p} />
              ))}
            </div>
          </div>
        </div>

        {/* The whole business, in three lines. No pricing, no revenue model. */}
        <section className="mt-12 border-y border-[#26324c] py-6 text-center">
          <p className="mx-auto max-w-md text-sm font-black leading-7 text-[#e8edf5]">
            <span className="block">Many Open Mirror projects are free to explore.</span>
            <span className="block">Some become finished products.</span>
            <span className="block">
              <Link href="/contact" className="text-[#7dd3fc] underline">
                Limited project help
              </Link>{" "}
              is available when the fit is right.
            </span>
          </p>
        </section>

        {/* Free resources, then credits — kept low so they never interrupt the
            origin story or the family. Attribution stays; some content is used
            with permission. */}
        <section className="mt-10">
          <h2 className="mb-3 text-base font-black">Free resources</h2>
          <a
            href="/resources/52-week-bible-reading-plan.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="pop flex items-start gap-4 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 transition hover:border-[#1c2740]"
          >
            <span aria-hidden className="text-2xl">📖</span>
            <div>
              <h3 className="text-base font-black">
                Bible Reading Plan{" "}
                <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8]">PDF</span>
              </h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">
                A 52-week plan to read through the Bible — print it or keep it on your phone.
              </p>
            </div>
          </a>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-base font-black">Credits and sources</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {CREDITS.map((r) => (
              <a
                key={r.name}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#26324c] bg-[#141d2e] px-4 py-3 transition hover:border-[#1c2740]"
              >
                <span className="text-sm font-black text-[#e8edf5]">{r.name}</span>
                <span className="block text-xs font-semibold leading-5 text-[#94a3b8]">
                  {r.credit}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* The first packaged product — kept near the bottom, after the whole
            family and the credits, so the origin story leads and nothing reads
            as a funnel toward a sale. Compact panel, no price, no checkout. */}
        {featured && (
          <section className="mt-10">
            <h2 className="mb-3 text-base font-black">The first product</h2>
            <FeaturedPanel p={featured} />
          </section>
        )}

        {/* Contact — one quiet line into the intake page. */}
        <section className="mt-10 border-t border-[#26324c] pt-6 text-center">
          <Link href="/contact" className="text-sm font-black text-[#7dd3fc]">
            Have an idea you want to bring to life? →
          </Link>
        </section>

        {/* A quiet anchor so existing #disclaimer deep links still land. The
            full legal text lives only on /disclaimer, and the shared footer
            already carries the one-line independence note — no repeat here. */}
        <section id="disclaimer" className="mt-10 scroll-mt-24 border-t border-[#26324c] pt-6 text-center">
          <Link href="/disclaimer" className="text-xs font-semibold text-[#94a3b8] underline">
            Disclaimer and independence
          </Link>
        </section>

        <p className="mt-6 text-center text-xs font-semibold text-[#64748b]">
          {STUDIO.name} ·{" "}
          <a href={`mailto:${STUDIO.email}`} className="font-black text-[#7dd3fc]">
            {STUDIO.email}
          </a>
        </p>

      </div>
    </main>
  );
}
