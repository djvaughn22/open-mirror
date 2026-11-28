// One learning path in a list: icon, title, one line, step count, and this
// device's progress. A plain link, so it works without JavaScript.

import Link from "next/link";
import type { LearningPath } from "../../lib/learning/paths.ts";
import PathBadge from "./PathBadge";

export default function PathRow({ p, lineless = false }: { p: LearningPath; lineless?: boolean }) {
  return (
    <li>
      <Link className="om-item" href={`/learn/paths/${p.slug}`}>
        <span className="om-item-icon" aria-hidden>{p.icon}</span>
        <span className="om-item-body">
          <span className="om-item-title">{p.title}</span>
          {!lineless && <span className="om-item-line">{p.line}</span>}
        </span>
        <span className="om-item-meta">
          <PathBadge slug={p.slug} />
          <span className="om-item-steps">{p.steps.length} steps</span>
        </span>
      </Link>
    </li>
  );
}
