"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { label: string; href: string; external?: boolean; note?: string };

const MENU: Item[] = [
  { label: "Open Mirror Home", href: "/" },
  { label: "WhatAmIAI", href: "https://whatamiai.com", external: true, note: "Reflection tool" },
  { label: "Reflect", href: "/reflect", note: "Quick reflection" },
  { label: "About Open Mirror", href: "/about-open-mirror" },
  { label: "DJ Cares", href: "https://thedjcares.com", external: true },
  { label: "DontCloneMeTom.com", href: "https://dontclonemetom.com", external: true },
  { label: "CrossHeartPray", href: "https://crossheartpray.com", external: true },
  { label: "Bible Reading Plan PDF", href: "/resources/52-week-bible-reading-plan.pdf", external: true, note: "Download" },
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
    <header className="sticky top-0 z-50 border-b border-[#1E1E1E] bg-[#0C0C0C]/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
        {/* The only visible top-level item: Open Mirror Home */}
        <Link href="/" className="inline-flex items-baseline gap-2 text-base font-black tracking-tight text-[#F5F0E8]">
          <span aria-hidden>🪞</span>
          <span>Open Mirror</span>
        </Link>

        <div ref={ref} className="relative">
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#262626] bg-[#151515] text-lg leading-none text-[#F5F0E8] transition hover:border-[#3a3a3a]"
          >
            <span aria-hidden>{open ? "✕" : "☰"}</span>
          </button>

          {open && (
            <nav className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-[#262626] bg-[#151515] p-2 shadow-2xl shadow-black/50">
              {MENU.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-[#F5F0E8] transition hover:bg-[#1F1F1F]"
                >
                  <span>{item.label}</span>
                  {item.note && <span className="text-[10px] font-black uppercase tracking-wider text-[#7A736B]">{item.note}</span>}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
