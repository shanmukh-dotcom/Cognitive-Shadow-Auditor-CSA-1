"""
Arbiter Module — pure Python logic, no AI.
Scores tension between Primary and Shadow responses
and determines whether a decision must escalate to a human reviewer.
"""

from __future__ import annotations

import logging

logger = logging.getLogger("csa.arbiter")


def score_tension(primary: dict, shadow: dict) -> dict:
    """
    Compute a tension score from the primary and shadow AI responses.

    Rules
    -----
    1. base_score = (primary_confidence + shadow_challenge_strength) / 2
    2. If verdicts disagree: +20
    3. Each bias flag: +5
    4. If >1 missed factors: +10
    5. Clamp to [0, 100]
    6. escalate_flag = tension_score >= 70

    Returns
    -------
    dict with tension_score, escalate_flag, final_verdict
    """
    primary_confidence = int(primary.get("confidence", 0))
    shadow_strength = int(shadow.get("challenge_strength", 0))

    base_score = (primary_confidence + shadow_strength) / 2

    # Verdict disagreement bonus
    primary_verdict = (primary.get("verdict") or "").lower().strip()
    shadow_verdict = (shadow.get("counter_verdict") or "").lower().strip()
    if primary_verdict != shadow_verdict:
        base_score += 20

    # Bias flags bonus
    bias_flags = shadow.get("bias_flags") or []
    if len(bias_flags) > 0:
        base_score += len(bias_flags) * 5

    # Missed factors bonus
    missed_factors = shadow.get("missed_factors") or []
    if len(missed_factors) > 1:
        base_score += 10

    tension_score = min(100, round(base_score))
    escalate_flag = tension_score >= 70

    if escalate_flag:
        final_verdict = "escalated"
    elif primary_verdict == "approve":
        final_verdict = "approved"
    else:
        final_verdict = "rejected"

    logger.info(
        "Arbiter → tension=%d escalate=%s verdict=%s",
        tension_score,
        escalate_flag,
        final_verdict,
    )

    return {
        "tension_score": tension_score,
        "escalate_flag": escalate_flag,
        "final_verdict": final_verdict,
    }
