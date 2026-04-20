"""
Audit router — GET /audit/{decision_id} and GET /decisions.
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from models.schemas import APIResponse, AuditRecord, PaginatedDecisions
from db.firebase import get_decision_by_id, list_decisions

logger = logging.getLogger("csa.router.audit")

router = APIRouter(tags=["Audit"])


def _row_to_audit(row: dict) -> AuditRecord:
    """Map a Firebase row dict to an AuditRecord."""
    return AuditRecord(
        decision_id=row["id"],
        domain=row["domain"],
        input_data=row.get("input_data", {}),
        context=row.get("context"),
        primary_verdict=row.get("primary_verdict"),
        primary_confidence=row.get("primary_confidence"),
        primary_reasoning=row.get("primary_reasoning"),
        primary_key_factors=row.get("primary_key_factors"),
        shadow_verdict=row.get("shadow_verdict"),
        shadow_challenge_strength=row.get("shadow_challenge_strength"),
        shadow_reasoning=row.get("shadow_reasoning"),
        shadow_bias_flags=row.get("shadow_bias_flags"),
        shadow_missed_factors=row.get("shadow_missed_factors"),
        tension_score=row.get("tension_score"),
        final_verdict=row.get("final_verdict"),
        escalate_flag=row.get("escalate_flag", False),
        resolved_by_human=row.get("resolved_by_human", False),
        human_verdict=row.get("human_verdict"),
        reviewer_notes=row.get("reviewer_notes"),
        created_at=str(row.get("created_at", "")),
        resolved_at=str(row.get("resolved_at", "")) if row.get("resolved_at") else None,
    )


# ─── GET /audit/{decision_id} ────────────────────────────────────────────────

@router.get("/audit/{decision_id}", response_model=APIResponse)
async def get_audit_record(decision_id: str):
    """Return the full decision record with both AI arguments."""
    try:
        row = get_decision_by_id(decision_id)
        if not row:
            raise HTTPException(status_code=404, detail="Decision not found")

        record = _row_to_audit(row)
        return APIResponse(success=True, data=record.model_dump())

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Audit fetch failed for %s", decision_id)
        return APIResponse(success=False, error=str(exc))


# ─── GET /decisions ──────────────────────────────────────────────────────────

@router.get("/decisions", response_model=APIResponse)
async def get_decisions(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
):
    """Paginated list of all decisions, newest first."""
    try:
        rows, total = list_decisions(page=page, limit=limit)
        records = [_row_to_audit(r) for r in rows]

        paginated = PaginatedDecisions(
            page=page,
            limit=limit,
            total=total,
            decisions=records,
        )
        return APIResponse(success=True, data=paginated.model_dump())

    except Exception as exc:
        logger.exception("Failed to list decisions")
        return APIResponse(success=False, error=str(exc))
