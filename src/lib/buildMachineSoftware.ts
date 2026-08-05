// ─────────────────────────────────────────────────────────────────────────────
// Build Machine software manifest — the ONE canonical mapping between what
// gets installed on a machine and why it exists in the Open Mirror journey.
//
// Owner correction (2026-08-04): a Build Machine is NOT a generic refurbished
// Linux computer with a random list of free developer applications. Every
// entry here must answer: "How does this help someone use iDontCry or
// Step In The Ring to make something?" An entry with no related product use
// does not belong in the manifest.
//
// The public page derives its software sections from this manifest, and the
// preparation image installs from it — one source, no drift.
//
// Honesty rules (test-locked in tests/buildMachine.test.ts):
//   - Everything installed is free to use locally.
//   - Nothing is signed into any account — no Open Mirror, Google, GitHub,
//     or personal login is preconfigured. Outside accounts are the
//     customer's own and always optional.
//   - No entry may claim a paid subscription is included.
//   - Heavy services (containers, databases) never default onto the entry
//     tier.
// ─────────────────────────────────────────────────────────────────────────────

export const IDONTCRY_URL = "https://idontcry.com";
export const SITR_URL = "https://stepinthering.com";

// Verified live routes (curl-checked 2026-08-04). Featured experiences and
// engines must come from these lists — never from memory or wishful copy.
export const IDONTCRY_ROUTES = {
  home: `${IDONTCRY_URL}`,
  games: `${IDONTCRY_URL}/games`,
  circuit: `${IDONTCRY_URL}/games/circuit`,
  football: `${IDONTCRY_URL}/games/circuit/football`,
  piano: `${IDONTCRY_URL}/piano`,
  dreamShop: `${IDONTCRY_URL}/dream-shop`,
  fambookagram: `${IDONTCRY_URL}/fambookagram`,
} as const;

export const SITR_ROUTES = {
  home: `${SITR_URL}`,
  engines: `${SITR_URL}/engines`,
  build: `${SITR_URL}/build`,
  projects: `${SITR_URL}/projects`,
  how: `${SITR_URL}/how`,
  engine: (id: string) => `${SITR_URL}/engines?engine=${id}`,
} as const;

export const TIERS = ["Start", "Standard", "Pro"] as const;
export type BuildMachineTier = (typeof TIERS)[number];

export const SOFTWARE_CATEGORIES = [
  "Browse and use Open Mirror",
  "Write and edit a build",
  "Run and test projects",
  "Create visual assets",
  "Work with music and sound",
  "Write stories, guides, and plans",
  "Save versions and continue work",
  "Advanced building",
] as const;
export type SoftwareCategory = (typeof SOFTWARE_CATEGORIES)[number];

export type SoftwareEntry = {
  id: string;
  name: string;
  category: SoftwareCategory;
  /** Exact purpose in the journey, one sentence, plain language. */
  purpose: string;
  /** Package name or installation method. */
  install: string;
  installedByDefault: boolean;
  optional: boolean;
  /** Which machine tiers carry it (by default or as an option). */
  tiers: BuildMachineTier[];
  /** e.g. GitHub — always the customer's own, always optional. */
  requiresOutsideAccount: "no" | "optional" | "yes";
  /** Nothing local requires an Open Mirror account. Kept explicit. */
  requiresOpenMirrorAccount: false;
  /** Verified idontcry.com routes this supports. */
  relatedIDontCry: string[];
  /** Verified Step In The Ring engine ids this supports. */
  relatedSITR: string[];
  freeToUseLocally: true;
  /** An outside paid service exists but is never required or included. */
  outsidePaidServicePossible: boolean;
  versionPolicy: string;
  verifyCommand: string;
  /** The sentence the public page shows. */
  publicExplanation: string;
  internalNotes: string;
};

