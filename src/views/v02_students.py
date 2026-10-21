"""
View 02: Students Directory & Diagnostic Deep Dive
Searchable roster with filters, student profiles, topic mastery breakdowns,
and 1-click supportive action triggers.
"""

import streamlit as st
import pandas as pd
import plotly.express as px
from sqlalchemy.orm import Session
from src.database.models import Student, Batch, TestResponse, Attendance, Fee, Question, Intervention
from src.ml.irt_bkt import calculate_student_topic_mastery_matrix
from src.ml.early_warning import extract_features_for_student, early_warning_engine
from src.ml.performance import predict_student_percentile_interval

def render_students(db: Session, institute_id: str, user_role: str):
    st.markdown("## 👥 Student Directory & Learning Profiles")
    st.markdown(
        f"<p style='color: #64748B; margin-top: -10px; font-size: 14px;'>"
        f"Granular academic diagnostics, attendance trends, and topic-level mastery for individual learners."
        f"</p>",
        unsafe_allow_html=True
    )

    # 1. Fetch Students
    students = db.query(Student).filter(Student.institute_id == institute_id).all()
    if not students:
        st.info("No student records available for this institute.")
        return

    batches = db.query(Batch).filter(Batch.institute_id == institute_id).all()
    batch_map = {b.batch_id: b.name for b in batches}

    # Filters
    col_f1, col_f2, col_f3 = st.columns([2, 1.5, 1.5])
    with col_f1:
        search_query = st.text_input("🔍 Search by Student Name or ID", placeholder="e.g. Aarav, STD_NA_01_001")
    with col_f2:
        b_filter = st.selectbox("Batch", ["All Batches"] + list(batch_map.keys()), format_func=lambda x: batch_map.get(x, x))
    with col_f3:
        cls_filter = st.selectbox("Class Level", ["All Classes", "11th", "12th", "Dropper"])

    # Apply Filters
    filtered = students
    if search_query:
        q_lower = search_query.strip().lower()
        filtered = [s for s in filtered if q_lower in s.name.lower() or q_lower in s.student_id.lower()]
    if b_filter != "All Batches":
        filtered = [s for s in filtered if s.batch_id == b_filter]
    if cls_filter != "All Classes":
        filtered = [s for s in filtered if s.class_level.lower() == cls_filter.lower()]

    st.caption(f"Showing **{len(filtered)}** of **{len(students)}** enrolled students.")

    # 2. Main Layout: Table on Left / Deep Dive on Right
    c_list, c_detail = st.columns([1.2, 1.8])

    with c_list:
        st.markdown("##### Enrolled Roster")
        roster_data = [
            {
                "Student ID": s.student_id,
                "Name": s.name,
                "Batch": s.batch_id.split("_")[-2] + "_" + s.batch_id.split("_")[-1],
                "Class": s.class_level
            }
            for s in filtered[:50]  # Cap display at 50 for quick responsiveness
        ]
        df_roster = pd.DataFrame(roster_data)

        # Selection
        selected_sid = st.selectbox(
            "Select Student to Inspect:",
            [s.student_id for s in filtered],
            format_func=lambda sid: f"{sid} — {next((s.name for s in filtered if s.student_id == sid), '')}"
        ) if filtered else None

        st.dataframe(df_roster, height=450, use_container_width=True, hide_index=True)

    with c_detail:
        if not selected_sid:
            st.info("Select a student to view diagnostic profile.")
            return

        target_student = db.query(Student).filter(Student.student_id == selected_sid).first()
        st.markdown(f"### 📋 Student Profile: **{target_student.name}**")
        
        # Meta pills
        m1, m2, m3, m4 = st.columns(4)
        m1.metric("Student Token", target_student.student_id)
        m2.metric("Class / Stream", target_student.class_level)
        m3.metric("Batch", batch_map.get(target_student.batch_id, target_student.batch_id)[:14])
        m4.metric("VPC Consent", "Verified ✅" if target_student.parent_contact_consent else "Pending ⚠️")

        # 3. Fetch Student Diagnostic Data
        responses_df = pd.read_sql(
            db.query(TestResponse).filter(TestResponse.student_id == selected_sid).statement, db.bind
        )
        questions_df = pd.read_sql(db.query(Question).statement, db.bind)
        attendance_df = pd.read_sql(
            db.query(Attendance).filter(Attendance.student_id == selected_sid).statement, db.bind
        )
        fees_df = pd.read_sql(
            db.query(Fee).filter(Fee.student_id == selected_sid).statement, db.bind
        )
        engagement_df = pd.read_sql(
            db.query(Engagement).filter(Engagement.student_id == selected_sid).statement, db.bind
        )

        # Tabbed deep dive
        tab_mastery, tab_perf, tab_history, tab_actions = st.tabs([
            "🧠 Topic Mastery (BKT)", "🎯 Performance & Risk", "📅 Attendance & Fees", "⚡ Interventions"
        ])

        with tab_mastery:
            st.markdown("##### Bayesian Knowledge Tracing Mastery by Topic")
            if not responses_df.empty:
                mastery_map = calculate_student_topic_mastery_matrix(responses_df, questions_df, selected_sid)
                mastery_rows = []
                for topic, mdata in mastery_map.items():
                    mastery_rows.append({
                        "Subject": mdata.get("subject", "General"),
                        "Topic": topic,
                        "Mastery": mdata["mastery_score"] * 100,
                        "Evidence": mdata["confidence_level"]
                    })
                df_m = pd.DataFrame(mastery_rows).sort_values("Mastery")

                fig_m = px.bar(
                    df_m,
                    x="Mastery",
                    y="Topic",
                    orientation="h",
                    color="Mastery",
                    color_continuous_scale="Teal",
                    text=df_m["Mastery"].apply(lambda v: f"{v:.0f}%"),
                    title="Student Knowledge Tracing Percentile"
                )
                fig_m.update_layout(
                    height=300,
                    margin=dict(l=10, r=10, t=30, b=10),
                    paper_bgcolor="#FFFFFF",
                    plot_bgcolor="#F8FAFC",
                    xaxis=dict(range=[0, 100])
                )
                st.plotly_chart(fig_m, use_container_width=True)
            else:
                st.info("No mock test responses recorded yet.")

        with tab_perf:
            st.markdown("##### Honest Exam Percentile Prediction Interval")
            perf = predict_student_percentile_interval(selected_sid, responses_df, questions_df)
            
            p_col1, p_col2 = st.columns(2)
            with p_col1:
                st.markdown(f"""
                <div style='background: #F0FDF4; border: 1px solid #86EFAC; padding: 12px; border-radius: 8px;'>
                    <span style='font-size: 13px; color: #166534;'>Estimated Exam Percentile Interval:</span><br/>
                    <b style='font-size: 24px; color: #14532D;'>{perf['confidence_band']}</b><br/>
                    <span style='font-size: 11px; color: #15803D;'>Uncertainty Margin: ±{perf['uncertainty_margin']}% (80% Credible Range)</span>
                </div>
                """, unsafe_allow_html=True)
            with p_col2:
                st.markdown(f"""
                <div style='background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 8px;'>
                    <span style='font-size: 13px; color: #475569;'>Qualifying Outlook:</span><br/>
                    <b style='font-size: 14px; color: #0F172A;'>{perf['qualifying_outlook']}</b><br/>
                    <span style='font-size: 11px; color: #64748B;'>Evaluated across {perf['mock_tests_evaluated']} milestone mock exams.</span>
                </div>
                """, unsafe_allow_html=True)

            # Feature Attribution & Risk
            feat = extract_features_for_student(selected_sid, responses_df, questions_df, attendance_df, fees_df, engagement_df)
            prob, drivers, tier = early_warning_engine.predict_risk(feat)

            st.markdown("##### Disengagement Risk Drivers:")
            tier_badge = "🔴 HIGH" if tier == "HIGH" else ("🟡 MODERATE" if tier == "MODERATE" else "🟢 LOW")
            st.markdown(f"**Risk Tier**: {tier_badge} ({prob*100:.1f}%)")
            for d in drivers:
                st.markdown(f"• {d}")

        with tab_history:
            st.markdown("##### Longitudinal Attendance & Fee Ledger")
            h1, h2 = st.columns(2)
            with h1:
                st.markdown(f"**Overall Attendance**: {attendance_df['present_flag'].mean()*100:.1f}%" if not attendance_df.empty else "No attendance logged")
                if not attendance_df.empty:
                    st.line_chart(attendance_df.tail(30).set_index("date")["present_flag"], height=160)
            with h2:
                st.markdown("**Fee Installment History**")
                if not fees_df.empty:
                    st.dataframe(fees_df[["instalment_no", "due_date", "status", "amount"]].tail(5), hide_index=True)

        with tab_actions:
            st.markdown("##### ⚡ Supportive Academic Mentoring Actions")
            existing_int = db.query(Intervention).filter(Intervention.student_id == selected_sid).all()
            if existing_int:
                st.markdown(f"Active Interventions ({len(existing_int)}):")
                for it in existing_int:
                    st.markdown(f"• **{it.action_type}** ({it.target_topic}) — Status: `{it.status}` (Assigned: {it.assigned_date})")

            st.markdown("---")
            st.markdown("##### Launch New Supportive Intervention")
            with st.form(f"form_int_{selected_sid}"):
                it_topic = st.selectbox("Target Concept / Topic", ["Rotational Dynamics", "Definite Integration", "Chemical Kinetics", "Kinematics", "General Revision"])
                it_action = st.selectbox("Action Type", ["1-on-1 Concept Review", "Catch-Up Worksheet", "Parent Counseling", "Fee Rescheduling"])
                it_notes = st.text_area("Mentoring Plan / Notes", placeholder="e.g. Schedule 15-minute doubt session on integration properties.")
                
                submitted = st.form_submit_button("Record Intervention", type="primary")
                if submitted:
                    new_it = Intervention(
                        institute_id=institute_id,
                        student_id=selected_sid,
                        assigned_by=user_role,
                        target_topic=it_topic,
                        action_type=it_action,
                        action_details=it_notes,
                        status="Intervention assigned"
                    )
                    db.add(new_it)
                    db.commit()
                    st.success("Supportive intervention recorded successfully!")
                    st.rerun()
