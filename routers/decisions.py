"""
Decision router — POST /decide, POST /escalate, PATCH /resolve.
"""

from __future__ import annotations

import asyncio
import logging

from fastapi import APIRouter, HTTPException

from models.schemas import (
    APIResponse,
    DecisionRequest,
    DecisionResponse,
    EscalateResponse,
    PrimaryResult,
    ResolveRequest,
    ResolveResponse,
    ShadowResult,
)
from services.primary import get_primary_decision
from services.shadow import get_shadow_challenge
from services.arbiter import score_tension
from db.firebase import insert_decision, get_decision_by_id, mark_escalated, resolve_decision

logger = logging.getLogger("csa.router.decisions")

router = APIRouter(tags=["Decisions"])


# ─── POST /decide ────────────────────────────────────────────────────────────

@router.post("/decide", response_model=APIResponse)
async def create_decision(req: DecisionRequest):
    """
    Full orchestration pipeline:
    1. Call Primary + Shadow AI in parallel via asyncio.gather()
    2. Run the Arbiter
    3. Store everything in Supabase
    4. Return the complete decision
    """
    try:
        # 1. Parallel AI calls — MANDATORY
        primary_result, shadow_result = await asyncio.gather(
            get_primary_decision(req.domain, req.input_data, req.context),
            get_shadow_challenge(req.domain, req.input_data, req.context),
        )

        # 2. Arbiter scoring
        arbiter = score_tension(primary_result, shadow_result)

        # 3. Persist to Firebase
        row = insert_decision(
            {
                "domain": req.domain,
                "input_data": req.input_data,
                "context": req.context,
                "primary_verdict": primary_result.get("verdict"),
                "primary_confidence": primary_result.get("confidence", 0),
                "primary_reasoning": primary_result.get("reasoning", ""),
                "primary_key_factors": primary_result.get("key_factors", []),
                "shadow_verdict": shadow_result.get("counter_verdict"),
                "shadow_challenge_strength": shadow_result.get("challenge_strength", 0),
                "shadow_reasoning": shadow_result.get("counter_reasoning", ""),
                "shadow_bias_flags": shadow_result.get("bias_flags", []),
                "shadow_missed_factors": shadow_result.get("missed_factors", []),
                "tension_score": arbiter["tension_score"],
                "final_verdict": arbiter["final_verdict"],
                "escalate_flag": arbiter["escalate_flag"],
            }
        )

        # 4. Build typed response
        decision = DecisionResponse(
            decision_id=row["id"],
            domain=row["domain"],
            input_data=row["input_data"],
            context=row.get("context", ""),
            primary_response=PrimaryResult(
                verdict=primary_result.get("verdict", "unknown"),
                confidence=primary_result.get("confidence", 0),
                reasoning=primary_result.get("reasoning", ""),
                key_factors=primary_result.get("key_factors", []),
            ),
            shadow_response=ShadowResult(
                counter_verdict=shadow_result.get("counter_verdict", "unknown"),
                challenge_strength=shadow_result.get("challenge_strength", 0),
                counter_reasoning=shadow_result.get("counter_reasoning", ""),
                bias_flags=shadow_result.get("bias_flags", []),
                missed_factors=shadow_result.get("missed_factors", []),
            ),
            tension_score=arbiter["tension_score"],
            final_verdict=arbiter["final_verdict"],
            escalate_flag=arbiter["escalate_flag"],
            created_at=str(row.get("created_at", "")),
        )

        logger.info(
            "Decision %s completed — tension=%d verdict=%s",
            row["id"],
            arbiter["tension_score"],
            arbiter["final_verdict"],
        )

        return APIResponse(success=True, data=decision.model_dump())

    except Exception as exc:
        logger.exception("Decision pipeline failed")
        return APIResponse(success=False, error=str(exc))


# ─── POST /escalate/{decision_id} ────────────────────────────────────────────

@router.post("/escalate/{decision_id}", response_model=APIResponse)
async def escalate_decision(decision_id: str):
    """Mark a decision for human review."""
    try:
        existing = get_decision_by_id(decision_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Decision not found")

        updated = mark_escalated(decision_id)
        if not updated:
            raise HTTPException(status_code=500, detail="Failed to update decision")

        resp = EscalateResponse(
            decision_id=decision_id,
            escalate_flag=True,
            message="Decision has been escalated for human review.",
        )
        return APIResponse(success=True, data=resp.model_dump())

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Escalation failed for %s", decision_id)
        return APIResponse(success=False, error=str(exc))


# ─── PATCH /resolve/{decision_id} ────────────────────────────────────────────

@router.patch("/resolve/{decision_id}", response_model=APIResponse)
async def resolve_escalated_decision(decision_id: str, req: ResolveRequest):
    """Resolve an escalated decision with a human verdict."""
    try:
        existing = get_decision_by_id(decision_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Decision not found")

        updated = resolve_decision(decision_id, req.human_verdict, req.reviewer_notes)
        if not updated:
            raise HTTPException(status_code=500, detail="Failed to resolve decision")

        resp = ResolveResponse(
            decision_id=decision_id,
            human_verdict=req.human_verdict,
            reviewer_notes=req.reviewer_notes,
            resolved_at=str(updated.get("resolved_at", "")),
        )
        return APIResponse(success=True, data=resp.model_dump())

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Resolve failed for %s", decision_id)
        return APIResponse(success=False, error=str(exc))
