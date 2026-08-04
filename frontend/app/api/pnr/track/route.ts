/**
 * POST /api/pnr/track
 *
 * Save a PNR to the user's "My PNRs" in Firestore.
 * Requires: Authorization: Bearer <firebase_id_token>
 *
 * Body: { pnr_number: string }  (exactly 10 digits)
 * Returns: TrackedPNR  (201)
 */
export const runtime = 'nodejs';
import {
  checkPnrCached,
  errorJson,
  requireAuth,
  PNRNotFoundError,
  PNRProviderError,
} from "@/lib/pnr-utils";
import {
  getAdminFirestore,
  TRACKED_PNRS_COLLECTION,
  HISTORY_SUBCOLLECTION,
} from "@/lib/firebase-admin";
import type { NormalizedPNRStatus } from "@/lib/types";
import { NextRequest } from 'next/server';
function isActive(journeyDate: string | null | undefined): boolean {
  if (!journeyDate) return true;
  return new Date(journeyDate).getTime() >= Date.now();
}

export async function POST(req: NextRequest) {
  // Auth
  let uid: string;
  try {
    uid = await requireAuth(req.headers.get("authorization"));
  } catch {
    return errorJson("UNAUTHORIZED", "Invalid or missing authentication token.", 401);
  }

  // Validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorJson("VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }

  const pnrNumber = (body as Record<string, unknown>)?.pnr_number;
  if (typeof pnrNumber !== "string" || !/^\d{10}$/.test(pnrNumber)) {
    return errorJson(
      "VALIDATION_ERROR",
      "Request did not pass validation. PNR numbers must be exactly 10 digits.",
      400
    );
  }

  // Fetch PNR status
  let status: NormalizedPNRStatus;
  try {
    status = await checkPnrCached(pnrNumber);
  } catch (err) {
    if (err instanceof PNRNotFoundError) {
      return errorJson("PNR_NOT_FOUND", (err as Error).message, 404);
    }
    if (err instanceof PNRProviderError) {
      return errorJson("UPSTREAM_ERROR", (err as Error).message, 502);
    }
    return errorJson("INTERNAL_ERROR", "An unexpected error occurred.", 500);
  }

  // Write to Firestore
  const db = getAdminFirestore();
  const now = new Date().toISOString();
  const docData = {
    userId: uid,
    pnrNumber,
    lastStatus: status,
    lastCheckedAt: now,
    journeyDate: status.journey_date ?? null,
    active: isActive(status.journey_date),
    createdAt: now,
  };

  const docRef = await db.collection(TRACKED_PNRS_COLLECTION).add(docData);

  // First history snapshot
  await docRef.collection(HISTORY_SUBCOLLECTION).add({
    statusSnapshot: status,
    checkedAt: now,
    changed: true,
  });

  return Response.json(
    {
      id: docRef.id,
      pnr_number: pnrNumber,
      status,
      journey_date: status.journey_date ?? null,
      active: docData.active,
      last_checked_at: now,
      created_at: now,
    },
    { status: 201 }
  );
}
