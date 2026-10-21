"""
Data Moat - Main Streamlit Application Entrypoint
AI-Powered Institute Intelligence Platform | Nextute EdTech × Finance Club, IIT Patna 2026
"""

# NumPy 2.x compatibility shim for older scientific libraries
import numpy as np
if not hasattr(np, "bool8"):
    np.bool8 = np.bool_

import streamlit as st
from sqlalchemy.orm import Session
from src.config import settings
from src.database.connection import init_db, SessionLocal, check_db_health
from src.database.models import Institute
from src.data.generator import seed_database
from src.services.auth import rbac

# Import all 12 views
from src.views.v01_overview import render_overview
from src.views.v02_students import render_students
from src.views.v03_ingestion import render_ingestion
from src.views.v04_tests import render_tests
from src.views.v05_mastery import render_mastery
from src.views.v06_early_warning import render_early_warning
from src.views.v07_performance import render_performance
from src.views.v08_interventions import render_interventions
from src.views.v09_parent_reports import render_parent_reports
from src.views.v10_institute_analytics import render_institute_analytics
from src.views.v11_model_evaluation import render_model_evaluation
from src.views.v12_settings_privacy import render_settings_privacy

# Page configuration
st.set_page_config(
    page_title="Data Moat — Institute Intelligence Platform",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Design System CSS
st.markdown("""
<style>
    /* Clean, professional SaaS palette */
    .stApp {
        background-color: #F8FAFC;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #0F172A;
    }
    
    /* Top Header Bar */
    .top-header {
        background: #FFFFFF;
        padding: 12px 20px;
        border-radius: 8px;
        border: 1px solid #E2E8F0;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    /* KPI Card styling */
    div[data-testid="stMetricValue"] {
        font-size: 24px;
        font-weight: 700;
        color: #0F172A;
    }
    
    div[data-testid="stMetricLabel"] {
        font-size: 13px;
        color: #64748B;
        font-weight: 500;
    }
    
    /* Subtle sidebar styling */
    section[data-testid="stSidebar"] {
        background-color: #FFFFFF;
        border-right: 1px solid #E2E8F0;
    }
    
    /* Buttons */
    .stButton>button {
        border-radius: 6px;
        font-weight: 600;
        transition: all 0.15s ease;
    }
</style>
""", unsafe_allow_html=True)

# Initialize database schema
init_db()

# Establish DB Session
if "db_session" not in st.session_state:
    st.session_state.db_session = SessionLocal()

db: Session = st.session_state.db_session

# Auto-seed database if empty
institutes_count = db.query(Institute).count()
if institutes_count == 0:
    seed_database(db, force=False)

# =========================================================================
# SIDEBAR NAVIGATION & MULTI-TENANCY CONTROLS
# =========================================================================
with st.sidebar:
    st.markdown("""
    <div style='display: flex; align-items: center; gap: 10px; margin-bottom: 12px;'>
        <div style='background: #0D9488; color: white; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;'>
            🛡️
        </div>
        <div>
            <b style='font-size: 17px; color: #0F172A;'>DATA MOAT</b><br/>
            <span style='font-size: 11px; color: #64748B;'>IIT Patna × Nextute 2026</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")

    # 1. Tenant / Institute Selector
    institutes = db.query(Institute).all()
    inst_options = {inst.institute_id: f"{inst.name.split(',')[0]} ({inst.city})" for inst in institutes}

    active_institute_id = st.selectbox(
        "🏢 Active Institute (Tenant):",
        list(inst_options.keys()),
        format_func=lambda x: inst_options.get(x, x),
        key="global_active_tenant"
    )

    # 2. User Role Switcher
    active_role = st.selectbox(
        "👤 Active User Role:",
        settings.ROLES,
        index=0,
        key="global_active_role"
    )

    st.markdown("---")

    # 3. Primary Navigation (12 Sections)
    NAV_ITEMS = [
        "1. Overview",
        "2. Students",
        "3. Data Ingestion",
        "4. Tests & Results",
        "5. Topic Mastery",
        "6. Early-Warning System",
        "7. Performance Prediction",
        "8. Study Plans & Interventions",
        "9. Parent Reports",
        "10. Institute Analytics",
        "11. Data Quality & Model Evaluation",
        "12. Settings & Privacy"
    ]

    selected_nav = st.radio(
        "Navigation",
        NAV_ITEMS,
        label_visibility="collapsed"
    )

    st.markdown("---")

    # Workspace status & synthetic badge
    st.markdown("""
    <div style='background: #F1F5F9; border: 1px solid #CBD5E1; padding: 10px; border-radius: 6px; font-size: 11px;'>
        <b style='color: #0F172A;'>Demo Mode Active</b><br/>
        <span style='color: #475569;'>• Synthetic Data: 1,200 Students</span><br/>
        <span style='color: #475569;'>• DPDP VPC Safeguards: Enabled</span><br/>
        <span style='color: #0D9488;'>• DB: {}</span>
    </div>
    """.format("PostgreSQL" if settings.is_postgres else "SQLite Local"), unsafe_allow_html=True)

    if st.button("🔄 Reset / Re-Seed Demo Data", use_container_width=True):
        with st.spinner("Re-seeding 1,200 synthetic students..."):
            seed_database(db, force=True)
            st.success("Re-seeded synthetic data!")
            st.rerun()

# =========================================================================
# ROUTE TO SELECTED VIEW
# =========================================================================
if selected_nav == "1. Overview":
    render_overview(db, active_institute_id, active_role)

elif selected_nav == "2. Students":
    render_students(db, active_institute_id, active_role)

elif selected_nav == "3. Data Ingestion":
    render_ingestion(db, active_institute_id, active_role)

elif selected_nav == "4. Tests & Results":
    render_tests(db, active_institute_id, active_role)

elif selected_nav == "5. Topic Mastery":
    render_mastery(db, active_institute_id, active_role)

elif selected_nav == "6. Early-Warning System":
    render_early_warning(db, active_institute_id, active_role)

elif selected_nav == "7. Performance Prediction":
    render_performance(db, active_institute_id, active_role)

elif selected_nav == "8. Study Plans & Interventions":
    render_interventions(db, active_institute_id, active_role)

elif selected_nav == "9. Parent Reports":
    render_parent_reports(db, active_institute_id, active_role)

elif selected_nav == "10. Institute Analytics":
    render_institute_analytics(db, active_institute_id, active_role)

elif selected_nav == "11. Data Quality & Model Evaluation":
    render_model_evaluation(db, active_institute_id, active_role)

elif selected_nav == "12. Settings & Privacy":
    render_settings_privacy(db, active_institute_id, active_role)
