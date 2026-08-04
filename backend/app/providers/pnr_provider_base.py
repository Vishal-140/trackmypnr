"""
PNRProvider abstraction (Section 5).

Any concrete provider (RapidAPI today, something else tomorrow) implements
this interface so business logic never depends on a specific vendor's
request/response shape.
"""
from __future__ import annotations

from abc import ABC, abstractmethod

from app.models.schemas import NormalizedPNRStatus


class PNRProviderError(Exception):
    """Raised when the upstream provider fails, times out, or returns an
    unexpected/invalid payload. Callers translate this into a 502 response."""


class PNRNotFoundError(Exception):
    """Raised when the provider explicitly reports the PNR does not exist."""


class PNRProvider(ABC):
    @abstractmethod
    async def fetch_status(self, pnr_number: str) -> NormalizedPNRStatus:
        """Fetch and normalize the current status for a 10-digit PNR."""
        raise NotImplementedError
