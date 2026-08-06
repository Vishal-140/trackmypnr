import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Gauge, Bookmark, TrainFront } from "lucide-react";
const HomePnrChecker = dynamic(() => import('@/components/HomePnrChecker').then(mod => mod.HomePnrChecker), {
  loading: () => <SkeletonLoader />, // fallback UI while loading
  ssr: false,
});
import { RouteLineDivider } from "@/components/RouteLineDivider";
import dynamic from 'next/dynamic';
import { SkeletonLoader } from '@/components/SkeletonLoader';

const FeatureCard = dynamic(() => import('@/components/FeatureCard'), {
  loading: () => <SkeletonLoader />, // fallback UI while loading
  ssr: false,
});

const LinkCard = dynamic(() => import('@/components/LinkCard'), {
  loading: () => <SkeletonLoader />, // fallback UI while loading
  ssr: false,
});
export const metadata: Metadata = {
  title: "Check PNR Status Instantly & Free",
  description:
    "Free Indian Railways PNR status checker with a clear confirmation probability estimate for waitlisted and RAC tickets. Enter your 10-digit PNR and get results in seconds.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "trackmypnr — Check PNR Status Instantly & Free",
    description:
      "Free Indian Railways PNR status checker with a clear confirmation probability estimate for waitlisted and RAC tickets.",
    url: "/",
  },
};

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "trackmypnr",
  url: "https://trackmypnr.co.in",
  description:
    "Free Indian Railways PNR status checker with a confirmation probability estimate for waitlisted and RAC tickets.",
  applicationCategory: "TravelApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />

      <section className="mx-auto max-w-content px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            <TrainFront className="h-3.5 w-3.5" aria-hidden="true" />
            Indian Railways PNR status
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Check your PNR status in seconds
          </h1>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            Enter your 10-digit PNR to see your confirmed, RAC, or waitlisted status — plus an
            honest confirmation probability estimate for tickets that aren&apos;t confirmed yet.
          </p>
        </div>

        <div className="mx-auto mt-8">
          <HomePnrChecker />
        </div>
      </section>

      <RouteLineDivider />

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <h2 className="text-center font-display text-2xl font-bold text-ink">
          Why trackmypnr
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <FeatureCard
            icon={<Gauge className="h-5 w-5" aria-hidden="true" />}
            title="Real confirmation odds"
            description="Waitlisted and RAC tickets show a clear percentage estimate, not just a status label, so you know how likely your ticket is to clear before departure."
          />
          <FeatureCard
            icon={<Bookmark className="h-5 w-5" aria-hidden="true" />}
            title="Save and track"
            description="Save any PNR to your dashboard to see its full status history over time, without creating an account or sharing your email."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
            title="Nothing stored by default"
            description="Your PNR is not stored unless you explicitly choose to save it — a one-off check never touches our database."
          />
        </div>
      </section>

      <RouteLineDivider />

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-ink">Learn more about your ticket</h2>
        <p className="mt-3 max-w-2xl text-ink-muted">
          New to PNR numbers, waitlist types, or travel classes? These guides break everything
          down in plain language.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <LinkCard
            href="/pnr-status-guide"
            title="PNR Status Guide"
            description="What a PNR is, how to decode its digits, and what each status means."
          />
          <LinkCard
            href="/waitlist-types"
            title="Waitlist Types Explained"
            description="GNWL, TQWL, RLWL, PQWL, RLGN — what they are and how likely each is to confirm."
          />
          <LinkCard
            href="/travel-classes"
            title="Travel Classes Breakdown"
            description="AC and non-AC class codes explained, from 1A down to Sleeper and General."
          />
        </div>
      </section>
    </>
  );
}




