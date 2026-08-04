"""
API endpoint tests (Section 11).

`/api/pnr/check` is exercised end-to-end against a mocked PNRProvider (no
network, no Firestore). The authenticated endpoints are exercised with
`get_current_uid` overridden and `pnr_service` functions monkeypatched, so
this suite runs without any live credentials.

For true integration coverage against real Firestore semantics, run these
against the Firebase Local Emulator Suite (`firebase emulators:start`) with
FIRESTORE_EMULATOR_HOST set — wired up in .github/workflows/ci.yml.
"""
from datetime import datetime, timezone
from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient

from app.auth.firebase_auth import get_current_uid
from app.models.schemas import NormalizedPNRStatus, Passenger, TrackedPNRResponse
from app.providers.pnr_provider_base import PNRNotFoundError
from app.services import pnr_service
import app.api.routes_pnr as routes_pnr
import main

client = TestClient(main.app)

SAMPLE_STATUS = NormalizedPNRStatus(
    pnr_number="2521703188",
    chart_prepared=False,
    passengers=[
        Passenger(
            number=1,
            current_status="CNF",
            current_status_details="CNF/HA1/2/UB",
            coach="HA1",
            seat="2",
            berth_code="UB",
            quota="GN",
            waitlist_type=0,
        )
    ],
    train_number="20962",
    train_name="BNRS UDN SF EXP",
)


def test_check_pnr_rejects_invalid_pnr_format():
    resp = client.post("/api/pnr/check", json={"pnr_number": "123"})
    assert resp.status_code == 400
    body = resp.json()
    assert body["error"] is True
    assert body["code"] == "VALIDATION_ERROR"


def test_check_pnr_success(monkeypatch):
    async def fake_fetch_status(self, pnr_number):
        return SAMPLE_STATUS

    monkeypatch.setattr(
        "app.providers.rapidapi_provider.RapidAPIPNRProvider.fetch_status", fake_fetch_status
    )
    resp = client.post("/api/pnr/check", json={"pnr_number": "2521703188"})
    assert resp.status_code == 200
    assert resp.json()["pnr_number"] == "2521703188"


def test_check_pnr_not_found(monkeypatch):
    async def fake_fetch_status(self, pnr_number):
        raise PNRNotFoundError(pnr_number)

    monkeypatch.setattr(
        "app.providers.rapidapi_provider.RapidAPIPNRProvider.fetch_status", fake_fetch_status
    )
    resp = client.post("/api/pnr/check", json={"pnr_number": "9999999999"})
    assert resp.status_code == 404
    assert resp.json()["code"] == "PNR_NOT_FOUND"


def test_tracked_endpoints_require_auth():
    # No Authorization header at all.
    assert client.get("/api/pnr/tracked").status_code == 401
    assert client.post("/api/pnr/track", json={"pnr_number": "2521703188"}).status_code == 401
    assert client.delete("/api/pnr/tracked/some-id").status_code == 401
    assert client.get("/api/pnr/tracked/some-id/history").status_code == 401


def test_list_tracked_returns_only_authenticated_users_data(monkeypatch):
    now = datetime.now(timezone.utc)
    fake_result = [
        TrackedPNRResponse(
            id="doc1",
            pnr_number="2521703188",
            status=SAMPLE_STATUS,
            journey_date=now,
            active=True,
            last_checked_at=now,
            created_at=now,
        )
    ]

    async def fake_list_tracked_pnrs(uid):
        assert uid == "test-uid-123"
        return fake_result

    monkeypatch.setattr(pnr_service, "list_tracked_pnrs", fake_list_tracked_pnrs)
    main.app.dependency_overrides[get_current_uid] = lambda: "test-uid-123"
    try:
        resp = client.get("/api/pnr/tracked")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) == 1
        assert data[0]["pnr_number"] == "2521703188"
    finally:
        main.app.dependency_overrides.pop(get_current_uid, None)


def test_health_check():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}
