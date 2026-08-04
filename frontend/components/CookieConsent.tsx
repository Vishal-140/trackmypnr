"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";

const CONSENT_KEY = "trackmypnr-cookie-consent";
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

type ConsentState = "accepted" | "declined" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY) as ConsentState;
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored);
    } else {
      setShowBanner(true);
    }
  }, []);

  function decide(value: "accepted" | "declined") {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
    setShowBanner(false);
  }

  return (
    <>
      {/* AdSense only loads once the user accepts cookies, and only once
          NEXT_PUBLIC_ADSENSE_CLIENT_ID exists (post-approval, Section 15). */}
      {consent === "accepted" && ADSENSE_CLIENT_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}

      {showBanner && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur px-4 py-4 shadow-[0_-4px_16px_rgba(20,24,31,0.08)] sm:px-6"
        >
          <div className="mx-auto flex max-w-content flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-muted">
              We use cookies for essential site function and, once you allow it, for ads that
              help keep trackmypnr free. See our{" "}
              <Link href="/privacy-policy" className="font-medium text-brand underline">
                Privacy Policy
              </Link>{" "}
              for details.
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => decide("declined")}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-bg"
                style={{ minHeight: 44 }}
              >
                Decline
              </button>
              <button
                onClick={() => decide("accepted")}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
                style={{ minHeight: 44 }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
