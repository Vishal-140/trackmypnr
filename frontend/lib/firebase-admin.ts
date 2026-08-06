/**
 * Firebase Admin SDK singleton — server-side only (Next.js API routes).
 *
 * Reads credentials from FIREBASE_SERVICE_ACCOUNT_JSON (Base64-encoded
 * service account JSON).
 *
 * Token verification uses `jose` directly (ESM import) to avoid the
 * firebase-admin → jwks-rsa → require('jose') ERR_REQUIRE_ESM crash that
 * occurs when Turbopack bundles firebase-admin on Vercel.
 */
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// ---------------------------------------------------------------------------
// Firebase Admin app (Firestore only — auth is handled via jose below)
// ---------------------------------------------------------------------------

function getFirebaseAdmin(): App {
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

// ---------------------------------------------------------------------------
// Token verification via jose (pure ESM — avoids jwks-rsa CJS require issue)
// ---------------------------------------------------------------------------

/**
 * Verify a Firebase ID token using jose + Google's public JWKS endpoint.
 * This bypasses firebase-admin/auth entirely, eliminating the
 * jwks-rsa → require('jose') ERR_REQUIRE_ESM crash on Vercel/Turbopack.
 */
export async function verifyIdToken(token: string): Promise<string> {
  const { createRemoteJWKSet, jwtVerify } = await import("jose");

  const projectId =
    process.env.FIREBASE_PROJECT_ID ??
    (() => {
      throw new Error("FIREBASE_PROJECT_ID env var is not set.");
    })();

  const JWKS = createRemoteJWKSet(
    new URL(
      "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
    )
  );

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  if (!payload.sub) throw new Error("Token did not contain a uid");
  return payload.sub;
}

export const TRACKED_PNRS_COLLECTION = "trackedPnrs";
export const HISTORY_SUBCOLLECTION = "history";
