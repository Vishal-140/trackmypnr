"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { TrackedPNRList } from "@/components/TrackedPNRList";
import { HistoryTimeline } from "@/components/HistoryTimeline";
import { AdSlot } from "@/components/AdSlot";
import { listTrackedPnrs, removeTrackedPnr, getTrackedPnrHistory } from "@/lib/api";

export function DashboardView() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tracked-pnrs"],
    queryFn: listTrackedPnrs,
  });

  const historyQuery = useQuery({
    queryKey: ["tracked-pnr-history", expandedId],
    queryFn: () => getTrackedPnrHistory(expandedId as string),
    enabled: Boolean(expandedId),
  });

  async function handleRemove(id: string) {
    const previous = queryClient.getQueryData(["tracked-pnrs"]);
    // Optimistic UI (Section 9): remove immediately, roll back on failure.
    queryClient.setQueryData(["tracked-pnrs"], (old: typeof data) =>
      old ? old.filter((item) => item.id !== id) : old
    );
    try {
      await removeTrackedPnr(id);
      if (expandedId === id) setExpandedId(null);
    } catch {
      queryClient.setQueryData(["tracked-pnrs"], previous);
    }
  }

  function handleToggleHistory(id: string) {
    setExpandedId((cur) => (cur === id ? null : id));
  }

  return (
    <section className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">My PNRs</h1>
      <p className="mt-2 text-ink-muted">
        PNRs you&apos;ve saved, with their latest status and full history.
      </p>

      <div className="mt-8">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-16 text-ink-muted">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Loading your saved PNRs…
          </div>
        )}

        {isError && (
          <p role="alert" className="text-status-wl">
            Couldn&apos;t load your saved PNRs right now. Please refresh the page.
          </p>
        )}

        {!isLoading && !isError && (
          <TrackedPNRList
            items={data ?? []}
            onRemove={handleRemove}
            onToggleHistory={handleToggleHistory}
            expandedId={expandedId}
            historySlot={
              historyQuery.isLoading ? (
                <p className="text-sm text-ink-muted">Loading history…</p>
              ) : (
                <HistoryTimeline entries={historyQuery.data ?? []} />
              )
            }
          />
        )}
      </div>

      {!isLoading && (data?.length ?? 0) > 0 && (
        <AdSlot slotId="dashboard-below-list" className="mt-10" />
      )}
    </section>
  );
}
