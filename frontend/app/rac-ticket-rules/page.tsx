import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { LastUpdated } from "@/components/LastUpdated";
import { RouteLineDivider } from "@/components/RouteLineDivider";

const SITE_URL = "https://trackmypnr.co.in";
const OG_IMAGE = `${SITE_URL}/og-default.png`;
const PAGE_URL = `${SITE_URL}/rac-ticket-rules`;

export const metadata: Metadata = {
  title: "RAC Ticket Rules Explained: Berth Sharing, Confirmation & Upgrades",
  description:
    "Everything about Indian Railways RAC (Reservation Against Cancellation) tickets — side lower berth sharing rules, confirmation odds before chart preparation, and boarding rights.",
  alternates: { canonical: "/rac-ticket-rules" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "RAC Ticket Rules Explained — trackmypnr",
    description:
      "RAC berth sharing rules, confirmation probability, and boarding rights explained.",
    url: "/rac-ticket-rules",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "RAC Ticket Rules" }],
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
    { "@type": "ListItem", position: 2, name: "RAC Ticket Rules", item: PAGE_URL },
  ],
};

const racFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I travel with an RAC ticket?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. An RAC ticket guarantees you boarding rights and a sitting berth (shared Side Lower berth) on the train.",
      },
    },
    {
      "@type": "Question",
      name: "How does RAC upgrade to full CNF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When confirmed passengers cancel their tickets prior to chart preparation, RAC ticket holders are upgraded in numerical order to full berths.",
      },
    },
  ],
};

export default function RacRulesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(racFaqJsonLd) }}
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
            RAC Ticket Rules
          </li>
        </ol>
      </nav>

      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        RAC Ticket Rules: Berth Sharing, Confirmation &amp; Upgrades
      </h1>
      <div className="mt-3">
        <LastUpdated date="2026-08-01" />
      </div>

      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        RAC stands for <strong>Reservation Against Cancellation</strong>. Unlike a waitlisted ticket,
        an RAC ticket guarantees that you can legally board the train and travel to your destination —
        with a sitting berth allocated on a Side Lower seat shared between two passengers.
      </p>

      <RouteLineDivider className="my-8" />

      <h2 className="font-display text-2xl font-bold text-ink">What Does RAC Actually Mean?</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        When all confirmed berths on a train are sold out, Indian Railways issues RAC tickets before
        moving bookings into the waitlist pool. Two RAC passengers share a single Side Lower berth
        for sitting space during the journey. If confirmed passengers cancel their tickets prior to departure,
        RAC passengers get upgraded to full individual berths in sequential order.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">Key RAC Rules Every Passenger Should Know</h2>
      <ul className="mt-4 list-disc space-y-3 pl-6 leading-relaxed text-ink-muted">
        <li>
          <strong>Guaranteed Boarding Rights:</strong> RAC ticket holders are permitted to board the
          train for both online e-tickets and counter tickets.
        </li>
        <li>
          <strong>Berth Allocation:</strong> RAC berths are restricted to <strong>Side Lower (SL)</strong> seats in Sleeper and AC classes (3A, 2A, CC).
        </li>
        <li>
          <strong>Automatic Upgrade to CNF:</strong> As cancellations occur, RAC 1 becomes CNF, RAC 2 becomes RAC 1, and so forth.
        </li>
        <li>
          <strong>TTE Berth Re-allocation:</strong> If a confirmed passenger fails to show up by the third station after departure, the Travelling Ticket Examiner (TTE) can allocate that vacant berth to the highest-ranking RAC passenger on board.
        </li>
      </ul>

      <AdSlot slotId="rac-rules-mid-content" className="my-10" />

      <h2 className="mt-2 font-display text-2xl font-bold text-ink">RAC Confirmation Probability</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        RAC status carries a very high probability of upgrading to a full confirmed berth before chart
        preparation — typically <strong>75% to 95% chance</strong> depending on the train route and season.
      </p>
      <p className="mt-3 leading-relaxed text-ink-muted">
        You can check live RAC updates and confirmation odds anytime using our{" "}
        <Link href="/" className="font-medium text-brand underline">
          PNR status checker
        </Link>
        .
      </p>

      <RouteLineDivider className="my-10" />

      <p className="text-sm text-ink-muted">
        Related reading:{" "}
        <Link href="/pnr-status-guide" className="font-medium text-brand underline">
          PNR Status Guide
        </Link>{" "}
        ·{" "}
        <Link href="/waitlist-types" className="font-medium text-brand underline">
          Waitlist Types Explained
        </Link>{" "}
        ·{" "}
        <Link href="/faq" className="font-medium text-brand underline">
          FAQ
        </Link>
      </p>
    </article>
  );
}
