"""
View 06: Early-Warning & Disengagement Risk Triage System
Supervised disengagement predictions, TreeSHAP feature attributions,
and 1-click supportive mentoring workflows under zero-shaming ethics.
"""

import streamlit as st
import pandas as pd
from sqlalchemy.orm import Session
from src.database.models import Student, Batch, Intervention
from src.ml.early_warning import generate_at_risk_triage_roster

def render_early_warning(db: Session, institute_id: str, user_role: str):
    st.markdown("## 🛡️ Early-Warning & Academic Support Triage")
    st.markdown(
        f"<p style='color: #64748B; margin-top: -10px; font-size: 14px;'>"
        f"Calibrated machine learning risk detection to identify silent disengagement before milestone failures."
        f"</p>",
        unsafe_allow_html=True
    )

    # Ethical Safeguards Notice
    st.info(
        "⚖️ **Ethical & Regulatory Compliance Notice (MoE 2024 Coaching Guidelines & DPDP Act 2023):** "
        "At-risk indicators are strictly confidential diagnostic signals visible only to authorized faculty mentors. "
        "They are designed to guide personalized remedial instruction and counseling — **never for public ranking, shaming, or punitive action.**"
    )

    # 1. Generate Triage Roster
    with st.spinner("Computing calibrated longitudinal risk features..."):
        df_roster = generate_at_risk_triage_roster(db, institute_id)

    if df_roster.empty:
        st.warning("No student records available for risk analysis.")
        return

    # 2. Filters
    batches = db.query(Batch).filter(Batch.institute_id == institute_id).all()
    b_options = ["All Batches"] + [b.batch_id for b in batches]

    f_col1, f_col2 = st.columns(2)
    with f_col1:
        sel_batch = st.selectbox("Filter Triage Roster by Batch:", b_options, key="ew_batch_sel")
    with f_col2:
        sel_tier = st.selectbox("Filter by Risk Tier:", ["All Tiers", "HIGH Risk (P > 60%)", "MODERATE Risk (30-60%)", "LOW Risk (< 30%)"], key="ew_tier_sel")

    filtered_roster = df_roster
    if sel_batch != "All Batches":
        filtered_roster = filtered_roster[filtered_roster["batch_id"] == sel_batch]
    if "HIGH" in sel_tier:
        filtered_roster = filtered_roster[filtered_roster["risk_tier"] == "HIGH"]
    elif "MODERATE" in sel_tier:
        filtered_roster = filtered_roster[filtered_roster["risk_tier"] == "MODERATE"]
    elif "LOW" in sel_tier:
        filtered_roster = filtered_roster[filtered_roster["risk_tier"] == "LOW"]

    # Metrics
    k1, k2, k3, k4 = st.columns(4)
    high_n = len(df_roster[df_roster["risk_tier"] == "HIGH"])
    mod_n = len(df_roster[df_roster["risk_tier"] == "MODERATE"])
    k1.metric("High Priority Learners", high_n, help="Students with P(disengage) > 60%")
    k2.metric("Moderate Watchlist", mod_n, help="Students with P(disengage) between 30% and 60%")
    k3.metric("Observation Window", "Past 90 Days", help="Longitudinal data evaluated")
    k4.metric("Prediction Horizon", "Next 30–60 Days", help="Target intervention timeframe")

    st.markdown("---")

    # 3. Priority Triage Table
    st.markdown(f"##### Prioritized Mentorship Queue ({len(filtered_roster)} Students)")
    
    # Render table with styled metrics
    display_cols = [
        "student_id", "name", "risk_percentage", "risk_tier",
        "attendance", "attendance_slope", "avg_mastery", "primary_drivers"
    ]
    renamed_cols = {
        "student_id": "Token ID",
        "name": "Candidate Name",
        "risk_percentage": "Risk Prob",
        "risk_tier": "Risk Tier",
        "attendance": "Attendance",
        "attendance_slope": "14d Trajectory",
        "avg_mastery": "Topic Mastery",
        "primary_drivers": "Primary Diagnostic Root Causes"
    }

    st.dataframe(
        filtered_roster[display_cols].rename(columns=renamed_cols),
        use_container_width=True,
        hide_index=True
    )

    st.markdown("---")

    # 4. Immediate Supportive Action Form
    st.markdown("##### ⚡ Launch Supportive Intervention for At-Risk Student")
    
    target_student_id = st.selectbox(
        "Select Student for Remedial Mentoring Plan:",
        filtered_roster["student_id"].tolist(),
        format_func=lambda sid: f"{sid} — {filtered_roster[filtered_roster['student_id'] == sid]['name'].values[0]} ({filtered_roster[filtered_roster['student_id'] == sid]['risk_tier'].values[0]} Risk)"
    )

    sel_student_row = filtered_roster[filtered_roster["student_id"] == target_student_id].iloc[0]

    with st.expander(f"📝 Remedial Mentoring Assignment: {sel_student_row['name']} ({target_student_id})", expanded=True):
        st.markdown(f"**Identified Root Causes**: `{sel_student_row['primary_drivers']}`")

        with st.form(f"ew_intervention_{target_student_id}"):
            c_int1, c_int2 = st.columns(2)
            with c_int1:
                topic = st.text_input("Target Weak Topic", value="Definite Integration")
                act_type = st.selectbox("Supportive Action", [
                    "1-on-1 Concept Review with Mentor",
                    "Targeted 15-Question Catch-Up Worksheet",
                    "Parent Academic Counseling",
                    "Fee Schedule Restructuring"
                ])
            with c_int2:
                mentor = st.text_input("Faculty Mentor Assigned", value=user_role)
                follow_up = st.date_input("Follow-Up Review Date")

            notes = st.text_area("Prescriptive Action Details", value="Scheduled 15-minute diagnostic session to resolve fundamental integration properties.")
            submit_btn = st.form_submit_button("Record Intervention & Alert Mentor", type="primary")

            if submit_btn:
                new_it = Intervention(
                    institute_id=institute_id,
                    student_id=target_student_id,
                    assigned_by=mentor,
                    target_topic=topic,
                    action_type=act_type,
                    action_details=notes,
                    status="Intervention assigned",
                    follow_up_date=follow_up
                )
                db.add(new_it)
                db.commit()
                st.success(f"🎉 Supportive intervention recorded for {sel_student_row['name']}!")
                st.rerun()
