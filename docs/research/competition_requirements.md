# Nextute × Finance Club, IIT Patna: Competition Requirements & Case B Baseline

> **Competition**: Nextute Edtech Pvt. Ltd. × Finance Club, IIT Patna — Case Competition 2026  
> **Track**: **CASE B: The Data Moat**  
> **Mission**: Build an AI-powered intelligence platform that turns the messy data of India's coaching institutes into better results — and a profitable SaaS business.  
> **Participant Eligibility**: Students of IITs & IIMs  
> **Status**: Official Participant Guide Verified Baseline  

---

## 1. Official Competition Context & Mission

### Background & Realities of Indian Coaching Hubs
While national EdTech conglomerates (Allen, Aakash, PhysicsWallah) invest millions in proprietary learning tech, the vast majority of India's competitive exam market (JEE, NEET, Foundation, State CETs) is driven by **small and mid-sized local coaching institutes** in educational hubs such as **Patna, Kota, Lucknow, Jaipur, Indore**, and tier-2/3 towns.

These institutes generate massive learning exhaust weekly, but it remains trapped in:
* **Paper OMR sheets** from weekly Sunday mock exams.
* **Ad-hoc Excel / CSV files** maintained by individual subject faculty.
* **Physical registers & attendance logs**.
* **Broadcast WhatsApp groups** used for homework, marks distribution, and parent updates.

### The Problem
1. **Delayed Topic Diagnosis**: Teachers discover student topic-level weaknesses only after major milestone test failures.
2. **Silent Attrition**: Students about to drop out or default on fee installments are recognized only after they leave.
3. **Information Asymmetry & Diminished Trust**: Parents receive only raw scorecards without diagnostic context or remedial roadmaps.
4. **Institutional Blindness**: Owners cannot measure faculty effectiveness, batch velocity, or compare performance across batches.
5. **The Moat Imperative**: "Whoever collects clean, structured learning data across many institutes builds a data moat: better models, better results, more institutes, more data."

---

## 2. Official Evaluation Criteria & Weightage Split (70% Tech : 30% Market)

The competition is evaluated across two rounds with an explicit 70:30 weighting scheme:

| Category | Criterion | Official Weight | Key Evaluation Focus |
| :--- | :--- | :---: | :--- |
| **Technology (70%)** | **1. Architecture & Engineering** | **25%** | Realistic data capture (OMR, WhatsApp, Excel), sound schema linking students/questions/topics, multi-tenancy, offline-first sync for patchy internet, security, infra + AI cost per student per month. |
| **Technology (70%)** | **2. Data Science, ML & AI Rigour** | **25%** | Item Response Theory (IRT: 1PL/2PL/3PL) or Knowledge Tracing (BKT/DKT), validated early-warning risk models (LightGBM/Survival), honest uncertainty in rank/percentile prediction intervals, low-cost GenAI with guardrails. |
| **Technology (70%)** | **3. Feasibility, Privacy & Safety** | **20%** | Real-world usability for low-tech staff, **DPDP Act 2023 & DPDP Rules 2025 compliance for minors** (verifiable parental consent, restricted tracking), MoE Coaching Guidelines 2024, **student well-being safeguards (zero shaming, no public at-risk ranking)**. |
| **Market (30%)** | **4. Revenue Model & Unit Economics** | **20%** | Challenging naive assumptions, pricing logic (per-student vs tiered SaaS), institute ROI proof, CAC, payback, seasonal churn (March–June), LTV, 3-year projection, sensitivity analysis. |
| **Market (30%)** | **5. Market & Go-To-Market** | **10%** | City tier segmentation (Patna, Kota, Lucknow, Jaipur, Indore), sales channels, competitive defensibility against generic ERPs, compound data moat. |

---

## 3. Explicit Technical & Regulatory Requirements (Must Answer)

### A. Data Capture & Ingestion (Low Bandwidth / Offline-First)
* **Phone-Camera OMR Scanning**: Processing paper bubble sheets via OpenCV computer vision without requiring dedicated optical scanning hardware.
* **WhatsApp Business Bot / Cloud API**: Allowing teachers or students to submit scores or receive reports over WhatsApp without logging into complex portals.
* **Excel / Google Forms Sync**: Flexible schema matching for messy institute rosters.
* **Offline-First Synchronization**: Local caching (SQLite / IndexedDB) with asynchronous background sync when connectivity is restored in smaller towns.

### B. Learning Analytics & Knowledge Tracing
* **Topic Graph**: Canonical JEE/NEET syllabus hierarchy linking Subjects $\rightarrow$ Chapters $\rightarrow$ Topics $\rightarrow$ Sub-topics.
* **Psychometrics (IRT & BKT)**:
  * **Item Response Theory (2PL IRT)**: Modeling probability of correct answer based on student latent ability ($\theta$) and question difficulty ($b$) and discrimination ($a$):
    $$P(Y_{ij} = 1 \mid \theta_i, a_j, b_j) = \frac{1}{1 + e^{-a_j(\theta_i - b_j)}}$$
  * **Bayesian Knowledge Tracing (BKT)**: Tracking student topic mastery over sequential practice attempts ($P(L_0), P(T), P(S), P(G)$).
