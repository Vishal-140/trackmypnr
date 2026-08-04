"""
Confirmation probability heuristic (Section 5).

Only meaningful for WL/RAC tickets. This is intentionally a simple,
explainable static heuristic to start with — the spec calls out that it can
"start with a static lookup table by quota type, refine later with real
data." It must always be labeled as an estimate in the UI, never presented
as a guarantee.
"""
from __future__ import annotations

from datetime import datetime, timezone

# Base clearance-likelihood weight by quota type. GNWL (general waitlist)
# clears most often; RLWL/PQWL are historically the least likely to clear.
QUOTA_BASE_WEIGHT: dict[str, float] = {
    "GN": 0.72,
    "GNWL": 0.72,
    "TQ": 0.55,
    "TQWL": 0.55,
    "RLWL": 0.30,
    "RLGN": 0.30,
    "PQWL": 0.28,
    "CK": 0.60,
    "LD": 0.50,
}
DEFAULT_BASE_WEIGHT = 0.45


def _days_until(journey_date: datetime | None) -> int:
    if journey_date is None:
        return 3
    now = datetime.now(timezone.utc)
    jd = journey_date if journey_date.tzinfo else journey_date.replace(tzinfo=timezone.utc)
    delta = (jd - now).days
    return max(delta, 0)


def estimate_confirmation_probability(
    *,
    quota: str | None,
    waitlist_type: int | None,
    journey_date: datetime | None,
    current_status: str,
) -> int | None:
    """Return an integer 0-100 estimate, or None if not applicable
    (i.e. the passenger is already confirmed and there's nothing to predict).
    """
    status = (current_status or "").upper()
    if status == "CNF":
        return None
    if status not in {"WL", "RAC", "GNWL", "TQWL", "RLWL", "PQWL"} and "WL" not in status and "RAC" not in status:
        # Unknown/cancelled/other terminal states — no meaningful estimate.
        if status in {"CAN", "CANCELLED"}:
            return None

    base = QUOTA_BASE_WEIGHT.get((quota or "").upper(), DEFAULT_BASE_WEIGHT)

    # More days remaining -> more chances for the chart to move in your favor.
    days_left = _days_until(journey_date)
    time_factor = min(days_left / 10.0, 1.0) * 0.20  # up to +20 points worth of weight

    # A lower waitlist number is closer to confirmation than a high one.
    position_penalty = 0.0
    if waitlist_type:
        if waitlist_type <= 5:
            position_penalty = 0.0
        elif waitlist_type <= 20:
            position_penalty = 0.10
        elif waitlist_type <= 50:
            position_penalty = 0.25
        else:
            position_penalty = 0.40

    # RAC is already a partial confirmation (a berth is shared) and
    # historically clears to full CNF at a high rate.
    rac_bonus = 0.15 if "RAC" in status else 0.0

    probability = base + time_factor + rac_bonus - position_penalty
    probability = max(0.05, min(probability, 0.97))
    return round(probability * 100)
