// Mirrors backend/app/models/schemas.py — keep in sync manually since the
// two apps don't share a codegen step yet.

export interface Passenger {
  number: number;
  current_status: string;
  current_status_details: string;
  booking_status?: string | null;
  booking_status_details?: string | null;
  coach?: string | null;
  seat?: string | null;
  berth_code?: string | null;
  quota?: string | null;
  waitlist_type?: number | null;
}

export interface NormalizedPNRStatus {
  pnr_number: string;
  chart_prepared: boolean;
  passengers: Passenger[];
  train_number?: string | null;
  train_name?: string | null;
  class?: string | null;
  quota?: string | null;
  from_station?: string | null;
  to_station?: string | null;
  boarding_station?: string | null;
  reserved_upto?: string | null;
  journey_date?: string | null;
  arrival_date?: string | null;
  fare?: number | null;
  booked_on?: string | null;
  distance_km?: number | null;
  vikalp_opted: boolean;
  raw_provider_timestamp?: string | null;
  confirmation_probability_percent?: number | null;
}

export interface TrackedPNR {
  id: string;
  pnr_number: string;
  status: NormalizedPNRStatus;
  journey_date?: string | null;
  active: boolean;
  last_checked_at: string;
  created_at: string;
}

export interface HistoryEntry {
  id: string;
  status_snapshot: NormalizedPNRStatus;
  checked_at: string;
  changed: boolean;
}

export interface ApiErrorBody {
  error: true;
  code: string;
  message: string;
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.code = body.code;
    this.status = status;
  }
}
