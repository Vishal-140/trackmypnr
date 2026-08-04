import { useEffect } from 'react';
import Script from 'next/script';

/**
 * GoogleAnalytics component loads the GA4 script and manages consent.
 * It defines global helper functions `grantAnalyticsConsent` and `denyAnalyticsConsent`
 * that are used by CookieConsent to enable or disable analytics based on user choice.
 */
export function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // If no GA ID is configured, render nothing.
  if (!GA_MEASUREMENT_ID) return null;

  /** Initialize gtag if it hasn't been loaded yet */
  const initGtag = () => {
    if (typeof window === 'undefined') return;
    // Avoid re‑initialisation
    if ((window as any).gtag) return;
    (window as any).dataLayer = (window as any).dataLayer || [];
    const gtag = function () {
      (window as any).dataLayer.push(arguments);
    };
    (window as any).gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      allow_ad_personalization_signals: false,
    });
  };

  useEffect(() => {
    // Expose consent handlers globally for CookieConsent to call.
    (window as any).grantAnalyticsConsent = () => {
      initGtag();
    };
    (window as any).denyAnalyticsConsent = () => {
      // GA4 consent mode – set analytics_storage to 'denied'
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', { analytics_storage: 'denied' });
      }
    };

    // If consent was already stored as "accepted", initialise immediately.
    const stored = window.localStorage.getItem('trackmypnr-cookie-consent');
    if (stored === 'accepted') {
      (window as any).grantAnalyticsConsent();
    }
  }, []);

  return (
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
    />
  );
}
