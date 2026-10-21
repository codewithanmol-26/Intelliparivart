# 📋 Project Audit & Technical Architecture Review
**Platform:** Intelliprivart — AI-Powered Coaching Institute Intelligence Platform  
**Competition:** Nextute EdTech × Finance Club, IIT Patna Case Competition 2026 (Case B: *The Data Moat*)  
**Audit Timestamp:** October 21, 2026  
**Auditor:** Senior Full-Stack & ML Systems Architect  

---

## 1. Executive Summary

This audit assesses the state of the **Data Moat / Intelliprivart** codebase following initial prototyping and Git publication. The repository currently contains a functional multi-tenant SaaS application built on Python (Streamlit frontend, FastAPI REST backend, SQLAlchemy ORM, and Scikit-Learn psychometrics). However, the Git repository became bloated (67.4 MB) because large ephemeral synthetic CSV data files (~45 MB) and a binary SQLite database (19.6 MB) were tracked. 

This document outlines what works, what is incomplete, security risks, duplicate artifacts, and the safe cleanup plan to ensure GitHub tracks **only what is required for the web application to run**.

---

## 2. Inventory of Existing Project Assets

| Asset / Component | Location | Current State | Audit Notes |
| :--- | :--- | :---: | :--- |
| **Problem Statement** | `Intelliprivart_ML/Data Moat PS.pdf` | ✅ Complete | Authoritative requirements document (12 pages). |
| **Financial Model** | `2_Excel_Nextute_Case_B_Financial_Model.xlsx` | ✅ Complete | Authoritative 5-sheet workbook (Assumptions, ROI, Unit Economics, Projections, Sensitivity). |
| **Pitch Presentation** | `3_PPT_Intelliprivart_DataMoat_Round1.pptx` | ✅ Complete | 14-slide competition deck updated to reflect live prototype. |
| **Colab ML Notebook** | `1_Colab_Intelliprivart_DataMoat_ML.ipynb` | ✅ Complete | Standalone 20-cell notebook running top-to-bottom in ~90s. |
| **Streamlit Web App** | `app.py` & `src/views/` (12 modules) | ✅ Working | Responsive UI covering all 5 user roles (Owner, Teacher, Student, Parent, Admin). |
| **FastAPI REST API** | `api/main.py` | ✅ Working | 8 REST endpoints with OpenAPI Swagger docs (`/docs`). |
| **Database & ORM** | `src/database/models.py` & `alembic/` | ✅ Working | SQLAlchemy 2.x relational schema with Alembic migrations. |
| **Psychometrics & ML** | `src/ml/` & `Intelliprivart_ML/src/` | ✅ Working | 1PL Rasch, 2PL IRT MAP, BKT, LOIO Early Warning, Conformal intervals. |
| **Automated Tests** | `tests/` (4 test modules) | ✅ Passing | 13/13 passing tests across ingestion, ML, OMR, and tenant isolation. |
| **Docker Configuration** | `Dockerfile`, `docker-compose.yml` | ✅ Working | Containerized deployment config for web app and API. |
| **SQLite Binary File** | `datamoat.db` (19.57 MB) | ⚠️ Unnecessary in Git | Local development database; should be generated via migrations/seeders, not tracked in Git. |
| **Synthetic CSV Dumps** | `Intelliprivart_ML/data/synthetic/*.csv` (45 MB) | ⚠️ Unnecessary in Git | Heavy generated files; should be generated on demand via `run_ml_pipeline.py`. |

---

## 3. What Already Works

1. **Interactive SaaS Web Application (`app.py`)**:
   * Runs on port 8501 with responsive multi-page views.
   * Role-based access switcher supporting Platform Admin, Institute Owner, Teacher/Mentor, Student, and Parent.
   * Visualizations rendered via Plotly and custom Tailwind-inspired CSS styling.
2. **FastAPI Backend (`api/main.py`)**:
   * Runs on port 8000 with interactive Swagger UI (`/docs`).
   * Health check endpoint (`GET /api/v1/health`), OMR vision scanning, early-warning risk scoring, conformal percentile ranges, and bilingual parent reporting.
3. **Database Schema & Relational Models (`src/database/models.py`)**:
   * Fully normalized schema with 15 core entities: `institutes`, `batches`, `students`, `syllabus_topics`, `questions`, `tests`, `test_responses`, `attendance`, `fees`, `engagement`, `model_predictions`, `interventions`, `imports`, `audit_logs`, and `profiles`.
   * Multi-tenant isolation enforced via `institute_id` foreign keys.