* **Calibrated Rank / Percentile Prediction with Honest Uncertainty**:
  * Predicting expected percentile range $[P_{10}, P_{90}]$ calibrated against historical NTA JEE/NEET percentile distributions.
  * Expressing prediction intervals honestly rather than overpromising single-point ranks.

### C. Generative AI Layer
* **Bilingual Parent Communication**: Automated, empathetic progress reports generated in **Hindi and English**.
* **RAG over Syllabus & Institute Notes**: Generating tailored concept catch-up worksheets and doubt explanations at low token cost ($< ₹2$ per student per month).
* **Pedagogical Guardrails**: Strict schema validation to prevent hallucinations or discouraging feedback.

### D. Compliance, Safety & Student Well-Being (Mandatory Design Requirements)
1. **DPDP Act 2023 & DPDP Rules 2025**:
   * Most coaching students are under 18 years old.
   * Mandates **Verifiable Parental Consent (VPC)** via digital OTP or signed physical enrollment token.
   * Prohibits behavioral profiling of children for commercial targeting. The system’s early-warning models must be strictly scoped to **academic support and learning intervention**.
2. **Ministry of Education (MoE) Coaching Guidelines 2024**:
   * Fair practices, transparent communication, and student mental health safeguards.
   * Prohibits misleading rank claims.
3. **Student Well-Being & Zero Shaming**:
   * **Explicit Prohibition**: "At-risk flags must lead to supportive actions (mentoring, counselling, remedial help) — never to public ranking, shaming or pressure on the student."
   * At-risk rosters are visible **only to authorized mentors and academic counselors**.
   * Student and parent views highlight growth opportunities and positive trajectory milestones.
4. **Data Ownership**:
   * The institute owns its proprietary student records and test items.
   * The platform aggregates only **anonymized, de-identified parameters** to calibrate global question difficulty and train the foundational learning models that constitute the Data Moat.

---

## 4. Challenging the Naive Financial Model (Section 06 / 07 Analysis)

The competition brief explicitly instructs teams: *"Your job is to challenge this. These numbers look very attractive — which is exactly why judges will question them."*

| Naive Assumption in Brief | Real-World Vulnerability / Failure Mode | DataMoat Refined Solution & Modeling |
| :--- | :--- | :--- |
| **Pricing at ₹40/student/mo** | Institute owners are highly price-sensitive and resist variable monthly per-head bills during exam lulls. | **Hybrid Tiered Model**: Fixed annual platform base fee (covers core features) + per-student tier blocks (predictable budgeting for owners). |
| **"Prevents 25% of Dropouts"** | Proving direct causal attribution for saved dropouts is difficult and will be contested by owners. | **Empirical Control Trajectories**: Comparing 30-day post-intervention attendance/score lift of mentored students against historical un-intervened cohorts. |
| **3% Monthly Churn** | Coaching is intensely seasonal. Annual logo churn spikes heavily in **March–June** post-exam when batches graduate. | **Annual Contracts Billed Upfront**: Pricing aligned with the 10-to-12 month academic cycle, mitigating off-season churn. |
| **Zero Onboarding Friction** | Low-tech staff struggle with manual data entry, leading to high onboarding churn. | **Managed Data Onboarding (₹5,000–₹8,000)**: First-month concierge service where Nextute ingests historical OMR/Excel sheets for them. |
| **Infra + AI Cost ₹6/student** | Unchecked LLM token usage for 400 students can easily explode unit costs. | **Local Tabular ML (LightGBM/IRT) + Selective LLM Caching**: AI cost compressed to **₹1.20–₹1.80/student/month**; total infra kept under **₹4.50/student/month**. |

---

## 5. Round 1 Deliverables Checklist

* [x] **Deliverable 1: Solution Deck** (16:9 Widescreen, max 12 content slides + title & appendix, covering problem, architecture, ML/IRT, revenue model, unit economics, GTM, and well-being).
* [x] **Deliverable 2: Live Financial Model** (Interactive Excel workbook with live formulas, 3-year projection, scenario analysis, and sensitivity data tables).
* [x] **Deliverable 3: Working Demonstration / Prototype Code** (End-to-end Python prototype with synthetic data generator, 2PL IRT calibration, LightGBM dropout prediction, and bilingual parent report).
* [x] **Rule 2 Compliance**: AI tool disclosure statement included on the final presentation slide.
* [x] **Rule 6 Compliance**: Submission file naming format ready (`TeamName_CaseB_Round1.pdf`).
