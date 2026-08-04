/**
 * Shared PNR utilities for Next.js API routes.
 *
 * - Calls the RapidAPI IRCTC PNR endpoint
 * - Normalises the raw response into NormalizedPNRStatus
 * - Computes confirmation probability heuristic
 *
 * Mirrors the Python logic in:
 *   backend/app/providers/rapidapi_provider.py
 *   backend/app/services/probability.py
 */
import type { NormalizedPNRStatus, Passenger } from "@/lib/types";

// ---------------------------------------------------------------------------
// Probability heuristic (mirrors backend/app/services/probability.py)
// ---------------------------------------------------------------------------

const QUOTA_BASE_WEIGHT: Record<string, number> = {
  GN: 0.72,
  GNWL: 0.72,
  TQ: 0.55,
  TQWL: 0.55,
  RLWL: 0.3,
  RLGN: 0.3,
  PQWL: 0.28,
  CK: 0.6,
  LD: 0.5,
};
const DEFAULT_BASE_WEIGHT = 0.45;

function daysUntil(journeyDate: string | null | undefined): number {
  if (!journeyDate) return 3;
  const delta = (new Date(journeyDate).getTime() - Date.now()) / 86_400_000;
  return Math.max(Math.floor(delta), 0);
}

export function estimateConfirmationProbability(
  quota: string | null | undefined,
  waitlistType: number | null | undefined,
  journeyDate: string | null | undefined,
  currentStatus: string
): number | null {
  const status = (currentStatus || "").toUpperCase();
  if (status === "CNF") return null;
  if (status === "CAN" || status === "CANCELLED") return null;

  const base =
    QUOTA_BASE_WEIGHT[(quota || "").toUpperCase()] ?? DEFAULT_BASE_WEIGHT;

  const daysLeft = daysUntil(journeyDate);
  const timeFactor = Math.min(daysLeft / 10.0, 1.0) * 0.2;

  let positionPenalty = 0;
  if (waitlistType) {
    if (waitlistType <= 5) positionPenalty = 0;
    else if (waitlistType <= 20) positionPenalty = 0.1;
    else if (waitlistType <= 50) positionPenalty = 0.25;
    else positionPenalty = 0.4;
  }

  const racBonus = status.includes("RAC") ? 0.15 : 0;
  const prob = Math.min(
    Math.max(base + timeFactor + racBonus - positionPenalty, 0.05),
    0.97
  );
  return Math.round(prob * 100);
}

// ---------------------------------------------------------------------------
// Date parsing helper (mirrors _parse_provider_datetime in rapidapi_provider)
// ---------------------------------------------------------------------------

const DT_FORMATS = [
  // "Aug 12, 2026 5:50:00 PM"
  /^(\w{3})\s+(\d{1,2}),\s+(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s+(AM|PM)$/i,
];

function parseProviderDatetime(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  // Try native parse first (often works for ISO strings returned by some calls)
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) return d.toISOString();

  // Manual parse for "Aug 12, 2026 5:50:00 PM" style (IST, convert to UTC)
  const match = DT_FORMATS[0].exec(trimmed);
  if (match) {
    const months: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    };
    const [, mon, day, year, hr, min, sec, ampm] = match;
    let hour = parseInt(hr, 10);
    if (ampm.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;
    // IST = UTC+5:30
    const istMs = Date.UTC(
      parseInt(year, 10),
      months[mon.toLowerCase()],
      parseInt(day, 10),
      hour,
      parseInt(min, 10),
      parseInt(sec, 10)
    );
    const utcMs = istMs - 5.5 * 3600 * 1000;
    return new Date(utcMs).toISOString();
  }
  return null;
}

// ---------------------------------------------------------------------------
// RapidAPI call + normalization
// ---------------------------------------------------------------------------

export class PNRNotFoundError extends Error {
  constructor(pnr: string) {
    super(`No record found for PNR ${pnr}`);
    this.name = "PNRNotFoundError";
  }
}

export class PNRProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PNRProviderError";
  }
}

