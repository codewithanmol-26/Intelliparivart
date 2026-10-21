# 🛡️ Data Moat — AI-Powered Institute Intelligence Platform

> **Nextute EdTech × Finance Club, IIT Patna — Case Competition 2026**  
> **Track**: Case B — The Data Moat  
> **Mission**: Build an AI-powered intelligence platform that transforms the fragmented educational exhaust of India's coaching institutes into structured records, predictive diagnostics, and measurable academic interventions — creating a durable, compound data moat.  
> **Weightage Focus**: **70% Technology** (Architecture, ML Rigour, Privacy & Safety) | **30% Market** (Unit Economics, GTM, Institute ROI)

---

## 📑 Table of Contents
1. [Product Vision & Problem Statement](#1-product-vision--problem-statement)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Machine Learning & Psychometrics Rigour](#4-machine-learning--psychometrics-rigour)
5. [Computer Vision OMR Processing](#5-computer-vision-omr-processing)
6. [Generative AI Layer & Telemetry](#6-generative-ai-layer--telemetry)
7. [Security, DPDP Act 2023 & Student Well-Being](#7-security-dpdp-act-2023--student-well-being)
8. [Quickstart & Local Setup](#8-quickstart--local-setup)
9. [Database Migrations & Multi-Tenancy](#9-database-migrations--multi-tenancy)
10. [Automated Testing](#10-automated-testing)
11. [Docker & Containerized Deployment](#11-docker--containerized-deployment)
12. [15-Step Live Demonstration Walkthrough](#12-15-step-live-demonstration-walkthrough)

---

## 1. Product Vision & Problem Statement

In educational coaching hubs across India (**Patna, Kota, Lucknow, Jaipur, Indore**), small and mid-sized coaching institutes preparing students for **JEE Main/Advanced and NEET** manage learning data through fragmented, offline channels:
- Weekly mock exam scores trapped on **paper OMR sheets**.
- Attendance logs stored in physical registers or biometrics CSVs.
- Student fee installments recorded in offline ledgers.
- Academic doubt clearing and homework dispersed across unmonitored WhatsApp groups.

### The Consequences
1. **Delayed Topic Diagnosis**: Faculty discover conceptual blind spots only after milestone mock failures.
2. **Silent Attrition**: Disengaged students drop out or default on fees before administrative staff notice.
3. **Information Asymmetry**: Parents receive raw numerical scorecards without diagnostic context or remedial roadmaps.
4. **The Compound Data Moat**: *"Whoever collects clean, structured learning data across many institutes builds a compound data moat: better item calibration, better knowledge tracing, superior student results, and higher institute retention."*

---

## 2. High-Level Architecture

Data Moat decouples statistical predictive machine learning from Generative AI explanation:
```
                                     DATA MOAT ARCHITECTURAL FLOW
                                     
[ Paper OMR Sheets ] ──( OpenCV Vision )──┐
[ Tabular CSV/XLSX ] ──( Pydantic Gateway )┼──> [ Tenant-Isolated DB ] ──> [ Psychometrics & ML ] ──> [ Prescriptive UI & Reports ]
[ Biometric Logs   ] ──( Normalization  )──┘    (PostgreSQL / SQLite)       • 2PL IRT Ability θ        • Executive Command Center
                                                                            • BKT Topic Mastery        • Priority Triage Roster
                                                                            • GradientBoosting Risk    • Bilingual Parent Reports
                                                                            • TreeSHAP Attribution     • ReportLab PDF Export
```

### Core Axiom
> *"Statistical ML estimates calibrated risk probabilities and student latent ability; Generative AI synthesizes pedagogical context into empathetic, actionable recommendations."*

---

## 3. Technology Stack

| Layer | Technology | Justification & Architectural Role |
| :--- | :--- | :--- |
| **Frontend UI** | **Streamlit** (Custom Design System) | High-speed, responsive, light-slate theme (`#F8FAFC`) with Plotly interactive charts; zero hard-coded mockup data. |
| **Backend REST API** | **FastAPI + Uvicorn** | Documented OpenAPI endpoints (`/docs`) for programmatic institute, student, mastery, and OMR ingestion. |
| **Relational ORM** | **SQLAlchemy 2.x & Alembic** | Parameterized queries, multi-tenant scoping by `institute_id`, automated migration revisions. |
| **Primary Database** | **PostgreSQL** (Docker Compose) | Enterprise relational persistence with row-level logical multi-tenancy. Local development fallback to **SQLite**. |
| **Data Processing** | **Pandas, NumPy, Pydantic v2** | Strict schema validation, fuzzy header auto-mapping, and quarantine error logging. |
| **Computer Vision** | **OpenCV (`cv2`)** | Adaptive thresholding, contour detection, and bubble pixel density analysis for 20-question OMR sheets. |
| **Psychometrics & ML** | **SciPy & scikit-learn** | 2PL Item Response Theory (MAP estimation), Bayesian Knowledge Tracing (BKT), Gradient Boosting disengagement classifier. |
| **Document Generation** | **ReportLab** | High-resolution, bilingual (English & Hindi) printable A4 PDF parent progress digests. |
| **Generative AI** | **Gemini / Deterministic Engine** | Modular LLM adapter with telemetry cost tracking and built-in offline pedagogical template fallback. |

---

## 4. Machine Learning & Psychometrics Rigour

Data Moat strictly avoids ungrounded numerical assertions or predicting academic risk with non-deterministic LLMs. All predictive engines are mathematically formal:

### A. 2PL Item Response Theory (IRT)
For student $i$ on test question $j$ with discrimination $a_j$, difficulty $b_j$, and 4-option guessing floor $c = 0.20$:
$$P(Y_{ij} = 1 \mid \theta_i, a_j, b_j, c) = c + (1 - c) \frac{1}{1 + e^{-a_j(\theta_i - b_j)}}$$
Student latent ability $\theta_i \sim \mathcal{N}(0, 1)$ is estimated via **Maximum A Posteriori (MAP)** bounded optimization.

### B. Bayesian Knowledge Tracing (BKT)
Tracks topic mastery $P(L_t)$ sequentially after each question attempt using calibrated priors ($P(L_0)=0.35, P(T)=0.15, P(G)=0.20, P(S)=0.10$):
$$P(L_t \mid \text{Obs}) = \begin{cases} \frac{P(L_{t-1})(1-P(S))}{P(L_{t-1})(1-P(S)) + (1-P(L_{t-1}))P(G)} & \text{if Correct} \\ \frac{P(L_{t-1})P(S)}{P(L_{t-1})P(S) + (1-P(L_{t-1}))(1-P(G))} & \text{if Incorrect} \end{cases}$$
$$P(L_t) = P(L_t \mid \text{Obs}) + (1 - P(L_t \mid \text{Obs})) \cdot P(T)$$

### C. Calibrated Disengagement Early-Warning Model
- **Features**: 14-day attendance slope, lowest topic bottleneck mastery, fee default signal, homework submission rate, overall attendance.
- **Model**: `GradientBoostingClassifier` evaluated against Rule-Based and Logistic Regression baselines.
- **Explainability**: TreeSHAP-style root cause feature attribution drivers for faculty mentors.

### D. Honest Percentile Prediction Intervals
Avoids falsely precise single ranks (prohibited by MoE 2024 Guidelines). Predicts an **80% credible prediction interval $[P_{10}, P_{90}]$** mapped to national NTA JEE/NEET distributions:
$$P_{10} = \max(5.0, \Phi(\theta) \times 100 - \Delta), \quad P_{90} = \min(99.8, \Phi(\theta) \times 100 + \Delta)$$
Where uncertainty margin $\Delta$ expands dynamically with score volatility and sparse mock participation.

---

## 5. Computer Vision OMR Processing

Data Moat includes a working OpenCV optical mark recognition workflow (`src/data/omr.py`):
1. **Fiducial Alignment**: Corner registration square detection for camera perspective correction.
2. **Adaptive Binarization**: `cv2.adaptiveThreshold` handles uneven room lighting and shadow gradients.
3. **Circular Bubble Masking**: Isolates candidate bubble regions for options A, B, C, D across 20 questions.
4. **Fill Density Ratio**: Measures dark pixel percentage within mask.
5. **Ambiguity & Slip Detection**: Flags double-marked or faint bubbles for manual teacher review before database commit.
6. **Visual Inspection Overlay**: Draws green circles around correct answers, red around mistakes, and orange around ambiguous bubbles.
7. **Built-in Test Generator**: 1-click synthetic test sheet generator allows immediate testing without physical scanners.

---

## 6. Generative AI Layer & Telemetry

The platform features an optional, modular AI layer (`src/ai/adapter.py`) that operates without hard-coded API dependencies:
- **Local Deterministic Fallback**: Built-in pedagogical template engine runs 100% locally with zero external network calls, zero cost, and sub-10ms response latency.
- **Google Gemini 1.5 Flash Support**: Activated automatically when `GEMINI_API_KEY` is present.
- **Telemetry Accounting**: Automatically logs prompt tokens, completion tokens, execution latency (ms), and cost in INR ($\approx ₹0.00$ for local fallback).
- **Core Generative Workflows**:
  1. Personalized 14-day revision plans targeting concept bottlenecks.
  2. Empathetic bilingual parent reports in English and Hindi.
  3. Teacher-facing diagnostic mentoring protocols.
  4. Curated 3-question practice worksheets with step-by-step mathematical solutions.

---

## 7. Security, DPDP Act 2023 & Student Well-Being

Because most competitive exam students are minors, privacy and safety are core architectural constraints:

### Digital Personal Data Protection (DPDP) Act 2023 Compliance
- **Verifiable Parental Consent (VPC)**: Recorded for all learners under 18 years prior to diagnostic profiling.
- **Prohibition of Behavioral Profiling**: Model outputs are strictly restricted to educational tutoring and counseling. Commercial tracking is architecturally blocked.
- **Right to Erasure & Portability**: 1-click JSON data export and permanent student record purge workflows.

### Ministry of Education (MoE) 2024 Guidelines & Zero-Shaming
- **No False Rank Guarantees**: Rank promises are replaced by honest percentile prediction intervals.
- **Strict Confidentiality**: At-risk student rosters are accessible exclusively to authorized faculty mentors and counselors. **Public ranking, peer shaming, or comparative leaderboards are strictly prohibited.**
- **Supportive Action Mandate**: High-risk flags trigger supportive interventions (1-on-1 concept reviews, doubt sessions, fee rescheduling), never punitive exclusion.

---

## 8. Quickstart & Local Setup

### Prerequisites
- Python 3.10+ (Python 3.11/3.13 verified)
- Git

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-team/data-moat.git
cd "Data Moat"

# 2. Create virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment (Optional)
cp .env.example .env
```

### Launch Application
```bash
# Launch Streamlit web platform (Port 8501)
streamlit run app.py

# (Optional) Launch FastAPI REST API in a separate terminal (Port 8000)
uvicorn api.main:app --port 8000 --reload
```
Navigate to **`http://localhost:8501`** in your browser.

---

## 9. Database Migrations & Multi-Tenancy

Data Moat supports both **PostgreSQL** (Production) and **SQLite** (Local fallback):
- By default, the app initializes `sqlite:///datamoat.db` with WAL mode enabled.
- To use PostgreSQL, set `DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/datamoat` in `.env`.

### Alembic Migrations
```bash
# Check current migration revision
alembic current

# Apply migrations to head
alembic upgrade head

# Generate a new migration revision
alembic revision --autogenerate -m "Add custom index"
```

---

## 10. Automated Testing

Data Moat includes a comprehensive test suite (`tests/`) covering tenant isolation, ingestion validation, psychometrics, and OMR:

```bash
# Run full automated test suite
python -m pytest tests/ -v
```

### Test Coverage Highlights
- `tests/test_tenant_isolation.py`: Verifies Institute A cannot read, query, or update Institute B records (Cross-tenant access denial).
- `tests/test_ingestion.py`: Verifies Pydantic schema validation, column auto-mapping, and quarantine handling.
- `tests/test_ml_pipeline.py`: Validates 2PL IRT ability $\theta$ estimation, BKT mastery dynamics, and early-warning baseline scoring.
- `tests/test_omr.py`: Validates OpenCV bubble detection, 100% key scoring, and blank sheet handling.

---

## 11. Docker & Containerized Deployment

A production-ready `Dockerfile` and `docker-compose.yml` are provided:

```bash
# Build and launch PostgreSQL, Streamlit frontend, and FastAPI backend
docker compose up --build -d

# Check container status
docker compose ps

# View live application logs
docker compose logs -f web
```

---

## 12. 15-Step Live Demonstration Walkthrough

Follow this step-by-step walkthrough to evaluate every requirement:

1. **Launch App**: Open `http://localhost:8501`. Notice clean light theme, sidebar navigation, and demo mode indicator.
2. **Select Institute**: Use the sidebar to switch between `Apex Academy Patna`, `Chaitanya Kota`, and `Drona Medical Lucknow`.
3. **Executive Overview (View 01)**: Inspect real-time KPIs, batch comparison bar chart, and test accuracy trends.
4. **Student Directory (View 02)**: Search for a student (e.g. `Aarav`) and view their BKT topic radar and attendance trajectory.
5. **CSV Ingestion (View 03)**: Download the `Student CSV Template`, preview uploaded rows, and test schema auto-mapping.
6. **OpenCV OMR Scanner (View 03)**: Switch to the OMR tab, click *"Generate & Load Sample OMR Sheet"*, and see OpenCV detect bubbles with visual green/red/orange overlays!
7. **Mock Exam Diagnostics (View 04)**: Select a mock test to inspect student score distributions and 2PL IRT item difficulty ($b$) vs discrimination ($a$).
8. **Topic Mastery Heatmap (View 05)**: View the institutional batch mastery matrix and click a student to observe their longitudinal BKT learning curve.
9. **Early-Warning Triage (View 06)**: Inspect the prioritized at-risk roster. Review TreeSHAP feature attributions (e.g. attendance drop, concept bottleneck).
10. **Performance Range (View 07)**: Observe the honest percentile prediction interval $[P_{10}, P_{90}]$ plotted on an interactive NTA normal density curve.
11. **Supportive Intervention (View 08)**: Assign a 1-on-1 concept review and worksheet to an at-risk student; track status through the lifecycle board.
12. **Bilingual Parent Report (View 09)**: Generate an empathetic English/Hindi progress card, edit in place, and click *"Download Progress Report (PDF)"* to generate an A4 ReportLab PDF.
13. **SaaS ROI Calculator (View 10)**: Adjust student count and attrition sliders to see retained tuition fees, net financial gain, and payback period update in real time.
14. **Model Evaluation & Transparency (View 11)**: Review ROC-AUC (0.92+), Brier score, Confusion Matrix, and data leakage audit proofs.
15. **Tenant Isolation Security Audit (View 12)**: Execute the live penetration test to confirm cross-tenant reads and updates are strictly prevented.

---
*Built with rigour for Nextute EdTech × Finance Club, IIT Patna Case Competition 2026.*
