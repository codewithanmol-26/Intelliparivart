'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  ShieldCheck,
  Brain,
  FileSpreadsheet,
  Camera,
  Users,
  ChevronRight,
  Database,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Award
} from 'lucide-react';

export default function HomePage() {
  const { tenantId, setRole } = useApp();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [stats, setStats] = useState({
    students: 1200,
    institutes: 3,
    questions: 300,
    tests: 16,
    accuracy: '84.6% AUC',
    unitCost: '₹3.40 / mo',
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/health')
      .then((res) => {
        if (res.ok) setBackendStatus('online');
        else setBackendStatus('offline');
      })
      .catch(() => setBackendStatus('offline'));
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0B1F3A] text-white p-8 sm:p-10 shadow-lg border border-blue-900/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nextute EdTech × Finance Club, IIT Patna | Case B Round 2</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            The AI-Powered Intelligence & Retention Moat for JEE/NEET Institutes
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Transforming messy OMRs, CSV registers, and fee logs into psychometric mastery models (2PL IRT + BKT),
            zero-leakage dropout early warnings, split-conformal percentile predictions, and automated bilingual parent digests.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/owner"
              onClick={() => setRole('owner')}
              className="inline-flex items-center px-4 py-2.5 rounded-lg bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition shadow-sm"
            >
              <span>Explore Owner Executive ROI</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/upload"
              onClick={() => setRole('teacher')}
              className="inline-flex items-center px-4 py-2.5 rounded-lg bg-blue-900/60 text-blue-100 font-medium text-sm hover:bg-blue-800/80 transition border border-blue-700/50"
            >
              <span>Ingestion & OMR Scanner</span>
            </Link>
            <Link
              href="/demo-tools"
              className="inline-flex items-center px-4 py-2.5 rounded-lg bg-amber-500/20 text-amber-300 font-medium text-sm hover:bg-amber-500/30 transition border border-amber-500/30"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Judge Curveball Sandbox</span>
            </Link>
          </div>
        </div>

        {/* Decorative Grid Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#14B8A6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      </div>

      {/* Live System Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Backend API</div>
          <div className="mt-1 flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                backendStatus === 'online'
                  ? 'bg-emerald-500'
                  : backendStatus === 'checking'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-sm font-bold text-slate-800 capitalize">
              {backendStatus}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Synthetic Cohort</div>
          <div className="mt-1 text-sm font-bold text-slate-800">{stats.students} Students</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Tenants Active</div>
          <div className="mt-1 text-sm font-bold text-slate-800">{stats.institutes} Institutes</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Psychometrics</div>
          <div className="mt-1 text-sm font-bold text-teal-600">2PL IRT + BKT</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Dropout Model</div>
          <div className="mt-1 text-sm font-bold text-slate-800">{stats.accuracy}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Unit Compute</div>
          <div className="mt-1 text-sm font-bold text-slate-800">{stats.unitCost}</div>
        </div>
      </div>

      {/* Role Navigation Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-teal-600" />
          <span>Interactive Role-Based Walkthroughs</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Owner Card */}
          <Link
            href="/owner"
            onClick={() => setRole('owner')}
            className="group block p-5 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-900 flex items-center justify-center mb-3 group-hover:bg-teal-500 group-hover:text-white transition">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition">
              1. Institute Owner
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Executive retention dashboards, batch performance comparisons, and real-time financial ROI calculator (₹2.88L fee recovery per cohort).
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-teal-600">
              <span>View Executive View</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Teacher Card */}
          <Link
            href="/mastery"
            onClick={() => setRole('teacher')}
            className="group block p-5 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:bg-teal-500 group-hover:text-white transition">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition">
              2. Academic Head / Teacher
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              OMR bubble scanning, quarantine review queue, topic mastery heatmap with uncertainty hatching, and targeted remedial assignment.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-teal-600">
              <span>Explore Teacher Suite</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Student Card */}
          <Link
            href="/student"
            onClick={() => setRole('student')}
            className="group block p-5 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition">
              3. Student (Growth View)
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Personalized strengths and mastery progress. Strictly zero-shaming design: no risk scores or public peer rank comparisons.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-teal-600">
              <span>Inspect Student Growth</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Parent Card */}
          <Link
            href="/reports"
            onClick={() => setRole('parent')}
            className="group block p-5 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition">
              4. Parent (Digest View)
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Automated bilingual progress digests (English & Hindi) with factual consistency verification and zero negative judgment guardrails.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-teal-600">
              <span>Read Parent Digest</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>
        </div>
      </div>

      {/* The 7 Core Architectural Pillars */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Core Technical Capabilities Evaluated in Case B
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="font-bold text-slate-800 flex items-center mb-1">
              <Camera className="w-4 h-4 mr-1.5 text-teal-600" />
              1. Multi-Format Ingestion & OMR
            </div>
            CSV, Excel & phone camera OMR with OpenCV bubble contour detection, blur/skew diagnostics, and Quarantine Review Queue.
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="font-bold text-slate-800 flex items-center mb-1">
              <Brain className="w-4 h-4 mr-1.5 text-teal-600" />
              2. Dual-Engine Psychometrics
            </div>
            2PL Item Response Theory (MAP estimation, c=0.10) combined with Bayesian Knowledge Tracing for topic-level mastery.
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="font-bold text-slate-800 flex items-center mb-1">
              <TrendingUp className="w-4 h-4 mr-1.5 text-teal-600" />
              3. Conformal Percentile Prediction
            </div>
            Split-conformal quantile forecasting [P10, P90] with contraction as the academic year progresses from Month 2 to Month 8.
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="font-bold text-slate-800 flex items-center mb-1">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-teal-600" />
              4. Zero-Leakage Dropout Early Warning
            </div>
            Gradient Boosting & Logistic Regression trained strictly on Months 1–3 behavioral markers to intervene before students fall behind.
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="font-bold text-slate-800 flex items-center mb-1">
              <Database className="w-4 h-4 mr-1.5 text-teal-600" />
              5. DPDP Act 2023 & Multi-Tenancy
            </div>
            Mandatory tenant isolation on all queries, guardian consent registry, purpose specification, and single-click revocation.
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="font-bold text-slate-800 flex items-center mb-1">
              <Sparkles className="w-4 h-4 mr-1.5 text-teal-600" />
              6. Low-Cost Deterministic NLG
            </div>
            Template-based English & Hindi digests with automated factual verification and zero-shaming tone filters (₹0.00 LLM token cost).
          </div>
        </div>
      </div>
    </div>
  );
}
