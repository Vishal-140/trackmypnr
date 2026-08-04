"""
pnr_service — business logic for checking, saving, listing, and removing
tracked PNRs, plus their status-snapshot history (Section 6, 9, 13).

Endpoints in app/api/routes_pnr.py stay thin; all Firestore/provider/cache
orchestration lives here so it's independently unit-testable.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from google.cloud.firestore_v1 import DocumentSnapshot

from app.core.cache import cache_get, cache_set
from app.db.firestore_client import (
    HISTORY_SUBCOLLECTION,
    TRACKED_PNRS_COLLECTION,
    get_firestore_client,
)
from app.models.schemas import (
    HistoryEntryResponse,
    NormalizedPNRStatus,
    TrackedPNRResponse,
)
from app.providers.pnr_provider_base import PNRProvider

# Fields that matter for "did the status meaningfully change" comparisons
# (also used by the Future Phase scheduler in Section 7 — kept here so the
# diff logic has exactly one implementation).
_MEANINGFUL_FIELDS = ("current_status", "current_status_details")


class NotFoundError(Exception):
    """Raised when a requested tracked-PNR document doesn't exist or isn't
    owned by the requesting user."""


def _is_active(journey_date: Optional[datetime]) -> bool:
    if journey_date is None:
        return True
    now = datetime.now(timezone.utc)
    jd = journey_date if journey_date.tzinfo else journey_date.replace(tzinfo=timezone.utc)
    return jd >= now


def snapshots_differ(previous: Optional[dict], current: NormalizedPNRStatus) -> bool:
    """Compare only the meaningful fields (Section 7) — ignores volatile
    provider metadata like raw_provider_timestamp so re-checks with an
    unchanged status don't get flagged as "changed"."""
    if previous is None:
        return True
    if previous.get("chart_prepared") != current.chart_prepared:
        return True
    prev_passengers = previous.get("passengers") or []
    curr_passengers = [p.model_dump() for p in current.passengers]
    if len(prev_passengers) != len(curr_passengers):
        return True
    for prev_p, curr_p in zip(prev_passengers, curr_passengers):
        for field in _MEANINGFUL_FIELDS:
            if prev_p.get(field) != curr_p.get(field):
                return True
    return False


async def check_pnr(provider: PNRProvider, pnr_number: str) -> NormalizedPNRStatus:
    """One-off lookup with TTL cache (Section 9) — no Firestore writes."""
    cache_key = f"pnr:{pnr_number}"
    cached = cache_get(cache_key)
    if cached is not None:
        return cached

    status = await provider.fetch_status(pnr_number)
    cache_set(cache_key, status)
    return status


def _tracked_doc_to_response(snap: DocumentSnapshot) -> TrackedPNRResponse:
    d = snap.to_dict()
    return TrackedPNRResponse(
        id=snap.id,
        pnr_number=d["pnrNumber"],
        status=NormalizedPNRStatus(**d["lastStatus"]),
        journey_date=d.get("journeyDate"),
        active=d.get("active", True),
        last_checked_at=d["lastCheckedAt"],
        created_at=d["createdAt"],
    )


async def track_pnr(provider: PNRProvider, uid: str, pnr_number: str) -> TrackedPNRResponse:
    """Fetch current status and save a new trackedPnrs document."""
    db = get_firestore_client()
    status = await check_pnr(provider, pnr_number)

    now = datetime.now(timezone.utc)
    doc_data = {
        "userId": uid,
        "pnrNumber": pnr_number,
        "lastStatus": status.model_dump(mode="json", by_alias=True),
        "lastCheckedAt": now,
        "journeyDate": status.journey_date,
        "active": _is_active(status.journey_date),
        "createdAt": now,
    }
    _, doc_ref = db.collection(TRACKED_PNRS_COLLECTION).add(doc_data)

    # First history snapshot.
    doc_ref.collection(HISTORY_SUBCOLLECTION).add(
        {
            "statusSnapshot": doc_data["lastStatus"],
            "checkedAt": now,
            "changed": True,
        }
    )

    return TrackedPNRResponse(
        id=doc_ref.id,
        pnr_number=pnr_number,
        status=status,
        journey_date=status.journey_date,
        active=doc_data["active"],
        last_checked_at=now,
        created_at=now,
    )


async def list_tracked_pnrs(uid: str) -> list[TrackedPNRResponse]:
    """List a user's saved PNRs, newest first. Recomputes `active` against
    today's date on read so archiving stays accurate without a background
    job (the Future Phase scheduler in Section 7 will also maintain this)."""
    db = get_firestore_client()
    query = (
        db.collection(TRACKED_PNRS_COLLECTION)
        .where("userId", "==", uid)
        .order_by("createdAt", direction="DESCENDING")
    )
    results: list[TrackedPNRResponse] = []
    for snap in query.stream():
        d = snap.to_dict()
        journey_date = d.get("journeyDate")
        recomputed_active = _is_active(journey_date)
        if recomputed_active != d.get("active", True):
            snap.reference.update({"active": recomputed_active})
            d["active"] = recomputed_active
        results.append(
            TrackedPNRResponse(
                id=snap.id,
                pnr_number=d["pnrNumber"],
                status=NormalizedPNRStatus(**d["lastStatus"]),
                journey_date=journey_date,
                active=d["active"],
                last_checked_at=d["lastCheckedAt"],
                created_at=d["createdAt"],
            )
        )
    return results


def _get_owned_doc(uid: str, tracked_id: str):
    db = get_firestore_client()
    doc_ref = db.collection(TRACKED_PNRS_COLLECTION).document(tracked_id)
    snap = doc_ref.get()
    if not snap.exists or snap.to_dict().get("userId") != uid:
        raise NotFoundError(tracked_id)
    return doc_ref, snap


async def remove_tracked_pnr(uid: str, tracked_id: str) -> None:
    doc_ref, _ = _get_owned_doc(uid, tracked_id)
    doc_ref.delete()


async def get_tracked_pnr_history(uid: str, tracked_id: str) -> list[HistoryEntryResponse]:
    doc_ref, _ = _get_owned_doc(uid, tracked_id)
    entries: list[HistoryEntryResponse] = []
    query = doc_ref.collection(HISTORY_SUBCOLLECTION).order_by("checkedAt", direction="DESCENDING")
    for snap in query.stream():
        d = snap.to_dict()
        entries.append(
            HistoryEntryResponse(
                id=snap.id,
                status_snapshot=NormalizedPNRStatus(**d["statusSnapshot"]),
                checked_at=d["checkedAt"],
                changed=d.get("changed", False),
            )
        )
    return entries
