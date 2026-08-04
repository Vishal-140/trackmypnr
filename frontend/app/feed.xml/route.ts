import { NextResponse } from "next/server";

const SITE_URL = "https://trackmypnr.co.in";

const ARTICLES = [
  {
    title: "PNR Status Guide: What It Means & How to Check It",
    description:
      "A complete guide to your Indian Railways PNR number — what it is, where to find it, what chart preparation means, and how to read every status: CNF, RAC, and WL.",
    url: `${SITE_URL}/pnr-status-guide`,
    pubDate: "Mon, 01 Aug 2026 00:00:00 +0530",
  },
  {
    title: "Waitlist Types Explained: GNWL, TQWL, RLWL, PQWL & More",
    description:
      "Every Indian Railways waitlist type explained in plain language — GNWL, TQWL, RLWL, PQWL, and RLGN — including which ones typically confirm and which rarely do.",
    url: `${SITE_URL}/waitlist-types`,
    pubDate: "Mon, 01 Aug 2026 00:00:00 +0530",
  },
  {
    title: "Indian Railways Travel Classes Explained: 1A to General",
    description:
      "Every Indian Railways travel class explained — 1A, 2A, 3A, 3E, EC, CC, Sleeper, and General — with berth layouts, amenities, and who each class suits best.",
    url: `${SITE_URL}/travel-classes`,
    pubDate: "Mon, 01 Aug 2026 00:00:00 +0530",
  },
  {
    title: "PNR Status FAQ — Chart Preparation, Refunds, Validity & More",
    description:
      "Answers to the most common PNR status questions: chart preparation timing, TDR and auto-refunds, PNR validity, RAC vs waitlist, and how confirmation probability is calculated.",
    url: `${SITE_URL}/faq`,
    pubDate: "Mon, 01 Aug 2026 00:00:00 +0530",
  },
];

export async function GET() {
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>trackmypnr — Indian Railways PNR Guides</title>
    <link>${SITE_URL}</link>
    <description>Guides and resources for Indian Railways passengers — PNR status, waitlist types, travel classes, and more.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/og-default.png</url>
      <title>trackmypnr</title>
      <link>${SITE_URL}</link>
    </image>
    ${ARTICLES.map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <description><![CDATA[${a.description}]]></description>
      <link>${a.url}</link>
      <guid isPermaLink="true">${a.url}</guid>
      <pubDate>${a.pubDate}</pubDate>
    </item>`
    ).join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
