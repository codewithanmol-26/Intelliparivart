"""
Intelliprivart Data Moat - Bayesian Knowledge Tracing (BKT) Engine
Tracks per-student latent knowledge state transition across sequential question attempts.
Standard BKT Parameters:
- P(L0) = Prior knowledge probability (default: 0.35)
- P(T)  = Transition / learning rate probability (default: 0.15)
- P(G)  = Guess probability (default: 0.20)
- P(S)  = Slip probability (default: 0.10)
"""

from typing import Dict, List, Tuple, Any, Optional
import numpy as np
import pandas as pd

def compute_student_topic_mastery(
    df_responses: pd.DataFrame,
    df_questions: pd.DataFrame,
    p_l0: float = 0.35,
    p_t: float = 0.15,
    p_g: float = 0.20,
    p_s: float = 0.10
) -> pd.DataFrame:
    """
    Computes dynamic BKT mastery and simple percent-correct for every student-topic pair.
    Returns DataFrame with columns: [student_id, topic_id, subject, topic, bkt_mastery, raw_accuracy, attempts, confidence]
    """
    # Join question metadata
    merged = df_responses.merge(
        df_questions[["id", "topic_id", "subject", "topic"]],
        left_on="question_id",
        right_on="id"
    )

    records = []
    # Sort chronologically
    sorted_df = merged.sort_values(["student_id", "topic_id", "test_date"])

    for (sid, t_id), group in sorted_df.groupby(["student_id", "topic_id"]):
        p_l = p_l0
        attempts = len(group)
        correct_count = group["is_correct"].sum()

        for corr in group["is_correct"].values:
            # Observation update
            if corr == 1:
                p_obs = (p_l * (1.0 - p_s)) / ((p_l * (1.0 - p_s)) + ((1.0 - p_l) * p_g) + 1e-9)
            else:
                p_obs = (p_l * p_s) / ((p_l * p_s) + ((1.0 - p_l) * (1.0 - p_g)) + 1e-9)
            
            # Transition update
            p_l = p_obs + (1.0 - p_obs) * p_t
            p_l = float(np.clip(p_l, 0.02, 0.98))

        # Confidence is high if attempts >= 8, moderate for 4-7, low for < 4
        confidence = "HIGH" if attempts >= 8 else ("MODERATE" if attempts >= 4 else "LOW")
        raw_accuracy = float(correct_count / attempts) if attempts > 0 else 0.50

        records.append({
            "student_id": sid,
            "topic_id": t_id,
            "subject": group["subject"].iloc[0],
            "topic": group["topic"].iloc[0],
            "bkt_mastery": round(p_l, 3),
            "raw_accuracy": round(raw_accuracy, 3),
            "attempts": attempts,
            "confidence": confidence,
            "uncertainty_width": round(0.40 / np.sqrt(max(1, attempts)), 3) # Wider for fewer attempts
        })

    return pd.DataFrame(records)

def generate_batch_mastery_matrix(
    df_student_mastery: pd.DataFrame,
    df_students: pd.DataFrame,
    batch_id: str
) -> Dict[str, Any]:
    """Generates the 2D matrix (students x topics) for heatmap rendering in a given batch."""
    batch_sids = set(df_students[df_students["batch_id"] == batch_id]["id"])
    subset = df_student_mastery[df_student_mastery["student_id"].isin(batch_sids)]

    if subset.empty:
        return {"students": [], "topics": [], "matrix": [], "weakest_topics": []}

    pivot_mastery = subset.pivot_table(index="student_id", columns="topic", values="bkt_mastery", aggfunc="mean").fillna(0.35)
    pivot_raw = subset.pivot_table(index="student_id", columns="topic", values="raw_accuracy", aggfunc="mean").fillna(0.35)
    pivot_uncertainty = subset.pivot_table(index="student_id", columns="topic", values="uncertainty_width", aggfunc="mean").fillna(0.40)

    # Topic-level summary
    topic_means = subset.groupby(["topic_id", "topic"])["bkt_mastery"].mean().reset_index()
    weakest = topic_means.sort_values("bkt_mastery").head(3).to_dict(orient="records")

    return {
        "batch_id": batch_id,
        "students": list(pivot_mastery.index),
        "topics": list(pivot_mastery.columns),
        "bkt_matrix": pivot_mastery.round(3).values.tolist(),
        "raw_matrix": pivot_raw.round(3).values.tolist(),
        "uncertainty_matrix": pivot_uncertainty.round(3).values.tolist(),
        "weakest_topics": weakest
    }
