"use client";

import { downloadChpStaticHtml } from "@/lib/chpStaticHtmlExport";

export default function PrintButton() {
  function handlePrint() {
    const readingPlanExportButton = document.querySelector<HTMLButtonElement>(
      "[data-chp-reading-plan-export='clean']",
    );

    if (readingPlanExportButton) {
      readingPlanExportButton.click();
      return;
    }

    downloadChpStaticHtml({ title: document.title || "Cross Heart Pray", fileName: document.title || "cross-heart-pray-cards" });
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="w-full max-w-sm rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-100 transition hover:bg-white/15 sm:w-auto"
    >
      Download HTML
    </button>
  );
}
