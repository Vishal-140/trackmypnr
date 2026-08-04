import { getIdToken } from "@/lib/firebase";
import type {
  ApiErrorBody,
  HistoryEntry,
  NormalizedPNRStatus,
  TrackedPNR,
} from "@/lib/types";
import { ApiError } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = false, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = await getIdToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers: finalHeaders });

  if (!res.ok) {
    let body: ApiErrorBody;
    try {
      body = await res.json();
    } catch {
      body = { error: true, code: "UNKNOWN_ERROR", message: `Request failed with ${res.status}` };
    }
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export function checkPnr(pnrNumber: string): Promise<NormalizedPNRStatus> {
  return request<NormalizedPNRStatus>("/api/pnr/check", {
    method: "POST",
    body: JSON.stringify({ pnr_number: pnrNumber }),
  });
}

export function trackPnr(pnrNumber: string): Promise<TrackedPNR> {
  return request<TrackedPNR>("/api/pnr/track", {
    method: "POST",
    body: JSON.stringify({ pnr_number: pnrNumber }),
    auth: true,
  });
}

export function listTrackedPnrs(): Promise<TrackedPNR[]> {
  return request<TrackedPNR[]>("/api/pnr/tracked", { auth: true });
}

export function removeTrackedPnr(id: string): Promise<void> {
  return request<void>(`/api/pnr/tracked/${id}`, { method: "DELETE", auth: true });
}

export function getTrackedPnrHistory(id: string): Promise<HistoryEntry[]> {
  return request<HistoryEntry[]>(`/api/pnr/tracked/${id}/history`, { auth: true });
}
