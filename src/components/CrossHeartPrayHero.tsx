import type { ReactNode } from "react";

type CrossHeartPrayHeroProps = {
  children?: ReactNode;
  className?: string;
  compact?: boolean;
};

export default function CrossHeartPrayHero({
  children,
  className = "",
  compact = false,
}: CrossHeartPrayHeroProps) {
  return (
    <section
      className={`mx-auto max-w-5xl text-center ${compact ? "py-3" : "py-6 sm:py-8"} ${className}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-black uppercase tracking-[0.36em] text-white sm:text-base">
        <span className="inline-flex items-center gap-3">
          <span className="text-4xl tracking-normal">✝️</span>
          <span>Cross</span>
        </span>
        <span className="inline-flex items-center gap-3">
          <span className="text-4xl tracking-normal">❤️</span>
          <span>Heart</span>
        </span>
        <span className="inline-flex items-center gap-3">
          <span className="text-4xl tracking-normal">🙏</span>
          <span>Pray</span>
        </span>
      </div>

      <p className="mt-5 text-center text-sm font-black uppercase tracking-[0.42em] text-emerald-100 sm:text-base">BIBLE APP EVERY DAY</p>

      {children ? (
        <div className="mx-auto mt-7 max-w-3xl text-base font-semibold leading-8 text-slate-300 sm:text-lg">
          {children}
        </div>
      ) : null}
    </section>
  );
}
