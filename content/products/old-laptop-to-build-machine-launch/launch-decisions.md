# Launch Decisions — Old Laptop to Build Machine

Internal only. Not customer-facing. **No public pricing. No subscription
model.** For DJ's review and approval before anything ships.

## Current strategy (agreed)

- **Free public tools** stay free (the whole Open Mirror portfolio).
- **One-time paid building playbooks** — this product is the first.
- **Limited direct project help** — the `/contact` page, one project at a time.
- **Distribution:** Etsy and Amazon (KDP), plus possible direct sale later.
- **Audience growth:** Instagram and YouTube, documenting real transformations.
- **Recurring products:** only considered after real recurring demand is proven
  — not now.

## Recommended launch sequence

1. **Free lead magnet first.** Publish the free readiness-check PDF (already
   built) and start posting the social content. Build a small audience and an
   email/interest signal before anything is for sale.
2. **Beginner-test the product** (see below) and fix whatever trips a real
   beginner up.
3. **Etsy listing** as the first paid channel — fastest to stand up, digital
   instant-download, no manuscript formatting required. Use `etsy/listing.md`
   and produce the 10 images from `etsy/listing-images.md`.
4. **Amazon KDP** second — turn `amazon-kdp/manuscript.md` into a formatted
   paperback + Kindle. This is more work (interior layout, cover) but reaches a
   different, search-heavy audience and adds credibility.
5. **Direct sale** last (optional) — only once a real payment + delivery system
   exists on Open Mirror's own site. Until then the product page stays
   "preparing for release."

## Pricing options (for owner approval — do NOT publish)

Digital how-to guides in this space commonly land in a modest one-time range.
Options to weigh:

- **Etsy digital download:** a low, approachable one-time price is typical for
  instant-download guides; price for volume and easy yes, not for margin per
  unit. Consider a small intro price for the first stretch, then settle.
- **Amazon Kindle:** priced lower than the paperback; KDP royalty tiers make a
  mid-single-digit list price the efficient zone.
- **Amazon paperback:** priced to clear KDP's print cost at the 6×9 page count
  with a reasonable margin.
- **Direct (own site):** can sit at or slightly below Etsy, since there's no
  marketplace fee — but only once checkout exists.

DJ sets the actual numbers. Keep them off every public page until then, and
never present a "was/now" fake discount. The free readiness check is always
free.

## Free vs paid boundaries (firm)

| Free, always | Paid (the playbook) |
|---|---|
| Readiness-check PDF | Full illustrated guide (PDF/HTML/MD) |
| The social content itself | Printable worksheet + checklist |
| All Open Mirror web tools | Reference cards (terminal, Git/GitHub) |
| General encouragement/answers | Troubleshooting & recovery guide |
| | Safe setup + verify scripts |
| | Finished first-project files |

The full ZIP is **never** exposed via a public free-download button. The free
check must never contain the paid content.

## Etsy vs Amazon vs direct — differences

- **Etsy** — instant digital download, lowest setup effort, marketplace takes a
  fee + listing cost; buyers expect low prices and quick delivery; strong for
  "digital download" and "printable" search intent. No manuscript formatting
  needed.
- **Amazon KDP** — print + Kindle, highest setup effort (interior + cover +
  metadata), reaches book-buyers and search; adds authority ("it's a book");
  Amazon handles print-on-demand and delivery; royalty math favors specific
  price bands.
- **Direct** — best margin and full control of the customer relationship, but
  requires building/maintaining checkout, delivery, and support; do last.

## Expected customer-support questions

1. "Will this work on my exact laptop?" → point to the free readiness check.
2. "Did I lose my files?" → reinforce the backup chapter; can't recover an
   already-wiped drive.
3. "The USB won't boot." → Secure Boot / re-make the stick (troubleshooting).
4. "`command not found` after install." → re-run the setup step; `verify-setup`.
5. "GitHub Pages shows 404." → branch/folder/filename check.
6. "Which edition — Cinnamon or Xfce?" → RAM-based guidance from Chapter 1.
7. "Is anything else going to cost money?" → no; everything used is free.
8. "Can I get a refund?" → digital-download policy (see Etsy wording).

## Product-update process

1. Edit the source in `content/products/old-laptop-to-build-machine/`.
2. Regenerate PDFs with `scripts/html-to-pdf.py` (guide + printables) and the
   free check.
3. Repackage the ZIP with `scripts/package-old-laptop-bundle.sh`.
4. Bump `VERSION.txt` in the bundle and note the change.
5. Re-upload the updated files to each channel (Etsy file replacement; KDP new
   version; direct download swap).

## Versioning approach

- Semantic-ish: **1.x** for content refreshes (updated commands, fixes), **2.0**
  for a structural rework. The revision date on the guide cover and in
  `VERSION.txt` is the source of truth.
- Because command versions drift (Linux Mint point releases, Node LTS bumps),
  plan a light review roughly twice a year; the setup script pins Node 22 and
  uses official repos, which ages gracefully.

## Must be completed manually before launch

- [ ] DJ approves pricing (kept out of the repo/public until then).
- [ ] Produce the 10 Etsy images from the image spec.
- [ ] Format the KDP paperback interior + Kindle file and design the cover.
- [ ] Set up the Etsy shop (as Open Mirror LLC) and the KDP account.
- [ ] Decide the free-check hosting/link in the Etsy shop About + socials.
- [ ] Confirm `RESEND_API_KEY` for `/contact` (separate, but part of "ready").

## Should be tested with a true beginner before launch

- [ ] Hand the free check to someone non-technical: does it clearly tell them
      whether to proceed?
- [ ] Watch a real beginner follow the guide on an actual old laptop end to end,
      noting every place they hesitate or get stuck — fix those.
- [ ] Confirm they finish with a live URL without needing outside help.

## Go / no-go checklist

- [ ] The free check is genuinely useful and separate from the paid bundle.
- [ ] The paid bundle opens cleanly from START-HERE and every file is present.
- [ ] Every command has been verified against current official docs.
- [ ] Scripts pass syntax + safe-behavior tests and refuse unsupported systems.
- [ ] The guide PDF is designed, complete, and page-numbered.
- [ ] A real beginner completed the journey.
- [ ] Pricing approved by DJ.
- [ ] No public page shows a price, a fake purchase button, or invented
      testimonials/counts/availability.
- [ ] Facelessness intact across all channels.

If every box is checked: go. Otherwise: no-go, fix, recheck.
