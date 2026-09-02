// ─────────────────────────────────────────────────────────────────────────────
// Polite fetching.
//
// We are a guest on other people's servers. Every request identifies itself,
// waits its turn, and gives up rather than hammering. The per-host queue below
// honours each source's declared crawl delay, so running twenty schools in
// parallel still means one slow, well-behaved conversation per host.
//
// Nothing here bypasses anything: no cookie games, no header spoofing, no
// pretending to be a browser. If a page will not serve this agent, we take that
// as the answer and record it as a failure.
// ─────────────────────────────────────────────────────────────────────────────

export const USER_AGENT =
  "OpenMirrorSportsBot/1.0 (+https://openmirror.dev; St. Louis high school sports wire; djvaughn22@gmail.com)";

const lastRequestAt = new Map<string, number>();
const hostQueue = new Map<string, Promise<unknown>>();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Serialise requests per host and keep `delaySeconds` between them.
 * Different hosts still run concurrently — the politeness is per-server, which
 * is what a crawl delay actually means.
 */
async function queued<T>(host: string, delaySeconds: number, task: () => Promise<T>): Promise<T> {
  const previous = hostQueue.get(host) ?? Promise.resolve();
  const run = previous.then(async () => {
    const last = lastRequestAt.get(host);
    if (last !== undefined) {
      const wait = last + delaySeconds * 1000 - Date.now();
      if (wait > 0) await sleep(wait);
    }
    lastRequestAt.set(host, Date.now());
    return task();
  });
  // Keep the chain alive even when one request throws, or the whole host stalls.
  hostQueue.set(host, run.then(() => undefined, () => undefined));
  return run;
}

export interface PoliteFetchOptions {
  crawlDelaySeconds: number;
  timeoutMs?: number;
  userAgent?: string;
  /** Extra attempts for a server that said "not now". Default 1. */
  retries?: number;
}

export function politeFetcher(options: PoliteFetchOptions): (url: string) => Promise<string> {
  const { crawlDelaySeconds, timeoutMs = 20_000, userAgent = USER_AGENT, retries = 1 } = options;

  const once = async (url: string): Promise<string> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": userAgent, Accept: "text/html,application/xhtml+xml,application/json" },
        redirect: "follow",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } finally {
      clearTimeout(timer);
    }
  };

  return async (url: string) => {
    const host = new URL(url).host;
    return queued(host, crawlDelaySeconds, async () => {
      let lastError: unknown;
      for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
          return await once(url);
        } catch (error) {
          lastError = error;
          const message = error instanceof Error ? error.message : String(error);
          // 429 and 5xx mean "not now", so back off and try once more. A 404 or
          // a 403 means "no" and is not retried — repeating a refused request
          // is exactly the behaviour a crawl delay exists to prevent.
          const retryable = /HTTP (429|50\d)/.test(message) || /abort|timeout|network|fetch failed/i.test(message);
          if (!retryable || attempt === retries) break;
          await sleep(Math.max(crawlDelaySeconds, 5) * 1000 * (attempt + 2));
        }
      }
      throw lastError;
    });
  };
}
