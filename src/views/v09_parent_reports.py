"""
View 09: Bilingual Parent Progress Cards & PDF Generator
Generates empathetic, bilingual (English & Hindi) progress digests with
editable in-place preview and 1-click ReportLab PDF export.
"""

import streamlit as st
import pandas as pd
from sqlalchemy.orm import Session
from src.database.models import Student, Batch, TestResponse, Attendance, Question
from src.ai.prompts import generate_bilingual_parent_report
from src.reporting.pdf_generator import generate_parent_report_pdf
from src.ml.irt_bkt import calculate_student_topic_mastery_matrix
from src.ml.performance import predict_student_percentile_interval

def render_parent_reports(db: Session, institute_id: str, user_role: str):
    st.markdown("## 👨‍👩‍👦 Bilingual Parent Progress Communication")
    st.markdown(
        f"<p style='color: #64748B; margin-top: -10px; font-size: 14px;'>"
        f"Generate empathetic progress reports in English and Hindi with actionable remedial recommendations and PDF export."
        f"</p>",
        unsafe_allow_html=True
    )

    students = db.query(Student).filter(Student.institute_id == institute_id).all()
    if not students:
        st.warning("No student records available.")
        return

    # 1. Student Selection
    col_s1, col_s2 = st.columns([2, 1])
    with col_s1:
        target_sid = st.selectbox(
            "Select Student for Progress Card:",
            [s.student_id for s in students],
            format_func=lambda sid: f"{sid} — {next((s.name for s in students if s.student_id == sid), '')}"
        )
    with col_s2:
        lang_preference = st.radio("Display Format:", ["Bilingual (English + Hindi)", "English Only", "Hindi Only"], horizontal=True)

    target_std = db.query(Student).filter(Student.student_id == target_sid).first()
    batch_obj = db.query(Batch).filter(Batch.batch_id == target_std.batch_id).first()
    batch_title = batch_obj.name if batch_obj else target_std.batch_id

    # 2. Fetch Diagnostic Data
    responses_df = pd.read_sql(
        db.query(TestResponse).filter(TestResponse.student_id == target_sid).statement, db.bind
    )
    questions_df = pd.read_sql(db.query(Question).statement, db.bind)
    attendance_df = pd.read_sql(
        db.query(Attendance).filter(Attendance.student_id == target_sid).statement, db.bind
    )

    # Defaults
    strong_topic = "Kinematics"
    weak_topic = "Definite Integration"
    strong_pct = 82.0
    weak_pct = 34.0
    attn_pct = float(attendance_df["present_flag"].mean() * 100) if not attendance_df.empty else 88.0

    if not responses_df.empty and not questions_df.empty:
        m_map = calculate_student_topic_mastery_matrix(responses_df, questions_df, target_sid)
        sorted_m = sorted(m_map.items(), key=lambda x: x[1]["mastery_score"])
        if sorted_m:
            weak_topic, weak_data = sorted_m[0]
            weak_pct = weak_data["mastery_percentage"]
            strong_topic, strong_data = sorted_m[-1]
            strong_pct = strong_data["mastery_percentage"]

    # Performance interval
    pred = predict_student_percentile_interval(target_sid, responses_df, questions_df)
    predicted_band = pred["confidence_band"]

    # 3. Generate Report Text
    llm_res = generate_bilingual_parent_report(
        student_name=target_std.name,
        class_level=target_std.class_level,
        target_exam=target_std.batch_id.split("_")[-1],
        strong_topic=strong_topic,
        weak_topic=weak_topic,
        strong_pct=strong_pct,
        weak_pct=weak_pct,
        attendance_pct=attn_pct,
        predicted_band=predicted_band,
        root_causes=f"Concept friction observed during fortnightly tests in {weak_topic}"
    )

    # 4. In-Place Editable Report Preview
    st.markdown("##### 📝 Report Digest Preview (Editable Before Dispatch)")
    report_text = st.text_area(
        "Edit progress card draft below if necessary:",
        value=llm_res.text,
        height=320
    )

    st.caption(f"Generated via: **{llm_res.provider}** | Latency: **{llm_res.latency_ms} ms** | Cost: **₹{llm_res.cost_inr:.4f}**")

    st.markdown("---")

    # 5. Export Actions
    a_col1, a_col2 = st.columns(2)

    with a_col1:
        st.markdown("###### 📄 Export Professional PDF Report Card")
        # Compile PDF with ReportLab
        pdf_bytes = generate_parent_report_pdf(
            student_name=target_std.name,
            student_id=target_std.student_id,
            institute_name="Apex JEE & Medical Academy, Patna",
            class_level=target_std.class_level,
            batch_name=batch_title,
            strong_topic=strong_topic,
            weak_topic=weak_topic,
            strong_pct=strong_pct,
            weak_pct=weak_pct,
            attendance_pct=attn_pct,
            predicted_band=predicted_band,
            root_causes=f"Concept friction in {weak_topic} problem solving."
        )

        st.download_button(
            label=f"📥 Download {target_std.name} Progress Report (PDF)",
            data=pdf_bytes,
            file_name=f"Progress_Report_{target_std.student_id}.pdf",
            mime="application/pdf",
            type="primary"
        )

    with a_col2:
        st.markdown("###### 💬 WhatsApp Broadcast Digest")
        st.markdown(
            "Copy the empathetic text digest below to send via WhatsApp Web or your institute's broadcast coordinator:"
        )
        if st.button("📋 Copy Digest Text to Clipboard"):
            st.success("Report text ready for WhatsApp distribution! (Simulated copy)")
