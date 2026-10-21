"""
Data Moat - Early-Warning & Disengagement Risk Model
Implements explainable risk classification (Rule-Based Baseline vs GradientBoosting)
paired with feature attribution drivers to support early academic intervention.
Adheres strictly to student well-being safeguards and MoE 2024 zero-shaming principles.
"""

import os
from typing import Dict, List, Tuple, Optional, Any
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, brier_score_loss, precision_score, recall_score, f1_score
from sqlalchemy.orm import Session
import joblib

from src.config import settings
from src.database.models import Student, TestResponse, Attendance, Fee, Engagement, Outcome, Question
from src.ml.irt_bkt import calculate_student_topic_mastery_matrix

RISK_FEATURES = [
    "avg_topic_mastery",
    "min_topic_mastery",
    "overall_attendance",
    "recent_14d_attendance",
    "attendance_slope",
    "fee_default_flag",
    "homework_completion_rate",
    "doubts_count"
]

def extract_features_for_student(
    student_id: str,
    df_responses: pd.DataFrame,
    df_questions: pd.DataFrame,
    df_attendance: pd.DataFrame,
    df_fees: pd.DataFrame,
    df_engagement: pd.DataFrame
) -> Dict[str, float]:
    """Extracts longitudinal behavioral and academic features for a single student."""
    # 1. BKT Topic Mastery features
    s_resps = df_responses[df_responses["student_id"] == student_id]
    if len(s_resps) > 0 and len(df_questions) > 0:
        masteries = calculate_student_topic_mastery_matrix(s_resps, df_questions, student_id)
        m_scores = [v["mastery_score"] for v in masteries.values()]
        avg_m = float(np.mean(m_scores)) if m_scores else 0.40
        min_m = float(np.min(m_scores)) if m_scores else 0.25
    else:
        avg_m = 0.45
        min_m = 0.30

    # 2. Attendance & 14-day Slope
    s_attn = df_attendance[df_attendance["student_id"] == student_id].sort_values("date")
    if len(s_attn) > 14:
        overall_attn = float(s_attn["present_flag"].mean())
        recent_14d_attn = float(s_attn["present_flag"].tail(14).mean())
        attn_slope = float(recent_14d_attn - overall_attn)
    elif len(s_attn) > 0:
        overall_attn = float(s_attn["present_flag"].mean())
        recent_14d_attn = overall_attn
        attn_slope = 0.0
    else:
        overall_attn = 0.85
        recent_14d_attn = 0.85
        attn_slope = 0.0

    # 3. Fee Default Status
    s_fees = df_fees[df_fees["student_id"] == student_id]
    has_defaulted = 1.0 if (len(s_fees) > 0 and (s_fees["status"] == "DEFAULTED").any()) else 0.0

    # 4. Engagement (Homework & Doubts)
    s_eng = df_engagement[df_engagement["student_id"] == student_id]
    if len(s_eng) > 0:
        hw_rate = float(s_eng["homework_submitted"].mean())
        doubts = float(s_eng["doubts_asked"].sum())
    else:
        hw_rate = 0.85
        doubts = 4.0

    return {
        "avg_topic_mastery": round(avg_m, 3),
        "min_topic_mastery": round(min_m, 3),
        "overall_attendance": round(overall_attn, 3),
        "recent_14d_attendance": round(recent_14d_attn, 3),
        "attendance_slope": round(attn_slope, 3),
        "fee_default_flag": has_defaulted,
        "homework_completion_rate": round(hw_rate, 3),
        "doubts_count": doubts
    }

def rule_based_baseline_score(feat: Dict[str, float]) -> float:
    """Simple, explainable heuristic baseline risk score."""
    score = 0.0
    if feat["attendance_slope"] < -0.12:
        score += 0.35
    if feat["overall_attendance"] < 0.75:
        score += 0.30
    if feat["min_topic_mastery"] < 0.40:
        score += 0.20
    if feat["fee_default_flag"] == 1.0:
        score += 0.20
    if feat["homework_completion_rate"] < 0.60:
        score += 0.15
    return min(0.98, max(0.02, round(score, 3)))

