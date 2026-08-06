import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { LastUpdated } from "@/components/LastUpdated";
import { RouteLineDivider } from "@/components/RouteLineDivider";

const SITE_URL = "https://trackmypnr.co.in";
const OG_IMAGE = `${SITE_URL}/og-default.png`;
const PAGE_URL = `${SITE_URL}/chart-preparation-guide`;

export const metadata: Metadata = {
  title: "Chart Preparation Timings & Rules — First vs Second Charting",
  description:
    "Learn when Indian Railways chart preparation happens: 1st chart timings (4 hours before departure), 2nd chart rules (30 mins before departure), and night train charting rules.",
  alternates: { canonical: "/chart-preparation-guide" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Chart Preparation Timings & Rules — trackmypnr",
    description: "First chart (4 hours before) vs Second chart (30 mins before) timings explained.",
    url: "/chart-preparation-guide",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Chart Preparation Guide" }],
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
    { "@type": "ListItem", position: 2, name: "Chart Preparation Guide", item: PAGE_URL },
  ],
};

const chartFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "When is the first chart prepared for Indian Railways trains?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The first reservation chart is prepared 4 hours prior to the train's scheduled departure from its originating station.",
      },
    },
    {
      "@type": "Question",
      name: "When is the second chart prepared?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The second chart is finalized 30 minutes before departure, accounting for current counter bookings and last-minute cancellations.",
      },
    },
  ],
};

export default function ChartPreparationPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chartFaqJsonLd) }}
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
            Chart Preparation Guide
          </li>
        </ol>
      </nav>

      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Chart Preparation Timings &amp; Rules Explained
      </h1>
      <div className="mt-3">
        <LastUpdated date="2026-08-01" />
      </div>

      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        Reservation chart preparation is the final administrative process where Indian Railways
        locks in berth allocations, upgrades waitlisted passengers, and publishes passenger lists
        for train conductors and station boards.
      </p>

      <RouteLineDivider className="my-8" />

      <h2 className="font-display text-2xl font-bold text-ink">First Chart vs. Second Chart Timings</h2>
      <div className="mt-6 space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-display text-lg font-bold text-ink">1. First Reservation Chart (4 Hours Prior)</h3>
          <p className="mt-2 leading-relaxed text-ink-muted">
            The 1st chart is prepared at least <strong>4 hours before scheduled departure</strong> from the train&apos;s originating station. For morning trains departing before 11:00 AM, the first chart is generated the previous evening by 8:00 PM.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-display text-lg font-bold text-ink">2. Second Reservation Chart (30 Mins Prior)</h3>
          <p className="mt-2 leading-relaxed text-ink-muted">
            The 2nd chart is generated <strong>30 to 45 minutes before departure</strong>. This accounts for last-minute current reservation bookings made online or at station counters after the 1st chart release.
          </p>
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">What Happens After Chart Preparation?</h2>
      <ul className="mt-4 list-disc space-y-3 pl-6 leading-relaxed text-ink-muted">
        <li>
          <strong>Status Freeze:</strong> Your PNR status becomes final. No further automatic waitlist movements occur.
        </li>
        <li>
          <strong>E-ticket Auto-cancellation:</strong> Fully waitlisted e-tickets are automatically cancelled and refunded.
        </li>
        <li>
          <strong>Current Booking Opens:</strong> Unsold vacant berths are made available for booking via Current Reservation until 30 minutes before departure.
        </li>
      </ul>

      <AdSlot slotId="chart-prep-mid-content" className="my-10" />

      <p className="text-sm text-ink-muted">
        Check if your train chart is prepared:{" "}
        <Link href="/" className="font-medium text-brand underline">
          Check PNR Status Now
        </Link>{" "}
        ·{" "}
        <Link href="/rac-ticket-rules" className="font-medium text-brand underline">
          RAC Ticket Rules
        </Link>
      </p>
    </article>
  );
}
