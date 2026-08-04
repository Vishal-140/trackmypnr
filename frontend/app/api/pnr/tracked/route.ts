/**
 * GET /api/pnr/tracked
 *
 * List all tracked PNRs for the authenticated user, newest first.
 * Requires: Authorization: Bearer <firebase_id_token>
 *
 * Returns: TrackedPNR[]
 */
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
    .orderBy("createdAt", "desc")
    .get();

  // Batch updates for stale `active` fields (fire-and-forget, non-blocking)
  const updates: Promise<unknown>[] = [];

  const results = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
    const d = doc.data();
    const recomputedActive = isActive(d.journeyDate);
    if (recomputedActive !== d.active) {
      updates.push(doc.ref.update({ active: recomputedActive }));
      d.active = recomputedActive;
    }
    return {
      id: doc.id,
      pnr_number: d.pnrNumber,
      status: d.lastStatus as NormalizedPNRStatus,
      journey_date: d.journeyDate ?? null,
      active: d.active,
      last_checked_at: d.lastCheckedAt,
      created_at: d.createdAt,
    };
  });

  // Don't await — let Firestore updates happen in the background
  void Promise.allSettled(updates);

  return Response.json(results);
}
