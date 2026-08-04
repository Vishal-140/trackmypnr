/**
 * GoogleAnalytics — GA4 with Consent Mode v2
 *
 * Loads the gtag.js script unconditionally (so page_view events fire even
 * before/without cookie consent) but initialises analytics_storage and
 * ad_storage as "denied" by default.  The CookieConsent component calls
 * window.grantAnalyticsConsent() / window.denyAnalyticsConsent() to upgrade
 * or confirm the consent state after the user interacts with the banner.
 *
 * This satisfies GA4 Consent Mode v2, GDPR, and India's DPDP Act: personal
 * analytics data is only retained when the user explicitly accepts.
 */
"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      {/* 1. Load the gtag library */}
      <Script
        id="ga-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      {/* 2. Initialise with consent denied by default (Consent Mode v2) */}
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            // Consent Mode v2 — deny everything until the user decides
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });

            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });

            // Helpers called by CookieConsent on user decision
            window.grantAnalyticsConsent = function() {
              gtag('consent', 'update', {
                analytics_storage: 'granted',
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
              });
            };
            window.denyAnalyticsConsent = function() {
              gtag('consent', 'update', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
            };
          `,
        }}
      />
    </>
  );
}
