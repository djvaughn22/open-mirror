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
  const next = index < steps.length - 1 ? steps[index + 1] : null;

  return (
    <div className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold">
      <div className="min-w-0 flex-1 text-left">
        {previous ? (
          <Link
            href={previous.href}
            className="inline-flex rounded-full border border-white/15 px-3 py-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            ← {previous.label}
          </Link>
        ) : null}
      </div>

      <div className="min-w-0 flex-1 text-right">
        {next ? (
          <Link
            href={next.href}
            className="inline-flex rounded-full border border-sky-300/35 bg-sky-300/10 px-3 py-2 text-sky-100 transition hover:bg-sky-300/20"
          >
            {next.label} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
