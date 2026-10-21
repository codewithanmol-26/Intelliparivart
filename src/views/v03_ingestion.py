"""
View 03: Data Ingestion & OpenCV OMR Vision Scanner
Unified gateway for tabular CSV/XLSX imports, schema mapping, Pydantic validation quarantine,
and optical mark recognition (OMR) bubble grading with visual feedback.
"""

import io
import streamlit as st
import pandas as pd
from PIL import Image
from sqlalchemy.orm import Session
from src.data.ingestion import auto_map_columns, generate_template_csv, validate_and_import_students, validate_and_import_test_responses
from src.data.omr import generate_sample_omr_sheet, process_omr_image, DEFAULT_ANSWER_KEY
from src.database.models import Student, TestResponse, AuditLog

def render_ingestion(db: Session, institute_id: str, user_role: str):
    st.markdown("## 📥 Data Ingestion & OMR Vision Processing")
    st.markdown(
        f"<p style='color: #64748B; margin-top: -10px; font-size: 14px;'>"
        f"Transform unstructured coaching spreadsheets and paper OMR bubble sheets into validated, tenant-isolated records."
        f"</p>",
        unsafe_allow_html=True
    )

    tab_csv, tab_omr, tab_adapters = st.tabs([
        "📄 CSV / Excel Tabular Ingestion",
        "📷 Phone-Camera OMR Vision Scanner",
        "🔌 Cloud Adapters (WhatsApp & Google Sheets)"
    ])

    # =========================================================================
    # TAB 1: CSV / EXCEL INGESTION
    # =========================================================================
    with tab_csv:
        st.markdown("##### 1. Select Entity & Download Standard Templates")
        t_col1, t_col2 = st.columns([2, 1])
        with t_col1:
            entity_type = st.selectbox(
                "Target Educational Entity",
                ["students", "test_scores", "attendance", "fees"],
                format_func=lambda x: {
                    "students": "Student Enrollment & Batches",
                    "test_scores": "Mock Test Question Responses",
                    "attendance": "Class Attendance Logs",
                    "fees": "Fee Installment Ledger"
                }.get(x, x)
            )
        with t_col2:
            st.markdown("<div style='height: 28px;'></div>", unsafe_allow_html=True)
            template_csv = generate_template_csv(entity_type)
            st.download_button(
                f"📥 Download {entity_type.capitalize()} CSV Template",
                data=template_csv,
                file_name=f"datamoat_{entity_type}_template.csv",
                mime="text/csv"
            )

        st.markdown("---")
        st.markdown("##### 2. Upload File (CSV or Excel)")
        uploaded_file = st.file_uploader(
            "Upload spreadsheet file",
            type=["csv", "xlsx", "xls"],
            key="file_uploader_tabular"
        )

        if uploaded_file is not None:
            try:
                if uploaded_file.name.endswith(".csv"):
                    df_upload = pd.read_csv(uploaded_file)
                else:
                    df_upload = pd.read_excel(uploaded_file)

                st.success(f"Successfully parsed **{len(df_upload)}** rows and **{len(df_upload.columns)}** columns from `{uploaded_file.name}`.")
                
                # Preview Table
                with st.expander("👀 Preview First 5 Uploaded Rows", expanded=True):
                    st.dataframe(df_upload.head(5), use_container_width=True)

                # Schema Mapping
                st.markdown("##### 3. Column Schema Mapping & Normalization")
                auto_map = auto_map_columns(list(df_upload.columns))
                
                m_cols = st.columns(min(4, len(df_upload.columns)))
                final_mapping = {}
                for idx, col in enumerate(df_upload.columns):
                    with m_cols[idx % len(m_cols)]:
                        suggested = auto_map.get(col, col)
                        final_mapping[col] = st.text_input(f"'{col}' maps to:", value=suggested, key=f"map_{col}")

                # Validation & Confirmation
                st.markdown("##### 4. Pydantic Type Enforcement & Commit")
                if st.button("🚀 Validate & Import Records", type="primary"):
                    with st.spinner("Validating rows against Pydantic schema constraints..."):
                        if entity_type == "students":
                            result, accepted, rejected = validate_and_import_students(
                                df_upload, final_mapping, institute_id, db, user_role
                            )
                        elif entity_type == "test_scores":
                            result, accepted, rejected = validate_and_import_test_responses(
                                df_upload, final_mapping, institute_id, db, user_role
                            )
                        else:
                            st.info("Direct import available for Students and Test Scores. Attendance and Fees can be mapped to batches.")
                            return

                        # Metrics
                        res1, res2, res3 = st.columns(3)
                        res1.metric("Total Rows Processed", result.total_rows)
                        res2.metric("Accepted & Persisted", accepted)
                        res3.metric("Quarantined (Rejected)", rejected)

                        if result.rejected_rows > 0:
                            st.warning(f"⚠️ {rejected} rows failed schema constraints and were quarantined.")
                            df_err = pd.DataFrame(result.errors)
                            st.dataframe(df_err, use_container_width=True)
                        else:
                            st.success(f"🎉 Perfect import! All {accepted} rows accepted into tenant workspace.")

            except Exception as e:
                st.error(f"Error parsing uploaded file: {str(e)}")

    # =========================================================================
    # TAB 2: OPENCV OMR SCANNER
    # =========================================================================
    with tab_omr:
        st.markdown("##### 📷 Phone-Camera Paper OMR Bubble Sheet Processing")
        st.markdown(
            "Upload a photograph or scanned image of a 20-question paper bubble sheet. "
            "Our OpenCV vision engine computes pixel fill ratios, detects ambiguous marks, and scores against answer keys."
        )

        omr_c1, omr_c2 = st.columns([1.5, 1])

        with omr_c2:
            st.markdown("###### OMR Test Sheet Controls")
            st.markdown("Don't have a physical sheet handy? Generate a synthetic marked test sheet in 1 click:")
            if st.button("📄 Generate & Load Sample OMR Sheet"):
                img_arr, raw_bytes = generate_sample_omr_sheet()
                st.session_state["omr_bytes"] = raw_bytes
                st.success("Sample test OMR sheet loaded into memory!")

            threshold_val = st.slider("Bubble Darkness Sensitivity Threshold", 0.20, 0.70, 0.40, 0.05,
                                      help="Adjust threshold for light pencil or dark ink marks")

            # Download blank template
            _, blank_bytes = generate_sample_omr_sheet(marked_answers={})
            st.download_button(
                "📥 Download Printable Blank OMR Sheet (PNG)",
                data=blank_bytes,
                file_name="datamoat_blank_omr_sheet.png",
                mime="image/png"
            )

        with omr_c1:
            omr_upload = st.file_uploader(
                "Upload OMR Image (JPG/PNG)",
                type=["png", "jpg", "jpeg"],
                key="omr_image_file"
            )
            if omr_upload is not None:
                st.session_state["omr_bytes"] = omr_upload.read()

        if "omr_bytes" in st.session_state and st.session_state["omr_bytes"]:
            raw_bytes = st.session_state["omr_bytes"]

            # Process with OpenCV
            try:
                omr_results = process_omr_image(
                    raw_bytes,
                    answer_key=DEFAULT_ANSWER_KEY,
                    darkness_threshold=threshold_val
                )

                st.markdown("---")
                st.markdown("##### 🔬 OpenCV Computer Vision Detection Results")

                # Metrics
                oc1, oc2, oc3, oc4 = st.columns(4)
                oc1.metric("Attempted Questions", f"{omr_results['attempted']} / {omr_results['total_questions']}")
                oc2.metric("Correct Answers", omr_results["correct"])
                oc3.metric("Ambiguous / Multiple Marks", omr_results["ambiguous"])
                oc4.metric("Exam Score (JEE +4/-1)", f"{omr_results['total_score']} pts")

                # Image comparison
                col_img1, col_img2 = st.columns(2)
                with col_img1:
                    st.markdown("**Original Ingested Sheet**")
                    st.image(raw_bytes, use_column_width=True)
                with col_img2:
                    st.markdown("**OpenCV Annotated Bubble Overlay** (🟢 Correct | 🔴 Wrong | 🟠 Ambiguous)")
                    st.image(omr_results["annotated_image_bytes"], use_column_width=True)

                # Editable Review Table
                st.markdown("##### ✍️ Verify & Correct Extracted Responses Before Committing")
                results_df = pd.DataFrame(omr_results["results"])
                st.dataframe(
                    results_df[["question_no", "detected_option", "correct_key", "status", "confidence", "fill_density"]],
                    use_container_width=True,
                    hide_index=True
                )

                # Commit to DB
                st.markdown("###### Commit Evaluated Scores to Student Record:")
                target_std = st.selectbox(
                    "Assign Exam Results to Student:",
                    [s.student_id for s in db.query(Student).filter(Student.institute_id == institute_id).limit(20).all()]
                )

                if st.button("💾 Commit OMR Test Results to Database", type="primary"):
                    new_responses = []
                    for r in omr_results["results"]:
                        new_responses.append(TestResponse(
                            test_id="TEST_OMR_SCAN_01",
                            student_id=target_std,
                            question_id=f"Q_{r['question_no']:03d}",
                            response=r["detected_option"] or "BLANK",
                            is_correct=r["is_correct"],
                            time_taken_sec=60,
                            test_date=pd.Timestamp.now().date()
                        ))
                    db.bulk_save_objects(new_responses)
                    db.commit()
                    st.success(f"🎉 20 evaluated test responses committed to student `{target_std}`!")

            except Exception as e:
                st.error(f"Error processing OMR sheet: {str(e)}")

    # =========================================================================
    # TAB 3: ADAPTERS
    # =========================================================================
    with tab_adapters:
        st.markdown("##### 🔌 Extensible Adapter Interfaces")
        st.markdown(
            "Data Moat includes decoupled service adapter contracts for automated synchronization with "
            "Google Forms / Sheets and the WhatsApp Business Cloud API."
        )

        ad1, ad2 = st.columns(2)
        with ad1:
            st.markdown("""
            <div style='background: #FFFFFF; border: 1px solid #E2E8F0; padding: 16px; border-radius: 8px;'>
                <b style='font-size: 15px; color: #0F172A;'>Google Forms / Sheets Sync Adapter</b><br/>
                <span style='font-size: 13px; color: #64748B;'>Status: <b>Adapter Interface Ready (Mock Mode)</b></span>
                <p style='font-size: 12px; color: #475569; margin-top: 8px;'>
                    Pulls periodic quiz submissions from connected Google Sheets via Service Account OAuth2 credentials.
                    Transforms responses into Data Moat <code>TestResponse</code> schemas.
                </p>
                <code style='font-size: 11px;'>src.data.adapters.GoogleSheetsAdapter</code>
            </div>
            """, unsafe_allow_html=True)

        with ad2:
            st.markdown("""
            <div style='background: #FFFFFF; border: 1px solid #E2E8F0; padding: 16px; border-radius: 8px;'>
                <b style='font-size: 15px; color: #0F172A;'>WhatsApp Business Cloud API Adapter</b><br/>
                <span style='font-size: 13px; color: #64748B;'>Status: <b>Adapter Interface Ready (Mock Mode)</b></span>
                <p style='font-size: 12px; color: #475569; margin-top: 8px;'>
                    Webhook listener receiving parent acknowledgments and dispatching bilingual progress digest PDFs
                    with DPDP VPC parental authorization tokens.
                </p>
                <code style='font-size: 11px;'>src.data.adapters.WhatsAppCloudAdapter</code>
            </div>
            """, unsafe_allow_html=True)
