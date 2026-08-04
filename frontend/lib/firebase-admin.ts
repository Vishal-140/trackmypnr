/**
 * Firebase Admin SDK singleton — server-side only (Next.js API routes).
 *
 * Reads credentials from FIREBASE_SERVICE_ACCOUNT_JSON (Base64-encoded
 * service account JSON) — the same env var used by the Python backend,
 * so you only need one secret in Vercel.
 *
 * firebase-admin v12+ uses modular sub-package imports.
 */
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getFirebaseAdmin(): App {
  // Return existing app if already initialised (Next.js hot-reload safe).
  const apps = getApps();
  if (apps.length > 0) return apps[0];

  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!b64) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON env var is not set. " +
        "Add it in Vercel Environment Variables (Base64-encoded service account JSON)."
    );
  }

  const serviceAccount = JSON.parse(
    Buffer.from(b64, "base64").toString("utf-8")
  );

  return initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

/** Firebase Admin app instance (server-side). */
export function getAdminApp(): App {
  return getFirebaseAdmin();
}

/** Firestore client (server-side). */
export function getAdminFirestore(): ReturnType<typeof getFirestore> {
  getFirebaseAdmin();
  return getFirestore();
}

/** Verify a Firebase ID token and return the uid. Throws on failure. */
export async function verifyIdToken(token: string): Promise<string> {
  getFirebaseAdmin();
  const decoded = await getAuth().verifyIdToken(token);
  if (!decoded.uid) throw new Error("Token did not contain a uid");
  return decoded.uid;
}

export const TRACKED_PNRS_COLLECTION = "trackedPnrs";
export const HISTORY_SUBCOLLECTION = "history";
