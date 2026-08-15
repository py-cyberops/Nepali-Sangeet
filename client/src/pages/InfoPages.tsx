/** Himalayan Letterpress: editorially quiet public pages for context, privacy, and rights contact. */
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { siteConfig } from "@/lib/siteConfig";

type PageLayoutProps = { eyebrow: string; nepaliLabel: string; title: string; children: React.ReactNode };

function PageLayout({ eyebrow, nepaliLabel, title, children }: PageLayoutProps) {
  return (
    <div className="site-shell info-shell">
      <div className="paper-grain" aria-hidden="true" />
      <SiteHeader />
      <main className="info-main">
        <header className="info-heading"><p className="eyebrow">{eyebrow}</p><p className="info-nepali-label" lang="ne">{nepaliLabel}</p><h1>{title}</h1></header>
        <article className="info-article">{children}</article>
      </main>
      <SiteFooter />
    </div>
  );
}

export function AboutPage() {
  const description = "Learn about Sangeet Ghar, a digital listening room for timeless Nepali classical, traditional, and classic music.";
  return (
    <PageLayout eyebrow="About the room" nepaliLabel="हाम्रो संगीत" title="A small place for Nepali music to stay close.">
      <PageMeta title="About Sangeet Ghar — Timeless Nepali Music" description={description} path="/about" />
      <p className="info-lede">Sangeet Ghar is a digital listening room for timeless Nepali classical, traditional, and classic music, created to help listeners in Nepal and around the world reconnect with the sound and culture of Nepal.</p>
      <section><h2>Not a catalog. A listening room.</h2><p>Some music belongs beside the workday, in a family living room, beneath conversation, or on a quiet evening far from home. Sangeet Ghar is deliberately built around that feeling. There is no search, no queue to manage, and no pressure to choose perfectly. The collection moves quietly, one considered song at a time.</p></section>
      <section><h2>From Nepal, for listeners everywhere.</h2><p>The room is Nepali in its character and global in its welcome. English offers a clear way in; Devanagari keeps the identity close to home. Whether you know the songs by heart or are discovering Nepali music for the first time, the purpose remains the same: open the room, and let the music play.</p></section>
      <p className="quiet-link"><Link href="/">Return to the listening room →</Link></p>
    </PageLayout>
  );
}

export function PrivacyPage() {
  const description = "Read the Sangeet Ghar privacy information covering website operation, anonymous shared-listening presence, embedded YouTube playback, and contact.";
  return (
    <PageLayout eyebrow="Privacy" nepaliLabel="गोपनीयता" title="A quiet note for anyone entering the room.">
      <PageMeta title="Privacy — Sangeet Ghar" description={description} path="/privacy" />
      <p className="info-lede">Sangeet Ghar is designed to be a lightweight listening room. This notice explains the services that may process information when you visit or play music.</p>
      <section><h2>Keeping the room open</h2><p>Our hosting environment processes the technical information necessary to deliver the website, such as requests to load pages and assets. We do not ask visitors to create an account, and the website does not provide a public comment or review system.</p></section>
      <section><h2>Embedded YouTube playback</h2><p>Music is played through YouTube’s embedded player using YouTube’s privacy-enhanced domain where available. When playback is initialized or used, YouTube may process information and use cookies or similar technologies under its own policies. Sangeet Ghar does not host, download, proxy, or redistribute the embedded audio.</p></section>
      <section><h2>Shared listening presence</h2><p>When music is actively playing after a listener starts it, Sangeet Ghar may keep an anonymous, short-lived room token and its most recent heartbeat so the listening room can display an aggregated active-listener count. Where a hosting provider supplies a trusted country header, we may aggregate activity at country level only when sufficient listeners are present. We do not collect names, email addresses, account IDs, raw IP addresses, precise locations, or location history for this feature.</p></section>
      <section><h2>Storage and analytics</h2><p>The listening room does not use an account profile, advertising tracker, or behavioral profiling system. A first-party anonymous room token is kept only in the browser to avoid double-counting open tabs; the server stores only its one-way hash during the short presence lifetime. The embedded playback provider may maintain its own storage. If the hosting environment supplies privacy-preserving operational analytics, that processing is governed by the host’s service configuration.</p></section>
      <section><h2>Your choices and contact</h2><p>You can control cookies and site data through your browser settings. For a privacy question or a request concerning information associated with this website, contact <a href={`mailto:${siteConfig.generalEmail}`}>{siteConfig.generalEmail}</a>. Rights and embedded-content concerns should be sent to <a href={`mailto:${siteConfig.rightsEmail}`}>{siteConfig.rightsEmail}</a>.</p></section>
    </PageLayout>
  );
}

export function ContactPage() {
  const description = "Contact Sangeet Ghar for general inquiries, technical questions, collaborations, or rights and content concerns.";
  return (
    <PageLayout eyebrow="Contact & rights" nepaliLabel="सम्पर्क" title="A direct line to the room.">
      <PageMeta title="Contact Sangeet Ghar — Timeless Nepali Music" description={description} path="/contact" />
      <p className="info-lede">For an inquiry, technical question, partnership, feedback, or collaboration, contact Sangeet Ghar directly. For rights and content concerns, use the dedicated address below so the request reaches the correct team.</p>
      <section className="contact-grid">
        <div><p className="contact-label">General contact</p><a className="contact-address" href={`mailto:${siteConfig.generalEmail}`}>{siteConfig.generalEmail}</a><p>General inquiries, partnerships, feedback, technical questions, and website matters.</p></div>
        <div><p className="contact-label">Rights & content</p><a className="contact-address" href={`mailto:${siteConfig.rightsEmail}`}>{siteConfig.rightsEmail}</a><p>Copyright, music-rights, attribution, content-removal, and concerns about embedded music or artwork.</p></div>
      </section>
      <section><h2>For rights holders</h2><p>Sangeet Ghar provides a curated listening experience. Third-party embedded content remains hosted by the respective platform, and copyright remains with the respective rights holders. We do not claim ownership of music we do not own or licensing that has not been verified.</p><p>To help us review a rights or content request, please include your name or organization, the relevant music or content, the reason for the request, evidence of your rights or authorization where applicable, the action you are requesting, and reliable contact details.</p></section>
    </PageLayout>
  );
}
