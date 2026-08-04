"""
Auth tests (Section 11): verify endpoints correctly reject requests with
missing/invalid Firebase ID tokens (401), independent of any live Firebase
project.
"""
import pytest
from fastapi import HTTPException

from app.auth.firebase_auth import get_current_uid


@pytest.mark.asyncio
async def test_missing_header_raises_401():
    with pytest.raises(HTTPException) as exc_info:
        await get_current_uid(authorization=None)
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail["code"] == "UNAUTHORIZED"


@pytest.mark.asyncio
async def test_malformed_header_raises_401():
    with pytest.raises(HTTPException) as exc_info:
        await get_current_uid(authorization="NotBearer sometoken")
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_empty_bearer_token_raises_401():
    with pytest.raises(HTTPException) as exc_info:
        await get_current_uid(authorization="Bearer ")
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_invalid_token_raises_401(monkeypatch):
    def fake_verify_id_token(token):
        raise ValueError("invalid signature")

    monkeypatch.setattr(
        "app.auth.firebase_auth.firebase_auth.verify_id_token", fake_verify_id_token
    )
    monkeypatch.setattr("app.auth.firebase_auth.get_firebase_app", lambda: None)

    with pytest.raises(HTTPException) as exc_info:
        await get_current_uid(authorization="Bearer bad-token")
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_valid_token_returns_uid(monkeypatch):
    def fake_verify_id_token(token):
        assert token == "good-token"
        return {"uid": "abc123"}

    monkeypatch.setattr(
        "app.auth.firebase_auth.firebase_auth.verify_id_token", fake_verify_id_token
    )
    monkeypatch.setattr("app.auth.firebase_auth.get_firebase_app", lambda: None)

    uid = await get_current_uid(authorization="Bearer good-token")
    assert uid == "abc123"