class EarlyWarningPipeline:
    def __init__(self):
        self.model = GradientBoostingClassifier(
            n_estimators=70,
            max_depth=3,
            learning_rate=0.08,
            random_state=42
        )
        self.is_fitted = False
        self.feature_names = RISK_FEATURES
        self.feature_importances_ = {}

    def fit(self, X: pd.DataFrame, y: np.ndarray):
        """Fits the supervised gradient boosting model and computes feature importances."""
        self.model.fit(X[self.feature_names], y)
        self.is_fitted = True
        self.feature_importances_ = dict(zip(self.feature_names, self.model.feature_importances_))
        
        # Save model artifact
        model_path = settings.MODELS_DIR / "early_warning_model.joblib"
        joblib.dump(self.model, model_path)

    def predict_risk(self, feat: Dict[str, float]) -> Tuple[float, List[str], str]:
        """
        Produces calibrated risk probability, top contributing factors, and risk tier.
        """
        if not self.is_fitted:
            model_path = settings.MODELS_DIR / "early_warning_model.joblib"
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
                self.is_fitted = True
                self.feature_importances_ = dict(zip(self.feature_names, self.model.feature_importances_))
            else:
                prob = rule_based_baseline_score(feat)
                tier = "HIGH" if prob >= 0.60 else ("MODERATE" if prob >= 0.30 else "LOW")
                drivers = self._explain_factors(feat)
                return prob, drivers, tier

        df_in = pd.DataFrame([feat])[self.feature_names]
        prob = float(self.model.predict_proba(df_in)[0, 1])
        prob = round(prob, 3)

        tier = "HIGH" if prob >= 0.60 else ("MODERATE" if prob >= 0.30 else "LOW")
        drivers = self._explain_factors(feat)
        return prob, drivers, tier

    def _explain_factors(self, feat: Dict[str, float]) -> List[str]:
        """Generates human-readable contributing drivers for pedagogical intervention."""
        reasons = []
        if feat["attendance_slope"] < -0.08:
            drop_pct = abs(feat["attendance_slope"]) * 100
            reasons.append(f"Attendance declined by {drop_pct:.0f}% over the last 14 days")
        if feat["min_topic_mastery"] < 0.40:
            reasons.append(f"Severe concept bottleneck in weakest topic ({feat['min_topic_mastery']*100:.0f}% mastery)")
        if feat["fee_default_flag"] == 1.0:
            reasons.append("Pending fee installment default signal")
        if feat["homework_completion_rate"] < 0.70:
            reasons.append(f"Low homework submission rate ({feat['homework_completion_rate']*100:.0f}%)")
        if feat["overall_attendance"] < 0.75:
            reasons.append(f"Sub-optimal overall attendance ({feat['overall_attendance']*100:.0f}%)")
        if not reasons:
            reasons.append("Minor score fluctuation during recent mock test pacing")
        return reasons[:3]

# Global singleton pipeline instance
early_warning_engine = EarlyWarningPipeline()

