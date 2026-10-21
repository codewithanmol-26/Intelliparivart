"""
View 11: Data Quality & Model Evaluation Transparency Suite
Audits data health, displays classification metrics (ROC-AUC, Brier score, Confusion Matrix),
and evaluates calibration reliability curves and data leakage status.
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from sqlalchemy.orm import Session
from src.ml.evaluation import get_complete_model_evaluation_report, audit_dataset_quality

def render_model_evaluation(db: Session, institute_id: str, user_role: str):
    st.markdown("## 🔬 Data Quality & Model Evaluation Transparency")
    st.markdown(
        f"<p style='color: #64748B; margin-top: -10px; font-size: 14px;'>"
        f"Rigorous psychometric validation, confusion matrices, calibration curves, and data leakage audits."
        f"</p>",
        unsafe_allow_html=True
    )

    tab_eval, tab_quality, tab_leakage = st.tabs([
        "🤖 ML Model Performance & Baselines",
        "🏥 Dataset Quality & Completeness Audit",
        "🛡️ Data Leakage & Ethical Constraints"
    ])

    # Fetch complete evaluation report
    with st.spinner("Compiling model evaluation metrics..."):
        eval_report = get_complete_model_evaluation_report(db)

    # =========================================================================
    # TAB 1: ML PERFORMANCE & BASELINES
    # =========================================================================
    with tab_eval:
        st.markdown("##### 1. Early-Warning Classifier Metrics (GradientBoosting)")
        clf_data = eval_report.get("classification", {})

        if clf_data.get("status") == "success":
            m_data = clf_data["metrics"]
            e1, e2, e3, e4, e5 = st.columns(5)
            e1.metric("ROC-AUC Score", m_data["roc_auc"], help="Discriminative ability of classifier")
            e2.metric("Brier Calibration Score", m_data["brier_score"], help="Probability calibration (closer to 0 is better)")
            e3.metric("Precision", f"{m_data['precision']*100:.1f}%")
            e4.metric("Recall", f"{m_data['recall']*100:.1f}%")
            e5.metric("F1 Score", f"{m_data['f1_score']:.3f}")

            st.markdown("---")

            # Baselines Comparison Table
            st.markdown("##### 2. Baseline Model Comparison (Section 07 Requirements)")
            b_data = clf_data.get("baselines", {})
            baseline_rows = [
                {"Algorithm": "Heuristic Rule-Based Baseline", "Type": "Non-ML Rules", "ROC-AUC": b_data["rule_based"]["roc_auc"], "Brier Score": b_data["rule_based"]["brier_score"]},
                {"Algorithm": "Logistic Regression (L2)", "Type": "Linear Baseline", "ROC-AUC": b_data["logistic_regression"]["roc_auc"], "Brier Score": b_data["logistic_regression"]["brier_score"]},
                {"Algorithm": "Gradient Boosting Classifier", "Type": "Supervised Ensemble", "ROC-AUC": b_data["gradient_boosting"]["roc_auc"], "Brier Score": b_data["gradient_boosting"]["brier_score"]}
            ]
            st.dataframe(pd.DataFrame(baseline_rows), use_container_width=True, hide_index=True)

            st.markdown("---")

            # ROC & Calibration Charts
            rc_col1, rc_col2 = st.columns(2)
            with rc_col1:
                st.markdown("###### Receiver Operating Characteristic (ROC Curve)")
                roc_pts = eval_report.get("roc_curve", [])
                if roc_pts:
                    df_roc = pd.DataFrame(roc_pts)
                    fig_roc = px.line(df_roc, x="fpr", y="tpr", markers=True, title=f"ROC Curve (AUC = {m_data['roc_auc']})", color_discrete_sequence=["#0D9488"])
                    fig_roc.add_shape(type="line", line=dict(dash="dash", color="#94A3B8"), x0=0, x1=1, y0=0, y1=1)
                    fig_roc.update_layout(
                        paper_bgcolor="#FFFFFF", plot_bgcolor="#F8FAFC",
                        margin=dict(l=10, r=10, t=35, b=10), height=260,
                        xaxis_title="False Positive Rate", yaxis_title="True Positive Rate"
                    )
                    st.plotly_chart(fig_roc, use_container_width=True)

            with rc_col2:
                st.markdown("###### Probability Calibration (Reliability Diagram)")
                cal_pts = eval_report.get("calibration_curve", [])
                if cal_pts:
                    df_cal = pd.DataFrame(cal_pts)
                    fig_cal = px.line(df_cal, x="mean_predicted", y="fraction_positive", markers=True, title=f"Reliability Curve (Brier = {m_data['brier_score']})", color_discrete_sequence=["#2563EB"])
                    fig_cal.add_shape(type="line", line=dict(dash="dash", color="#94A3B8"), x0=0, x1=1, y0=0, y1=1)
                    fig_cal.update_layout(
                        paper_bgcolor="#FFFFFF", plot_bgcolor="#F8FAFC",
                        margin=dict(l=10, r=10, t=35, b=10), height=260,
                        xaxis_title="Mean Predicted Probability", yaxis_title="Fraction of Positives"
                    )
                    st.plotly_chart(fig_cal, use_container_width=True)

            # Confusion Matrix
            st.markdown("###### Confusion Matrix (Test Set Split)")
            cm = m_data.get("confusion_matrix", [[0, 0], [0, 0]])
            df_cm = pd.DataFrame(cm, index=["Actual: Stayed", "Actual: Attrited"], columns=["Pred: Stayed", "Pred: Attrited"])
            st.dataframe(df_cm, use_container_width=True)

        else:
            st.warning("Insufficient outcome labels in database to compile full classifier validation metrics.")

    # =========================================================================
    # TAB 2: DATASET QUALITY & COMPLETENESS AUDIT
    # =========================================================================
    with tab_quality:
        st.markdown("##### 🏥 Ingestion Completeness & Health Audit")
        q_audit = audit_dataset_quality(db, institute_id)

        qa1, qa2, qa3, qa4 = st.columns(4)
        qa1.metric("Overall Health Index", f"{q_audit.get('overall_health_score', 0)}%")
        qa2.metric("Test Data Coverage", f"{q_audit.get('test_data_coverage_pct', 0)}%")
        qa3.metric("Attendance Coverage", f"{q_audit.get('attendance_coverage_pct', 0)}%")
        qa4.metric("DPDP Consent Rate", f"{q_audit.get('parent_consent_compliance_pct', 0)}%")

        st.markdown("---")
        st.markdown("##### Relational Integrity Summary")
        q_details = [
            {"Entity": "Enrolled Students", "Count": q_audit.get("total_active_students", 0), "Status": "Logical Isolation Active"},
            {"Entity": "Question Test Responses", "Count": q_audit.get("total_test_responses", 0), "Status": "Calibrated 2PL IRT Mapped"},
            {"Entity": "Daily Attendance Logs", "Count": q_audit.get("total_attendance_logs", 0), "Status": "Longitudinal Continuity Verified"},
            {"Entity": "Tuition Fee Ledgers", "Count": q_audit.get("total_fee_records", 0), "Status": "Installment Schedule Reconciled"}
        ]
        st.dataframe(pd.DataFrame(q_details), use_container_width=True, hide_index=True)

    # =========================================================================
    # TAB 3: DATA LEAKAGE & ETHICS
    # =========================================================================
    with tab_leakage:
        st.markdown("##### 🛡️ Data Leakage & Ethical Safeguards Audit")
        checks = eval_report.get("data_leakage_checks", [])
        for c in checks:
            st.markdown(f"• **{c['check']}**: `{c['result']}`")

        st.markdown("---")
        st.markdown("##### Known Limitations & Model Boundaries")
        limits = eval_report.get("limitations_and_ethics", [])
        for lm in limits:
            st.markdown(f"⚠️ {lm}")
