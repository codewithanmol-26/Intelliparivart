"""
Intelliprivart Data Moat - Psychometrics & Item Response Theory (IRT) Engine
Implements:
1. 1PL Rasch model with Empirical Bayes shrinkage difficulty estimation
2. 2PL IRT model with Maximum A Posteriori (MAP) latent ability (theta) estimation
3. Parameter recovery verification (Pearson r, MAE, RMSE)
"""

from typing import Dict, List, Tuple, Any, Optional
import numpy as np
import pandas as pd
from scipy.optimize import minimize_scalar
from scipy import stats as sp_stats

def compute_2pl_probability(theta: float, a: float, b: float, c: float = 0.10) -> float:
    """Computes 2PL IRT response probability with guessing parameter c:
    P(Y=1|theta) = c + (1 - c) / (1 + exp(-a * (theta - b)))"""
    logit = np.clip(-a * (theta - b), -30.0, 30.0)
    return float(c + (1.0 - c) / (1.0 + np.exp(logit)))

def estimate_1pl_item_difficulties(df_responses: pd.DataFrame, prior_weight: float = 5.0) -> pd.DataFrame:
    """
    Fits 1PL Rasch item difficulties using empirical log-odds with Empirical Bayes shrinkage
    toward the prior mean of 0.50 correctness.
    """
    stats = df_responses.groupby("question_id")["is_correct"].agg(
        n_obs="count",
        n_correct="sum",
        mean_accuracy="mean"
    ).reset_index()

    stats["shrunk_p"] = (stats["n_correct"] + prior_weight * 0.50) / (stats["n_obs"] + prior_weight)
    stats["shrunk_p"] = stats["shrunk_p"].clip(0.02, 0.98)
    # Higher difficulty b = lower probability of correct answer
    stats["estimated_b_1pl"] = np.log((1.0 - stats["shrunk_p"]) / stats["shrunk_p"])
    return stats[["question_id", "n_obs", "mean_accuracy", "estimated_b_1pl"]]

def estimate_2pl_student_abilities(
    df_responses: pd.DataFrame,
    df_questions: pd.DataFrame,
    c: float = 0.10
) -> pd.DataFrame:
    """
    Estimates student latent ability theta via Maximum A Posteriori (MAP) under standard Gaussian prior:
    log_posterior(theta) = sum(y_i * log(P) + (1-y_i)*log(1-P)) - 0.5 * theta^2
    """
    q_dict = df_questions.set_index("id")[["discrimination_a", "difficulty_b"]].to_dict(orient="index")

    estimates = []
    for sid, group in df_responses.groupby("student_id"):
        resps = group["is_correct"].values
        q_ids = group["question_id"].values

        # Filter to known questions
        valid_mask = [qid in q_dict for qid in q_ids]
        if not any(valid_mask):
            estimates.append({"student_id": sid, "estimated_theta_2pl": 0.0, "standard_error": 1.0})
            continue

        resps = resps[valid_mask]
        a_vals = np.array([q_dict[qid]["discrimination_a"] for qid in q_ids if qid in q_dict])
        b_vals = np.array([q_dict[qid]["difficulty_b"] for qid in q_ids if qid in q_dict])

        def neg_log_post(theta_val):
            log_prior = -0.5 * (theta_val ** 2)
            p = c + (1.0 - c) / (1.0 + np.exp(np.clip(-a_vals * (theta_val - b_vals), -30.0, 30.0)))
            p = np.clip(p, 1e-7, 1.0 - 1e-7)
            log_lik = np.sum(resps * np.log(p) + (1.0 - resps) * np.log(1.0 - p))
            return -(log_lik + log_prior)

        res = minimize_scalar(neg_log_post, bounds=(-4.0, 4.0), method="bounded")
        theta_est = round(float(res.x), 3)
        
        # Approximate standard error via Fisher Information
        p_est = c + (1.0 - c) / (1.0 + np.exp(np.clip(-a_vals * (theta_est - b_vals), -30.0, 30.0)))
        p_est = np.clip(p_est, 1e-5, 1.0 - 1e-5)
        # dP/dtheta
        q_est = 1.0 - p_est
        p_star = 1.0 / (1.0 + np.exp(np.clip(-a_vals * (theta_est - b_vals), -30.0, 30.0)))
        dp = (1.0 - c) * a_vals * p_star * (1.0 - p_star)
        info = np.sum((dp ** 2) / (p_est * q_est)) + 1.0 # +1 from Gaussian prior
        se = float(1.0 / np.sqrt(max(0.1, info)))

        estimates.append({
            "student_id": sid,
            "estimated_theta_2pl": theta_est,
            "standard_error": round(se, 3)
        })

    return pd.DataFrame(estimates)

def verify_parameter_recovery(
    df_estimated: pd.DataFrame,
    df_ground_truth: pd.DataFrame,
    est_col: str,
    true_col: str,
    key_col: str
) -> Dict[str, float]:
    """Evaluates Pearson correlation, MAE, and RMSE against synthetic ground truth."""
    merged = df_estimated.merge(df_ground_truth, on=key_col)
    r, _ = sp_stats.pearsonr(merged[est_col], merged[true_col])
    mae = float(np.mean(np.abs(merged[est_col] - merged[true_col])))
    rmse = float(np.sqrt(np.mean((merged[est_col] - merged[true_col]) ** 2)))
    return {"pearson_r": round(float(r), 4), "mae": round(mae, 4), "rmse": round(rmse, 4)}
