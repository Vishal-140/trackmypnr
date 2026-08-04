"""
Unit tests: PNRProvider response normalization, confirmation probability
calculation, and status-diff logic (Section 11).

These do not touch Firestore or the network — pure logic only.
"""
from datetime import datetime, timedelta, timezone

from app.providers.rapidapi_provider import _normalize_payload, _parse_provider_datetime
from app.services.probability import estimate_confirmation_probability
from app.services.pnr_service import snapshots_differ

SAMPLE_RAW_RESPONSE = {
    "pnrNumber": "2521703188",
    "dateOfJourney": "Aug 12, 2026 5:50:00 PM",
    "trainNumber": "20962",
    "trainName": "BNRS UDN SF EXP",
    "sourceStation": "BNRS",
    "destinationStation": "UJN",
    "reservationUpto": "UJN",
    "boardingPoint": "BNRS",
    "journeyClass": "2A",
    "numberOfpassenger": 1,
    "chartStatus": "Chart Not Prepared",
    "informationMessage": [""],
    "passengerList": [
        {
            "passengerSerialNumber": 1,
            "passengerQuota": "GN",
            "waitListType": 0,
            "bookingStatus": "CNF",
            "bookingCoachId": "HA1",
            "bookingBerthNo": 2,
            "bookingBerthCode": "UB",
            "bookingStatusDetails": "CNF/HA1/2/UB",
            "currentStatus": "CNF",
            "currentCoachId": "HA1",
            "currentBerthNo": 2,
            "currentBerthCode": "UB",
            "currentStatusDetails": "CNF/HA1/2/UB",
        }
    ],
    "timeStamp": "Aug 3, 2026 10:01:24 AM",
    "bookingFare": 2040,
    "ticketFare": 2040,
    "quota": "GN",
    "vikalpStatus": "Yes",
    "waitListType": 0,
    "bookingDate": "Jul 21, 2026 10:54:03 AM",
    "arrivalDate": "Aug 13, 2026 12:35:00 PM",
    "distance": 1054,
    "isWL": "N",
}


def test_parse_provider_datetime():
    dt = _parse_provider_datetime("Aug 12, 2026 5:50:00 PM")
    assert dt is not None
    # 5:50 PM IST == 12:20 PM UTC
    assert dt.tzinfo is not None
    assert dt.hour == 12
    assert dt.minute == 20


def test_parse_provider_datetime_handles_none():
    assert _parse_provider_datetime(None) is None
    assert _parse_provider_datetime("") is None


def test_normalize_payload_maps_fields_correctly():
    result = _normalize_payload("2521703188", SAMPLE_RAW_RESPONSE)
    assert result.pnr_number == "2521703188"
    assert result.chart_prepared is False
    assert result.train_number == "20962"
    assert result.train_class == "2A"
    assert result.vikalp_opted is True
    assert result.distance_km == 1054
    assert result.fare == 2040.0
    assert len(result.passengers) == 1
    passenger = result.passengers[0]
    assert passenger.current_status == "CNF"
    assert passenger.berth_code == "UB"
    assert passenger.quota == "GN"


def test_normalize_payload_chart_prepared_true():
    payload = dict(SAMPLE_RAW_RESPONSE, chartStatus="Chart Prepared")
    result = _normalize_payload("2521703188", payload)
    assert result.chart_prepared is True


def test_confirmed_passenger_has_no_probability():
    # CNF passenger -> nothing to predict.
    result = _normalize_payload("2521703188", SAMPLE_RAW_RESPONSE)
    assert result.confirmation_probability_percent is None


def test_waitlisted_passenger_gets_probability_estimate():
    future_date = datetime.now(timezone.utc) + timedelta(days=10)
    prob = estimate_confirmation_probability(
        quota="GNWL",
        waitlist_type=8,
        journey_date=future_date,
        current_status="WL",
    )
    assert prob is not None
    assert 0 <= prob <= 100


def test_probability_lower_for_worse_quota_and_higher_waitlist_number():
    future_date = datetime.now(timezone.utc) + timedelta(days=5)
    good = estimate_confirmation_probability(
        quota="GNWL", waitlist_type=3, journey_date=future_date, current_status="WL"
    )
    bad = estimate_confirmation_probability(
        quota="RLWL", waitlist_type=80, journey_date=future_date, current_status="WL"
    )
    assert good > bad


def test_rac_gets_a_bonus_over_equivalent_waitlist():
    future_date = datetime.now(timezone.utc) + timedelta(days=5)
    rac = estimate_confirmation_probability(
        quota="GNWL", waitlist_type=3, journey_date=future_date, current_status="RAC"
    )
    wl = estimate_confirmation_probability(
        quota="GNWL", waitlist_type=3, journey_date=future_date, current_status="WL"
    )
    assert rac >= wl


def test_snapshots_differ_true_when_no_previous():
    current = _normalize_payload("2521703188", SAMPLE_RAW_RESPONSE)
    assert snapshots_differ(None, current) is True


def test_snapshots_differ_false_when_only_timestamp_changes():
    current = _normalize_payload("2521703188", SAMPLE_RAW_RESPONSE)
    previous = current.model_dump(mode="json", by_alias=True)
    # Simulate a re-poll where only the volatile provider timestamp changed.
    current_again = current.model_copy(update={"raw_provider_timestamp": "Aug 3, 2026 11:00:00 AM"})
    assert snapshots_differ(previous, current_again) is False


def test_snapshots_differ_true_when_status_changes():
    current = _normalize_payload("2521703188", SAMPLE_RAW_RESPONSE)
    previous = current.model_dump(mode="json", by_alias=True)

    updated_passenger = current.passengers[0].model_copy(update={"current_status": "RAC"})
    updated = current.model_copy(update={"passengers": [updated_passenger]})

    assert snapshots_differ(previous, updated) is True