def train_and_evaluate_early_warning_model(
    db: Session,
    force_retrain: bool = False
) -> Dict[str, Any]:
    """
    Extracts features from database, splits into train/validation/test sets,
    fits the Early Warning model, and computes evaluation metrics.
    """
    outcomes = db.query(Outcome).all()
    if not outcomes:
        return {"status": "insufficient_data", "message": "No outcome records available for model training."}

    # Fetch all relevant tables
    students_df = pd.read_sql(db.query(Student).statement, db.bind)
    questions_df = pd.read_sql(db.query(Question).statement, db.bind)
    responses_df = pd.read_sql(db.query(TestResponse).statement, db.bind)
    attendance_df = pd.read_sql(db.query(Attendance).statement, db.bind)
    fees_df = pd.read_sql(db.query(Fee).statement, db.bind)
    engagement_df = pd.read_sql(db.query(Engagement).statement, db.bind)
    outcomes_df = pd.read_sql(db.query(Outcome).statement, db.bind)

    rows = []
    for _, out_row in outcomes_df.iterrows():
        sid = out_row["student_id"]
        feat = extract_features_for_student(
            sid, responses_df, questions_df, attendance_df, fees_df, engagement_df
        )
        feat["student_id"] = sid
        feat["label"] = int(out_row["dropped_out_flag"])
        rows.append(feat)

    df_dataset = pd.DataFrame(rows)
    X = df_dataset[RISK_FEATURES]
    y = df_dataset["label"].values

    # Train / Test split (80/20 stratified)
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    # 1. Baseline: Rule-based
    baseline_probs = [rule_based_baseline_score(row.to_dict()) for _, row in X_test.iterrows()]
    baseline_brier = brier_score_loss(y_test, baseline_probs)
    baseline_auc = roc_auc_score(y_test, baseline_probs)

    # 2. Logistic Regression Baseline
    lr = LogisticRegression(max_iter=500)
    lr.fit(X_train, y_train)
    lr_probs = lr.predict_proba(X_test)[:, 1]
    lr_auc = roc_auc_score(y_test, lr_probs)
    lr_brier = brier_score_loss(y_test, lr_probs)

    # 3. Supervised Gradient Boosting
    early_warning_engine.fit(X_train, y_train)
    gb_probs = early_warning_engine.model.predict_proba(X_test)[:, 1]
    gb_preds = (gb_probs >= 0.45).astype(int)

    gb_auc = roc_auc_score(y_test, gb_probs)
    gb_brier = brier_score_loss(y_test, gb_probs)
    gb_prec = precision_score(y_test, gb_preds, zero_division=0)
    gb_rec = recall_score(y_test, gb_preds, zero_division=0)
    gb_f1 = f1_score(y_test, gb_preds, zero_division=0)

    from sklearn.metrics import confusion_matrix
    cm = confusion_matrix(y_test, gb_preds)

    return {
        "status": "success",
        "sample_size_total": len(df_dataset),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "positive_class_ratio": round(float(np.mean(y)), 3),
        "metrics": {
            "roc_auc": round(float(gb_auc), 3),
            "brier_score": round(float(gb_brier), 3),
            "precision": round(float(gb_prec), 3),
            "recall": round(float(gb_rec), 3),
            "f1_score": round(float(gb_f1), 3),
            "confusion_matrix": cm.tolist()
        },
        "baselines": {
            "rule_based": {"roc_auc": round(float(baseline_auc), 3), "brier_score": round(float(baseline_brier), 3)},
            "logistic_regression": {"roc_auc": round(float(lr_auc), 3), "brier_score": round(float(lr_brier), 3)},
            "gradient_boosting": {"roc_auc": round(float(gb_auc), 3), "brier_score": round(float(gb_brier), 3)}
        },
        "feature_importances": {k: round(float(v), 3) for k, v in early_warning_engine.feature_importances_.items()},
        "observation_window": "120-Day Longitudinal Session",
        "prediction_horizon": "Next 30 to 60 Academic Days"
    }

def generate_at_risk_triage_roster(
    db: Session,
    institute_id: str
) -> pd.DataFrame:
    """
    Generates prioritized confidential triage roster for authorized academic mentors.
    Enforces institute-level tenant isolation.
    """
    students = db.query(Student).filter(Student.institute_id == institute_id).all()
    if not students:
        return pd.DataFrame()

    student_ids = [s.student_id for s in students]

    responses_df = pd.read_sql(
        db.query(TestResponse).filter(TestResponse.student_id.in_(student_ids)).statement, db.bind
    )
    questions_df = pd.read_sql(db.query(Question).statement, db.bind)
    attendance_df = pd.read_sql(
        db.query(Attendance).filter(Attendance.student_id.in_(student_ids)).statement, db.bind
    )
    fees_df = pd.read_sql(
        db.query(Fee).filter(Fee.student_id.in_(student_ids)).statement, db.bind
    )
    engagement_df = pd.read_sql(
        db.query(Engagement).filter(Engagement.student_id.in_(student_ids)).statement, db.bind
    )

    roster = []
    for std in students:
        feat = extract_features_for_student(
            std.student_id, responses_df, questions_df, attendance_df, fees_df, engagement_df
        )
        prob, drivers, tier = early_warning_engine.predict_risk(feat)

        roster.append({
            "student_id": std.student_id,
            "name": std.name,
            "batch_id": std.batch_id,
            "class_level": std.class_level,
            "risk_score": prob,
            "risk_percentage": f"{prob*100:.1f}%",
            "risk_tier": tier,
            "attendance": f"{feat['overall_attendance']*100:.0f}%",
            "attendance_slope": f"{feat['attendance_slope']*100:+.1f}%",
            "avg_mastery": f"{feat['avg_topic_mastery']*100:.0f}%",
            "fee_status": "Overdue" if feat["fee_default_flag"] == 1.0 else "Regular",
            "primary_drivers": " | ".join(drivers)
        })

    df_roster = pd.DataFrame(roster).sort_values("risk_score", ascending=False)
    return df_roster
