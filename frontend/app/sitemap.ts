import type { MetadataRoute } from "next";

const SITE_URL = "https://trackmypnr.co.in";

/** Date when content guide pages were last meaningfully updated */
const GUIDES_UPDATED = new Date("2026-08-01");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(), // homepage is functionally "updated" every day (live PNR data)
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/pnr-status-guide`,
      lastModified: GUIDES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/waitlist-types`,
      lastModified: GUIDES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/travel-classes`,
      lastModified: GUIDES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: GUIDES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: GUIDES_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: GUIDES_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
