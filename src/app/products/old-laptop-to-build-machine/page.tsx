import type { Metadata } from "next";

// Unlisted product page — for internal review only. Not linked from the
// product registry, nav, homepage, or About page. Reachable only by direct
// URL. No pricing, no checkout: this is an early product with no payment or
// delivery system built yet.

const TITLE = "Old Laptop to Build Machine";
const DESCRIPTION =
  "A beginner-friendly bundle that turns an old laptop into a real Linux development machine — from checking if the laptop is usable through installing Linux, learning the essential tools, and shipping a small project live on the internet.";

export const metadata: Metadata = {
  title: `${TITLE} (early product)`,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
};

const INCLUDED = [
  "A start-here guide and full table of contents",
  "A printable checklist covering the whole process",
  "A laptop readiness worksheet",
  "Backup and safety instructions",
  "Step-by-step Linux installation instructions",
  "A development-machine setup guide",
  "A plain-language terminal command reference",
  "A Git and GitHub starter guide",
  "A first-project walkthrough, with the finished project included",
  "A deployment walkthrough (free hosting, real live URL)",
  "Troubleshooting guidance",
  "A recovery / \"what if something goes wrong\" section",
  "A guide to Open Mirror's own free tools for deciding what's next",
  "A setup script and a read-only verification script",
];

const REQUIREMENTS = [
  "A laptop that powers on and boots reliably (age doesn't matter much — see the readiness worksheet)",
  "At least 2 GB of RAM (4 GB or more recommended for a comfortable experience)",
  "A USB flash drive, 8 GB or larger, that can be erased",
  "An internet connection",
  "About 2–4 hours, which can be spread across multiple sessions",
];

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
        {label}
      </p>
      {children}
    </section>
  );
}

export default function OldLaptopToBuildMachine() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-14">
        <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.2em] text-[#f59e0b]">
          Early Open Mirror product · internal review
        </p>
        <h1 className="mb-4 text-balance text-center text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl">
          {TITLE}
        </h1>
        <p className="mx-auto mb-10 max-w-md text-balance text-center text-base font-semibold leading-7 text-[#94a3b8]">
          {DESCRIPTION}
        </p>

        <Section label="Who it's for">
          <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
            Anyone with an old laptop and no prior experience with Linux,
            the terminal, Git, or web deployment. Every term is explained
            the first time it comes up — nothing here assumes you already
            know how any of this works.
          </p>
        </Section>

        <Section label="What you'll finish with">
          <ul className="flex flex-col gap-2">
            {[
              "A laptop running Linux, updated and secured",
              "Git, a code editor, Python, and Node.js installed and working",
              "A small real project, built by hand",
              "That project saved to GitHub",
              "That project live on the internet, at a real URL",
            ].map((item) => (
              <li
                key={item}
                className="rounded-xl border border-[#26324c] bg-[#141d2e] px-4 py-3 text-sm font-semibold leading-6"
              >
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section label="What's included">
          <ul className="grid gap-2 sm:grid-cols-2">
            {INCLUDED.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-[#26324c] bg-[#141d2e] px-4 py-3 text-xs font-semibold leading-5 text-[#e8edf5]"
              >
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section label="System requirements">
          <ul className="flex flex-col gap-2">
            {REQUIREMENTS.map((item) => (
              <li
                key={item}
                className="text-sm font-semibold leading-6 text-[#94a3b8]"
              >
                — {item}
              </li>
            ))}
          </ul>
        </Section>

        <section className="mb-10 rounded-2xl border border-[#f59e0b]/40 bg-[#1c1608] p-5">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#f59e0b]">
            Before you start
          </p>
          <p className="text-sm font-semibold leading-7 text-[#e8edf5]">
            Installing Linux normally erases everything currently on the
            laptop&apos;s drive. Back up anything you need first — the bundle&apos;s
            backup-and-safety guide walks through exactly how. No script in
            this bundle erases a disk automatically; every destructive step
            happens inside the Linux installer itself, under your control.
          </p>
        </section>

        {/* Free readiness check — genuinely free, a real download. */}
        <Section label="Free readiness check">
          <div className="rounded-3xl border border-[#26324c] bg-[#141d2e] p-6 text-center">
            <p className="mb-4 text-sm font-semibold leading-7 text-[#94a3b8]">
              Not sure if your laptop is up to it? Start with the free
              five-minute readiness check — hardware requirements, a backup
              warning, and clear stop signs. No email required.
            </p>
            <a
              href="/downloads/old-laptop-readiness-check.pdf"
              download
              className="inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-base font-black text-[#0C0C0C]"
            >
              Download the free check (PDF)
            </a>
          </div>
        </Section>

        {/* Full playbook — described, not sold. No checkout, no price, and no
            public free-download of the complete paid bundle. */}
        <Section label="Full playbook">
          <div className="rounded-3xl border border-dashed border-[#26324c] bg-[#0f1826] p-6 text-center">
            <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-[#f59e0b]">
              Preparing for release
            </p>
            <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
              The complete playbook — the full illustrated guide (PDF, HTML, and
              Markdown), printable worksheets, quick-reference cards, safe setup
              scripts, and the finished first-project files. It isn&apos;t on
              sale yet: there is no price, no checkout, and no purchase button on
              this page. When it&apos;s ready, this is where it will live.
            </p>
          </div>
        </Section>

        <p className="text-center text-xs font-semibold leading-6 text-[#64748b]">
          An early product from Open Mirror LLC. This page is for review — see{" "}
          <a href="/disclaimer" className="underline">the disclaimer</a>{" "}
          on how Open Mirror describes products before they&apos;re for sale.
        </p>
      </div>
    </main>
  );
}