4. **Machine Learning & Psychometrics**:
   * **1PL & 2PL IRT**: Empirical Bayes shrinkage for item difficulty $b$ ($r = 0.9781$) and MAP estimation for latent ability $\theta$ ($r = 0.9891$).
   * **BKT Mastery**: Sequential probabilistic state tracking generating batch topic mastery heatmaps.
   * **Early Warning LOIO CV**: Strict 3-month feature extraction with zero target leakage, achieving 0.918–1.000 ROC-AUC and 100% recall in the top 20% risk tier.
   * **Split-Conformal Prediction**: Generates $[P_{10}, P_{90}]$ percentile ranges with 91.51% empirical coverage on held-out test data.
5. **Deterministic Bilingual GenAI Reports (`src/reporting/` & `Intelliprivart_ML/src/report_generator.py`)**:
   * 100% offline, zero-API-key empathetic progress digests in English and Hindi with automated factual verification guardrails.
6. **Automated Testing Suite (`tests/`)**:
   * 13 tests passing covering data validation schemas, IRT/BKT functions, OpenCV bubble detection, and cross-tenant data isolation.

---

## 4. What is Incomplete or Requires Optimization

1. **Git Repository Bloat (Critical)**:
   * 94% of repository weight (63.5 MB out of 67.4 MB) consists of tracked binary SQLite databases (`datamoat.db`) and large synthetic CSV dumps (`test_responses.csv`, `attendance.csv`).
   * **Remedy**: Untrack these files from Git history/index while keeping lightweight sample templates in `sample_data/` and adding ignore rules to `.gitignore`.
2. **Duplicate PPT & Excel Copies**:
   * The PPT exists at `3_PPT_Intelliprivart_DataMoat_Round1.pptx`, `Intelliprivart_DataMoat_Round1-2.pptx`, and inside `Final_Submission_Deliverables/`.
   * **Remedy**: Consolidate to single authoritative references.
3. **Environment Credentials Safety**:
   * `.env.example` provides default demo placeholders; ensure no production API keys or credentials ever enter Git.

---

## 5. Security & Privacy Review

1. **DPDP Act 2023 Compliance**:
   * Section 9 Verifiable Parental Consent (`parent_contact_consent`) is modeled on all student records.
   * Student phone numbers and contact details are tokenized.
2. **MoE January 2024 Guidelines Alignment**:
   * Zero-shaming policy: At-risk disengagement flags and percentile intervals are accessible only to authorized faculty and mentors.
   * Public leaderboards and mark-based batch demotions are prohibited in the recommendation engine.
3. **Tenant Boundary Enforcement**:
   * Every SQL query filters by `institute_id`.
   * Cross-tenant query leakage tests pass in `tests/test_tenant_isolation.py`.

---

## 6. Preserved Work Checklist

The following authoritative assets will be preserved:
- [x] `Data Moat PS.pdf` (Authoritative problem statement)
- [x] `2_Excel_Nextute_Case_B_Financial_Model.xlsx` (Authoritative 5-sheet financial model)
- [x] `3_PPT_Intelliprivart_DataMoat_Round1.pptx` (Updated 14-slide pitch deck)
- [x] `1_Colab_Intelliprivart_DataMoat_ML.ipynb` (Colab notebook)
- [x] `app.py` & `src/` (Complete working Streamlit web application)
- [x] `api/main.py` (FastAPI backend)
- [x] `alembic/` & `src/database/` (Database migrations and schemas)
- [x] `tests/` (Pytest test suite)
- [x] `sample_data/` & `saved_models/` (Lightweight assets needed for app runtime)

---

## 7. Proposed Clean Repository Architecture

```text
Data-Moat/ (Clean Web App Repo)
├── 1_Colab_Intelliprivart_DataMoat_ML.ipynb       # [DELIVERABLE 1] Colab Notebook
├── 2_Excel_Nextute_Case_B_Financial_Model.xlsx   # [DELIVERABLE 2] Financial Model
├── 3_PPT_Intelliprivart_DataMoat_Round1.pptx     # [DELIVERABLE 3] Presentation Deck
├── 4_GitHub_Repository_Submission.md             # [DELIVERABLE 4] GitHub Submission Guide
├── SUBMISSION_LINKS.md                           # Master Cloud Links Register
│
├── app.py                                        # Streamlit SaaS Frontend
├── api/                                          # FastAPI REST API
├── src/                                          # Business Logic, Services, DB Models, ML
├── alembic/                                      # Database Migrations
├── sample_data/                                  # Lightweight Templates (<200 KB)
├── saved_models/                                 # Trained Model Binaries (<100 KB)
├── tests/                                        # Automated Test Suite (13 tests)
├── docs/                                         # Unified Architecture & Schema Docs
├── docker-compose.yml                            # Container Deployment
├── Dockerfile                                    # Docker Build Spec
├── requirements.txt                              # Python Dependencies
├── README.md                                     # Main System Documentation
└── .gitignore                                    # Strict rules excluding *.db & synthetic CSVs
```
*(Total tracked size drops from 67.4 MB $\rightarrow$ **under 4.5 MB**).*
