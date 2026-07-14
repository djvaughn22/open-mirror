"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import OpenMirrorThemeToggle from "../../packages/openmirror-ui/OpenMirrorTheme";
import { products, type Product } from "../lib/products";

type Item = { label?: string; href?: string; external?: boolean; note?: string; divider?: boolean; heading?: string };

// Menu is derived from the product registry (src/lib/products.ts) in the same
// order as the homepage: Foundation + Live sites first, a divider, then
// everything in progress, About, and the bottom-pinned products last.
function menuItem(p: Product): Item {
  const external = p.href.startsWith("http");
  return { label: external ? `${p.name}.com` : p.name, href: p.href, external };
}

const navProducts = products.filter((p) => p.showInNav !== false);
const liveItems = navProducts.filter((p) => (p.status === "foundation" || p.status === "live") && p.pinBottom !== true).map(menuItem);
const inProgressItems = navProducts.filter((p) => p.status !== "foundation" && p.status !== "live" && p.status !== "archived" && p.pinBottom !== true).map(menuItem);
const bottomItems = navProducts.filter((p) => p.pinBottom === true).map(menuItem);

const MENU: Item[] = [
  { label: "Open Mirror Home", href: "/" },
  ...liveItems,
  { divider: true },
  { heading: "In Progress" },
  ...inProgressItems,
  { divider: true },
  { label: "About", href: "/about-open-mirror" },
  { label: "Start Building", href: "https://stepinthering.com" },
  { label: "Talk with the Owner", href: "/talk-with-the-owner" },
  { divider: true },
  ...bottomItems,
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
    <header className="om-bar sticky top-0 z-50 border-b border-[#26324c] bg-[#0b1220]">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
        {/* The only visible top-level item: Open Mirror Home */}
        <Link href="/" className="inline-flex items-baseline gap-2 text-base font-black tracking-tight text-[#e8edf5]">
          <span>Open Mirror LLC</span>
        </Link>

        <div className="flex items-center gap-2">
        <OpenMirrorThemeToggle />
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
              {MENU.map((item, i) =>
                item.divider ? (
                  <div key={`divider-${i}`} className="my-2 border-t border-[#26324c]" />
                ) : item.heading ? (
                  <div key={`heading-${i}`} className="px-4 pb-1 pt-2 text-[10px] font-black uppercase tracking-wider text-[#94a3b8]">
                    {item.heading}
                  </div>
                ) : (
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
                )
              )}
            </nav>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
