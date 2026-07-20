import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Open Mirror LLC is independently owned and operated.",
  alternates: { canonical: "/disclaimer" },
};

// Say-less rewrite (owner's exact copy, 2026-07-19). Three sentences carry
// the whole disclaimer: independence, as-is content, third-party ownership,
// and non-affiliation with the owner's employer — never named, never titled.
// Change words only on the owner's instruction.

const body = "mt-5 text-pretty text-base font-semibold leading-8 text-[#94a3b8]";

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">

        <h1 className="text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
          Disclaimer
        </h1>

        <p className={body}>
          Open Mirror LLC is independently owned and operated.
        </p>
        <p className={body}>
          Content and products are provided as-is and may change at any time.
          Third-party names, links, content, and services belong to their
          respective owners.
        </p>
        <p className={body}>
          Open Mirror LLC is not affiliated with or endorsed by the
          owner&apos;s employer.
        </p>

      </div>
    </main>
  );
}
