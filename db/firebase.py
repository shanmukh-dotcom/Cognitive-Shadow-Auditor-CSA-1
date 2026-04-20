"""
Firebase Firestore layer for the Cognitive Shadow Auditor.
"""

from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from typing import Any

import firebase_admin
from firebase_admin import credentials, firestore

logger = logging.getLogger("csa.db")

# ─── Singleton client ────────────────────────────────────────────────────────

_db = None

def _get_db():
    """Lazily initialize Firebase and return the Firestore client."""
    global _db
    if _db is None:
        try:
            firebase_admin.get_app()
        except ValueError:
            # App not yet initialized
            cert_json = os.environ.get("FIREBASE_CONFIG_JSON")
            cert_path = os.environ.get("FIREBASE_CREDENTIALS_PATH")
            
            if cert_json:
                try:
                    import json
                    cred_dict = json.loads(cert_json)
                    cred = credentials.Certificate(cred_dict)
                    firebase_admin.initialize_app(cred)
                    logger.info("Firebase initialized using FIREBASE_CONFIG_JSON env var")
                except Exception as e:
                    logger.error("Failed to initialize Firebase from JSON string: %s", str(e))
                    raise
            elif cert_path and os.path.exists(cert_path):
                cred = credentials.Certificate(cert_path)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase initialized with Service Account from %s", cert_path)
            else:
                try:
                    cred = credentials.ApplicationDefault()
                    firebase_admin.initialize_app(cred)
                    logger.info("Firebase initialized using Application Default Credentials")
                except Exception as e:
                    logger.error("Failed to initialize Firebase: %s", str(e))
                    raise
        _db = firestore.client()
    return _db


# ─── CRUD operations ────────────────────────────────────────────────────────

def insert_decision(data: dict[str, Any]) -> dict[str, Any]:
    """Insert a full decision record and return the row (including id)."""
    db = _get_db()
    
    # Populate missing timestamps
    if "created_at" not in data:
        data["created_at"] = datetime.now(timezone.utc).isoformat()
        
    doc_ref = db.collection("decisions").document()
    data["id"] = doc_ref.id
    doc_ref.set(data)
    
    logger.info(
        "Stored decision %s — tension=%s verdict=%s",
        data["id"],
        data.get("tension_score"),
        data.get("final_verdict"),
    )
    return data


def get_decision_by_id(decision_id: str) -> dict[str, Any] | None:
    """Fetch a single decision by ID. Returns None if not found."""
    db = _get_db()
    doc_ref = db.collection("decisions").document(decision_id)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    return None


def list_decisions(page: int = 1, limit: int = 20) -> tuple[list[dict], int]:
    """Return a paginated list of decisions (newest first) and total count."""
    db = _get_db()
    
    # Get total count (using lightweight select to avoid large reads)
    docs = db.collection("decisions").select(["id"]).stream()
    total = sum(1 for _ in docs)
    
    offset = (page - 1) * limit
    
    query = (
        db.collection("decisions")
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .offset(offset)
        .limit(limit)
    )
    
    results = [doc.to_dict() for doc in query.stream()]
    return results, total


def mark_escalated(decision_id: str) -> dict[str, Any] | None:
    """Set escalate_flag = true on a decision."""
    db = _get_db()
    doc_ref = db.collection("decisions").document(decision_id)
    
    if not doc_ref.get().exists:
        return None
        
    updates = {"escalate_flag": True, "final_verdict": "escalated"}
    doc_ref.update(updates)
    
    return doc_ref.get().to_dict()


def resolve_decision(
    decision_id: str,
    human_verdict: str,
    reviewer_notes: str,
) -> dict[str, Any] | None:
    """Mark a decision as resolved by a human reviewer."""
    db = _get_db()
    doc_ref = db.collection("decisions").document(decision_id)
    
    if not doc_ref.get().exists:
        return None
        
    updates = {
        "resolved_by_human": True,
        "human_verdict": human_verdict,
        "reviewer_notes": reviewer_notes,
        "resolved_at": datetime.now(timezone.utc).isoformat(),
    }
    doc_ref.update(updates)
    
    return doc_ref.get().to_dict()
