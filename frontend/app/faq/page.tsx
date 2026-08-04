import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { LastUpdated } from "@/components/LastUpdated";

export const metadata: Metadata = {
  title: "PNR Status FAQ — Chart Preparation, Refunds, Validity & More",
  description:
    "Answers to the most common PNR status questions: chart preparation timing, TDR and auto-refunds, PNR validity, RAC vs waitlist, and how confirmation probability is calculated.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "PNR Status FAQ — Chart Preparation, Refunds, Validity & More",
    description: "Answers to the most common PNR status questions.",
    url: "/faq",
  },
};

interface FaqItem {
  question: string;
  answer: React.ReactNode;
  answerText: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "When exactly is the reservation chart prepared?",
    answer: (
      <>
        Typically <strong>3 to 4 hours before the train&apos;s scheduled departure</strong> from
        its originating station. For trains that start their journey much earlier and pass
        through your boarding station later, an initial chart may prepare 4-8 hours ahead, with a
        second chart closer to actual departure. Before this point, your waitlist or RAC position
        can still improve; after it, your status is final for that journey.
      </>
    ),
    answerText:
      "Typically 3 to 4 hours before the train's scheduled departure from its originating station. Before this point, your waitlist or RAC position can still improve; after it, your status is final for that journey.",
  },
  {
    question: "What happens if my ticket is still waitlisted after the chart is prepared?",
    answer: (
      <>
        If your PNR is fully waitlisted (not RAC) at chart preparation, you are not permitted to
        board with that ticket. For online e-tickets, IRCTC automatically cancels the waitlisted
        passenger(s) and processes a refund — usually the fare minus applicable cancellation
        charges — credited back to your original payment method within a few business days, with
        no action needed from you.
      </>
    ),
    answerText:
      "If your PNR is fully waitlisted (not RAC) at chart preparation, you cannot board. IRCTC automatically cancels and refunds the fare minus applicable cancellation charges for online e-tickets.",
  },
  {
    question: "What is a TDR (Ticket Deposit Receipt) and when do I need to file one?",
    answer: (
      <>
        A TDR is a formal refund request you file yourself through IRCTC for cases the automatic
        system doesn&apos;t cover — most commonly when part of a group booking confirms and part
        remains waitlisted and you choose not to travel at all, when a confirmed passenger
        doesn&apos;t travel due to train cancellation or a certified medical emergency, or
        similar edge cases. Fully waitlisted single-passenger tickets are refunded automatically
        and don&apos;t require a TDR.
      </>
    ),
    answerText:
      "A TDR is a formal refund request filed through IRCTC for cases the automatic refund system doesn't cover, such as partially confirmed group bookings where you choose not to travel.",
  },
  {
    question: "How long is a PNR valid, and can I still check an old one?",
    answer: (
      <>
        A PNR stays valid and checkable for <strong>9 months from the date of booking</strong>.
        After that, the record moves out of the active lookup system, and checking it will no
        longer return a result through standard PNR status tools.
      </>
    ),
    answerText:
      "A PNR stays valid and checkable for 9 months from the date of booking. After that, the record moves out of the active lookup system.",
  },
  {
    question: "What's the actual difference between RAC and waitlisted?",
    answer: (
      <>
        RAC (Reservation Against Cancellation) guarantees you a seat on the train — you share a
        berth with one other RAC passenger and can sit for the journey, with a real chance of
        upgrading to your own full berth as cancellations arrive before chart preparation.
        Waitlisted (WL) means you currently have no allocated space at all; if you&apos;re still
        waitlisted after chart preparation, you cannot board. See our{" "}
        <Link href="/waitlist-types" className="font-medium text-brand underline">
          waitlist types guide
        </Link>{" "}
        for how different waitlist categories affect your odds.
      </>
    ),
    answerText:
      "RAC guarantees a shared berth and boarding rights, with a chance to upgrade to a full berth. Waitlisted means no allocated space yet, and you cannot board if still waitlisted after chart preparation.",
  },
  {
    question: "How is the confirmation probability on trackmypnr calculated?",
    answer: (
      <>
        We estimate it from your waitlist quota type (GNWL typically clears far more often than
        RLWL or PQWL), your current position within that quota, and how many days remain until
        your journey date. It&apos;s a genuinely useful estimate based on how these factors
        typically play out, but it&apos;s always shown as an estimate, not a guarantee — actual
        confirmation depends on real-time cancellations Indian Railways doesn&apos;t publish in
        advance.
      </>
    ),
    answerText:
      "It's estimated from your waitlist quota type, your position within that quota, and days remaining until your journey — shown as an estimate, not a guarantee.",
  },
  {
    question: "What is Vikalp (alternate train scheme)?",
    answer: (
      <>
        Vikalp lets fully waitlisted passengers opt in to be automatically moved to an available
        seat on an alternate train around the same time and route, if one has vacant berths,
        instead of remaining waitlisted on the original train. If you opted in when booking,
        your PNR status will reflect whether you&apos;ve been allotted an alternate train.
      </>
    ),
    answerText:
      "Vikalp lets fully waitlisted passengers opt in to be automatically moved to an available seat on an alternate train with vacant berths, instead of staying waitlisted.",
  },
  {
    question: "Is trackmypnr affiliated with Indian Railways or IRCTC?",
    answer: (
      <>
        No. trackmypnr is an independent, third-party tool. We are not affiliated with,
        endorsed by, or connected to Indian Railways, IRCTC, or any government body. We source
        PNR data through a third-party API for informational convenience — always confirm
        critical travel decisions through official IRCTC channels.
      </>
    ),
    answerText:
      "No. trackmypnr is an independent tool, not affiliated with Indian Railways, IRCTC, or any government body.",
  },
  {
    question: "Is my PNR data stored when I check it?",
    answer: (
      <>
        Not unless you choose to save it. A one-off check queries the status and displays it to
        you without writing anything to our database. Only when you tap &ldquo;Save this
        PNR&rdquo; do we store the PNR number and its status history, tied to your anonymous
        session, so you can revisit it later. See our{" "}
        <Link href="/privacy-policy" className="font-medium text-brand underline">
          Privacy Policy
        </Link>{" "}
        for full details.
      </>
    ),
    answerText:
      "Not unless you choose to save it. A one-off check doesn't write anything to our database; only saved PNRs are stored, tied to your anonymous session.",
  },
  {
    question: "Is trackmypnr free to use?",
    answer: (
      <>
        Yes, fully free — checking and saving PNRs costs nothing. The site is supported by
        unobtrusive ads placed away from the core checking flow, never inside or above the
        results.
      </>
    ),
    answerText:
      "Yes, fully free. The site is supported by unobtrusive ads placed away from the core checking flow.",
  },
  {
    question: "Why does my PNR show 'No record found'?",
    answer: (
      <>
        Usually one of three reasons: the PNR was mistyped (double-check all 10 digits against
        your ticket), the booking is more than 9 months old and has aged out of the active
        system, or the ticket was fully cancelled before the journey. If you&apos;re confident
        the number is correct and recent, try again in a few minutes — the underlying data source
        occasionally has brief delays reflecting very recent bookings.
      </>
    ),
    answerText:
      "Usually a mistyped number, a booking older than 9 months, or a fully cancelled ticket. If the number is correct and recent, try again in a few minutes.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answerText,
    },
  })),
};

export default function FaqPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Frequently Asked Questions
      </h1>
      <div className="mt-3">
        <LastUpdated date="2026-08-01" />
      </div>
      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        Straight answers to the questions we hear most about PNR status, chart preparation,
        refunds, and how trackmypnr works.
      </p>

      <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface">
        {FAQ_ITEMS.map((item, i) => (
          <details key={item.question} className="group px-5 py-4 open:pb-5" open={i < 2}>
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 font-display font-semibold text-ink"
              style={{ minHeight: 44 }}
            >
              {item.question}
              <span className="shrink-0 text-brand transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="mt-2 leading-relaxed text-ink-muted">{item.answer}</div>
          </details>
        ))}
      </div>

      <AdSlot slotId="faq-end-of-content" className="mt-10" />

      <p className="mt-10 text-sm text-ink-muted">
        Still have a question?{" "}
        <Link href="/pnr-status-guide" className="font-medium text-brand underline">
          Read the full PNR status guide
        </Link>{" "}
        or{" "}
        <Link href="/" className="font-medium text-brand underline">
          check your PNR now
        </Link>
        .
      </p>
    </article>
  );
}
