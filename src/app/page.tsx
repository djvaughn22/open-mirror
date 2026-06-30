import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Mirror LLC",
  description:
    "Open Mirror LLC builds simple web apps with heart, purpose, and real-world usefulness.",
};

const projects = [
  {
    name: "CrossHeartPray",
    tagline:
      "A Bible-first app for verse discovery, prayer, Daily Hope, Bible Bingo, and reading plans.",
    status: "Live / MVP1",
    statusColor: "text-emerald-300",
    href: "/crossheartpray",
    cta: "Open CrossHeartPray",
    primary: true,
  },
  {
    name: "iDontCry",
    tagline:
      "A healing-first emotional support project for grief, strength, and honest moments.",
    status: "Concept / Coming Soon",
    statusColor: "text-slate-400",
    href: "/idontcry",
    cta: "View Project",
    primary: false,
  },
  {
    name: "Step In The Ring",
    tagline:
      "A parent-guided idea builder for turning a rough idea into a simple first MVP.",
    status: "Prototype / MVP",
    statusColor: "text-amber-300",
    href: "/step-in-the-ring",
    cta: "View Project",
    primary: false,
  },
  {
    name: "Watched Not Watched",
    tagline:
      "A clean-viewing concept for families who want safer ways to watch what they already have access to.",
    status: "In Development",
    statusColor: "text-sky-300",
    href: "/watched-not-watched",
    cta: "View Project",
    primary: false,
  },
  {
    name: "DontCloneMeTom",
    tagline:
      "A playful rescue-first dog adoption campaign reminding the world that original dogs are already waiting.",
    status: "Campaign MVP",
    statusColor: "text-orange-300",
    href: "/dont-clone-me-tom",
    cta: "View Project",
    primary: false,
  },
];

export default function OpenMirrorHub() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-5 py-14">
        {/* Header */}
        <header className="mb-12 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500 mb-3">
            Open Mirror LLC
          </p>
          <h1 className="text-3xl font-black leading-tight text-white mb-4">
            Open Mirror LLC
          </h1>
          <p className="text-base font-semibold leading-7 text-slate-300 max-w-xl mx-auto">
            Open Mirror LLC builds simple web apps with heart, purpose, and real-world usefulness.
          </p>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-400 max-w-xl mx-auto">
            Each project stands on its own. Each one starts with a simple idea: help people see,
            choose, build, heal, watch, rescue, or pray better.
          </p>
        </header>

        {/* Project cards */}
        <div className="flex flex-col gap-4">
          {projects.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              className={`group block rounded-2xl border p-6 transition hover:-translate-y-0.5 ${
                p.primary
                  ? "border-emerald-200/25 bg-emerald-950/30 hover:border-emerald-200/40"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-black text-white">{p.name}</h2>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-300">
                    {p.tagline}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-black uppercase tracking-[0.15em] ${p.statusColor}`}
                >
                  {p.status}
                </span>
              </div>
              <div className="mt-4">
                <span
                  className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-[0.15em] transition ${
                    p.primary
                      ? "border-emerald-200/30 text-emerald-100 group-hover:bg-emerald-300/10"
                      : "border-white/15 text-slate-300 group-hover:border-white/25 group-hover:text-white"
                  }`}
                >
                  {p.cta} →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center border-t border-white/10 pt-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">
            Open Mirror LLC
          </p>
          <p className="mt-1 text-xs text-slate-600">Built project by project.</p>
        </footer>
      </div>
    </main>
  );
}
