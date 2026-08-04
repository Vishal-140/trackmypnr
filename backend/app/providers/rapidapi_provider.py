"""
RapidAPIPNRProvider — concrete PNRProvider backed by the "IRCTC | Indian
Railway PNR Status" API on RapidAPI (Section 5).

Never hardcode the key/host — both come from Settings, which reads them
from PNR_API_KEY / PNR_API_HOST env vars.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import httpx

from app.core.config import Settings
from app.models.schemas import NormalizedPNRStatus, Passenger
from app.providers.pnr_provider_base import (
    PNRNotFoundError,
    PNRProvider,
    PNRProviderError,
)
from app.services.probability import estimate_confirmation_probability

IST = timezone(timedelta(hours=5, minutes=30))

# The provider's timestamp format, e.g. "Aug 12, 2026 5:50:00 PM".
_PROVIDER_DT_FORMATS = (
    "%b %d, %Y %I:%M:%S %p",
    "%b %d, %Y %H:%M:%S",
)


def _parse_provider_datetime(value: Optional[str]) -> Optional[datetime]:
    """Parse an IRCTC-style local timestamp string as IST, then convert to
    UTC — timestamps are stored in UTC everywhere (Section 20) and only
    converted to IST for display, on the frontend.
    """
    if not value:
        return None
    for fmt in _PROVIDER_DT_FORMATS:
        try:
            naive = datetime.strptime(value.strip(), fmt)
            ist_aware = naive.replace(tzinfo=IST)
            return ist_aware.astimezone(timezone.utc)
        except ValueError:
            continue
    return None


def _normalize_payload(pnr_number: str, data: dict[str, Any]) -> NormalizedPNRStatus:
    chart_prepared = str(data.get("chartStatus", "")).strip().lower() == "chart prepared"

    passengers: list[Passenger] = []
    for p in data.get("passengerList", []) or []:
        passengers.append(
            Passenger(
                number=p.get("passengerSerialNumber", len(passengers) + 1),
                current_status=p.get("currentStatus", "") or "",
                current_status_details=p.get("currentStatusDetails", "") or "",
                booking_status=p.get("bookingStatus"),
                booking_status_details=p.get("bookingStatusDetails"),
                coach=p.get("currentCoachId") or p.get("bookingCoachId"),
                seat=str(p.get("currentBerthNo") or p.get("bookingBerthNo") or "") or None,
                berth_code=p.get("currentBerthCode") or p.get("bookingBerthCode"),
                quota=p.get("passengerQuota"),
                waitlist_type=p.get("waitListType"),
            )
        )

    journey_date = _parse_provider_datetime(data.get("dateOfJourney"))
    arrival_date = _parse_provider_datetime(data.get("arrivalDate"))
    booked_on = _parse_provider_datetime(data.get("bookingDate"))

    # Confirmation probability: computed off the first passenger's current
    # status/quota (the common case is a single-passenger PNR; for
    # multi-passenger PNRs this reflects the lead passenger's chances).
    probability = None
    if passengers:
        lead = passengers[0]
        probability = estimate_confirmation_probability(
            quota=lead.quota or data.get("quota"),
            waitlist_type=lead.waitlist_type,
            journey_date=journey_date,
            current_status=lead.current_status,
        )

    fare_raw = data.get("bookingFare") or data.get("ticketFare")
    try:
        fare = float(fare_raw) if fare_raw is not None else None
    except (TypeError, ValueError):
        fare = None

    return NormalizedPNRStatus(
        pnr_number=data.get("pnrNumber", pnr_number),
        chart_prepared=chart_prepared,
        passengers=passengers,
        train_number=data.get("trainNumber"),
        train_name=data.get("trainName"),
        **{"class": data.get("journeyClass")},
        quota=data.get("quota"),
        from_station=data.get("sourceStation"),
        to_station=data.get("destinationStation"),
        boarding_station=data.get("boardingPoint"),
        reserved_upto=data.get("reservationUpto"),
        journey_date=journey_date,
        arrival_date=arrival_date,
        fare=fare,
        booked_on=booked_on,
        distance_km=data.get("distance"),
        vikalp_opted=str(data.get("vikalpStatus", "")).strip().lower() == "yes",
        raw_provider_timestamp=data.get("timeStamp"),
        confirmation_probability_percent=probability,
    )


class RapidAPIPNRProvider(PNRProvider):
    def __init__(self, settings: Settings, client: Optional[httpx.AsyncClient] = None) -> None:
        self._settings = settings
        self._client = client
        self._owns_client = client is None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(timeout=self._settings.pnr_api_timeout_seconds)
        return self._client

    async def aclose(self) -> None:
        if self._owns_client and self._client is not None:
            await self._client.aclose()

    async def fetch_status(self, pnr_number: str) -> NormalizedPNRStatus:
        if not self._settings.pnr_api_key:
            raise PNRProviderError("PNR_API_KEY is not configured")

        url = f"https://{self._settings.pnr_api_host}/getPNRStatus/{pnr_number}"
        headers = {
            "x-rapidapi-key": self._settings.pnr_api_key,
            "x-rapidapi-host": self._settings.pnr_api_host,
            "Content-Type": "application/json",
        }

        client = await self._get_client()
        try:
            resp = await client.get(url, headers=headers, timeout=self._settings.pnr_api_timeout_seconds)
        except httpx.TimeoutException as exc:
            raise PNRProviderError(f"Upstream PNR API timed out: {exc}") from exc
        except httpx.HTTPError as exc:
            raise PNRProviderError(f"Upstream PNR API request failed: {exc}") from exc

        if resp.status_code == 404:
            raise PNRNotFoundError(pnr_number)
        if resp.status_code >= 400:
            raise PNRProviderError(
                f"Upstream PNR API returned {resp.status_code}: {resp.text[:300]}"
            )

        try:
            payload = resp.json()
        except ValueError as exc:
            raise PNRProviderError("Upstream PNR API returned invalid JSON") from exc

        if not payload.get("success", False):
            raise PNRNotFoundError(pnr_number)

        data = payload.get("data")
        if not data:
            raise PNRNotFoundError(pnr_number)

        return _normalize_payload(pnr_number, data)
