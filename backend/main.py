"""
FastAPI app entrypoint.

Run locally with:  uvicorn main:app --reload
Render start command (Section 12):  uvicorn main:app --host 0.0.0.0 --port $PORT
"""
from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.routes_pnr import limiter, router as pnr_router
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title="trackmypnr API",
    description="Backend API for the trackmypnr.co.in PNR status checker.",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Keep the error envelope consistent with Section 6's convention:
    # { "error": true, "code": "...", "message": "..." }
    return JSONResponse(
        status_code=400,
        content={
            "error": True,
            "code": "VALIDATION_ERROR",
            "message": "Request did not pass validation. PNR numbers must be exactly 10 digits.",
        },
    )


@app.get("/api/health")
async def health():
    """Used by Render + the external keep-alive ping (Section 9) to keep the
    free-tier instance warm and confirm the service is up."""
    return {"status": "ok"}


app.include_router(pnr_router)
