# Instagram Launch Playbook — Open Mirror LLC

Five brand accounts, one inbox, one afternoon to start (finishing over 2–3
days is correct — do NOT create all five in one sitting; Instagram flags
that). Written 2026-07-14.

The five accounts, in launch order (money first, daily engines ready first):

| # | Brand | Username (fallbacks) | Bio link | Daily engine |
|---|-------|----------------------|----------|--------------|
| 1 | PleaseBeReady | @pleasebeready (@please.be.ready, @pleasebereadycom) | pleasebeready.com/today | ✅ Daily Readiness Check |
| 2 | CrossHeartPray | @crossheartpray (@cross.heart.pray) | crossheartpray.com/today | ✅ Daily Bible Bingo |
| 3 | DontCloneMeTom | @dontclonemetom (@dont.clone.me.tom) | dontclonemetom.com/today | ✅ Dog of the Day |
| 4 | TheDJCares | @thedjcares (@the.dj.cares) | thedjcares.com/today | ✅ Daily Encouragement |
| 5 | Open Mirror | @openmirrorllc (@open.mirror.llc) | openmirrorllc.com | — (brand presence; post when something ships) |

## Phase 0 — before you start (10 minutes, do tonight or tomorrow morning)

1. **Create five email aliases** in the email host that runs
   ask@openmirrorllc.com, all delivering to the same inbox:
   `pleasebeready@`, `crossheartpray@`, `thedjcares@`, `dontclonemetom@`,
   `openmirror@` (all @openmirrorllc.com). Instagram requires a unique
   email per account; aliases satisfy that with one inbox.
   - If your host truly can't do aliases, test plus-addressing first
     (`ask+pleasebeready@openmirrorllc.com`) — Instagram usually accepts it.
2. Have your phone (verification texts) and know each site's brand color/
   emoji for profile pictures (site favicons: each repo's `app/icon.svg`).
3. Rule for every account: **skip "sync contacts," skip suggested follows**
   during signup. These are brand accounts, not personal.

## Phase 1 — Day 1 afternoon: accounts 1–3 (about 20 minutes each)

For each of PleaseBeReady, CrossHeartPray, DontCloneMeTom:

1. Instagram app → profile icon (bottom right) → your username at top →
   **Add account → Create new account**. (The app holds up to 5 accounts
   under one login session — you switch between them from that same menu.)
2. Username from the table above; try fallbacks if taken.
3. Sign up **with the brand's email alias**. Verify with your phone when asked.
4. Immediately set the profile:
   - Name: the brand name spelled normally ("PleaseBeReady").
   - Bio: one plain line, no hype. Examples:
     - PBR: "One small preparedness task a day. Checklists + the exact gear ↓"
     - CHP: "Daily Bible Bingo. Scripture, prayer, hope — every day."
     - DCMT: "One real adoptable dog near St. Louis, every day. Adopt, don't clone."
   - Website: the /today link from the table.
5. **Settings and privacy → Account type and tools → Switch to professional
   account → Business.** Category: "Website" (or "Nonprofit organization"
   feel free for CHP — either works). This is REQUIRED for the auto-publish
   API later.
6. Post day one: open `<site>/admin/social?key=SOCIAL_ADMIN_KEY` →
   Download the card → Copy the caption → post it in the app.
   (SOCIAL_ADMIN_KEY must be set in that site's Vercel env first — any
   secret string works.)
7. Stop after three accounts. Seriously.

## Phase 2 — Day 2: accounts 4–5, then Facebook plumbing

1. Create TheDJCares and Open Mirror accounts the same way.
2. **Facebook Pages** (the API requires each IG business account to be
   linked to a FB page): from your personal Facebook → Menu → Pages →
   Create — one page per brand, name = brand name. Nothing needs to be
   posted on these pages, ever; they're plumbing.
3. Link each: Instagram app → Settings → Business tools and controls →
   Connect a Facebook Page → pick the matching page.
4. **Meta Business Portfolio**: business.facebook.com → Create a business
   portfolio → "Open Mirror LLC" (use ask@openmirrorllc.com) → add all five
   Pages and all five Instagram accounts to it. One roof, all brands.

## Phase 3 — automation (one evening with Claude, after Phases 1–2)

Goal: every brand posts itself daily; you touch nothing.

1. developers.facebook.com → create ONE app under the Open Mirror portfolio
   (type: Business). Claude walks the token flow from here.
2. Per brand, set in that site's Vercel project:
   `INSTAGRAM_ACCOUNT_ID`, `META_ACCESS_TOKEN` (long-lived),
   `INSTAGRAM_AUTOPUBLISH_ENABLED=true`, `CRON_SECRET`, `SOCIAL_ADMIN_KEY`.
3. Daily cron hits each site's `/api/social/instagram/publish` — the shared
   engine's duplicate ledger makes double-posting impossible.
4. Until Phase 3 is done, manual posting from each `/admin/social` panel is
   ~2 minutes per brand per day. Fine for weeks.

## Money — already unified, one thing to add

- Every site's Amazon links carry the `pleasebeready-20` Associates tag →
  one Amazon Associates account (Open Mirror LLC) → **Novo business
  checking**. Nothing new to set up; all future sites reuse `gear.ts` +
  the same tag (or a per-site tracking ID created inside the SAME
  Associates account, so earnings stay in one place but report per site).
- **After each IG account exists**: Amazon Associates Central → Account
  Settings → Edit Website & Mobile App List → add the Instagram profile
  URLs. Keeps the account compliant as IG becomes a traffic source.
- Affiliate links live on the WEBSITES only, never pasted raw into
  captions — captions say "link in bio," bio points at /today, /today
  carries the tagged buttons. That loop is already built.

## Rules that keep the accounts safe

- 2–3 account creations per day, maximum. Same-day bulk creation from one
  phone/IP is the #1 way to get every account flagged at birth.
- Every account: Business type, brand alias email, phone-verified.
- CrossHeartPray stays 100% non-commercial: Bible Bingo only, no gear, no
  consulting, no cross-promo beyond the quiet family identity.
- Expectations: daily automated posts are the engine; followers compound
  over months, not days. The system costs zero minutes a day once Phase 3
  lands — that's what makes slow compounding worth it.
