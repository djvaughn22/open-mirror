"use client";

export default function PrintButton() {
  function handlePrint() {
    const readingPlanExportButton = document.querySelector<HTMLButtonElement>(
      "[data-chp-reading-plan-export='clean']",
    );

    if (readingPlanExportButton) {
      readingPlanExportButton.click();
      return;
    }

    window.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="w-full max-w-sm rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-100 transition hover:bg-white/15 sm:w-auto"
    >
      Print / Save PDF
    </button>
  );
}
