"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { label: string; href: string; external?: boolean; note?: string };

// Order: hub → faith apps → live sites → coming-soon → resources → still-being-
// -figured-out (WatchedNotWatched / WhatAmIAI / Reflect) → PleaseBeReady last.
const MENU: Item[] = [
  { label: "Open Mirror Home", href: "/" },
  { label: "CrossHeartPray.com", href: "https://crossheartpray.com", external: true },
  { label: "TheDJCares.com", href: "https://thedjcares.com", external: true },
  { label: "DontCloneMeTom.com", href: "https://dontclonemetom.com", external: true },
  { label: "iDontCry.com", href: "https://idontcry.com", external: true },
  { label: "StepInTheRing.com", href: "https://stepinthering.com", external: true },
  { label: "Fambookagram.com", href: "https://fambookagram.com", external: true, note: "Soon" },
  { label: "Friendbookagram.com", href: "https://friendbookagram.com", external: true, note: "Soon" },
  { label: "About Open Mirror", href: "/about-open-mirror" },
  { label: "Bible Reading Plan PDF", href: "/resources/52-week-bible-reading-plan.pdf", external: true, note: "PDF" },
  { label: "WatchedNotWatched.com", href: "https://watchednotwatched.com", external: true },
  { label: "WhatAmIAI.com", href: "https://whatamiai.com", external: true },
  { label: "Reflect", href: "/reflect", note: "Quick" },
  { label: "PleaseBeReady.com", href: "https://pleasebeready.com", external: true },
];

export default function OpenMirrorNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent | TouchEvent) => {
      if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onEsc); };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#26324c] bg-[#0b1220]/95 ">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
        {/* The only visible top-level item: Open Mirror Home */}
        <Link href="/" className="inline-flex items-baseline gap-2 text-base font-black tracking-tight text-[#e8edf5]">
          <span>Open Mirror LLC</span>
        </Link>

        <div ref={ref} className="relative">
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#26324c] bg-[#141d2e] text-lg leading-none text-[#e8edf5] transition hover:border-[#1c2740]"
          >
            <span aria-hidden>{open ? "✕" : "☰"}</span>
          </button>

          {open && (
            <nav className="absolute right-0 mt-3 max-h-[80vh] w-64 overflow-y-auto rounded-2xl border border-[#26324c] bg-[#141d2e] p-2 shadow-2xl shadow-black/50">
              {MENU.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-[#e8edf5] transition hover:bg-[#1c2740]"
                >
                  <span>{item.label}</span>
                  {item.note && <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8]">{item.note}</span>}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
