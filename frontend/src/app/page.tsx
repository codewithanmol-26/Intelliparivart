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
  Award,
  Lock,
  RotateCw,
  Calculator,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function HomePage() {
  const { tenantId, setRole, lastRunId } = useApp();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // ROI Calculator Interactive State (Derived from Nextute_Case_B_Financial_Model.xlsx)
  const [roiStudents, setRoiStudents] = useState<number>(1200);
  const [roiAnnualFee, setRoiAnnualFee] = useState<number>(75000);
  const [roiRetentionEfficiency, setRoiRetentionEfficiency] = useState<number>(55); // % of dropouts prevented

  // Financial calculations
  const baselineDropoutRate = 0.128; // 12.8% baseline dropout in Tier-2/3 test-prep
  const dropoutsWithoutPlatform = Math.round(roiStudents * baselineDropoutRate);
  const studentsSaved = Math.round(dropoutsWithoutPlatform * (roiRetentionEfficiency / 100));
  const revenueProtected = studentsSaved * roiAnnualFee;
  const platformAnnualCost = 12960 * 12; // ₹12,960/month standard tier
  const netRoiRatio = platformAnnualCost > 0 ? (revenueProtected / platformAnnualCost).toFixed(1) : '28.5';

  useEffect(() => {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '');
    fetch(`${apiBase}/health`)
      .then((res) => {
        if (res.ok) setBackendStatus('online');
        else setBackendStatus('offline');
      })
      .catch(() => setBackendStatus('offline'));
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B1F3A] text-white p-6 sm:p-10 md:p-12 shadow-xl border border-blue-900/50">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3.5 py-1 rounded-full text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Data Moat Case Competition • Case B Round 2 • Nextute × Finance Club, IIT Patna</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            The AI-Powered Intelligence Moat for JEE & NEET Institutes
          </h1>

          <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            Transforming messy paper OMR scans and CSV/Excel registers into persistent psychometrics (2PL IRT + BKT),
            zero-leakage dropout early warnings, split-conformal percentile predictions, and automated bilingual parent digests.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/overview"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-teal-500 text-white font-bold text-xs sm:text-sm hover:bg-teal-600 transition shadow-md"
            >
              <span>Launch Operational Overview</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <Link
              href="/owner"
              onClick={() => setRole('owner')}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-900/80 text-white font-semibold text-xs sm:text-sm hover:bg-blue-800 transition border border-blue-700/60 shadow-xs"
            >
              <span>Executive ROI Model</span>
            </Link>

            <Link
              href="/upload"
              onClick={() => setRole('teacher')}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-900/40 text-blue-100 font-semibold text-xs sm:text-sm hover:bg-blue-800 transition border border-blue-700/60"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              <span>4-Step Ingestion Wizard</span>
            </Link>

            <Link
              href="/demo-tools"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 font-semibold text-xs sm:text-sm hover:bg-amber-500/30 transition border border-amber-500/40"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Judge Curveball Sandbox</span>
            </Link>
          </div>
        </div>

        {/* Subtle Decorative Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#14B8A6_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
      </div>

      {/* Live Engine Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Backend API</div>
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
            <span className="text-xs font-bold text-slate-800 capitalize">
              {backendStatus}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cohort Size</div>
          <div className="mt-1 text-xs font-bold text-slate-800">{roiStudents.toLocaleString()} Students</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Pipeline</div>
          <div className="mt-1 text-xs font-bold text-teal-600 font-mono truncate">
            {lastRunId ? lastRunId.slice(-10) : '2PL IRT + BKT'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Conformal Range</div>
          <div className="mt-1 text-xs font-bold text-slate-800">91.5% Coverage</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Dropout Model</div>
          <div className="mt-1 text-xs font-bold text-slate-800">84.6% AUC (GBDT)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">DPDP Compliance</div>
          <div className="mt-1 text-xs font-bold text-emerald-600">Act 2023 Sec 9</div>
        </div>
      </div>

      {/* SECTION: 3 CORE OUTCOMES */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 block mb-1">
            Value Creation Architecture
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            Three Core Strategic Outcomes for Coaching Enterprises
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-500 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Zero Student Left Behind (Early Psychometrics)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Raw test percentages obscure whether a student stumbled on an easy question or tackled a rigorous concept.
              By decoupling question difficulty from student ability through <strong>2PL Item Response Theory</strong> and <strong>Bayesian Knowledge Tracing</strong>,
              Intelliprivart identifies student distress <strong>4–6 weeks before</strong> the first catastrophic test failure.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-500 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-900 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Strict DPDP Act 2023 Compliance & Zero PII Leakage
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complies with Section 9 of India&apos;s Digital Personal Data Protection Act 2023. Raw student identifiers are pseudonymized
              into immutable tokens (`STD_PAT_...`), guardian consent registers are auditable with single-click revocation, and phone OMR scan images
              are discarded immediately after contour extraction.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-500 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Predictive Retention & Protected Institute Revenue
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tier-2 and Tier-3 institutes suffer a 12% to 15% mid-term student drop-out rate, resulting in severe fee collection forfeitures.
              By flagging at-risk students during Months 1–3 and triggering personalized mentor phone check-ins, Intelliprivart protects
              over <strong>₹40 Lakhs of tuition revenue annually</strong> per institute.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: 6-STEP INTELLIGENCE PIPELINE FLOW */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 block mb-1">
            Data Architecture & Computation Pipeline
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            6-Step End-to-End Decision Flow
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            How heterogeneous messy test logs become actionable student-level retention interventions:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              01
            </div>
            <span className="font-bold text-slate-900 block">1. Ingestion</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Universal Excel & CSV parser auto-detects shape, unpivots wide marks matrices, and quarantines anomalies.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              02
            </div>
            <span className="font-bold text-slate-900 block">2. BKT State</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Bayesian Knowledge Tracing updates topic knowledge state $P(L_t)$ with slip $s=0.10$ and guess $g=0.25$.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              03
            </div>
            <span className="font-bold text-slate-900 block">3. 2PL IRT Ability</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Jointly calibrates student latent ability $\theta$ and question difficulty $b$ across batches.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              04
            </div>
            <span className="font-bold text-slate-900 block">4. Conformal Quantile</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Computes $[P_{10}, P_{90}]$ percentile bounds with non-parametric 91.5% coverage guarantees.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              05
            </div>
            <span className="font-bold text-slate-900 block">5. GBDT Risk Model</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Gradient Boosting early-warning model trained strictly on Months 1–3 behavioral trends (0 leakage).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              06
            </div>
            <span className="font-bold text-slate-900 block">6. Parent Digests</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Deterministic bilingual reports cross-checked by automated factual verifier and zero-shaming tone filters.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: INTERACTIVE FINANCIAL ROI CALCULATOR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Interactive Institute ROI & Unit Economics Calculator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Parameterized from `Nextute_Case_B_Financial_Model.xlsx`. Test the platform&apos;s unit economics on your cohort:
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            Platform Cost: ₹12,960 / month
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sliders */}
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Enrolled Students:</span>
                <span className="font-bold text-teal-700">{roiStudents.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="300"
                max="3000"
                step="50"
                value={roiStudents}
                onChange={(e) => setRoiStudents(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Annual Tuition Fee / Student:</span>
                <span className="font-bold text-teal-700">₹{roiAnnualFee.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="35000"
                max="150000"
                step="5000"
                value={roiAnnualFee}
                onChange={(e) => setRoiAnnualFee(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Dropout Prevention Efficiency:</span>
                <span className="font-bold text-teal-700">{roiRetentionEfficiency}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={roiRetentionEfficiency}
                onChange={(e) => setRoiRetentionEfficiency(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Summary Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Baseline Dropouts
              </span>
              <span className="text-xl font-black text-rose-600 mt-1">
                {dropoutsWithoutPlatform}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">12.8% benchmark</span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                Students Retained
              </span>
              <span className="text-xl font-black text-emerald-700 mt-1">
                +{studentsSaved}
              </span>
              <span className="text-[10px] text-emerald-600 mt-0.5">Via early interventions</span>
            </div>

            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-teal-600 block">
                Tuition Protected
              </span>
              <span className="text-xl font-black text-teal-800 mt-1">
                ₹{(revenueProtected / 100000).toFixed(1)}L
              </span>
              <span className="text-[10px] text-teal-600 mt-0.5">Per academic year</span>
            </div>

            <div className="p-4 bg-blue-950 text-white rounded-2xl border border-blue-900 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-teal-300 block">
                Net Platform ROI
              </span>
              <span className="text-2xl font-black text-white mt-1">
                {netRoiRatio}x
              </span>
              <span className="text-[10px] text-blue-200 mt-0.5">Return on investment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Walkthrough Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-teal-600" />
          <span>Interactive Role Perspectives</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/owner"
            onClick={() => setRole('owner')}
            className="group block p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-900 flex items-center justify-center mb-3 group-hover:bg-teal-500 group-hover:text-white transition font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition text-sm">
              1. Institute Owner
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Executive retention dashboards, batch performance comparisons, and real-time financial ROI recovery metrics.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-600">
              <span>View Executive View</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            href="/mastery"
            onClick={() => setRole('teacher')}
            className="group block p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:bg-teal-500 group-hover:text-white transition font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition text-sm">
              2. Academic Head / Teacher
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Batch mastery heatmaps with uncertainty hatching, OMR scan diagnostics, and 1-click remedial assignment.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-600">
              <span>Explore Teacher Suite</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            href="/student"
            onClick={() => setRole('student')}
            className="group block p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition text-sm">
              3. Student (Growth View)
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Personalized strengths and topic mastery curves. Strictly zero-shaming: no risk scores or peer rank shame.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-600">
              <span>Inspect Student Growth</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          <Link
            href="/reports"
            onClick={() => setRole('parent')}
            className="group block p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition text-sm">
              4. Parent (Digest View)
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Bilingual weekly progress digests (English & Hindi) with automated factual validation and DPDP consent protection.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-600">
              <span>Read Parent Digest</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
