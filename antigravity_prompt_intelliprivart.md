# PROMPT FOR ANTIGRAVITY: Intelliprivart Institute Intelligence Platform (Round 2 working prototype)

## 0. Role and how to work
You are a senior full-stack + ML engineer building a **working end-to-end prototype** for a case competition (Nextute EdTech × Finance Club, IIT Patna, Case B: "The Data Moat"). Judges will run it live and may change an input on the spot, so everything must really run on real logic, never mocked screenshots or hard-coded numbers.

**Before writing code:** produce a short implementation plan and task list as an artifact, then build in the phases in section 9. After each phase, run it, fix errors, and confirm the acceptance checks. Do not stop at scaffolding. Keep the project runnable with **two commands** (`make setup` and `make run`, or a single `docker compose up`).

## 1. Product in one paragraph
A web platform ("Intelliprivart") for small and mid-sized JEE/NEET coaching institutes in India. Staff upload test results (CSV or a phone photo of an OMR sheet). The system cleans and validates the data, then shows: a **topic-mastery heatmap**, an **at-risk student list with reasons and supportive actions**, a **predicted percentile range with honest uncertainty**, and an **auto-generated parent report in Hindi or English**. Owners see retention and ROI. Students never see rankings. Every flag leads to a supportive action, never shaming.

## 2. Honesty rules (non-negotiable)
- All data is **synthetic**. Show a persistent badge: "Synthetic demo data, results show the pipeline works, not real-world accuracy."
- Never invent metrics. Every number on screen must come from computed data or a stated formula.
- Show uncertainty everywhere (error bars, 90% ranges, "wide / narrow" labels).
- Mark anything not built as "Planned" in the UI rather than faking it.
- Dropout/risk flags are **mentor-only**. No public ranking, no leaderboards, no red-shame styling for students.

## 3. Tech stack
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Recharts (or visx for the heatmap). Installable **PWA** with an offline upload queue (IndexedDB) that syncs when online.
- **Backend:** FastAPI (Python), Pydantic, SQLAlchemy. **SQLite by default** (zero setup) with a schema that is Postgres-compatible: `tenant_id` on every table, and tenant scoping enforced in a single query layer (document how this maps to Postgres row-level security).
- **ML:** scikit-learn, LightGBM/XGBoost (optional), `girth` or a hand-written 2PL IRT fit, MAPIE or manual split-conformal prediction, pandas, numpy.
- **OMR:** OpenCV (perspective correction, bubble detection, confidence per bubble). Include a generator for a sample OMR sheet (printable PDF/PNG) plus sample photos with mild rotation and noise.
- **GenAI:** pluggable provider via env var (`LLM_PROVIDER`, `LLM_API_KEY`). **Must work with no key** by falling back to a deterministic bilingual template. With a key, the LLM drafts text from verified facts only, and a checker validates it.
- Repo layout: `/frontend`, `/backend`, `/ml`, `/data` (generator + generated CSVs), `/docs`, `Makefile`, `README.md`, `.env.example`.

## 4. Synthetic data generator (`/data/generate.py`, seeded, reproducible)
Follow this schema: institutes, batches, students (with `parent_contact_consent`), questions, test_responses, attendance, fees, engagement, outcomes.
- 3 institutes (different cities and tiers, e.g. Patna, Lucknow, Jaipur), **1,200 students**, **8 months**, **16 tests × 20 questions**, **12 syllabus topics** (mix of Physics/Chemistry/Maths), **300 questions** tagged to topics.
- Responses from a **2PL IRT model with guessing 0.10**. Per-student latent ability per topic.
- **~12% dropout** driven by a hidden disengagement factor that shows up in attendance trend, fee delay, homework, doubts, and score trend. Dropout mostly in months 3-5.
- Outcomes: `dropped_out_flag`, `dropout_month`, `final_mock_percentile`.
- Also generate: a dirty CSV (duplicate rows, missing IDs, mismatched student IDs, misspelled names) for the validation demo, and 3 sample OMR images (clean, rotated, blurry).

