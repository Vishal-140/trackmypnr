"use client";

import { useEffect, useRef } from "react";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

interface AdSlotProps {
  slotId: string;
  className?: string;
  /** Reserved height before the ad loads, prevents layout shift (Section 17 CLS target). */
  minHeight?: number;
}

/**
 * Renders a standard AdSense unit. If NEXT_PUBLIC_ADSENSE_CLIENT_ID isn't
 * set yet (pre-approval, per Section 15's sequencing note), this renders
 * nothing rather than a broken/empty ad box.
 */
export function AdSlot({ slotId, className = "", minHeight = 250 }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT_ID || pushed.current) return;
    try {
      // @ts-expect-error — adsbygoogle is injected globally by the AdSense script.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script not loaded yet or blocked — fail silently, never
      // break the core PNR-check flow (Section 20).
    }
  }, []);

  if (!ADSENSE_CLIENT_ID) return null;

  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      style={{ minHeight }}
      aria-label="Advertisement"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
