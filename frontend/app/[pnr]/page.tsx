import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrainFront } from "lucide-react";
import { HomePnrChecker } from "@/components/HomePnrChecker";
import { RouteLineDivider } from "@/components/RouteLineDivider";
import { isValidPnr } from "@/lib/utils";

interface PageProps {
  params: Promise<{ pnr: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pnr } = await params;
  if (!isValidPnr(pnr)) {
    return {
      robots: { index: false, follow: false },
    };
  }
  const title = `PNR Status ${pnr}`;
  const description = `Check real-time Indian Railways PNR status and confirmation probability for PNR ${pnr}.`;
  const url = `https://trackmypnr.co.in/${pnr}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | trackmypnr`,
      description,
      url,
    },
  };
}

export default async function PnrPage({ params }: PageProps) {
  const { pnr } = await params;

  if (!isValidPnr(pnr)) {
    notFound();
  }

  const pnrTripJsonLd = {
    "@context": "https://schema.org",
    "@type": "TrainTrip",
    name: `Indian Railways PNR Enquiry ${pnr}`,
    description: `Real-time PNR status lookup, confirmation probability, and berth details for PNR number ${pnr}.`,
    url: `https://trackmypnr.co.in/${pnr}`,
    provider: {
      "@type": "Organization",
      name: "Indian Railways",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pnrTripJsonLd) }}
      />
      <section className="mx-auto max-w-content px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            <TrainFront className="h-3.5 w-3.5" aria-hidden="true" />
            Indian Railways PNR Status
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            PNR Status for {pnr}
          </h1>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            Track confirmation probability, berth details, and route information for PNR {pnr}.
          </p>
        </div>

        <div className="mx-auto mt-8">
          <HomePnrChecker initialPnr={pnr} />
        </div>
      </section>

      <RouteLineDivider />
    </>
  );
}
