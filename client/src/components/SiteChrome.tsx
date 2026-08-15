/** Himalayan Letterpress: compact information architecture around the focused listening room. */
import { Link } from "wouter";
import { siteConfig } from "@/lib/siteConfig";

export function SiteHeader() {
  return (
    <header className="masthead">
      <Link className="brand-lockup" href="/" aria-label="Sangeet Ghar, return to listening room">
        <img className="brand-mark" src={siteConfig.logo} alt="" />
        <span className="brand-type"><span className="brand-heritage" lang="ne" aria-hidden="true">संगीत</span><span className="brand-nepali">संगीत घर</span><span className="brand-english">SANGEET GHAR</span></span>
      </Link>
      <nav className="masthead-nav" aria-label="Sangeet Ghar information">
        <Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link>
      </nav>
      <div className="masthead-meta" aria-label="Listening room availability"><span className="live-dot" aria-hidden="true" /><span>Listening from Nepal</span></div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <p>नेपाल · Music · Memories</p><p>Made for listeners everywhere.</p>
      <div className="footer-links"><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></div>
      <p className="footer-disclosure">Music plays through YouTube’s embedded player; no audio is hosted by Sangeet Ghar.</p><span>© 2026 Sangeet Ghar</span>
    </footer>
  );
}
