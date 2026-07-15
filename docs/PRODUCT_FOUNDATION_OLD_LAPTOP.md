# Product Foundation: Old Laptop to Build Machine

Internal note. Not linked anywhere public. Describes how the first real
Open Mirror digital product (`content/products/old-laptop-to-build-machine/`,
reviewable at `/products/old-laptop-to-build-machine`) can become a
reusable foundation for later products — without building any of them yet.

## What actually shipped

A complete, beginner-friendly bundle (14 guides + 2 printable HTML sheets +
a real working first project + a setup script + a verify script), packaged
as `public/downloads/old-laptop-to-build-machine.zip` and rebuildable with
`scripts/package-old-laptop-bundle.sh`. No price, no checkout — an early
product, gated behind an unlisted URL for review.

## The reusable shape underneath it

Every piece of this bundle follows the same underlying pattern, which is
the actual reusable asset — not the laptop-specific content itself:

1. **A numbered guide sequence** (`00-README` → `NN-topic.md`) that reads
   start to finish, each file explaining one concrete stage.
2. **A printable companion** for the checklist/worksheet-shaped guides,
   built as standalone HTML with print CSS — no PDF toolchain required.
3. **A real, working example** the reader can compare their own work
   against, included in the bundle itself.
4. **Optional automation** (a setup script) paired with a **read-only
   verify script** that never assumes the setup script ran — the two are
   independent, so either can be used alone.
5. **A troubleshooting file** and a separate **recovery / "what if it goes
   wrong" file** — kept apart on purpose, because "my thing doesn't work"
   and "I broke something and need to undo it" are different reader states.
6. **An Open Mirror bridge guide** at the end, pointing to whichever live
   Open Mirror tools genuinely help with what comes next — never an
   advertisement, always the actual honest next step.
7. **One unlisted product page** per bundle, following the same layout:
   promise → who it's for → finish-with list → included list → requirements
   → warnings → download → early-product disclosure.

## Candidate future products (not started)

Each of these would reuse the shape above with new subject matter:

- **Idea to first build** — pairs with StepInTheRing; turns its output into
  a bundle format people can work through offline.
- **Beginner website setup** — narrower slice of this bundle's steps 5–10,
  for someone who already has a working computer.
- **Local development starter kit** — steps 6–9 alone, distro-agnostic
  where possible.
- **GitHub and deployment starter kit** — steps 8 and 10 alone, as a
  short-form bundle.
- **Digital product creation kit** — meta: a guide to building a bundle
  like this one, using this bundle as the worked example.
- **A guide to using the Open Mirror engines together** — expands step 13
  into its own bundle once there are enough live tools to justify it.

## Explicit non-goal

Do not start building any of these until this first product has real
usage or feedback behind it. The instruction that produced this bundle was
explicit: finish one product properly rather than half-finishing several.
This document exists so the pattern isn't re-derived from scratch later —
not as a backlog to work through now.
