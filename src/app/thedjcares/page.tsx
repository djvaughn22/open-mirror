type ResourceItem = {
  title: string;
  source: string;
  type: string;
  summary: string;
  href?: string;
  action?: string;
  badge?: string;
};

type ResourceSection = {
  eyebrow: string;
  title: string;
  intro: string;
  items: ResourceItem[];
};

const keptAppleMusicPlaylists: ResourceItem[] = [];

const gospelItems: ResourceItem[] = [
  {
    title: "Seoul, South Korea: Billy Graham's Largest Ever Crusade",
    source: "Billy Graham Evangelistic Association",
    type: "Sermon / Gospel",
    summary:
      "Official BGEA video from Billy Graham's historic 1973 Seoul Crusade, where millions gathered to hear the Gospel. Start here for a clear invitation to Jesus.",
    href: "https://www.youtube.com/watch?v=PQDLjd57vdE",
    action: "Watch",
    badge: "Featured Gospel",
  },
  {
    title: "Billy Graham Classics",
    source: "Billy Graham Evangelistic Association",
    type: "Sermon",
    summary:
      "Classic Gospel messages that call people to repentance, faith in Jesus, and peace with God.",
    href: "https://billygraham.org/classics",
    action: "Watch",
    badge: "Gospel",
  },
  {
    title: "Peace With God",
    source: "Billy Graham Evangelistic Association",
    type: "Gospel",
    summary:
      "A clear next step for anyone who wants to understand salvation, forgiveness, repentance, and faith in Jesus Christ.",
    href: "https://peacewithgod.net/",
    action: "Open",
    badge: "Jesus",
  },
  {
    title: "Choices We Make",
    source: "Billy Graham Classics",
    type: "Sermon",
    summary:
      "A simple Gospel reminder that every heart must choose what it will trust: the world or Christ.",
    href: "https://billygraham.org/classics",
    action: "Open",
    badge: "Gospel",
  },
  {
    title: "Biblical Peace",
    source: "Billy Graham Classics",
    type: "Sermon",
    summary:
      "Encouragement for anyone looking for real peace with God through Jesus Christ.",
    href: "https://billygraham.org/classics",
    action: "Open",
    badge: "Hope",
  },
];

const classicTeachingItems: ResourceItem[] = [
  {
    title: "Prayer",
    source: "Adrian Rogers / Love Worth Finding",
    type: "Sermon",
    summary:
      "A clear, practical message on prayer as a believer's privilege, dependence, and daily walk with God.",
    href: "https://www.lwf.org/sermons/video/prayer-2064",
    action: "Watch",
    badge: "Prayer",
  },
  {
    title: "What to Do When the Bottom Falls Out",
    source: "Adrian Rogers / Love Worth Finding",
    type: "Sermon",
    summary:
      "Bible encouragement for standing on God's unchanging love when life gets heavy or unstable.",
    href: "https://www.lwf.org/sermons/video/what-to-do-when-the-bottom-falls-out-2140",
    action: "Watch",
    badge: "Hope",
  },
  {
    title: "Biblical Faith",
    source: "Adrian Rogers / Love Worth Finding",
    type: "Sermon",
    summary:
      "A Scripture-centered teaching on what real faith is and why faith must rest in Jesus and God's Word.",
    href: "https://www.lwf.org/sermons/video/biblical-faith-what-it-is-and-how-to-have-it-1749",
    action: "Watch",
    badge: "Bible",
  },
  {
    title: "Love Worth Finding",
    source: "Adrian Rogers",
    type: "Teaching Library",
    summary:
      "Official Adrian Rogers ministry library for straightforward Bible teaching centered on Jesus, Scripture, assurance, obedience, and trusting God.",
    href: "https://www.lwf.org/",
    action: "Open",
    badge: "Classic",
  },
  {
    title: "In Touch Ministries",
    source: "Charles Stanley",
    type: "Teaching",
    summary:
      "Warm, steady Bible teaching for prayer, obedience, trust, and daily growth with Jesus.",
    href: "https://www.intouch.org/",
    action: "Open",
    badge: "Daily Walk",
  },
  {
    title: "Thru the Bible",
    source: "J. Vernon McGee",
    type: "Classic",
    summary:
      "Long-form Bible teaching that helps listeners keep walking through the whole counsel of Scripture.",
    href: "https://www.ttb.org/",
    action: "Listen",
    badge: "Bible",
  },
  {
    title: "Christ Is at the Beginning, Middle, and End of History",
    source: "David Jeremiah / Turning Point",
    type: "Bible Overview",
    summary:
      "A big-picture Bible resource connecting Genesis 3:15 and Revelation 22:13 around Jesus Christ, the Alpha and Omega.",
    href: "https://davidjeremiah.blog/christs-second-coming-in-gods-story-of-redemption/",
    action: "Read",
    badge: "Genesis to Revelation",
  },
  {
    title: "Understand the Basics of the Bible",
    source: "David Jeremiah / Turning Point",
    type: "Bible Overview",
    summary:
      "A simple Bible overview that traces the Good News from Genesis through the redemptive work of Jesus Christ.",
    href: "https://davidjeremiah.blog/understand-the-basics-of-the-bible/",
    action: "Read",
    badge: "Bible",
  },
];

