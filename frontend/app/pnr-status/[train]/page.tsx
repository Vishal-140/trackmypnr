import type { Metadata } from "next";
import Link from "next/link";
import { TrainFront, ShieldCheck, Gauge } from "lucide-react";
import { HomePnrChecker } from "@/components/HomePnrChecker";
import { RouteLineDivider } from "@/components/RouteLineDivider";

interface PageProps {
  params: Promise<{ train: string }>;
}

function parseTrainSlug(slug: string): { number: string; name: string } {
  // e.g. "12951-mumbai-rajdhani" -> number: "12951", name: "Mumbai Rajdhani"
  const clean = slug.replace(/^train-/, "");
  const match = clean.match(/^(\d{5})-(.+)$/);
  if (match) {
    const number = match[1];
    const name = match[2]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return { number, name };
  }
  const digitsMatch = clean.match(/^(\d{5})/);
  if (digitsMatch) {
    return { number: digitsMatch[1], name: `Train #${digitsMatch[1]}` };
  }
  return { number: "", name: clean.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { train } = await params;
  const parsed = parseTrainSlug(train);
  const title = `PNR Status ${parsed.name} (${parsed.number || train}) — Live Status & Odds`;
  const description = `Check real-time Indian Railways PNR status, berth allocation, and confirmation probability for ${parsed.name} ${parsed.number ? `(#${parsed.number})` : ""}.`;
  const url = `https://trackmypnr.co.in/pnr-status/${train}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
    },
  };
}

export default async function ProgrammaticTrainPage({ params }: PageProps) {
  const { train } = await params;
  const parsed = parseTrainSlug(train);

  return (
    <>
      <section className="mx-auto max-w-content px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            <TrainFront className="h-3.5 w-3.5" aria-hidden="true" />
            {parsed.name} PNR Status
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Check PNR Status for {parsed.name} {parsed.number ? `(#${parsed.number})` : ""}
          </h1>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            Enter your 10-digit PNR to see your live berth status, chart preparation state, and confirmation odds for {parsed.name}.
          </p>
        </div>

        <div className="mx-auto mt-8">
          <HomePnrChecker />
        </div>
      </section>

      <RouteLineDivider />

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-ink">
          About PNR Status Enquiry for {parsed.name}
        </h2>
        <p className="mt-3 leading-relaxed text-ink-muted">
          Passengers traveling on {parsed.name} {parsed.number ? `(Train #${parsed.number})` : ""} can track their passenger booking status instantly. Whether you hold a confirmed berth, an RAC ticket, or a waitlisted booking (GNWL, RLWL, TQWL), our checker provides real-time updates directly from Indian Railways.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/chart-preparation-guide"
            className="block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-brand"
          >
            <h3 className="font-display text-base font-semibold text-ink">Chart Timings</h3>
            <p className="mt-1.5 text-sm text-ink-muted">
              Learn when the 1st chart is prepared for {parsed.name}.
            </p>
          </Link>

          <Link
            href="/rac-ticket-rules"
            className="block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-brand"
          >
            <h3 className="font-display text-base font-semibold text-ink">RAC Rules</h3>
            <p className="mt-1.5 text-sm text-ink-muted">
              Understand side lower berth sharing and CNF upgrades.
            </p>
          </Link>

          <Link
            href="/refund-and-tdr-guide"
            className="block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-brand"
          >
            <h3 className="font-display text-base font-semibold text-ink">Refund Policy</h3>
            <p className="mt-1.5 text-sm text-ink-muted">
              Automatic refund timelines for waitlisted bookings.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
