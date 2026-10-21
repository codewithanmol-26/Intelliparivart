"""
View 05: Topic Mastery & Bayesian Knowledge Tracing (BKT) Heatmaps
Interactive topic taxonomy heatmaps, concept bottleneck identification,
and longitudinal mastery trajectory tracking.
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from sqlalchemy.orm import Session
from src.database.models import Student, Batch, TestResponse, Question
from src.ml.irt_bkt import calculate_batch_topic_mastery_matrix, calculate_student_topic_mastery_matrix

def render_mastery(db: Session, institute_id: str, user_role: str):
    st.markdown("## 🧠 Dynamic Topic Mastery & Knowledge Tracing")
    st.markdown(
        f"<p style='color: #64748B; margin-top: -10px; font-size: 14px;'>"
        f"Longitudinal Bayesian Knowledge Tracing (BKT) and 2PL Item Response Theory across the canonical JEE/NEET syllabus graph."
        f"</p>",
        unsafe_allow_html=True
    )

    batches = db.query(Batch).filter(Batch.institute_id == institute_id).all()
    if not batches:
        st.info("No batches found for this institute.")
        return

    # Select batch
    b_map = {b.batch_id: b.name for b in batches}
    sel_batch = st.selectbox("Select Batch to Analyze:", list(b_map.keys()), format_func=lambda x: b_map.get(x, x))

    batch_students = db.query(Student).filter(Student.batch_id == sel_batch).all()
    batch_sids = [s.student_id for s in batch_students]

    responses_df = pd.read_sql(
        db.query(TestResponse).filter(TestResponse.student_id.in_(batch_sids)).statement, db.bind
    )
    questions_df = pd.read_sql(db.query(Question).statement, db.bind)

    if responses_df.empty:
        st.warning("No test responses found for this batch yet.")
        return

    # 1. Compute Batch Topic Mastery Matrix
    df_batch_mastery = calculate_batch_topic_mastery_matrix(responses_df, questions_df, batch_sids)

    # Summary metrics
    m1, m2, m3, m4 = st.columns(4)
    avg_batch_mastery = df_batch_mastery["average_mastery"].mean() * 100
    bottlenecks = df_batch_mastery[df_batch_mastery["average_mastery"] < 0.45]
    strong_topics = df_batch_mastery[df_batch_mastery["average_mastery"] >= 0.70]

    m1.metric("Batch Mean Mastery", f"{avg_batch_mastery:.1f}%")
    m2.metric("Syllabus Topics Tracked", len(df_batch_mastery))
    m3.metric("Concept Bottlenecks", len(bottlenecks), delta=f"{len(bottlenecks)} topics below 45%", delta_color="inverse")
    m4.metric("High-Mastery Topics", len(strong_topics), delta=f"{len(strong_topics)} topics above 70%")

    st.markdown("---")

    # 2. Batch Topic Mastery Heatmap
    st.markdown("##### 🗺️ Institutional Batch Concept Mastery Heatmap")
    
    # Pivot for Heatmap visualization
    heatmap_df = df_batch_mastery.pivot(index="subject", columns="topic", values="mastery_percentage").fillna(35.0)

    fig_heat = px.imshow(
        heatmap_df,
        labels=dict(x="Syllabus Topic", y="Subject", color="Mastery (%)"),
        x=heatmap_df.columns,
        y=heatmap_df.index,
        color_continuous_scale="Teal",
        aspect="auto",
        text_auto=".0f"
    )
    fig_heat.update_layout(
        paper_bgcolor="#FFFFFF",
        plot_bgcolor="#F8FAFC",
        height=260,
        margin=dict(l=10, r=10, t=30, b=10)
    )
    st.plotly_chart(fig_heat, use_container_width=True)

    # 3. Topic Diagnostics Breakdown Table
    st.markdown("##### 🔬 Topic Vulnerability & Student Risk Distribution")
    st.dataframe(
        df_batch_mastery[["subject", "topic", "average_mastery", "pct_students_at_risk", "status"]].rename(columns={
            "subject": "Subject",
            "topic": "Syllabus Topic",
            "average_mastery": "Mean Mastery (0-1)",
            "pct_students_at_risk": "Students At Risk (%)",
            "status": "Diagnostic Status"
        }),
        use_container_width=True,
        hide_index=True
    )

    st.markdown("---")

    # 4. Individual Student Trajectory Deep-Dive
    st.markdown("##### 📈 Individual Student BKT Knowledge Tracing Trajectory")
    target_student_id = st.selectbox(
        "Select Student for Longitudinal Learning Trajectory:",
        batch_sids,
        format_func=lambda sid: f"{sid} — {next((s.name for s in batch_students if s.student_id == sid), '')}"
    )

    student_resps = responses_df[responses_df["student_id"] == target_student_id]
    if not student_resps.empty:
        student_mastery_map = calculate_student_topic_mastery_matrix(student_resps, questions_df, target_student_id)
        
        # Pick topic for trajectory
        sel_topic = st.selectbox("Select Topic Trajectory to Plot:", list(student_mastery_map.keys()))
        topic_info = student_mastery_map[sel_topic]

        c_traj1, c_traj2 = st.columns([2, 1])
        with c_traj1:
            traj_data = pd.DataFrame({
                "Attempt #": list(range(len(topic_info["trajectory"]))),
                "BKT Topic Mastery": topic_info["trajectory"]
            })
            fig_traj = px.line(
                traj_data,
                x="Attempt #",
                y="BKT Topic Mastery",
                markers=True,
                title=f"BKT Learning Curve: {sel_topic}",
                color_discrete_sequence=["#0D9488"]
            )
            fig_traj.update_layout(
                paper_bgcolor="#FFFFFF",
                plot_bgcolor="#F8FAFC",
                height=250,
                margin=dict(l=10, r=10, t=35, b=10),
                yaxis=dict(range=[0.0, 1.0])
            )
            st.plotly_chart(fig_traj, use_container_width=True)

        with c_traj2:
            st.markdown(f"""
            <div style='background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 8px; margin-top: 10px;'>
                <b style='font-size: 15px; color: #0F172A;'>{sel_topic}</b><br/>
                <span style='font-size: 13px; color: #475569;'>Current BKT Mastery: <b>{topic_info['mastery_percentage']}%</b></span><br/>
                <span style='font-size: 12px; color: #64748B;'>Observation Evidence: <b>{topic_info['confidence_level']}</b> ({topic_info['observations_count']} attempts)</span><br/>
                <hr style='margin: 8px 0; border: 0.5px solid #E2E8F0;'>
                <span style='font-size: 11px; color: #334155;'>
                    <b>Bayesian Parameter Priors:</b><br/>
                    • P(L₀) Prior: 0.35<br/>
                    • P(T) Learning: 0.15<br/>
                    • P(G) Guessing: 0.20<br/>
                    • P(S) Slipping: 0.10
                </span>
            </div>
            """, unsafe_allow_html=True)
