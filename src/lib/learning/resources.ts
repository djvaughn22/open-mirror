// ─────────────────────────────────────────────────────────────────────────────
// Open Mirror Learning: free resources made by others (owner direction,
// Nov 26-27 2026). We link to the original source; we never copy it.
//
// Rules for every entry:
// - A real page, opened by `npm run links:check` (scripts/check-links.ts).
//   `checked` is the date it last answered. Sites that refuse automated
//   checks (bls.gov, careeronestop.org) are opened in a browser instead.
// - Say what it costs. "Free" means free to use; a paid exam, license or
//   certificate is named where one exists.
// - Say what it is legally: an open license (Creative Commons and the like),
//   a U.S. government publication, or simply free to read. Open-licensed is
//   not the same as free to access, and the label keeps them apart.
// - No affiliate links, ever, and nothing here is ranked by money.
// - No reviews, ratings or quality scores we didn't earn.
// ─────────────────────────────────────────────────────────────────────────────

export type ResourceKind = "read" | "book" | "course" | "watch" | "practice" | "tool" | "reference" | "official";

export type Cost =
  | "free"            // free to use, no account
  | "free-account"    // free, an account saves progress
  | "free-paid-cert"  // free to learn; a certificate or credential costs money
  | "free-paid-exam"; // free to learn; the exam or license that counts costs money

export type License =
  | "open"  // an open license: reuse allowed under its terms
  | "gov"   // a U.S. government publication (generally free of copyright in the U.S.)
  | "free"; // free to read or watch; the publisher keeps its rights

export type Level = "start" | "any" | "deeper";

export type PathwayId =
  | "curious" | "skill" | "college" | "job" | "career-change" | "apprenticeship"
  | "start-business" | "improve-business" | "create" | "independent" | "community" | "teach";

export type Resource = {
  id: string;
  title: string;
  by: string;
  url: string;
  kind: ResourceKind;
  cost: Cost;
  license: License;
  /** The license by name, only where one license covers the whole source. */
  licenseName?: string;
  level: Level;
  subjects?: string[];
  disciplines?: string[];
  paths?: PathwayId[];
  /** One short, factual line. */
  note?: string;
  /** An Open Mirror project, said plainly so it's never mistaken for a third party. */
  ours?: boolean;
  checked: string;
};

const C = "2026-11-27";

