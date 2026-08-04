import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { LastUpdated } from "@/components/LastUpdated";
import { RouteLineDivider } from "@/components/RouteLineDivider";

export const metadata: Metadata = {
  title: "Indian Railways Travel Classes Explained: 1A to General",
  description:
    "Every Indian Railways travel class explained — 1A, 2A, 3A, 3E, EC, CC, Sleeper, and General — with berth layouts, amenities, and who each class suits best.",
  alternates: { canonical: "/travel-classes" },
  openGraph: {
    title: "Indian Railways Travel Classes Explained: 1A to General",
    description: "Every Indian Railways travel class explained, from 1A down to General.",
    url: "/travel-classes",
  },
};

interface TravelClass {
  code: string;
  name: string;
  category: "AC" | "Non-AC";
  description: string;
}

const CLASSES: TravelClass[] = [
  {
    code: "1A",
    name: "AC First Class",
    category: "AC",
    description:
      "The most premium class — private lockable cabins with 2 or 4 berths, wide cushioned seating, and the fewest passengers per coach. Fares are the highest on the train, roughly 2-3x AC 2-Tier.",
  },
  {
    code: "2A",
    name: "AC 2-Tier",
    category: "AC",
    description:
      "Curtained bays of 4 berths (2 upper, 2 lower) plus 2-berth side bays, with bedding included. A common choice for longer overnight journeys where privacy and comfort matter but 1A's price doesn't.",
  },
  {
    code: "3A",
    name: "AC 3-Tier",
    category: "AC",
    description:
      "Bays of 6 berths (upper, middle, lower on each side) plus side-lower and side-upper berths, with bedding included. The most booked AC class — a solid balance of comfort and price for overnight travel.",
  },
  {
    code: "3E",
    name: "AC 3-Tier Economy",
    category: "AC",
    description:
      "A denser variant of 3A found on select trains (notably Humsafar Express routes), with an extra side-middle berth per bay. Slightly less space per passenger but priced below standard 3A.",
  },
  {
    code: "EC",
    name: "AC Executive Chair Car",
    category: "AC",
    description:
      "Wide, reclining airline-style seating for day travel on high-speed trains like Shatabdi and Vande Bharat services. No berths — designed for journeys completed in daylight hours.",
  },
  {
    code: "CC",
    name: "AC Chair Car",
    category: "AC",
    description:
      "Standard reclining seats, air-conditioned, again intended for day journeys rather than overnight travel. A tier below Executive Chair Car in seat width and pitch.",
  },
  {
    code: "SL",
    name: "Sleeper Class",
    category: "Non-AC",
    description:
      "Non-AC berths in the same 6-berth bay layout as 3A, with fans instead of air conditioning and no bedding provided. The most widely available and most affordable berthed class on long-distance trains.",
  },
  {
    code: "2S",
    name: "Second Sitting",
    category: "Non-AC",
    description:
      "Non-AC bench-style seating for shorter day journeys on passenger and express trains. No reservation guarantee of a specific seat on some train types — check your ticket for specifics.",
  },
  {
    code: "GN",
    name: "General / Unreserved",
    category: "Non-AC",
    description:
      "Unreserved seating open on a first-come basis — no seat or berth allocation at all. The cheapest way to travel, but comfort and available space vary heavily by route and time of day.",
  },
];

export default function TravelClassesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Indian Railways Travel Classes Explained
      </h1>
      <div className="mt-3">
        <LastUpdated date="2026-08-01" />
      </div>

      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        Indian Railways offers a wider range of travel classes than most rail networks in the
        world — from private AC cabins to fully unreserved general seating. Here&apos;s what
        every class code on your ticket actually means, grouped by AC and non-AC.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">AC Classes</h2>
      <div className="mt-4 space-y-6">
        {CLASSES.filter((c) => c.category === "AC").map((c) => (
          <div key={c.code} className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-display text-lg font-semibold text-ink">
              <span className="mr-2 rounded-md bg-brand-light px-2 py-0.5 font-mono text-sm text-brand">
                {c.code}
              </span>
              {c.name}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-muted">{c.description}</p>
          </div>
        ))}
      </div>

      <AdSlot slotId="travel-classes-mid-content" className="my-10" />

      <h2 className="mt-2 font-display text-2xl font-bold text-ink">Non-AC Classes</h2>
      <div className="mt-4 space-y-6">
        {CLASSES.filter((c) => c.category === "Non-AC").map((c) => (
          <div key={c.code} className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-display text-lg font-semibold text-ink">
              <span className="mr-2 rounded-md bg-status-rac-bg px-2 py-0.5 font-mono text-sm text-status-rac">
                {c.code}
              </span>
              {c.name}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-muted">{c.description}</p>
          </div>
        ))}
      </div>

      <RouteLineDivider className="my-10" />

      <h2 className="mt-2 font-display text-2xl font-bold text-ink">
        How to Choose a Class
      </h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        For overnight journeys, Sleeper (SL) is the standard budget option, with 3A as the most
        popular upgrade for AC comfort at a moderate price jump. For short daytime trips between
        major cities, Chair Car (CC) or Executive Chair Car (EC) on Shatabdi and Vande Bharat
        services are usually the fastest and most comfortable options available. First Class
        (1A) and 2-Tier (2A) suit travelers prioritizing privacy and space over cost, particularly
        for longer routes.
      </p>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Availability and waitlist behavior also differ meaningfully by class — AC classes on
        popular routes often waitlist faster during festival and holiday periods than Sleeper,
        simply because fewer AC coaches are attached per train. If you&apos;re deciding between
        classes and your ticket is already waitlisted, our{" "}
        <Link href="/waitlist-types" className="font-medium text-brand underline">
          waitlist types guide
        </Link>{" "}
        explains how your specific quota affects the odds of confirmation.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">
        Checking Your Class on a PNR
      </h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Your booked class is shown as one of the codes above on your ticket and in your PNR
        record. If you&apos;re not sure which class you&apos;re booked in, or want to see your
        current coach and berth allocation,{" "}
        <Link href="/" className="font-medium text-brand underline">
          check your PNR status
        </Link>{" "}
        on the trackmypnr homepage — it shows your class, quota, and exact berth details
        alongside your confirmation status.
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
          Frequently Asked Questions
        </Link>
      </p>
    </article>
  );
}
