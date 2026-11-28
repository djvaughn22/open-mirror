"use client";

// "What do you want to learn?" A person doesn't need the formal name of a
// subject: "I like fixing things" finds car repair, small engines and home
// repair; "I have an old computer and no money" finds the low-cost way to fix
// one up. Results appear as you type. Matching runs in the browser
// (lib/discovery/intent.ts): nothing typed is sent anywhere or put in a URL.
// Measurement (lib/measure.ts) is off for now; if turned on, it would count
// only whether something matched, when the search is submitted.

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { interpret } from "../../lib/discovery/intent.ts";
import { PATHWAYS } from "../../lib/learning/resources.ts";
import { measure } from "../../lib/measure.ts";

// Kept only in this tab's memory so Back from a result shows the same search.
const memory = { text: "" };
function rememberText(v: string) {
  memory.text = v;
}

const EXAMPLES = ["I want to fix cars", "Learn piano", "Build a website", "Grow my own food", "Understand electricity", "Old computer, no money"];

export default function LearnSearch() {
  const [text, setTextState] = useState(() => memory.text);
  const setText = (v: string) => {
    rememberText(v);
    setTextState(v);
  };
  const deferred = useDeferredValue(text);
  const result = useMemo(() => (deferred.trim().length >= 2 ? interpret(deferred) : null), [deferred]);

  const report = (t: string) => {
    const r = interpret(t);
    if (r.empty) return;
    measure("om_search", { where: "learn", found: r.learningPaths.length || r.subjects.length ? "yes" : "no" });
  };

  // Close matches only: a distant second (matched through a broad word) is noise.
  const topPath = result?.learningPaths[0]?.score ?? 0;
  const topSubject = result?.subjects[0]?.score ?? 0;
  const paths = result?.learningPaths.filter((p, i) => i === 0 || p.score >= topPath * 0.5).slice(0, 3) ?? [];
  const subjects = result?.subjects.filter((x) => x.score >= topSubject * 0.4).slice(0, 6) ?? [];
  const reasons = (result?.paths ?? []).map((id) => PATHWAYS.find((p) => p.id === id)).filter((p): p is (typeof PATHWAYS)[number] => !!p);
  const none = !!result && !result.empty && !paths.length && !subjects.length;

  return (
    <div className="ol-search">
      <form
        role="search"
        className="ol-search-form"
        onSubmit={(e) => {
          e.preventDefault();
          report(text);
          (document.activeElement as HTMLElement | null)?.blur();
        }}
      >
        <label htmlFor="ol-q" className="ol-q">What do you want to learn?</label>
        <div className="ol-search-row">
          <input
            id="ol-q"
            className="ol-input"
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoComplete="off"
            enterKeyHint="search"
            maxLength={200}
            placeholder="In your own words"
            aria-describedby="ol-q-hint"
          />
          <button type="submit" className="ol-go">Find</button>
        </div>
        <p id="ol-q-hint" className="ol-hint">Results show as you type.</p>
      </form>
      <div className="om-ideas-row" role="group" aria-label="Examples">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            className="om-idea"
            onClick={() => {
              setText(ex);
              report(ex);
            }}
          >
            {ex}
          </button>
        ))}
      </div>

      <div aria-live="polite" aria-atomic="false" className="ol-live">
        {none && <p className="ol-none">No subject matched those words yet. Try other words, or browse the areas below.</p>}
        {paths.length > 0 && (
          <section className="ol-hits-group" aria-label="Learning paths">
            <h2 className="ol-mini-h">Learning paths</h2>
            <ul className="om-items">
              {paths.map(({ item: p }, i) => (
                <li key={p.slug}>
                  <Link className="om-item" href={`/learn/paths/${p.slug}`} onClick={() => measure("om_result", { where: "learn", kind: "path", id: p.slug })}>
                    <span className="om-item-icon" aria-hidden>{p.icon}</span>
                    <span className="om-item-body">
                      <span className="om-item-title">{p.title}</span>
                      <span className="om-item-line">{result?.lowCost && i === 0 && p.little[0] ? p.little[0] : p.line}</span>
                    </span>
                    <span className="om-item-meta"><span className="om-item-steps">{p.steps.length} steps</span></span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        {subjects.length > 0 && (
          <section className="ol-hits-group" aria-label="Subjects">
            <h2 className="ol-mini-h">Subjects</h2>
            <ul className="ol-hits">
              {subjects.map((s) => (
                <li key={s.item.slug}>
                  <Link href={`/learn/${s.item.slug}`} onClick={() => measure("om_result", { where: "learn", kind: "subject", id: s.item.slug })}>{s.item.name}</Link>
                  <span className="ol-hit-line">{s.item.line}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {reasons.length > 0 && (
          <p className="ol-paths">
            Learning for a reason? {reasons.map((p, i) => (
              <span key={p.id}>{i > 0 ? " · " : ""}<a href={`#why-${p.id}`}>{p.label}</a></span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
