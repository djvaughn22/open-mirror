"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import OpenMirrorThemeToggle from "../../packages/openmirror-ui/OpenMirrorTheme";
import { NAV_TAIL_KEYS, navGroups, type NavGroup, type Product } from "../lib/products";

type Item = { label?: string; href?: string; external?: boolean; note?: string; divider?: boolean; heading?: string };

// Menu order comes from the registry (src/lib/products.ts → navGroups()):
// Foundation, free sites, in progress, exploring ideas, then the pinned
// resources and the packaged product last. Fambookagram + Friendbookagram are
// public examples of ideas that may become real products — they stay here;
// never hide or park them. Ordering lives in the registry, not this file.
function menuItem(p: Product, note?: string): Item {
  const external = p.href.startsWith("http");
  return { label: external ? `${p.name}.com` : p.name, href: p.href, external, note };
}

function groupItems(g: NavGroup): Item[] {
  return [
    ...(g.heading ? [{ heading: g.heading } as Item] : []),
    ...g.items.map((p) => menuItem(p, g.note)),
  ];
}

const groups = navGroups();
const head = groups.filter((g) => !NAV_TAIL_KEYS.includes(g.key));
const tail = groups.filter((g) => NAV_TAIL_KEYS.includes(g.key));

const MENU: Item[] = [
  { label: "Open Mirror Home", href: "/" },
  // The Foundation sits directly under Home, with no divider between them.
  ...head.flatMap((g, i) => [...(i === 0 ? [] : [{ divider: true } as Item]), ...groupItems(g)]),
  { divider: true },
  { label: "About", href: "/about-open-mirror" },
  { label: "Start Building", href: "https://stepinthering.com" },
  { label: "Contact", href: "/contact" },
  // Pinned resources, then the packaged product — always the last thing read.
  ...tail.flatMap((g) => [{ divider: true } as Item, ...groupItems(g)]),
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
                    // Not keyed by href alone: StepInTheRing appears twice
                    // (its project row and the Start Building action).
                    key={`${item.href}-${i}`}
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
