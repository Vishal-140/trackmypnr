import type { Metadata } from "next";
import Link from "next/link";
import { LastUpdated } from "@/components/LastUpdated";

const OG_IMAGE = "https://trackmypnr.co.in/og-default.png";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How trackmypnr collects, uses, and protects your data, including cookie and advertising disclosures.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy | trackmypnr",
    description: "How trackmypnr collects, uses, and protects your data, including cookie and advertising disclosures.",
    url: "/privacy-policy",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Privacy Policy — trackmypnr" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Privacy Policy</h1>
      <div className="mt-3">
        <LastUpdated date="2026-08-01" />
      </div>

      <p className="mt-6 leading-relaxed text-ink-muted">
        This Privacy Policy explains what information trackmypnr (&ldquo;we&rdquo;,
        &ldquo;our&rdquo;) collects, how we use it, and the choices you have. trackmypnr is not
        affiliated with Indian Railways, IRCTC, or any government body.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">1. Information We Collect</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        <strong>PNR numbers you check:</strong> a one-off status check is processed to fetch and
        display your result and is not written to our database. It is held briefly in server
        memory (up to a few minutes) purely to speed up repeat checks of the same PNR, then
        discarded.
      </p>
      <p className="mt-3 leading-relaxed text-ink-muted">
        <strong>PNR numbers you save:</strong> if you tap &ldquo;Save this PNR&rdquo;, we store
        the PNR number, its status snapshots over time, and your journey date, associated with an
        anonymous session identifier (see below) — not with your name, email, or any other
        personal identifier, unless you separately provide one in a future version of the
        service.
      </p>
      <p className="mt-3 leading-relaxed text-ink-muted">
        <strong>Anonymous session identifier:</strong> on your first visit, we create an
        anonymous Firebase authentication session so your saved PNRs can be retrieved on return
        visits from the same browser. This identifier is a random string and is not linked to
        your real-world identity by us.
      </p>
      <p className="mt-3 leading-relaxed text-ink-muted">
        <strong>Usage and analytics data:</strong> standard, non-identifying analytics (page
        views, approximate location by IP region, device type) via Google Analytics, to
        understand site usage and improve the service.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">2. Cookies & Advertising</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        We use essential cookies required for the site to function (such as your anonymous
        session). With your consent via the cookie banner shown on your first visit, we also use
        cookies from <strong>Google AdSense</strong>, which may use the DoubleClick cookie to
        serve ads based on your visits to this and other websites. You can decline non-essential
        cookies at any time from the consent banner, and you can opt out of personalized
        advertising generally through{" "}
        <a
          href="https://adssettings.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand underline"
        >
          Google Ads Settings
        </a>
        , or view industry-wide opt-out options via the{" "}
        <a
          href="https://www.aboutads.info/choices/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand underline"
        >
          Digital Advertising Alliance
        </a>
        .
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">3. Third-Party Services</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed text-ink-muted">
        <li>
          <strong>PNR data provider:</strong> we query a third-party railway data API to fetch
          your PNR status. We don&apos;t control that provider&apos;s own data handling beyond
          the request we make.
        </li>
        <li>
          <strong>Firebase (Google):</strong> used for anonymous authentication and to store
          saved PNRs, secured with access rules that restrict each saved PNR to the session that
          created it.
        </li>
        <li>
          <strong>Google AdSense &amp; Google Analytics:</strong> used for advertising (post
          consent) and aggregate usage analytics, as described above.
        </li>
      </ul>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">4. Data Retention</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Saved PNRs and their history remain stored until you remove them from your dashboard, or
        indefinitely if left in place — we recommend removing PNRs for journeys that have already
        completed if you no longer need the history. Unsaved, one-off checks are never
        persisted.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">5. Your Rights</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        You can delete any saved PNR at any time directly from your dashboard — this immediately
        and permanently removes that record and its history from our database. In line with
        India&apos;s Digital Personal Data Protection (DPDP) Act, you may also contact us using
        the details below for any other request regarding your data.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">6. Changes to This Policy</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        We may update this policy from time to time; the &ldquo;Last updated&rdquo; date at the
        top reflects the most recent revision. Material changes will be reflected here directly.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">7. Contact</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Questions about this policy or your data can be sent to the contact address listed in our{" "}
        <Link href="/terms" className="font-medium text-brand underline">
          Terms of Service
        </Link>
        .
      </p>
    </article>
  );
}
