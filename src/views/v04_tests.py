"""
View 04: Tests & Mock Results Analytics
Examines mock exams, score distributions, and 2PL Item Response Theory (IRT) question diagnostics.
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from sqlalchemy.orm import Session
from src.database.models import Test, TestResponse, Question, Student

def render_tests(db: Session, institute_id: str, user_role: str):
    st.markdown("## 📝 Tests & Mock Exam Results")
    st.markdown(
        f"<p style='color: #64748B; margin-top: -10px; font-size: 14px;'>"
        f"Psychometric analysis of mock exams, score distributions, and 2PL IRT item discrimination."
        f"</p>",
        unsafe_allow_html=True
    )

    tests = db.query(Test).filter(Test.institute_id == institute_id).order_by(Test.test_date).all()
    if not tests:
        st.info("No mock exams recorded for this institute.")
        return

    # 1. Test Selector
    test_options = {t.test_id: f"{t.title} ({t.test_date}) - {t.exam_type}" for t in tests}
    selected_tid = st.selectbox(
        "Select Mock Examination:",
        list(test_options.keys()),
        format_func=lambda tid: test_options.get(tid, tid)
    )

    # 2. Fetch Test Responses
    responses_query = db.query(TestResponse).filter(TestResponse.test_id == selected_tid)
    responses_df = pd.read_sql(responses_query.statement, db.bind)
    questions_df = pd.read_sql(db.query(Question).statement, db.bind)

    if responses_df.empty:
        st.warning("No responses logged for this specific test.")
        return

    # Aggregate student scores
    student_scores = responses_df.groupby("student_id")["is_correct"].agg(
        TotalQuestions="count",
        CorrectAnswers="sum"
    ).reset_index()
    student_scores["AccuracyPct"] = round(student_scores["CorrectAnswers"] / student_scores["TotalQuestions"] * 100, 1)
    student_scores["Score"] = student_scores["CorrectAnswers"] * 4 - (student_scores["TotalQuestions"] - student_scores["CorrectAnswers"]) * 1

    # Metrics
    t1, t2, t3, t4, t5 = st.columns(5)
    t1.metric("Students Evaluated", len(student_scores))
    t2.metric("Mean Accuracy", f"{student_scores['AccuracyPct'].mean():.1f}%")
    t3.metric("Median Score", f"{student_scores['Score'].median():.0f} pts")
    t4.metric("Top Score", f"{student_scores['Score'].max()} pts")
    t5.metric("Questions in Paper", len(responses_df["question_id"].unique()))

    st.markdown("---")

    # 3. Charts: Score Distribution & 2PL IRT Item Calibration
    col_c1, col_c2 = st.columns(2)

    with col_c1:
        st.markdown("##### 📊 Student Score Distribution (JEE Marking)")
        fig_hist = px.histogram(
            student_scores,
            x="Score",
            nbins=15,
            marginal="box",
            color_discrete_sequence=["#0284C7"],
            title="Distribution of Student Mock Scores"
        )
        fig_hist.update_layout(
            paper_bgcolor="#FFFFFF",
            plot_bgcolor="#F8FAFC",
            margin=dict(l=20, r=20, t=35, b=20),
            height=300,
            xaxis_title="Exam Score (Points)",
            yaxis_title="Student Count"
        )
        st.plotly_chart(fig_hist, use_container_width=True)

    with col_c2:
        st.markdown("##### 🔬 2PL IRT Item Difficulty vs Discrimination")
        # Merge questions with accuracy on this test
        q_acc = responses_df.groupby("question_id")["is_correct"].mean().reset_index()
        q_merged = q_acc.merge(questions_df, on="question_id", how="left")

        fig_scatter = px.scatter(
            q_merged,
            x="difficulty_b",
            y="discrimination_a",
            color="subject",
            size="is_correct",
            hover_data=["question_id", "topic", "chapter"],
            title="Question Diagnostic: Difficulty (b) vs Discrimination (a)"
        )
        fig_scatter.update_layout(
            paper_bgcolor="#FFFFFF",
            plot_bgcolor="#F8FAFC",
            margin=dict(l=20, r=20, t=35, b=20),
            height=300,
            xaxis_title="Item Difficulty b (Latent scale -3 to +3)",
            yaxis_title="Item Discrimination a (0.5 to 2.5)"
        )
        st.plotly_chart(fig_scatter, use_container_width=True)

    # 4. Question Breakdown Table
    st.markdown("##### 📋 Question-Level Item Analysis")
    q_table_data = []
    for _, q_row in q_merged.iterrows():
        q_table_data.append({
            "Question ID": q_row["question_id"],
            "Subject": q_row["subject"],
            "Topic": q_row["topic"],
            "Sub-Topic": q_row["sub_topic"],
            "Difficulty b": q_row["difficulty_b"],
            "Discrimination a": q_row["discrimination_a"],
            "Pass Rate": f"{q_row['is_correct']*100:.1f}%",
            "Quality Flag": "Optimal" if q_row["discrimination_a"] >= 1.0 else "Low Discrimination"
        })
    df_qtable = pd.DataFrame(q_table_data).sort_values("Pass Rate")
    st.dataframe(df_qtable, use_container_width=True, hide_index=True)
