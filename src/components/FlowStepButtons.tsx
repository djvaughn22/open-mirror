"use client";

import { usePathname } from "next/navigation";

const steps = [
  { href: "/", label: "Home" },
  { href: "/bible-reading-plan", label: "Bible Reading" },
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
    <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs font-black uppercase tracking-[0.14em] print:hidden">
      {previous ? (
        <a
          href={previous.href}
          aria-label={`Previous: ${previous.label}`}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/80 bg-white px-4 py-2 text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-x-0.5 hover:bg-slate-100"
        >
          <span aria-hidden="true">←</span>
          <span>{previous.label}</span>
        </a>
      ) : (
        <span aria-hidden="true" />
      )}

      {next ? (
        <a
          href={next.href}
          aria-label={`Next: ${next.label}`}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-100 bg-emerald-200 px-4 py-2 text-slate-950 shadow-lg shadow-emerald-950/25 transition hover:translate-x-0.5 hover:bg-emerald-100"
        >
          <span>{next.label}</span>
          <span aria-hidden="true">→</span>
        </a>
      ) : (
        <span aria-hidden="true" />
      )}
    </div>
  );
}
