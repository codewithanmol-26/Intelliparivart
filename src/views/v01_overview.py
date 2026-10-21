"""
View 01: Overview & Executive Command Center
High-level KPIs, batch comparisons, test score trajectories, and disengagement risk metrics.
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from sqlalchemy.orm import Session
from src.database.models import Student, Batch, Test, TestResponse, Intervention, Question
from src.ml.early_warning import generate_at_risk_triage_roster
from src.ml.evaluation import audit_dataset_quality
from src.data.generator import seed_database

def render_overview(db: Session, institute_id: str, user_role: str):
    st.markdown("## 📊 Institute Executive Overview")
    st.markdown(
        f"<p style='color: #64748B; margin-top: -10px; font-size: 14px;'>"
        f"Real-time institutional diagnostics and longitudinal learning indicators | Active Tenant: <b>{institute_id}</b>"
        f"</p>",
        unsafe_allow_html=True
    )

    # 1. Check Data Availability
    students = db.query(Student).filter(Student.institute_id == institute_id).all()
    if not students:
        st.warning("⚠️ No student records detected in the active workspace.")
        st.markdown("""
        ### Welcome to Data Moat!
        Get started by generating our validated **Synthetic Competition Dataset** (1,200 students, 9 mock tests, 80 calibrated questions) or importing your institute spreadsheets.
        """)
        if st.button("🚀 Seed Comprehensive Synthetic Dataset (1-Click Demo)", type="primary"):
            with st.spinner("Populating database with 3 institutes and 1,200 students..."):
                seed_database(db, force=False)
                st.success("Synthetic dataset populated successfully!")
                st.rerun()
        return

    # 2. Filters Row
    batches = db.query(Batch).filter(Batch.institute_id == institute_id).all()
    batch_options = ["All Batches"] + [b.batch_id for b in batches]

    f_col1, f_col2, f_col3 = st.columns([1.5, 1.5, 1])
    with f_col1:
        sel_batch = st.selectbox("Filter by Batch", batch_options, key="ov_batch_filter")
    with f_col2:
        sel_exam = st.selectbox("Exam Focus", ["All Streams", "JEE Main & Advanced", "NEET Medical"], key="ov_exam_filter")
    with f_col3:
        st.markdown("<div style='height: 28px;'></div>", unsafe_allow_html=True)
        st.caption("🟢 **Live Database Sync Active**")

    # Filtered students
    if sel_batch != "All Batches":
        active_students = [s for s in students if s.batch_id == sel_batch]
    else:
        active_students = students

    student_ids = [s.student_id for s in active_students]

    # 3. Compute High-Level Metrics
    tests_count = db.query(Test).filter(Test.institute_id == institute_id).count()
    responses_query = db.query(TestResponse).filter(TestResponse.student_id.in_(student_ids))
    responses_df = pd.read_sql(responses_query.statement, db.bind)

    avg_score = (responses_df["is_correct"].mean() * 100) if len(responses_df) > 0 else 0.0

    # Risk Triage Count
    triage_df = generate_at_risk_triage_roster(db, institute_id)
    if not triage_df.empty and sel_batch != "All Batches":
        triage_df = triage_df[triage_df["batch_id"] == sel_batch]

    high_risk_count = len(triage_df[triage_df["risk_tier"] == "HIGH"]) if not triage_df.empty else 0
    support_needed_count = len(triage_df[triage_df["risk_tier"].isin(["HIGH", "MODERATE"])]) if not triage_df.empty else 0

    # Data Quality
    quality_audit = audit_dataset_quality(db, institute_id)
    health_score = quality_audit.get("overall_health_score", 92.5)

    # 4. Render KPI Cards
    k1, k2, k3, k4, k5, k6 = st.columns(6)
    with k1:
        st.metric("Total Active Students", len(active_students), help="Enrolled students in current selection")
    with k2:
        st.metric("Academic Batches", len(batches), help="Configured batches")
    with k3:
        st.metric("Avg Test Accuracy", f"{avg_score:.1f}%", help="Correct response rate across mock exams")
    with k4:
        st.metric("Needs Academic Support", support_needed_count, delta=f"{high_risk_count} High Risk", delta_color="inverse")
    with k5:
        st.metric("Milestone Tests Held", tests_count, help="Fortnightly mock tests conducted")
    with k6:
        st.metric("Data Completeness", f"{health_score}%", help="Health of attendance, tests & consent records")

    st.markdown("<hr style='margin: 15px 0; border: 0.5px solid #E2E8F0;'>", unsafe_allow_html=True)

    # 5. Charts Row 1: Test Performance Trends & Batch Score Comparison
    c1, c2 = st.columns([1.6, 1.4])

    with c1:
        st.markdown("##### 📈 Recent Test Performance & Cohort Trajectory")
        if not responses_df.empty:
            test_trend = responses_df.groupby("test_date")["is_correct"].agg(
                Accuracy=lambda x: round(x.mean() * 100, 1),
                Students=lambda x: x.count()
            ).reset_index().sort_values("test_date")

            fig_trend = px.area(
                test_trend,
                x="test_date",
                y="Accuracy",
                markers=True,
                title="Cohort Mock Accuracy Over Academic Year (%)",
                color_discrete_sequence=["#0D9488"]
            )
            fig_trend.update_layout(
                paper_bgcolor="#FFFFFF",
                plot_bgcolor="#F8FAFC",
                margin=dict(l=20, r=20, t=35, b=20),
                height=280,
                xaxis_title="Exam Date",
                yaxis_title="Accuracy (%)",
                yaxis=dict(range=[20, 95], gridcolor="#E2E8F0")
            )
            st.plotly_chart(fig_trend, use_container_width=True)
        else:
            st.info("No test responses found for this batch.")

    with c2:
        st.markdown("##### 🏫 Cross-Batch Velocity & Accuracy")
        if not responses_df.empty and len(batches) > 1:
            batch_comp = []
            for b in batches:
                b_stds = [s.student_id for s in students if s.batch_id == b.batch_id]
                b_resps = responses_df[responses_df["student_id"].isin(b_stds)]
                if len(b_resps) > 0:
                    batch_comp.append({
                        "Batch": b.name[:18] + "..",
                        "Accuracy": round(b_resps["is_correct"].mean() * 100, 1),
                        "Students": len(b_stds)
                    })
            df_bcomp = pd.DataFrame(batch_comp)
            fig_batch = px.bar(
                df_bcomp,
                x="Batch",
                y="Accuracy",
                color="Accuracy",
                color_continuous_scale="Teal",
                text="Accuracy",
                title="Mean Mock Accuracy by Batch"
            )
            fig_batch.update_layout(
                paper_bgcolor="#FFFFFF",
                plot_bgcolor="#F8FAFC",
                margin=dict(l=20, r=20, t=35, b=20),
                height=280,
                xaxis_title=None,
                yaxis=dict(range=[0, 100], gridcolor="#E2E8F0")
            )
            st.plotly_chart(fig_batch, use_container_width=True)
        else:
            st.info("Batch comparison requires multiple active batches.")

    # 6. Row 2: Disengagement Risk Distribution & Recent Interventions
    c3, c4 = st.columns([1.2, 1.8])

    with c3:
        st.markdown("##### 🛡️ Disengagement Risk Distribution")
        if not triage_df.empty:
            tier_counts = triage_df["risk_tier"].value_counts().reset_index()
            tier_counts.columns = ["Tier", "Count"]
            color_map = {"HIGH": "#EF4444", "MODERATE": "#F59E0B", "LOW": "#10B981"}
            fig_risk = px.pie(
                tier_counts,
                names="Tier",
                values="Count",
                color="Tier",
                color_discrete_map=color_map,
                hole=0.55,
                title="Student Disengagement Tiers"
            )
            fig_risk.update_layout(
                margin=dict(l=10, r=10, t=35, b=10),
                height=260,
                showlegend=True
            )
            st.plotly_chart(fig_risk, use_container_width=True)
        else:
            st.caption("No risk triage data calculated.")

    with c4:
        st.markdown("##### 🤝 Recent Supportive Academic Interventions")
        interventions = db.query(Intervention).filter(Intervention.institute_id == institute_id).order_by(Intervention.assigned_date.desc()).limit(5).all()
        if interventions:
            int_data = []
            for it in interventions:
                std = db.query(Student).filter(Student.student_id == it.student_id).first()
                int_data.append({
                    "Student": std.name if std else it.student_id,
                    "Target Topic": it.target_topic,
                    "Action Assigned": it.action_type,
                    "Assigned By": it.assigned_by.split("(")[0],
                    "Status": it.status,
                    "Assigned Date": str(it.assigned_date)
                })
            df_int = pd.DataFrame(int_data)
            st.dataframe(df_int, use_container_width=True, hide_index=True)
        else:
            st.info("No active interventions recorded yet. Teachers can assign interventions from the Early-Warning or Student profiles.")
