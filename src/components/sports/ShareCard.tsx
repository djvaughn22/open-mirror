// The one shareable treatment. Vertical 4:5, readable at thumbnail size,
// nothing on it that was not verified. Rendered as HTML/CSS so it is exportable
// as an image from the browser with no server-side rendering infrastructure.

import type { ShareCardData } from "@/lib/sports/share";

export const SHARE_CARD_ID = "sports-share-card";

export default function ShareCard({ data, href }: { data: ShareCardData; href?: string }) {
  const { final, tagline, standout } = data;
  const won = final.result === "W";

  return (
    <div
      id={SHARE_CARD_ID}
      className="flex w-full flex-col justify-between border border-[#26324c] bg-[#0b1220] text-[#e8edf5]"
      style={{
        aspectRatio: "4 / 5",
        padding: "7% 7% 6%",
        containerType: "inline-size",
        // A system stack on purpose: the exported PNG skips font embedding, so
        // this keeps the saved card identical to the one on screen.
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
      }}
    >
      <div>
        <p className="m-0 font-black uppercase tracking-[0.28em] text-[#38bdf8]" style={{ fontSize: "3.4cqw" }}>
          Final
        </p>
        <div className="mt-[5cqw] flex flex-col gap-[3cqw]">
          <Row name={final.team} score={final.teamScore} strong={won} />
          <div className="w-full border-t border-[#26324c]" />
          <Row name={final.opponent} score={final.opponentScore} strong={!won && final.result === "L"} />
        </div>
      </div>

      {tagline ? (
        <p
          className="m-0 font-black uppercase leading-none tracking-[0.06em] text-[#38bdf8]"
          style={{ fontSize: "7.5cqw" }}
        >
          {tagline}
        </p>
      ) : null}

      {standout ? (
        <div>
          <div className="w-full border-t border-[#26324c]" />
          <p className="mb-0 mt-[4cqw] font-black uppercase leading-none tracking-[0.02em]" style={{ fontSize: "9cqw" }}>
            {standout.name}
          </p>
          <p className="m-0 mt-[2cqw] font-black uppercase tracking-[0.14em] text-[#94a3b8]" style={{ fontSize: "5cqw" }}>
            {standout.stats}
          </p>
        </div>
      ) : null}

      <div>
        <div className="mb-[4cqw] w-full border-t border-[#26324c]" />
        <p className="m-0 font-bold uppercase tracking-[0.18em] text-[#94a3b8]" style={{ fontSize: "3.1cqw" }}>
          {data.demo ? "Demo season · " : ""}Read the Game Edition
        </p>
        {href ? (
          <p className="m-0 mt-[1cqw] font-bold tracking-[0.02em] text-[#94a3b8]" style={{ fontSize: "3.1cqw" }}>
            {href}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Row({ name, score, strong }: { name: string; score: number; strong: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-[4cqw]">
      <span
        className="min-w-0 flex-1 truncate font-black uppercase leading-none tracking-[0.01em]"
        style={{ fontSize: "8.5cqw", color: strong ? undefined : "#94a3b8" }}
      >
        {name}
      </span>
      <span
        className="shrink-0 font-black leading-none tabular-nums"
        style={{ fontSize: "13cqw", color: strong ? "#38bdf8" : "#94a3b8" }}
      >
        {score}
      </span>
    </div>
  );
}