const prayerItems: ResourceItem[] = [
  {
    title: "Let Us Pray",
    source: "In Touch Ministries",
    type: "Prayer",
    summary:
      "Simple prayer encouragement from Charles Stanley's ministry for bringing real life before God.",
    href: "https://www.intouch.org/listen",
    action: "Listen",
    badge: "Prayer",
  },
  {
    title: "Daily Devotions",
    source: "In Touch Ministries",
    type: "Devotional",
    summary:
      "Short daily readings that point back to Scripture, prayer, obedience, and trust in God.",
    href: "https://www.intouch.org/read/daily-devotions",
    action: "Read",
    badge: "Daily",
  },
  {
    title: "Classic Prayer Education: O. Hallesby's Prayer",
    source: "O. Hallesby",
    type: "Classic / Prayer",
    summary:
      "A classic prayer resource about helplessness, faith, dependence, and talking honestly with God. No random copyrighted upload is linked here.",
    badge: "Prayer",
  },
];

const worshipItems: ResourceItem[] = [
  {
    title: "Amazing Grace",
    source: "Classic Hymn",
    type: "Hymn",
    summary:
      "A simple reminder of saving grace: lost and found, blind and seeing, rescued by God.",
    badge: "Hymn",
  },
  {
    title: "How Great Thou Art",
    source: "Classic Hymn",
    type: "Hymn",
    summary:
      "A hymn of awe and worship that lifts the heart toward the greatness of God.",
    badge: "Hymn",
  },
  {
    title: "It Is Well With My Soul",
    source: "Classic Hymn",
    type: "Hymn",
    summary:
      "A steady song of faith when life is heavy, pointing to peace in Christ.",
    badge: "Hymn",
  },
  {
    title: "Blessed Assurance",
    source: "Classic Hymn",
    type: "Hymn",
    summary:
      "A joyful confession of belonging to Jesus and trusting His salvation.",
    badge: "Hymn",
  },
  {
    title: "Great Is Thy Faithfulness",
    source: "Classic Hymn",
    type: "Hymn",
    summary:
      "A simple praise reminder that God's mercy, provision, and faithfulness do not fail.",
    badge: "Hymn",
  },
  ...keptAppleMusicPlaylists,
];

const devotionalItems: ResourceItem[] = [
  {
    title: "Our Daily Bread",
    source: "Our Daily Bread Ministries",
    type: "Devotional",
    summary:
      "Short daily encouragement designed to help people grow closer to God and respond to His Word.",
    href: "https://www.odbm.org/en/devotionals",
    action: "Read",
    badge: "Daily",
  },
  {
    title: "In Touch Daily Devotions",
    source: "Charles Stanley / In Touch Ministries",
    type: "Devotional",
    summary:
      "Daily Bible-centered readings for trusting God, praying honestly, and walking faithfully.",
    href: "https://www.intouch.org/read/daily-devotions",
    action: "Read",
    badge: "Daily",
  },
  {
    title: "Billy Graham Devotional Resources",
    source: "Billy Graham Evangelistic Association",
    type: "Devotional",
    summary:
      "Gospel-first encouragement from Billy Graham's official ministry resources.",
    href: "https://billygraham.org/devotionals/",
    action: "Read",
    badge: "Gospel",
  },
];

