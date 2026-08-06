/**
 * GET /api/pnr/tracked/[id]/history
 *
 * Return the status-snapshot history for a tracked PNR
 * (must be owned by the authenticated user), newest first.
 * Requires: Authorization: Bearer <firebase_id_token>
 *
 * Returns: HistoryEntry[]
 */
export const runtime = 'nodejs';
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { NextRequest } from "next/server";
import { errorJson, requireAuth } from "@/lib/pnr-utils";
import {
  getAdminFirestore,
  TRACKED_PNRS_COLLECTION,
  HISTORY_SUBCOLLECTION,
} from "@/lib/firebase-admin";
import type { NormalizedPNRStatus } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let uid: string;
  try {
    uid = await requireAuth(req.headers.get("authorization"));
  } catch {
    return errorJson("UNAUTHORIZED", "Invalid or missing authentication token.", 401);
  }

  const { id } = await params;
  const db = getAdminFirestore();
  const docRef = db.collection(TRACKED_PNRS_COLLECTION).doc(id);
  const snap = await docRef.get();

  if (!snap.exists || snap.data()?.userId !== uid) {
    return errorJson("NOT_FOUND", "Tracked PNR not found.", 404);
  }

  const historySnap = await docRef
    .collection(HISTORY_SUBCOLLECTION)
    .orderBy("checkedAt", "desc")
    .get();

  const entries = historySnap.docs.map((doc: QueryDocumentSnapshot) => {
    const d = doc.data();
    return {
      id: doc.id,
      status_snapshot: d.statusSnapshot as NormalizedPNRStatus,
      checked_at: d.checkedAt,
      changed: d.changed ?? false,
    };
  });

  return Response.json(entries);
}
