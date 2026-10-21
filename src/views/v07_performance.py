"""
View 07: Performance Prediction & Honest Uncertainty Intervals
Calibrated competitive exam percentile ranges [P10, P90] aligned with MoE 2024 Guidelines.
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from scipy import stats as sp_stats
from sqlalchemy.orm import Session
from src.database.models import Student, TestResponse, Question, Outcome
from src.ml.performance import predict_student_percentile_interval, evaluate_percentile_prediction_accuracy

def render_performance(db: Session, institute_id: str, user_role: str):
    st.markdown("## 🎯 Honest Performance & Percentile Interval Prediction")
    st.markdown(
        f"<p style='color: #64748B; margin-top: -10px; font-size: 14px;'>"
        f"Statistically calibrated percentile prediction intervals [P₁₀, P₉₀] with explicit uncertainty bounds."
        f"</p>",
        unsafe_allow_html=True
    )

    st.info(
        "⚖️ **Regulatory Compliance Notice (MoE 2024 Coaching Guidelines):** "
        "Data Moat provides honest percentile ranges rather than single-point rank promises. "
        "Overpromising deterministic ranks without uncertainty is misleading and statistically invalid."
    )

    students = db.query(Student).filter(Student.institute_id == institute_id).all()
    if not students:
        st.warning("No student records found.")
        return

    # 1. Student Selection
    target_sid = st.selectbox(
        "Select Student for Percentile Projection:",
        [s.student_id for s in students],
        format_func=lambda sid: f"{sid} — {next((s.name for s in students if s.student_id == sid), '')}"
    )

    responses_df = pd.read_sql(
        db.query(TestResponse).filter(TestResponse.student_id == target_sid).statement, db.bind
    )
    questions_df = pd.read_sql(db.query(Question).statement, db.bind)

    if responses_df.empty:
        st.warning("This student has not yet participated in milestone mock exams.")
        return

    # Compute prediction
    pred = predict_student_percentile_interval(target_sid, responses_df, questions_df)

    # 2. Display Prediction Cards
    c1, c2, c3 = st.columns([1.5, 1.2, 1.3])
    with c1:
        st.markdown(f"""
        <div style='background: #F0FDF4; border: 1.5px solid #86EFAC; padding: 18px; border-radius: 10px;'>
            <span style='font-size: 13px; color: #166534; font-weight: 600;'>Estimated Exam Percentile Interval:</span><br/>
            <b style='font-size: 32px; color: #14532D;'>{pred['confidence_band']}</b><br/>
            <span style='font-size: 12px; color: #15803D;'>Expected Midpoint: <b>{pred['expected_percentile']}%</b> (Uncertainty: ±{pred['uncertainty_margin']}%)</span>
        </div>
        """, unsafe_allow_html=True)

    with c2:
        st.metric("Latent Ability (θ)", f"{pred['latent_ability_theta']:+.2f}", help="Standardized 2PL IRT ability scale (mean 0.0, std 1.0)")
        st.metric("Mock Exams Analyzed", pred["mock_tests_evaluated"])

    with c3:
        st.markdown(f"""
        <div style='background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 10px;'>
            <b style='font-size: 13px; color: #0F172A;'>Qualifying Trajectory Outlook:</b><br/>
            <span style='font-size: 12px; color: #475569;'>{pred['qualifying_outlook']}</span><br/>
            <hr style='margin: 6px 0; border: 0.5px solid #E2E8F0;'>
            <span style='font-size: 11px; color: #64748B;'>80% Empirical Credible Interval calibrated against NTA CDF.</span>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")

    # 3. Interactive Normal Percentile Bell Curve
    st.markdown("##### 📈 National NTA Percentile Distribution & Credible Range")
    
    # Generate bell curve
    x_vals = np.linspace(0.0, 100.0, 300)
    mu = pred["expected_percentile"]
    sigma = pred["uncertainty_margin"] / 1.28  # 80% interval corresponds to 1.28 standard errors
    y_vals = sp_stats.norm.pdf(x_vals, mu, sigma)

    fig_curve = go.Figure()

    # Full distribution curve
    fig_curve.add_trace(go.Scatter(
        x=x_vals,
        y=y_vals,
        mode="lines",
        line=dict(color="#0D9488", width=2.5),
        name="Predictive Density"
    ))

    # Shaded Credible Interval [P10, P90]
    x_shaded = np.linspace(pred["p10"], pred["p90"], 100)
    y_shaded = sp_stats.norm.pdf(x_shaded, mu, sigma)
    fig_curve.add_trace(go.Scatter(
        x=np.concatenate([x_shaded, x_shaded[::-1]]),
        y=np.concatenate([y_shaded, np.zeros(len(y_shaded))]),
        fill="toself",
        fillcolor="rgba(13, 148, 136, 0.25)",
        line=dict(color="rgba(255,255,255,0)"),
        name="80% Prediction Band"
    ))

    # Cutoff reference lines
    fig_curve.add_vline(x=90.0, line_dash="dash", line_color="#EF4444", annotation_text="JEE Cutoff (90%)", annotation_position="top right")
    fig_curve.add_vline(x=85.0, line_dash="dot", line_color="#F59E0B", annotation_text="NEET Cutoff (85%)", annotation_position="top left")

    fig_curve.update_layout(
        paper_bgcolor="#FFFFFF",
        plot_bgcolor="#F8FAFC",
        height=300,
        margin=dict(l=20, r=20, t=30, b=20),
        xaxis_title="National Percentile (%)",
        yaxis_title="Probability Density",
        xaxis=dict(range=[20, 100])
    )
    st.plotly_chart(fig_curve, use_container_width=True)

    # 4. Calibration Accuracy Evaluation on Held-Out Records
    st.markdown("##### 🔬 Calibration Accuracy Against Observed Exam Outcomes")
    accuracy_eval = evaluate_percentile_prediction_accuracy(db)
    if accuracy_eval.get("status") == "success":
        a1, a2, a3, a4 = st.columns(4)
        a1.metric("Evaluated Cohort Size", accuracy_eval["sample_size"])
        a2.metric("Mean Absolute Error (MAE)", f"{accuracy_eval['mae']}%", help="Average gap between expected and actual percentile")
        a3.metric("Root Mean Squared Error", f"{accuracy_eval['rmse']}%")
        a4.metric("Empirical Interval Coverage", f"{accuracy_eval['empirical_interval_coverage_pct']}%", delta=f"Target: {accuracy_eval['target_coverage_pct']}%")
    else:
        st.caption("Validation metrics update as historical outcome labels become available.")
