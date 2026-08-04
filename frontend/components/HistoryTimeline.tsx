import type { HistoryEntry } from "@/lib/types";
import { formatIST, getStatusCategory, statusLabel } from "@/lib/utils";

const DOT_COLOR: Record<string, string> = {
  cnf: "bg-status-cnf",
  rac: "bg-status-rac",
  wl: "bg-status-wl",
  unknown: "bg-ink-muted",
};

export function HistoryTimeline({ entries }: { entries: HistoryEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        No status checks recorded yet — refresh this PNR to start building its timeline.
      </p>
    );
  }

  return (
    <ol className="relative border-l border-dashed border-border pl-6">
      {entries.map((entry) => {
        const lead = entry.status_snapshot.passengers[0];
        const category = getStatusCategory(lead?.current_status);
        return (
          <li key={entry.id} className="relative mb-6 last:mb-0">
            <span
              className={`absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full ring-4 ring-bg ${DOT_COLOR[category]}`}
              aria-hidden="true"
            />
            <p className="text-xs text-ink-muted">{formatIST(entry.checked_at)}</p>
            <p className="mt-0.5 text-sm font-medium text-ink">
              {statusLabel(lead?.current_status)}
              {entry.changed && (
                <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
                  Changed
                </span>
              )}
            </p>
            {lead?.current_status_details && (
              <p className="mt-0.5 text-xs text-ink-muted">{lead.current_status_details}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
