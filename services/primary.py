"""
Primary AI Module — strict, data-driven decision maker.
Uses Google Gemini API with gemini-2.5-flash.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os

import google.generativeai as genai
from google.generativeai.types import GenerationConfig

logger = logging.getLogger("csa.primary")

MODEL = "gemini-1.5-flash"
TEMPERATURE = 0.3

SYSTEM_PROMPT = (
    "You are a strict, data-driven decision-making AI. "
    "Analyze the provided case carefully and make a clear APPROVE or REJECT decision. "
    "Return ONLY valid JSON in this exact format:\n"
    "{\n"
    '  "verdict": "approve" or "reject",\n'
    '  "confidence": integer 0-100,\n'
    '  "reasoning": "your full reasoning in 2-3 sentences",\n'
    '  "key_factors": ["factor1", "factor2", "factor3"]\n'
    "}\n"
    "Be logical, precise, and base your decision on the data provided. "
    "Do not add any text outside the JSON. Return only the JSON object."
)

# Default fallback when AI response cannot be parsed
_FALLBACK = {
    "verdict": "reject",
    "confidence": 0,
    "reasoning": "Failed to parse AI response.",
    "key_factors": [],
}


def _parse_response(raw: str) -> dict:
    """Attempt to extract JSON from the model output."""
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    # Try to find JSON block inside markdown fences or extra text
    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start != -1 and end > start:
        try:
            return json.loads(raw[start:end])
        except json.JSONDecodeError:
            pass

    return {**_FALLBACK, "raw_error": raw}


async def get_primary_decision(domain: str, input_data: dict, context: str) -> dict:
    """
    Call the Primary AI and return a parsed decision dict.
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

    for attempt in range(2):  # max 2 tries (initial + 1 retry)
        try:
            response = await model.generate_content_async(user_content)
            raw = response.text.strip()
            logger.info("Primary AI raw (%d chars): %s", len(raw), raw[:200])
            return _parse_response(raw)

        except Exception as exc:
            error_str = str(exc)
            if "429" in error_str and attempt == 0:
                logger.warning("Primary AI rate-limited (429). Retrying in 2 s …")
                await asyncio.sleep(2)
                continue
            logger.error("Primary AI call failed: %s", error_str)
            return {**_FALLBACK, "raw_error": error_str}

    return {**_FALLBACK, "raw_error": "Exhausted retries"}
