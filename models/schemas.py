"""
Pydantic models for the Cognitive Shadow Auditor (CSA).
Strict typing for every request and response payload.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


# ─── Envelope ────────────────────────────────────────────────────────────────

class APIResponse(BaseModel):
    """Consistent response wrapper used by every endpoint."""
    success: bool
    data: Any = None
    error: Optional[str] = None


# ─── Decision Request / Response ─────────────────────────────────────────────

class DecisionRequest(BaseModel):
    """Payload sent by clients to POST /decide."""
    domain: str = Field(..., min_length=1, examples=["loan_approval"])
    input_data: dict = Field(..., examples=[{"applicant_age": 34, "income": 52000}])
    context: str = Field(default="", examples=["First-time applicant with limited credit history"])


class PrimaryResult(BaseModel):
    verdict: str
    confidence: int = Field(ge=0, le=100)
    reasoning: str
    key_factors: list[str] = []


class ShadowResult(BaseModel):
    counter_verdict: str
    challenge_strength: int = Field(ge=0, le=100)
    counter_reasoning: str
    bias_flags: list[str] = []
    missed_factors: list[str] = []


class ArbiterResult(BaseModel):
    tension_score: int = Field(ge=0, le=100)
    escalate_flag: bool
    final_verdict: str


class DecisionResponse(BaseModel):
    """Full decision record returned after orchestration."""
    decision_id: str
    domain: str
    input_data: dict
    context: str
    primary_response: PrimaryResult
    shadow_response: ShadowResult
    tension_score: int
    final_verdict: str
    escalate_flag: bool
    created_at: str


# ─── Escalation / Resolution ────────────────────────────────────────────────

class EscalateResponse(BaseModel):
    decision_id: str
    escalate_flag: bool
    message: str


class ResolveRequest(BaseModel):
    human_verdict: str = Field(..., min_length=1)
    reviewer_notes: str = Field(default="")


class ResolveResponse(BaseModel):
    decision_id: str
    human_verdict: str
    reviewer_notes: str
    resolved_at: str


# ─── Audit ───────────────────────────────────────────────────────────────────

class AuditRecord(BaseModel):
    decision_id: str
    domain: str
    input_data: dict
    context: Optional[str] = None
    primary_verdict: Optional[str] = None
    primary_confidence: Optional[int] = None
    primary_reasoning: Optional[str] = None
    primary_key_factors: Optional[list[str]] = None
    shadow_verdict: Optional[str] = None
    shadow_challenge_strength: Optional[int] = None
    shadow_reasoning: Optional[str] = None
    shadow_bias_flags: Optional[list[str]] = None
    shadow_missed_factors: Optional[list[str]] = None
    tension_score: Optional[int] = None
    final_verdict: Optional[str] = None
    escalate_flag: bool = False
    resolved_by_human: bool = False
    human_verdict: Optional[str] = None
    reviewer_notes: Optional[str] = None
    created_at: Optional[str] = None
    resolved_at: Optional[str] = None


class PaginatedDecisions(BaseModel):
    page: int
    limit: int
    total: int
    decisions: list[AuditRecord]


# ─── Health ──────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
