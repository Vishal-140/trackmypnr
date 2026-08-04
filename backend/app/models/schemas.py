"""
Pydantic models.

`NormalizedPNRStatus` is the internal shape every PNRProvider must return
(Section 5 "Normalized internal schema") — the rest of the app (DB storage,
diffing, API responses) is decoupled from any single vendor's field names.
"""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class Passenger(BaseModel):
    number: int
    current_status: str
    current_status_details: str
    booking_status: Optional[str] = None
    booking_status_details: Optional[str] = None
    coach: Optional[str] = None
    seat: Optional[str] = None
    berth_code: Optional[str] = None
    quota: Optional[str] = None
    waitlist_type: Optional[int] = None


class NormalizedPNRStatus(BaseModel):
    pnr_number: str
    chart_prepared: bool
    passengers: list[Passenger]
    train_number: Optional[str] = None
    train_name: Optional[str] = None
    train_class: Optional[str] = Field(default=None, alias="class")
    quota: Optional[str] = None
    from_station: Optional[str] = None
    to_station: Optional[str] = None
    boarding_station: Optional[str] = None
    reserved_upto: Optional[str] = None
    journey_date: Optional[datetime] = None
    arrival_date: Optional[datetime] = None
    fare: Optional[float] = None
    booked_on: Optional[datetime] = None
    distance_km: Optional[int] = None
    vikalp_opted: bool = False
    raw_provider_timestamp: Optional[str] = None

    # Differentiator feature (Section 5): only meaningful for WL/RAC tickets.
    confirmation_probability_percent: Optional[int] = None

    model_config = {"populate_by_name": True}


class CheckPNRRequest(BaseModel):
    pnr_number: str = Field(..., min_length=10, max_length=10, pattern=r"^\d{10}$")


class TrackPNRRequest(BaseModel):
    pnr_number: str = Field(..., min_length=10, max_length=10, pattern=r"^\d{10}$")


class TrackedPNRResponse(BaseModel):
    id: str
    pnr_number: str
    status: NormalizedPNRStatus
    journey_date: Optional[datetime] = None
    active: bool
    last_checked_at: datetime
    created_at: datetime


class HistoryEntryResponse(BaseModel):
    id: str
    status_snapshot: NormalizedPNRStatus
    checked_at: datetime
    changed: bool


class ErrorResponse(BaseModel):
    error: bool = True
    code: str
    message: str
