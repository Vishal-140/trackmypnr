// Berth codes from the provider (e.g. "UB") are expanded to human-readable
// labels here, in the frontend only — the raw code is kept in DB/API
// (Section 5 mapping notes).
const BERTH_CODE_LABELS: Record<string, string> = {
  UB: "Upper Berth",
  LB: "Lower Berth",
  MB: "Middle Berth",
  SL: "Side Lower",
  SU: "Side Upper",
  SLR: "Side Lower (Reversed)",
  CB: "Cabin Berth",
  CS: "Cabin Seat",
  WS: "Window Seat",
};

export function berthCodeLabel(code?: string | null): string | null {
  if (!code) return null;
  return BERTH_CODE_LABELS[code.toUpperCase()] ?? code;
}

/**
 * All timestamps are stored/transmitted in UTC (Section 20); convert to IST
 * only at display time here on the frontend.
 */
export function formatIST(isoString?: string | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    ...opts,
  }).format(date);
}

export function formatISTDateOnly(isoString?: string | null): string {
  return formatIST(isoString, { hour: undefined, minute: undefined, hour12: undefined });
}

export type StatusCategory = "cnf" | "rac" | "wl" | "unknown";

/**
 * Buckets a raw provider status string into one of the three color-coded
 * categories used consistently across the badge, gauge, and timeline
 * (Section 19: "CNF = calm green, RAC = amber/orange, WL = rose").
 */
export function getStatusCategory(status?: string | null): StatusCategory {
  if (!status) return "unknown";
  const s = status.toUpperCase();
  if (s.includes("CNF") || s === "CONFIRMED") return "cnf";
  if (s.includes("RAC")) return "rac";
  if (s.includes("WL") || s.includes("WAITLIST")) return "wl";
  return "unknown";
}

export function statusLabel(status?: string | null): string {
  const category = getStatusCategory(status);
  switch (category) {
    case "cnf":
      return "Confirmed";
    case "rac":
      return "RAC";
    case "wl":
      return "Waitlisted";
    default:
      return status ?? "Unknown";
  }
}

export function isValidPnr(value: string): boolean {
  return /^\d{10}$/.test(value.trim());
}
