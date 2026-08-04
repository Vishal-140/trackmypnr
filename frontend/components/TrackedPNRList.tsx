"use client";

import { useState } from "react";
import { Copy, Check, Trash2, History as HistoryIcon } from "lucide-react";
import type { TrackedPNR } from "@/lib/types";
import { formatISTDateOnly, getStatusCategory } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";

interface TrackedPNRListProps {
  items: TrackedPNR[];
  onRemove: (id: string) => void | Promise<void>;
  onToggleHistory?: (id: string) => void;
  expandedId?: string | null;
  historySlot?: React.ReactNode;
}

export function TrackedPNRList({
  items,
  onRemove,
  onToggleHistory,
  expandedId,
  historySlot,
}: TrackedPNRListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleCopy(id: string, pnrNumber: string) {
    await navigator.clipboard.writeText(pnrNumber);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1500);
  }

  async function handleRemove(id: string) {
    setRemovingId(id);
    try {
      await onRemove(id);
    } finally {
      setRemovingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
        <p className="text-ink-muted">
          You haven&apos;t saved any PNRs yet. Check a PNR on the homepage and tap
          &ldquo;Save this PNR&rdquo; to track it here.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item) => {
        const lead = item.status.passengers[0];
        const isArchived = !item.active;
        const isExpanded = expandedId === item.id;
        return (
          <li
            key={item.id}
            className={`rounded-2xl border bg-surface p-5 transition-opacity ${
              isArchived ? "border-border opacity-60" : "border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-sm text-ink-muted">{item.pnr_number}</p>
                <p className="mt-0.5 text-sm font-medium text-ink">
                  {item.status.train_name ?? "Train details unavailable"}
                </p>
              </div>
              {lead && <StatusBadge status={lead.current_status} />}
            </div>

            <p className="mt-2 text-xs text-ink-muted">
              Journey {formatISTDateOnly(item.journey_date)}
              {isArchived && (
                <span className="ml-2 rounded-full bg-ink/5 px-2 py-0.5 font-medium text-ink-muted">
                  Past journey
                </span>
              )}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCopy(item.id, item.pnr_number)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-brand-light"
                style={{ minHeight: 44 }}
                aria-label={`Copy PNR ${item.pnr_number}`}
              >
                {copiedId === item.id ? (
                  <Check className="h-3.5 w-3.5 text-status-cnf" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {copiedId === item.id ? "Copied" : "Copy PNR"}
              </button>

              {onToggleHistory && (
                <button
                  onClick={() => onToggleHistory(item.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-brand-light"
                  style={{ minHeight: 44 }}
                  aria-expanded={isExpanded}
                >
                  <HistoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {isExpanded ? "Hide history" : "View history"}
                </button>
              )}

              <button
                onClick={() => handleRemove(item.id)}
                disabled={removingId === item.id}
                className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-status-wl transition-colors hover:bg-status-wl-bg disabled:opacity-50"
                style={{ minHeight: 44 }}
                aria-label={`Remove PNR ${item.pnr_number}`}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                {removingId === item.id ? "Removing…" : "Remove"}
              </button>
            </div>

            {isExpanded && <div className="mt-4 border-t border-border pt-4">{historySlot}</div>}
          </li>
        );
      })}
    </ul>
  );
}
