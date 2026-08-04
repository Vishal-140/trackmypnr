/**
 * POST /api/pnr/check
 *
 * One-off PNR lookup — no authentication required.
 * Rate-limited to 10 req/min by Next.js edge middleware (see middleware.ts).
 *
 * Body: { pnr_number: string }  (exactly 10 digits)
 * Returns: NormalizedPNRStatus
 */
import { NextRequest } from "next/server";
import {
  checkPnrCached,
  errorJson,
  PNRNotFoundError,
  PNRProviderError,
} from "@/lib/pnr-utils";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorJson("VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }

  const pnrNumber = (body as Record<string, unknown>)?.pnr_number;
  if (
    typeof pnrNumber !== "string" ||
    !/^\d{10}$/.test(pnrNumber)
  ) {
    return errorJson(
      "VALIDATION_ERROR",
      "Request did not pass validation. PNR numbers must be exactly 10 digits.",
      400
    );
  }

  try {
    const status = await checkPnrCached(pnrNumber);
    return Response.json(status);
  } catch (err) {
    if (err instanceof PNRNotFoundError) {
      return errorJson("PNR_NOT_FOUND", err.message, 404);
    }
    if (err instanceof PNRProviderError) {
      return errorJson("UPSTREAM_ERROR", err.message, 502);
    }
    return errorJson("INTERNAL_ERROR", "An unexpected error occurred.", 500);
  }
}
