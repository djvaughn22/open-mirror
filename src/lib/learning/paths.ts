// ─────────────────────────────────────────────────────────────────────────────
// Open Mirror Learning: learning paths (owner direction, Nov 27-28 2026).
//
// The internet already has the lessons. A path is the order: what the subject
// is, what you need, what it costs, what to learn first, what to practice, how
// to know you're ready for the next step, what you can make, who to learn
// with, and where it can lead. Every link is a checked resource in
// resources.ts (the build fails on an unknown id). The words here are ours;
// nothing is copied from the sources.
//
// Rules (tests/paths.test.ts):
// - Beginners first, and anyone can mark a step done and skip ahead.
// - Say what it costs plainly. Never promise that a dollar amount buys a
//   suitable computer, tool or result; teach people to check what they have.
// - Safety notes where the work can hurt someone (wiring, engines, canning, cars).
// - No affiliate links, no prices, no "best", no credentials we don't give.
// ─────────────────────────────────────────────────────────────────────────────

export type StepLevel = "beginner" | "intermediate" | "advanced";

export type PathStep = {
  /** Stable within the path: progress is saved under it. */
  id: string;
  title: string;
  level: StepLevel;
  /** What to learn, in one to three plain sentences. */
  learn: string;
  /** Something to do with your hands or on the screen. */
  practice: string;
  /** How you'll know you're ready for the next step. */
  done: string;
  /** Resource ids (resources.ts). */
  res: string[];
  /** Pages on this site that help with the step. */
  see?: { href: string; label: string }[];
};

export type PathNote = { text: string; res?: string };

export type LearningPath = {
  slug: string;
  title: string;
  icon: string;
  /** Area slug (areas.ts). */
  area: string;
  /** Subject slugs (taxonomy.ts); the first is the path's home subject. */
  subjects: string[];
  /** One line for lists. */
  line: string;
  /** What people type when they're looking for this. */
  terms: string[];
  /** What it is, in two or three sentences. */
  about: string;
  /** What you need to begin. */
  need: string[];
  /** What it costs, plainly. */
  cost: string;
  /** Starting with very little: no money, an old computer, no experience. */
  little: string[];
  steps: PathStep[];
  /** Things you can make or do. */
  make: string[];
  /** Learning with other people. */
  people: PathNote[];
  /** Occupation ids (careers.ts). */
  work: string[];
  /** A small business the skill can support, said honestly. */
  business?: string;
  /** Related path slugs. */
  related: string[];
  safety?: PathNote;
  /** Different starting points (used where it matters most). */
  routes?: { label: string; text: string; res: string[] }[];
};

