"use client";

// A learning path's steps, with progress saved on this device. Each step
// opens to what to learn, something to try, how to know you're ready, and
// the links for it. "Mark done" works on any step, so someone who already
// knows the basics can skip ahead. The next step opens by itself.

import { useEffect } from "react";
import { load, pathStatus, resetPath, startPath, toggleStep, update } from "../../lib/learning/progress.ts";
import { measure } from "../../lib/measure.ts";
import { useLearning } from "./useLearning.ts";

export type StepLink = { title: string; url: string; meta: string; ours?: boolean };
export type StepView = {
  id: string;
  title: string;
  level: string;
  learn: string;
  practice: string;
  done: string;
  links: StepLink[];
  see: { href: string; label: string }[];
};

function openStep(id: string, scroll: boolean) {
  const li = document.getElementById(`step-${id}`);
  const details = li?.querySelector("details");
  if (details) details.open = true;
  if (scroll && li) {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    li.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
}

export function PathProgress({ slug, total, firstStep }: { slug: string; total: number; firstStep: string }) {
  const status = pathStatus(useLearning(), slug);

  if (!status) {
    return (
      <div className="ol-progress-box">
        <button
          type="button"
          className="ol-btn"
          onClick={() => {
            update((s) => startPath(s, slug));
            measure("path_start", { path: slug });
            openStep(firstStep, true);
          }}
        >
          Start this path
        </button>
        <span className="ol-progress-note">{total} steps. Your progress stays on this device.</span>
      </div>
    );
  }

  return (
    <div className="ol-progress-box">
      <div className="ol-progress-row">
        <span className="om-progress om-progress-lg" role="img" aria-label={`${status.done} of ${total} steps done`}>
          <span className="om-progress-bar" style={{ width: `${Math.round((status.done / total) * 100)}%` }} />
        </span>
        <span className="ol-progress-count">{status.finished ? `All ${total} steps done` : `${status.done} of ${total} done`}</span>
      </div>
      <div className="ol-progress-actions">
        {status.next && (
          <a className="ol-btn" href={`#step-${status.next.id}`} onClick={() => openStep(status.next!.id, false)}>
            Continue: step {status.path.steps.findIndex((st) => st.id === status.next!.id) + 1}
          </a>
        )}
        <button
          type="button"
          className="om-linkbtn"
          onClick={() => {
            if (window.confirm("Start this path over? Your checkmarks for it will be cleared.")) update((s) => resetPath(s, slug));
          }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}

export default function PathSteps({ slug, steps }: { slug: string; steps: StepView[] }) {
  const state = useLearning();
  const done = new Set(state.paths[slug]?.done ?? []);
  // After the page loads, open the step named in the address (#step-s3), or
  // else the next step not done. Progress is read straight from this device
  // here, because the first render always shows a fresh visit. Step 1 is open
  // in the page as served; it closes when it's already done.
  useEffect(() => {
    const hash = window.location.hash.match(/^#step-(s\d+)$/)?.[1];
    if (hash) {
      openStep(hash, true);
      return;
    }
    const next = pathStatus(load(), slug)?.next;
    if (next && next.id !== steps[0]?.id) {
      const first = document.getElementById(`step-${steps[0].id}`)?.querySelector("details");
      if (first && load().paths[slug]?.done.includes(steps[0].id)) first.open = false;
      openStep(next.id, false);
    }
  }, [slug, steps]);

  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.match(/^#step-(s\d+)$/)?.[1];
      if (id) openStep(id, true);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const toggle = (id: string, i: number) => {
    const wasDone = done.has(id);
    const next = update((s) => toggleStep(s, slug, id));
    measure("path_step", { path: slug, step: id, done: wasDone ? "no" : "yes" });
    if (!wasDone) {
      const after = pathStatus(next, slug);
      if (after?.finished) measure("path_finish", { path: slug });
      const li = document.getElementById(`step-${id}`);
      const details = li?.querySelector("details");
      if (details) details.open = false;
      const following = steps.slice(i + 1).find((st) => !next.paths[slug]?.done.includes(st.id));
      if (following) openStep(following.id, true);
    }
  };

  return (
    <ol className="ol-steps">
      {steps.map((st, i) => {
        const isDone = done.has(st.id);
        return (
          <li key={st.id} id={`step-${st.id}`} className={isDone ? "ol-step is-done" : "ol-step"}>
            <details open={i === 0}>
              <summary>
                <span className="ol-step-num" aria-hidden>{isDone ? "✓" : i + 1}</span>
                <span className="ol-step-head">
                  <span className="ol-step-title">{st.title}</span>
                  <span className="ol-step-level">{st.level}{isDone ? " · Done" : ""}</span>
                </span>
              </summary>
              <div className="ol-step-body">
                <p>{st.learn}</p>
                <p><strong>Try it:</strong> {st.practice}</p>
                <p><strong>Ready to move on when:</strong> {st.done}</p>
                <ul className="ol-step-links">
                  {st.links.map((l) => (
                    <li key={l.url}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer">{l.title}</a>
                      <span className="ol-meta">{l.meta}{l.ours ? " · An Open Mirror project" : ""}</span>
                    </li>
                  ))}
                  {st.see.map((s) => (
                    <li key={s.href}>
                      <a href={s.href}>{s.label}</a>
                      <span className="ol-meta">On this site</span>
                    </li>
                  ))}
                </ul>
                <button type="button" className={isDone ? "ol-done-btn is-done" : "ol-done-btn"} aria-pressed={isDone} onClick={() => toggle(st.id, i)}>
                  {isDone ? "Done. Tap to undo" : "Mark this step done"}
                </button>
              </div>
            </details>
          </li>
        );
      })}
    </ol>
  );
}
