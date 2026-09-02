# St. Louis wire — sources, and why

Every source here was checked before it was automated. The rule is not "can we
fetch it" — it is "are we allowed to, and is it a fact rather than someone
else's writing". A source that fails either test is documented below and left
alone, not worked around.

## What we read

### School athletics pages (Finalsite Athletics) — ACTIVE

- **Adapter:** `src/lib/sports/sources/finalsiteAthletics.ts`
- **What it is:** each school publishing its own schedule and results on its own
  site, in a server-rendered table.
- **Why it is appropriate:** first-party. The school publishes the result
  precisely so people will read and share it. We take scores, dates, opponents
  and venue — facts, not copyrightable expression — and never a sentence of
  anyone's prose. Every published fact links back to the page it came from.
- **Politeness:** each host's `robots.txt` was read; none disallows these paths.
  The declared `Crawl-delay: 5` is honoured by a per-host queue in
  `sources/http.ts`. The bot identifies itself with a contact address. No
  authentication is bypassed, no rate limit is evaded, no headers are spoofed.
- **Two shapes, both read:** the per-sport `fsEventTable`, and the cross-sport
  "recent scores" list built from `<article>` items that some schools put on
  their athletics landing page. The list is cheaper — one request returns every
  sport that school plays.
- **Currently configured:** sluh.org, desmet.org, priory.org, vianney.com.

Adding a school is a row in `metros/stLouis.ts`, not a code change.

### EventLink calendars — ACTIVE (fixtures only)

- **Adapter:** `src/lib/sports/sources/eventlink.ts`
- **What it is:** the public JSON endpoint each school's own EventLink page
  calls — `/s/{slug}?handler=Events&startDate=…&endDate=…`. 27 St. Louis schools
  confirmed against the live endpoint.
- **It carries no scores.** None, in any field. So it can never publish a
  result; it supplies fixtures, home/away and cancellations, which corroborate
  a score reported elsewhere and fill the schedule rail.
- **Why appropriate:** eventlink.com's robots.txt is `User-agent: * /
  Disallow:` — an empty disallow, permitting everything. We read the same public
  endpoint the page itself calls, at one polite request per school.

### Mascot Media athletics sites — ACTIVE

- **Adapter:** `src/lib/sports/sources/mascotMedia.ts`
- **What it is:** school-branded athletics sites (MICDS, Collinsville) with
  server-rendered `/sport/{sport}/{gender}/?tab=schedule` pages carrying full
  results: date, AT/VS, opponent, venue, and a W/L score.
- **Why appropriate:** robots.txt is `Allow: /` with only `/admin/`, `/cms/` and
  `/api/` disallowed — none of which we touch — and it names AI crawlers as
  allowed. Facts only.

## What we deliberately do NOT read

### ArbiterLive — BLOCKED BY ROBOTS

`arbiterlive.com/robots.txt` is `User-agent: * / Disallow: /`. Hazelwood's
district links its schedules there; we do not read it, and Hazelwood's results
reach us only when an opponent reports them.

### BigTeams / VNN — EXCLUDED BY TERMS

Alton, Granite City, St. Clair and Duchesne publish results here, and robots
permits the content paths — but the BigTeams end-user agreement prohibits
"accessing or searching any part of the Services by any means other than our
publicly supported interfaces (for example, scraping)". A permissive robots.txt
does not override that. Excluded.

### Hudl / Hudl Fan — EXCLUDED BY TERMS

Permissive robots.txt, but Hudl's Acceptable Use Policy forbids "any robot,
spider, or other automatic device" and scraping outright. Excluded.


### MSHSAA (mshsaa.org) — BLOCKED BY ROBOTS

`https://www.mshsaa.org/robots.txt` ends with:

```
user-agent: *
disallow: /
```

Under the standard merge rules that group applies to us, so the whole site is
disallowed for automated access. Missouri's association site is the most obvious
place to get Missouri results, and we do not touch it. If MSHSAA ever offers a
feed or grants permission, it becomes an adapter; until then it is closed.

### IHSA ScoreZone (ihsa.org/scores) — REPUBLISHES A PROHIBITED SOURCE

IHSA's `robots.txt` allows crawling, and its terms permit sharing content for
news reporting with attribution. But the ScoreZone page states plainly that its
scores are **supplied by MaxPreps**. Reading it would launder a source we are not
permitted to use, so it is off limits for the same reason MaxPreps itself is.

IHSA remains interesting for *state series* results, which are IHSA's own, and
for the Metro East schools our registry already carries. That would be a
separate, narrower adapter.

### MaxPreps — PROHIBITED

Not scraped, and not consumed indirectly through anyone who republishes it.

### Newspaper coverage (STLtoday and similar) — COPYRIGHTED

Someone else's journalism. We are building original coverage from factual data,
not remixing articles. Facts about a game are not copyrightable; the writing
about it is.

## Known gaps

- **Results, not schools, are the bottleneck now.** 27 schools publish fixtures
  through EventLink, but only six publish scores in a form we can read
  (Finalsite ×4, Mascot Media ×2). Every additional results source multiplies
  coverage, because one reported result names two schools.
- BigTeams would add four Illinois-side results sources, where coverage is
  thinnest.
- Cross country and other meet-scored sports are deliberately dropped as
  non-matchups: a meet is not a two-sided event, and forcing it into one would
  misreport it.

## Adding a source

1. Read its `robots.txt` and its terms. If either forbids automated access, stop
   and document it here instead.
2. Write an adapter that returns `RawObservation[]`. Source quirks stay inside
   it.
3. Register it in `sources/registry.ts` and list its targets in the metro file.
4. Add a fixture and a parser test. Live sites are never required by `npm test`.

## Running the wire

```bash
npm run wire              # yesterday and today
npm run wire -- --days 7  # the last week
npm run wire -- --dry     # run everything, write nothing
```

It takes no input, prints an auditable report, and exits non-zero only when
*every* source failed — one school's site being down is a partial wire, not a
broken one. That makes it safe for a scheduler:

```
15 6 * * *  cd /path/to/open-mirror && npm run wire >> wire.log 2>&1
```

The archive is plain JSON under `data/sports/events/`, so the run is committed
and the published wire is diffable: every change to a published fact shows up in
git history.

**Deployment note.** The job writes files, so it runs where the operator
controls the filesystem — a machine or a container, not a read-only serverless
deployment. Production serves the committed archive read-only. Moving ingestion
into hosting means swapping `fileEventStore` for a database behind the existing
`SportsEventStore` interface; nothing above that seam changes.

## Cost

$0. The wire is deterministic TypeScript over public pages: no paid data feed,
no paid AI API, and no model call in the critical path. `estimatedCostUsd` is
reported on every run so a regression here is visible rather than discovered on
a bill.
