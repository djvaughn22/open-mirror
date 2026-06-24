"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  { href: "/", label: "Bible Bingo 7" },
  { href: "/bible-reading-plan", label: "Bible Reading Plan" },
  { href: "/daily-hope", label: "Daily Hope" },
  { href: "/cross", label: "Cross" },
  { href: "/heart", label: "Heart" },
  { href: "/pray", label: "Pray" },
  { href: "/about", label: "About" },
];

function flowPath(pathname: string | null) {
  const path = pathname || "/";

  if (
    path === "/" ||
    path === "/home" ||
    path === "/welcome" ||
    path === "/explorebible" ||
    path.startsWith("/bible-bingo/")
  ) {
    return "/";
  }

  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

export default function FlowStepButtons() {
  const currentPath = flowPath(usePathname());

  const index = steps.findIndex((step) => {
    if (step.href === "/") return currentPath === "/";
    return currentPath === step.href || currentPath.startsWith(step.href + "/");
  });

  if (index < 0) return null;

  const previous = index > 0 ? steps[index - 1] : null;
  const current = steps[index];
  const next = index < steps.length - 1 ? steps[index + 1] : null;

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-xs font-semibold text-slate-200">
      <div className="grid grid-cols-3 items-center gap-2">
        <div className="text-left">
          {previous ? (
            <Link
              href={previous.href}
              className="inline-flex rounded-full border border-white/15 px-3 py-2 transition hover:bg-white/10"
            >
              ← {previous.label}
            </Link>
          ) : (
            <span className="inline-flex rounded-full border border-white/10 px-3 py-2 text-slate-500">
              Start
            </span>
          )}
        </div>

        <div className="text-center text-sky-200">
          {current.label}
        </div>

        <div className="text-right">
          {next ? (
            <Link
              href={next.href}
              className="inline-flex rounded-full border border-sky-300/35 bg-sky-300/10 px-3 py-2 text-sky-100 transition hover:bg-sky-300/20"
            >
              {next.label} →
            </Link>
          ) : (
            <span className="inline-flex rounded-full border border-white/10 px-3 py-2 text-slate-500">
              Done
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
