"use client";

import { useState, useEffect } from "react";
import SavedPNRs from "@/components/SavedPNRs";
import { AlertTriangle } from "lucide-react";
import { PNRInputForm } from "@/components/PNRInputForm";
import { PNRStatusCard } from "@/components/PNRStatusCard";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { AdSlot } from "@/components/AdSlot";
import { checkPnr, trackPnr } from "@/lib/api";
import { ApiError } from "@/lib/types";
import type { NormalizedPNRStatus } from "@/lib/types";

interface HomePnrCheckerProps {
  initialPnr?: string;
}

export function HomePnrChecker({ initialPnr }: HomePnrCheckerProps = {}) {
  const [status, setStatus] = useState<NormalizedPNRStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);

  async function handleCheck(pnrNumber: string) {
    setIsLoading(true);
    setError(null);
    setStatus(null);
    setIsSaved(false);
    setSlowNotice(false);

    const slowTimer = window.setTimeout(() => setSlowNotice(true), 10_000);

    try {
      const result = await checkPnr(pnrNumber);
      setStatus(result);
      if (typeof window !== "undefined" && window.location.pathname !== `/${pnrNumber}`) {
        window.history.pushState({}, "", `/${pnrNumber}`);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.code === "PNR_NOT_FOUND"
            ? `No record found for PNR ${pnrNumber}. Double-check the number and try again.`
            : "We couldn't reach the status service right now. Please try again in a moment."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      window.clearTimeout(slowTimer);
      setIsLoading(false);
      setSlowNotice(false);
    }
  }

  useEffect(() => {
    if (initialPnr) {
      handleCheck(initialPnr);
    }
  }, [initialPnr]);

  const [savedRefresh, setSavedRefresh] = useState(0);

  async function handleSave() {
    if (!status) return;
    setIsSaving(true);
    try {
      await trackPnr(status.pnr_number);
      setIsSaved(true);
      // trigger refresh of saved list
      setSavedRefresh((prev) => prev + 1);
    } catch {
      setError("Couldn't save this PNR right now — please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-2xl">
        <PNRInputForm onSubmit={handleCheck} isLoading={isLoading} initialValue={initialPnr ?? ""} />
      </div>

      {isLoading && (
        <div className="w-full max-w-2xl">
          <SkeletonLoader />
          {slowNotice && (
            <p className="mt-3 text-center text-sm text-ink-muted" role="status">
              Still fetching — the status service can take a little longer than usual sometimes.
              Hang tight.
            </p>
          )}
        </div>
      )}

      {!isLoading && error && (
        <div
          role="alert"
          className="flex w-full max-w-2xl items-start gap-3 rounded-2xl border border-status-wl/30 bg-status-wl-bg p-4 text-sm text-status-wl"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      {!isLoading && status && (
        <>
          <PNRStatusCard status={status} onSave={handleSave} isSaved={isSaved} isSaving={isSaving} />
          <SavedPNRs onTrack={handleCheck} />
        </>
      )}
    </div>
  );
}
