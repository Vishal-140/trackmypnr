import type { MetadataRoute } from "next";

const SITE_URL = "https://trackmypnr.co.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/pnr-status-guide",
    "/waitlist-types",
    "/travel-classes",
    "/faq",
    "/privacy-policy",
    "/terms",
  ];

  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date("2026-08-01"),
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
