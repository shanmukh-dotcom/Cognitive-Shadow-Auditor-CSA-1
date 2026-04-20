"""
Cognitive Shadow Auditor (CSA) — main FastAPI application.
"""

from __future__ import annotations

import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from models.schemas import APIResponse, HealthResponse
from routers import decisions, audit

# ─── Bootstrap ────────────────────────────────────────────────────────────────

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)-20s | %(levelname)-7s | %(message)s",
)
logger = logging.getLogger("csa")

# ─── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Cognitive Shadow Auditor",
    description=(
        "A dual-AI decision-auditing system. A Primary AI makes a decision, "
        "a Shadow AI challenges it, and an Arbiter scores the tension."
    ),
    version="1.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────

_origins_raw = os.environ.get("CORS_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in _origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────

app.include_router(decisions.router)
app.include_router(audit.router)

# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/health", response_model=APIResponse)
async def health_check():
    """Simple liveness probe."""
    return APIResponse(
        success=True,
        data=HealthResponse().model_dump(),
    )

# ─── Frontend Unified Serving ─────────────────────────────────────────────────

# Check if the frontend build exists (only in production)
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "frontend", "dist")

if os.path.isdir(FRONTEND_DIST):
    # Mount the static assets directory specifically
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    # Catch-all route to serve the React SPA index.html
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Prevent API 404s from returning the HTML page instead of JSON
        if full_path.startswith("api/") or full_path in ["decide", "decisions"] or full_path.startswith("audit/") or full_path.startswith("resolve/") or full_path.startswith("escalate/"):
            return JSONResponse(status_code=404, content={"success": False, "error": "API route not found"})
            
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