function normalizePayload(
  pnrNumber: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
): NormalizedPNRStatus {
  const chartPrepared =
    String(data.chartStatus ?? "").trim().toLowerCase() === "chart prepared";

  const passengers: Passenger[] = (data.passengerList ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: Record<string, any>, idx: number) => ({
      number: p.passengerSerialNumber ?? idx + 1,
      current_status: p.currentStatus ?? "",
      current_status_details: p.currentStatusDetails ?? "",
      booking_status: p.bookingStatus ?? null,
      booking_status_details: p.bookingStatusDetails ?? null,
      coach: p.currentCoachId ?? p.bookingCoachId ?? null,
      seat: String(p.currentBerthNo ?? p.bookingBerthNo ?? "") || null,
      berth_code: p.currentBerthCode ?? p.bookingBerthCode ?? null,
      quota: p.passengerQuota ?? null,
      waitlist_type: p.waitListType ?? null,
    })
  );

  const journeyDate = parseProviderDatetime(data.dateOfJourney);
  const arrivalDate = parseProviderDatetime(data.arrivalDate);
  const bookedOn = parseProviderDatetime(data.bookingDate);

  let probability: number | null = null;
  if (passengers.length > 0) {
    const lead = passengers[0];
    probability = estimateConfirmationProbability(
      lead.quota ?? data.quota,
      lead.waitlist_type,
      journeyDate,
      lead.current_status
    );
  }

  let fare: number | null = null;
  const fareRaw = data.bookingFare ?? data.ticketFare;
  if (fareRaw != null) {
    const parsed = parseFloat(String(fareRaw));
    if (!isNaN(parsed)) fare = parsed;
  }

  return {
    pnr_number: data.pnrNumber ?? pnrNumber,
    chart_prepared: chartPrepared,
    passengers,
    train_number: data.trainNumber ?? null,
    train_name: data.trainName ?? null,
    class: data.journeyClass ?? null,
    quota: data.quota ?? null,
    from_station: data.sourceStation ?? null,
    to_station: data.destinationStation ?? null,
    boarding_station: data.boardingPoint ?? null,
    reserved_upto: data.reservationUpto ?? null,
    journey_date: journeyDate,
    arrival_date: arrivalDate,
    fare,
    booked_on: bookedOn,
    distance_km: data.distance ?? null,
    vikalp_opted:
      String(data.vikalpStatus ?? "").trim().toLowerCase() === "yes",
    raw_provider_timestamp: data.timeStamp ?? null,
    confirmation_probability_percent: probability,
  };
}

/** Fetch live PNR status from RapidAPI and return normalized result. */
export async function fetchPnrStatus(
  pnrNumber: string
): Promise<NormalizedPNRStatus> {
  const apiKey = process.env.PNR_API_KEY;
  const apiHost =
    process.env.PNR_API_HOST ??
    "irctc-indian-railway-pnr-status.p.rapidapi.com";

  if (!apiKey) {
    throw new PNRProviderError("PNR_API_KEY environment variable is not set.");
  }

  const url = `https://${apiHost}/getPNRStatus/${pnrNumber}`;
  let resp: Response;
  try {
    resp = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
        "Content-Type": "application/json",
      },
      // Abort after 8 seconds
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    throw new PNRProviderError(`Upstream PNR API request failed: ${err}`);
  }

  if (resp.status === 404) throw new PNRNotFoundError(pnrNumber);
  if (resp.status >= 400) {
    const text = await resp.text();
    throw new PNRProviderError(
      `Upstream PNR API returned ${resp.status}: ${text.slice(0, 300)}`
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await resp.json();
  } catch {
    throw new PNRProviderError("Upstream PNR API returned invalid JSON");
  }

  if (!payload.success) throw new PNRNotFoundError(pnrNumber);
  const data = payload.data as Record<string, unknown> | null;
  if (!data) throw new PNRNotFoundError(pnrNumber);

  return normalizePayload(pnrNumber, data as Record<string, unknown>);
}

// ---------------------------------------------------------------------------
// Simple in-process TTL cache (2-minute window, same as Python backend)
// ---------------------------------------------------------------------------

interface CacheEntry {
  value: NormalizedPNRStatus;
  expiresAt: number;
}

const _cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 120_000; // 2 minutes

export function cacheGet(key: string): NormalizedPNRStatus | null {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    _cache.delete(key);
    return null;
  }
  return entry.value;
}

export function cacheSet(key: string, value: NormalizedPNRStatus): void {
  _cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

/** Fetch with cache. */
export async function checkPnrCached(
  pnrNumber: string
): Promise<NormalizedPNRStatus> {
  const key = `pnr:${pnrNumber}`;
  const cached = cacheGet(key);
  if (cached) return cached;
  const status = await fetchPnrStatus(pnrNumber);
  cacheSet(key, status);
  return status;
}

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

/** Extract uid from Authorization: Bearer <token> header via Firebase Admin. */
export async function requireAuth(
  authHeader: string | null
): Promise<string> {
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    throw new Error("Missing bearer token");
  }
  const token = authHeader.split(" ", 2)[1]?.trim();
  if (!token) throw new Error("Missing bearer token");

  const { verifyIdToken } = await import("@/lib/firebase-admin");
  return verifyIdToken(token);
}

// ---------------------------------------------------------------------------
// Error response helper
// ---------------------------------------------------------------------------

export function errorJson(
  code: string,
  message: string,
  status: number
): Response {
  return Response.json({ error: true, code, message }, { status });
}
