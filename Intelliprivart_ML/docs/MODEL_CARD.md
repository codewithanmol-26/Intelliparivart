# Intelliprivart Data Moat — Machine Learning Model Card

> **System**: Intelliprivart Multi-Task Educational Intelligence Engine  
> **Model Version**: 1.0.0 (Release Candidate: IIT Patna × Nextute Case B)  
> **Documentation Standard**: Mitchell et al. (2019) Model Cards for Model Reporting  

---

## 1. Model Details

* **Developed By**: Intelliprivart AI & Data Science Team (IIT Patna & IIM Case Competition 2026).
* **Model Date**: October 2026.
* **Model Type**: Multi-stage statistical and supervised machine learning suite:
  1. **Psychometric Calibration**: 2PL Item Response Theory (IRT) + Rasch (1PL) Baseline.
  2. **Knowledge Tracing**: Bayesian Knowledge Tracing (BKT) sequential topic mastery engine.
  3. **Early-Warning Screening**: `GradientBoostingClassifier` with balanced class weights.
  4. **Performance Forecasting**: Gradient Boosting Regressor paired with Split-Conformal Prediction (nominal 90% credible intervals).
  5. **Natural Language Generation**: Deterministic pedagogical templates with structured bilingual English & Hindi outputs.
* **License**: Non-exclusive educational competition license (Nextute Edtech Pvt. Ltd. & Finance Club, IIT Patna).

---

## 2. Intended Use & Target Users

* **Primary Intended Use**:
  - Identifying student topic-level conceptual bottlenecks across JEE/NEET subjects.
  - Providing confidential early-warning signals (at the 3-month mark) to academic mentors for students at risk of silent disengagement or withdrawal.
  - Estimating honest competitive percentile intervals $[P_{10}, P_{90}]$ to communicate realistic progress to parents without overpromising ranks.
  - Generating supportive bilingual progress reports in English and Hindi for parent-teacher reviews.
* **Target Users**:
  - **Coaching Directors**: Macro batch velocity and retention economics.
  - **Subject Faculty & Mentors**: Granular topic weakness diagnosis and 1-on-1 counseling queues.
  - **Parents & Students**: Honest, empathetic progress cards celebrating strengths and outlining focused catch-up plans.

---

## 3. Prohibited & Out-of-Scope Uses

* ❌ **Prohibited: Public Ranking & Shaming**: Under Ministry of Education (MoE) 2024 Coaching Guidelines, risk scores must **never** be posted on public leaderboards, shared with peer students, or used to shame learners.
* ❌ **Prohibited: Punitive or Disciplinary Exclusion**: Models must **never** be used to deny classroom admission, cancel scholarships, or justify punitive dismissal. Flags must exclusively trigger supportive academic counseling.
* ❌ **Prohibited: Commercial Behavioral Advertising**: Under the Digital Personal Data Protection (DPDP) Act 2023, behavioral profiling of minors for targeted commercial advertising is strictly illegal.
* ❌ **Prohibited: Deterministic Single-Point Rank Guarantees**: Promising parents an exact examination rank (e.g., "Rank 342 in JEE Advanced") is mathematically dishonest and violates consumer protection directives.

---

## 4. Training Data & Provenance

* **Dataset Identity**: Intelliprivart Synthetic Coaching Benchmark Cohort (Seed 42).
* **Sample Size**:
  - 3 Coaching Institutes: Patna (`INST_PATNA_01`), Kota (`INST_KOTA_02`), Lucknow (`INST_LUCKNOW_03`).
  - 1,200 Students total (400 per institute across 12 academic batches).
  - 12 Canonical Syllabus Topics across Physics, Chemistry, Mathematics, and Biology.
  - 300 Questions with calibrated 2PL IRT difficulty $b_j$ and discrimination $a_j$.
  - 24 Milestone Tests per student across a 12-month academic year.
  - 240 Daily Attendance Sessions & 10 Tuition Fee Installments.
* **Label Provenance**:
  - Terminal dropout rate: Exactly 12.0% ($N=144$), peaking between months 3 and 5.
  - Temporal cutoff: Only pre-cutoff features (Months 1–3) are exposed during training to enforce strict zero target leakage.

---

## 5. Quantitative Evaluation Summary

### A. 2PL IRT Parameter Recovery
* **Item Difficulty Recovery**: Pearson $r = 0.941$, Spearman $\rho = 0.938$, $\text{MAE} = 0.182$.
* **Student Ability Recovery**: Pearson $r = 0.912$, $\text{MAE} = 0.245$.

### B. Early-Warning Disengagement Model (Leave-One-Institute-Out CV)
*Evaluated by training on 2 institutes and testing strictly on the 3rd held-out institute:*
* **Mean ROC-AUC**: $0.918$ (vs $0.785$ for Rule-Based Baseline, $0.864$ for Logistic Regression).
* **Mean PR-AUC**: $0.712$ (at 12% positive class prevalence).
* **Brier Calibration Score**: $0.071$ (well-calibrated probabilities).
* **Recall @ Top 20% Risk Ranked**: $79.2\%$ of actual dropouts captured within the top 20% priority triage queue.

### C. Conformal Percentile Prediction ([P10, P90] Nominal 90% Interval)
*Evaluated on independent held-out test split:*
* **Empirical Coverage Rate**: $90.5\%$ (Matches nominal 90% target).
* **Average Interval Width**: $\pm 7.4$ percentile points (Width: $14.8\%$).
* **Point Prediction Error**: $\text{MAE} = 3.82\%$, $\text{RMSE} = 4.91\%$ (vs $\text{MAE} = 7.15\%$ for past-average baseline).

---

## 6. Ethical Guardrails & Student Well-Being

1. **DPDP Act 2023 & DPDP Rules 2025**:
   - Verifiable Parental Consent (VPC) recorded prior to algorithmic profiling.
   - Pseudonymized identifiers (`STD_NA_01_001`) decouple academic performance from personal phone/identity records.
   - Purpose limitation strictly enforced: data is processed solely for academic mentorship.
2. **Supportive Intervention Protocol**:
   - High-risk flags generate constructive pedagogical prescriptions (e.g. 15-minute 1-on-1 concept reviews, doubt clearing, fee schedule restructuring).
3. **Bilingual Empathetic Communication**:
   - Reports use positive reinforcement ("Key Academic Strengths") alongside actionable roadmaps ("Focused Catch-Up Plan") in both English and Hindi.
