# Build Machine — refurbished-computer business (INTERNAL)

Internal only. Nothing in this file is customer-facing copy, and the markup
targets, sourcing notes, and cost model must never appear on the website.

Owner brief date: 2026-08-04. Product name and route are locked:
**Old Computer to Build Machine** at `/products/old-laptop-to-build-machine`.
The customer is buying a *Build Machine*, not merely a used computer.

## The three doors

1. **Buy a Build Machine** — finished, wiped, configured, tested machines
   sold from individually tested inventory (`src/lib/buildMachineInventory.ts`).
2. **Build Your Own** — the original self-service playbook + the conversion
   service (device-request workflow). Never removed.
3. **Sell or Donate** — intake of retired equipment from businesses and
   individuals.

## Unit economics model (per machine)

Track every machine against this template before setting a price. Target:
sell completed machines at **10–20× acquisition cost** when delivered value
and the market support it. That multiple is internal only — never in copy.

| Line item | Notes |
|---|---|
| Acquisition cost | What was paid for the unit (or $0 donated + intake time) |
| Transportation / freight | Pickup mileage or inbound shipping |
| Storage | Allocated share of storage space cost |
| Replacement SSD | If original storage removed/failed |
| RAM upgrade | To reach 8–16 GB |
| Charger | Replacement if missing |
| Battery replacement | Only when economical |
| Cleaning supplies | Per-unit allocation |
| Technician labor | Hours × internal rate (wipe, repair, clean) |
| Software preparation | Image install + configuration time |
| Testing | Full functional checklist time |
| Packaging | Box, padding, printed condition report |
| Payment-processing fees | ~3% of sale price (hosted invoice) |
| Shipping (outbound) | Actual or built into price |
| Warranty reserve | Suggested 5% of sale price until real data exists |
| Return reserve | Suggested 5% of sale price until real data exists |
| Customer support | Estimated support time per unit |
| **Total landed cost** | Sum of the above |
| **Target price** | Landed cost + margin; sanity-check against market |
| **Gross profit** | Price − landed cost |
| **Net contribution** | Gross profit − reserves − fees actually incurred |

Record these in each inventory record's `privateIntake` block
(`acquisitionCostUsd`, `partsCostUsd`, `laborHours`, `totalLandedCostUsd`,
`finalSalePriceUsd`). Serial numbers live only in `privateIntake` and are
never rendered — `toPublicListing()` enforces this, and
`tests/buildMachine.test.ts` locks it.

## Minimum machine standards

Customer-facing summary lives on the page in expandable sections; this is
the operating rule.

**Preferred:** 64-bit; Intel Core i5/i7 6th gen+; AMD Ryzen 3/5/7;
comparable Xeon; 8 GB RAM min (16 preferred); 128 GB SSD min on a completed
entry machine (256 preferred); USB boot; unlocked firmware; working
networking; no swollen battery, major liquid damage, or structural failure.

**Review individually:** 4th/5th-gen Intel Core; 4 GB RAM but upgradeable;
driveless units (standard storage fits); no charger; weak-but-safe battery;
repairable business-class; workstations with proprietary parts; Intel Macs;
all-in-ones.

**Normally reject:** 32-bit-only; Atom; low-end Celeron/Pentium; Core 2 Duo;
AMD E-series; permanently 4 GB; soldered eMMC-only; firmware-locked;
Activation-Locked Macs; corporate-management-locked; swollen batteries;
liquid damage; unclear legal ownership.

Special focus: capable machines that cannot officially upgrade to Windows 11
but run a supported Linux Build Machine environment well.

## Phased plan — pilot first, never warehouse first

**Phase 1 — Controlled pilot (~10–25 machines).** Prefer lots of identical
business-class models. Develop ONE repeatable setup image/procedure. Measure
parts cost, labor hours, and failure rate per unit. Sell a limited first
batch. Record every support and return issue.

**Phase 2 — Repeatable inventory (~25–100 machines).** Standardize grading,
packaging, warranty, and return handling. Real individual inventory listings
go live. Build supplier and business-equipment intake relationships.

**Phase 3 — Warehouse operation.** Only after the pilot proves: reliable
demand, positive unit economics, repeatable setup, low return rate,
manageable support, secure intake and wiping, sufficient working capital,
and a legal, practical storage operation. Do not commit to warehouse scale
before all of these are demonstrated.

## Operational and legal notes (not legal advice — flag questions to owner)

- **Ownership transfer:** every acquisition needs a bill of sale or written
  donation record and, for business lots, an asset list. No unit without
  clear legal ownership.
- **Data destruction:** sanitize or remove original storage on every unit;
  keep a per-machine record (method, date, who). The process is *intended to
  follow documented media-sanitization practices* (e.g. NIST SP 800-88
  guidance) — do **not** claim formal certification without documented
  evidence. Never accept machines containing workplace data outside the
  employer's authorized asset-disposition process.
- **Management locks:** corporate MDM (Intune/Autopilot), BIOS passwords,
  and Apple Activation Lock must be released by the owning organization or
  person *before* intake completes. A locked machine is returned or rejected.
- **Batteries:** lithium batteries have shipping restrictions; swollen or
  damaged batteries are never shipped and are recycled properly.
- **Sales tax:** register/collect per Missouri rules for tangible goods;
  confirm before first sale. Owner action.
- **Used-electronics warranty rules & returns:** disclose used/refurbished
  condition plainly; publish return policy before first sale. Owner action.
- **E-waste:** rejected units and dead parts go to a legitimate recycler,
  never the trash.
- **Insurance:** inventory + liability coverage once machine count is
  non-trivial. Owner action.
- **Customer data/privacy:** the interest form is mailto-only and stores
  nothing; keep it that way unless the owner approves a server path.
- **Sourcing privacy:** DJ's workplace and any personal sourcing
  arrangements are never mentioned publicly, in copy, or in listings.

## Draft first-batch warranty (REQUIRES OWNER APPROVAL — not yet promised)

Customer copy currently says only that warranty and return terms are
published with each listing. Before the first sale the owner must approve:

- Condition clearly disclosed as used/refurbished, with known limitations.
- Suggested: **90-day functional warranty** on the machine working as
  described (not cosmetic, not battery runtime).
- Suggested: **14-day return window**, machine in received condition.
- Exclusions: accidental damage, liquid, customer modifications, software
  the customer installs.
- Battery health disclosed separately per machine; batteries excluded from
  the functional warranty beyond "safe and holds a usable charge as listed".
- Support boundary: limited setup support (mirroring the conversion
  service's 30-day support), not general IT support.

None of the suggested numbers are live anywhere on the site.

## Lead handling

Interest emails arrive at ask@openmirrorllc.com with subject
`Build Machine interest — <type>`. Five types: buy, transform own, business
retired equipment, sell/donate, first-batch updates. Tag and keep a simple
list; first-batch-update contacts get the launch email when Phase 1 units go
live. The conversion service keeps its own device-request workflow
(`DEVICE_REQUEST_OPERATIONS.md`).
