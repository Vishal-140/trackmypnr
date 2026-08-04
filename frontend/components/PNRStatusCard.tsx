"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, TrainFront, MapPin, Wallet, Calendar } from "lucide-react";
import type { NormalizedPNRStatus } from "@/lib/types";
import { berthCodeLabel, formatISTDateOnly, getStatusCategory } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmationGauge } from "@/components/ConfirmationGauge";
import { RouteLineDivider } from "@/components/RouteLineDivider";

interface PNRStatusCardProps {
  status: NormalizedPNRStatus;
  onSave?: () => void | Promise<void>;
  isSaved?: boolean;
  isSaving?: boolean;
  showSaveButton?: boolean;
}

export function PNRStatusCard({
  status,
  onSave,
  isSaved = false,
  isSaving = false,
  showSaveButton = true,
}: PNRStatusCardProps) {
  const [justSaved, setJustSaved] = useState(false);
  const lead = status.passengers[0];
  const category = getStatusCategory(lead?.current_status);
  const showGauge =
    (category === "wl" || category === "rac") &&
    typeof status.confirmation_probability_percent === "number";

  async function handleSave() {
    if (!onSave) return;
    await onSave();
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1600);
  }

  return (
    <div className="w-full max-w-2xl animate-fade-slide-in rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-ink-muted">PNR {status.pnr_number}</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink md:text-2xl">
            {status.train_name ?? "Train details"}{" "}
            <span className="font-body text-base font-normal text-ink-muted">
              {status.train_number ? `#${status.train_number}` : ""}
            </span>
          </h3>
        </div>
        {lead && <StatusBadge status={lead.current_status} />}
      </div>

      <p className="mt-3 text-sm text-ink-muted">
        {status.chart_prepared ? "Chart prepared" : "Chart not prepared yet"} · Class{" "}
        {status.class ?? "—"} · Quota {status.quota ?? "—"}
      </p>

      <RouteLineDivider className="my-6" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <InfoBlock
          icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
          label="Route"
          value={`${status.from_station ?? "—"} → ${status.to_station ?? "—"}`}
        />
        <InfoBlock
          icon={<Calendar className="h-4 w-4" aria-hidden="true" />}
          label="Journey date"
          value={formatISTDateOnly(status.journey_date)}
        />
        <InfoBlock
          icon={<Wallet className="h-4 w-4" aria-hidden="true" />}
          label="Fare"
          value={status.fare != null ? `₹${status.fare.toFixed(0)}` : "—"}
        />
      </div>

      <div className="mt-6 space-y-3">
        {status.passengers.map((p) => (
          <div
            key={p.number}
            className="flex flex-col gap-2 rounded-xl bg-brand-light/60 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <TrainFront className="h-4 w-4 text-brand" aria-hidden="true" />
              Passenger {p.number}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
              <span>{p.current_status_details || p.current_status}</span>
              {p.coach && <span>Coach {p.coach}</span>}
              {p.seat && (
                <span>
                  Berth {p.seat}
                  {p.berth_code ? ` (${berthCodeLabel(p.berth_code)})` : ""}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showGauge && (
        <div className="mt-6 flex justify-center border-t border-border pt-6">
          <ConfirmationGauge
            percent={status.confirmation_probability_percent ?? 0}
            status={lead?.current_status}
          />
        </div>
      )}

      {showSaveButton && onSave && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className="flex items-center gap-2 rounded-xl border border-brand px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-light disabled:cursor-default disabled:opacity-70"
            style={{ minHeight: 44 }}
          >
            {isSaved || justSaved ? (
              <BookmarkCheck className="h-4 w-4 animate-check-pop text-brand" aria-hidden="true" />
            ) : (
              <Bookmark className="h-4 w-4" aria-hidden="true" />
            )}
            {isSaved || justSaved ? "Saved to My PNRs" : isSaving ? "Saving…" : "Save this PNR"}
          </button>
        </div>
      )}
    </div>
  );
}

function InfoBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-muted">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
