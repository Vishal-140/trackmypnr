/**
 * GET /api/pnr/tracked
 *
 * List all tracked PNRs for the authenticated user, newest first.
 * Requires: Authorization: Bearer <firebase_id_token>
 *
 * Returns: TrackedPNR[]
 */
export const runtime = 'nodejs';
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { NextRequest } from "next/server";
import { errorJson, requireAuth } from "@/lib/pnr-utils";
import {
  getAdminFirestore,
  TRACKED_PNRS_COLLECTION,
} from "@/lib/firebase-admin";
import type { NormalizedPNRStatus } from "@/lib/types";

function isActive(journeyDate: string | null | undefined): boolean {
  if (!journeyDate) return true;
  return new Date(journeyDate).getTime() >= Date.now();
}

/**
 * Recursively convert ALL Firestore Timestamp variants to ISO strings.
 * Handles two cases:
 *  1. Firestore Admin SDK Timestamp objects (have .toDate() method)
 *  2. Plain objects with {_seconds, _nanoseconds} — already-serialized Timestamps
 */
function deepSerialize(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  // Case 1: Firestore Admin Timestamp (has toDate() method)
  if (typeof (value as any).toDate === "function") {
    return (value as any).toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(deepSerialize);
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;

    // Case 2: Plain object that is a serialized Timestamp {_seconds, _nanoseconds}
    if (
      "_seconds" in obj &&
      "_nanoseconds" in obj &&
      Object.keys(obj).length === 2
    ) {
      const seconds = obj._seconds as number;
      const nanoseconds = obj._nanoseconds as number;
      return new Date(seconds * 1000 + nanoseconds / 1_000_000).toISOString();
    }

    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = deepSerialize(v);
    }
    return out;
  }

  return value;
}

export async function GET(req: NextRequest) {
  let uid: string;
  try {
    uid = await requireAuth(req.headers.get("authorization"));
  } catch {
    return errorJson("UNAUTHORIZED", "Invalid or missing authentication token.", 401);
  }

  const db = getAdminFirestore();
  const snapshot = await db
    .collection(TRACKED_PNRS_COLLECTION)
    .where("userId", "==", uid)
    .get();

  // Batch updates for stale `active` fields (fire-and-forget, non-blocking)
  const updates: Promise<unknown>[] = [];

  const results = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
    // Deep-serialize the entire Firestore document data at once so no
    // Timestamp field (including nested ones inside lastStatus) slips through.
    const d = deepSerialize(doc.data()) as Record<string, any>;

    const recomputedActive = isActive(d.journeyDate);
    if (recomputedActive !== doc.data().active) {
      updates.push(doc.ref.update({ active: recomputedActive }));
    }

    return {
      id: doc.id,
      pnr_number: d.pnrNumber as string,
      status: d.lastStatus as NormalizedPNRStatus,
      journey_date: (d.journeyDate as string | null) ?? null,
      active: recomputedActive,
      last_checked_at: (d.lastCheckedAt as string | null) ?? null,
      created_at: (d.createdAt as string | null) ?? null,
    };
  });

  // Sort newest first in memory — avoids needing a Firestore composite index
  results.sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });

  // Deduplicate by pnr_number (keep the newest entry per PNR number)
  const uniqueResults: typeof results = [];
  const seenPnrs = new Set<string>();

  for (const item of results) {
    if (!seenPnrs.has(item.pnr_number)) {
      seenPnrs.add(item.pnr_number);
      uniqueResults.push(item);
    }
  }

  // Don't await — let Firestore updates happen in the background
  void Promise.allSettled(updates);

  return Response.json(uniqueResults);
}

