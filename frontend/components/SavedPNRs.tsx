"use client";

import { useEffect, useState } from "react";
import { listTrackedPnrs, removeTrackedPnr } from "@/lib/api";
import type { TrackedPNR } from "@/lib/types";
import { AlertTriangle, Trash2 } from "lucide-react";

interface SavedPNRsProps {
  /** Callback to re‑track a saved PNR. Receives the PNR number string. */
  onTrack: (pnrNumber: string) => void;
  /** Incrementing value that forces the component to reload the saved list. */
  refresh?: number;
}

export default function SavedPNRs({ onTrack, refresh = 0 }: SavedPNRsProps) {
  const [saved, setSaved] = useState<TrackedPNR[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved PNRs whenever the component mounts or the refresh token changes.
  useEffect(() => {
    let cancelled = false;
    async function fetchSaved() {
      setLoading(true);
      setError(null);
      try {
        const data = await listTrackedPnrs();
        if (!cancelled) setSaved(data);
      } catch (e) {
        if (!cancelled) setError("Failed to load saved PNRs.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchSaved();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  async function handleDelete(id: string) {
    try {
      await removeTrackedPnr(id);
      // Optimistically remove from UI.
      setSaved((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Could not delete saved PNR.");
    }
  }

  if (loading) {
    return <p className="text-sm text-ink-muted">Loading saved PNRs…</p>;
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-2xl border border-status-wl/30 bg-status-wl-bg p-4 text-sm text-status-wl">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>{error}</p>
      </div>
    );
  }

  if (saved.length === 0) {
    return <p className="text-sm text-ink-muted">No saved PNRs yet.</p>;
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <h2 className="font-display text-base font-semibold text-ink">Saved PNRs</h2>
      {saved.map((pnr) => (
        <div
          key={pnr.id}
          className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
        >
          <div className="flex flex-col">
            <span className="font-medium text-ink">{pnr.pnr_number}</span>
            <span className="text-sm text-ink-muted">{pnr.journey_date ?? "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTrack(pnr.pnr_number)}
              className="rounded-md bg-brand-light px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand-light/80"
            >
              Track
            </button>
            <button
              onClick={() => handleDelete(pnr.id)}
              className="rounded-md p-1 text-ink-muted hover:text-ink"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