const familyAndHomeItems: ResourceItem[] = [
  {
    title: "Allen Jackson Ministries",
    source: "Pastor Allen Jackson",
    type: "Teaching",
    summary:
      "Official ministry home for Bible-centered sermons, broadcasts, devotionals, prayer resources, and encouragement for living faith in real life.",
    href: "https://allenjackson.com/",
    action: "Open",
    badge: "Faith at Home",
  },
  {
    title: "Sermons & Broadcasts",
    source: "Allen Jackson Ministries",
    type: "Sermon",
    summary:
      "Official Allen Jackson sermons and broadcasts. Keep these as reviewed encouragement, not a blanket endorsement of every topical episode.",
    href: "https://allenjackson.com/watch/recent-tv-broadcasts/",
    action: "Watch",
    badge: "Teaching",
  },
  {
    title: "Bible Reading Plan",
    source: "Allen Jackson Ministries",
    type: "Bible Plan",
    summary:
      "A simple official Bible reading plan meant to help people stay in Scripture a few minutes each day.",
    href: "https://allenjackson.com/bible-reading/",
    action: "Read",
    badge: "Bible",
  },
  {
    title: "Dr. James Dobson Family Institute",
    source: "Dr. James Dobson's Family Talk",
    type: "Family Ministry",
    summary:
      "Official family ministry resources for marriage, parenting, children, legacy, and building a Christ-centered home.",
    href: "https://www.drjamesdobson.org/",
    action: "Open",
    badge: "Family",
  },
  {
    title: "Family Talk Broadcasts",
    source: "Dr. James Dobson's Family Talk",
    type: "Broadcast",
    summary:
      "Official broadcasts focused on marriage, parenting, sons, daughters, and strengthening the family with biblical encouragement.",
    href: "https://www.drjamesdobson.org/category/broadcasts/",
    action: "Listen",
    badge: "Family Talk",
  },
  {
    title: "Marriage & Parenting",
    source: "Dr. James Dobson Family Institute",
    type: "Family Resource",
    summary:
      "A focused official resource hub for keeping Christ at the center of marriage, parenting, and home life.",
    href: "https://www.drjamesdobson.org/category/marriage-parenting/",
    action: "Read",
    badge: "Home",
  },
  {
    title: "Building a Family Legacy",
    source: "Dr. James Dobson's Family Talk",
    type: "Family Resource",
    summary:
      "Dr. Dobson and Ryan Dobson discuss building a spiritual legacy and helping children follow Christ.",
    href: "https://www.drjamesdobson.org/broadcasts/building-a-family-legacy-part-1/",
    action: "Listen",
    badge: "Legacy",
  },
  {
    title: "Dr. Dobson Minute",
    source: "Dr. James Dobson Family Institute",
    type: "Short Encouragement",
    summary:
      "Short official audio messages with practical insights for marriage, parenting, and family life.",
    href: "https://www.drjamesdobson.org/category/dobson-minute/",
    action: "Listen",
    badge: "Minute",
  },
];

