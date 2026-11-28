"use client";

// "Continue where you left off": the paths in progress, the subjects saved,
// and the last subjects opened, all from this device (lib/learning/progress.ts).
// Shows nothing at all for a first-time visitor.

import Link from "next/link";
import { continueList } from "../../lib/learning/progress.ts";
import { subjectBySlug } from "../../lib/learning/taxonomy.ts";
import { useLearning } from "./useLearning.ts";

export default function ContinueLearning({ where }: { where: "home" | "learn" }) {
  const state = useLearning();
  const active = continueList(state).filter((x) => !x.finished).slice(0, 3);
  const saved = state.saved.map((s) => subjectBySlug(s)).filter((s): s is NonNullable<typeof s> => !!s).slice(0, 8);
  const recent = state.recent
    .filter((s) => !state.saved.includes(s))
    .map((s) => subjectBySlug(s))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .slice(0, 4);
  if (!active.length && !saved.length && !recent.length) return null;

  return (
    <section className={`om-continue om-continue-${where}`} aria-labelledby={`continue-${where}`}>
      <h2 id={`continue-${where}`} className="om-sec-title">Pick up where you left off</h2>
      {active.length > 0 && (
        <ul className="om-items">
          {active.map(({ path, done, total, next }) => (
            <li key={path.slug}>
              <Link className="om-item" href={`/learn/paths/${path.slug}${next ? `#step-${next.id}` : ""}`}>
                <span className="om-item-icon" aria-hidden>{path.icon}</span>
                <span className="om-item-body">
                  <span className="om-item-title">{path.title}</span>
                  <span className="om-item-line">{next ? `Next: ${next.title}` : "All steps done"}</span>
                  <span className="om-progress" role="img" aria-label={`${done} of ${total} steps done`}>
                    <span className="om-progress-bar" style={{ width: `${Math.round((done / total) * 100)}%` }} />
                  </span>
                </span>
                <span className="om-item-meta">{done}/{total}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {saved.length > 0 && (
        <div className="om-continue-tags">
          <h3 className="om-mini-title">Saved subjects</h3>
          <ul className="om-chips-list">
            {saved.map((s) => <li key={s.slug}><Link className="om-tag" href={`/learn/${s.slug}`}>{s.name}</Link></li>)}
          </ul>
        </div>
      )}
      {recent.length > 0 && (
        <div className="om-continue-tags">
          <h3 className="om-mini-title">Recently viewed</h3>
          <ul className="om-chips-list">
            {recent.map((s) => <li key={s.slug}><Link className="om-tag" href={`/learn/${s.slug}`}>{s.name}</Link></li>)}
          </ul>
        </div>
      )}
      <p className="om-continue-note">Saved on this device only. Nothing is sent anywhere.</p>
    </section>
  );
}
