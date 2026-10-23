"""
Intelliprivart Backend - Generative AI Layer Routes
Provides AI-powered remedial worksheet generation, teaching assistant copilot,
and LLM-assisted parent digest generation with strict pedagogical guardrails.
"""

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import os

from backend.app.services.genai_service import (
    generate_ai_remedial_worksheet,
    ask_ai_teaching_copilot,
    get_gemini_api_key
)

router = APIRouter(prefix="", tags=["Generative AI Layer"])

class WorksheetRequest(BaseModel):
    topic: str = Field(..., example="Rotational Dynamics & Torque")
    subject: str = Field(..., example="Physics")
    target_exam: Optional[str] = "JEE Advanced"
    student_name: Optional[str] = "Ananya Pandey"
    weakness_reason: Optional[str] = "Topic mastery slump of 42% after Milestone 4"

class CopilotRequest(BaseModel):
    prompt: Optional[str] = None
    message: Optional[str] = None
    context: Optional[str] = "Apex JEE Academy, 12th Achievers Top-30"

    def get_prompt_text(self) -> str:
        return self.prompt or self.message or "How to improve topic mastery?"

@router.get("/genai/status")
@router.get("/api/genai/status")
def get_genai_status():
    """
    Returns live status of the GenAI layer.
    """
    api_key = get_gemini_api_key()
    has_key = bool(api_key)
    return {
        "status": "online",
        "has_api_key": has_key,
        "default_model": "Google Gemini (gemini-3.8-flash)" if has_key else "Pedagogical Core",
        "fallback_active": True,
        "zero_shaming_guardrails": "Enforced"
    }

@router.post("/genai/worksheet")
@router.post("/api/genai/worksheet")
def create_remedial_worksheet(
    payload: WorksheetRequest,
    tenant_id: Optional[str] = None,
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID")
):
    """
    Generates a tailored concept catch-up worksheet with formula sheets,
    common misconceptions, and 3 graded practice questions using GenAI.
    """
    worksheet = generate_ai_remedial_worksheet(
        topic=payload.topic,
        subject=payload.subject,
        target_exam=payload.target_exam or "JEE Advanced",
        student_name=payload.student_name or "Student",
        weakness_reason=payload.weakness_reason or "Concept friction identified"
    )
    return {
        "status": "success",
        "worksheet": worksheet
    }

@router.post("/genai/copilot")
@router.post("/api/genai/copilot")
def query_ai_copilot(
    payload: CopilotRequest,
    tenant_id: Optional[str] = None,
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID")
):
    """
    AI Pedagogical Copilot for coaching institute teachers and academic heads.
    """
    result = ask_ai_teaching_copilot(payload.get_prompt_text(), payload.context)
    return {
        "status": "success",
        "answer": result["answer"],
        "reply": result["answer"],
        "provider": result["provider"]
    }
