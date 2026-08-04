import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { Providers } from "@/components/Providers";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = "https://trackmypnr.co.in";
const OG_IMAGE = `${SITE_URL}/og-default.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "trackmypnr — Check PNR Status Instantly & Free",
    template: "%s | trackmypnr",
  },
  description:
    "Check your Indian Railways PNR status instantly, see a clear confirmation probability estimate for waitlisted tickets, and save PNRs to track them over time — free, fast, no clutter.",
  keywords: [
    "PNR status",
    "Indian Railways PNR",
    "check PNR",
    "PNR status checker",
    "IRCTC PNR",
    "waitlist confirmation",
    "train ticket status",
    "PNR number check",
  ],
  openGraph: {
    type: "website",
    siteName: "trackmypnr",
    locale: "en_IN",
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "trackmypnr — Check PNR Status Instantly & Free",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@trackmypnr",
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "trackmypnr",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  themeColor: "#1b3a6b",
};

/** Organisation JSON-LD — present on every page via the root layout. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "trackmypnr",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "trackmypnr is an independent PNR status checking tool for Indian Railways passengers.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "",
    contactType: "customer support",
    availableLanguage: ["English", "Hindi"],
  },
};

/** WebSite + SearchAction JSON-LD — enables Google's sitelink search box. */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "trackmypnr",
  url: SITE_URL,
  description:
    "Free Indian Railways PNR status checker with a clear confirmation probability estimate for waitlisted and RAC tickets.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?pnr={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Preconnect hints — improve TTFB for critical third-party origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className="flex min-h-screen flex-col font-body">
        {/* Sitewide JSON-LD schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
        <CookieConsent />

        {/* Google Analytics — loads after interactive, consent-aware */}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
