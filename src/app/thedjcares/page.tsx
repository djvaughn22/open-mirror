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
    title: "Jesus Calls You by Name",
    source: "Billy Graham Classics",
    type: "Sermon",
    summary:
      "A clear invitation to lay down what keeps you from Christ and come to Jesus personally.",
    href: "https://billygraham.org/classics",
    action: "Open",
    badge: "Classic",
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
  {
    title: "The Holy Spirit and You",
    source: "Billy Graham Classics",
    type: "Sermon",
    summary:
      "A classic message about the Helper Jesus promised and the daily life of faith.",
    href: "https://billygraham.org/classics",
    action: "Open",
    badge: "Faith",
  },
];

const classicTeachingItems: ResourceItem[] = [
  {
    title: "Love Worth Finding",
    source: "Adrian Rogers",
    type: "Sermon",
    summary:
      "Straightforward Bible teaching centered on Jesus, Scripture, assurance, obedience, and trusting God.",
    href: "https://www.lwf.org/",
    action: "Open",
    badge: "Classic",
  },
  {
    title: "Assurance of Salvation",
    source: "Love Worth Finding",
    type: "Teaching",
    summary:
      "A clear Gospel-centered explanation of receiving Christ by faith and resting in His finished work.",
    href: "https://www.lwf.org/discover-jesus/assurance-of-salvation",
    action: "Read",
    badge: "Assurance",
  },
  {
    title: "Biblical Faith",
    source: "Love Worth Finding",
    type: "Sermon",
    summary:
      "Encouragement to put faith in the right object: Jesus Christ and the Word of God.",
    href: "https://www.lwf.org/sermons/video/biblical-faith-what-it-is-and-how-to-have-it-1749",
    action: "Watch",
    badge: "Bible",
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
