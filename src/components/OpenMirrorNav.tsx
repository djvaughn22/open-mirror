"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import OpenMirrorThemeToggle from "../../packages/openmirror-ui/OpenMirrorTheme";
import { bottomPinnedProducts, featuredProduct, type Product } from "../lib/products";

type Item = { label?: string; href?: string; external?: boolean; note?: string; divider?: boolean; heading?: string; emoji?: string };

// The homepage IS the product directory, so the menu no longer repeats it.
// It holds only the site's own destinations: Home, the Foundation, About,
// Contact, then the pinned resource and the packaged product. Everything the
// menu shows still derives from the registry — no hard-coded product names.
function menuItem(p: Product, note?: string): Item {
  const external = p.href.startsWith("http");
  return { label: external ? `${p.name}.com` : p.name, href: p.href, external, note, emoji: p.emoji };
}

const featured = featuredProduct();

// Pinned resources and the packaged product render only while they belong in
// the menu (2026-07-20: both are low-key now — discovered through the
// directory and About, not from every page). The divider ahead of them only
// renders when the group has rows, so no stray rule is left behind.
const TAIL: Item[] = [
  ...bottomPinnedProducts().filter((p) => p.showInNav !== false).map((p) => menuItem(p)),
  ...(featured && featured.showInNav !== false ? [menuItem(featured, "Product")] : []),
];

const MENU: Item[] = [
  // CrossHeartPray (the Foundation) is reached through the shared footer
  // (2026-07-30 family standard) — the menu holds only this site's pages.
  { label: "Open Mirror Home", href: "/", emoji: "🪞" },
  { divider: true },
  { label: "About", href: "/about-open-mirror", emoji: "ℹ️" },
  { label: "Contact", href: "/contact", emoji: "✉️" },
  ...(TAIL.length > 0 ? [{ divider: true } as Item, ...TAIL] : []),
];

export default function OpenMirrorNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const menuId = useId();

  // Escape closes (focus returns to the trigger); pointer down outside closes.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && e.target instanceof Node && !containerRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Close if the route changes underneath an open menu (back/forward safety).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOpen(false); }, [pathname]);

  // On phones, lock the page behind the open menu so it can't drift.
  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 640px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  // Move focus into the menu on open so keyboard users land on item one.
  useEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLElement>("a")?.focus();
  }, [open]);

  return (
    <header className="om-bar sticky top-0 z-50 border-b border-[#26324c] bg-[#0b1220]">
      <div ref={containerRef} className="relative mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3.5">
        {/* The only visible top-level item: Open Mirror Home */}
        <Link href="/" className="inline-flex items-baseline gap-2 text-base font-black tracking-tight text-[#e8edf5]">
          <span>Open Mirror LLC</span>
        </Link>

        <div className="flex items-center gap-2">
        <OpenMirrorThemeToggle />
          <button
            ref={buttonRef}
            type="button"
            aria-label="Open Mirror menu"
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#26324c] bg-[#141d2e] px-3.5 py-2 text-sm font-black text-[#e8edf5] transition hover:bg-[#1c2740] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 sm:px-4"
          >
            <span aria-hidden className="text-base leading-none">{open ? "✕" : "☰"}</span>
            <span className="hidden sm:inline">Menu</span>
          </button>

          {open && (
            <nav
              id={menuId}
              ref={menuRef}
              aria-label="Open Mirror"
              className="absolute right-5 top-[calc(100%+8px)] z-[60] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto overflow-x-hidden rounded-2xl border border-[#26324c] bg-[#141d2e] p-2 shadow-2xl shadow-black/50"
              style={{ maxHeight: "min(80vh, 34rem)" }}
            >
              {MENU.map((item, i) =>
                item.divider ? (
                  <div key={`divider-${i}`} className="my-2 border-t border-[#26324c]" />
                ) : item.heading ? (
                  <div key={`heading-${i}`} className="pb-1 pl-[2.75rem] pr-4 pt-2 text-[10px] font-black uppercase tracking-wider text-[#94a3b8]">
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
                    className="flex min-h-11 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#e8edf5] transition hover:bg-[#1c2740] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60"
                  >
                    <span aria-hidden className="w-5 shrink-0 text-center text-base leading-none">{item.emoji}</span>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.note && <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-[#94a3b8]">{item.note}</span>}
                  </a>
                )
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
