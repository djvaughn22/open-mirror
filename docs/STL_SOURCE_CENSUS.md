# St. Louis athletics platform census

Taken 1 Sept 2026, sampling ~110 St. Louis metro districts, high schools and
athletics domains. The point was leverage: find the shared platforms, so one
adapter covers many schools instead of one parser covering one.

## The finding that mattered

**St. Louis high school athletics runs on EventLink.** Rockwood, Parkway,
Webster Groves, Ladue, Clayton, Lindbergh, Francis Howell, Fox, Hazelwood,
Mehlville, Chaminade, Vianney, Duchesne, Lutheran South and more all publish
their athletic calendars through it — 27 schools confirmed against a live
endpoint. It is by far the widest platform in the metro.

**And it carries no scores.** Not in any field, on any event. EventLink is a
scheduling and notification product for athletic directors, so it can tell us a
game existed, who hosted and when — but it can never publish a result. That
single fact shaped this whole sprint: breadth and results come from different
platforms, and they have to be kept honestly apart.

## Platforms found

| Platform | STL schools | Results? | Access | Status |
|---|---|---|---|---|
| **EventLink** | 27 confirmed | **No** — fixtures only | `Disallow:` (empty) = allow all; public JSON endpoint | **ADAPTER BUILT** |
| **Finalsite Athletics** | 4 (SLUH, De Smet, Priory, Vianney) | Yes | robots OK, `Crawl-delay: 5` | **ADAPTER BUILT** (Sprint 2) |
| **Mascot Media** | 2 (MICDS, Collinsville) | Yes | `Allow: /`, names AI crawlers as allowed | **ADAPTER BUILT** |
| BigTeams / VNN | 4 (Alton, Granite City, St. Clair, Duchesne) | Yes | robots allows content paths | **NOT BUILT** — see below |
| ArbiterLive | Hazelwood district | Yes | **`User-agent: * / Disallow: /`** | **BLOCKED — excluded** |
| MaxPreps | Althoff and others link to it | Yes | Prohibited | **Excluded** |
| MSHSAA | statewide | Yes | **blanket `Disallow: /`** | **Excluded** (Sprint 2) |
| IHSA ScoreZone | statewide IL | Yes, but republished from MaxPreps | robots OK, source is not | **Excluded** (Sprint 2) |
| Team1Sports | SLUH and others | No — video streaming only | — | Not applicable |
| rSchoolToday | referenced by several districts | Yes | not yet inspected | Not investigated |

## Data shapes

**EventLink** — `GET /s/{slug}?handler=Events&startDate=…&endDate=…`, the same
public JSON the school's own page calls. Per event: opponent, local date/time,
`primaryCalendarTitle` ("Tennis (Girls V)"), `isHome`, `isGame`,
`cancelDateTime`, venue. Clean, structured, no scraping of markup at all.

**Mascot Media** — server-rendered `/sport/{sport}/{gender}/?tab=schedule`.
Sport and gender are in the URL; team level and season come from the page's
selected options; each row carries date, AT/VS, opponent, venue and a
`RESULTS` cell like `L 20 - 53`.

**Finalsite Athletics** — server-rendered `fsEventTable` rows. Documented in
`docs/SPORTS_SOURCES.md`.

## BigTeams: investigated properly, and EXCLUDED

Its `robots.txt` permits the content paths, so the previous sprint left it as
"not built, not blocked". Reading the terms settled it. The BigTeams end-user
agreement prohibits:

> "Accessing or searching any part of the Services by any means other than our
> publicly supported interfaces (for example, *scraping*)"

robots.txt permitting a crawl does not override a term that forbids it, so
BigTeams is excluded. Alton, Granite City, St. Clair and Duchesne stay
uncovered as direct reporters.

## Hudl / Hudl Fan: EXCLUDED

Kirkwood and others link to `fan.hudl.com`. Its robots.txt is permissive
(`Allow: /`), but Hudl's Acceptable Use Policy forbids:

> "use any robot, spider, or other automatic device, process, or means to
> access the Hudl Site or Products for any purpose, including … copying any of
> the material"

and separately bans access "by any means other than Hudl's publicly supported
interfaces (for example, scraping)". Excluded. The Kirkwood links are ticketing
pages in any case, not scores.

## Correction to the previous census

The earlier census reported **rSchoolToday** at several districts. That was a
false positive: the detector matched the substring "rschool" inside
`ritenour**school**s.org` and `kirkwoodpioneer**school**store.com`. No St. Louis
school in this sample actually uses rSchoolToday.

## The structural finding

After exhausting the metro, the shape of this market is clear and it is not
what you would guess:

**St. Louis high schools publish SCHEDULES broadly and RESULTS almost not at
all.** EventLink carries 27 schools' fixtures and no scores. Every other wide
platform that does carry scores — BigTeams, Hudl, ArbiterLive, MaxPreps,
MSHSAA — forbids automated access in robots or in terms.

What is left is the handful of schools that publish results in their own HTML:
SLUH, De Smet and Priory (Finalsite), MICDS and Collinsville (Mascot Media).
Five direct reporters. Searched and ruled out this sprint:

- 30 private schools re-crawled for Finalsite schedule tables — **zero** new.
  Most run a calendar element with no results at all (Whitfield is typical).
- 550 candidate `*athletics.com/.org` domains for Mascot Media — only
  Collinsville, which was already configured.
- 32 candidate St. Louis athletic conference domains — none exist; the hits
  were a college conference and parked domains.
- EventLink probed for a scores endpoint under six handler names — all return
  the page, confirming it has none.

This is a supply problem, not an effort problem. The next real gain comes from
schools choosing to publish results, or from a permitted source appearing —
not from another parser.

## What the census does not cover

Several districts (Pattonville, Mehlville, Affton, University City, Northwest,
and much of Metro East) failed DNS or returned errors from this network during
the census, so their platform is unknown rather than absent. Some of them may
already be reachable through EventLink under slugs not yet discovered.

## How slugs were confirmed

No slug in the configuration is a guess. Each candidate was requested against
the live EventLink endpoint and kept only if it returned a JSON array
containing at least one real game. 27 of 48 candidates confirmed.
