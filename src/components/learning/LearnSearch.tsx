"use client";

// "What do you want to learn?" A person doesn't need the formal name of a
// subject: "I like fixing things" finds car repair, electronics, HVAC,
// electrical work and more. Matching runs in the browser (lib/discovery):
// nothing typed is sent anywhere or put in a URL.

import Link from "next/link";
import { useMemo, useState } from "react";
import { interpret } from "../../lib/discovery/intent.ts";
import { PATHWAYS, type PathwayId } from "../../lib/learning/resources.ts";

const EXAMPLES = ["I like fixing things", "How do computers work?", "I want to grow food", "Help people get well", "Make music", "Start a business"];

export default function LearnSearch() {
  const [text, setText] = useState("");
  const [asked, setAsked] = useState("");
  const result = useMemo(() => (asked.trim() ? interpret(asked) : null), [asked]);

  const go = (t: string) => {
    setText(t);
    setAsked(t);
  };

  const paths = (result?.paths ?? []).map((id) => PATHWAYS.find((p) => p.id === id)).filter((p): p is (typeof PATHWAYS)[number] => !!p);

  return (
    <div className="ol-search">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setAsked(text);
        }}
        className="ol-search-form"
      >
        <label htmlFor="ol-q" className="ol-q">What do you want to learn?</label>
        <div className="ol-search-row">
          <input id="ol-q" className="ol-input" value={text} onChange={(e) => setText(e.target.value)} autoComplete="off" maxLength={200} placeholder="Say it in your own words" />
          <button type="submit" className="ol-go">Find</button>
        </div>
      </form>
      <p className="ol-examples">
        Try:{" "}
        {EXAMPLES.map((ex, i) => (
          <span key={ex}>
            <button type="button" className="ol-example" onClick={() => go(ex)}>{ex}</button>
            {i < EXAMPLES.length - 1 ? " · " : ""}
          </span>
        ))}
      </p>
      <div aria-live="polite">
        {result && result.subjects.length === 0 && (
          <p className="ol-none">No subject matched those words yet. Try other words, or browse every subject below.</p>
        )}
        {result && result.subjects.length > 0 && (
          <ol className="ol-hits">
            {result.subjects.slice(0, 10).map((s) => (
              <li key={s.item.slug}>
                <Link href={`/learn/${s.item.slug}`}>{s.item.name}</Link>
                <span> {s.item.line}</span>
                <span className="ol-why"> Matched: {s.why.slice(0, 3).join(", ")}</span>
              </li>
            ))}
          </ol>
        )}
        {paths.length > 0 && (
          <p className="ol-paths">
            Learning for a reason? {paths.map((p, i) => (
              <span key={p.id}>{i > 0 ? " · " : ""}<a href={`/learn#why-${p.id as PathwayId}`}>{p.label}</a></span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
