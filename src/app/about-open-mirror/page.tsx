import type { Metadata } from "next";
import Link from "next/link";
import { foundationProduct } from "../../lib/products";

export const metadata: Metadata = {
  title: "About",
  description:
    "Open Mirror builds original websites, apps, games, and tools for faith, family, friends, and anyone who finds something useful here.",
  alternates: { canonical: "/about-open-mirror" },
};

// Say-less rewrite (owner's exact copy, 2026-07-19). Four short paragraphs
// and one link home — no sections, no cards, no catalog, no AI section.
// Change words only on the owner's instruction.

const body = "mt-5 text-pretty text-base font-semibold leading-8 text-[#94a3b8]";

export default function AboutOpenMirror() {
  const foundation = foundationProduct();

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">

        <h1 className="text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
          About Open Mirror
        </h1>

        <p className="mt-8 text-lg font-black leading-8 text-[#e8edf5]">
          {foundation ? (
            <a
              href={foundation.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7dd3fc] underline"
            >
              CrossHeartPray
            </a>
          ) : (
            "CrossHeartPray"
          )}{" "}
          came first.
        </p>
        <p className={body}>
          It started as a personal Bible routine and became the first website.
        </p>
        <p className={body}>
          Open Mirror grew from there—a place to build original websites,
          apps, games, and tools for faith, family, friends, and anyone who
          finds something useful here.
        </p>
        <p className={body}>
          Modern tools make it possible to build, test, improve, and publish
          ideas quickly. The tools help with the work. The ideas, words,
          purpose, and content remain original.
        </p>

        {/* id="disclaimer" keeps old /about-open-mirror#disclaimer deep links
            landing; the footer carries the visible Disclaimer link. */}
        <p id="disclaimer" className="mt-12 scroll-mt-24">
          <Link
            href="/"
            className="inline-block rounded-full px-6 py-3 text-sm font-black"
            style={{ background: "var(--om-accent)", color: "var(--om-ink)" }}
          >
            See what is live →
          </Link>
        </p>

      </div>
    </main>
  );
}
