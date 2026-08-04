"""
In-process TTL cache for repeat PNR lookups (Section 9).

A simple wrapper around cachetools.TTLCache. This is intentionally
in-process/in-memory only — good enough for a single free-tier Render
instance; if the service is ever scaled to multiple instances, this should
be swapped for a shared cache (e.g. Redis) since each instance would
otherwise have its own cold cache.
"""
from __future__ import annotations

from typing import Any, Optional

from cachetools import TTLCache

from app.core.config import get_settings

settings = get_settings()

_pnr_cache: TTLCache = TTLCache(maxsize=settings.cache_max_size, ttl=settings.cache_ttl_seconds)


def cache_get(key: str) -> Optional[Any]:
    return _pnr_cache.get(key)


def cache_set(key: str, value: Any) -> None:
    _pnr_cache[key] = value


def cache_clear() -> None:
    _pnr_cache.clear()


def cache_stats() -> dict:
    return {
        "size": len(_pnr_cache),
        "maxsize": _pnr_cache.maxsize,
        "ttl_seconds": _pnr_cache.ttl,
    }
