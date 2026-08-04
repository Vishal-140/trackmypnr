"""
FastAPI routes — Section 6 of the spec.

| Method | Endpoint                          | Purpose                        | Auth              |
|--------|------------------------------------|---------------------------------|-------------------|
| POST   | /api/pnr/check                    | One-off lookup, no save        | none              |
| POST   | /api/pnr/track                    | Save PNR to "My PNRs"          | Firebase ID token |
| GET    | /api/pnr/tracked                  | List user's saved PNRs         | Firebase ID token |
| DELETE | /api/pnr/tracked/{id}             | Remove a saved PNR             | Firebase ID token |
| GET    | /api/pnr/tracked/{id}/history     | Status snapshot history        | Firebase ID token |
"""
# NOTE: deliberately NOT using `from __future__ import annotations` here —
# combined with slowapi's @limiter.limit decorator it causes FastAPI to lose
# track of the Pydantic body model's type (falls back to treating it as a
# query param). Every other module in this codebase uses postponed
# evaluation of annotations; this file is the one exception, and it's
# exempted for that specific reason.
from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.auth.firebase_auth import get_current_uid
from app.core.config import get_settings
from app.models.schemas import (
    CheckPNRRequest,
    HistoryEntryResponse,
    NormalizedPNRStatus,
    TrackedPNRResponse,
    TrackPNRRequest,
)
from app.providers.pnr_provider_base import PNRNotFoundError, PNRProviderError
from app.providers.rapidapi_provider import RapidAPIPNRProvider
from app.services import pnr_service
from app.services.pnr_service import NotFoundError

router = APIRouter(prefix="/api/pnr", tags=["pnr"])
limiter = Limiter(key_func=get_remote_address)

settings = get_settings()


def get_provider() -> RapidAPIPNRProvider:
    # A fresh httpx.AsyncClient per request is fine at this traffic scale;
    # revisit with a shared client/connection pool if load grows.
    return RapidAPIPNRProvider(settings)


def _error(code: str, message: str, status_code: int) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"error": True, "code": code, "message": message},
    )


@router.post("/check", response_model=NormalizedPNRStatus)
@limiter.limit(settings.check_rate_limit)
async def check_pnr(request: Request, body: CheckPNRRequest):
    provider = get_provider()
    try:
        return await pnr_service.check_pnr(provider, body.pnr_number)
    except PNRNotFoundError:
        return _error("PNR_NOT_FOUND", f"No record found for PNR {body.pnr_number}.", 404)
    except PNRProviderError as exc:
        return _error("UPSTREAM_ERROR", str(exc), 502)
    finally:
        await provider.aclose()


@router.post("/track", response_model=TrackedPNRResponse, status_code=201)
async def track_pnr(body: TrackPNRRequest, uid: str = Depends(get_current_uid)):
    provider = get_provider()
    try:
        return await pnr_service.track_pnr(provider, uid, body.pnr_number)
    except PNRNotFoundError:
        return _error("PNR_NOT_FOUND", f"No record found for PNR {body.pnr_number}.", 404)
    except PNRProviderError as exc:
        return _error("UPSTREAM_ERROR", str(exc), 502)
    finally:
        await provider.aclose()


@router.get("/tracked", response_model=list[TrackedPNRResponse])
async def list_tracked(uid: str = Depends(get_current_uid)):
    return await pnr_service.list_tracked_pnrs(uid)


@router.delete("/tracked/{tracked_id}", status_code=204)
async def remove_tracked(tracked_id: str, uid: str = Depends(get_current_uid)):
    try:
        await pnr_service.remove_tracked_pnr(uid, tracked_id)
    except NotFoundError:
        return _error("NOT_FOUND", "Tracked PNR not found.", 404)
    return JSONResponse(status_code=204, content=None)


@router.get("/tracked/{tracked_id}/history", response_model=list[HistoryEntryResponse])
async def tracked_history(tracked_id: str, uid: str = Depends(get_current_uid)):
    try:
        return await pnr_service.get_tracked_pnr_history(uid, tracked_id)
    except NotFoundError:
        return _error("NOT_FOUND", "Tracked PNR not found.", 404)
