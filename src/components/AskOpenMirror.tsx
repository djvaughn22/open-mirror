"use client";

// The homepage question box (owner direction: the four lines "Open Mirror /
// What are you doing? / What do you want to do? / Let us help you." are
// approved; Nov 27-28 2026: make them compact, optional, quick and enjoyable).
//
// Two real questions in one compact box, like a travel site's search card.
// Answer either, both, or neither and just browse below. Ideas under the box
// change with the question you're on; tapping one answers it right away.
// Matching runs here in the browser (lib/discovery/intent.ts): what someone
// types is never sent anywhere, stored or put in a URL. The only thing
// measured is whether anything matched, and which of our own results was
// opened (lib/measure.ts).

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { interpret, type Interpretation } from "../lib/discovery/intent.ts";
import { placeById, type Place } from "../lib/discovery/places.ts";
import { occupationById } from "../lib/learning/careers.ts";
import { measure } from "../lib/measure.ts";

const EMAIL = "ask@openmirrorllc.com";
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Open Mirror: help")}`;

// Real things people say. Short enough for a phone.
const IDEAS = {
  doing: ["Fixing up an old computer", "Raising kids", "Looking for work", "Running a small shop", "Studying", "Going through a hard time"],
  want: ["Learn piano", "Fix my car", "Make a website", "Grow my own food", "Start a business", "Find steady work", "Read the Bible", "Restore something old"],
} as const;

type Which = keyof typeof IDEAS;

