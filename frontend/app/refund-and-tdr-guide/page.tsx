import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { LastUpdated } from "@/components/LastUpdated";
import { RouteLineDivider } from "@/components/RouteLineDivider";

const SITE_URL = "https://trackmypnr.co.in";
const OG_IMAGE = `${SITE_URL}/og-default.png`;
const PAGE_URL = `${SITE_URL}/refund-and-tdr-guide`;

export const metadata: Metadata = {
  title: "IRCTC Refund Rules & TDR Filing Guide: Timelines & Deductions",
  description:
    "Complete guide to Indian Railways ticket refund rules, automatic waitlist refunds, TDR filing procedures, clerkage charges, and refund status tracking.",
  alternates: { canonical: "/refund-and-tdr-guide" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "IRCTC Refund Rules & TDR Filing Guide — trackmypnr",
    description: "Automatic e-ticket refunds, TDR filing steps, and cancellation charges explained.",
    url: "/refund-and-tdr-guide",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "IRCTC Refund & TDR Guide" }],
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
    { "@type": "ListItem", position: 2, name: "Refund & TDR Guide", item: PAGE_URL },
  ],
};

export default function RefundTdrPage() {
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
            Refund &amp; TDR Guide
          </li>
        </ol>
      </nav>

      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        IRCTC Ticket Refund Rules &amp; TDR Filing Guide
      </h1>
      <div className="mt-3">
        <LastUpdated date="2026-08-01" />
      </div>

      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        Understanding Indian Railways refund policies ensures you get your money back promptly if
        your ticket remains waitlisted or if you cancel your journey.
      </p>

      <RouteLineDivider className="my-8" />

      <h2 className="font-display text-2xl font-bold text-ink">Automatic Waitlist Refunds</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        For online e-tickets booked via IRCTC, if your PNR remains fully waitlisted after chart
        preparation, Indian Railways automatically cancels the ticket. The fare is refunded back to
        your original payment source within <strong>3 to 5 business days</strong> after deducting a minor clerkage charge (₹60 per passenger).
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">When Do You Need to File a TDR?</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        A Ticket Deposit Receipt (TDR) must be filed through IRCTC in the following scenarios:
      </p>
      <ul className="mt-4 list-disc space-y-3 pl-6 leading-relaxed text-ink-muted">
        <li>
          <strong>Partially Confirmed Group Ticket:</strong> When some passengers are confirmed and others are waitlisted, and all passengers choose not to travel.
        </li>
        <li>
          <strong>Train Delayed by &gt; 3 Hours:</strong> When your train is running delayed by over 3 hours and you decide not to travel.
        </li>
        <li>
          <strong>AC Failure:</strong> When AC equipment fails in AC class coaches during the journey.
        </li>
      </ul>

      <AdSlot slotId="refund-tdr-mid-content" className="my-10" />

      <p className="text-sm text-ink-muted">
        Related links:{" "}
        <Link href="/faq" className="font-medium text-brand underline">
          FAQ
        </Link>{" "}
        ·{" "}
        <Link href="/chart-preparation-guide" className="font-medium text-brand underline">
          Chart Preparation Timings
        </Link>
      </p>
    </article>
  );
}
