import type { Metadata } from "next";

// Unlisted product page — for internal review only. Not linked from the
// product registry, nav, or homepage; the About page links only the free
// readiness check, never this page. No pricing, no checkout, and no public
// download of the paid bundle.

const TITLE = "Old Laptop to Build Machine";
const PROMISE =
  "Turn an unused laptop into a simple Linux development machine — and publish your first website.";

export const metadata: Metadata = {
  title: `${TITLE} (early product)`,
  description: PROMISE,
  robots: { index: false, follow: false },
};

// What the customer finishes with — a compact checklist, not paragraphs.
const FINISH = [
  "Linux installed",
  "Development tools working",
  "GitHub connected",
  "First website built",
  "First website live",
];

// What's included — tight, one line each.
const INCLUDED = [
  "Illustrated guide — PDF, HTML & Markdown",
  "Printable readiness worksheet & checklist",
  "Terminal and Git & GitHub reference cards",
  "Troubleshooting & recovery guide",
  "Safe setup script + read-only check script",
  "The finished first-project files",
];

const REQUIREMENTS = [
  "2 GB RAM",
  "20 GB storage",
  "A USB stick (8 GB+)",
  "Internet",
  "~2–4 hours",
  "Linux Mint 22",
];

function Check() {
  return (
    <span
      aria-hidden
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#34D399] text-[11px] font-black text-[#0b1220]"
    >
      ✓
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
      {children}
    </p>
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
          {PROMISE}
        </p>

        {/* Start → Finish, shown as structure. */}
        <section className="mb-10 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
          <div className="flex flex-col justify-center rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 text-center">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
              Start with
            </p>
            <div className="text-4xl">💻</div>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#e8edf5]">
              An unused but workable laptop
            </p>
          </div>
          <div className="hidden items-center justify-center text-2xl font-black text-[#38BDF8] sm:flex">
            →
          </div>
          <div className="rounded-2xl border border-[#26324c] bg-[#141d2e] p-5">
            <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
              Finish with
            </p>
            <ul className="flex flex-col gap-2">
              {FINISH.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm font-semibold leading-5">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Included — compact checklist. */}
        <section className="mb-10">
          <Label>Included</Label>
          <ul className="grid gap-2 sm:grid-cols-2">
            {INCLUDED.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-xl border border-[#26324c] bg-[#141d2e] px-4 py-3 text-sm font-semibold leading-5"
              >
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Requirements — one compact row of chips. */}
        <section className="mb-10">
          <Label>System requirements</Label>
          <div className="flex flex-wrap gap-2">
            {REQUIREMENTS.map((r) => (
              <span
                key={r}
                className="rounded-full border border-[#26324c] bg-[#141d2e] px-3 py-1.5 text-xs font-bold text-[#94a3b8]"
              >
                {r}
              </span>
            ))}
          </div>
        </section>

        {/* Backup warning — brief. */}
        <section className="mb-10 rounded-2xl border border-[#f59e0b]/40 bg-[#1c1608] p-5">
          <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-[#f59e0b]">
            Backup warning
          </p>
          <p className="text-sm font-semibold leading-7 text-[#e8edf5]">
            Installing Linux erases the laptop. The guide shows how to back up
            first — the only destructive step is one you choose inside the
            installer.
          </p>
        </section>

        {/* Choose: free check (real download) vs full playbook (not for sale). */}
        <section className="mb-10 grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col rounded-3xl border border-[#26324c] bg-[#141d2e] p-6 text-center">
            <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-[#34D399]">
              Free readiness check
            </p>
            <p className="mb-4 flex-1 text-sm font-semibold leading-6 text-[#94a3b8]">
              A five-minute check before you begin. No email required.
            </p>
            <a
              href="/downloads/old-laptop-readiness-check.pdf"
              download
              className="inline-block rounded-full bg-[#38BDF8] px-6 py-3 text-sm font-black text-[#0C0C0C]"
            >
              Download the free check (PDF)
            </a>
          </div>
          <div className="flex flex-col rounded-3xl border border-dashed border-[#26324c] bg-[#0f1826] p-6 text-center">
            <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-[#f59e0b]">
              Full playbook
            </p>
            <p className="mb-4 flex-1 text-sm font-semibold leading-6 text-[#94a3b8]">
              The complete bundle. Preparing for release — no price, no
              checkout, no download yet.
            </p>
            <span className="inline-block rounded-full border border-[#26324c] px-6 py-3 text-sm font-black text-[#64748b]">
              Preparing for release
            </span>
          </div>
        </section>

        <p className="text-center text-xs font-semibold leading-6 text-[#64748b]">
          An early product from Open Mirror LLC — for review. See{" "}
          <a href="/disclaimer" className="underline">the disclaimer</a>.
        </p>
      </div>
    </main>
  );
}
