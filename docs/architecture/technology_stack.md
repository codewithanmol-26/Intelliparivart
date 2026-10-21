# DataMoat Technology Stack & Implementation Rationale

> **Project**: DataMoat — AI-Powered Intelligence Platform for Coaching Institutes  
> **Document**: Technology Choices, Stack Rationale & Cost Analysis  
> **Status**: Verified Baseline  

---

## 1. Overview & Stack Philosophy

A common trap in early-stage EdTech platforms is **premature over-engineering**: introducing microservices, complex message brokers (Kafka), multi-cloud setups, and mandatory paid LLM APIs before validating core user retention and workflow adoption.

DataMoat follows the **"Pragmatic Modular Monolith"** philosophy:
1. **Zero Microservice Bloat**: A unified FastAPI Python backend serves both the REST API endpoints and data science pipelines in the same high-performance runtime.
2. **Zero Mandatory Paid APIs for MVP**: The prototype operates completely offline using open-source tabular ML (LightGBM/TreeSHAP) and a deterministic fallback template engine or local Small Language Model (e.g., Ollama running Llama 3 / Mistral), with optional cloud LLM pluggability.
3. **Single Affordable Infrastructure Footprint**: The entire MVP can run within a single Docker Compose deployment on an inexpensive \$10–\$20/month cloud VPS (or local development workstation), keeping unit economics viable for price-sensitive coaching centers.

---

## 2. Technology Selection & Architectural Justifications

```
+-------------------------------------------------------------------------------------------------+
|                                     DATAMOAT TECHNOLOGY STACK                                   |
+-------------------------------------------------------------------------------------------------+
|  Presentation Tier:    Next.js 14 / React SPA | Tailwind CSS | Shadcn UI | Recharts | TanStack  |
|  API & Application:    FastAPI (Python 3.11+) | Pydantic v2 | Python-Jose (JWT) | BackgroundTasks |
|  Data Science & ML:    Pandas / Polars | Scikit-Learn | LightGBM | TreeSHAP                     |
|  AI Insights Gateway:  LiteLLM / Custom BaseAdapter | Ollama (Local) / Gemini / Rule Heuristics |
|  Persistence:          PostgreSQL 16 (Row-Level Security) | SQLAlchemy 2.0 Async | Alembic      |
|  Reporting & Export:   WeasyPrint / ReportLab (Headless PDF Generation)                         |
|  DevOps & Container:   Docker | Docker Compose | Nginx / Caddy Reverse Proxy                    |
+-------------------------------------------------------------------------------------------------+
```

### Detailed Component Evaluation

| Architectural Layer | Selected Technology | Alternative Considered | Rationale for Selection |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 / React** | Vue / Angular / Streamlit | Streamlit is too rigid for multi-role workflows and tabular batch triage. Next.js provides responsive state management, fast client-side rendering for complex data grids, and accessible components via Shadcn UI. |
| **Data Visualization** | **Recharts + Lucide Icons** | Chart.js / D3.js | D3 is overly complex for standard dashboards; Recharts provides declarative, responsive React components ideal for SHAP waterfall charts and attendance trend lines. |
| **Backend REST API** | **FastAPI (Python)** | Node.js (Express) / Django | Node.js lacks native integration with Python's data science ecosystem (Pandas, LightGBM, SHAP). Django has unnecessary ORM overhead. FastAPI offers high async performance, automatic OpenAPI documentation, and strict type safety via Pydantic v2. |
| **Relational Database** | **PostgreSQL 16** | MongoDB / MySQL | MongoDB lacks robust relational integrity for linked academic entities (batches, exams, scores). MySQL lacks native Row-Level Security (RLS) features that match PostgreSQL’s multi-tenant isolation capabilities. |
| **Multi-Tenancy** | **PostgreSQL RLS (Row-Level Security)** | Database-per-tenant / Separate schemas | Database-per-tenant introduces severe operational overhead for 50+ institutes. PostgreSQL RLS enforces tenant isolation at the database kernel level with single-schema simplicity and negligible performance cost. |
| **Tabular ML Inference** | **LightGBM + Scikit-Learn** | XGBoost / PyTorch Deep Learning | Tabular student data (attendance, marks) has missing values and mixed categorical/numerical types. LightGBM trains orders of magnitude faster than Deep Learning on CPU, handles missing test scores gracefully, and achieves state-of-the-art tabular accuracy. |
| **Explainable AI (XAI)** | **TreeSHAP** | LIME / Feature Permutation | TreeSHAP computes exact, mathematically consistent Shapley values in polynomial time for tree ensembles, avoiding the sampling variance and instability of LIME. |
| **Generative AI Gateway** | **Provider-Agnostic Adapter Pattern** | Hardcoded OpenAI API SDK | Prevents commercial vendor lock-in. Allows seamless switching between zero-cost local models (Ollama), cost-effective APIs (Gemini 1.5 Flash), and a deterministic rule engine for offline judging environments. |
| **Asynchronous Tasks** | **FastAPI BackgroundTasks (MVP)** | Celery + RabbitMQ / Kafka | Eliminates the need to configure and monitor a separate message broker and distributed workers for the initial prototype. Async tasks handle file parsing and ML scoring in-process. |
| **PDF Reporting** | **WeasyPrint** | Puppeteer / Headless Chrome | Puppeteer consumes 500MB+ of RAM per instance. WeasyPrint renders clean, printable PDF report cards directly from HTML/CSS templates with minimal memory overhead. |

