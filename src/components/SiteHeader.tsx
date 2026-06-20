import VisualThemePicker from "./VisualThemePicker";

type SiteHeaderProps = {
  className?: string;
};

const menuLinks = [
  { href: "/", label: "Welcome" },
  { href: "/home", label: "Home" },
  { href: "/cross", label: "Cross" },
  { href: "/heart", label: "Heart" },
  { href: "/pray", label: "Pray" },
  { href: "/explorebible", label: "Bible Bingo" },
  { href: "/daily-hope", label: "Daily Hope" },
  {
    href: "/resources/52-week-bible-reading-plan.pdf",
    label: "Bible Reading Plan",
    external: true,
  },
  { href: "/about", label: "About" },
];

export default function SiteHeader({ className = "mb-16" }: SiteHeaderProps) {
  return (
    <nav className={`${className} grid grid-cols-3 items-center`}>
      <a
        href="/"
        aria-label="Open CrossHeartPray Welcome"
        className="justify-self-start font-bold text-slate-100"
      >
        CrossHeartPray
      </a>

      <a
        href="https://www.bible.com/verse-of-the-day"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open YouVersion Bible App"
        className="justify-self-center"
      >
        <img
          src="/brand/youversion-bible-app.png"
          alt="Holy Bible"
          className="h-10 w-10 rounded-lg"
        />
      </a>

      <details className="relative justify-self-end text-right">
        <summary
          aria-label="Open menu"
          className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl font-semibold leading-none text-slate-100 transition hover:bg-white/15 [&::-webkit-details-marker]:hidden"
        >
          <span aria-hidden="true">☰</span>
        </summary>

        <div className="absolute right-0 z-50 mt-4 flex w-72 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 text-right text-sm font-semibold text-slate-100 shadow-2xl">
          <VisualThemePicker />

          {menuLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="transition hover:text-emerald-100"
            >
              {link.label}
            </a>
          ))}
        </div>
      </details>
    </nav>
  );
}