## 5. Features (each must be functional)

### 5.1 Ingestion and validation
- Drag-and-drop **CSV/Excel upload** and **OMR photo upload** (camera capture on mobile).
- OMR pipeline: quality check (blur/brightness/skew) → perspective correct → read bubbles → per-question confidence → match student ID. Low quality → "please re-capture" with the reason. Double or faint marks → flagged question with a **1-tap teacher fix**.
- Validation report: duplicates, missing values, unknown/mismatched student IDs (fuzzy match suggestion). Nothing is silently dropped. Uncertain rows go to a **Review Queue** page with approve/edit/reject.
- Show staff-effort metrics: rows loaded, rows needing review, minutes spent.
- **Offline mode:** a toggle that simulates no network; uploads queue on device and sync later with visible status (Queued / Syncing / Synced).

### 5.2 Topic-mastery heatmap
- Students (rows) × topics (columns), color by mastery with an uncertainty indicator (e.g. hatch or opacity for wide intervals).
- Mastery from IRT with shrinkage; show a baseline comparison against the plain per-topic percent-correct.
- Click a cell → drill-down: the questions behind it, difficulty estimates, trend across tests.
- Batch-level view: weakest topics for the whole batch, with a "create remedial group" button (students below a mastery threshold).

### 5.3 Early-warning (at-risk list)
- Model trained on **months 1-3 features only** (attendance rate and trend, fee delay, doubts, homework, score mean and trend). No label leakage.
- Baseline: logistic regression; upgrade: gradient boosting. Show validation: train on 2 institutes, test on the 3rd; PR-AUC, recall at top 20%, calibration curve, comparison against an attendance-only rule.
- Each flagged student shows **top reasons** (coefficients/SHAP-style contributions in plain language, e.g. "Attendance down 18 pts, fee 9 days late") and a **suggested supportive action** (mentor call, remedial set, fee-plan conversation). Actions can be assigned and tracked: Assigned → Done → Follow-up result.
- Visible only to Owner/Mentor roles.

### 5.4 Performance prediction
- Predicted **percentile range (90% interval)** via quantile boosting + split conformal calibration. Display as a range bar with width label ("wide at month 3, narrows as tests accrue").
- Report MAE and interval coverage against a mean-of-past-tests baseline. A slider for "month of the year" shows the interval narrowing.

### 5.5 Parent report (Hindi / English)
- Generate on demand per student: strengths, topics to practise, attendance, a short supportive plan, and an honest note on prediction uncertainty. Language toggle EN / हिंदी. Nothing negative or comparative to other students.
- Pipeline: verified facts → template or LLM draft → **checker** (numbers must match source, banned words/shaming terms list, no rank talk) → if check fails or the LLM is down, fall back to the template. Show checker status and the cost per report.
- Only generate when `parent_contact_consent = true`; otherwise show a consent-required state. Export/share as PDF or WhatsApp-ready text.

### 5.6 Dashboards by role (role switcher in the header for demo; real RBAC behind it)
- **Owner:** retention overview, at-risk count, batch comparison, faculty-neutral batch trends, fee-delay overview, ROI calculator (inputs: students, fee, dropout %, % prevented, price/student/month → ROI multiple, break-even % prevented).
- **Teacher:** upload, heatmap, weak-topic groups, remedial assignment, review queue.
- **Student:** own mastery strengths and a personal practice plan only. **No rank, no comparison, no risk score.**
- **Parent:** weekly report view only.

### 5.7 Privacy, consent, safety panel
- Consent registry per student (parental consent flag, purpose, date, withdraw button). Withdrawing consent immediately removes the student from predictions and parent reports and logs it.
- Audit log of who viewed what. Data retention/deletion demo (delete a student → cascades).
- A "Well-being by design" explainer card showing what is never shown to students/parents.
- Note: DPDP Rules 2025 require verifiable parental consent for children's data. Label as "design intent, not a compliance claim."

