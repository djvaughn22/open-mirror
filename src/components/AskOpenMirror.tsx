"use client";

// The homepage (owner direction, Nov 26-27 2026), in the owner's exact words:
//   Open Mirror / What are you doing? / What do you want to do? / Let us help you.
// The two questions are real inputs and "Let us help you." answers them with
// places to go: Open Mirror's own tools, free learning, work that lasts, the
// Marketplace when someone is buying, selling or restoring, and the owner's
// email. Matching runs here in the browser (lib/discovery/intent.ts): nothing
// typed is sent anywhere, stored or put in a URL. No account.

import Link from "next/link";
import { useState } from "react";
import { interpret, type Interpretation } from "../lib/discovery/intent.ts";
import { placeById, type Place } from "../lib/discovery/places.ts";
import { occupationById } from "../lib/learning/careers.ts";

const EMAIL = "ask@openmirrorllc.com";
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Open Mirror: help")}`;

const DOING = ["Fixing up an old computer", "Running a small business", "Studying", "Looking for work", "Raising a family", "Going through a hard time"];
const WANT = ["Learn something new", "Make a website", "Find work that lasts", "Start a business", "Read the Bible", "Restore something old"];

function PlaceLink({ p }: { p: Place }) {
  const external = p.href.startsWith("http");
  return (
    <li className="om-res-item">
      <a href={p.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{p.title}</a>
      <span className="om-res-line">{p.line}</span>
      <span className="om-res-site">{p.site}</span>
    </li>
  );
}

function Results({ r }: { r: Interpretation }) {
  const ours = r.places.filter((p) => p.item.kind === "ours").slice(0, 4).map((p) => p.item);
  const subjects = r.subjects.slice(0, 5).map((s) => s.item);
  const wantsWork = r.paths.some((p) => p === "job" || p === "career-change" || p === "apprenticeship") || r.places.some((p) => p.item.id === "work");
  const jobs = wantsWork
    ? [...new Set(subjects.flatMap((s) => s.careers ?? []))].slice(0, 4).map((id) => occupationById(id)).filter((o): o is NonNullable<typeof o> => !!o)
    : [];
  const market = r.market.map((d) => placeById(`market-${d}`)).filter((p): p is Place => !!p);
  const nothing = !r.urgent && !ours.length && !subjects.length && !market.length && !wantsWork;
  const crisis = placeById("988");

  return (
    <div className="om-results">
      {r.urgent && crisis && (
        <section className="om-res-group om-res-urgent" aria-label="Help right now">
          <h3>Help right now</h3>
          <ul><PlaceLink p={crisis} /></ul>
        </section>
      )}
      {nothing && (
        <p className="om-res-none">
          Nothing matched those words yet. Try saying it another way, look through <Link href="/learn">Open Mirror Learning</Link>, or browse <a href="#projects">the apps</a>.
        </p>
      )}
      {ours.length > 0 && (
        <section className="om-res-group" aria-label="On Open Mirror">
          <h3>Try this</h3>
          <ul>{ours.map((p) => <PlaceLink key={p.id} p={p} />)}</ul>
        </section>
      )}
      {subjects.length > 0 && (
        <section className="om-res-group" aria-label="Learn">
          <h3>Learn, free</h3>
          <ul>
            {subjects.map((s) => (
              <li key={s.slug} className="om-res-item">
                <Link href={`/learn/${s.slug}`}>{s.name}</Link>
                <span className="om-res-line">{s.line}</span>
              </li>
            ))}
          </ul>
          <p className="om-res-more"><Link href="/learn">Every subject&nbsp;→</Link></p>
        </section>
      )}
      {wantsWork && (
        <section className="om-res-group" aria-label="Work">
          <h3>Work that lasts</h3>
          <ul>
            {jobs.map((o) => (
              <li key={o.id} className="om-res-item">
                <a href={o.bls ?? `https://www.onetonline.org/link/summary/${o.soc}`} target="_blank" rel="noopener noreferrer">{o.title}</a>
                <span className="om-res-line">What the work is, pay and how to start, from the U.S. Department of Labor.</span>
              </li>
            ))}
            <li className="om-res-item">
              <Link href="/learn/work">Work that meets lasting needs</Link>
              <span className="om-res-line">Food, water, shelter, health, repair and more, with official information.</span>
            </li>
          </ul>
        </section>
      )}
      {market.length > 0 && (
        <section className="om-res-group" aria-label="Marketplace">
          <h3>Marketplace</h3>
          <ul>{market.map((p) => <PlaceLink key={p.id} p={p} />)}</ul>
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
  const [answer, setAnswer] = useState<Interpretation | null>(null);

  const ask = (d = doing, w = want) => setAnswer(interpret(`${d} ${w}`));

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
        <label htmlFor="om-doing" className="om-ask-q">What are you doing?</label>
        <input id="om-doing" className="om-ask-input" value={doing} onChange={(e) => setDoing(e.target.value)} autoComplete="off" maxLength={200} placeholder="Fixing up an old laptop, running a shop, raising kids" />
        <div className="om-ask-chips" role="group" aria-label="Examples for what you're doing">
          {DOING.map((c) => (
            <button key={c} type="button" className="om-ask-chip" aria-pressed={doing === c} onClick={() => setDoing(c)}>{c}</button>
          ))}
        </div>

        <label htmlFor="om-want" className="om-ask-q">What do you want to do?</label>
        <input id="om-want" className="om-ask-input" value={want} onChange={(e) => setWant(e.target.value)} autoComplete="off" maxLength={200} placeholder="Learn to fix cars, make a website, find steady work" />
        <div className="om-ask-chips" role="group" aria-label="Examples for what you want to do">
          {WANT.map((c) => (
            <button key={c} type="button" className="om-ask-chip" aria-pressed={want === c} onClick={() => setWant(c)}>{c}</button>
          ))}
        </div>

        <button type="submit" className="om-ask-go">Let us help you.</button>
      </form>
      <noscript>
        <p className="om-res-none">Browse <Link href="/learn">Open Mirror Learning</Link> or the apps below, or email {EMAIL}.</p>
      </noscript>
      <div aria-live="polite">{answer && <Results r={answer} />}</div>
    </section>
  );
}