const resourceSections: ResourceSection[] = [
  {
    eyebrow: "Start Here",
    title: "The Gospel",
    intro:
      "Clear, classic messages about Jesus, repentance, faith, hope, and peace with God.",
    items: gospelItems,
  },
  {
    eyebrow: "Classic",
    title: "Bible Teaching",
    intro:
      "Trusted Scripture-centered teaching for assurance, prayer, obedience, and daily faith.",
    items: classicTeachingItems,
  },
  {
    eyebrow: "Daily Walk",
    title: "Prayer & Daily Walk",
    intro:
      "Simple help for talking honestly with God and walking with Him one day at a time.",
    items: prayerItems,
  },
  {
    eyebrow: "Worship",
    title: "Safe Hymns & Simple Praise",
    intro:
      "Classic hymns and TheDJCares-reviewed music encouragement, labeled as music rather than doctrine.",
    items: worshipItems,
  },
  {
    eyebrow: "Family",
    title: "Family & Home",
    intro:
      "Official family ministry resources for marriage, parenting, legacy, Bible reading, and building a Christ-centered home.",
    items: familyAndHomeItems,
  },
  {
    eyebrow: "Encouragement",
    title: "Devotional Encouragement",
    intro:
      "Short readings that point back to Scripture, prayer, hope, and faithful daily living.",
    items: devotionalItems,
  },
];

function ResourceCard({ item }: { item: ResourceItem }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-lg shadow-black/20">
      <div className="flex flex-wrap items-center gap-2">
        {item.badge ? (
          <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">
            {item.badge}
          </span>
        ) : null}
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
          {item.type}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
      <p className="mt-1 text-sm font-medium text-sky-100/85">{item.source}</p>
      <p className="mt-3 flex-1 text-sm leading-6 text-white/75">{item.summary}</p>

      {item.href ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-100"
        >
          {item.action ?? "Open"}
        </a>
      ) : (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-white/60">
          Text-only card. No outside link added until a stable, legitimate source is verified.
        </div>
      )}
    </article>
  );
}

export default function TheDJCaresPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/70 p-6 shadow-2xl shadow-black/30 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
              TheDJCares
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Hand-picked encouragement that points back to Jesus.
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/78">
              Warm Gospel-first resources for hope, prayer, Scripture, worship, and daily faith.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-amber-200/20 bg-amber-200/10 p-5">
            <p className="text-base leading-7 text-amber-50">
              TheDJCares shares hand-picked encouragement, not blanket endorsements. Jesus is first,
              Scripture is the test, and every resource should point you back to God&apos;s Word,
              prayer, and real-life faith.
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-200/15 via-white/[0.06] to-sky-300/10 p-6 shadow-xl shadow-black/20 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-100">
                Featured Gospel Message
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Billy Graham in Seoul, South Korea
              </h2>
              <p className="mt-4 text-base leading-7 text-white/75">
                Billy Graham&apos;s 1973 Seoul Crusade is one of the clearest public examples of Gospel-first preaching reaching millions. Start here: Jesus, repentance, faith, and peace with God.
              </p>
              <a
                href="https://www.youtube.com/watch?v=PQDLjd57vdE"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-100"
              >
                Watch on official BGEA YouTube
              </a>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-lg shadow-black/30">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/PQDLjd57vdE"
                  title="Seoul, South Korea: Billy Graham's Largest Ever Crusade"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-amber-100">Why it is featured</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Not noise. Not a random upload. Official BGEA Gospel preaching that points plainly to Jesus.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
            <p className="text-sm font-semibold text-sky-100">Jesus first</p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Every teaching resource should move attention toward Christ, not personality.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
            <p className="text-sm font-semibold text-sky-100">Scripture tested</p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Encouragement should send people back to the Bible, prayer, repentance, and hope.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
            <p className="text-sm font-semibold text-sky-100">Music is music</p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Music playlists may encourage worship, but they are not doctrine or teaching.
            </p>
          </div>
        </section>

        {resourceSections.map((section) => (
          <section key={section.title} className="mt-12">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-200">
                {section.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">{section.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">{section.intro}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => (
                <ResourceCard key={`${section.title}-${item.title}-${item.href ?? "text"}`} item={item} />
              ))}
            </div>
          </section>
        ))}

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 text-center sm:p-8">
          <p className="text-xl font-semibold text-white">✝ Cross ❤️ Heart 🙏 Pray</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/65">
            Start with Jesus. Open the Bible. Pray honestly. Walk it out today.
          </p>
        </section>
      </div>
    </main>
  );
}