---

## 3. Cost Analysis & Resource Footprint

Coaching institutes operate with tight margins and cannot bear heavy SaaS licensing costs. Below is a transparent breakdown of the infrastructure footprint for DataMoat.

### A. Competition Prototype / Development Environment (\$0 / month)
* **Compute**: Local workstation or free-tier container environment (Docker Compose).
* **Database**: Local PostgreSQL instance.
* **ML / Analytics**: Local CPU inference (LightGBM executes in $<20\text{ms}$ on modern CPUs).
* **AI Explanation**: Deterministic template engine or local Ollama instance (e.g., Llama 3 8B on CPU/GPU) = **\$0.00 API cost**.

### B. Production MVP: Single Coaching Institute / Multi-Tenant Pilot (\$15 – \$25 / month)

| Service Component | Specification | Deployment Mode | Monthly Cost (USD) |
| :--- | :--- | :--- | :--- |
| **VPS Server** | 4 vCPU, 8 GB RAM, 80 GB NVMe | Hetzner / DigitalOcean Droplet | \$14.00 – \$18.00 |
| **PostgreSQL Database** | Managed or Co-located on VPS | Docker container with daily backups to S3 | Included in VPS |
| **Reverse Proxy & SSL** | Caddy / Nginx | Automatic Let's Encrypt TLS 1.3 | \$0.00 |
| **AI Inference (Cloud)** | Google Gemini 1.5 Flash or OpenAI 4o-mini | ~1,000 recommendations/month (~2M tokens) | \$0.50 – \$1.50 |
| **Backup Storage** | Encrypted S3 / Cloudflare R2 | 10 GB retention | \$0.15 |
| **Total Operational Cost** | — | — | **~\$15.00 – \$20.00 / month** |

> **Cost per Institute Student**: At 500 enrolled students, infrastructure cost is **less than \$0.04 per student per month**, delivering massive gross margins ($>90\%$) at a modest subscription price of \$100–\$200/month per institute.

---

## 4. MVP vs. Future Enterprise Roadmap

| Functional Area | Competition MVP Baseline | Phase 2 Production Scaling | Phase 3 Enterprise Expansion |
| :--- | :--- | :--- | :--- |
| **Ingestion** | Drag-and-drop CSV & Excel (.xlsx) parser with interactive column header mapping. | Biometric attendance API webhooks & Google Sheets live connector. | Scanned physical answer-sheet OCR & batch video lecture attendance tracking. |
| **Multi-Tenancy** | PostgreSQL RLS on single database instance. | Read replicas with dedicated connection pooling (PgBouncer). | Dedicated tenant database clusters for major enterprise coaching chains. |
| **Task Processing** | In-process asynchronous tasks via FastAPI `BackgroundTasks`. | Distributed background queues using **Celery + Redis**. | Distributed workflow orchestration using Temporal / Airflow. |
| **Machine Learning** | Single pre-trained LightGBM risk classifier per target exam stream. | Automated per-institute model fine-tuning with local transfer learning. | Real-time adaptive continuous learning with automated drift triggers. |
| **Generative AI** | Prompt-engineered LLM adapter with deterministic rule-based fallback. | Cached vector store (RAG) over institute remedial worksheets and past tests. | Custom fine-tuned Small Language Model (SLM) specialized in Indian exam pedagogy. |
| **Reporting & Alerts** | Role-based dashboard & on-demand downloadable PDF progress cards. | Automated WhatsApp Business API progress alerts to parents. | Automated voice call synthesis / interactive IVR for urgent attendance flags. |
