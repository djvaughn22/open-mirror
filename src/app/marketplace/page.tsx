import type { Metadata } from "next";
import { RESTORE_DIRECTORIES } from "../../lib/marketplace/restore";
import { STUDIO } from "../../lib/products";

// Open Mirror Marketplace (owner direction, Nov 26-27 2026): a place for
// established independent businesses to buy, sell, find and restore. It's a
// foundation tonight. Only true, useful things are public: no merchants are
// listed, nothing is for sale here, no checkout, no payment custody, no fees.
// Each door says plainly what it does today. The private demonstration with
// fictional merchants lives outside this repository.

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Buy, sell, find and restore exceptional things with independent businesses. Open Mirror connects people; merchants handle their own sales.",
  alternates: { canonical: "/marketplace" },
};

const mail = (subject: string, body: string) =>
  `mailto:${STUDIO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const SELL_BODY = "What is it?\n\nAbout how old is it, and what condition is it in?\n\nWhere are you (city and state)?\n\n";
const FIND_BODY = "What are you looking for?\n\nAny details that matter (maker, era, size, condition)?\n\nWhere are you (city and state)?\n\n";
const BIZ_BODY = "Your business name and website:\n\nWhat you sell or make:\n\nWhat you'd like help with:\n\n";

export default function MarketplacePage() {
  return (
    <main className="mp-page">
      <header className="mp-head">
        <h1 className="mp-title">Marketplace</h1>
        <p className="mp-lede">Buy. Sell. Find. Restore.</p>
        <p className="mp-note">
          Just opening. No merchants are listed yet, and nothing is sold on this page. Participating businesses will handle their own sales,
          shipping and returns.
        </p>
      </header>

      <section id="buy" className="mp-door" aria-labelledby="buy-h">
        <h2 id="buy-h">Buy</h2>
        <p>Exceptional items from participating merchants.</p>
        <p className="mp-status">No merchants are listed yet.</p>
      </section>

      <section id="sell" className="mp-door" aria-labelledby="sell-h">
        <h2 id="sell-h">Sell</h2>
        <p>Have something special, like a watch, a clock, an heirloom or a collection? Tell us what it is. Email the owner for more details.</p>
        <p><a className="mp-mail" href={mail("Marketplace: sell", SELL_BODY)}>Write about what you have</a></p>
      </section>

      <section id="find" className="mp-door" aria-labelledby="find-h">
        <h2 id="find-h">Find</h2>
        <p>Looking for something hard to find? Describe it. Email the owner for more details.</p>
        <p><a className="mp-mail" href={mail("Marketplace: find", FIND_BODY)}>Describe what you&apos;re looking for</a></p>
      </section>

      <section id="restore" className="mp-door" aria-labelledby="restore-h">
        <h2 id="restore-h">Restore</h2>
        <p>Experienced craftspeople list themselves in their professional associations&apos; directories. Start there:</p>
        <ul className="mp-list">
          {RESTORE_DIRECTORIES.map((d) => (
            <li key={d.id}>
              <span className="mp-what">{d.what}:</span>{" "}
              <a href={d.url} target="_blank" rel="noopener noreferrer">{d.title}</a> <span className="mp-by">({d.by})</span>
            </li>
          ))}
        </ul>
        <p className="mp-small">These are independent associations. Open Mirror isn&apos;t affiliated with them, earns nothing from them, and doesn&apos;t vouch for anyone they list.</p>
      </section>

      <section className="mp-door" aria-labelledby="biz-h">
        <h2 id="biz-h">Run an independent business?</h2>
        <p>If you buy, sell or restore and want to talk about working together, email the owner for more details.</p>
        <p><a className="mp-mail" href={mail("Marketplace: business", BIZ_BODY)}>{STUDIO.email}</a></p>
      </section>

      <p className="mp-small">
        Emails go to Open Mirror only, from your own email app. Nothing you write here is stored on this site. Open Mirror doesn&apos;t appraise,
        authenticate, hold or ship items.
      </p>
    </main>
  );
}
