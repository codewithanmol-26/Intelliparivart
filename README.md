# 🛡️ Intelliprivart — AI-Powered Institute Intelligence Platform

> **Nextute EdTech × Finance Club, IIT Patna — Case Competition 2026**  
> **Track**: Case B — The Data Moat  
> **Mission**: Build an AI-powered intelligence platform that transforms the fragmented educational exhaust of India's coaching institutes into structured records, predictive diagnostics, and measurable academic interventions — creating a durable, compound data moat.  
> **Weightage Focus**: **70% Technology** (Architecture, ML Rigour, Privacy & Safety) | **30% Market** (Unit Economics, GTM, Institute ROI)  
> **Team Name**: **Intelliparivart / Intelliprivart**

---

### 🏆 Official Competition Submission Deliverables

| # | Deliverable | Live Cloud Link | Local Deliverable File |
| :-: | :--- | :--- | :--- |
| **1** | **Google Colab Notebook** | [**Open in Google Colab**](https://colab.research.google.com/drive/1UTJ0NDZTffQQ-if6o_TP_OBLeP15rkYi?usp=sharing) | [`1_Colab_Intelliprivart_DataMoat_ML.ipynb`](file:///c:/Users/aryan/OneDrive/Desktop/Data%20Moat/1_Colab_Intelliprivart_DataMoat_ML.ipynb) |
| **2** | **Excel Financial Model** | [**Open in Excel Online (OneDrive)**](https://1drv.ms/x/c/d60414ee7b60239b/IQDt8Tm9OCY0TrB-BuRbFUM4AeOaSTeDYpPUGq6YKj6_0ac?e=8M8Ja7) | [`2_Excel_Nextute_Case_B_Financial_Model.xlsx`](file:///c:/Users/aryan/OneDrive/Desktop/Data%20Moat/2_Excel_Nextute_Case_B_Financial_Model.xlsx) |
| **3** | **Google Slides Pitch Deck** | [**Open in Google Slides (14 Slides)**](https://docs.google.com/presentation/d/1-JMFZVQYazTDPJXLMlF96xofFSOSrFMkJRZYu1CCFuw/edit?usp=sharing) | [`3_PPT_Intelliparivart_CaseB_Round1.pptx`](file:///c:/Users/aryan/OneDrive/Desktop/Data%20Moat/3_PPT_Intelliparivart_CaseB_Round1.pptx) / [PDF](file:///c:/Users/aryan/OneDrive/Desktop/Data%20Moat/3_PPT_Intelliparivart_CaseB_Round1.pdf) |
| **4** | **GitHub Repository** | [**github.com/tribhuvneshsharma/Intelliprivart**](https://github.com/tribhuvneshsharma/Intelliprivart) | [`4_GitHub_Repository_Submission.md`](file:///c:/Users/aryan/OneDrive/Desktop/Data%20Moat/4_GitHub_Repository_Submission.md) |

---

## ⚡ Quickstart — Run the Complete Full-Stack Web Platform

The platform runs in **two commands** on Windows, macOS, or Linux, or with **Docker**:

### Option 1: Native Two-Command Run (Windows / Mac / Linux)

```bash
# 1. Setup Python ML & Next.js frontend dependencies (seeds 1,200 student cohort)
make setup        # Or run `setup.bat` on Windows

# 2. Run both FastAPI Backend (Port 8000) and Next.js Frontend (Port 3000)
# Terminal 1:
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
# Terminal 2:
cd frontend && npm run dev
```
Open **`http://localhost:3000`** in your browser.

*(On Windows, you can also simply double-click `run.bat`)*

### Option 2: Production Cloud Deployment (Vercel + Render + Supabase)

The platform is architected for zero-cost cloud deployment on modern serverless & edge infrastructure:

* **Frontend**: **Vercel** (`frontend/`) — Next.js 14 App Router, auto SSL, Edge CDN.
* **Backend**: **Render** (`render.yaml`) — FastAPI web service with Gunicorn/Uvicorn workers.
* **Database**: **Supabase** (`docs/supabase_schema.sql`) — Managed PostgreSQL with connection pooling & RLS tenant isolation.

👉 **Complete Step-by-Step Instructions**: [`docs/DEPLOYMENT_GUIDE.md`](file:///c:/Users/aryan/OneDrive/Desktop/Data%20Moat/docs/DEPLOYMENT_GUIDE.md)

### Option 3: Docker Containerized Deployment

```bash
docker compose up --build
```

### Option 4: Automated API & ML Verification Tests

```bash
python -m pytest backend/tests/ -v
```
*All 12 integration and authentication test suites pass (100% green).*

---

## 🏛️ High-Level System Architecture

Data Moat decouples statistical psychometric modeling from deterministic explanation and front-facing decision portals:

```
                                      INTELLIPRIVART PLATFORM ARCHITECTURE
                                      
  [ Phone Camera OMR ] ──( OpenCV Laplacian/Contours )──┐
  [ Messy CSV/Excel  ] ──( Pydantic Gateway / Review )──┼──> [ Tenant-Isolated DB ] ──> [ Psychometrics & ML ] ──> [ Next.js 14 Role Views ]
  [ Rural Field Logs ] ──( IndexedDB Offline Queue   )──┘    (SQLite / Postgres)        • 2PL IRT Ability θ        • 1. Institute Owner (ROI)
                                                             Strict `tenant_id`         • BKT Topic Mastery        • 2. Teacher (OMR/Remedial)
                                                                                        • Early Dropout (0-leak)   • 3. Student (Zero-Shame)
                                                                                        • Conformal [P10, P90]     • 4. Parent (Hindi/English)
```

---

## 🎯 Role-Based Portals

| Role | Core Workflow | Privacy & Pedagogical Guardrails |
| :--- | :--- | :--- |
| **Institute Owner** (`/owner`) | Cohort retention KPIs, batch comparison tables, interactive tuition fee recovery calculator ($2.22\times$ to $3.7\times$ Net ROI). | Aggregate cohort analytics; cross-batch performance benchmarking. |
| **Teacher / Academic Head** (`/mastery`, `/upload`, `/risk`) | Phone camera OMR scanner, Review Queue for dirty records, topic mastery heatmap with uncertainty hatching, early-warning dropout queue, and 1-tap remedial assignment. | Teacher-only diagnostic view; 1-click student intervention dispatch. |
| **Student** (`/student`) | Conceptual mastery progress, personalized strengths, daily 15-minute practice problem packs. | **Strict Zero-Shaming Guarantee**: No dropout risk scores, no public peer ranks, no negative comparative shaming. |
| **Parent** (`/reports`) | Weekly progress digests in **English and Hindi** with automated factual verification badge and WhatsApp share link. | Positive developmental reinforcement; automated factual cross-check against database ground truth. |

---

## 🔬 Machine Learning & Psychometrics Rigour

Data Moat strictly avoids hallucinated predictions or ungrounded generative assertions:

### 1. 2-Parameter Logistic (2PL) Item Response Theory (IRT)
For student $i$ on test question $j$ with discrimination $a_j$, difficulty $b_j$, and partial guessing floor $c = 0.10$:
$$P(Y_{ij} = 1 \mid \theta_i, a_j, b_j, c) = c + (1 - c) \frac{1}{1 + e^{-1.7 \cdot a_j \cdot (\theta_i - b_j)}}$$
Student latent ability $\theta_i \sim \mathcal{N}(0, 1)$ is estimated via **Maximum A Posteriori (MAP)** bounded optimization.

### 2. Bayesian Knowledge Tracing (BKT)
Tracks dynamic mastery probability $P(L_t)$ after every question attempt across 12 JEE/NEET topics ($P(L_0)=0.30, P(T)=0.12, P(G)=0.15, P(S)=0.10$):
$$P(L_t \mid \text{Obs}) = \begin{cases} \frac{P(L_{t-1})(1-P(S))}{P(L_{t-1})(1-P(S)) + (1-P(L_{t-1}))P(G)} & \text{if Correct} \\ \frac{P(L_{t-1})P(S)}{P(L_{t-1})P(S) + (1-P(L_{t-1}))(1-P(G))} & \text{if Incorrect} \end{cases}$$
$$P(L_t) = P(L_t \mid \text{Obs}) + (1 - P(L_t \mid \text{Obs})) \cdot P(T)$$

### 3. Early-Warning Dropout Classifier (Zero Target Leakage)
- **Feature Cutoff**: Strictly restricted to **Months 1–3 behavioral markers** (attendance velocity, topic slump frequency, homework latency, fee installment lag). Dropouts occur in Months 6–8.
- **Validation**: Leave-One-Institute-Out Cross-Validation (LOIO-CV) across Patna, Lucknow, and Jaipur cohorts.
- **Performance**: **ROC-AUC = 0.846**, Brier Score = 0.118, Precision = 0.76, Recall = 0.79.

### 4. Split-Conformal Percentile Range $[P_{10}, P_{90}]$
Avoids falsely precise single ranks (prohibited by MoE 2024 Guidelines). Provides finite-sample $80\%$ coverage guarantee $(1-\alpha=0.80)$. Empirical coverage: **81.4%**. The interval naturally contracts from $\pm 14.0$ percentile points in Month 2 to $\pm 5.0$ percentile points in Month 8 as evidence accumulates.

---

## 📷 Computer Vision Phone OMR Scanner

- **Laplacian Blur Variance**: Flags blurred photos (blur score $< 100$) before evaluation.
- **Brightness & Skew Diagnostics**: Verifies lighting thresholds and rotation angle.
- **Contour Masking**: Extracts option darkness ratios for 20 questions in $<250\text{ ms}$.
- **1-Tap Teacher Override**: Teachers can inspect borderline questions and adjust responses directly into the database.

---

## 🔒 DPDP Act 2023 & Security Architecture

1. **Mandatory Multi-Tenant Scoping**: All database queries enforce explicit `tenant_id` isolation.
2. **Guardian Consent Register (`/privacy`)**: Digital recording of verifiable parental consent with 1-click revocation.
3. **Right to Erasure (DPDP Act Section 12)**: 1-click anonymization of student PII with cryptographic audit logging.
4. **Data Minimization & Local Compute**: Parent digests use deterministic templates ($₹0.00$ external API cost), bringing unit cost down to **₹3.40 / student / month** ($96.6\%$ gross margin).

---

## 🎮 Judge Curveball Sandbox (`/demo-tools`)

Evaluators can test system adaptability in real time:
- **"Change an Input Live" panel**: Move attendance, test slump, or fee lag sliders for any student and watch the early-warning model update risk probabilities in 12ms.
- **Curveball 1 (Network Blackout)**: Simulates 14-day rural connectivity loss with client IndexedDB queueing.
- **Curveball 2 (Flawed Exam Question)**: Injects an ambiguous question and demonstrates how 2PL IRT discounts the item to protect student ability $\theta$.
- **Curveball 3 (Syllabus Reordering)**: Injects mid-term syllabus changes and demonstrates BKT parameter adaptation without catastrophic forgetting.

---

*Intelliprivart — Built for Nextute EdTech × Finance Club, IIT Patna Case Competition 2026.*
