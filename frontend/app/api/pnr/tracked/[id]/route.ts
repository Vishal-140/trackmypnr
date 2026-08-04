/**
 * DELETE /api/pnr/tracked/[id]
 *
 * Remove a tracked PNR (must be owned by the authenticated user).
 * Requires: Authorization: Bearer <firebase_id_token>
 *
 * Returns: 204 No Content
 */
import { NextRequest } from "next/server";
import { errorJson, requireAuth } from "@/lib/pnr-utils";
import {
  getAdminFirestore,
  TRACKED_PNRS_COLLECTION,
} from "@/lib/firebase-admin";

export async function DELETE(
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

  await docRef.delete();
  return new Response(null, { status: 204 });
}
