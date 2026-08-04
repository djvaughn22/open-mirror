// ─────────────────────────────────────────────────────────────────────────────
// Build Machine inventory — the reusable schema for finished, ready-to-use
// machines that Open Mirror prepares and sells.
//
// Honesty rules (owner brief, 2026-08-04):
//   - INVENTORY starts EMPTY. No placeholder listings, no fabricated counts,
//     no fake availability. A machine appears here only after it is real,
//     wiped, configured, and has PASSED its functional test.
//   - The full record includes private intake fields (serial number, costs).
//     Only toPublicListing() output may ever reach a page — it strictly
//     omits every private field.
//   - No listing is publicly "available" unless sanitization is complete,
//     the functional test passed, and any management lock is cleared.
//
// The page renders its honest "inventory coming soon" state whenever
// availableListings() is empty — which it is until real machines exist.
// ─────────────────────────────────────────────────────────────────────────────

export const BUILD_MACHINE_CATEGORIES = [
  "Build Machine Laptop",
  "Build Machine Desktop",
  "Build Machine Mini",
  "Build Machine Workstation",
  "Build Machine Mac",
] as const;
export type BuildMachineCategory = (typeof BUILD_MACHINE_CATEGORIES)[number];

export const FUNCTIONAL_TEST_STATUSES = [
  "not-tested",
  "in-progress",
  "passed",
  "failed",
] as const;

export const SANITIZATION_STATUSES = [
  "pending",
  "drive-removed",
  "sanitized",
] as const;

export const MANAGEMENT_LOCK_STATUSES = [
  "unknown",
  "locked",
  "cleared",
  "none-found",
] as const;

export const AVAILABILITY_STATUSES = [
  "intake",
  "in-preparation",
  "available",
  "reserved",
  "sold",
  "parts-only",
] as const;

export const COSMETIC_GRADES = ["A", "B", "C"] as const;

/**
 * The full internal record for one machine. Private/admin fields are grouped
 * and named so the public projection can never pick them up by accident.
 */
export type BuildMachineInventoryRecord = {
  /** Internal inventory ID, e.g. "BM-0001". Public — printed on the listing. */
  id: string;
  category: BuildMachineCategory;
  manufacturer: string;
  model: string;
  formFactor: string;
  processor: string;
  ram: string;
  storage: string;
  graphics: string;
  /** e.g. "15.6-inch" — empty for headless desktops and minis. */
  displaySize: string;
  /** e.g. "Holds a charge; 78% design capacity" — empty when no battery. */
  batteryHealth: string;
  chargerIncluded: boolean;
  cosmeticGrade: (typeof COSMETIC_GRADES)[number];
  functionalTestStatus: (typeof FUNCTIONAL_TEST_STATUSES)[number];
  sanitizationStatus: (typeof SANITIZATION_STATUSES)[number];
  managementLockStatus: (typeof MANAGEMENT_LOCK_STATUSES)[number];
  availabilityStatus: (typeof AVAILABILITY_STATUSES)[number];
  /** Exact asking price in whole dollars once set; null until priced. */
  targetPriceUsd: number | null;
  warrantyPeriod: string;
  /** Public photo paths under public/ — real photographs only. */
  photos: string[];
  /** Plain-language condition notes a customer should read. Public. */
  publicConditionNotes: string;
  /** What was replaced or upgraded during preparation. Public. */
  workPerformed: string[];
  knownLimitations: string[];
  /** PRIVATE — never rendered, never in the public projection. */
  privateIntake: {
    serialNumber: string;
    acquisitionCostUsd: number;
    partsCostUsd: number;
    laborHours: number;
    totalLandedCostUsd: number;
    finalSalePriceUsd: number | null;
    intakeNotes: string;
  };
};

/** What a page is allowed to see. No serials, no costs, no intake notes. */
export type PublicBuildMachineListing = {
  id: string;
  category: BuildMachineCategory;
  manufacturer: string;
  model: string;
  formFactor: string;
  processor: string;
  ram: string;
  storage: string;
  graphics: string;
  displaySize: string;
  batteryHealth: string;
  chargerIncluded: boolean;
  cosmeticGrade: (typeof COSMETIC_GRADES)[number];
  availabilityStatus: (typeof AVAILABILITY_STATUSES)[number];
  targetPriceUsd: number | null;
  warrantyPeriod: string;
  photos: string[];
  publicConditionNotes: string;
  workPerformed: string[];
  knownLimitations: string[];
};

export function toPublicListing(
  record: BuildMachineInventoryRecord
): PublicBuildMachineListing {
  // Explicit field-by-field copy — never a spread, so a future private field
  // added to the record cannot leak into the public projection.
  return {
    id: record.id,
    category: record.category,
    manufacturer: record.manufacturer,
    model: record.model,
    formFactor: record.formFactor,
    processor: record.processor,
    ram: record.ram,
    storage: record.storage,
    graphics: record.graphics,
    displaySize: record.displaySize,
    batteryHealth: record.batteryHealth,
    chargerIncluded: record.chargerIncluded,
    cosmeticGrade: record.cosmeticGrade,
    availabilityStatus: record.availabilityStatus,
    targetPriceUsd: record.targetPriceUsd,
    warrantyPeriod: record.warrantyPeriod,
    photos: record.photos,
    publicConditionNotes: record.publicConditionNotes,
    workPerformed: record.workPerformed,
    knownLimitations: record.knownLimitations,
  };
}

/**
 * A record may be listed publicly as available only when every gate is
 * passed. This is the honesty rule in code, not just in copy.
 */
export function isListable(record: BuildMachineInventoryRecord): boolean {
  return (
    record.availabilityStatus === "available" &&
    record.functionalTestStatus === "passed" &&
    record.sanitizationStatus !== "pending" &&
    (record.managementLockStatus === "cleared" ||
      record.managementLockStatus === "none-found") &&
    record.targetPriceUsd !== null &&
    record.photos.length > 0 &&
    record.publicConditionNotes.trim().length > 0
  );
}

// The real inventory. EMPTY until actual machines are acquired, prepared,
// tested, and photographed. Do not add a record here to "show the layout".
export const INVENTORY: BuildMachineInventoryRecord[] = [];

/** Public listings ready to render — empty means "inventory coming soon". */
export function availableListings(): PublicBuildMachineListing[] {
  return INVENTORY.filter(isListable).map(toPublicListing);
}
