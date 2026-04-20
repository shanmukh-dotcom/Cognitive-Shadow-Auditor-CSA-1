"""
Shadow AI Module — adversarial challenger that exposes bias.
Uses Google Gemini API with gemini-2.5-flash.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os

import google.generativeai as genai
from google.generativeai.types import GenerationConfig

logger = logging.getLogger("csa.shadow")

MODEL = "gemini-1.5-flash"
TEMPERATURE = 0.7

SYSTEM_PROMPT = (
    "You are an adversarial AI whose ONLY job is to challenge decisions and expose bias. "
    "You must argue the OPPOSITE position of whatever a standard AI would decide. "
    "Find every flaw, every overlooked factor, every systemic bias, every assumption that "
    "disadvantages minorities, lower-income groups, or non-standard cases. "
    "Return ONLY valid JSON in this exact format:\n"
    "{\n"
    '  "counter_verdict": "approve" or "reject",\n'
    '  "challenge_strength": integer 0-100,\n'
    '  "counter_reasoning": "your full challenge in 2-3 sentences",\n'
    '  "bias_flags": ["bias1", "bias2"],\n'
    '  "missed_factors": ["factor1", "factor2"]\n'
    "}\n"
    "You MUST try to reach the opposite verdict from what the data naively suggests. "
    "Do not add any text outside the JSON. Return only the JSON."
)

# Default fallback when AI response cannot be parsed
_FALLBACK = {
    "counter_verdict": "approve",
    "challenge_strength": 0,
    "counter_reasoning": "Failed to parse AI response.",
    "bias_flags": [],
    "missed_factors": [],
}


def _parse_response(raw: str) -> dict:
    """Attempt to extract JSON from the model output."""
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start != -1 and end > start:
        try:
            return json.loads(raw[start:end])
        except json.JSONDecodeError:
            pass

    return {**_FALLBACK, "raw_error": raw}


async def get_shadow_challenge(domain: str, input_data: dict, context: str) -> dict:
    """
    Call the Shadow AI and return a parsed challenge dict.
    Retries once on 429 rate-limit errors.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY not found in environment")
        return {**_FALLBACK, "raw_error": "Missing GEMINI_API_KEY"}

    genai.configure(api_key=api_key)

    model = genai.GenerativeModel(
        model_name=MODEL,
        system_instruction=SYSTEM_PROMPT,
        generation_config=GenerationConfig(
            temperature=TEMPERATURE,
            max_output_tokens=1024,
            response_mime_type="application/json",
        )
    )

    user_content = (
        f"Domain: {domain}\n"
        f"Input Data: {json.dumps(input_data)}\n"
        f"Context: {context}"
    )


    for attempt in range(2):
        try:
            response = await model.generate_content_async(user_content)
            raw = response.text.strip()
            logger.info("Shadow AI raw (%d chars): %s", len(raw), raw[:200])
            return _parse_response(raw)

        except Exception as exc:
            error_str = str(exc)
            if "429" in error_str and attempt == 0:
                logger.warning("Shadow AI rate-limited (429). Retrying in 2 s …")
                await asyncio.sleep(2)
                continue
            logger.error("Shadow AI call failed: %s", error_str)
            return {**_FALLBACK, "raw_error": error_str}

    return {**_FALLBACK, "raw_error": "Exhausted retries"}
