"""
Intelliprivart - Pydantic v2 Data Schemas
Validation for API inputs, outputs, ingestion payloads, and audit events.
"""

from typing import List, Optional, Dict, Any
from datetime import date, datetime
from pydantic import BaseModel, Field

# Base Tenant Scoped Model
class TenantBase(BaseModel):
    tenant_id: str

# Institute Schemas
class InstituteOut(BaseModel):
    id: str
    name: str
    city: str
    city_tier: str
    exam_focus: str
    subscription_plan: str
    annual_fee_per_student: float

    class Config:
        from_attributes = True

# Student Schemas
class StudentOut(BaseModel):
    id: str
    tenant_id: str
    batch_id: str
    pseudonymous_code: str
    name: str
    class_level: str
    join_date: date
    parent_contact_consent: bool

    class Config:
        from_attributes = True

# Mastery Schemas
class TopicMasteryOut(BaseModel):
    topic_id: str
    topic: str
    subject: str
    bkt_mastery: float
    raw_accuracy: float
    attempts: int
    confidence: str

class BatchHeatmapOut(BaseModel):
    batch_id: str
    students: List[str]
    topics: List[str]
    bkt_matrix: List[List[float]]
    raw_matrix: List[List[float]]
    uncertainty_matrix: List[List[float]]
    weakest_topics: List[Dict[str, Any]]

# Early Warning / Risk Schemas
class AtRiskStudentOut(BaseModel):
    student_id: str
    tenant_id: str
    batch_id: str
    name: str
    risk_score: float
    risk_tier: str
    top_reasons: str
    suggested_action: str
    action_status: str

class ActionCreate(BaseModel):
    student_id: str
    intervention_type: str
    reason: str
    assigned_to: Optional[str] = "Er. R. K. Verma"

# Prediction Schemas
class PredictionOut(BaseModel):
    student_id: str
    predicted_midpoint: float
    p10_lower: float
    p90_upper: float
    interval_text: str
    total_width: float
    uncertainty_label: str
    confidence_level: str

# Parent Report Schemas
class ReportRequest(BaseModel):
    lang: str = "en" # "en" or "hi"

class ReportOut(BaseModel):
    student_id: str
    name: str
    language: str
    report_text: str
    verification_status: str
    violations: List[str]
    cost_estimate_inr: float = 0.08

# Ingestion Schemas
class ReviewQueueItemOut(BaseModel):
    id: int
    tenant_id: str
    source_type: str
    raw_payload_json: str
    detected_error: str
    suggested_fix: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ReviewResolveRequest(BaseModel):
    action: str # "APPROVE" or "REJECT"
    corrected_payload: Optional[Dict[str, Any]] = None

# OMR Result Schemas
class OMRQuestionResult(BaseModel):
    question_number: int
    detected_option: str
    is_correct: bool
    confidence: float
    flagged: bool

class OMRScanResult(BaseModel):
    file_name: str
    quality_status: str # "CLEAN", "SKEWED_CORRECTED", "BLURRY_RECAPTURE"
    total_detected: int
    score: int
    questions: List[OMRQuestionResult]
    annotated_image_url: Optional[str] = None
    annotated_image: Optional[str] = None
    student_id: Optional[str] = None
    test_id: Optional[str] = None
    ocr_confidence: Optional[float] = None
    requires_human_review: Optional[bool] = None
    diagnostics: Optional[Dict[str, Any]] = None

# ROI Calculator Schemas
class ROICalculatorInput(BaseModel):
    student_count: int = 400
    annual_fee_per_student: float = 60000.0
    baseline_dropout_pct: float = 12.0
    prevention_efficiency_pct: float = 20.0
    monthly_subscription_price: float = 12999.0

class ROICalculatorOutput(BaseModel):
    baseline_dropouts: int
    prevented_dropouts: int
    tuition_recovered: float
    annual_platform_cost: float
    net_annual_gain: float
    roi_multiple: float
    payback_months: float
    breakeven_prevented_pct: float

# Audit & Simulation Schemas
class AuditLogOut(BaseModel):
    id: int
    tenant_id: str
    actor_role: str
    action: str
    resource_type: str
    resource_id: str
    timestamp: datetime
    details_json: Optional[str]

    class Config:
        from_attributes = True

class CurveballScenarioRequest(BaseModel):
    scenario: str # "MINOR_TRACKING_BAN", "LLM_OUTAGE", "NEW_FORMAT", "AI_COST_CAP"
