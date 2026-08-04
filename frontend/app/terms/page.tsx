import type { Metadata } from "next";
import { LastUpdated } from "@/components/LastUpdated";

const OG_IMAGE = "https://trackmypnr.co.in/og-default.png";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of trackmypnr.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service | trackmypnr",
    description: "The terms governing your use of trackmypnr — the free, independent Indian Railways PNR status checker.",
    url: "/terms",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Terms of Service — trackmypnr" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Terms of Service</h1>
      <div className="mt-3">
        <LastUpdated date="2026-08-01" />
      </div>

      <p className="mt-6 leading-relaxed text-ink-muted">
        By using trackmypnr, you agree to the terms below. If you don&apos;t agree, please
        don&apos;t use the site.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">1. No Official Affiliation</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        trackmypnr is an independent, third-party service and is not affiliated with, endorsed
        by, or connected to Indian Railways, IRCTC, or any Indian government body. We source PNR
        data from a third-party API for informational convenience only.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">2. No Guarantee of Accuracy</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        We make a reasonable effort to display accurate, up-to-date PNR status information, but
        we cannot guarantee it reflects the official record at every moment — data comes from a
        third-party source and can lag behind IRCTC&apos;s own systems. The confirmation
        probability shown for waitlisted and RAC tickets is an estimate based on historical
        patterns, not a guarantee of outcome.{" "}
        <strong>
          Always verify critical travel decisions directly through official IRCTC channels
        </strong>{" "}
        before making non-refundable plans.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">3. Acceptable Use</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Don&apos;t use trackmypnr to attempt to overwhelm our systems, scrape data at scale,
        reverse-engineer the service, or check PNRs that don&apos;t belong to you for any
        improper purpose. We reserve the right to rate-limit or block access that we reasonably
        believe is abusive.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">4. No Liability for Missed Travel</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        We are not liable for any loss, missed travel, or expense arising from reliance on
        information displayed on this site, including inaccuracies in third-party data,
        confirmation probability estimates, or service downtime. Use trackmypnr as a convenience
        tool alongside, not instead of, official IRCTC sources.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">5. Advertising</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        The service is supported in part by advertising (Google AdSense), placed in defined
        locations that never interrupt the core PNR-checking flow. See our{" "}
        <a href="/privacy-policy" className="font-medium text-brand underline">
          Privacy Policy
        </a>{" "}
        for cookie and advertising details.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">6. Changes to the Service or Terms</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        We may update these terms or change, suspend, or discontinue any part of the service at
        any time. Continued use after changes are posted constitutes acceptance of the updated
        terms.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">7. Governing Law</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        These terms are governed by the laws of India, without regard to conflict-of-law
        principles.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">8. Contact</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        For questions about these terms, contact us at{" "}
        <a href="mailto:hello@trackmypnr.co.in" className="font-medium text-brand underline">
          hello@trackmypnr.co.in
        </a>
        .
      </p>
    </article>
  );
}
