// ─────────────────────────────────────────────────────────────────────────────
// A very small HTML reader, scoped to exactly what the adapters need.
//
// No dependency, because there is nothing here worth one: these pages are
// machine-generated tables with stable class names, and every function below
// is covered by tests against real saved pages. If a future source needs real
// DOM traversal, that adapter can bring a parser — the seam is the adapter, not
// this file.
// ─────────────────────────────────────────────────────────────────────────────

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
  hellip: "…",
  eacute: "é",
  amp39: "'",
};

export function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, body: string) => {
    if (body.startsWith("#")) {
      const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[body.toLowerCase()] ?? match;
  });
}

/** Visible text of an HTML fragment, whitespace collapsed. */
export function textOf(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]*>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/** First `attribute` on the first `<tag …>` in the fragment. */
export function attr(html: string, tag: string, attribute: string): string | undefined {
  const re = new RegExp(`<${tag}\\b[^>]*\\b${attribute}\\s*=\\s*"([^"]*)"`, "i");
  return html.match(re)?.[1];
}

export interface FoundTable {
  html: string;
  /**
   * Text immediately before the table, which is where Finalsite puts the team
   * name. Bounded so a page with several teams attributes each table correctly.
   */
  precedingText: string;
}

/**
 * Every `<table>` carrying `className`, with the nearest preceding team name.
 *
 * Tables never nest on these pages, so a straight scan for the opening and
 * closing tag is both correct and far more predictable than a full parse.
 */
export function tablesWithClass(html: string, className: string): FoundTable[] {
  const out: FoundTable[] = [];
  const open = new RegExp(`<table\\b[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>`, "gi");
  let match: RegExpExecArray | null;
  while ((match = open.exec(html)) !== null) {
    const start = match.index;
    const end = html.indexOf("</table>", start);
    if (end === -1) continue;
    out.push({
      html: html.slice(start, end + "</table>".length),
      precedingText: nearestTeamName(html, start),
    });
    open.lastIndex = end;
  }
  return out;
}

/**
 * The team name that labels this table: the last `fsAthleticsTeamName` before
 * it. Falls back to the nearest heading so a page that labels its teams with
 * plain markup still parses.
 */
function nearestTeamName(html: string, tableStart: number): string {
  const before = html.slice(0, tableStart);
  const named = [...before.matchAll(/class="[^"]*\bfsAthleticsTeamName\b[^"]*"[^>]*>([\s\S]*?)<\//gi)];
  if (named.length > 0) return textOf(named[named.length - 1][1]);
  const heads = [...before.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)];
  return heads.length > 0 ? textOf(heads[heads.length - 1][1]) : "";
}

/** Body rows of a table, header rows excluded. */
export function rowsOf(tableHtml: string): string[] {
  const body = tableHtml.replace(/<thead[\s\S]*?<\/thead>/gi, "");
  return [...body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((m) => m[0]);
}

/**
 * Cells of one row keyed by their class name, so a column moving does not
 * silently shift every value one place to the left.
 */
export function cellsOf(rowHtml: string): Record<string, string> {
  const cells: Record<string, string> = {};
  for (const m of rowHtml.matchAll(/<td\b([^>]*)>([\s\S]*?)<\/td>/gi)) {
    const classes = m[1].match(/class="([^"]*)"/i)?.[1] ?? "";
    for (const cls of classes.split(/\s+/).filter(Boolean)) {
      if (!(cls in cells)) cells[cls] = m[2];
    }
  }
  return cells;
}
