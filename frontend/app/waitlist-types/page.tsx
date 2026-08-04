import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { LastUpdated } from "@/components/LastUpdated";
import { RouteLineDivider } from "@/components/RouteLineDivider";

export const metadata: Metadata = {
  title: "Waitlist Types Explained: GNWL, TQWL, RLWL, PQWL & More",
  description:
    "Every Indian Railways waitlist type explained in plain language — GNWL, TQWL, RLWL, PQWL, and RLGN — including which ones typically confirm and which rarely do.",
  alternates: { canonical: "/waitlist-types" },
  openGraph: {
    title: "Waitlist Types Explained: GNWL, TQWL, RLWL, PQWL & More",
    description:
      "Every Indian Railways waitlist type explained, including which ones typically confirm.",
    url: "/waitlist-types",
  },
};

interface WaitlistType {
  code: string;
  name: string;
  description: string;
  odds: string;
}

const WAITLIST_TYPES: WaitlistType[] = [
  {
    code: "GNWL",
    name: "General Waiting List",
    description:
      "The most common waitlist type, assigned when you book from the train's originating station (or an early major stop) under the general quota. Your position moves up as passengers ahead of you cancel or upgrade.",
    odds: "Highest confirmation odds of any waitlist type — a low GNWL number booked well in advance often clears.",
  },
  {
    code: "TQWL",
    name: "Tatkal Waiting List",
    description:
      "Applies to tickets booked under the Tatkal quota once all Tatkal berths are sold. Tatkal quota itself is small relative to demand, so TQWL starts from a smaller pool of available seats.",
    odds: "Moderate — clears less reliably than GNWL since there are fewer Tatkal berths to free up in the first place.",
  },
  {
    code: "RLWL",
    name: "Remote Location Waiting List",
    description:
      "Assigned when you board or deboard at a station that isn't the train's main origin or destination — a 'remote' intermediate station with only a small quota of seats reserved for it.",
    odds: "Lower — the seat pool for remote-location bookings is small, so even a low RLWL number can be less certain than an equivalent GNWL number.",
  },
  {
    code: "PQWL",
    name: "Pooled Quota Waiting List",
    description:
      "Used on tickets booked between two intermediate stations that share a pooled quota, common on long-distance routes passing through multiple zones.",
    odds: "Similar to RLWL — a smaller shared allocation means confirmation is less predictable than GNWL.",
  },
  {
    code: "RLGN",
    name: "Remote Location General Waitlist",
    description:
      "A less commonly discussed variant of the remote-location waitlist, applied in specific zonal quota configurations for certain routes. Functionally similar to RLWL in how it clears.",
    odds: "Generally similar to RLWL — treat it as a smaller, less predictable pool than GNWL.",
  },
];

const waitlistFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: WAITLIST_TYPES.map((wl) => ({
    "@type": "Question",
    name: `What is ${wl.code} (${wl.name})?`,
    acceptedAnswer: {
      "@type": "Answer",
      text: `${wl.description} ${wl.odds}`,
    },
  })),
};

export default function WaitlistTypesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(waitlistFaqJsonLd) }}
      />

      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Waitlist Types Explained: GNWL, TQWL, RLWL, PQWL & RLGN
      </h1>
      <div className="mt-3">
        <LastUpdated date="2026-08-01" />
      </div>

      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        Not all waitlists are equal. Indian Railways splits waitlisted passengers into several
        distinct categories depending on where and how the ticket was booked — and each one has
        meaningfully different odds of confirming before your train departs. Here&apos;s what
        each code actually means.
      </p>

      <RouteLineDivider className="my-8" />

      <div className="space-y-8">
        {WAITLIST_TYPES.map((wl) => (
          <div key={wl.code}>
            <h2 className="font-display text-xl font-bold text-ink">
              {wl.code} — {wl.name}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-muted">{wl.description}</p>
            <p className="mt-2 rounded-lg bg-brand-light/60 px-3 py-2 text-sm font-medium text-brand-dark">
              {wl.odds}
            </p>
          </div>
        ))}
      </div>

      <AdSlot slotId="waitlist-types-mid-content" className="my-10" />

      <h2 className="mt-2 font-display text-2xl font-bold text-ink">
        Why Waitlist Type Matters More Than the Number Alone
      </h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        It&apos;s tempting to compare waitlist chances purely by position — &ldquo;WL 5&rdquo; feels
        safer than &ldquo;WL 40&rdquo;, and generally it is, within the same waitlist type. But
        comparing across types is misleading: a GNWL 20 will often confirm more reliably than a
        PQWL 5, simply because the pool of seats each quota draws from is a different size. This
        is exactly why a flat waitlist number alone doesn&apos;t tell the full story, and why{" "}
        <Link href="/" className="font-medium text-brand underline">
          checking your PNR status
        </Link>{" "}
        with a tool that estimates real confirmation probability — factoring in quota type,
        position, and how many days remain until departure — gives you a much clearer picture
        than the raw number by itself.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">
        What About RAC vs. Waitlisted?
      </h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        RAC (Reservation Against Cancellation) is a step above any waitlist type — RAC passengers
        are guaranteed to board and travel, sharing a berth with one other RAC passenger, with a
        genuine chance of upgrading to a full individual berth as cancellations arrive before
        chart preparation. If you&apos;re unsure how your specific status fits into the bigger
        picture, our{" "}
        <Link href="/pnr-status-guide" className="font-medium text-brand underline">
          PNR status guide
        </Link>{" "}
        walks through CNF, RAC, and WL from the ground up, including exactly when chart
        preparation locks in your final status.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">
        Tips If You&apos;re Waitlisted
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed text-ink-muted">
        <li>
          Book as early as possible — earlier bookings get lower waitlist numbers within the same
          quota, which meaningfully improves your odds.
        </li>
        <li>
          If your travel dates are flexible, compare waitlist numbers across nearby trains or
          dates rather than fixating on one option.
        </li>
        <li>
          Consider the general quota (GNWL) over a remote-location or pooled quota (RLWL/PQWL)
          when your boarding and destination stations allow it — it typically clears more
          reliably.
        </li>
        <li>
          Save your PNR on{" "}
          <Link href="/" className="font-medium text-brand underline">
            trackmypnr
          </Link>{" "}
          to watch your status and confirmation probability change as the chart preparation date
          approaches, instead of checking manually every day.
        </li>
      </ul>

      <RouteLineDivider className="my-10" />
      <p className="text-sm text-ink-muted">
        Related reading:{" "}
        <Link href="/pnr-status-guide" className="font-medium text-brand underline">
          PNR Status Guide
        </Link>{" "}
        ·{" "}
        <Link href="/travel-classes" className="font-medium text-brand underline">
          Travel Classes Breakdown
        </Link>{" "}
        ·{" "}
        <Link href="/faq" className="font-medium text-brand underline">
          Frequently Asked Questions
        </Link>
      </p>
    </article>
  );
}
