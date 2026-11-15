"use client";

// Counts which homepage site card a visitor opens, through the hub's existing
// Google Analytics tag. Sends only the site key ("idontcry", "pleasebeready");
// browsers that send Do Not Track or Global Privacy Control send nothing.
// 2026-11-14: the two Oct 8 doors became four groups of site cards, so every
// card is counted now (event site_card_click); door_click history stays in GA.

import { useEffect } from "react";

export default function DoorMeasure() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const site = (e.target as Element | null)?.closest?.("a[data-door]")?.getAttribute("data-door");
      if (!site || !/^[a-z0-9-]{2,40}$/.test(site)) return;
      const nav = window.navigator as Navigator & { globalPrivacyControl?: boolean };
      if (nav.doNotTrack === "1" || nav.globalPrivacyControl === true) return;
      const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
      if (typeof gtag === "function") gtag("event", "site_card_click", { site });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
