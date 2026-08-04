"""
Firebase ID token verification dependency.

Every authenticated endpoint expects `Authorization: Bearer <firebase_id_token>`.
We verify it via the Firebase Admin SDK and return the `uid`, which is used
to scope all Firestore reads/writes to the requesting user.
"""
from __future__ import annotations

from fastapi import Header, HTTPException
from firebase_admin import auth as firebase_auth

from app.db.firestore_client import get_firebase_app


class AuthError(HTTPException):
    def __init__(self, message: str = "Invalid or missing authentication token") -> None:
        super().__init__(
            status_code=401,
            detail={"error": True, "code": "UNAUTHORIZED", "message": message},
        )


async def get_current_uid(authorization: str | None = Header(default=None)) -> str:
    """FastAPI dependency: verifies the Firebase ID token and returns the uid.

    Raises 401 if the header is missing, malformed, or the token is invalid
    or expired.
    """
    if not authorization or not authorization.lower().startswith("bearer "):
        raise AuthError("Missing bearer token")

    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise AuthError("Missing bearer token")

    get_firebase_app()  # ensures the app is initialized before verifying
    try:
        decoded = firebase_auth.verify_id_token(token)
    except Exception as exc:  # firebase_admin raises several distinct error types
        raise AuthError(f"Token verification failed: {exc}") from exc

    uid = decoded.get("uid")
    if not uid:
        raise AuthError("Token did not contain a uid")
    return uid