export const LEVEL_LABEL: Record<StepLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const PATHS: LearningPath[] = [
  // ── Computers and technology ───────────────────────────────────────────
  {
    slug: "restore-old-computer",
    title: "Fix up an old computer",
    icon: "💻",
    area: "tech",
    subjects: ["computer-repair", "linux", "computer-basics"],
    line: "Check what you have, save your files, test the parts, and give it a system it can run.",
    terms: ["old computer", "old laptop", "used computer", "used laptop", "slow computer", "slow laptop", "refurbish", "restore a computer", "restore an old computer", "fix my computer", "fix my laptop", "fix a laptop", "fix up a computer", "computer restoration", "old pc", "windows 10", "hand me down", "old dell", "old hp", "old lenovo", "old thinkpad", "old macbook", "old chromebook", "old desktop", "cant afford a new"],
    about: "A computer that feels too slow is often not broken. The usual causes are a worn hard drive, too little memory, or a system that has outgrown the hardware. Each one can be checked, and often fixed for little or nothing.",
    need: [
      "The computer, its charger, and its model number (on a sticker underneath or in the battery bay)",
      "A USB stick of 8 GB or more",
      "Internet access for downloads and guides (a library computer works)",
      "A small Phillips screwdriver",
    ],
    cost: "The guides and software here are free. Buy parts only if a check shows a real problem.",
    little: [
      "Don't buy anything until steps 1 and 3 tell you what's actually wrong.",
      "Judging a used computer? Go by its parts, not its price: a 64-bit processor, at least 4 GB of memory (8 GB is comfortable), a solid-state drive or room for one, and a battery and charger that work.",
      "Public libraries have internet you can use for the downloads, and many have computers you can use to make the USB stick.",
      "Linux Mint and LibreOffice cost nothing and run on many older machines.",
    ],
    steps: [
      { id: "s1", title: "Find out what you have", level: "beginner", learn: "Write down the model, processor, memory (RAM), drive type and size, and battery condition. The model number leads to the maker's spec sheet and to repair guides.", practice: "Fill in a one-page record: model, processor, memory, drive (hard drive or SSD), ports, and anything that doesn't work.", done: "You can say which parts are weak, and whether the memory and drive can be replaced.", res: ["sitr-build-machine", "gcf-computers", "ifixit-laptop"] },
      { id: "s2", title: "Save what matters first", level: "beginner", learn: "Before changing anything, copy the files you care about to a USB drive or another computer: photos, documents, and anything you'd hate to lose.", practice: "Copy your files, then open a few of them from the copy.", done: "Your files open from somewhere other than this computer.", res: ["sitr-build-machine"] },
      { id: "s3", title: "Check the health of the parts", level: "intermediate", learn: "Clean the dust from the vents and fan. Then test the memory and read the drive's health report. A failing drive is a common cause of slowness and crashes.", practice: "Run Memtest86+ for one full pass. Read the drive's health (SMART) report; the Disks app on Linux Mint shows it. Write down any errors.", done: "You know whether the memory and the drive are healthy.", res: ["memtest", "smartmontools", "ifixit-laptop", "ifixit-desktop"] },
      { id: "s4", title: "Upgrade only what helps", level: "intermediate", learn: "The two upgrades that usually matter most are a solid-state drive (SSD) in place of a hard drive, and more memory. Check what your model takes: the drive's size and connector (2.5-inch SATA or M.2), and the memory type (DDR3, DDR4 or DDR5) and maximum.", practice: "Find your model's guide on iFixit and the maker's spec sheet. Write down the exact drive and memory it takes before buying anything.", done: "You know exactly which part fits, or that your computer doesn't need one.", res: ["ifixit-laptop", "ifixit-desktop"] },
      { id: "s5", title: "Choose a system it can run", level: "beginner", learn: "If the computer can't run a supported version of Windows, Linux Mint is a free, well-supported choice for older machines. You can try it from a USB stick without changing anything.", practice: "Make a Linux Mint USB stick and start the computer from it. Check that Wi-Fi, sound, the touchpad and the screen work.", done: "You've used the computer from the USB stick and decided what to install.", res: ["win10-end", "linux-mint-guide", "etcher", "ubuntu-try"] },
      { id: "s6", title: "Install and set it up", level: "intermediate", learn: "Install the system, run its updates, and add what you need: a web browser, LibreOffice for documents, and a backup.", practice: "Install, update, and set up a backup that copies your documents to a USB drive.", done: "The computer starts, updates and does the jobs you need.", res: ["linux-mint-guide", "learnfree-linux-mint", "libreoffice"] },
      { id: "s7", title: "Keep it going, or pass it on", level: "beginner", learn: "Keep updates on and the backup current. A computer that can't be saved still has useful parts, or can be donated or recycled safely.", practice: "Write a short note for whoever uses it next: what it has, what you fixed, and how to keep it updated.", done: "The computer is in use, by you or someone else.", res: ["epa-electronics", "repair-cafe"] },
    ],
    make: ["A working computer for school, a job search or a family member", "A drawer of tested spare parts: drives, memory, chargers", "A home file server from a machine too old for daily use", "Refurbished computers to give away or sell"],
    people: [
      { text: "Repair Cafés are free local events where volunteers fix things with you.", res: "repair-cafe" },
      { text: "Many public libraries offer computer help and classes. Ask at yours." },
      { text: "Linux user groups meet in many cities and online." },
    ],
    work: ["computer-support", "electronics-repair"],
    business: "Some people refurbish and resell computers, or fix them for neighbors. Wipe every drive before a computer leaves your hands.",
    related: ["computer-hardware", "linux", "build-a-website"],
    safety: { text: "Unplug the computer and take out the battery before opening it. A swollen or damaged laptop battery can catch fire: don't puncture it, and take it to a battery recycling drop-off." },
  },
  {
    slug: "computer-hardware",
    title: "Learn computer hardware",
    icon: "🖥️",
    area: "tech",
    subjects: ["computer-repair", "computer-basics", "electronics"],
    line: "What each part does, how they fit together, and how to build, upgrade and troubleshoot.",
    terms: ["computer hardware", "hardware", "build a pc", "build a computer", "gaming pc", "pc parts", "motherboard", "how computers work", "how do computers work", "upgrade my pc", "graphics card", "a+ certification", "comptia", "it support", "help desk"],
    about: "Every computer has the same handful of parts: a processor, memory, storage, a motherboard that connects them, and power. Knowing what each one does lets you choose, upgrade and fix computers, and it's the base of many IT jobs.",
    need: ["A notebook for what you learn", "An old computer you can take apart (optional at first)", "A Phillips screwdriver"],
    cost: "The courses and videos here are free. The CompTIA A+ exams, if you want the certificate, cost money.",
    little: ["Take apart a computer that no longer works before you touch one that does.", "The first steps need only a web browser."],
    steps: [
      { id: "s1", title: "Learn what's inside", level: "beginner", learn: "The job of each part: processor (CPU), memory (RAM), storage (SSD or hard drive), motherboard, power supply and graphics.", practice: "Name every part in a photo of an open computer, then in a real one.", done: "You can explain what each part does in one sentence.", res: ["gcf-computers", "khan-computers-internet", "crashcourse-cs"] },
      { id: "s2", title: "Open a real computer", level: "beginner", learn: "With the power off and the cord unplugged, open a desktop or laptop and find each part. Touch the metal case first to discharge static.", practice: "Take out and put back the memory and the drive, then start the computer.", done: "You've removed parts and put them back, and the computer still starts.", res: ["ifixit-desktop", "ifixit-laptop"] },
      { id: "s3", title: "Read a spec sheet", level: "intermediate", learn: "What the numbers mean: processor generation and cores, memory type and speed, drive connectors, power supply wattage. This is how you tell whether parts work together.", practice: "Pick a computer model and list which memory and drives it accepts, from its spec sheet.", done: "You can check two parts for compatibility without guessing.", res: ["ifixit-desktop", "messer-aplus"] },
      { id: "s4", title: "Troubleshoot one change at a time", level: "intermediate", learn: "Notice the symptom, change one thing, test again. Common causes of a computer that won't start are power, memory, storage and loose cables.", practice: "Test a computer's memory and read its drive's health report.", done: "You find faults by testing, not guessing.", res: ["memtest", "smartmontools", "messer-aplus"] },
      { id: "s5", title: "Build or upgrade a computer", level: "intermediate", learn: "Put the parts in, start it up, install a system and check that everything works.", practice: "Build or upgrade a computer and write down each part and why you chose it.", done: "It starts, passes a memory test and runs a system you installed.", res: ["ifixit-desktop", "linux-mint-guide"] },
      { id: "s6", title: "Go deeper: from logic gates up", level: "advanced", learn: "To really understand a processor, build one from logic gates in free software.", practice: "Finish the first projects of Nand to Tetris.", done: "You can explain how a computer adds two numbers.", res: ["nand2tetris", "crashcourse-cs"] },
      { id: "s7", title: "Get certified, if you want IT work", level: "advanced", learn: "Many computer support jobs ask for CompTIA A+. Free videos cover the exams; the exams cost money.", practice: "Work through the free Core 1 videos and try practice questions.", done: "You can decide whether the exam is worth it for you.", res: ["messer-aplus", "comptia-aplus"] },
    ],
    make: ["A computer built from parts", "An upgraded computer for someone in your family", "A home server", "A repair log you can show an employer"],
    people: [
      { text: "Repair Cafés welcome people who want to learn by fixing.", res: "repair-cafe" },
      { text: "Community colleges teach IT courses, often at night.", res: "college-navigator" },
    ],
    work: ["computer-support", "electronics-repair", "electrical-engineer"],
    related: ["restore-old-computer", "linux", "programming"],
    safety: { text: "Unplug before opening any computer. Don't open a power supply: it holds a dangerous charge even when unplugged." },
  },
  {
    slug: "linux",
    title: "Use Linux and free software",
    icon: "🐧",
    area: "tech",
    subjects: ["linux", "computer-basics"],
    line: "Try it without installing, learn the desktop, then the command line and a small server.",
    terms: ["linux", "ubuntu", "linux mint", "free software", "open source", "command line", "terminal", "bash", "shell", "server", "self host", "home server", "raspberry pi"],
    about: "Linux is a free operating system. It runs on everything from old laptops to the servers behind many websites. Free software means you can run it, study it, change it and share it.",
    need: ["A computer (it doesn't need to be new)", "A USB stick of 8 GB or more"],
    cost: "Linux, the programs and the guides here are free.",
    little: ["You can try Linux from a USB stick without changing the computer.", "Everything in this path works on an older computer."],
    steps: [
      { id: "s1", title: "Know what free software means", level: "beginner", learn: "Free software gives you four freedoms: to run it, study it, change it and share it. Linux is a well-known example.", practice: "Read the GNU explanation and list free programs you already use.", done: "You can explain the difference between free software and a free download.", res: ["gnu-free-sw"] },
      { id: "s2", title: "Try it from a USB stick", level: "beginner", learn: "Start a computer from a USB stick and use Linux without installing it.", practice: "Make a Linux Mint or Ubuntu USB stick and use it for an hour.", done: "You've browsed the web and opened files on Linux.", res: ["ubuntu-try", "linux-mint-guide", "etcher"] },
      { id: "s3", title: "Learn the desktop", level: "beginner", learn: "Install programs, run updates, manage files and set up a printer.", practice: "Install Linux on a spare computer and use it for a week.", done: "You do everyday things without looking up each step.", res: ["learnfree-linux-mint", "linux-mint-guide", "ubuntu-install"] },
      { id: "s4", title: "Learn the command line", level: "intermediate", learn: "Move between folders, copy and find files, and read the built-in manuals from the terminal.", practice: "Finish the first ten levels of Bandit.", done: "You can find and change a file using only the keyboard.", res: ["linux-journey", "bandit", "tlcl"] },
      { id: "s5", title: "Manage software and users", level: "intermediate", learn: "The package manager (apt on Mint and Ubuntu), users and permissions, and reading logs when something breaks.", practice: "Install a program from the terminal, then cause and fix a permissions problem.", done: "You can install, update and remove software, and read an error message.", res: ["linux-journey", "tlcl"] },
      { id: "s6", title: "Write a small script", level: "intermediate", learn: "Put commands in a file to repeat a job, like backing up a folder.", practice: "Write a script that copies your documents into a folder named with today's date.", done: "Your script runs and does the job.", res: ["tlcl"] },
      { id: "s7", title: "Run a small server", level: "advanced", learn: "Use an old computer as a home server: file sharing, backups, or a web page on your own network.", practice: "Set up remote login (SSH) to the old computer from another one.", done: "You can log in and run commands on it from another computer.", res: ["lf-intro-linux", "tlcl"] },
    ],
    make: ["An everyday computer with free software", "Backup scripts", "A home file or media server"],
    people: [
      { text: "Linux user groups meet in many cities and online." },
      { text: "Repair Cafés often help with computers.", res: "repair-cafe" },
    ],
    work: ["computer-support", "software-developer"],
    related: ["restore-old-computer", "programming", "computer-hardware"],
  },
  {
    slug: "build-a-website",
    title: "Make a website",
    icon: "🌐",
    area: "tech",
    subjects: ["web-development", "programming"],
    line: "Start from an example today, then learn HTML and CSS and publish your own.",
    terms: ["website", "web site", "web page", "make a website", "build a website", "create a website", "html", "css", "web design", "site for my business", "landing page", "portfolio site", "web developer"],
    about: "A website is a set of text files a browser reads: HTML for the content, CSS for how it looks, and sometimes JavaScript for what it does. You can have a simple site online quickly and learn to build anything after that.",
    need: ["A computer that runs a current web browser", "A text editor (every computer has one)"],
    cost: "Learning is free. Publishing a simple site can be free; your own domain name costs money every year.",
    little: ["Everything here works on an older computer and a slow connection.", "Free hosting is enough for a personal site or a small business."],
    steps: [
      { id: "s1", title: "Get a first site working today", level: "beginner", learn: "Start from an example for your kind of work, change the words and pictures, and download the files.", practice: "Make a one-page site about yourself or a business you know.", done: "You have files that open in a browser and look like a website.", res: ["sitr-start"] },
      { id: "s2", title: "Learn HTML", level: "beginner", learn: "HTML marks up content: headings, paragraphs, links, images and lists.", practice: "Write a page from scratch with a heading, a paragraph, a list, a link and an image.", done: "You can write a page without copying an example.", res: ["mdn-learn", "webdev-html"] },
      { id: "s3", title: "Learn CSS", level: "beginner", learn: "CSS controls color, type, spacing and layout, including layouts that work on phones.", practice: "Style your page so it reads well on a phone and on a laptop.", done: "Your page looks right at phone width and at desktop width.", res: ["webdev-css", "mdn-learn"] },
      { id: "s4", title: "Make it work for everyone", level: "intermediate", learn: "Use real headings, describe images, keep the contrast high, and make sure everything works from the keyboard.", practice: "Use your site with only the keyboard, and fix what doesn't work.", done: "Every link and button works without a mouse.", res: ["w3c-accessibility"] },
      { id: "s5", title: "Publish it", level: "intermediate", learn: "Put the site on the internet. GitHub Pages hosts simple sites for free with a free account.", practice: "Publish your site and open it on your phone.", done: "Anyone with the address can see it.", res: ["github-pages", "pro-git"] },
      { id: "s6", title: "Add JavaScript", level: "intermediate", learn: "JavaScript makes a page respond: menus, forms, calculators.", practice: "Add one useful feature, like a menu or a small calculator.", done: "The feature works on a phone.", res: ["javascript-info", "mdn-learn"] },
      { id: "s7", title: "Follow a full course", level: "advanced", learn: "When you want the whole craft, follow a complete free curriculum.", practice: "Pick one course and finish its first project.", done: "You've finished a whole project from a course.", res: ["odin-project", "freecodecamp"] },
    ],
    make: ["A personal site or portfolio", "A site for a church, team or small business", "A small tool, like a calculator or a schedule"],
    people: [
      { text: "freeCodeCamp and The Odin Project have large, active learner forums.", res: "odin-project" },
      { text: "Community colleges and libraries run coding classes.", res: "college-navigator" },
    ],
    work: ["web-developer", "software-developer", "graphic-designer"],
    business: "Building simple sites for local businesses is a common first freelance job.",
    related: ["programming", "start-small-business", "ai-basics"],
  },
  {
    slug: "programming",
    title: "Learn to program",
    icon: "⌨️",
    area: "tech",
    subjects: ["programming", "version-control"],
    line: "Python first: small programs, regular practice, a real course, then a project you need.",
    terms: ["program", "programming", "coding", "code", "learn to code", "python", "software", "software developer", "computer science", "make an app", "make a game"],
    about: "Programming is writing instructions a computer can follow. Python is a good first language: it reads almost like English and is used for automation, data, websites and AI.",
    need: ["A computer with a web browser", "An hour, a few times a week"],
    cost: "The courses here are free. A few sell certificates; you don't need one to learn.",
    little: ["Several of these let you write and run code in the browser while you learn.", "Python runs fine on older computers."],
    steps: [
      { id: "s1", title: "Write your first programs", level: "beginner", learn: "Variables, numbers, text, decisions (if) and loops.", practice: "Write a program that asks your name and says hello, then one that adds up a list of numbers.", done: "You can write a short program without copying.", res: ["openstax-python", "python-tutorial"] },
      { id: "s2", title: "Practice every few days", level: "beginner", learn: "Small exercises build the habit faster than long videos.", practice: "Finish ten exercises on Exercism.", done: "You can solve a small problem in under an hour.", res: ["exercism-python"] },
      { id: "s3", title: "Take a real course", level: "intermediate", learn: "A structured course fills the gaps: functions, data structures, debugging.", practice: "Finish the first half of CS50x or MIT's Python course, including the problem sets.", done: "You've finished problem sets, not just watched lectures.", res: ["cs50x", "mit-python"] },
      { id: "s4", title: "Save your work with Git", level: "intermediate", learn: "Git keeps every version of your code and lets you share it.", practice: "Put one of your programs in a Git repository and make a few commits.", done: "You can undo a change and read your history.", res: ["pro-git"] },
      { id: "s5", title: "Build something you need", level: "intermediate", learn: "Pick a small, real problem: a budget tracker, a grade calculator, a photo renamer.", practice: "Build it, use it for a week, and fix what bothers you.", done: "Someone, maybe you, uses your program.", res: ["python-tutorial", "exercism-python"] },
      { id: "s6", title: "Choose a direction", level: "advanced", learn: "Websites, data, AI, or how computers work underneath: each has its own next path.", practice: "Pick a next path and start its first step.", done: "You know what you'll learn next.", res: ["freecodecamp", "nand2tetris"] },
    ],
    make: ["Tools that save you time", "Small games", "A website with features", "A portfolio for job applications"],
    people: [
      { text: "Exercism's volunteer mentors give feedback on your code.", res: "exercism-python" },
      { text: "CS50 has large online communities of learners.", res: "cs50x" },
    ],
    work: ["software-developer", "web-developer", "data-scientist", "computer-support"],
    related: ["build-a-website", "ai-basics", "linux"],
  },
  {
    slug: "ai-basics",
    title: "Understand and use AI",
    icon: "🤖",
    area: "tech",
    subjects: ["artificial-intelligence", "programming"],
    line: "What AI is, how it learns, how to use it carefully, and how to build with it.",
    terms: ["ai", "artificial intelligence", "machine learning", "chatgpt", "neural network", "llm", "use ai", "ai tools", "deep learning", "learn ai"],
    about: "AI programs learn patterns from data and use them to predict, sort and write. They're useful, and they can be wrong with confidence. Knowing how they work helps you use them well and keep private information safe.",
    need: ["A phone or computer", "No math to start"],
    cost: "The courses here are free. Some AI apps charge for more use; you don't need a paid one to learn.",
    little: ["The first three steps need only a web browser.", "Read what an AI app does with what you type before you use it."],
    steps: [
      { id: "s1", title: "Learn what AI is and isn't", level: "beginner", learn: "What AI can do, what it can't, and how it differs from ordinary programs.", practice: "Finish the first chapters of Elements of AI.", done: "You can explain machine learning to a friend in two minutes.", res: ["elements-of-ai"] },
      { id: "s2", title: "See how a network learns", level: "beginner", learn: "How a neural network turns examples into predictions.", practice: "Watch the series and describe training in your own words.", done: "You can explain what training a model means.", res: ["3b1b-neural"] },
      { id: "s3", title: "Use AI tools carefully", level: "beginner", learn: "Give clear instructions, check facts against real sources, and never paste private information you wouldn't post publicly.", practice: "Ask an AI app a question you already know the answer to, and note what it gets wrong.", done: "You check AI answers against real sources out of habit.", res: ["sitr-make"] },
      { id: "s4", title: "Learn how machine learning works", level: "intermediate", learn: "Data, models, training and testing, with real examples.", practice: "Work through the exercises in Google's crash course.", done: "You can explain overfitting and why test data matters.", res: ["google-ml"] },
      { id: "s5", title: "Build with AI", level: "advanced", learn: "Train and use models in code.", practice: "Finish the first lessons of fast.ai and train a model on your own photos.", done: "You've trained a model and measured how often it's right.", res: ["fastai", "python-tutorial"] },
      { id: "s6", title: "Go deeper", level: "advanced", learn: "The math and the theory under AI.", practice: "Pick one lecture series and take notes on each lecture.", done: "You can follow a research paper's main idea.", res: ["mit-ai", "3b1b-calculus"] },
    ],
    make: ["Writing and research with AI, checked by you", "A small model that sorts your own photos", "A clear plan for an app idea"],
    people: [{ text: "Ask your public library or community college about classes on using AI tools." }],
    work: ["data-scientist", "software-developer", "statistician"],
    related: ["programming", "math-to-calculus", "build-a-website"],
  },

  // ── Business and work ─────────────────────────────────────────────────
  {
    slug: "start-small-business",
    title: "Start a small business",
    icon: "🏪",
    area: "work-money",
    subjects: ["starting-a-business", "marketing", "accounting"],
    line: "Test the idea with real people, plan it on one page, then do the paperwork right.",
    terms: ["start a business", "start my own business", "own business", "small business", "small shop", "my shop", "my store", "running a business", "run a business", "business", "sell", "selling", "side hustle", "entrepreneur", "self employed", "llc", "business plan", "start a company", "my own boss", "make money", "sell my"],
    about: "A small business starts with a problem people will pay to have solved. Before money or paperwork, check that real customers want it. Free advisors can help at every step.",
    need: ["An idea, even a rough one", "A notebook", "Time to talk with possible customers"],
    cost: "The guides and advisors here are free. Registration, licenses and insurance cost money, and the amounts depend on your state and city.",
    little: ["Many businesses start as one service with no equipment: cleaning, tutoring, repair, lawn care, sewing.", "Test with real customers before you buy anything.", "SCORE mentors and Small Business Development Centers advise for free."],
    steps: [
      { id: "s1", title: "Name the problem and the customer", level: "beginner", learn: "Write down who the customer is, what problem you solve, and why they'd choose you.", practice: "Talk with ten people who might buy. Ask about the problem, not your idea.", done: "Several people describe the problem in their own words.", res: ["openstax-entrepreneurship", "sitr-engines"] },
      { id: "s2", title: "Sell one before you spend", level: "beginner", learn: "Nothing tests an idea like a real sale: small and honest.", practice: "Offer your product or service to one real customer at a real price.", done: "Someone has paid you, or you've learned why they won't.", res: ["sitr-engines"] },
      { id: "s3", title: "Write a one-page plan", level: "beginner", learn: "What you sell, to whom, for how much, what each sale costs you, and how people will find you.", practice: "Fill in a one-page plan and list your startup costs.", done: "You know the price at which each sale makes money.", res: ["sba-guide", "openstax-intro-business"] },
      { id: "s4", title: "Do the paperwork right", level: "intermediate", learn: "Business structure, name, registration, tax IDs, licenses and a separate bank account. The rules depend on your state and city.", practice: "List what your state and city require for your kind of business.", done: "You know every registration and license you need.", res: ["sba-launch", "irs-small-business"] },
      { id: "s5", title: "Track money from day one", level: "intermediate", learn: "Keep business money separate, and record every sale and every cost.", practice: "Keep a simple income and expense sheet for a month.", done: "You know your profit for the month.", res: ["openstax-accounting", "irs-small-business"] },
      { id: "s6", title: "Find customers", level: "intermediate", learn: "Word of mouth, a simple website, local listings, and asking happy customers to tell others.", practice: "Make a one-page website and ask three customers to refer someone.", done: "New customers find you without you asking each one.", res: ["sitr-start", "openstax-marketing"] },
      { id: "s7", title: "Get a free mentor", level: "beginner", learn: "Advisors who have run businesses will review your plan at no cost.", practice: "Book a meeting with SCORE or your local Small Business Development Center.", done: "Someone with experience has reviewed your plan.", res: ["score", "sbdc", "sba-learning"] },
    ],
    make: ["A one-page business plan", "Prices that cover your costs", "A simple website", "Your first sale"],
    people: [
      { text: "SCORE pairs you with a volunteer mentor.", res: "score" },
      { text: "Small Business Development Centers give free advice near you.", res: "sbdc" },
    ],
    work: ["bookkeeper", "accountant"],
    related: ["build-a-website", "find-work"],
    safety: { text: "This is general information, not legal or tax advice. For your situation, ask your state's business office, a tax professional, or a free SBA advisor.", res: "sba-learning" },
  },
  {
    slug: "find-work",
    title: "Find work that fits you",
    icon: "🧭",
    area: "work-money",
    subjects: ["career-planning"],
    line: "What you care about, careers that use it, the training it takes, and real help finding a job.",
    terms: ["career", "careers", "job", "jobs", "find work", "find a job", "career that helps people", "help people", "helping people", "what job", "career change", "change careers", "new career", "laid off", "back to work", "first job", "retired", "meaningful work", "steady work", "find steady work", "looking for work"],
    about: "Good work fits what you care about, what you're good at, and what people need. Official tools can show you careers you haven't heard of, what they pay, and how to get in.",
    need: ["An hour for the first steps", "Honest answers about what you enjoy"],
    cost: "Every tool here is free. Some training costs money, and there are programs that help pay for it.",
    little: ["American Job Centers give free, in-person help, and can sometimes help pay for training.", "Apprenticeships pay you while you learn."],
    steps: [
      { id: "s1", title: "Notice what you care about", level: "beginner", learn: "Interests point to work you'll stay with. The O*NET Interest Profiler sorts your answers into six interest areas.", practice: "Take the Interest Profiler and write down your top two areas.", done: "You have a short list of career areas to explore.", res: ["my-next-move"] },
      { id: "s2", title: "Explore work that meets real needs", level: "beginner", learn: "Health care, teaching, the trades, public safety and social services all serve needs that don't go away.", practice: "Read the official profiles of three careers: duties, pay and training.", done: "You can compare three careers side by side.", res: ["bls-ooh", "onet"], see: [{ href: "/learn/work", label: "Work that lasts" }] },
      { id: "s3", title: "Match the skills you have", level: "beginner", learn: "Skills from a job, from raising a family or from volunteering often carry over.", practice: "Rate your skills in Skills Matcher and save the careers it suggests.", done: "You have a list of careers that use skills you already have.", res: ["skills-matcher"] },
      { id: "s4", title: "Try it before you commit", level: "intermediate", learn: "Volunteer, shadow someone, or take one class before you pay for training.", practice: "Spend a day volunteering or shadowing in the field.", done: "You've seen the work up close.", res: ["americorps"] },
      { id: "s5", title: "Find the training", level: "intermediate", learn: "Apprenticeships pay while you learn. Community colleges and trade programs offer shorter routes than a four-year degree for many careers.", practice: "Find two programs near you and compare cost, length and graduation rates.", done: "You know where you'd train and what it costs.", res: ["apprenticeship-finder", "college-navigator", "studentaid"] },
      { id: "s6", title: "Get help with the search", level: "beginner", learn: "American Job Centers help with résumés, interviews and paying for training, in person.", practice: "Update your résumé and contact your nearest American Job Center.", done: "You have a résumé and a person helping you.", res: ["ajc-finder", "gcf-work"] },
    ],
    make: ["A short list of careers that fit you", "A résumé", "A training plan"],
    people: [{ text: "American Job Centers give free, in-person help.", res: "ajc-finder" }],
    work: ["registered-nurse", "emt", "social-worker", "elementary-teacher", "electrician", "physical-therapist"],
    related: ["start-small-business", "electricity", "programming"],
    routes: [
      { label: "Ages 14 to 24", text: "Plan school and a first job, or find free training.", res: ["get-my-future", "job-corps"] },
      { label: "Changing careers or laid off", text: "See where your skills fit, and the help available after a layoff.", res: ["skills-matcher", "reemployment"] },
      { label: "55 and older", text: "Paid part-time training work for people with limited incomes, and local help.", res: ["scsep", "ajc-finder"] },
      { label: "Back to work after time away", text: "Free local help with a résumé, interviews and training.", res: ["ajc-finder", "gcf-work"] },
      { label: "Working for yourself", text: "Follow the small business path.", res: ["sba-guide", "score"] },
    ],
  },

  // ── Trades and repair ─────────────────────────────────────────────────
  {
    slug: "car-repair",
    title: "Fix and maintain your car",
    icon: "🚗",
    area: "hands-on",
    subjects: ["automotive-repair"],
    line: "Work safely, know your car's schedule, do the basic checks, then oil, brakes and diagnosis.",
    terms: ["car", "cars", "truck", "fix cars", "fix my car", "fix a car", "car repair", "auto repair", "mechanic", "oil change", "brakes", "check engine light", "automotive", "car maintenance"],
    about: "Much of car care is regular maintenance you can learn: fluids, tires, filters, brakes. Doing it yourself saves money, and knowing how a car works helps you catch problems early and talk with a mechanic as an equal.",
    need: ["Your car's owner's manual (often on the maker's website)", "Basic hand tools: a socket set and screwdrivers", "Jack stands, if you'll work under the car"],
    cost: "The guides are free. Tools and parts cost money; start with the checks that need none.",
    little: ["Start with checks that need no tools: tire pressure, fluid levels, lights.", "Many public libraries give card holders free online access to repair manuals. Ask at yours.", "Many auto parts stores will read a check-engine code at no charge. Ask first."],
    steps: [
      { id: "s1", title: "Learn to work safely", level: "beginner", learn: "Never get under a car held up only by a jack: use jack stands on firm, level ground. Let the engine cool first, and keep fluids away from children and pets.", practice: "Find your car's jacking points in the owner's manual.", done: "You can lift and support the car safely, or you know to leave that job to a shop.", res: ["chrisfix", "carcare-guide"] },
      { id: "s2", title: "Know your car's schedule and recalls", level: "beginner", learn: "The owner's manual lists the maintenance schedule, fluid types and tire pressures. Open safety recalls are repaired free by dealers.", practice: "Check your VIN on NHTSA's recall page and write down what maintenance is due.", done: "You know what's due and whether there's an open recall.", res: ["nhtsa-recalls", "carcare-guide"] },
      { id: "s3", title: "Do the basic checks", level: "beginner", learn: "Tire pressure and tread, oil, coolant, brake fluid, washer fluid, lights and wipers.", practice: "Do every check once a month for three months, and write down what you find.", done: "You can do all the checks in a quarter of an hour.", res: ["nhtsa-tires", "fueleconomy-maintain", "carcare-guide"] },
      { id: "s4", title: "Change the oil and filters", level: "intermediate", learn: "The oil and filter, the engine air filter and the cabin air filter are common first jobs.", practice: "Change your oil and filter, and take the old oil to a recycling drop-off.", done: "The job is done, nothing leaks, and the oil level is right.", res: ["chrisfix", "ifixit-car"] },
      { id: "s5", title: "Understand brakes", level: "intermediate", learn: "How disc brakes work, what worn pads sound like, and when pads and rotors need replacing.", practice: "Inspect your brake pads, through the wheel or with the wheel off.", done: "You can tell how much pad is left.", res: ["chrisfix", "ifixit-car"] },
      { id: "s6", title: "Diagnose problems", level: "advanced", learn: "Read check-engine codes with a code reader, then research what they mean before replacing parts.", practice: "Read the codes on a car and research one of them.", done: "You can list likely causes before buying any part.", res: ["chrisfix", "ifixit-car"] },
      { id: "s7", title: "Make it a career, if you want", level: "advanced", learn: "Technicians train in school programs or on the job, and many shops look for ASE certification.", practice: "Look up training and pay near you, and visit a local program.", done: "You know the path from here to paid work.", res: ["ase", "college-navigator", "apprenticeship-finder"] },
    ],
    make: ["A maintenance log for your car", "Routine work done yourself", "Help for friends and family"],
    people: [
      { text: "Community colleges and career centers run automotive programs.", res: "college-navigator" },
      { text: "Car clubs, and friends who work on cars, are the classic way to learn." },
    ],
    work: ["auto-technician", "diesel-technician", "auto-body"],
    related: ["small-engines", "electricity", "home-maintenance"],
    safety: { text: "Use jack stands, never a jack alone. Brakes, steering and airbags are safety systems: if you're unsure of your work, have a professional check it." },
  },
  {
    slug: "small-engines",
    title: "Fix small engines",
    icon: "⚙️",
    area: "hands-on",
    subjects: ["small-engine-repair"],
    line: "Mowers, trimmers and generators: how they work, how to keep them running, and how to fix a no-start.",
    terms: ["small engine", "small engines", "lawn mower", "mower", "weed eater", "trimmer", "chainsaw", "generator", "leaf blower", "go kart", "carburetor", "2 stroke", "4 stroke", "wont start"],
    about: "A small engine needs fuel, air, a spark and compression to run. Common causes of a no-start are old fuel, a dirty carburetor and a worn spark plug, and all three can be fixed with basic tools.",
    need: ["An engine to practice on (a broken mower someone is giving away is ideal)", "Basic hand tools and a spark plug socket", "A place to work outdoors or with the door wide open"],
    cost: "The guides are free. You'll buy a few parts, like plugs and filters, as you go.",
    little: ["Neighbors often give away mowers that won't start. They make good practice.", "Manufacturers post owner's and repair manuals online."],
    steps: [
      { id: "s1", title: "Work safely", level: "beginner", learn: "Gas engines make carbon monoxide: never run one in a garage, shed or house. Pull the spark plug wire before touching a blade.", practice: "Read CPSC's engine safety page and set up a safe place to work.", done: "You always pull the plug wire and run engines outdoors.", res: ["cpsc-generators"] },
      { id: "s2", title: "Learn how the engine works", level: "beginner", learn: "The four strokes: intake, compression, power, exhaust. How a two-stroke differs.", practice: "Explain to someone why an engine needs fuel, air, spark and compression.", done: "You can name the four strokes in order.", res: ["donyboy73", "briggs-manuals"] },
      { id: "s3", title: "Do the routine maintenance", level: "beginner", learn: "Oil, air filter, spark plug, a sharp blade, and fuel stabilizer before storage.", practice: "Service a mower: oil, filter, plug and blade.", done: "The mower starts and runs smoothly.", res: ["briggs-manuals", "ifixit-mower"] },
      { id: "s4", title: "Fix a no-start", level: "intermediate", learn: "Check spark, fuel and air, in that order.", practice: "Find out why an engine won't start, and fix it.", done: "You found the cause by testing, not guessing.", res: ["donyboy73", "ifixit-mower"] },
      { id: "s5", title: "Clean a carburetor", level: "intermediate", learn: "Take it apart, clean the jets and passages, replace the gaskets, and put it back.", practice: "Clean one carburetor and get the engine running.", done: "The engine idles and runs under load.", res: ["donyboy73", "briggs-manuals"] },
      { id: "s6", title: "Make it a career, if you want", level: "advanced", learn: "Shops and dealers hire technicians, and certification is available through the Equipment & Engine Training Council.", practice: "Look up small engine mechanic training and pay where you live.", done: "You know the path to paid work.", res: ["eetc", "college-navigator"] },
    ],
    make: ["Mowers and tools fixed for family and neighbors", "Equipment brought back to sell", "A seasonal tune-up routine"],
    people: [{ text: "Repair Cafés fix small appliances and tools together.", res: "repair-cafe" }],
    work: ["small-engine-mechanic", "maintenance-repair"],
    business: "Seasonal tune-ups and repairs are a common neighborhood business. Check local rules for disposing of old fuel and oil.",
    related: ["car-repair", "home-maintenance"],
    safety: { text: "Run engines only outdoors, away from windows and doors: carbon monoxide kills. Store fuel in approved containers away from heat.", res: "cpsc-generators" },
  },
  {
    slug: "watch-clock",
    title: "Restore watches and clocks",
    icon: "⌚",
    area: "hands-on",
    subjects: ["watch-clock-repair"],
    line: "How a mechanical movement works, the tools, and your first service on a practice movement.",
    terms: ["watch", "watches", "clock", "clocks", "pocket watch", "restore a watch", "restore an old watch", "watch repair", "clock repair", "watchmaker", "watchmaking", "horology", "grandfather clock", "mechanical watch", "movement"],
    about: "A mechanical watch is a spring, a train of gears and a balance wheel that swings back and forth several times a second. Restoring one takes patience, steady hands and a few special tools. Clocks work the same way at a larger, more forgiving size.",
    need: ["A practice movement, or an old clock you don't mind learning on", "Fine screwdrivers and tweezers", "A loupe (magnifier)", "A clean, well-lit table"],
    cost: "The videos and reading here are free. Tools and practice movements cost money; courses and memberships cost more.",
    little: ["Start with a clock: bigger parts, cheaper mistakes.", "Never practice on a valuable or sentimental watch. Take an heirloom to a professional."],
    steps: [
      { id: "s1", title: "Learn how a movement works", level: "beginner", learn: "Mainspring, gear train, escapement and balance: how stored energy becomes steady ticks.", practice: "Watch a full service video and name each part as it comes out.", done: "You can explain the escapement in your own words.", res: ["wiki-mechanical-watch", "wristwatch-revival"] },
      { id: "s2", title: "Set up a bench", level: "beginner", learn: "Screwdrivers, tweezers, a loupe, a dust cover, and a way to keep tiny parts in order.", practice: "Set up a clean bench with good light, a mat and parts trays.", done: "Your bench is ready and nothing small can roll away.", res: ["watch-repair-channel"] },
      { id: "s3", title: "Take apart a practice movement", level: "intermediate", learn: "Let the power down safely, then take it apart in order, photographing each step.", practice: "Take apart and reassemble an inexpensive practice movement.", done: "It ticks again after you put it back together.", res: ["watch-repair-channel", "wristwatch-revival", "ifixit-watch"] },
      { id: "s4", title: "Clean and oil", level: "intermediate", learn: "Cleaning every part and oiling the right points with the right oils is most of a service.", practice: "Clean and oil your practice movement.", done: "It runs a full day on one winding.", res: ["watch-repair-channel", "wristwatch-revival"] },
      { id: "s5", title: "Regulate and test", level: "advanced", learn: "Adjust the rate so it keeps time. A timing app or machine shows how fast or slow it runs.", practice: "Regulate your movement and write down its daily rate for a week.", done: "You know its rate and how to improve it.", res: ["watch-repair-channel"] },
      { id: "s6", title: "Learn with others", level: "advanced", learn: "Clubs, chapters and professional schools teach what videos can't.", practice: "Visit a chapter meeting, or look into AWCI or BHI courses.", done: "You know someone who can look at your work.", res: ["nawcc", "awci", "bhi"], see: [{ href: "/marketplace#restore", label: "Find a professional restorer" }] },
    ],
    make: ["A running practice movement", "A restored clock for your home", "Family pieces repaired, once you've practiced"],
    people: [{ text: "NAWCC chapters meet across the country, with classes and experienced members.", res: "nawcc" }],
    work: ["watch-repairer", "jeweler", "instrument-repairer"],
    business: "Some watch and clock repairers work from a home workshop.",
    related: ["small-engines", "home-maintenance"],
  },

  // ── Home, food and garden ─────────────────────────────────────────────
  {
    slug: "grow-food",
    title: "Grow your own food",
    icon: "🌱",
    area: "home-food",
    subjects: ["gardening", "farming", "food-preservation"],
    line: "Start small: know your zone, build good soil, grow a few easy crops, and keep what you harvest.",
    terms: ["garden", "gardening", "grow food", "grow my own food", "grow vegetables", "vegetable", "vegetables", "vegetable garden", "tomato", "tomatoes", "seeds", "compost", "raised bed", "homestead", "plants"],
    about: "A small garden can grow a real amount of food. It comes down to a few basics: enough sun, good soil, steady water, and plants that suit your climate.",
    need: ["A spot with six or more hours of direct sun, or a few containers", "Seeds or small plants", "Water within reach"],
    cost: "The guides are free. Seeds, soil and containers cost a little; some public libraries lend seeds.",
    little: ["Start with containers or one small bed.", "Lettuce, beans, herbs and squash are forgiving first crops.", "Your state's extension service can test your soil and answer questions."],
    steps: [
      { id: "s1", title: "Know your zone and planting dates", level: "beginner", learn: "Your hardiness zone tells you which plants survive your winters. Local planting dates tell you when to sow.", practice: "Look up your zone, then find your local planting calendar through your extension service.", done: "You have a planting calendar for your area.", res: ["usda-zones", "extension-system"] },
      { id: "s2", title: "Pick the spot and start small", level: "beginner", learn: "Most vegetables need six or more hours of direct sun. A small bed you can keep up with beats a big one you can't.", practice: "Plan one 4-by-4-foot bed or a few containers, with three crops.", done: "You have a sketch of what goes where.", res: ["mu-extension", "extension-system"] },
      { id: "s3", title: "Build the soil", level: "beginner", learn: "Healthy soil holds water and feeds plants. Compost improves almost any soil.", practice: "Get a soil test, add compost, and start a compost pile.", done: "Your bed is ready and your compost pile is going.", res: ["epa-compost", "extension-system"] },
      { id: "s4", title: "Plant, water and mulch", level: "beginner", learn: "Plant at the right depth and spacing, water deeply rather than often, and mulch to hold moisture.", practice: "Plant your crops and keep a simple log of watering and growth.", done: "Your plants are growing and the log covers a month.", res: ["mu-extension"] },
      { id: "s5", title: "Handle pests and problems", level: "intermediate", learn: "Identify the problem before treating it. Many pests can be picked off or kept out with covers.", practice: "When a problem shows up, identify it using your extension service's guides.", done: "You solved one problem without guessing.", res: ["extension-system", "mu-extension"] },
      { id: "s6", title: "Harvest and keep it", level: "intermediate", learn: "Pick at the right time, and keep extra by freezing, drying or canning with tested methods.", practice: "Harvest, and preserve one crop safely.", done: "You've eaten food you grew and stored some for later.", res: ["nchfp"], see: [{ href: "/learn/paths/food-preservation", label: "Preserve food safely" }] },
      { id: "s7", title: "Grow more next year", level: "advanced", learn: "Rotate crops, save seeds from open-pollinated plants, and stretch the season.", practice: "Write down what worked and plan next year's garden.", done: "You have a plan for a bigger or better garden.", res: ["mu-extension", "beginning-farmers"] },
    ],
    make: ["Fresh vegetables and herbs", "Compost from kitchen scraps", "Seeds saved for next year"],
    people: [
      { text: "Extension services run classes and Master Gardener volunteer programs in almost every state.", res: "extension-system" },
      { text: "4-H runs gardening and farm clubs for young people.", res: "four-h" },
      { text: "Community gardens share plots in many towns." },
    ],
    work: ["farmer", "farmworker", "conservation-scientist"],
    business: "Some gardeners sell extra produce, seedlings or herbs at farmers markets. Check your state's rules first.",
    related: ["food-preservation", "home-maintenance"],
  },
  {
    slug: "food-preservation",
    title: "Preserve food safely",
    icon: "🫙",
    area: "home-food",
    subjects: ["food-preservation", "food-safety"],
    line: "Freezing, drying, and canning with tested methods, so what you store stays safe to eat.",
    terms: ["canning", "can food", "can vegetables", "preserve food", "food preservation", "preserving", "pickles", "pickling", "jam", "jelly", "pressure canner", "water bath", "dehydrate", "dry food", "freeze food", "food storage", "pantry", "mason jar", "jars", "can green beans", "can beans", "can tomatoes", "can peaches", "can salsa", "pressure can"],
    about: "Preserving keeps food from spoiling: freezing, drying, pickling or canning. Canning carries one serious risk, botulism, and it is prevented by following tested recipes and methods exactly.",
    need: ["Food to preserve", "A freezer, a dehydrator or oven, or canning equipment", "A tested recipe from a trusted source"],
    cost: "The guides are free. Jars, lids and a canner cost money; freezing and drying need less equipment.",
    little: ["Start with freezing and drying: they need the least equipment.", "Many extension offices teach canning classes and test pressure canner gauges."],
    steps: [
      { id: "s1", title: "Learn why the rules matter", level: "beginner", learn: "Botulism can grow in low-acid foods sealed without enough heat. It's rare, deadly and preventable.", practice: "Read CDC's home-canning page and the introduction to the USDA guide.", done: "You can explain why low-acid foods need a pressure canner.", res: ["cdc-home-canning", "usda-canning-guide"] },
      { id: "s2", title: "Freeze and dry", level: "beginner", learn: "Blanch vegetables before freezing, and dry fruit, herbs and meat with tested methods.", practice: "Freeze one vegetable and dry one fruit or herb.", done: "You've frozen and dried food with a tested method.", res: ["nchfp"] },
      { id: "s3", title: "Water-bath canning for high-acid foods", level: "intermediate", learn: "Jams, jellies, pickles and acidified tomatoes are processed in boiling water for tested times.", practice: "Make one batch of jam or pickles from a tested recipe.", done: "Every jar sealed, and each one is labeled with the date.", res: ["usda-canning-guide", "nchfp"] },
      { id: "s4", title: "Pressure canning for low-acid foods", level: "advanced", learn: "Vegetables, beans, meat and soups need a pressure canner at the pressure and time for your altitude.", practice: "Can one batch of a vegetable from a tested recipe, adjusted for your altitude.", done: "Every jar sealed, and you followed the recipe exactly.", res: ["usda-canning-guide", "nchfp"] },
      { id: "s5", title: "Store, rotate and check", level: "beginner", learn: "Keep jars cool and dark, use them within a year, and throw out any jar that bulges, leaks or smells off. Never taste to test.", practice: "Set up a shelf with the oldest jars in front, and keep a list.", done: "You know what you have and what to use first.", res: ["cdc-home-canning", "foodsafety-gov"] },
    ],
    make: ["Jams, pickles and canned tomatoes", "Frozen and dried vegetables and fruit", "A stocked, rotated pantry"],
    people: [{ text: "Extension services teach canning classes and test dial gauges.", res: "extension-system" }],
    work: [],
    business: "Selling home-canned food is covered by each state's cottage food rules, and many canned foods aren't allowed. Check your state first.",
    related: ["grow-food", "home-maintenance"],
    safety: { text: "Use only tested recipes and methods, like the USDA guide. Low-acid foods must be pressure canned. If a jar bulges, leaks or smells off, throw it out without tasting.", res: "cdc-home-canning" },
  },
  {
    slug: "home-maintenance",
    title: "Take care of a home",
    icon: "🏠",
    area: "home-food",
    subjects: ["home-repair", "home-care", "plumbing"],
    line: "Know your shutoffs, test the alarms, follow a seasonal list, and fix the small things.",
    terms: ["home repair", "house repair", "fix my house", "home maintenance", "house maintenance", "handyman", "leaky faucet", "running toilet", "toilet", "drywall", "caulk", "furnace filter", "first home", "homeowner", "renter", "apartment"],
    about: "Small, regular jobs keep a home safe and head off expensive repairs: changing filters, testing alarms, sealing gaps, fixing leaks. Most need only basic tools.",
    need: ["Basic tools: screwdrivers, pliers, an adjustable wrench, a tape measure, a utility knife, a flashlight", "Your main water shutoff and electrical panel, found and labeled"],
    cost: "The guides are free. Tools and supplies cost money; buy what each job needs, when it needs it.",
    little: ["Renters: many repairs are the landlord's responsibility. Report problems in writing.", "Borrow tools before buying them; some libraries lend tools."],
    steps: [
      { id: "s1", title: "Know your shutoffs", level: "beginner", learn: "Find the main water shutoff, the shutoff at each fixture, the electrical panel, and the gas shutoff if you have gas.", practice: "Find and label each one, and show everyone who lives there.", done: "Anyone at home could shut off the water in a minute.", res: ["this-old-house", "hud-healthy-homes"] },
      { id: "s2", title: "Test the alarms", level: "beginner", learn: "Smoke alarms belong in every bedroom, outside sleeping areas and on every level. Test them monthly and replace them 10 years after they were made.", practice: "Test every smoke and carbon monoxide alarm, and note the date printed on each.", done: "Every alarm works and you know when each one needs replacing.", res: ["usfa-smoke-alarms"] },
      { id: "s3", title: "Follow a seasonal list", level: "beginner", learn: "Filters, gutters, caulk, weatherstripping, dryer vents and outdoor faucets each have a season.", practice: "Write a short list for each season and finish this season's.", done: "This season's list is done.", res: ["this-old-house", "hud-healthy-homes"] },
      { id: "s4", title: "Fix small plumbing problems", level: "intermediate", learn: "A running toilet, a dripping faucet and a slow drain are common first fixes.", practice: "Fix one: a toilet flapper, a faucet washer or cartridge, or a clogged drain trap.", done: "The leak or clog is gone.", res: ["this-old-house", "ifixit-household"] },
      { id: "s5", title: "Patch, caulk and paint", level: "intermediate", learn: "Patch drywall, re-caulk a tub or window, and paint neatly.", practice: "Patch one hole and re-caulk one tub or window.", done: "The patch disappears under paint.", res: ["this-old-house"] },
      { id: "s6", title: "Watch for water", level: "intermediate", learn: "Fix leaks early. Dry anything that gets wet within 24 to 48 hours to prevent mold.", practice: "Check under sinks, around the water heater, and in the basement or crawlspace.", done: "You know there are no active leaks.", res: ["epa-mold"] },
      { id: "s7", title: "Know when to call a professional", level: "beginner", learn: "Electrical panels, gas lines, structural changes and roofs usually need licensed professionals and permits.", practice: "Find out which jobs need a permit where you live.", done: "You know which jobs you'll do and which you'll hire out.", res: ["esfi", "hud-healthy-homes"] },
    ],
    make: ["A safer home with working alarms", "A home maintenance calendar", "Small repairs done for family and neighbors"],
    people: [
      { text: "Repair Cafés fix things together at free local events.", res: "repair-cafe" },
      { text: "Some hardware stores and libraries hold how-to classes." },
    ],
    work: ["maintenance-repair", "plumber", "electrician", "hvac-technician", "carpenter"],
    related: ["electricity", "grow-food", "car-repair"],
    safety: { text: "Turn off power at the panel before touching any wiring, and test that it's off. Leave gas lines and panel work to licensed professionals.", res: "esfi" },
  },

  // ── Math and science ──────────────────────────────────────────────────
  {
    slug: "math-to-calculus",
    title: "Math, from the basics to calculus",
    icon: "📐",
    area: "science-math",
    subjects: ["arithmetic-algebra", "geometry", "calculus"],
    line: "Find your gaps, then arithmetic, algebra, geometry and functions, then calculus.",
    terms: ["math", "maths", "calculus", "learn calculus", "algebra", "geometry", "trigonometry", "precalculus", "fractions", "pre algebra", "math class", "ged math", "get better at math"],
    about: "Math builds in layers, and each one needs the one before. Trouble in algebra or calculus usually comes from a gap in an earlier layer. Find the gap, fill it, and the rest gets easier.",
    need: ["Paper and a pencil", "A graphing calculator (a free one runs in the browser)"],
    cost: "Everything here is free. Khan Academy saves your progress with a free account.",
    little: ["These practice sites work on older computers and on phones.", "OpenStax textbooks download as free PDFs."],
    steps: [
      { id: "s1", title: "Find your starting point", level: "beginner", learn: "Try practice problems until they get hard. That's where you start, whatever grade it is.", practice: "Work through arithmetic and algebra practice until you miss several in a row.", done: "You know the first topic you need.", res: ["khan-arithmetic", "khan-algebra"] },
      { id: "s2", title: "Arithmetic and fractions", level: "beginner", learn: "Fractions, decimals, percents and negative numbers.", practice: "Practice until you can do them without a calculator.", done: "Fraction and percent problems feel routine.", res: ["khan-arithmetic", "openstax-prealgebra"] },
      { id: "s3", title: "Algebra", level: "beginner", learn: "Variables, equations, graphs of lines, and word problems.", practice: "Solve equations every day, and graph them on Desmos to see them.", done: "You can solve and graph a linear equation.", res: ["khan-algebra", "openstax-college-algebra", "desmos"] },
      { id: "s4", title: "Geometry and trigonometry", level: "intermediate", learn: "Angles, triangles, area, the Pythagorean theorem, sine and cosine.", practice: "Measure something real, like a roof pitch or a ramp, and calculate its angle.", done: "You can find a missing side or angle of a triangle.", res: ["khan-geometry", "geogebra"] },
      { id: "s5", title: "Functions", level: "intermediate", learn: "Functions, exponents and logarithms, and how graphs change.", practice: "Graph ten functions on Desmos, predicting each shape first.", done: "You can sketch a graph from its equation.", res: ["khan-precalculus", "openstax-precalculus", "desmos"] },
      { id: "s6", title: "Calculus", level: "advanced", learn: "Limits, derivatives (rates of change) and integrals (adding up).", practice: "Watch Essence of calculus, then work through the practice sets.", done: "You can find a derivative and say what it means.", res: ["3b1b-calculus", "khan-calculus", "openstax-calculus"] },
      { id: "s7", title: "Go further", level: "advanced", learn: "College-level courses, statistics or linear algebra.", practice: "Start MIT's single variable calculus or linear algebra course.", done: "You've finished a full problem set from the course.", res: ["mit-calculus", "mit-linear-algebra"] },
    ],
    make: ["Budgets and plans that add up", "Measurements for building projects", "A base for science, engineering and programming"],
    people: [
      { text: "Libraries and community colleges often offer free tutoring." },
      { text: "Study with a friend: if you can explain a step, you know it." },
    ],
    work: ["statistician", "data-scientist", "mechanical-engineer", "civil-engineer", "high-school-teacher"],
    related: ["electricity", "programming", "ai-basics"],
  },
  {
    slug: "electricity",
    title: "Understand electricity",
    icon: "⚡",
    area: "science-math",
    subjects: ["electronics", "physics", "electrical-work"],
    line: "Voltage, current and circuits, safely: simulations first, then small projects, then how a house is wired.",
    terms: ["electricity", "understand electricity", "electric", "electrical", "circuit", "circuits", "voltage", "current", "ohms law", "wiring", "electronics", "arduino", "solder", "soldering", "become an electrician"],
    about: "Electricity is the flow of charge around a circuit. Three ideas explain most of it: voltage (the push), current (the flow) and resistance (what slows it). You can learn them safely with simulations and batteries, long before touching household wiring.",
    need: ["A phone or computer for the simulations", "Later: batteries, wire, small bulbs or LEDs, and a multimeter"],
    cost: "The simulations and books here are free. Parts and a multimeter cost money when you get to them.",
    little: ["The simulations teach the ideas before you buy any parts."],
    steps: [
      { id: "s1", title: "Build circuits on screen", level: "beginner", learn: "Batteries, wires, bulbs and switches, and what changes when you change each one.", practice: "Build a series circuit and a parallel circuit in the simulator, and compare the bulbs.", done: "You can predict which bulb is brighter, and why.", res: ["phet-circuits"] },
      { id: "s2", title: "Voltage, current and resistance", level: "beginner", learn: "Ohm's law ties them together: voltage equals current times resistance.", practice: "Solve ten Ohm's law problems and check them in the simulator.", done: "You can find any one of the three from the other two.", res: ["khan-circuits", "phet-circuits"] },
      { id: "s3", title: "Measure real circuits", level: "intermediate", learn: "Use a multimeter to measure voltage, current and resistance on battery circuits.", practice: "Build a battery circuit with an LED and a resistor, and measure it.", done: "Your measurements match your calculations.", res: ["aac-textbook", "sparkfun"] },
      { id: "s4", title: "Small electronics projects", level: "intermediate", learn: "Breadboards, components and soldering.", practice: "Build one small project from a tutorial.", done: "It works, and you can explain each part.", res: ["sparkfun", "aac-textbook"] },
      { id: "s5", title: "How a house is wired", level: "intermediate", learn: "Circuits, breakers, grounding and GFCI outlets: what they do and why. Learn this to understand and stay safe, not to rewire.", practice: "With help, match each breaker in your panel to the rooms it powers.", done: "Your panel has an accurate label for every breaker.", res: ["esfi", "this-old-house"] },
      { id: "s6", title: "Become an electrician, if you want", level: "advanced", learn: "Electricians usually train through paid apprenticeships and need a license in most states.", practice: "Look up apprenticeships near you and your state's license rules.", done: "You know the path to a license.", res: ["apprenticeship-finder", "college-navigator"] },
    ],
    make: ["Simple circuits and electronics projects", "An accurately labeled electrical panel", "A base for electrical work or engineering"],
    people: [{ text: "Electrical apprenticeships teach in the classroom and on the job, with pay.", res: "apprenticeship-finder" }],
    work: ["electrician", "line-worker", "solar-installer", "electronics-repair", "electrical-engineer"],
    related: ["home-maintenance", "computer-hardware", "math-to-calculus"],
    safety: { text: "Household current can kill. Experiment only with batteries and low-voltage kits, and leave household wiring to licensed electricians.", res: "esfi" },
  },

  // ── Music ─────────────────────────────────────────────────────────────
  {
    slug: "piano",
    title: "Learn piano",
    icon: "🎹",
    area: "arts",
    subjects: ["piano", "music-theory"],
    line: "Find the notes, read music, play with both hands, then chords and the songs you love.",
    terms: ["piano", "keyboard", "learn piano", "play piano", "piano lessons", "keys", "sheet music", "read music", "chords"],
    about: "On a piano, every note sits in order where you can see it, which makes it a good place to learn how music works. A few focused minutes most days do more than one long session a week.",
    need: ["A piano or keyboard (a browser piano works to start)", "10 to 20 minutes most days"],
    cost: "The lessons, exercises and sheet music here are free. A keyboard costs money; a used one works.",
    little: ["Start on a browser piano while you decide.", "When you buy, look for full-size keys; touch-sensitive keys help later."],
    steps: [
      { id: "s1", title: "Find your way around the keys", level: "beginner", learn: "Middle C, the pattern of black keys, and the names of the white keys.", practice: "Name every C, F and G on the keyboard without counting up from middle C.", done: "You can find any note by name.", res: ["idc-piano", "musictheory-net"] },
      { id: "s2", title: "Sit, shape your hands, number your fingers", level: "beginner", learn: "Sit at the right height, keep your fingers curved, and number them 1 to 5 from the thumb.", practice: "Play five-finger patterns with each hand, slowly and evenly.", done: "Each hand plays five notes evenly without looking.", res: ["musictheory-net", "idc-piano"] },
      { id: "s3", title: "Read music", level: "beginner", learn: "The staff, treble and bass clefs, note lengths and time signatures.", practice: "Do note-reading exercises for five minutes a day for two weeks.", done: "You can name notes on both staves quickly.", res: ["musictheory-net", "musictheory-exercises"] },
      { id: "s4", title: "Play with both hands", level: "intermediate", learn: "Start with pieces where the hands take turns, then play them together.", practice: "Learn two simple public-domain pieces.", done: "You can play a short piece hands together, slowly and steadily.", res: ["imslp"] },
      { id: "s5", title: "Chords and accompaniment", level: "intermediate", learn: "Major and minor chords, and how songs are built on a few of them.", practice: "Play a song you know: melody in the right hand, chords in the left.", done: "You can accompany a simple song from a chord chart.", res: ["musictheory-net", "open-music-theory"] },
      { id: "s6", title: "Scales and a practice routine", level: "intermediate", learn: "Scales build finger strength and teach keys. A routine keeps you improving.", practice: "Practice two scales and one piece every day for a month.", done: "You can hear the difference from your first week.", res: ["musictheory-exercises"] },
      { id: "s7", title: "Play for people, and with them", level: "advanced", learn: "Playing with others teaches timing and listening.", practice: "Play one piece for family or friends, or with a church, school or community group.", done: "You've played for someone else.", res: ["open-music-theory", "musescore"] },
    ],
    make: ["Songs you love, played your way", "Accompaniment for singing at home or church", "Short pieces of your own, written in MuseScore"],
    people: [
      { text: "Churches, schools and community bands often welcome players." },
      { text: "Teachers in many towns offer group lessons." },
    ],
    work: ["musician"],
    related: ["music-creation"],
  },
  {
    slug: "music-creation",
    title: "Make and record music",
    icon: "🎵",
    area: "arts",
    subjects: ["songwriting", "music-theory"],
    line: "Write a song, record it with what you have, and learn to arrange, mix and share it.",
    terms: ["make music", "music production", "produce music", "record music", "recording", "write a song", "write songs", "songwriting", "beats", "make beats", "home studio", "compose", "daw"],
    about: "You can write and record music with a phone and free software. The skills are listening, a little theory, and finishing songs.",
    need: ["A phone or computer that can record", "Headphones", "An instrument or your voice (software instruments work too)"],
    cost: "The software and lessons here are free. Microphones and audio interfaces cost money, and you can start without them.",
    little: ["Your phone's voice recorder is enough for song ideas.", "Audacity and LMMS are free and run on older computers."],
    steps: [
      { id: "s1", title: "Learn enough theory", level: "beginner", learn: "Scales, chords, rhythm, and song form: verse, chorus, bridge.", practice: "Map out the sections and chords of three songs you like.", done: "You can name a song's chords and sections.", res: ["musictheory-net", "open-music-theory"] },
      { id: "s2", title: "Write a song", level: "beginner", learn: "Start from a chord progression or a line of lyrics, and build out.", practice: "Write one complete song, even a short one.", done: "You have a song with a beginning and an end.", res: ["open-music-theory"] },
      { id: "s3", title: "Record with what you have", level: "beginner", learn: "Record in a quiet room, close to the source, without clipping (too loud to record cleanly).", practice: "Record your song in Audacity.", done: "You have a clean recording you can listen back to.", res: ["audacity"] },
      { id: "s4", title: "Arrange it", level: "intermediate", learn: "Add parts with software instruments: drums, bass, keys.", practice: "Arrange your song in LMMS with at least three parts.", done: "Your song has a full arrangement.", res: ["lmms"] },
      { id: "s5", title: "Mix and finish", level: "intermediate", learn: "Balance the levels, place instruments left and right, and keep it simple.", practice: "Mix your song, then compare it with a song you admire on the same speakers.", done: "It sounds good on headphones, a phone and a car stereo.", res: ["audacity", "lmms"] },
      { id: "s6", title: "Share it the right way", level: "intermediate", learn: "Know who owns what: your song, any samples you use, and covers of other people's songs.", practice: "Choose how to license your song, and share it.", done: "Your song is out and you know your rights.", res: ["cc-licenses"] },
    ],
    make: ["Finished songs", "Music for your own videos and podcasts", "Sheet music, written in MuseScore"],
    people: [{ text: "Worship teams, school bands and community choirs are good places to play with others." }],
    work: ["musician", "film-editor"],
    related: ["piano"],
  },
];

export function pathBySlug(slug: string): LearningPath | undefined {
  return PATHS.find((p) => p.slug === slug);
}

/** Paths whose home subject (or any subject) is this one, home subject first. */
export function pathsForSubject(subject: string): LearningPath[] {
  const home = PATHS.filter((p) => p.subjects[0] === subject);
  const other = PATHS.filter((p) => p.subjects[0] !== subject && p.subjects.includes(subject));
  return [...home, ...other];
}

export function pathsInArea(area: string): LearningPath[] {
  return PATHS.filter((p) => p.area === area);
}

/** The paths shown first on the homepage and at the top of Learning. */
export const FEATURED_PATHS = ["restore-old-computer", "build-a-website", "grow-food", "car-repair", "piano", "start-small-business", "find-work", "electricity"];
