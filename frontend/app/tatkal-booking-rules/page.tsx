import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { LastUpdated } from "@/components/LastUpdated";
import { RouteLineDivider } from "@/components/RouteLineDivider";

const SITE_URL = "https://trackmypnr.co.in";
const OG_IMAGE = `${SITE_URL}/og-default.png`;
const PAGE_URL = `${SITE_URL}/tatkal-booking-rules`;

export const metadata: Metadata = {
  title: "Tatkal & Premium Tatkal Booking Rules: Timings, Quota & Refund",
  description:
    "Complete guide to Indian Railways Tatkal and Premium Tatkal booking rules — opening timings (10 AM AC / 11 AM Non-AC), TQWL confirmation odds, and cancellation charges.",
  alternates: { canonical: "/tatkal-booking-rules" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Tatkal Booking Rules & Timings — trackmypnr",
    description: "Opening timings (10 AM AC / 11 AM Non-AC), quota rules, and TQWL confirmation odds.",
    url: "/tatkal-booking-rules",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Tatkal Booking Rules" }],
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
    { "@type": "ListItem", position: 2, name: "Tatkal Booking Rules", item: PAGE_URL },
  ],
};

export default function TatkalRulesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
            Tatkal Booking Rules
          </li>
        </ol>
      </nav>

      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Tatkal &amp; Premium Tatkal Booking Rules
      </h1>
      <div className="mt-3">
        <LastUpdated date="2026-08-01" />
      </div>

      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        Tatkal quota provides urgent train reservations for passengers booking one day prior to the
        train&apos;s departure from its originating station.
      </p>

      <RouteLineDivider className="my-8" />

      <h2 className="font-display text-2xl font-bold text-ink">Tatkal Opening Timings</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-display text-lg font-bold text-ink">AC Classes (1A, 2A, 3A, CC)</h3>
          <p className="mt-2 text-2xl font-bold text-brand">10:00 AM IST</p>
          <p className="mt-1.5 text-sm text-ink-muted">Opens 1 day prior to train origin date.</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-display text-lg font-bold text-ink">Non-AC Classes (SL, 2S, FC)</h3>
          <p className="mt-2 text-2xl font-bold text-brand">11:00 AM IST</p>
          <p className="mt-1.5 text-sm text-ink-muted">Opens 1 day prior to train origin date.</p>
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">Tatkal Waitlist (TQWL) Confirmation Odds</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        TQWL (Tatkal Waitlist) has lower confirmation probability compared to General Waitlist (GNWL).
        Since Tatkal quota berths are limited, TQWL clears only if confirmed Tatkal passengers cancel.
      </p>

      <AdSlot slotId="tatkal-rules-mid-content" className="my-10" />

      <p className="text-sm text-ink-muted">
        Track your Tatkal status:{" "}
        <Link href="/" className="font-medium text-brand underline">
          Check Tatkal PNR Status
        </Link>{" "}
        ·{" "}
        <Link href="/waitlist-types" className="font-medium text-brand underline">
          Waitlist Types (GNWL vs TQWL)
        </Link>
      </p>
    </article>
  );
}
