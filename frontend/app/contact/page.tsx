import type { Metadata } from "next";
import Link from "next/link";
import { Mail, HelpCircle, ShieldCheck } from "lucide-react";
import { RouteLineDivider } from "@/components/RouteLineDivider";

const SITE_URL = "https://trackmypnr.co.in";
const OG_IMAGE = `${SITE_URL}/og-default.png`;
const PAGE_URL = `${SITE_URL}/contact`;

export const metadata: Metadata = {
  title: "Contact Us — trackmypnr",
  description:
    "Have a question, feedback, or need assistance? Reach out to the trackmypnr team or check our frequently asked questions.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Contact Us — trackmypnr",
    description: "Get in touch with the trackmypnr team for feedback, questions, or support.",
    url: "/contact",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Contact trackmypnr" }],
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
    { "@type": "ListItem", position: 2, name: "Contact Us", item: PAGE_URL },
  ],
};

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact trackmypnr",
  url: PAGE_URL,
  description: "Contact and support page for trackmypnr.",
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
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
            Contact Us
          </li>
        </ol>
      </nav>

      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Contact &amp; Support
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        We value your feedback and strive to maintain the fastest, most reliable Indian Railway PNR
        status checker. If you have questions, suggestions, or technical feedback, feel free to
        connect with us.
      </p>

      <RouteLineDivider className="my-8" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-base font-semibold text-ink">Support &amp; Inquiries</h2>
          <p className="mt-1.5 text-sm text-ink-muted">
            For technical feedback, bug reports, or general inquiries, email us at:
          </p>
          <p className="mt-3 text-sm font-semibold text-brand">
            support@trackmypnr.co.in
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand">
            <HelpCircle className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-base font-semibold text-ink">Frequently Asked Questions</h2>
          <p className="mt-1.5 text-sm text-ink-muted">
            Looking for quick answers about chart preparation, TDR rules, or RAC confirmation?
          </p>
          <Link
            href="/faq"
            className="mt-3 inline-block text-sm font-semibold text-brand underline"
          >
            Visit our FAQ Page →
          </Link>
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">Looking for Official Support?</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Please note that trackmypnr is an independent status checking service and cannot modify,
        cancel, or refund railway tickets directly. For official booking changes, e-ticket
        cancellations, or official complaints, please contact Indian Railways or IRCTC directly:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-ink-muted">
        <li>
          <strong>IRCTC Official Customer Care:</strong> 14646 / 0755-6610610 / 0755-4090600
        </li>
        <li>
          <strong>RailMadad Passenger Helpline:</strong> 139
        </li>
        <li>
          <strong>Official Web Portals:</strong> irctc.co.in / indianrail.gov.in
        </li>
      </ul>

      <RouteLineDivider className="my-10" />

      <p className="text-sm text-ink-muted">
        Related links:{" "}
        <Link href="/about" className="font-medium text-brand underline">
          About Us
        </Link>{" "}
        ·{" "}
        <Link href="/privacy-policy" className="font-medium text-brand underline">
          Privacy Policy
        </Link>{" "}
        ·{" "}
        <Link href="/terms" className="font-medium text-brand underline">
          Terms of Service
        </Link>
      </p>
    </article>
  );
}
