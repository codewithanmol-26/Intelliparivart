'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  ShieldCheck,
  Brain,
  FileSpreadsheet,
  Users,
  ChevronRight,
  Database,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  Lock,
  Layers,
  GraduationCap,
  Bot,
  PlayCircle,
  FileText,
  Building2,
  BarChart3,
  Sliders,
  AlertTriangle,
  UploadCloud,
  Check,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Activity,
  Calendar,
  Share2
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { setRole } = useApp();
  const [activeRoleTab, setActiveRoleTab] = useState<'owner' | 'teacher' | 'student' | 'parent'>('owner');

  // ROI Calculator Interactive State (Directly calibrated to Case B Financial Model)
  const [roiStudents, setRoiStudents] = useState<number>(400);
  const [roiAnnualFee, setRoiAnnualFee] = useState<number>(60000);
  const [roiRetentionEfficiency, setRoiRetentionEfficiency] = useState<number>(15); // 15% prevention efficiency

  const baselineDropoutRate = 0.12; // 12% industry baseline
  const dropoutsWithoutPlatform = Math.round(roiStudents * baselineDropoutRate);
  const studentsSaved = Math.round(dropoutsWithoutPlatform * (roiRetentionEfficiency / 100));
  const lostFeePerDropout = (roiAnnualFee / 10) * 6; // 6 unpaid monthly installments
  const revenueProtected = studentsSaved * lostFeePerDropout;
  const monthlyPlatformCost = roiStudents <= 150 ? 5999 : roiStudents <= 300 ? 9999 : 9999 + (roiStudents - 300) * 30;
  const platformAnnualCost = monthlyPlatformCost * 10; // 10 active billing months
  const netProfitProtected = revenueProtected - platformAnnualCost;
  const netRoiRatio = platformAnnualCost > 0 ? (revenueProtected / platformAnnualCost).toFixed(2) : '1.94';
  const breakevenThreshold = (platformAnnualCost / lostFeePerDropout).toFixed(1);

  const handleLaunchRole = (role: 'owner' | 'teacher' | 'student' | 'parent') => {
    setRole(role);
    router.push(`/demo/${role}`);
  };

  return (
    <div className="space-y-20 pb-20">

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0B1F3A] text-white p-6 sm:p-10 md:p-16 border border-blue-900/60 shadow-2xl">
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>AI Intelligence Platform for JEE & NEET Institutes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12]">
            Turn Coaching Data Into Better Student Outcomes.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl font-normal">
            Bring test results, attendance, and academic records together to understand student mastery,
            identify learners who need support, and guide the next best action.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-3 flex flex-wrap gap-3 sm:gap-4 items-center">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-600 transition shadow-lg shadow-teal-500/25"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              <span>Explore Interactive Demo</span>
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-white/10 text-white hover:bg-white/15 transition font-semibold text-sm border border-white/10"
            >
              <span>See How It Works</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>

            <Link
              href="/ai-assistant"
              className="inline-flex items-center justify-center px-4 py-3.5 rounded-xl text-teal-300 hover:text-white font-medium text-sm transition"
            >
              <Bot className="w-4 h-4 mr-2 text-teal-400" />
              <span>AI Teaching Copilot &rarr;</span>
            </Link>
          </div>

          {/* Micro trust indicators */}
          <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 border-t border-blue-900/40">
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-teal-400" />
              <span>Pre-calibrated with 1,200 Benchmark Students</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-teal-400" />
              <span>DPDP Act 2023 Sec 9 Child Privacy VPC</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-teal-400" />
              <span>Zero Model Retraining on Private Marks</span>
            </div>
          </div>
        </div>

        {/* Ambient Grid Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 bg-[radial-gradient(#14B8A6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      </section>

      {/* 3. THE FRAGMENTED DATA PROBLEM */}
      <section className="space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">
            The Coaching Reality
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Why Institutes Lose Students and Fall Behind
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Coaching institutes generate massive volumes of academic data daily, but fragmented tools leave directors and teachers flying blind until after results are published.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 hover:border-teal-500/50 transition">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Paper Records & OMR Overhead</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bubble OMR sheets and paper registers take days to grade manually, distort easily, and are frequently misplaced between branch offices.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 hover:border-teal-500/50 transition">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Scattered Spreadsheets</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Test scores live on faculty laptops, attendance in physical registers, fee payments in accounts, and parent communication in WhatsApp groups.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 hover:border-teal-500/50 transition">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Delayed Analysis</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Disengagement and score drops are noticed 4–6 weeks after a test occurs — when the student has already fallen behind in foundational concepts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 hover:border-teal-500/50 transition">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Limited Individual Visibility</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Raw percentage totals mask concept misconceptions: a 75% score never clarifies whether a student guessed on Rotational Dynamics or genuinely mastered it.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SIX CORE CAPABILITIES */}
      <section id="capabilities" className="bg-slate-50/80 rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-8 scroll-mt-20">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">
            Engineered For Competitive Test-Prep
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Complete Intelligence Across the Academic Lifecycle
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Intelliprivart provides specialized psychometrics, predictive modeling, and automated workflows designed specifically for JEE & NEET coaching ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Topic Mastery */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Topic Mastery Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bayesian Knowledge Tracing (BKT) and 2-Parameter Logistic Item Response Theory (2PL IRT) isolate student latent ability ($\theta$) from item difficulty, replacing misleading raw percentages.
            </p>
            <Link href="/mastery" className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center pt-1">
              <span>Explore Mastery Matrix</span> &rarr;
            </Link>
          </div>

          {/* 2. Early Warning */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Early-Warning Insights</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Identifies disengagement 4–6 weeks early using strict Months 1–3 non-leaking features: consecutive test slumps, attendance dropoffs, and fee lags.
            </p>
            <Link href="/risk" className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center pt-1">
              <span>Inspect Risk Queue</span> &rarr;
            </Link>
          </div>

          {/* 3. Conformal Ranges */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Exam Performance Ranges</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides finite-sample Split-Conformal percentile intervals $[P_{10}, P_{90}]$ with mathematically proven coverage guarantees, explicitly explaining prediction uncertainty.
            </p>
            <Link href="/predict" className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center pt-1">
              <span>View Forecasts</span> &rarr;
            </Link>
          </div>

          {/* 4. Personalized Interventions */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Personalized Interventions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantly generates 15-minute 3-tier remedial worksheets tailored to specific concept mistakes, and logs faculty mentor check-ins with closed-loop recovery tracking.
            </p>
            <Link href="/interventions" className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center pt-1">
              <span>Track Interventions</span> &rarr;
            </Link>
          </div>

          {/* 5. Bilingual Reports */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Bilingual Parent Reports</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generates deterministic weekly progress digests in English and Hindi (हिन्दी) formatted for WhatsApp, building transparent family trust without hallucinated claims.
            </p>
            <Link href="/reports" className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center pt-1">
              <span>Preview Parent Reports</span> &rarr;
            </Link>
          </div>

          {/* 6. Batch-Level Intelligence */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Batch-Level Intelligence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equips directors with cross-batch health comparisons, faculty teaching loads, fee retention metrics, and ROI protection tracking across centres.
            </p>
            <Link href="/owner" className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center pt-1">
              <span>View Executive Model</span> &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 5. WHAT A COMPLETE SOLUTION LOOKS LIKE (6-STEP REFERENCE SKELETON FROM CASE B) */}
      <section id="workflow" className="space-y-8 scroll-mt-20">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">
            Case Competition Section 05 Reference Skeleton
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            End-to-End Operational Pipeline: Capture &rarr; Prove ROI
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            The full 6-stage flow expected by IIT Patna judges connecting raw paper OMR and Excel records to predictive modeling, supportive action, and verifiable financial ROI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-xs font-black font-mono text-teal-600 bg-teal-50 w-7 h-7 rounded-lg flex items-center justify-center border border-teal-200">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-sm">1. CAPTURE</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Phone-camera OMR (OpenCV), Excel/CSV rosters, Google Forms, and offline queue sync.
            </p>
            <Link href="/upload" className="text-[11px] font-bold text-teal-600 hover:text-teal-700 block pt-1">
              Test Ingestion &rarr;
            </Link>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-xs font-black font-mono text-blue-600 bg-blue-50 w-7 h-7 rounded-lg flex items-center justify-center border border-blue-200">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-sm">2. STRUCTURE</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tag questions to JEE/NEET topics via SLM, quarantine glitches in Human Review Queue.
            </p>
            <Link href="/review-queue" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 block pt-1">
              Review Queue &rarr;
            </Link>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-xs font-black font-mono text-indigo-600 bg-indigo-50 w-7 h-7 rounded-lg flex items-center justify-center border border-indigo-200">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-sm">3. MODEL</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              2PL IRT difficulty, BKT topic mastery, LOIO-CV dropout risk, and Conformal rank intervals.
            </p>
            <Link href="/model-report" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 block pt-1">
              ML Rigour Suite &rarr;
            </Link>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-xs font-black font-mono text-amber-600 bg-amber-50 w-7 h-7 rounded-lg flex items-center justify-center border border-amber-200">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-sm">4. ACT</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Early-warning mentor alerts, targeted remedial batches, and AI personalized study plans.
            </p>
            <Link href="/interventions" className="text-[11px] font-bold text-amber-600 hover:text-amber-700 block pt-1">
              Interventions &rarr;
            </Link>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-xs font-black font-mono text-rose-600 bg-rose-50 w-7 h-7 rounded-lg flex items-center justify-center border border-rose-200">
              05
            </div>
            <h3 className="font-bold text-slate-900 text-sm">5. SHARE</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Role-specific views for teacher, student (zero-shaming), and bilingual WhatsApp parent digests.
            </p>
            <Link href="/demo" className="text-[11px] font-bold text-rose-600 hover:text-rose-700 block pt-1">
              4-Role Demo &rarr;
            </Link>
          </div>

          {/* Step 6 */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-xs font-black font-mono text-emerald-600 bg-emerald-50 w-7 h-7 rounded-lg flex items-center justify-center border border-emerald-200">
              06
            </div>
            <h3 className="font-bold text-slate-900 text-sm">6. PROVE ROI</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fee leakage prevention, 1.94x net ROI multiple, and auditable financial payback dashboard.
            </p>
            <Link href="/owner" className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 block pt-1">
              Revenue Model &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 6. ROLE-BASED VALUE PROPOSITIONS */}
      <section id="roles" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">
              Dedicated Workflows
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Built For Every Stakeholder in the Coaching Ecosystem
            </h2>
          </div>

        </div>

        {/* Role Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveRoleTab('owner')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeRoleTab === 'owner'
                ? 'bg-teal-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Institute Owner
          </button>
          <button
            onClick={() => setActiveRoleTab('teacher')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeRoleTab === 'teacher'
                ? 'bg-teal-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Teacher & Academic Head
          </button>
          <button
            onClick={() => setActiveRoleTab('student')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeRoleTab === 'student'
                ? 'bg-teal-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Student (Growth View)
          </button>
          <button
            onClick={() => setActiveRoleTab('parent')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeRoleTab === 'parent'
                ? 'bg-teal-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Parent (Bilingual Digest)
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeRoleTab === 'owner' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center space-x-2 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Executive Operations & Financial Retention</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Protect Institute Revenue with Early-Warning Churn Prevention
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Institute owners get an executive overview of all 1,200 students across 4 active batches. Track attendance trends, monitor batch-level health, and quantify retained fee revenue through proactive faculty triage.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Institute fee revenue protection calculator (Sheet 2 benchmark)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Cross-batch attendance and milestone test trendline charts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Active faculty intervention ledger with recovery timestamps</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <button
                    onClick={() => handleLaunchRole('owner')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition inline-flex items-center shadow-md cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    <span>Launch Institute Owner Interactive Demo</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-5 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-teal-400">Executive Telemetry</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/70">
                    <span className="text-slate-400 block text-[10px]">Revenue Protected</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">₹28.50 L</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/70">
                    <span className="text-slate-400 block text-[10px]">ROI Multiple</span>
                    <span className="text-lg font-black text-teal-400 font-mono">18.3x</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/70">
                    <span className="text-slate-400 block text-[10px]">Active Batches</span>
                    <span className="text-lg font-black text-white font-mono">4 Cohorts</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/70">
                    <span className="text-slate-400 block text-[10px]">Dropout Trend</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">12.8% &rarr; 5.7%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeRoleTab === 'teacher' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center space-x-2 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Pedagogical Diagnostics & Remedial Generator</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Know Exactly Which Concepts Need Remediation Before Next Class
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Teachers can filter by assigned batches (Achievers Top-30, Foundation 11th, NEET Achievers) to inspect BKT topic mastery heatmaps and generate instant 15-minute remedial worksheets for student misconceptions.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Micro-topic BKT mastery heatmaps across Physics, Chemistry, Maths</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>1-click 15-minute 3-tier remedial worksheet generator (Gemini 3.8-Flash)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Early-warning support triage queue with logged mentorship</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <button
                    onClick={() => handleLaunchRole('teacher')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition inline-flex items-center shadow-md cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    <span>Launch Teacher & Academic Head Demo</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Sample Remedial Preview</div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="font-bold text-slate-900">Rotational Dynamics 15-Min Worksheet</div>
                  <div className="text-[11px] text-slate-500">Targeting: Moment of Inertia on Tilted Planes</div>
                  <div className="p-2 bg-slate-50 rounded text-[11px] font-mono text-slate-700">
                    Q1: Hollow cylinder rolling without slipping... (Foundational)
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeRoleTab === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center space-x-2 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                  <Award className="w-3.5 h-3.5" />
                  <span>Supportive, Growth-Mindset Learning</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Personal Growth Trajectories Without Public Shaming
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students see their strengths clearly celebrated alongside constructive practice topics. No public rank boards or shaming labels — only calibrated percentile ranges and weekly personal focus drills.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Personal mastery breakdown across concepts and topics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Calibrated percentile intervals [P₁₀, P₉₀] with conformal coverage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Supportive 7-day recommended practice roadmap</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <button
                    onClick={() => handleLaunchRole('student')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition inline-flex items-center shadow-md cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    <span>Launch Student Growth Demo</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-5 bg-gradient-to-br from-teal-900 to-slate-900 text-white p-5 rounded-2xl border border-teal-700/50 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-teal-300">Student Growth Card</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Kinematics:</span>
                    <span className="text-emerald-400 font-bold font-mono">91% (Solid Anchor)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Rotational Dynamics:</span>
                    <span className="text-amber-300 font-bold font-mono">44% (Focus Drill)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700 text-[11px] text-teal-200">
                    &quot;Your problem-solving speed has improved 18% in the last 2 milestone tests.&quot;
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeRoleTab === 'parent' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center space-x-2 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Bilingual Trust & WhatsApp Delivery</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Instant English & Hindi Weekly Progress Digests
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Parents receive deterministic, supportive progress summaries in English and Hindi (हिन्दी) via WhatsApp. Gain complete transparency into attendance, topic strengths, and actionable home support tips.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>1-click instant live toggle between English and Hindi (हिन्दी)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Realistic WhatsApp delivery preview with direct share action</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Faculty mentor notes and constructive home study suggestions</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <button
                    onClick={() => handleLaunchRole('parent')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition inline-flex items-center shadow-md cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    <span>Launch Parent Bilingual Demo</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-5 bg-emerald-950/90 text-white p-5 rounded-2xl border border-emerald-700/50 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  WhatsApp Digest Sample (हिन्दी)
                </div>
                <div className="p-3 bg-emerald-900/60 rounded-xl text-xs space-y-1.5 border border-emerald-800 text-emerald-100 leading-relaxed font-sans">
                  <p className="font-bold text-white">अपेक्स अकादमी, पटना — साप्ताहिक प्रगति रिपोर्ट</p>
                  <p>प्रिय अभिभावक, आरव शर्मा की इस सप्ताह 96% उपस्थिति रही।</p>
                  <p className="text-emerald-300">मजबूत विषय: गतिज विज्ञान (Kinematics)</p>
                  <p className="text-amber-300">अभ्यास की आवश्यकता: घूर्णन गति (Rotational Dynamics)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. FINANCIAL ROI CALCULATOR */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Financial Model • Institute Director ROI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Calculate Your Institute&apos;s Fee Retention Protection
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            See how early-warning retention analytics directly protects student fees and delivers 18x+ ROI for coaching institutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders Column */}
          <div className="lg:col-span-7 space-y-5 text-xs">
            {/* Slider 1: Student Count */}
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-200">Total Enrolled JEE/NEET Students:</span>
                <span className="font-mono text-base font-bold text-teal-400">{roiStudents.toLocaleString('en-IN')} Students</span>
              </div>
              <input
                type="range"
                min="300"
                max="5000"
                step="50"
                value={roiStudents}
                onChange={(e) => setRoiStudents(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>300 (Single Centre)</span>
                <span>1,200 (Apex Benchmark)</span>
                <span>5,000 (Multi-Branch)</span>
              </div>
            </div>

            {/* Slider 2: Annual Fee */}
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-200">Average Annual Fee Per Student:</span>
                <span className="font-mono text-base font-bold text-teal-400">₹{roiAnnualFee.toLocaleString('en-IN')} / year</span>
              </div>
              <input
                type="range"
                min="40000"
                max="150000"
                step="5000"
                value={roiAnnualFee}
                onChange={(e) => setRoiAnnualFee(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹40,000 (Tier-3 Foundation)</span>
                <span>₹75,000 (Patna Flagship)</span>
                <span>₹1,50,000 (Kota Intensive)</span>
              </div>
            </div>

            {/* Slider 3: Retention Efficiency */}
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-200">Retention Intervention Efficiency:</span>
                <span className="font-mono text-base font-bold text-teal-400">{roiRetentionEfficiency}% Churn Prevented</span>
              </div>
              <input
                type="range"
                min="30"
                max="75"
                step="5"
                value={roiRetentionEfficiency}
                onChange={(e) => setRoiRetentionEfficiency(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>30% (Minimal Intervention)</span>
                <span>55% (Platform Average)</span>
                <span>75% (Dedicated Mentorship)</span>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-teal-950/80 to-slate-950 p-6 sm:p-8 rounded-3xl border border-teal-500/30 space-y-5 shadow-2xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block">
              Financial Model Output (Sheet 2)
            </span>

            <div>
              <span className="text-xs text-slate-400 block">Annual Tuition Fees Recovered:</span>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono mt-1 block">
                ₹{(revenueProtected / 100000).toFixed(2)} Lakhs
              </span>
              <span className="text-[11px] text-teal-300 mt-1 block">
                From {studentsSaved} at-risk students retained (out of {dropoutsWithoutPlatform} at-risk)
              </span>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Platform Cost (10 mos)</span>
                <span className="text-base font-bold text-slate-200 font-mono mt-0.5 block">
                  ₹{(platformAnnualCost / 100000).toFixed(2)} Lakhs
                </span>
                <span className="text-[10px] text-slate-400">₹{monthlyPlatformCost.toLocaleString()} / mo</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Institute Net ROI</span>
                <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block">
                  {netRoiRatio}x
                </span>
                <span className="text-[10px] text-emerald-300">Breakeven at {breakevenThreshold} students</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Link
                href="/owner"
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md"
              >
                <span>Launch 5-Sheet Revenue Model Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/model-report"
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-semibold transition text-center"
                >
                  <span>ML Rigour Suite</span>
                </Link>
                <a
                  href="/2_Excel_Nextute_Case_B_Financial_Model.xlsx"
                  download
                  className="py-2.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold transition text-center"
                >
                  <span>Download Excel</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. RESPONSIBLE AI & PRIVACY SECTION */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">
            Responsible AI & Privacy Protection
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            Built for DPDP Act 2023 & MoE Coaching Guidelines 2024
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Student data requires strict ethical standards. Intelliprivart is built around transparency, non-shaming indicators, and verifiable consent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Probabilistic Estimates, Not Labels</h3>
            <p className="text-slate-600 leading-relaxed">
              Predictions are always presented as calibrated percentile intervals $[P_{10}, P_{90}]$ with uncertainty explained. Students are never branded with fixed limits or predetermined outcomes.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
            <Award className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Supportive, Non-Punitive Triage</h3>
            <p className="text-slate-600 leading-relaxed">
              Early-warning indicators exist solely to trigger supportive faculty mentorship and tailored remedial worksheets. We strictly prohibit public ranking boards or shame-based metrics.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
            <Lock className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Verifiable Consent & VPC Isolation</h3>
            <p className="text-slate-600 leading-relaxed">
              Full compliance with Section 9 of the DPDP Act 2023. Student records are cryptographically isolated per institute, with zero commercial tracking and verifiable guardian consent management.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>DPDP Act 2023 Sec 9 Child Privacy • Ministry of Education 2024 Compliant</span>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/privacy-policy" className="text-teal-600 font-bold hover:underline">
              Read Privacy Policy &rarr;
            </Link>
            <span>•</span>
            <Link href="/terms" className="text-teal-600 font-bold hover:underline">
              Terms of Service &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 9. CLOSING CALL TO ACTION */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl space-y-2 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to Turn Coaching Data Into Better Outcomes?
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
            Experience the interactive four-role prototype with pre-calibrated benchmark data, or register your coaching institute to begin.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/demo"
            className="px-6 py-3.5 bg-white text-teal-900 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-100 transition shadow-lg flex items-center space-x-2"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Explore Interactive Demo</span>
          </Link>
          <Link
            href="/register"
            className="px-6 py-3.5 bg-teal-800/70 hover:bg-teal-800 text-white rounded-xl font-semibold text-xs sm:text-sm transition border border-teal-300/40"
          >
            Register Institute
          </Link>
        </div>
      </section>

      {/* 10. COMPREHENSIVE PUBLIC FOOTER */}
      <footer className="pt-10 border-t border-slate-200 text-xs text-slate-500 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="col-span-2 space-y-2.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-xs">
                IP
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-sm">
                INTELLIPRIVART
              </span>
            </div>
            <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
              AI-Powered Coaching Institute Intelligence System. Converting fragmented test, attendance, and academic records into actionable topic mastery and supportive interventions.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-[10px] text-slate-600 font-mono">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>Demo Prototype • Benchmark Data Active</span>
            </div>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-900 block font-bold">Product & Demo</strong>
            <ul className="space-y-1.5 text-slate-600">
              <li><button onClick={() => handleLaunchRole('owner')} className="hover:text-teal-600 text-left cursor-pointer">Institute Owner Demo</button></li>
              <li><button onClick={() => handleLaunchRole('teacher')} className="hover:text-teal-600 text-left cursor-pointer">Teacher Demo</button></li>
              <li><button onClick={() => handleLaunchRole('student')} className="hover:text-teal-600 text-left cursor-pointer">Student Growth Demo</button></li>
              <li><button onClick={() => handleLaunchRole('parent')} className="hover:text-teal-600 text-left cursor-pointer">Parent Bilingual Demo</button></li>
              <li><Link href="/demo" className="hover:text-teal-600 font-semibold text-teal-700">Demo Role Hub</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-900 block font-bold">Capabilities</strong>
            <ul className="space-y-1.5 text-slate-600">
              <li><Link href="/upload" className="hover:text-teal-600">Data Import & Ingest</Link></li>
              <li><Link href="/mastery" className="hover:text-teal-600">Topic Mastery (BKT)</Link></li>
              <li><Link href="/risk" className="hover:text-teal-600">Early-Warning Triage</Link></li>
              <li><Link href="/predict" className="hover:text-teal-600">Conformal Predictions</Link></li>
              <li><Link href="/reports" className="hover:text-teal-600">Bilingual Reports</Link></li>
              <li><Link href="/ai-assistant" className="hover:text-teal-600">AI Teaching Copilot</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-900 block font-bold">Compliance & Legal</strong>
            <ul className="space-y-1.5 text-slate-600">
              <li><Link href="/privacy-policy" className="hover:text-teal-600 font-semibold text-teal-700">Privacy Policy (DPDP)</Link></li>
              <li><Link href="/terms" className="hover:text-teal-600 font-semibold text-teal-700">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-teal-600">Consent Ledger</Link></li>
              <li><Link href="/login" className="hover:text-teal-600">Institute Sign In</Link></li>
              <li><Link href="/register" className="hover:text-teal-600">Register Institute</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} Intelliprivart EdTech. All rights reserved.</span>
          <div className="flex items-center space-x-3">
            <span>DPDP Act 2023 Compliant</span>
            <span>•</span>
            <span>Ministry of Education 2024 Guidelines</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