export const SOFTWARE_MANIFEST: SoftwareEntry[] = [
  // ── Browse and use Open Mirror ────────────────────────────────────────────
  {
    id: "firefox",
    name: "Firefox",
    category: "Browse and use Open Mirror",
    purpose:
      "Open iDontCry, use Step In The Ring, preview projects, and test responsive sites with built-in developer tools.",
    install: "apt: firefox (distribution default)",
    installedByDefault: true,
    optional: false,
    tiers: ["Start", "Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: ["games", "circuit", "piano", "dreamShop", "fambookagram"],
    relatedSITR: ["idea", "build", "design-shop", "howto", "music", "plan"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Distribution updates",
    verifyCommand: "firefox --version",
    publicExplanation:
      "Your window into iDontCry and Step In The Ring, and the place you preview the things you build. Ships signed into nothing — no Open Mirror, Google, or personal account.",
    internalNotes:
      "Fresh profile at first run. Never preconfigure sync, bookmarks with tracking params, or any signed-in state.",
  },
  {
    id: "vscode",
    name: "Visual Studio Code",
    category: "Write and edit a build",
    purpose:
      "Open and edit the files a Step In The Ring project produces or guides — websites, apps, tools, and games.",
    install: "apt: code (Microsoft apt repo — never snap on Mint)",
    installedByDefault: true,
    optional: false,
    tiers: ["Start", "Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: ["dreamShop"],
    relatedSITR: ["idea", "build", "howto", "design-shop"],
    freeToUseLocally: true,
    outsidePaidServicePossible: true,
    versionPolicy: "Microsoft apt repo updates",
    verifyCommand: "code --version",
    publicExplanation:
      "The one included code editor. When Step In The Ring hands you a build plan or starter files, this is where you open them, make guided changes, and see the structure of what you're making.",
    internalNotes:
      "One standard editor by owner rule. Optional AI-assist extensions use the customer's own outside accounts; none preinstalled signed-in.",
  },
  // ── Run and test projects ─────────────────────────────────────────────────
  {
    id: "node",
    name: "Node.js + npm + Corepack",
    category: "Run and test projects",
    purpose:
      "Run websites and apps locally — the same kind of projects the Build Engine plans and the /build walkthrough teaches.",
    install: "apt: nodejs (NodeSource repo, Node 22; npm and Corepack included)",
    installedByDefault: true,
    optional: false,
    tiers: ["Start", "Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: [],
    relatedSITR: ["build", "idea", "howto"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "NodeSource LTS line",
    verifyCommand: "node --version && npm --version",
    publicExplanation:
      "In plain language: this is what runs a website or app on your own machine while you work on it, before anything goes on the internet.",
    internalNotes: "No extra package manager unless a real project needs it.",
  },
  {
    id: "python",
    name: "Python 3 + pip + venv",
    category: "Run and test projects",
    purpose:
      "A beginner-friendly way to run small tools and scripts, and the second language Step In The Ring plans may call for.",
    install: "apt: python3 python3-pip python3-venv",
    installedByDefault: true,
    optional: false,
    tiers: ["Start", "Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: [],
    relatedSITR: ["build", "idea", "howto"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Distribution updates",
    verifyCommand: "python3 --version",
    publicExplanation:
      "A second, friendly language for small tools and experiments — useful the first time an idea needs a script rather than a website.",
    internalNotes: "venv per project; never pip install into system Python.",
  },
  {
    id: "build-tools",
    name: "Basic build tools",
    category: "Run and test projects",
    purpose:
      "The standard compilers some project dependencies need to install cleanly.",
    install: "apt: build-essential",
    installedByDefault: true,
    optional: false,
    tiers: ["Start", "Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: [],
    relatedSITR: ["build"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Distribution updates",
    verifyCommand: "gcc --version",
    publicExplanation:
      "Behind-the-scenes plumbing so project installs 'just work'. You'll rarely touch it directly.",
    internalNotes: "",
  },
  {
    id: "local-server",
    name: "Simple local web server",
    category: "Run and test projects",
    purpose:
      "Preview a plain website folder in the browser with one command.",
    install: "Built into Python 3 (python3 -m http.server) and Node.js (npx serve)",
    installedByDefault: true,
    optional: false,
    tiers: ["Start", "Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: [],
    relatedSITR: ["build", "idea"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Follows Python/Node",
    verifyCommand: "python3 -m http.server --help",
    publicExplanation:
      "One command turns any project folder into a website you can open in Firefox — the fastest way to see your build working.",
    internalNotes: "Documented in the first-run guide's first project.",
  },
  // ── Create visual assets ──────────────────────────────────────────────────
  {
    id: "gimp",
    name: "GIMP",
    category: "Create visual assets",
    purpose:
      "Edit photos and images — touch up Dream Shop artwork, make game art, and prepare Design Shop images.",
    install: "apt: gimp",
    installedByDefault: true,
    optional: false,
    tiers: ["Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: ["dreamShop"],
    relatedSITR: ["design-shop", "etsy"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Distribution updates",
    verifyCommand: "gimp --version",
    publicExplanation:
      "For photos and pixel images: cropping, cleanup, and edits to artwork you made in the Dream Shop or need for a Design Shop product.",
    internalNotes: "Start tier installs on request, not by default (weight).",
  },
  {
    id: "inkscape",
    name: "Inkscape",
    category: "Create visual assets",
    purpose:
      "Draw logos, icons, and scalable graphics for apps, games, and Design Shop concepts.",
    install: "apt: inkscape",
    installedByDefault: true,
    optional: false,
    tiers: ["Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: ["dreamShop"],
    relatedSITR: ["design-shop", "build"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Distribution updates",
    verifyCommand: "inkscape --version",
    publicExplanation:
      "For logos and icons: crisp shapes that scale to any size — the kind of graphics an app or game build needs.",
    internalNotes:
      "Krita deliberately NOT included — GIMP + Inkscape cover the mapped needs; no list-padding.",
  },
  // ── Work with music and sound ─────────────────────────────────────────────
  {
    id: "audacity",
    name: "Audacity",
    category: "Work with music and sound",
    purpose:
      "Record, trim, and organize your own audio — the local half of a Music Engine song project or a piano practice recording.",
    install: "apt: audacity",
    installedByDefault: true,
    optional: false,
    tiers: ["Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: ["piano"],
    relatedSITR: ["music"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Distribution updates",
    verifyCommand: "audacity --version",
    publicExplanation:
      "The Music Engine guides a song project; Audacity is where you record, trim, and keep your own takes. Your recordings stay yours, on your machine.",
    internalNotes: "",
  },
  {
    id: "vlc",
    name: "VLC",
    category: "Work with music and sound",
    purpose: "Play back and review any audio or video file a project produces.",
    install: "apt: vlc",
    installedByDefault: true,
    optional: false,
    tiers: ["Start", "Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: ["piano"],
    relatedSITR: ["music", "howto"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Distribution updates",
    verifyCommand: "vlc --version",
    publicExplanation:
      "Plays nearly any media file — review a recording, check an exported video, or just listen while you work.",
    internalNotes: "",
  },
  // ── Write stories, guides, and plans ──────────────────────────────────────
  {
    id: "libreoffice",
    name: "LibreOffice (Writer, Calc, Impress)",
    category: "Write stories, guides, and plans",
    purpose:
      "Write manuscripts, guides, and plans; track simple project numbers; present an idea.",
    install: "apt: libreoffice (distribution default)",
    installedByDefault: true,
    optional: false,
    tiers: ["Start", "Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: [],
    relatedSITR: ["howto", "plan", "idea", "sell"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Distribution updates",
    verifyCommand: "libreoffice --version",
    publicExplanation:
      "Where written work lives: a How to Anything guide, an idea document, a project plan, or the pages of a story — saved as normal files you own.",
    internalNotes: "",
  },
  {
    id: "pdf-viewer",
    name: "PDF viewer",
    category: "Write stories, guides, and plans",
    purpose: "Read exported guides, playbooks, and packaged documents.",
    install: "apt: xreader (distribution default)",
    installedByDefault: true,
    optional: false,
    tiers: ["Start", "Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: [],
    relatedSITR: ["howto"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Distribution updates",
    verifyCommand: "xreader --version",
    publicExplanation:
      "Opens the included guides and anything you export as PDF.",
    internalNotes: "",
  },
  {
    id: "text-editor",
    name: "Plain-text editor",
    category: "Write stories, guides, and plans",
    purpose: "Quick notes and simple file edits without opening the full editor.",
    install: "apt: xed (distribution default)",
    installedByDefault: true,
    optional: false,
    tiers: ["Start", "Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: [],
    relatedSITR: ["idea"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Distribution updates",
    verifyCommand: "xed --version",
    publicExplanation: "For quick notes and small edits — always a click away.",
    internalNotes: "",
  },
  // ── Save versions and continue work ───────────────────────────────────────
  {
    id: "git",
    name: "Git",
    category: "Save versions and continue work",
    purpose:
      "Preserve project history so you can experiment, roll back, and reopen work later.",
    install: "apt: git",
    installedByDefault: true,
    optional: false,
    tiers: ["Start", "Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: [],
    relatedSITR: ["build", "idea"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Distribution updates",
    verifyCommand: "git --version",
    publicExplanation:
      "Saves snapshots of your project as it grows, so no experiment can destroy your work. It runs entirely on your machine and needs no account.",
    internalNotes: "No credentials, tokens, or Open Mirror repo access ever shipped.",
  },
  {
    id: "github-cli",
    name: "GitHub CLI",
    category: "Save versions and continue work",
    purpose:
      "Connect Git to the customer's OWN optional GitHub account for backup and free website publishing.",
    install: "apt: gh (GitHub apt repo)",
    installedByDefault: true,
    optional: true,
    tiers: ["Start", "Standard", "Pro"],
    requiresOutsideAccount: "optional",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: [],
    relatedSITR: ["build", "launch"],
    freeToUseLocally: true,
    outsidePaidServicePossible: true,
    versionPolicy: "GitHub apt repo updates",
    verifyCommand: "gh --version",
    publicExplanation:
      "If you choose to create your own free GitHub account, this connects to it — for backing up projects and putting a first website online. Entirely optional; nothing is signed in when the machine arrives.",
    internalNotes: "Separate outside service. Never preauthenticated.",
  },
  // ── Advanced building — never default on Start ────────────────────────────
  {
    id: "sqlite",
    name: "SQLite",
    category: "Advanced building",
    purpose:
      "A simple local database for app builds that need to store real data.",
    install: "apt: sqlite3",
    installedByDefault: true,
    optional: false,
    tiers: ["Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: [],
    relatedSITR: ["build"],
    freeToUseLocally: true,
    outsidePaidServicePossible: false,
    versionPolicy: "Distribution updates",
    verifyCommand: "sqlite3 --version",
    publicExplanation:
      "When a Step In The Ring app build needs to remember things, this is the simplest real database — one file, no server.",
    internalNotes: "",
  },
  {
    id: "docker",
    name: "Docker Engine",
    category: "Advanced building",
    purpose:
      "Run containers for bigger builds that need isolated services.",
    install: "apt: docker.io (or Docker's repo), Pro default / Standard optional",
    installedByDefault: false,
    optional: true,
    tiers: ["Standard", "Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: [],
    relatedSITR: ["build"],
    freeToUseLocally: true,
    outsidePaidServicePossible: true,
    versionPolicy: "Pinned per image build",
    verifyCommand: "docker --version",
    publicExplanation:
      "For larger builds: runs project services in tidy, isolated boxes. Included on Pro machines, optional on Standard, and deliberately left off Start machines.",
    internalNotes:
      "NEVER default on Start — entry hardware can't carry it comfortably.",
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "Advanced building",
    purpose:
      "A full database server for the most demanding app builds.",
    install: "apt: postgresql (Pro, on request)",
    installedByDefault: false,
    optional: true,
    tiers: ["Pro"],
    requiresOutsideAccount: "no",
    requiresOpenMirrorAccount: false,
    relatedIDontCry: [],
    relatedSITR: ["build"],
    freeToUseLocally: true,
    outsidePaidServicePossible: true,
    versionPolicy: "Distribution updates",
    verifyCommand: "psql --version",
    publicExplanation:
      "A production-grade database, for Pro machines and projects that have genuinely outgrown SQLite.",
    internalNotes: "Install on request only.",
  },
];

/** Tier profiles — what each machine level is designed for. */
export const TIER_PROFILES: {
  tier: BuildMachineTier;
  designedFor: string[];
}[] = [
  {
    tier: "Start",
    designedFor: [
      "iDontCry games and creative tools",
      "Idea exploration and documents",
      "Story writing and guides",
      "Basic websites and simple JavaScript",
      "Python basics",
      "Lightweight Step In The Ring projects",
      "Hosted AI tools through your own accounts",
    ],
  },
  {
    tier: "Standard",
    designedFor: [
      "Full Step In The Ring web-app projects",
      "Modern Node.js and Python development",
      "Browser testing",
      "Local databases and light container use",
      "Design and audio work",
      "AI-assisted coding through your own accounts",
    ],
  },
  {
    tier: "Pro",
    designedFor: [
      "Larger Step In The Ring builds",
      "Heavier containers and multiple local services",
      "Larger test suites",
      "More demanding media work",
      "Advanced game and application projects",
      "Selected local AI experiments where the hardware genuinely supports them",
    ],
  },
];

export function softwareByCategory(): {
  category: SoftwareCategory;
  entries: SoftwareEntry[];
}[] {
  return SOFTWARE_CATEGORIES.map((category) => ({
    category,
    entries: SOFTWARE_MANIFEST.filter((e) => e.category === category),
  })).filter((g) => g.entries.length > 0);
}
