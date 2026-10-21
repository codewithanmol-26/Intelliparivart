"""
View 10: Institute Analytics & Financial ROI Calculator
Macro-level batch comparisons, subject vulnerability matrix, fee risk,
and an editable, transparent SaaS ROI economic model.
"""

import streamlit as st
import pandas as pd
import plotly.express as px
from sqlalchemy.orm import Session
from src.database.models import Student, Batch, TestResponse, Fee, Attendance, Outcome
from src.services.roi import calculate_institute_roi, generate_roi_sensitivity_table

def render_institute_analytics(db: Session, institute_id: str, user_role: str):
    st.markdown("## 📈 Institute Analytics & SaaS Financial ROI")
    st.markdown(
        f"<p style='color: #64748B; margin-top: -10px; font-size: 14px;'>"
        f"Macro batch velocity, tuition retention economics, and interactive SaaS ROI sensitivity modeling."
        f"</p>",
        unsafe_allow_html=True
    )

    tab_macro, tab_roi = st.tabs([
        "🏫 Macro Institutional Performance",
        "💰 SaaS Unit Economics & ROI Calculator"
    ])

    # =========================================================================
    # TAB 1: MACRO PERFORMANCE
    # =========================================================================
    with tab_macro:
        students = db.query(Student).filter(Student.institute_id == institute_id).all()
        student_ids = [s.student_id for s in students]

        batches = db.query(Batch).filter(Batch.institute_id == institute_id).all()

        # Batch comparison
        b_summary = []
        for b in batches:
            b_sids = [s.student_id for s in students if s.batch_id == b.batch_id]
            resps = db.query(TestResponse.is_correct).filter(TestResponse.student_id.in_(b_sids)).all()
            acc = (sum(r[0] for r in resps) / len(resps) * 100) if resps else 0.0

            # Attendance
            attns = db.query(Attendance.present_flag).filter(Attendance.student_id.in_(b_sids)).all()
            attn_rate = (sum(a[0] for a in attns) / len(attns) * 100) if attns else 0.0

            b_summary.append({
                "Batch Name": b.name,
                "Target Stream": b.target_exam,
                "Enrolled Students": len(b_sids),
                "Mean Accuracy (%)": round(acc, 1),
                "Attendance Rate (%)": round(attn_rate, 1)
            })

        df_b_sum = pd.DataFrame(b_summary)
        st.markdown("##### Batch Health & Velocity Matrix")
        st.dataframe(df_b_sum, use_container_width=True, hide_index=True)

        # Plotly chart
        if not df_b_sum.empty:
            fig_b = px.bar(
                df_b_sum,
                x="Batch Name",
                y=["Mean Accuracy (%)", "Attendance Rate (%)"],
                barmode="group",
                title="Batch Comparison: Academic Accuracy vs Attendance Velocity",
                color_discrete_sequence=["#0D9488", "#3B82F6"]
            )
            fig_b.update_layout(
                paper_bgcolor="#FFFFFF",
                plot_bgcolor="#F8FAFC",
                height=300,
                margin=dict(l=10, r=10, t=35, b=10)
            )
            st.plotly_chart(fig_b, use_container_width=True)

        st.markdown("---")

        # Fee Default Risk (Visible for Owner / Admin)
        st.markdown("##### 💳 Tuition Dues & Attrition Risk (Authorized View)")
        fees = db.query(Fee).filter(Fee.student_id.in_(student_ids)).all()
        if fees:
            total_fees = len(fees)
            defaulted = len([f for f in fees if f.status == "DEFAULTED"])
            default_rate = (defaulted / total_fees * 100) if total_fees > 0 else 0.0

            fc1, fc2, fc3 = st.columns(3)
            fc1.metric("Total Installment Dues Tracked", total_fees)
            fc2.metric("Defaulted Installments", defaulted, delta=f"{default_rate:.1f}% Default Rate", delta_color="inverse")
            fc3.metric("Revenue at Dues Risk", f"₹{defaulted * 6000:,.0f}")
        else:
            st.info("No fee records logged.")

    # =========================================================================
    # TAB 2: SAAS FINANCIAL ROI CALCULATOR
    # =========================================================================
    with tab_roi:
        st.markdown("##### 💡 Interactive Platform ROI & Value Creation Calculator")
        st.markdown(
            "Model the financial return on implementing Data Moat by estimating retained tuition fees through early intervention. "
            "*All baseline assumptions are fully editable.*"
        )

        r_col1, r_col2 = st.columns([1.2, 1.8])

        with r_col1:
            st.markdown("###### ⚙️ Editable Operational Assumptions")
            in_students = st.number_input("Active Enrolled Students", value=400, step=50)
            in_annual_fee = st.number_input("Annual Tuition Fee per Student (₹)", value=60000, step=5000)
            in_attrition_pct = st.slider("Baseline Annual Student Attrition (%)", 5, 30, 15, 1) / 100.0
            in_preventable_pct = st.slider("Preventable Attrition Share with Data Moat (%)", 10, 50, 25, 5) / 100.0
            in_platform_fee = st.number_input("Data Moat Fee per Student/Month (₹)", value=40, step=5) * 12
            in_onboarding = st.number_input("One-Time Onboarding Fee (₹)", value=8000, step=1000)

        # Calculate ROI
        roi_res = calculate_institute_roi(
            active_students=in_students,
            annual_fee_per_student=in_annual_fee,
            baseline_attrition_rate=in_attrition_pct,
            preventable_attrition_share=in_preventable_pct,
            platform_annual_fee_per_student=in_platform_fee,
            onboarding_concierge_fee=in_onboarding
        )

        with r_col2:
            st.markdown("###### 📊 Financial Return & Value Preserved")
            rc1, rc2 = st.columns(2)
            with rc1:
                st.markdown(f"""
                <div style='background: #F0FDF4; border: 1.5px solid #86EFAC; padding: 16px; border-radius: 8px;'>
                    <span style='font-size: 13px; color: #166534; font-weight: 600;'>Preserved Tuition Revenue:</span><br/>
                    <b style='font-size: 28px; color: #14532D;'>₹{roi_res['preserved_revenue']:,.0f}</b><br/>
                    <span style='font-size: 12px; color: #15803D;'>{roi_res['prevented_dropouts_count']} At-Risk Students Successfully Retained</span>
                </div>
                """, unsafe_allow_html=True)
            with rc2:
                st.markdown(f"""
                <div style='background: #EFF6FF; border: 1.5px solid #93C5FD; padding: 16px; border-radius: 8px;'>
                    <span style='font-size: 13px; color: #1E40AF; font-weight: 600;'>Net Financial Gain to Institute:</span><br/>
                    <b style='font-size: 28px; color: #1E3A8A;'>₹{roi_res['net_gain']:,.0f}</b><br/>
                    <span style='font-size: 12px; color: #2563EB;'>Annual Software Spend: ₹{roi_res['total_software_cost']:,.0f}</span>
                </div>
                """, unsafe_allow_html=True)

            st.markdown("<div style='height: 12px;'></div>", unsafe_allow_html=True)
            k_a, k_b, k_c = st.columns(3)
            k_a.metric("Net ROI Multiple", f"{roi_res['roi_multiple']}x", help="Return on every rupee spent on Data Moat")
            k_b.metric("Payback Horizon", f"{roi_res['payback_months']} Months", help="Months of operation to fully recoup software fees")
            k_c.metric("Gross Margin", f"{roi_res['gross_margin_pct']}%", help="Platform operational margin")

        st.markdown("---")

        # Sensitivity Matrix
        st.markdown("##### 🔬 Attrition Prevention Sensitivity Analysis Table")
        st.markdown("Examines financial gains across conservative, expected, and aggressive retention scenarios:")
        df_sens = generate_roi_sensitivity_table(
            active_students=in_students,
            annual_fee_per_student=in_annual_fee,
            baseline_attrition_rate=in_attrition_pct,
            platform_annual_fee_per_student=in_platform_fee,
            onboarding_concierge_fee=in_onboarding
        )
        st.dataframe(df_sens, use_container_width=True, hide_index=True)
