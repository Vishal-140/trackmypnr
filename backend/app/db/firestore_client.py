"""
Firebase Admin SDK initialization + Firestore client access.

Initialized once, lazily, from the service account credentials in Settings
(base64 env var or a mounted secret file — see config.py). Never commit the
service account JSON to git; it's treated like a password (Section 12).
"""
from __future__ import annotations

from functools import lru_cache

import firebase_admin
from firebase_admin import credentials, firestore

from app.core.config import get_settings


@lru_cache
def get_firebase_app() -> firebase_admin.App:
    settings = get_settings()
    creds_dict = settings.firebase_credentials_dict()
    if creds_dict is None:
        raise RuntimeError(
            "Firebase credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON "
            "(base64-encoded service account JSON) or FIREBASE_SERVICE_ACCOUNT_FILE."
        )
    cred = credentials.Certificate(creds_dict)
    options = {"projectId": settings.firebase_project_id} if settings.firebase_project_id else None
    try:
        return firebase_admin.get_app()
    except ValueError:
        return firebase_admin.initialize_app(cred, options)


@lru_cache
def get_firestore_client() -> firestore.Client:
    get_firebase_app()
    return firestore.client()


TRACKED_PNRS_COLLECTION = "trackedPnrs"
HISTORY_SUBCOLLECTION = "history"
