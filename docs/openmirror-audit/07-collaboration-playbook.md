# Open Mirror LLC — Collaboration Playbook (Phase 7)

_How to bring in help (human or AI) without giving anyone the keys to the kingdom._

## Roles
| Role | Who | Can do | Cannot do |
|------|-----|--------|-----------|
| **Owner** | DJ only | everything | — |
| **Maintainer** | 1 trusted tech lead | review + merge PRs, manage branches | change billing, DNS, secrets, org permissions |
| **Contributor** | feature helpers | push **feature branches**, open PRs | push to `main`, deploy prod, see secrets |
| **Advisor / Viewer** | strategy folks | read code + issues | write anything |

## GitHub setup (per repo, in Settings)
1. **Protect `main`:** Settings → Branches → add rule for `main` → require a pull request + 1 review before merge; block force-pushes.
2. **Invite as least-privilege:** Collaborators & teams → add with **Write** (contributors) or **Read** (advisors). Give **Admin/Maintain to almost no one.**
3. **Contributors work on branches only:** `git checkout -b feature/<thing>` → push → open PR → you (or the maintainer) review + merge.
4. **No one edits prod directly** — all changes flow through PRs.

## Vercel access model
- **Owner keeps the Vercel account + billing.**
- Add collaborators to a Vercel **Project** (not the account) as **Member**, so they get **preview deploys on their PR branches** but not production control or env-var visibility.
- **Env vars / secrets: owner-only.** Never paste keys in code or chat. (See the `OPENAI_ADMIN_KEY` note in `05-tech-debt-route-audit.md` — rotate it, use a restricted project key.)

## Owner-only, always (never delegate)
GoDaddy / DNS · Vercel billing · production secrets/env vars · GitHub org & repo permissions · Anything that spends money.

## How to hand someone a task safely
1. Open a GitHub **Issue** describing the change + the one file (use `EDIT-EACH-SITE.md`).
2. They branch, edit, `npm run build`, push, open a **PR**.
3. Vercel posts a **preview URL** on the PR — review it there, live, with zero risk to prod.
4. You merge → it deploys. If wrong, revert the PR (one click).

## Human + AI division of labor
- **ChatGPT / strategy:** brainstorming, copy, briefs, naming, marketing — no repo access needed.
- **Claude Code / repo work:** the actual edits, builds, refactors, deploys — pointed at one repo at a time.
- **VS Code (local):** open the repo, work on a **feature branch**, never commit straight to `main`.
- Keep a clear brief up front (saves tokens + confusion): what page, what change, what "done" looks like.

## Standard rollback (pin this — never rewrite main)
```bash
git log --oneline -10                     # 1. identify the unwanted commit(s)
git revert --no-edit <bad-sha>            # 2. undo each as a NEW commit (oldest bad → newest)
npm run build && npm test                 # 3. build + tests must pass
git push                                  # 4. push normally — no --force, ever
```
The push auto-deploys the reversion. Never `git reset --hard` + force-push over `main` —
it rewrites shared history and can eat a collaborator's work. The `pre-audit-*` tags are
read-only restore references for comparing (`git diff <tag>`), not for replacing `main`.
Every deploy also has an **"Instant Rollback"** button in the Vercel dashboard (Deployments → … → Rollback) — no code needed.

## New-collaborator first-task checklist
- [ ] Invited with **Write** (not Admin).
- [ ] Cloned the one repo they'll work on.
- [ ] `npm install` + `npm run build` succeeds locally.
- [ ] Made a tiny change on a `feature/` branch, opened a PR.
- [ ] Saw the Vercel preview URL on the PR.
- [ ] You reviewed + merged. They never touched `main`, secrets, DNS, or billing.
