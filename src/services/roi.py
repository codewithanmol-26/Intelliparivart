"""
Data Moat - SaaS Financial ROI & Sensitivity Analysis Engine
Models institute unit economics, tuition revenue preservation, software cost,
and payback periods under varying attrition and prevention scenarios.
"""

from typing import Dict, List, Any
import numpy as np
import pandas as pd

def calculate_institute_roi(
    active_students: int = 400,
    annual_fee_per_student: float = 60000.0,
    baseline_attrition_rate: float = 0.15,
    preventable_attrition_share: float = 0.25,
    platform_annual_fee_per_student: float = 480.0,  # ₹40/mo * 12
    onboarding_concierge_fee: float = 8000.0,
    infra_ai_cost_per_student_annual: float = 54.0    # ₹4.50/mo * 12
) -> Dict[str, Any]:
    """
    Computes rigorous financial ROI metrics for institute owners,
    clearly separating observed parameters, assumptions, and scenario estimates.
    """
    total_tuition_revenue = active_students * annual_fee_per_student
    baseline_dropouts = round(active_students * baseline_attrition_rate)
    revenue_at_risk = baseline_dropouts * annual_fee_per_student

    # Preserved tuition revenue through early-warning and supportive mentoring
    prevented_dropouts = round(baseline_dropouts * preventable_attrition_share)
    preserved_revenue = prevented_dropouts * annual_fee_per_student

    # Cost of platform to institute
    total_software_cost = (active_students * platform_annual_fee_per_student) + onboarding_concierge_fee

    # Net Economic Benefit
    net_gain = preserved_revenue - total_software_cost
    roi_multiple = round(preserved_revenue / total_software_cost, 1) if total_software_cost > 0 else 0.0

    # Payback period (months)
    monthly_preserved = preserved_revenue / 12.0
    payback_months = round(total_software_cost / monthly_preserved, 1) if monthly_preserved > 0 else 0.0

    # Data Moat internal gross margin
    gross_infra_cost = active_students * infra_ai_cost_per_student_annual
    gross_margin_pct = round(((total_software_cost - gross_infra_cost) / total_software_cost) * 100, 1) if total_software_cost > 0 else 0.0

    return {
        "active_students": active_students,
        "annual_fee_per_student": annual_fee_per_student,
        "total_tuition_revenue": total_tuition_revenue,
        "baseline_attrition_rate_pct": baseline_attrition_rate * 100,
        "baseline_dropouts_count": baseline_dropouts,
        "revenue_at_risk": revenue_at_risk,
        "preventable_attrition_share_pct": preventable_attrition_share * 100,
        "prevented_dropouts_count": prevented_dropouts,
        "preserved_revenue": preserved_revenue,
        "total_software_cost": total_software_cost,
        "net_gain": net_gain,
        "roi_multiple": roi_multiple,
        "payback_months": payback_months,
        "gross_margin_pct": gross_margin_pct
    }

def generate_roi_sensitivity_table(
    active_students: int = 400,
    annual_fee_per_student: float = 60000.0,
    baseline_attrition_rate: float = 0.15,
    platform_annual_fee_per_student: float = 480.0,
    onboarding_concierge_fee: float = 8000.0
) -> pd.DataFrame:
    """
    Generates sensitivity matrix varying preventable attrition shares (10% to 40%)
    against resulting financial gains and ROI multiples.
    """
    shares = [0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40]
    rows = []

    for s in shares:
        res = calculate_institute_roi(
            active_students=active_students,
            annual_fee_per_student=annual_fee_per_student,
            baseline_attrition_rate=baseline_attrition_rate,
            preventable_attrition_share=s,
            platform_annual_fee_per_student=platform_annual_fee_per_student,
            onboarding_concierge_fee=onboarding_concierge_fee
        )
        rows.append({
            "Preventable Dropouts (%)": f"{s*100:.0f}%",
            "Students Retained": res["prevented_dropouts_count"],
            "Preserved Revenue (INR)": f"₹{res['preserved_revenue']:,.0f}",
            "Platform Cost (INR)": f"₹{res['total_software_cost']:,.0f}",
            "Net Institute Gain (INR)": f"₹{res['net_gain']:,.0f}",
            "ROI Multiple": f"{res['roi_multiple']}x",
            "Payback (Months)": f"{res['payback_months']} mo"
        })

    return pd.DataFrame(rows)
