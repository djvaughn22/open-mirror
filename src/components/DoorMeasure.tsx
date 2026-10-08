"use client";

// Counts which homepage door a visitor takes, through the hub's existing
// Google Analytics tag. Sends only the door key (family / build / prepare);
// browsers that send Do Not Track or Global Privacy Control send nothing.

import { useEffect } from "react";

export default function DoorMeasure() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const door = (e.target as Element | null)?.closest?.("a[data-door]")?.getAttribute("data-door");
      if (!door || !/^(family|build|prepare)$/.test(door)) return;
      const nav = window.navigator as Navigator & { globalPrivacyControl?: boolean };
      if (nav.doNotTrack === "1" || nav.globalPrivacyControl === true) return;
      const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
      if (typeof gtag === "function") gtag("event", "door_click", { door });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
