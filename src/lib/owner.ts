// ─────────────────────────────────────────────────────────────────────────────
// Owner profile — the single source of truth for the owner's public identity.
//
// The site is built to work with every field empty: no public name, no
// photo, no bio, no links, no employer information. To go public later,
// fill in fields here — nothing else needs to change.
//
// Do not put personal details anywhere else in the codebase: not in
// metadata, structured data, image names, alt text, source comments, or
// analytics events.
// ─────────────────────────────────────────────────────────────────────────────

export type OwnerProfile = {
  /** Public display name. null = anonymous; copy says "the owner". */
  publicName: string | null;
  /** Path or URL to a public photo. null = no photo anywhere. */
  photoUrl: string | null;
  /** Short public biography. */
  bio: string | null;
  /** Professional links (portfolio, GitHub, LinkedIn…). */
  links: { label: string; href: string }[];
  /** Public contact address for the owner personally, if any. */
  publicEmail: string | null;
};

export const OWNER: OwnerProfile = {
  publicName: null,
  photoUrl: null,
  bio: null,
  links: [],
  publicEmail: null,
};

/** True when any public identity has been set. */
export function ownerHasPublicProfile(): boolean {
  return Boolean(
    OWNER.publicName || OWNER.photoUrl || OWNER.bio || OWNER.links.length || OWNER.publicEmail
  );
}