### 5.8 Model & system report page
- Auto-built from real runs: validation metrics, calibration plots, cost per student per month (LLM + compute/storage + messaging, formula shown, editable assumptions), architecture diagram, privacy design, known limitations.
- Export as a 2-4 page PDF.

### 5.9 Live demo tools (for the pitch)
- **"Change an input live" panel:** edit a student's attendance/fee delay/test score and watch risk, mastery, range and report update.
- **Curveball mode:** buttons that simulate surprise scenarios and show the system adapting, e.g. (a) a regulation bans behavioral tracking of minors → disable risk scoring for non-consented students and show degraded-but-lawful mode, (b) LLM provider outage → template fallback, (c) a new institute joins with a different test format → new column mapping, (d) cost cap on AI spend → reduce report frequency and show the new cost per student.

## 6. UI / design direction
- **Look:** consulting style. **Deep navy (#0B1F3A) + white** with one restrained accent (teal #14B8A6 for data/positive, warm orange #F97316 used sparingly for "needs review" and external/sensitive flows). Clean grid, generous whitespace, subtle borders, rounded-lg, no gradients or stock illustrations.
- **Type:** Inter for UI, tabular numerals in data tables. Devanagari-safe font (Noto Sans Devanagari) for Hindi.
- **Layout:** left sidebar (Upload, Review Queue, Mastery, At-Risk, Predictions, Reports, Owner, Privacy, Model Report), top bar with institute + role switcher + synthetic-data badge + online/offline indicator.
- **Heatmap:** diverging-free single-hue scale (light → teal), uncertainty via hatch. Accessible contrast, colour-blind safe, always with numeric tooltips.
- **Tone of copy:** supportive and plain. Risk is called "Needs support", never "failing". Mobile-first, works on a 375px screen, big tap targets for low-tech staff, Hindi/English toggle on every user-facing page.
- Empty states, loading skeletons, and clear error messages with next steps. A guided "Demo walkthrough" button that steps through the 7 pitch steps.

## 7. API (FastAPI, tenant-scoped, JWT + role checks)
`POST /ingest/csv`, `POST /ingest/omr`, `GET /review-queue`, `POST /review-queue/{id}/resolve`, `GET /mastery/{batch}`, `GET /students/{id}/mastery`, `GET /risk`, `GET /students/{id}/risk`, `POST /actions`, `GET /predict/{student}`, `POST /reports/{student}?lang=hi|en`, `GET /owner/summary`, `POST /consent/{student}/withdraw`, `GET /audit`, `GET /model-report`, `POST /simulate/{scenario}`. Include OpenAPI docs, input validation, rate limiting, and no secrets in code.

## 8. Testing and acceptance checks
- Unit tests for: IRT recovery of known difficulty on synthetic data, no label leakage in features, conformal coverage ≈ 90% on held-out data, report checker rejecting wrong numbers, tenant isolation (tenant A cannot read tenant B).
- End-to-end demo script that must pass: upload dirty CSV → see validation + review queue → heatmap renders → at-risk list with reasons → prediction range → parent report in Hindi → withdraw consent → student disappears from reports → owner ROI updates.
- `README.md` with setup, demo script, architecture, and honest limitations.

## 9. Build phases
1. Repo scaffold, data generator, DB schema, seeded demo data.
2. Ingestion: CSV validation + review queue, then OMR pipeline, then offline queue.
3. IRT mastery + heatmap + drill-down.
4. Risk model + reasons + actions + validation view.
5. Percentile range model + conformal + prediction UI.
6. Parent report pipeline (template, LLM, checker), EN/HI.
7. Role dashboards, owner ROI calculator, privacy/consent/audit.
8. Model & system report, live-change panel, curveball mode, walkthrough.
9. Tests, polish, README, one-command run.

## 10. Final deliverables
Running app, code repo, `README`, sample data and OMR images, generated 2-4 page model report PDF, and a short list of known limitations (synthetic labels, OMR accuracy on real sheets untested, interval width, no pilot evidence).

Start by posting the implementation plan, then begin Phase 1.
