# 🚀 Production Deployment Guide: Vercel + Render + Supabase

> **Platform Architecture**:
> - **Frontend**: **Vercel** (Next.js 14 App Router, Edge CDN, PWA)
> - **Backend**: **Render** (FastAPI, Gunicorn/Uvicorn, Python 3.11)
> - **Database**: **Supabase** (Managed PostgreSQL, Row-Level Security, Tenant Isolation)

---

## 📋 Architectural Flow

```
   ┌─────────────────────────────────────────────────────────────┐
   │                   VERCEL (Frontend PWA)                     │
   │            https://intelliprivart.vercel.app                │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ HTTPS REST / Bearer JWT
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                   RENDER (FastAPI Backend)                  │
   │       https://intelliprivart-backend.onrender.com           │
   │    • 2PL IRT Ability Estimation                             │
   │    • Bayesian Knowledge Tracing Topic Heatmap               │
   │    • Conformal [P10, P90] Quantile Predictions              │
   │    • Zero-Shaming Bilingual NLG Digest                      │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ PostgreSQL (SSL: Require)
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                  SUPABASE (Managed Postgres)                │
   │   • 3 Institutes (Patna, Kota, Lucknow)                     │
   │   • 1,200 Students, 12 Batches, 300 IRT Questions           │
   │   • DPDP Act Section 9 Guardian Consent Register            │
   └─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Set Up Supabase (Database)

1. Navigate to [**supabase.com**](https://supabase.com) and sign in.
2. Click **"New Project"**, name it `intelliprivart-db`, choose a region near India (e.g. Singapore `ap-southeast-1`), and set a secure database password.
3. Once initialized, navigate to **Project Settings** (gear icon) &rarr; **Database** &rarr; **Connection string**.
4. Select the **URI** tab. It will look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
   *(Or direct: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)*

### Initialize Tables and Data:
You have two simple options:

#### Option A: Run the SQL Script in Supabase Dashboard (Fastest — 1 Minute)
1. In your Supabase Dashboard, open the **SQL Editor** tab from the left sidebar.
2. Click **"New query"**.
3. Copy the entire contents of [`docs/supabase_schema.sql`](file:///c:/Users/aryan/OneDrive/Desktop/Data%20Moat/docs/supabase_schema.sql) and paste it into the editor.
4. Click **Run**.
5. All 14 tables, indexes, and initial institutes/users are instantly created!

#### Option B: Run the Python Seed Script
```bash
python scripts/seed_supabase.py "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

---

## Step 2: Deploy Backend to Render

1. Navigate to [**render.com**](https://render.com) and sign in.
2. Click **"New +"** &rarr; **"Web Service"**.
3. Connect your GitHub repository: `https://github.com/codewithanmol-26/Intelliparivart`.
4. Fill in the service configuration:
   - **Name**: `intelliprivart-backend`
   - **Region**: Choose closest (e.g. Singapore or Oregon)
   - **Branch**: `main`
   - **Root Directory**: *(Leave blank)*
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**:
     ```bash
     gunicorn -w 2 -k uvicorn.workers.UvicornWorker backend.app.main:app --bind 0.0.0.0:$PORT
     ```
   - **Plan**: `Free`
5. Under **Environment Variables**, add the following:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres` | Your Supabase URI from Step 1 |
   | `ENVIRONMENT` | `production` | Enables production mode |
   | `PYTHON_VERSION` | `3.11.9` | Recommended Python version |
   | `JWT_SECRET_KEY` | `any-secure-random-32-char-string` | Used to sign auth tokens |

6. Click **"Deploy Web Service"**.
7. Render will build and deploy the backend. Once active, copy your Render URL:
   `https://intelliprivart-backend.onrender.com`
   *(Verify by visiting `https://intelliprivart-backend.onrender.com/api/health` — it will return `{"status": "online"}`)*

---

## Step 3: Deploy Frontend to Vercel

1. Navigate to [**vercel.com**](https://vercel.com) and sign in.
2. Click **"Add New..."** &rarr; **"Project"**.
3. Import your GitHub repository: `codewithanmol-26/Intelliparivart`.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and select **`frontend`**
   - **Build Command**: `npm run build` *(Default)*
   - **Output Directory**: `.next` *(Default)*
5. Open the **Environment Variables** section and add:
   | Key | Value |
   | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://intelliprivart-backend.onrender.com/api` |

   *(Replace with your actual Render URL from Step 2, appending `/api`)*

6. Click **"Deploy"**.
7. Vercel will install dependencies, compile the 16 pages, and assign an SSL URL (e.g. `https://intelliprivart.vercel.app`).

---

## Step 4: Verification Checklist

Once deployed:

1. **Open Frontend**: Navigate to your Vercel URL.
2. **Health Indicator**: Verify the green "API Online" badge on the top banner.
3. **Login Test**: Click **Sign In** or go to `/login`. Click **"Launch"** on any 1-Click Demo Persona (e.g. Dr. S. K. Narayan - Owner).
4. **Data Verification**:
   - Navigate to `/mastery`: Confirm topic mastery percentages load live from Supabase.
   - Navigate to `/risk`: Confirm prioritized at-risk students are displayed.
   - Navigate to `/reports`: Toggle between English and Hindi to verify deterministic parent digests.
   - Navigate to `/demo-tools`: Test the live-change sliders and curveball scenarios.
