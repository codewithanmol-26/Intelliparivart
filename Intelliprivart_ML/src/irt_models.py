"""
Intelliprivart Data Moat - Psychometrics & Item Response Theory (IRT) Pipeline
Implements:
1. Rasch / 1PL IRT Baseline Model
2. 2PL IRT Model with MAP Ability Estimation & Guessing Floors
3. Parameter Recovery Verification against Ground Truth Parameters
4. Bayesian Knowledge Tracing (BKT) & Topic Mastery Aggregations
"""

from typing import Dict, List, Tuple, Any, Optional
import numpy as np
import pandas as pd
from scipy.optimize import minimize_scalar, minimize
from scipy import stats as sp_stats

def compute_1pl_rasch_probability(theta: float, b: float) -> float:
    """Computes standard 1PL Rasch probability: P(Y=1) = 1 / (1 + exp(-(theta - b)))."""
    logit = np.clip(theta - b, -35.0, 35.0)
    return float(1.0 / (1.0 + np.exp(-logit)))

def compute_2pl_irt_probability(theta: float, a: float, b: float, c: float = 0.20) -> float:
    """Computes 2PL/3PL IRT probability: P(Y=1) = c + (1 - c) / (1 + exp(-a * (theta - b)))."""
    logit = np.clip(-a * (theta - b), -35.0, 35.0)
    return float(c + (1.0 - c) / (1.0 + np.exp(logit)))

def fit_rasch_1pl_baseline(df_responses: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Fits 1PL Rasch baseline using empirical logits with Empirical Bayes shrinkage.
    Returns (item_params_df, student_ability_df).
    """
    # 1. Item Difficulty Estimation
    item_stats = df_responses.groupby("question_id")["is_correct"].agg(
        n_obs="count",
        n_correct="sum",
        mean_p="mean"
    ).reset_index()

    # Shrinkage towards prior mean 0.50
    prior_weight = 5.0
    item_stats["shrunk_p"] = (item_stats["n_correct"] + prior_weight * 0.50) / (item_stats["n_obs"] + prior_weight)
    item_stats["shrunk_p"] = item_stats["shrunk_p"].clip(0.02, 0.98)
    # Invert so higher error rate = higher difficulty b
    item_stats["estimated_b_1pl"] = np.log((1.0 - item_stats["shrunk_p"]) / item_stats["shrunk_p"])

    # 2. Student Ability Estimation
    std_stats = df_responses.groupby("student_id")["is_correct"].agg(
        n_obs="count",
        n_correct="sum",
        mean_p="mean"
    ).reset_index()

    std_stats["shrunk_p"] = (std_stats["n_correct"] + prior_weight * 0.50) / (std_stats["n_obs"] + prior_weight)
    std_stats["shrunk_p"] = std_stats["shrunk_p"].clip(0.02, 0.98)
    std_stats["estimated_theta_1pl"] = np.log(std_stats["shrunk_p"] / (1.0 - std_stats["shrunk_p"]))

    return item_stats[["question_id", "estimated_b_1pl", "n_obs", "mean_p"]], std_stats[["student_id", "estimated_theta_1pl", "n_obs", "mean_p"]]

def estimate_student_theta_2pl_map(
    responses: np.ndarray,
    a_params: np.ndarray,
    b_params: np.ndarray,
    c: float = 0.20
) -> float:
    """
    Estimates student latent ability theta using Maximum A Posteriori (MAP)
    under standard normal prior theta ~ N(0, 1).
    """
    if len(responses) == 0:
        return 0.0

    def neg_log_posterior(theta_val: float) -> float:
        # Prior: -0.5 * theta^2
        log_prior = -0.5 * (theta_val ** 2)
        # Likelihood
        p = compute_2pl_irt_vectorized(theta_val, a_params, b_params, c)
        p = np.clip(p, 1e-7, 1.0 - 1e-7)
        log_lik = np.sum(responses * np.log(p) + (1.0 - responses) * np.log(1.0 - p))
        return -(log_lik + log_prior)

    res = minimize_scalar(neg_log_posterior, bounds=(-4.0, 4.0), method="bounded")
    return round(float(res.x), 3)

def compute_2pl_irt_vectorized(theta: float, a: np.ndarray, b: np.ndarray, c: float = 0.20) -> np.ndarray:
    """Vectorized calculation of 2PL IRT response probabilities."""
    logit = np.clip(-a * (theta - b), -35.0, 35.0)
    return c + (1.0 - c) / (1.0 + np.exp(logit))

def evaluate_parameter_recovery(
    estimated_df: pd.DataFrame,
    true_df: pd.DataFrame,
    param_col_est: str,
    param_col_true: str,
    key_col: str
) -> Dict[str, float]:
    """
    Evaluates parameter recovery accuracy against known synthetic ground truth.
    Computes Pearson r, Spearman rho, MAE, and RMSE.
    """
    merged = estimated_df.merge(true_df[[key_col, param_col_true]], on=key_col, how="inner")
    y_est = merged[param_col_est].values
    y_true = merged[param_col_true].values

    r, _ = sp_stats.pearsonr(y_est, y_true)
    rho, _ = sp_stats.spearmanr(y_est, y_true)
    mae = float(np.mean(np.abs(y_est - y_true)))
    rmse = float(np.sqrt(np.mean((y_est - y_true) ** 2)))

    return {
        "pearson_r": round(float(r), 4),
        "spearman_rho": round(float(rho), 4),
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "sample_size": len(merged)
    }

def compute_bayesian_knowledge_tracing(
    attempt_sequence: List[int],
    p_l0: float = 0.35,
    p_t: float = 0.15,
    p_g: float = 0.20,
    p_s: float = 0.10
) -> Dict[str, Any]:
    """
    Simulates Bayesian Knowledge Tracing (BKT) updates across an attempt sequence.
    """
    if not attempt_sequence:
        return {
            "mastery_score": p_l0,
            "observations": 0,
            "confidence": "No Observations",
            "trajectory": [p_l0]
        }

    p_l = p_l0
    traj = [round(p_l, 3)]

    for is_corr in attempt_sequence:
        # Observation update (Bayes Theorem)
        if is_corr == 1:
            p_obs = (p_l * (1.0 - p_s)) / ((p_l * (1.0 - p_s)) + ((1.0 - p_l) * p_g) + 1e-9)
        else:
            p_obs = (p_l * p_s) / ((p_l * p_s) + ((1.0 - p_l) * (1.0 - p_g)) + 1e-9)

        # Learning transition update
        p_l = p_obs + (1.0 - p_obs) * p_t
        p_l = float(np.clip(p_l, 0.01, 0.99))
        traj.append(round(p_l, 3))

    n_obs = len(attempt_sequence)
    confidence = "Low Evidence" if n_obs < 4 else ("Moderate Evidence" if n_obs < 10 else "High Evidence")

    return {
        "mastery_score": round(p_l, 3),
        "observations": n_obs,
        "confidence": confidence,
        "trajectory": traj
    }