export const RESOURCES: Resource[] = [
  // ── Everything, anywhere ────────────────────────────────────────────────
  { id: "wikipedia", title: "Wikipedia", by: "Wikimedia Foundation", url: "https://en.wikipedia.org/wiki/Main_Page", kind: "reference", cost: "free", license: "open", licenseName: "CC BY-SA 4.0", level: "any", paths: ["curious"], note: "A starting overview for nearly any subject. Follow its sources.", checked: C },
  { id: "wikibooks", title: "Wikibooks", by: "Wikimedia Foundation", url: "https://en.wikibooks.org/wiki/Main_Page", kind: "book", cost: "free", license: "open", licenseName: "CC BY-SA 4.0", level: "any", paths: ["curious", "independent"], note: "Free textbooks anyone can improve.", checked: C },
  { id: "openstax", title: "OpenStax textbooks", by: "Rice University", url: "https://openstax.org/subjects", kind: "book", cost: "free", license: "open", level: "any", paths: ["college", "independent", "teach"], note: "College textbooks, free online and as PDFs. Each book names its own Creative Commons license.", checked: C },
  { id: "mit-ocw", title: "MIT OpenCourseWare", by: "Massachusetts Institute of Technology", url: "https://ocw.mit.edu/", kind: "course", cost: "free", license: "open", licenseName: "CC BY-NC-SA 4.0", level: "deeper", paths: ["college", "independent", "curious"], note: "Materials from real MIT courses: lectures, notes and problem sets. No credit or certificate.", checked: C },
  { id: "khan", title: "Khan Academy", by: "Khan Academy (nonprofit)", url: "https://www.khanacademy.org/", kind: "course", cost: "free-account", license: "free", level: "start", paths: ["college", "skill", "independent", "teach"], note: "Practice and short lessons from basic math through college subjects.", checked: C },
  { id: "oer-commons", title: "OER Commons", by: "ISKME (nonprofit)", url: "https://oercommons.org/", kind: "reference", cost: "free", license: "open", level: "any", paths: ["teach", "independent"], note: "A library of open educational resources for teachers and learners.", checked: C },
  { id: "gutenberg", title: "Project Gutenberg", by: "Project Gutenberg (volunteers)", url: "https://www.gutenberg.org/", kind: "book", cost: "free", license: "open", level: "any", disciplines: ["languages", "history", "philosophy"], paths: ["curious"], note: "Free ebooks whose U.S. copyright has expired.", checked: C },
  { id: "librivox", title: "LibriVox", by: "LibriVox (volunteers)", url: "https://librivox.org/", kind: "watch", cost: "free", license: "open", licenseName: "Public domain", level: "any", disciplines: ["languages"], paths: ["curious"], note: "Free audiobooks of public-domain books, read by volunteers.", checked: C },
  { id: "open-library", title: "Open Library", by: "Internet Archive", url: "https://openlibrary.org/", kind: "book", cost: "free-account", license: "free", level: "any", paths: ["curious", "community"], note: "Find a book, and borrow digital copies where they're available.", checked: C },
  { id: "crashcourse", title: "Crash Course", by: "Complexly (YouTube)", url: "https://www.youtube.com/@crashcourse", kind: "watch", cost: "free", license: "free", level: "start", paths: ["curious", "college"], note: "Short video courses on dozens of subjects. YouTube's terms and ads apply.", checked: C },
  { id: "gcf", title: "GCFGlobal", by: "Goodwill Community Foundation", url: "https://edu.gcfglobal.org/en/", kind: "course", cost: "free", license: "free", level: "start", disciplines: ["computing", "life", "home"], paths: ["skill", "job"], note: "Plain-language lessons on computers, reading, math, work and everyday life.", checked: C },
  { id: "smithsonian-lab", title: "Smithsonian Learning Lab", by: "Smithsonian Institution", url: "https://learninglab.si.edu/", kind: "reference", cost: "free", license: "free", level: "any", disciplines: ["history", "art", "science"], paths: ["teach", "curious"], note: "Museum images, recordings and texts for learning.", checked: C },

  // ── Math ─────────────────────────────────────────────────────────────────
  { id: "khan-math", title: "Khan Academy math", by: "Khan Academy", url: "https://www.khanacademy.org/math", kind: "practice", cost: "free-account", license: "free", level: "start", disciplines: ["math"], paths: ["college", "skill"], checked: C },
  { id: "openstax-prealgebra", title: "Prealgebra 2e", by: "OpenStax", url: "https://openstax.org/details/books/prealgebra-2e", kind: "book", cost: "free", license: "open", level: "start", subjects: ["arithmetic-algebra"], checked: C },
  { id: "openstax-college-algebra", title: "College Algebra 2e", by: "OpenStax", url: "https://openstax.org/details/books/college-algebra-2e", kind: "book", cost: "free", license: "open", level: "any", subjects: ["arithmetic-algebra"], paths: ["college"], checked: C },
  { id: "openstax-calculus", title: "Calculus Volume 1", by: "OpenStax", url: "https://openstax.org/details/books/calculus-volume-1", kind: "book", cost: "free", license: "open", level: "deeper", subjects: ["calculus"], paths: ["college"], checked: C },
  { id: "mit-calculus", title: "Single Variable Calculus (18.01SC)", by: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/", kind: "course", cost: "free", license: "open", licenseName: "CC BY-NC-SA 4.0", level: "deeper", subjects: ["calculus"], checked: C },
  { id: "mit-linear-algebra", title: "Linear Algebra (18.06)", by: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", kind: "course", cost: "free", license: "open", licenseName: "CC BY-NC-SA 4.0", level: "deeper", subjects: ["calculus", "statistics"], checked: C },
  { id: "openstax-stats", title: "Introductory Statistics 2e", by: "OpenStax", url: "https://openstax.org/details/books/introductory-statistics-2e", kind: "book", cost: "free", license: "open", level: "any", subjects: ["statistics"], paths: ["college"], checked: C },
  { id: "openintro-stats", title: "OpenIntro Statistics", by: "OpenIntro (nonprofit)", url: "https://www.openintro.org/book/os/", kind: "book", cost: "free", license: "open", level: "any", subjects: ["statistics"], checked: C },
  { id: "seeing-theory", title: "Seeing Theory", by: "Brown University", url: "https://seeing-theory.brown.edu/", kind: "practice", cost: "free", license: "free", level: "start", subjects: ["statistics"], note: "Probability and statistics you can see and play with.", checked: C },
  { id: "openstax-contemporary-math", title: "Contemporary Mathematics", by: "OpenStax", url: "https://openstax.org/details/books/contemporary-mathematics", kind: "book", cost: "free", license: "open", level: "start", subjects: ["logic", "arithmetic-algebra"], checked: C },
  { id: "desmos", title: "Desmos graphing calculator", by: "Desmos Studio", url: "https://www.desmos.com/calculator", kind: "tool", cost: "free", license: "free", level: "any", subjects: ["arithmetic-algebra", "geometry", "calculus"], checked: C },
  { id: "geogebra", title: "GeoGebra", by: "GeoGebra", url: "https://www.geogebra.org/", kind: "tool", cost: "free", license: "free", level: "any", subjects: ["geometry", "arithmetic-algebra"], note: "Free tools for geometry, graphing and algebra.", checked: C },
  { id: "3blue1brown", title: "3Blue1Brown", by: "Grant Sanderson (YouTube)", url: "https://www.youtube.com/@3blue1brown", kind: "watch", cost: "free", license: "free", level: "deeper", subjects: ["calculus", "artificial-intelligence", "logic"], note: "Animated explanations of math ideas. YouTube's terms and ads apply.", checked: C },

  // ── Science ─────────────────────────────────────────────────────────────
  { id: "khan-science", title: "Khan Academy science", by: "Khan Academy", url: "https://www.khanacademy.org/science", kind: "course", cost: "free-account", license: "free", level: "start", disciplines: ["science"], checked: C },
  { id: "phet", title: "PhET interactive simulations", by: "University of Colorado Boulder", url: "https://phet.colorado.edu/", kind: "practice", cost: "free", license: "open", licenseName: "CC BY 4.0", level: "start", disciplines: ["science"], subjects: ["electronics", "energy", "arithmetic-algebra"], paths: ["teach", "curious"], note: "Science and math simulations that run in the browser.", checked: C },
  { id: "openstax-biology", title: "Biology 2e", by: "OpenStax", url: "https://openstax.org/details/books/biology-2e", kind: "book", cost: "free", license: "open", level: "any", subjects: ["biology"], paths: ["college"], checked: C },
  { id: "mit-biology", title: "Introductory Biology (7.016)", by: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/7-016-introductory-biology-fall-2018/", kind: "course", cost: "free", license: "open", licenseName: "CC BY-NC-SA 4.0", level: "deeper", subjects: ["biology"], checked: C },
  { id: "openstax-chemistry", title: "Chemistry 2e", by: "OpenStax", url: "https://openstax.org/details/books/chemistry-2e", kind: "book", cost: "free", license: "open", level: "any", subjects: ["chemistry"], paths: ["college"], checked: C },
  { id: "openstax-physics", title: "College Physics 2e", by: "OpenStax", url: "https://openstax.org/details/books/college-physics-2e", kind: "book", cost: "free", license: "open", level: "any", subjects: ["physics"], paths: ["college"], checked: C },
  { id: "mit-mechanics", title: "Classical Mechanics (8.01SC)", by: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/", kind: "course", cost: "free", license: "open", licenseName: "CC BY-NC-SA 4.0", level: "deeper", subjects: ["physics", "mechanical-engineering"], checked: C },
  { id: "openstax-astronomy", title: "Astronomy 2e", by: "OpenStax", url: "https://openstax.org/details/books/astronomy-2e", kind: "book", cost: "free", license: "open", level: "any", subjects: ["astronomy"], checked: C },
  { id: "nasa-learning", title: "NASA learning resources", by: "NASA", url: "https://www.nasa.gov/learning-resources/", kind: "official", cost: "free", license: "gov", level: "start", subjects: ["astronomy", "earth-science"], paths: ["curious", "teach"], checked: C },
  { id: "natgeo-education", title: "National Geographic Education", by: "National Geographic Society", url: "https://education.nationalgeographic.org/", kind: "reference", cost: "free", license: "free", level: "start", subjects: ["geography", "earth-science", "ecology"], paths: ["teach", "curious"], checked: C },

  // ── Computers, programming and AI ───────────────────────────────────────
  { id: "khan-computing", title: "Khan Academy computing", by: "Khan Academy", url: "https://www.khanacademy.org/computing", kind: "course", cost: "free-account", license: "free", level: "start", disciplines: ["computing"], checked: C },
  { id: "gcf-computers", title: "Computer basics", by: "GCFGlobal", url: "https://edu.gcfglobal.org/en/computerbasics/", kind: "course", cost: "free", license: "free", level: "start", subjects: ["computer-basics"], paths: ["skill", "job"], checked: C },
  { id: "ifixit", title: "iFixit repair guides", by: "iFixit", url: "https://www.ifixit.com/Guide", kind: "practice", cost: "free", license: "open", licenseName: "CC BY-NC-SA 3.0", level: "any", subjects: ["computer-repair", "appliance-repair", "electronics", "automotive-repair", "home-repair"], paths: ["skill", "independent"], note: "Step-by-step repair guides with photos, written by a community of fixers.", checked: C },
  { id: "linux-mint-guide", title: "Linux Mint installation guide", by: "Linux Mint", url: "https://linuxmint-installation-guide.readthedocs.io/en/latest/", kind: "official", cost: "free", license: "free", level: "start", subjects: ["linux", "computer-repair"], paths: ["skill", "independent"], note: "The official steps for installing Linux Mint, a free system that runs well on older computers.", checked: C },
  { id: "ubuntu-install", title: "Install Ubuntu Desktop", by: "Canonical", url: "https://ubuntu.com/tutorials/install-ubuntu-desktop", kind: "official", cost: "free", license: "free", level: "start", subjects: ["linux"], checked: C },
  { id: "linux-journey", title: "Linux Journey", by: "Linux Journey (open source)", url: "https://linuxjourney.com/", kind: "course", cost: "free", license: "free", level: "start", subjects: ["linux"], note: "Short lessons on the command line and how Linux works.", checked: C },
  { id: "sitr-build-machine", title: "Check and set up the computer you have", by: "Step In The Ring", url: "https://stepinthering.com/build-machine", kind: "practice", cost: "free", license: "free", level: "start", subjects: ["computer-repair", "linux"], paths: ["skill", "create"], ours: true, note: "Assess an older computer, protect your files, install, then check it works. No account.", checked: C },
  { id: "freecodecamp", title: "freeCodeCamp", by: "freeCodeCamp (nonprofit)", url: "https://www.freecodecamp.org/learn/", kind: "course", cost: "free-account", license: "free", level: "start", subjects: ["programming", "web-development"], paths: ["job", "career-change", "skill"], note: "A full coding curriculum with projects and free certifications.", checked: C },
  { id: "odin-project", title: "The Odin Project", by: "The Odin Project (open source)", url: "https://www.theodinproject.com/", kind: "course", cost: "free", license: "free", level: "start", subjects: ["web-development", "programming"], paths: ["career-change", "independent"], note: "A free web development path built around real projects.", checked: C },
  { id: "mdn-learn", title: "MDN: Learn web development", by: "Mozilla", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", kind: "course", cost: "free", license: "open", licenseName: "CC BY-SA 2.5", level: "start", subjects: ["web-development"], note: "HTML, CSS and JavaScript from the people who document the web.", checked: C },
  { id: "sitr-start", title: "Make a one-page website from an example", by: "Step In The Ring", url: "https://stepinthering.com/start", kind: "practice", cost: "free", license: "free", level: "start", subjects: ["web-development", "starting-a-business"], paths: ["create", "start-business"], ours: true, note: "Pick an example, make it yours, download the files. No account, no coding.", checked: C },
  { id: "mit-python", title: "Introduction to Computer Science and Programming in Python (6.0001)", by: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/", kind: "course", cost: "free", license: "open", licenseName: "CC BY-NC-SA 4.0", level: "any", subjects: ["programming"], paths: ["college"], checked: C },
  { id: "openstax-python", title: "Introduction to Python Programming", by: "OpenStax", url: "https://openstax.org/details/books/introduction-python-programming", kind: "book", cost: "free", license: "open", level: "start", subjects: ["programming"], checked: C },
  { id: "pro-git", title: "Pro Git", by: "Scott Chacon and Ben Straub", url: "https://git-scm.com/book/en/v2", kind: "book", cost: "free", license: "open", licenseName: "CC BY-NC-SA 3.0", level: "any", subjects: ["version-control"], checked: C },
  { id: "elements-of-ai", title: "Elements of AI", by: "University of Helsinki and MinnaLearn", url: "https://www.elementsofai.com/", kind: "course", cost: "free-account", license: "free", level: "start", subjects: ["artificial-intelligence"], paths: ["curious", "job"], note: "What AI is and isn't, for people with no math or coding background.", checked: C },
  { id: "google-ml", title: "Machine Learning Crash Course", by: "Google", url: "https://developers.google.com/machine-learning/crash-course", kind: "course", cost: "free", license: "free", level: "deeper", subjects: ["artificial-intelligence"], checked: C },
  { id: "fastai", title: "Practical Deep Learning for Coders", by: "fast.ai", url: "https://course.fast.ai/", kind: "course", cost: "free", license: "free", level: "deeper", subjects: ["artificial-intelligence", "programming"], checked: C },
  { id: "mit-ai", title: "Artificial Intelligence (6.034)", by: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/", kind: "course", cost: "free", license: "open", licenseName: "CC BY-NC-SA 4.0", level: "deeper", subjects: ["artificial-intelligence"], checked: C },

  // ── Engineering ─────────────────────────────────────────────────────────
  { id: "mit-ocw-engineering", title: "MIT OpenCourseWare: engineering courses", by: "MIT OpenCourseWare", url: "https://ocw.mit.edu/search/?t=Engineering", kind: "course", cost: "free", license: "open", licenseName: "CC BY-NC-SA 4.0", level: "deeper", disciplines: ["engineering"], checked: C },
  { id: "mit-circuits", title: "Circuits and Electronics (6.002)", by: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/", kind: "course", cost: "free", license: "open", licenseName: "CC BY-NC-SA 4.0", level: "deeper", subjects: ["electronics", "electrical-engineering"], checked: C },
  { id: "mit-design-manufacturing", title: "Design and Manufacturing I (2.007)", by: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/2-007-design-and-manufacturing-i-spring-2009/", kind: "course", cost: "free", license: "open", licenseName: "CC BY-NC-SA 4.0", level: "deeper", subjects: ["mechanical-engineering"], checked: C },

  // ── Trades: learning, and the official way in ───────────────────────────
  { id: "apprenticeship-finder", title: "Apprenticeship Finder", by: "U.S. Department of Labor", url: "https://www.apprenticeship.gov/apprenticeship-job-finder", kind: "official", cost: "free", license: "gov", level: "start", disciplines: ["trades", "engineering", "health", "computing"], paths: ["apprenticeship", "job", "career-change"], note: "Search Registered Apprenticeships: paid jobs where you earn while you learn.", checked: C },
  { id: "this-old-house", title: "This Old House", by: "This Old House (YouTube)", url: "https://www.youtube.com/@thisoldhouse", kind: "watch", cost: "free", license: "free", level: "any", subjects: ["home-repair", "carpentry-woodworking", "plumbing", "electrical-work", "hvac"], paths: ["skill", "independent"], note: "Home repair shown by working tradespeople. YouTube's terms and ads apply.", checked: C },
  { id: "chrisfix", title: "ChrisFix", by: "ChrisFix (YouTube)", url: "https://www.youtube.com/@ChrisFix", kind: "watch", cost: "free", license: "free", level: "start", subjects: ["automotive-repair"], paths: ["skill", "independent"], note: "Car repair step by step, for beginners. YouTube's terms and ads apply.", checked: C },
  { id: "wikibooks-woodworking", title: "Woodworking", by: "Wikibooks", url: "https://en.wikibooks.org/wiki/Woodworking", kind: "book", cost: "free", license: "open", licenseName: "CC BY-SA 4.0", level: "start", subjects: ["carpentry-woodworking"], checked: C },

  // ── Agriculture and the environment ─────────────────────────────────────
  { id: "mu-extension", title: "University of Missouri Extension", by: "University of Missouri", url: "https://extension.missouri.edu/", kind: "official", cost: "free", license: "free", level: "start", disciplines: ["agriculture", "home"], subjects: ["gardening", "farming", "food-preservation", "budgeting"], paths: ["skill", "community"], note: "Research-based guides on gardens, farms, food and family, and local classes. Every state has an extension service.", checked: C },
  { id: "nchfp", title: "National Center for Home Food Preservation", by: "University of Georgia", url: "https://nchfp.uga.edu/", kind: "official", cost: "free", license: "free", level: "start", subjects: ["food-preservation", "food-safety"], note: "Tested methods for canning, freezing and drying.", checked: C },
  { id: "beginning-farmers", title: "Beginning farmers and ranchers", by: "U.S. Department of Agriculture", url: "https://www.farmers.gov/your-business/beginning-farmers", kind: "official", cost: "free", license: "gov", level: "start", subjects: ["farming"], paths: ["start-business"], checked: C },
  { id: "epa-topics", title: "Environmental topics", by: "U.S. Environmental Protection Agency", url: "https://www.epa.gov/environmental-topics", kind: "official", cost: "free", license: "gov", level: "start", disciplines: ["environment"], checked: C },

  // ── Business and money ──────────────────────────────────────────────────
  { id: "sba-learning", title: "SBA Learning Platform", by: "U.S. Small Business Administration", url: "https://www.sba.gov/sba-learning-platform", kind: "course", cost: "free", license: "gov", level: "start", disciplines: ["business"], paths: ["start-business", "improve-business"], note: "Free courses on planning, starting and running a small business.", checked: C },
  { id: "sba-guide", title: "Business guide: plan, launch, manage, grow", by: "U.S. Small Business Administration", url: "https://www.sba.gov/business-guide", kind: "official", cost: "free", license: "gov", level: "start", subjects: ["starting-a-business", "management"], paths: ["start-business"], checked: C },
  { id: "score", title: "SCORE mentoring", by: "SCORE (SBA resource partner)", url: "https://www.score.org/", kind: "reference", cost: "free", license: "free", level: "any", disciplines: ["business"], paths: ["start-business", "improve-business", "community"], note: "Free mentoring and workshops from volunteer business mentors.", checked: C },
  { id: "irs-small-business", title: "Small business and self-employed tax center", by: "Internal Revenue Service", url: "https://www.irs.gov/businesses/small-businesses-self-employed", kind: "official", cost: "free", license: "gov", level: "start", subjects: ["starting-a-business", "accounting"], paths: ["start-business"], note: "The official source for federal business taxes. Not advice for your situation.", checked: C },
  { id: "openstax-intro-business", title: "Introduction to Business", by: "OpenStax", url: "https://openstax.org/details/books/introduction-business", kind: "book", cost: "free", license: "open", level: "start", subjects: ["starting-a-business", "management"], checked: C },
  { id: "openstax-entrepreneurship", title: "Entrepreneurship", by: "OpenStax", url: "https://openstax.org/details/books/entrepreneurship", kind: "book", cost: "free", license: "open", level: "any", subjects: ["starting-a-business"], paths: ["start-business"], checked: C },
  { id: "openstax-marketing", title: "Principles of Marketing", by: "OpenStax", url: "https://openstax.org/details/books/principles-marketing", kind: "book", cost: "free", license: "open", level: "any", subjects: ["marketing", "selling-online"], paths: ["improve-business"], checked: C },
  { id: "openstax-management", title: "Principles of Management", by: "OpenStax", url: "https://openstax.org/details/books/principles-management", kind: "book", cost: "free", license: "open", level: "any", subjects: ["management"], checked: C },
  { id: "mit-new-enterprises", title: "New Enterprises (15.390)", by: "MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/15-390-new-enterprises-spring-2013/", kind: "course", cost: "free", license: "open", licenseName: "CC BY-NC-SA 4.0", level: "deeper", subjects: ["starting-a-business"], checked: C },
  { id: "sitr-engines", title: "Engine Room: a launch plan, a price to test, an event plan", by: "Step In The Ring", url: "https://stepinthering.com/engines", kind: "practice", cost: "free", license: "free", level: "start", subjects: ["starting-a-business", "marketing"], paths: ["start-business", "improve-business"], ours: true, note: "Guided steps that end with something you can use. No account.", checked: C },
  { id: "openstax-economics", title: "Principles of Economics 3e", by: "OpenStax", url: "https://openstax.org/details/books/principles-economics-3e", kind: "book", cost: "free", license: "open", level: "any", subjects: ["economics"], paths: ["college"], checked: C },
  { id: "khan-econ", title: "Khan Academy economics and finance", by: "Khan Academy", url: "https://www.khanacademy.org/economics-finance-domain", kind: "course", cost: "free-account", license: "free", level: "start", subjects: ["economics", "personal-finance", "investing-basics"], checked: C },
  { id: "cfpb", title: "Consumer tools", by: "Consumer Financial Protection Bureau", url: "https://www.consumerfinance.gov/consumer-tools/", kind: "official", cost: "free", license: "gov", level: "start", subjects: ["personal-finance", "budgeting"], note: "Credit, debt, banking and money decisions, from a federal agency.", checked: C },
  { id: "investor-gov", title: "Investor.gov", by: "U.S. Securities and Exchange Commission", url: "https://www.investor.gov/", kind: "official", cost: "free", license: "gov", level: "start", subjects: ["investing-basics"], note: "How investing works and how to check a professional or spot fraud.", checked: C },
  { id: "openstax-accounting", title: "Principles of Accounting, Volume 1", by: "OpenStax", url: "https://openstax.org/details/books/principles-financial-accounting", kind: "book", cost: "free", license: "open", level: "any", subjects: ["accounting"], checked: C },

  // ── Health ──────────────────────────────────────────────────────────────
  { id: "medlineplus", title: "MedlinePlus", by: "U.S. National Library of Medicine", url: "https://medlineplus.gov/", kind: "official", cost: "free", license: "gov", level: "start", disciplines: ["health"], note: "Trusted health information in plain language. Not a substitute for a doctor.", checked: C },
  { id: "openstax-anatomy", title: "Anatomy and Physiology 2e", by: "OpenStax", url: "https://openstax.org/details/books/anatomy-and-physiology-2e", kind: "book", cost: "free", license: "open", level: "any", subjects: ["anatomy", "nursing"], paths: ["college"], checked: C },
  { id: "openstax-nursing", title: "Fundamentals of Nursing", by: "OpenStax", url: "https://openstax.org/details/books/fundamentals-nursing", kind: "book", cost: "free", license: "open", level: "deeper", subjects: ["nursing"], paths: ["college", "career-change"], note: "Nursing requires an accredited program and a state license.", checked: C },
  { id: "myplate", title: "MyPlate", by: "U.S. Department of Agriculture", url: "https://www.myplate.gov/", kind: "official", cost: "free", license: "gov", level: "start", subjects: ["nutrition", "cooking"], checked: C },
  { id: "activity-guidelines", title: "Physical Activity Guidelines for Americans", by: "U.S. Department of Health and Human Services", url: "https://odphp.health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines", kind: "official", cost: "free", license: "gov", level: "start", subjects: ["fitness"], checked: C },

  // ── People, history, law, ideas ─────────────────────────────────────────
  { id: "openstax-psychology", title: "Psychology 2e", by: "OpenStax", url: "https://openstax.org/details/books/psychology-2e", kind: "book", cost: "free", license: "open", level: "any", subjects: ["psychology"], paths: ["college"], checked: C },
  { id: "openstax-sociology", title: "Introduction to Sociology 3e", by: "OpenStax", url: "https://openstax.org/details/books/introduction-sociology-3e", kind: "book", cost: "free", license: "open", level: "any", subjects: ["sociology"], checked: C },
  { id: "openstax-lifespan", title: "Lifespan Development", by: "OpenStax", url: "https://openstax.org/details/books/lifespan-development", kind: "book", cost: "free", license: "open", level: "any", subjects: ["human-development", "early-childhood", "childcare-parenting"], checked: C },
  { id: "openstax-us-history", title: "U.S. History", by: "OpenStax", url: "https://openstax.org/details/books/us-history", kind: "book", cost: "free", license: "open", level: "any", subjects: ["us-history"], paths: ["college"], checked: C },
  { id: "openstax-world-history", title: "World History, Volume 1", by: "OpenStax", url: "https://openstax.org/details/books/world-history-volume-1", kind: "book", cost: "free", license: "open", level: "any", subjects: ["world-history"], checked: C },
  { id: "archives-education", title: "Educator resources", by: "U.S. National Archives", url: "https://www.archives.gov/education", kind: "official", cost: "free", license: "gov", level: "any", subjects: ["us-history", "civics"], paths: ["teach"], note: "Primary sources: the documents themselves.", checked: C },
  { id: "loc", title: "Library of Congress digital collections", by: "Library of Congress", url: "https://www.loc.gov/collections/", kind: "reference", cost: "free", license: "free", level: "any", subjects: ["us-history", "world-history", "family-history"], note: "Rights vary by item; each item says how it can be used.", checked: C },
  { id: "wai-discover", title: "Look up one person in your family's past", by: "WhatAmIAI", url: "https://whatamiai.com/discover", kind: "practice", cost: "free", license: "free", level: "start", subjects: ["family-history"], ours: true, checked: C },
  { id: "openstax-american-government", title: "American Government 4e", by: "OpenStax", url: "https://openstax.org/details/books/american-government-4e", kind: "book", cost: "free", license: "open", level: "any", subjects: ["civics", "public-policy"], paths: ["college"], checked: C },
  { id: "icivics", title: "iCivics", by: "iCivics (nonprofit)", url: "https://www.icivics.org/", kind: "practice", cost: "free", license: "free", level: "start", subjects: ["civics"], paths: ["teach"], note: "Free civics games and lessons.", checked: C },
  { id: "congress-gov", title: "Congress.gov", by: "Library of Congress", url: "https://www.congress.gov/", kind: "official", cost: "free", license: "gov", level: "any", subjects: ["civics", "public-policy", "law-basics"], note: "Federal bills and laws, from the source.", checked: C },
  { id: "cornell-lii", title: "Legal Information Institute", by: "Cornell Law School", url: "https://www.law.cornell.edu/", kind: "reference", cost: "free", license: "free", level: "any", subjects: ["law-basics"], note: "U.S. laws and plain-language legal explainers. Information, not legal advice.", checked: C },
  { id: "openstax-philosophy", title: "Introduction to Philosophy", by: "OpenStax", url: "https://openstax.org/details/books/introduction-philosophy", kind: "book", cost: "free", license: "open", level: "start", subjects: ["philosophy", "ethics", "logic"], checked: C },
  { id: "sep", title: "Stanford Encyclopedia of Philosophy", by: "Stanford University", url: "https://plato.stanford.edu/", kind: "reference", cost: "free", license: "free", level: "deeper", subjects: ["philosophy", "ethics", "world-religions", "logic"], checked: C },
  { id: "iep", title: "Internet Encyclopedia of Philosophy", by: "IEP (peer-reviewed)", url: "https://iep.utm.edu/", kind: "reference", cost: "free", license: "free", level: "any", subjects: ["philosophy", "ethics"], checked: C },
  { id: "chp-reading-plan", title: "Bible reading plan", by: "CrossHeartPray", url: "https://crossheartpray.com/bible-reading-plan", kind: "practice", cost: "free", license: "free", level: "start", subjects: ["bible-theology"], ours: true, checked: C },
  { id: "chp-daily-hope", title: "Daily Hope: one passage a day", by: "CrossHeartPray", url: "https://crossheartpray.com/daily-hope", kind: "read", cost: "free", license: "free", level: "start", subjects: ["bible-theology"], ours: true, checked: C },

  // ── Languages and writing ───────────────────────────────────────────────
  { id: "language-transfer", title: "Language Transfer", by: "Language Transfer (nonprofit)", url: "https://www.languagetransfer.org/", kind: "course", cost: "free", license: "free", level: "start", subjects: ["learning-languages"], note: "Free audio courses in Spanish, French, German, Greek and more.", checked: C },
  { id: "purdue-owl", title: "Purdue OWL", by: "Purdue University", url: "https://owl.purdue.edu/owl/purdue_owl.html", kind: "reference", cost: "free", license: "free", level: "any", subjects: ["writing", "english-grammar"], paths: ["college"], note: "Grammar, essays, citations and professional writing.", checked: C },
  { id: "openstax-writing", title: "Writing Guide with Handbook", by: "OpenStax", url: "https://openstax.org/details/books/writing-guide", kind: "book", cost: "free", license: "open", level: "any", subjects: ["writing", "english-grammar"], paths: ["college"], checked: C },
  { id: "khan-ela", title: "Khan Academy reading and language arts", by: "Khan Academy", url: "https://www.khanacademy.org/ela", kind: "practice", cost: "free-account", license: "free", level: "start", subjects: ["english-grammar", "literature"], checked: C },

  // ── Music, art and media ────────────────────────────────────────────────
  { id: "musictheory-net", title: "musictheory.net lessons", by: "musictheory.net", url: "https://www.musictheory.net/lessons", kind: "practice", cost: "free", license: "free", level: "start", subjects: ["music-theory", "piano", "guitar"], note: "Short lessons and exercises: notes, rhythm, scales, chords.", checked: C },
  { id: "open-music-theory", title: "Open Music Theory", by: "Open Music Theory authors", url: "https://viva.pressbooks.pub/openmusictheory/", kind: "book", cost: "free", license: "open", level: "deeper", subjects: ["music-theory", "songwriting"], checked: C },
  { id: "idc-piano", title: "Piano Corner", by: "iDontCry", url: "https://idontcry.com/piano", kind: "practice", cost: "free", license: "free", level: "start", subjects: ["piano"], ours: true, note: "Play a piano in the browser.", checked: C },
  { id: "drawabox", title: "Drawabox", by: "Drawabox", url: "https://drawabox.com/", kind: "course", cost: "free", license: "free", level: "start", subjects: ["drawing"], note: "A free, structured course in drawing fundamentals.", checked: C },
  { id: "si-open-access", title: "Smithsonian Open Access", by: "Smithsonian Institution", url: "https://www.si.edu/openaccess", kind: "reference", cost: "free", license: "open", licenseName: "CC0", level: "any", subjects: ["painting", "drawing", "photography", "graphic-design"], note: "Museum images and data free to use for any purpose.", checked: C },
  { id: "cambridge-in-colour", title: "Photography tutorials", by: "Cambridge in Colour", url: "https://www.cambridgeincolour.com/tutorials.htm", kind: "read", cost: "free", license: "free", level: "any", subjects: ["photography"], checked: C },

  // ── Cooking, home, life ─────────────────────────────────────────────────
  { id: "wikibooks-cookbook", title: "Cookbook", by: "Wikibooks", url: "https://en.wikibooks.org/wiki/Cookbook:Table_of_Contents", kind: "book", cost: "free", license: "open", licenseName: "CC BY-SA 4.0", level: "start", subjects: ["cooking", "baking"], checked: C },
  { id: "foodsafety-gov", title: "FoodSafety.gov", by: "U.S. Department of Health and Human Services", url: "https://www.foodsafety.gov/", kind: "official", cost: "free", license: "gov", level: "start", subjects: ["food-safety", "cooking"], checked: C },
  { id: "gcf-everyday", title: "Everyday life lessons", by: "GCFGlobal", url: "https://edu.gcfglobal.org/en/subjects/everyday-life/", kind: "course", cost: "free", license: "free", level: "start", subjects: ["home-care", "budgeting", "habits-goals"], checked: C },
  { id: "gcf-work", title: "Work and career lessons", by: "GCFGlobal", url: "https://edu.gcfglobal.org/en/subjects/work-and-career/", kind: "course", cost: "free", license: "free", level: "start", subjects: ["career-planning"], paths: ["job", "career-change"], checked: C },
  { id: "openstax-college-success", title: "College Success", by: "OpenStax", url: "https://openstax.org/details/books/college-success", kind: "book", cost: "free", license: "open", level: "start", subjects: ["study-skills", "habits-goals"], paths: ["college"], checked: C },
  { id: "nps", title: "National Park Service", by: "National Park Service", url: "https://www.nps.gov/", kind: "official", cost: "free", license: "gov", level: "start", subjects: ["outdoor-recreation", "conservation", "ecology"], paths: ["curious", "community"], note: "Parks, trails, safety and ranger programs. Some parks charge entrance fees.", checked: C },

  // ── Careers and the way in ──────────────────────────────────────────────
  { id: "my-next-move", title: "O*NET Interest Profiler", by: "U.S. Department of Labor (My Next Move)", url: "https://www.mynextmove.org/explore/ip", kind: "practice", cost: "free", license: "gov", level: "start", subjects: ["career-planning"], paths: ["job", "career-change", "curious"], note: "Quick questions about what you like to do, matched to real occupations.", checked: C },
  { id: "onet", title: "O*NET OnLine", by: "U.S. Department of Labor", url: "https://www.onetonline.org/", kind: "official", cost: "free", license: "open", licenseName: "CC BY 4.0", level: "any", subjects: ["career-planning"], paths: ["job", "career-change"], note: "What each occupation does: tasks, skills, tools and related jobs.", checked: C },
  { id: "bls-ooh", title: "Occupational Outlook Handbook", by: "U.S. Bureau of Labor Statistics", url: "https://www.bls.gov/ooh/", kind: "official", cost: "free", license: "gov", level: "any", subjects: ["career-planning"], paths: ["job", "career-change", "college"], note: "Pay, job outlook and how to get into hundreds of occupations, with the date of each estimate.", checked: C },
  { id: "careeronestop", title: "CareerOneStop", by: "U.S. Department of Labor", url: "https://www.careeronestop.org/", kind: "official", cost: "free", license: "gov", level: "start", subjects: ["career-planning"], paths: ["job", "career-change", "apprenticeship"], note: "Job search, training finders and local American Job Centers.", checked: C },
  { id: "studentaid", title: "Federal Student Aid", by: "U.S. Department of Education", url: "https://studentaid.gov/", kind: "official", cost: "free", license: "gov", level: "start", subjects: ["study-skills"], paths: ["college"], note: "The FAFSA, grants and loans for college or career school.", checked: C },
];

export const PATHWAYS: { id: PathwayId; label: string; line: string }[] = [
  { id: "curious", label: "Just curious", line: "Overviews, books and videos. Nothing to finish." },
  { id: "skill", label: "A practical skill", line: "Hands-on guides and practice you can use this week." },
  { id: "create", label: "To make something", line: "Learn by making: a site, a song, a project." },
  { id: "college", label: "Heading to college", line: "College textbooks, practice, and aid from the official source." },
  { id: "job", label: "For a job", line: "What the work is, what it pays (from official sources) and how to start." },
  { id: "career-change", label: "To change careers", line: "Find work that fits, then the training it takes." },
  { id: "apprenticeship", label: "An apprenticeship", line: "Earn while you learn: Registered Apprenticeships near you." },
  { id: "start-business", label: "To start a business", line: "Official steps, free mentors and tools that end in a plan." },
  { id: "improve-business", label: "To improve a business", line: "Customers, marketing and running things better." },
  { id: "independent", label: "On my own", line: "Self-paced sources you can follow alone." },
  { id: "community", label: "With other people", line: "Libraries, mentors, extension classes and clubs." },
  { id: "teach", label: "To teach others", line: "Open materials you can reuse in a class or at home." },
];

export const COST_LABEL: Record<Cost, string> = {
  free: "Free",
  "free-account": "Free (account saves progress)",
  "free-paid-cert": "Free to learn; certificate costs extra",
  "free-paid-exam": "Free to learn; the exam or license costs money",
};

export const LICENSE_LABEL: Record<License, string> = {
  open: "Open license",
  gov: "U.S. government",
  free: "Free to access",
};

export const KIND_LABEL: Record<ResourceKind, string> = {
  read: "Read",
  book: "Book",
  course: "Course",
  watch: "Watch",
  practice: "Practice",
  tool: "Tool",
  reference: "Reference",
  official: "Official",
};
