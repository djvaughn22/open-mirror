"use client";

import { usePathname } from "next/navigation";

const steps = [
  { href: "/", label: "Home" },
  { href: "/bible-reading-plan", label: "52 Week Reading" },
  { href: "/daily-hope", label: "Daily Hope" },
  { href: "/explorebible", label: "Bible Bingo 7" },
  { href: "/about", label: "About" },
];

function normalizePath(pathname: string | null) {
  if (!pathname || pathname === "/home") return "/";
  return pathname.replace(/\/$/, "") || "/";
}

export default function FlowStepButtons() {
  const currentPath = normalizePath(usePathname());
  const index = steps.findIndex((step) => step.href === currentPath);

  if (index < 0 || currentPath === "/") return null;

  const previous = index > 0 ? steps[index - 1] : null;
  const next = index < steps.length - 1 ? steps[index + 1] : null;

  if (!previous && !next) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 shadow-2xl shadow-black/40 backdrop-blur-md print:hidden">
      {previous ? (
        <a
          href={previous.href}
          aria-label={`Previous: ${previous.label}`}
          title={previous.label}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl font-black text-slate-100 transition hover:-translate-x-0.5 hover:bg-white/15"
        >
          ←
        </a>
      ) : (
        <span className="h-11 w-11" aria-hidden="true" />
      )}

      <span className="h-2 w-2 rounded-full bg-emerald-200/70" aria-hidden="true" />

      {next ? (
        <a
          href={next.href}
          aria-label={`Next: ${next.label}`}
          title={next.label}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200/30 bg-emerald-300/15 text-xl font-black text-emerald-100 transition hover:translate-x-0.5 hover:bg-emerald-300/25"
        >
          →
        </a>
      ) : (
        <span className="h-11 w-11" aria-hidden="true" />
      )}
    </div>
  );
}
