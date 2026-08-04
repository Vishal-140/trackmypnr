import { getStatusCategory, statusLabel, type StatusCategory } from "@/lib/utils";

const CATEGORY_CLASSES: Record<StatusCategory, string> = {
  cnf: "bg-status-cnf-bg text-status-cnf",
  rac: "bg-status-rac-bg text-status-rac",
  wl: "bg-status-wl-bg text-status-wl",
  unknown: "bg-ink/5 text-ink-muted",
};

export function StatusBadge({ status }: { status?: string | null }) {
  const category = getStatusCategory(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${CATEGORY_CLASSES[category]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {statusLabel(status)}
    </span>
  );
}
