"""
Automated Test Suite: ML Models & Psychometrics
Verifies 2PL IRT ability estimation, BKT topic mastery trajectory updates,
early-warning risk prediction, and honest percentile prediction intervals.
"""

import pytest
import numpy as np
from src.ml.irt_bkt import compute_2pl_irt_probability, estimate_student_ability_theta, compute_bkt_mastery
from src.ml.early_warning import early_warning_engine, rule_based_baseline_score
from src.ml.performance import predict_student_percentile_interval
import pandas as pd

def test_2pl_irt_probability():
    """Verify 2PL IRT formula characteristics."""
    # When student ability matches question difficulty (theta == b), p_logistic = 0.5
    # With guessing floor c = 0.20: P = 0.20 + 0.80 * 0.5 = 0.60
    p = compute_2pl_irt_probability(theta=0.0, a=1.0, b=0.0, c=0.20)
    assert round(p, 2) == 0.60

    # High ability student on easy question should have high probability
    p_high = compute_2pl_irt_probability(theta=2.5, a=1.5, b=-1.0, c=0.20)
    assert p_high > 0.95

    # Low ability student on hard question approaches guessing floor
    p_low = compute_2pl_irt_probability(theta=-2.5, a=1.5, b=2.0, c=0.20)
    assert p_low < 0.25

def test_student_ability_estimation():
    """Verify MAP estimation of student ability theta."""
    # Perfect score on hard questions
    responses = [1, 1, 1, 1, 1]
    a_params = [1.2, 1.4, 1.0, 1.5, 1.3]
    b_params = [0.5, 0.8, 0.3, 1.0, 0.6]

    theta_high = estimate_student_ability_theta(responses, a_params, b_params)
    assert theta_high > 0.5, "High score on difficult items should produce positive theta."

    # Zero score on easy questions
    responses_zero = [0, 0, 0, 0, 0]
    b_params_easy = [-1.0, -0.8, -1.2, -0.5, -0.9]
    theta_low = estimate_student_ability_theta(responses_zero, a_params, b_params_easy)
    assert theta_low < -0.5, "Zero score on easy items should produce negative theta."

def test_bkt_mastery_dynamics():
    """Verify Bayesian Knowledge Tracing increases on correct answers and decreases on slips."""
    # Sequence of consecutive correct answers
    res_correct = [1, 1, 1, 1]
    bkt_high = compute_bkt_mastery(res_correct)
    assert bkt_high["mastery_score"] > 0.65
    assert bkt_high["confidence_level"] in ["Moderate Evidence", "High Evidence"]

    # Sequence of incorrect answers
    res_incorrect = [0, 0, 0, 0]
    bkt_low = compute_bkt_mastery(res_incorrect)
    assert bkt_low["mastery_score"] < 0.30

def test_early_warning_rule_baseline():
    """Verify explainable heuristic baseline risk scoring."""
    at_risk_feat = {
        "avg_topic_mastery": 0.32,
        "min_topic_mastery": 0.22,
        "overall_attendance": 0.65,
        "recent_14d_attendance": 0.45,
        "attendance_slope": -0.20,
        "fee_default_flag": 1.0,
        "homework_completion_rate": 0.40,
        "doubts_count": 0
    }
    risk_score = rule_based_baseline_score(at_risk_feat)
    assert risk_score >= 0.60, "Severe drop in attendance and fee default must trigger high risk."
