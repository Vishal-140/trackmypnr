import type { Metadata } from "next";
import Link from "next/link";
import { TrainFront, Gauge, Lock } from "lucide-react";
import { RouteLineDivider } from "@/components/RouteLineDivider";

const SITE_URL = "https://trackmypnr.co.in";
const OG_IMAGE = `${SITE_URL}/og-default.png`;
const PAGE_URL = `${SITE_URL}/about`;

export const metadata: Metadata = {
  title: "About Us — Independent Indian Railways PNR Checker",
  description:
    "Learn about trackmypnr — an independent, fast, clutter-free PNR status checker built to provide clear waitlist confirmation probability estimates without storing personal data.",
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "About Us — trackmypnr",
    description:
      "An independent, fast, clutter-free PNR status checker with clear waitlist confirmation probability estimates.",
    url: "/about",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "About trackmypnr" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "About Us", item: PAGE_URL },
  ],
};

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About trackmypnr",
  description:
    "trackmypnr is an independent tool for checking Indian Railways PNR status and waitlist confirmation probability.",
  url: PAGE_URL,
  publisher: {
    "@type": "Organization",
    name: "trackmypnr",
    url: SITE_URL,
  },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-muted">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="text-ink">
            About Us
          </li>
        </ol>
      </nav>

      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
        <TrainFront className="h-3.5 w-3.5" aria-hidden="true" />
        Independent Railway Utility
      </span>

      <h1 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">
        About trackmypnr
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        trackmypnr was built with a simple goal: to provide Indian Railways passengers with a fast,
        clean, clutter-free PNR status checking experience — alongside honest, data-driven
        confirmation probability estimates for waitlisted and RAC tickets.
      </p>

      <RouteLineDivider className="my-8" />

      <h2 className="font-display text-2xl font-bold text-ink">Why We Created trackmypnr</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Checking a PNR status should take seconds, not minutes. Most travel apps require mandatory
        account creation, mobile phone verification, or force users to navigate through heavy ad
        popups and hotel promotions just to check if their berth is confirmed.
      </p>
      <p className="mt-3 leading-relaxed text-ink-muted">
        We designed trackmypnr to remove every unnecessary step. There are no mandatory logins,
        no hidden fees, and no aggressive data collection. You enter a 10-digit PNR number, and
        you get instant results.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand">
            <Gauge className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="mt-4 font-display text-base font-semibold text-ink">
            Confirmation Odds
          </h3>
          <p className="mt-1.5 text-sm text-ink-muted">
            Rather than just showing a raw status label like GNWL 24, our probability heuristic
            calculates realistic odds based on quota type, days to journey, and historical trends.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="mt-4 font-display text-base font-semibold text-ink">
            Privacy First
          </h3>
          <p className="mt-1.5 text-sm text-ink-muted">
            A one-off status check queries live data directly without saving anything to our database.
            Your PNR is only stored locally on your device if you explicitly choose to save it.
          </p>
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">Our Technical Standards</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Built on Next.js and deployed on Vercel&apos;s global edge network, trackmypnr prioritizes
        sub-second response times, zero layout shifts (Core Web Vitals optimized), and strict
        accessibility adherence for screen reader navigation.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">Independent Disclaimer</h2>
      <div className="mt-4 rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm leading-relaxed text-ink-muted">
          trackmypnr is an independent web application and is <strong>not affiliated with,
          endorsed by, or connected to Indian Railways, IRCTC (Indian Railway Catering and
          Tourism Corporation), or the Ministry of Railways</strong>. All PNR status data is
          sourced via secure third-party APIs for informational convenience only. Passengers are
          encouraged to verify critical travel decisions against official IRCTC portals.
        </p>
      </div>

      <RouteLineDivider className="my-10" />

      <p className="text-sm text-ink-muted">
        Explore more:{" "}
        <Link href="/pnr-status-guide" className="font-medium text-brand underline">
          PNR Status Guide
        </Link>{" "}
        ·{" "}
        <Link href="/faq" className="font-medium text-brand underline">
          FAQ
        </Link>{" "}
        ·{" "}
        <Link href="/contact" className="font-medium text-brand underline">
          Contact Us
        </Link>
      </p>
    </article>
  );
}
