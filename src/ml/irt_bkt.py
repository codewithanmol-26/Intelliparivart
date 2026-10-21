"""
Data Moat - Psychometrics & Knowledge Tracing Engine
Implements:
1. 2PL Item Response Theory (IRT) - Student Latent Ability (theta) MAP estimation
2. Bayesian Knowledge Tracing (BKT) - Dynamic sequential topic mastery tracking
"""

from typing import Dict, List, Tuple, Optional, Any
import numpy as np
import pandas as pd
from scipy.optimize import minimize_scalar

# Calibrated BKT Priors
DEFAULT_BKT_PARAMS = {
    "P_L0": 0.35,  # Prior probability of knowing topic
    "P_T": 0.15,   # Probability of learning transition between attempts
    "P_G": 0.20,   # Probability of guessing correctly without mastery
    "P_S": 0.10    # Probability of slipping (error despite mastery)
}

def compute_2pl_irt_probability(theta: float, a: float, b: float, c: float = 0.20) -> float:
    """
    Computes 2PL/3PL IRT probability of a correct response:
    P(Y=1|theta, a, b, c) = c + (1 - c) / (1 + exp(-a * (theta - b)))
    """
    exponent = -a * (theta - b)
    # Clip exponent to avoid overflow
    clipped_exp = np.clip(exponent, -35.0, 35.0)
    p_logistic = 1.0 / (1.0 + np.exp(clipped_exp))
    return c + (1.0 - c) * p_logistic

def estimate_student_ability_theta(
    responses: List[int],
    a_params: List[float],
    b_params: List[float],
    c: float = 0.20
) -> float:
    """
    Estimates student latent ability theta using Maximum A Posteriori (MAP)
    with a standard normal prior theta ~ N(0, 1).
    """
    if not responses or len(responses) == 0:
        return 0.0

    y = np.array(responses, dtype=float)
    a = np.array(a_params, dtype=float)
    b = np.array(b_params, dtype=float)

    def neg_log_posterior(theta_val: float) -> float:
        # Prior log-likelihood: log N(theta | 0, 1) = -0.5 * theta^2
        log_prior = -0.5 * (theta_val ** 2)
        
        # Likelihood
        p = compute_2pl_irt_probability(theta_val, a, b, c)
        p = np.clip(p, 1e-7, 1.0 - 1e-7)
        log_likelihood = np.sum(y * np.log(p) + (1.0 - y) * np.log(1.0 - p))
        return -(log_likelihood + log_prior)

    # Search in standard [-4.0, +4.0] standard deviation range
    res = minimize_scalar(neg_log_posterior, bounds=(-4.0, 4.0), method="bounded")
    return round(float(res.x), 2)

def compute_bkt_mastery(
    attempt_results: List[int],
    params: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Tracks topic mastery dynamically across a sequence of student attempts
    using Bayesian Knowledge Tracing.
    Returns current mastery, observation count, trajectory, and confidence.
    """
    if params is None:
        params = DEFAULT_BKT_PARAMS

    p_l0 = params["P_L0"]
    p_t = params["P_T"]
    p_g = params["P_G"]
    p_s = params["P_S"]

    if not attempt_results:
        return {
            "mastery_score": p_l0,
            "observations_count": 0,
            "confidence_level": "Insufficient Evidence",
            "is_reliable": False,
            "trajectory": [p_l0]
        }

    p_l = p_l0
    trajectory = [round(p_l, 3)]

    for is_correct in attempt_results:
        # 1. Update belief based on observation (Bayes Rule)
        if is_correct == 1:
            numerator = p_l * (1.0 - p_s)
            denominator = numerator + ((1.0 - p_l) * p_g) + 1e-9
        else:
            numerator = p_l * p_s
            denominator = numerator + ((1.0 - p_l) * (1.0 - p_g)) + 1e-9
        p_obs = numerator / denominator

        # 2. Transition step (learning between attempts)
        p_l = p_obs + (1.0 - p_obs) * p_t
        p_l = max(0.01, min(0.99, p_l))
        trajectory.append(round(float(p_l), 3))

    obs_count = len(attempt_results)
    if obs_count < 3:
        confidence = "Low Evidence"
    elif obs_count < 8:
        confidence = "Moderate Evidence"
    else:
        confidence = "High Evidence"

    return {
        "mastery_score": round(float(p_l), 3),
        "mastery_percentage": round(float(p_l) * 100, 1),
        "observations_count": obs_count,
        "confidence_level": confidence,
        "is_reliable": obs_count >= 3,
        "trajectory": trajectory
    }

def calculate_student_topic_mastery_matrix(
    df_responses: pd.DataFrame,
    df_questions: pd.DataFrame,
    student_id: str
) -> Dict[str, Dict[str, Any]]:
    """
    Calculates Bayesian Knowledge Tracing mastery for all topics for a given student.
    """
    merged = df_responses[df_responses["student_id"] == student_id].merge(
        df_questions[["question_id", "subject", "chapter", "topic", "difficulty_b", "discrimination_a"]],
        on="question_id",
        how="left"
    ).sort_values("test_date")

    results = {}
    all_topics = df_questions[["subject", "topic"]].drop_duplicates()

    for _, row in all_topics.iterrows():
        topic = row["topic"]
        subj = row["subject"]
        topic_resps = merged[merged["topic"] == topic]["is_correct"].tolist()
        bkt_res = compute_bkt_mastery(topic_resps)
        bkt_res["subject"] = subj
        results[topic] = bkt_res

    return results

def calculate_batch_topic_mastery_matrix(
    df_responses: pd.DataFrame,
    df_questions: pd.DataFrame,
    student_ids: List[str]
) -> pd.DataFrame:
    """
    Aggregates topic mastery across all students in a batch for institutional heatmaps.
    """
    merged = df_responses[df_responses["student_id"].isin(student_ids)].merge(
        df_questions[["question_id", "subject", "topic"]],
        on="question_id",
        how="left"
    ).sort_values("test_date")

    summary = []
    topics = df_questions[["subject", "topic"]].drop_duplicates()

    for _, t_row in topics.iterrows():
        top = t_row["topic"]
        subj = t_row["subject"]
        student_masteries = []

        for sid in student_ids:
            s_resps = merged[(merged["student_id"] == sid) & (merged["topic"] == top)]["is_correct"].tolist()
            if s_resps:
                m = compute_bkt_mastery(s_resps)["mastery_score"]
                student_masteries.append(m)

        if student_masteries:
            avg_m = np.mean(student_masteries)
            std_m = np.std(student_masteries)
            pct_below_50 = np.mean([1 if m < 0.50 else 0 for m in student_masteries]) * 100
        else:
            avg_m = 0.35
            std_m = 0.0
            pct_below_50 = 0.0

        summary.append({
            "subject": subj,
            "topic": top,
            "average_mastery": round(float(avg_m), 3),
            "mastery_percentage": round(float(avg_m) * 100, 1),
            "std_deviation": round(float(std_m), 3),
            "students_evaluated": len(student_masteries),
            "pct_students_at_risk": round(float(pct_below_50), 1),
            "status": "Vulnerable Concept" if avg_m < 0.45 else ("Satisfactory" if avg_m >= 0.70 else "Moderate")
        })

    return pd.DataFrame(summary).sort_values("average_mastery")
