import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface" role="contentinfo">
      <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-base font-bold text-ink">trackmypnr</p>
            <p className="mt-2 text-sm text-ink-muted">
              Fast, clear PNR status checks with an honest confirmation-probability estimate —
              no clutter, no guesswork.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="text-sm font-semibold text-ink">Guides</p>
            <ul className="mt-2 space-y-2 text-sm text-ink-muted">
              <li>
                <Link href="/pnr-status-guide" className="hover:text-brand">
                  PNR Status Guide
                </Link>
              </li>
              <li>
                <Link href="/waitlist-types" className="hover:text-brand">
                  Waitlist Types
                </Link>
              </li>
              <li>
                <Link href="/travel-classes" className="hover:text-brand">
                  Travel Classes
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand">
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <p className="text-sm font-semibold text-ink">Legal</p>
            <ul className="mt-2 space-y-2 text-sm text-ink-muted">
              <li>
                <Link href="/privacy-policy" className="hover:text-brand">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="route-line-h my-8" />

        <p className="text-xs leading-relaxed text-ink-muted">
          trackmypnr is an independent service and is <strong>not affiliated with, endorsed by,
          or connected to Indian Railways, IRCTC, or any government body</strong>. PNR data is
          sourced from a third-party API and is provided for informational convenience only —
          always verify critical travel decisions against official IRCTC channels.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} trackmypnr. All rights reserved.</p>
          <p className="font-medium text-ink">Developed by Vishal Kumar Chaurasia ❤️</p>
        </div>
      </div>
    </footer>
  );
}
