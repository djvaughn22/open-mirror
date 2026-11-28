"use client";

// Save a subject to come back to, and remember it as recently viewed. Both
// stay on this device (lib/learning/progress.ts).

import { useEffect } from "react";
import { toggleSaved, update, visitSubject } from "../../lib/learning/progress.ts";
import { measure } from "../../lib/measure.ts";
import { useLearning } from "./useLearning.ts";

export default function SaveSubject({ slug, name }: { slug: string; name: string }) {
  const saved = useLearning().saved.includes(slug);

  useEffect(() => {
    update((s) => visitSubject(s, slug));
  }, [slug]);

  return (
    <button
      type="button"
      className={saved ? "ol-save is-saved" : "ol-save"}
      aria-pressed={saved}
      aria-label={saved ? `Saved: ${name}. Tap to remove.` : `Save ${name}`}
      onClick={() => {
        update((s) => toggleSaved(s, slug));
        measure("subject_save", { subject: slug, saved: saved ? "no" : "yes" });
      }}
    >
      <span aria-hidden>{saved ? "★" : "☆"}</span> {saved ? "Saved" : "Save"}
    </button>
  );
}