function PlaceLink({ p }: { p: Place }) {
  const external = p.href.startsWith("http");
  return (
    <li className="om-hit">
      <a
        href={p.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={() => measure("om_result", { where: "home", kind: p.kind === "market" ? "market" : "place", id: p.id })}
      >
        <span className="om-hit-title">{p.title}</span>
        <span className="om-hit-line">{p.line}</span>
        <span className="om-hit-meta">{p.site}</span>
      </a>
    </li>
  );
}

function Results({ r, onClear, headingRef }: { r: Interpretation; onClear: () => void; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const paths = r.learningPaths.slice(0, 2).map((p) => p.item);
  const ours = r.places.filter((p) => p.item.kind === "ours").slice(0, 3).map((p) => p.item);
  const subjects = r.subjects.slice(0, 4).map((s) => s.item);
  const wantsWork = r.paths.some((p) => p === "job" || p === "career-change" || p === "apprenticeship") || r.places.some((p) => p.item.id === "work");
  const jobs = wantsWork
    ? [...new Set(subjects.flatMap((s) => s.careers ?? []))].slice(0, 3).map((id) => occupationById(id)).filter((o): o is NonNullable<typeof o> => !!o)
    : [];
  const market = r.market.map((d) => placeById(`market-${d}`)).filter((p): p is Place => !!p);
  const nothing = !r.urgent && !paths.length && !ours.length && !subjects.length && !market.length && !wantsWork;
  const crisis = placeById("988");

  return (
    <div className="om-results">
      <div className="om-results-head">
        <h2 ref={headingRef} tabIndex={-1} className="om-results-title">{nothing ? "Nothing matched yet" : "Here's where to start"}</h2>
        <button type="button" className="om-linkbtn" onClick={onClear}>Clear</button>
      </div>

      {r.urgent && crisis && (
        <section className="om-res-urgent" aria-label="Help right now">
          <h3>Help right now</h3>
          <ul className="om-hits"><PlaceLink p={crisis} /></ul>
        </section>
      )}

      {nothing && (
        <p className="om-res-none">
          Try other words, or browse <Link href="/learn/paths">learning paths</Link>, <Link href="/learn">subjects</Link> or <a href="#projects">the apps</a>.
        </p>
      )}

      {paths.length > 0 && (
        <section aria-label="Learning paths">
          <h3>Start here</h3>
          <ul className="om-hits">
            {paths.map((p, i) => (
              <li key={p.slug} className="om-hit om-hit-path">
                <Link href={`/learn/paths/${p.slug}`} onClick={() => measure("om_result", { where: "home", kind: "path", id: p.slug })}>
                  <span className="om-hit-icon" aria-hidden>{p.icon}</span>
                  <span className="om-hit-body">
                    <span className="om-hit-title">{p.title}</span>
                    <span className="om-hit-line">{r.lowCost && i === 0 && p.little[0] ? p.little[0] : p.line}</span>
                    <span className="om-hit-meta">{p.steps.length} steps · Learning path</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ours.length > 0 && (
        <section aria-label="On Open Mirror">
          <h3>Try this</h3>
          <ul className="om-hits">{ours.map((p) => <PlaceLink key={p.id} p={p} />)}</ul>
        </section>
      )}

      {subjects.length > 0 && (
        <section aria-label="Subjects">
          <h3>Learn more</h3>
          <ul className="om-chips-list">
            {subjects.map((s) => (
              <li key={s.slug}>
                <Link href={`/learn/${s.slug}`} className="om-tag" onClick={() => measure("om_result", { where: "home", kind: "subject", id: s.slug })}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {wantsWork && (
        <section aria-label="Work">
          <h3>Work</h3>
          <ul className="om-hits">
            {jobs.map((o) => (
              <li key={o.id} className="om-hit">
                <a href={o.bls ?? `https://www.onetonline.org/link/summary/${o.soc}`} target="_blank" rel="noopener noreferrer" onClick={() => measure("om_result", { where: "home", kind: "work", id: o.id })}>
                  <span className="om-hit-title">{o.title}</span>
                  <span className="om-hit-meta">Pay, outlook and training: U.S. Department of Labor</span>
                </a>
              </li>
            ))}
            <li className="om-hit">
              <Link href="/learn/work" onClick={() => measure("om_result", { where: "home", kind: "work", id: "work-that-lasts" })}>
                <span className="om-hit-title">Work that lasts</span>
                <span className="om-hit-line">Jobs that meet needs like food, shelter, health and repair.</span>
              </Link>
            </li>
          </ul>
        </section>
      )}

      {market.length > 0 && (
        <section aria-label="Marketplace">
          <h3>Marketplace</h3>
          <ul className="om-hits">{market.map((p) => <PlaceLink key={p.id} p={p} />)}</ul>
        </section>
      )}

      <p className="om-res-owner">
        Want a person to help? <a href={MAILTO}>Email the owner for more details.</a>
      </p>
    </div>
  );
}

export default function AskOpenMirror() {
  const [doing, setDoing] = useState("");
  const [want, setWant] = useState("");
  const [focus, setFocus] = useState<Which>("want");
  const [answer, setAnswer] = useState<Interpretation | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [asked, setAsked] = useState(0);

  const ask = (d = doing, w = want) => {
    const r = interpret(`${d} ${w}`);
    if (r.empty) return;
    setAnswer(r);
    setAsked((n) => n + 1);
    const found = r.urgent || r.learningPaths.length > 0 || r.subjects.length > 0 || r.places.length > 0 || r.market.length > 0;
    measure("om_search", { where: "home", found: found ? "yes" : "no" });
  };

  // After an answer, move focus to its heading: that closes the phone keyboard
  // and tells screen readers the answer is there (one announcement, not two).
  useEffect(() => {
    if (!asked) return;
    headingRef.current?.focus({ preventScroll: true });
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    resultsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [asked]);

  const pick = (which: Which, idea: string) => {
    if (which === "doing") {
      setDoing(idea);
      ask(idea, want);
    } else {
      setWant(idea);
      ask(doing, idea);
    }
  };

  const clear = () => {
    setDoing("");
    setWant("");
    setAnswer(null);
    document.getElementById("om-want")?.focus();
  };

  return (
    <section className="om-ask" aria-labelledby="om-ask-title">
      <h1 id="om-ask-title" className="om-ask-title">Open Mirror</h1>
      <form
        className="om-ask-form"
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
      >
        <div className="om-ask-box">
          <div className="om-ask-field">
            <label htmlFor="om-doing" className="om-ask-q">What are you doing?</label>
            <input
              id="om-doing"
              className="om-ask-input"
              value={doing}
              onChange={(e) => setDoing(e.target.value)}
              onFocus={() => setFocus("doing")}
              autoComplete="off"
              enterKeyHint="search"
              maxLength={200}
              placeholder="Fixing up an old laptop"
            />
          </div>
          <div className="om-ask-field">
            <label htmlFor="om-want" className="om-ask-q">What do you want to do?</label>
            <input
              id="om-want"
              className="om-ask-input"
              value={want}
              onChange={(e) => setWant(e.target.value)}
              onFocus={() => setFocus("want")}
              autoComplete="off"
              enterKeyHint="search"
              maxLength={200}
              placeholder="Learn piano, fix a car"
            />
          </div>
        </div>
        <div className="om-ask-ideas" role="group" aria-label={focus === "doing" ? "Ideas for what you're doing" : "Ideas for what you want to do"}>
          {IDEAS[focus].map((idea) => (
            <button key={idea} type="button" className="om-idea" onClick={() => pick(focus, idea)}>{idea}</button>
          ))}
        </div>
        <button type="submit" className="om-ask-go">Let us help you.</button>
      </form>
      <noscript>
        <p className="om-res-none">Browse <Link href="/learn/paths">learning paths</Link>, <Link href="/learn">subjects</Link> or the apps below, or email {EMAIL}.</p>
      </noscript>
      <div ref={resultsRef} className="om-results-wrap">
        {answer && <Results r={answer} onClear={clear} headingRef={headingRef} />}
      </div>
    </section>
  );
}
