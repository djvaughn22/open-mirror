"use client";

// A path's progress on this device, beside its title in a list. Renders
// nothing until the browser has read the saved progress, and nothing for a
// path that hasn't been started.

import { pathStatus } from "../../lib/learning/progress.ts";
import { useLearning } from "./useLearning.ts";

export default function PathBadge({ slug }: { slug: string }) {
  const status = pathStatus(useLearning(), slug);
  if (!status) return null;
  return (
    <span className="om-badge" aria-label={status.finished ? "Finished" : `${status.done} of ${status.total} steps done`}>
      {status.finished ? "Done" : `${status.done}/${status.total}`}
    </span>
  );
}
