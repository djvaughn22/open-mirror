"use client";

import { type ReactNode } from "react";

type PageNucleusHeroProps = {
  title: string;
  subhead: string;
  body?: string;
  children?: ReactNode;
};

export default function PageNucleusHero({
  title,
  subhead,
  body,
  children,
}: PageNucleusHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950/45 p-4 shadow-xl shadow-black/20 print:border-black print:bg-white sm:rounded-[2rem] sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.20),transparent_26rem),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.14),transparent_24rem)]" />

      <div className="relative">
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-black uppercase tracking-[0.26em] text-white sm:text-base"
          aria-hidden="true"
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-3xl tracking-normal">✝️</span>
            <span>Cross</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-3xl tracking-normal">❤️</span>
            <span>Heart</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-3xl tracking-normal">🙏</span>
            <span>Pray</span>
          </span>
        </div>

        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-white print:text-black sm:text-6xl">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-lg font-black leading-snug text-emerald-100 print:text-black sm:text-xl">
          {subhead}
        </p>

        {body ? (
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300 print:text-black">
            {body}
          </p>
        ) : null}

        {children ? <div className="mt-4 print:hidden">{children}</div> : null}
      </div>
    </section>
  );
}
