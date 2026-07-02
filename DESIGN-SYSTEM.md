# Open Mirror — Shared Flat Design System

Every non-CrossHeartPray site uses the **same flat surfaces** and differs only by a single **accent color**. No transparency (no `/10`, `/20`, `bg-white/[0.03]` — use solid colors).

## Shared tokens (dark theme)

| Token | Value | Use |
|---|---|---|
| Page background | `#0C0C0C` | `<main>` |
| Surface (card) | `#151515` | cards, panels |
| Surface inset | `#1C1C1C` | inputs, nested |
| Border | `#262626` | all borders (solid, 1px/2px) |
| Text | `#F5F0E8` | headings, primary |
| Sub-text | `#9A9188` | body, captions |
| Accent ink | `#0C0C0C` | text on accent buttons |

## Per-site accent

| Site | Accent |
|---|---|
| PleaseBeReady | `#34D399` emerald |
| DontCloneMeTom | `#FB923C` orange |
| Fambookagram | `#FBBF24` amber |
| Friendbookagram | `#818CF8` indigo |
| WhatAmIAI | `#A78BFA` purple |
| TheDJCares | `#FB7185` rose |

## Component rules
- **Card:** `bg-[#151515] border border-[#262626] rounded-2xl`
- **Button (primary):** `bg-[accent] text-[#0C0C0C] rounded-full font-black`
- **Accent text:** the site's accent color, used sparingly (eyebrows, `.com`, checks, links)
- **Brand wordmark:** `Name` in `#F5F0E8` + `.com` in accent
- Flat only — solid fills, solid borders, no opacity modifiers on surfaces.

CrossHeartPray is exempt (MVP-locked, keeps its own design).
