"use client";

import { usePathname } from "next/navigation";

const steps = [
  { href: "/", label: "Welcome" },
  { href: "/explorebible", label: "Bible Bingo 7" },
  { href: "/bible-reading-plan", label: "Bible Reading Plan" },
  { href: "/daily-hope", label: "Daily Hope" },
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
    <div className="mt-6 flex items-center justify-between gap-3 text-sm font-black">
      {previous ? (
        <a
          href={previous.href}
          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-slate-100 transition hover:bg-white/15"
        >
          ← {previous.label}
        </a>
      ) : (
        <span aria-hidden="true" />
      )}

      {next ? (
        <a
          href={next.href}
          className="rounded-full border border-emerald-200/35 bg-emerald-300/10 px-4 py-2 text-emerald-100 transition hover:bg-emerald-300/15"
        >
          {next.label} →
        </a>
      ) : (
        <span aria-hidden="true" />
      )}
    </div>
  );
}
