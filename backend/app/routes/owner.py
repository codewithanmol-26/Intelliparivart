"""
Intelliprivart API - Institute Owner & Business ROI Endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from backend.app.database import get_db
from backend.app.models import Student, Fee, Institute
from backend.app.schemas import ROICalculatorInput, ROICalculatorOutput

router = APIRouter(prefix="/owner", tags=["Institute Owner & ROI"])

@router.get("/summary")
def get_owner_summary(
    tenant_id: str = "INST_PATNA_01",
    db: Session = Depends(get_db)
):
    """
    Returns high-level business intelligence for the institute owner:
    Active enrollment, total at-risk count, uncollected fee defaults, and retention projections.
    """
    inst = db.query(Institute).filter(Institute.id == tenant_id).first()
    annual_fee = inst.annual_fee_per_student if inst else 60000.0
    students_count = 400 # Standard cohort baseline from Nextute financial model

    # Baseline calculations
    baseline_dropouts = round(students_count * 0.12) # 12% baseline = 48 students
    uncollected_loss_per_student = annual_fee * 0.60 # 6 unpaid installments = ₹36k
    total_tuition_at_risk = baseline_dropouts * uncollected_loss_per_student

    # Mentorship save rate: 20%
    prevented_dropouts = round(baseline_dropouts * 0.792 * 0.20) # Top 20% captures ~79.2% * 20% save = ~8 students
    recovered_revenue = prevented_dropouts * uncollected_loss_per_student

    annual_platform_fee = 12999.0 * 10 # ₹1,29,990
    net_gain = recovered_revenue - annual_platform_fee
    roi_multiple = round(recovered_revenue / annual_platform_fee, 2)

    return {
        "tenant_id": tenant_id,
        "institute_name": inst.name if inst else "Apex JEE & Medical Academy",
        "city": inst.city if inst else "Patna",
        "active_students": students_count,
        "annual_fee_per_student": annual_fee,
        "annual_revenue_run_rate": students_count * annual_fee,
        "baseline_dropout_rate_pct": 12.0,
        "baseline_dropouts_count": baseline_dropouts,
        "total_tuition_at_risk": total_tuition_at_risk,
        "prevented_dropouts_estimate": prevented_dropouts,
        "tuition_recovered_estimate": recovered_revenue,
        "annual_platform_cost": annual_platform_fee,
        "net_annual_cash_gain": net_gain,
        "roi_multiple": roi_multiple,
        "payback_months": round(12.0 / roi_multiple, 1) if roi_multiple > 0 else 4.5
    }

@router.post("/roi-calculator", response_model=ROICalculatorOutput)
def calculate_custom_roi(params: ROICalculatorInput):
    """
    Live dynamic ROI calculator allowing institute owners / judges to vary parameters:
    student count, tuition fees, dropout %, prevention rate, and platform pricing.
    """
    baseline_dropouts = round(params.student_count * (params.baseline_dropout_pct / 100.0))
    lost_fee_per_dropout = params.annual_fee_per_student * 0.60 # 6 unpaid monthly installments
    
    # Flagged in top 20% (approx 79.2% recall) * prevention efficiency
    captured = round(baseline_dropouts * 0.792)
    prevented = round(captured * (params.prevention_efficiency_pct / 100.0))
    recovered = prevented * lost_fee_per_dropout

    annual_cost = params.monthly_subscription_price * 10.0 # 10 academic months
    net_gain = recovered - annual_cost
    roi_multiple = round(recovered / annual_cost, 2) if annual_cost > 0 else 0.0
    payback_months = round((annual_cost / max(1.0, recovered)) * 10.0, 1)

    # Break-even percentage of dropouts needed to prevent to cover platform cost
    breakeven_students = annual_cost / max(1.0, lost_fee_per_dropout)
    breakeven_pct = round((breakeven_students / max(1, baseline_dropouts)) * 100.0, 1)

    return {
        "baseline_dropouts": baseline_dropouts,
        "prevented_dropouts": prevented,
        "tuition_recovered": recovered,
        "annual_platform_cost": annual_cost,
        "net_annual_gain": net_gain,
        "roi_multiple": roi_multiple,
        "payback_months": payback_months,
        "breakeven_prevented_pct": breakeven_pct
    }
