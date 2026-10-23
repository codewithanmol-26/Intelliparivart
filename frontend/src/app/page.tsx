'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { getApiBaseUrl } from '../lib/api';
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
  GraduationCap,
  Bot,
  MessageSquare,
  FileText,
  Building2,
  BarChart3,
  Check,
  Sliders,
  ExternalLink,
  ShieldAlert,
  HelpCircle
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
    const apiBase = getApiBaseUrl();
    fetch(`${apiBase}/health`)
      .then((res) => {
        if (res.ok) setBackendStatus('online');
        else setBackendStatus('offline');
      })
      .catch(() => setBackendStatus('offline'));
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0B1F3A] text-white p-6 sm:p-10 md:p-14 shadow-2xl border border-blue-900/60">
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>The Data Moat Case Competition • Case B Round 2 • Nextute × Finance Club, IIT Patna</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15]">
            The AI-Powered Intelligence Moat for JEE & NEET Institutes
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl">
            Transform messy paper OMR scans and scattered Excel registers into persistent psychometrics (2PL IRT + BKT),
            zero-leakage dropout early warnings, split-conformal percentile predictions, and automated bilingual parent WhatsApp digests.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center">
            <Link
              href="/overview"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-teal-500 text-white font-bold text-xs sm:text-sm hover:bg-teal-600 transition shadow-lg shadow-teal-500/25"
            >
              <span>Explore Live Platform</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 transition shadow-md"
            >
              <Building2 className="w-4 h-4 mr-2 text-teal-600" />
              <span>Register Your Institute</span>
            </Link>

            <Link
              href="/ai-assistant"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-900/60 text-teal-200 font-semibold text-xs sm:text-sm hover:bg-blue-800 transition border border-teal-500/40"
            >
              <Bot className="w-4 h-4 mr-2 text-teal-400" />
              <span>AI Teaching Copilot</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-3 rounded-xl text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition"
            >
              <span>Institute Sign In &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 bg-[radial-gradient(#14B8A6_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      </section>

      {/* 2. Key Trust Metrics & System Telemetry */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Backend API</div>
          <div className="mt-1.5 flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-sm font-bold text-slate-900 capitalize font-mono">{backendStatus}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">FastAPI v2.4 (Render)</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GenAI Engine</div>
          <div className="mt-1.5 text-sm font-bold text-teal-700 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Gemini 3.8-Flash</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Pedagogical Guardrails</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Benchmark Cohort</div>
          <div className="mt-1.5 text-sm font-bold text-slate-900 font-mono">1,200 Students</div>
          <div className="text-[10px] text-slate-500 mt-1">Apex Academy, Patna</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dropout Prevention</div>
          <div className="mt-1.5 text-sm font-bold text-emerald-600 font-mono">12.8% &rarr; 5.7%</div>
          <div className="text-[10px] text-slate-500 mt-1">55% Churn Avoided</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Child Privacy</div>
          <div className="mt-1.5 text-sm font-bold text-teal-700 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>DPDP Act 2023</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Section 9 Child VPC</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Engine Run</div>
          <div className="mt-1.5 text-xs font-mono font-bold text-slate-800 truncate">
            {lastRunId ? lastRunId.slice(-8) : 'SEEDED_CALIB'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">2PL IRT + BKT State</div>
        </div>
      </section>

      {/* 3. The 8-Stage Data Moat Architecture (Interactive Pipeline) */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-teal-600 block">
              End-to-End Architectural Pipeline
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              How Intelliprivart Builds Your Institute Data Moat
            </h2>
          </div>
          <Link
            href="/overview"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
          >
            <span>View Active Operations</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Stage 1 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:border-teal-500 transition group space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Multi-Modal Ingestion</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Seamlessly processes Excel rosters, CSV gradebooks, and mobile camera OMR scans with Hough Circle bubble segmentation.
            </p>
            <Link href="/upload" className="text-[11px] font-semibold text-teal-600 group-hover:translate-x-0.5 transition inline-flex items-center pt-1">
              <span>Open Ingest Wizard</span> &rarr;
            </Link>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:border-teal-500 transition group space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Quarantine & Auto-Fix</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Failsafe verification detects duplicate roll numbers, date irregularities, and out-of-range marks before database ingestion.
            </p>
            <Link href="/review-queue" className="text-[11px] font-semibold text-teal-600 group-hover:translate-x-0.5 transition inline-flex items-center pt-1">
              <span>Inspect Review Queue</span> &rarr;
            </Link>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:border-teal-500 transition group space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">2PL IRT Psychometrics</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Separates true latent student ability ($\theta$) from lucky guesses and test difficulty, replacing naive raw percentages.
            </p>
            <Link href="/mastery" className="text-[11px] font-semibold text-teal-600 group-hover:translate-x-0.5 transition inline-flex items-center pt-1">
              <span>View Topic Mastery</span> &rarr;
            </Link>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:border-teal-500 transition group space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Early-Warning Triage</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Detects disengagement 4–6 weeks early using strict Months 1–3 non-leaking features (test absences, fee lags, slump streaks).
            </p>
            <Link href="/risk" className="text-[11px] font-semibold text-teal-600 group-hover:translate-x-0.5 transition inline-flex items-center pt-1">
              <span>Open Risk Centre</span> &rarr;
            </Link>
          </div>

          {/* Stage 5 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:border-teal-500 transition group space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
              05
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Conformal Predictions</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Finite-sample Split-Conformal prediction intervals provide rigorous $90\%$ coverage guarantees for JEE/NEET ranks.
            </p>
            <Link href="/predict" className="text-[11px] font-semibold text-teal-600 group-hover:translate-x-0.5 transition inline-flex items-center pt-1">
              <span>Forecast Trajectories</span> &rarr;
            </Link>
          </div>

          {/* Stage 6 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:border-teal-500 transition group space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              06
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">AI Remedial Worksheets</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Google Gemini 3.8-Flash analyzes error clusters to generate tailored concept cheat-sheets and 3 graded practice problems.
            </p>
            <Link href="/ai-assistant" className="text-[11px] font-semibold text-teal-600 group-hover:translate-x-0.5 transition inline-flex items-center pt-1">
              <span>Launch AI Copilot</span> &rarr;
            </Link>
          </div>

          {/* Stage 7 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:border-teal-500 transition group space-y-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs">
              07
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Bilingual Parent Digests</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Delivers deterministic, non-hallucinated weekly updates in Hindi (हिन्दी) & English via WhatsApp to build parent trust.
            </p>
            <Link href="/reports" className="text-[11px] font-semibold text-teal-600 group-hover:translate-x-0.5 transition inline-flex items-center pt-1">
              <span>View Parent Reports</span> &rarr;
            </Link>
          </div>

          {/* Stage 8 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:border-teal-500 transition group space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
              08
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Intervention Tracking</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Closes the feedback loop by logging faculty mentorship, concept remedies, and measuring subsequent score recovery.
            </p>
            <Link href="/interventions" className="text-[11px] font-semibold text-teal-600 group-hover:translate-x-0.5 transition inline-flex items-center pt-1">
              <span>Intervention Tracker</span> &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Interactive Financial ROI Calculator */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Financial Model • Nextute Case B</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Calculate Your Institute&apos;s Revenue Protection
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            See how early-warning retention analytics directly protects student fees and delivers 20x+ ROI for coaching institutes.
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
              Annual Financial Impact
            </span>

            <div>
              <span className="text-xs text-slate-400 block">Net Fee Revenue Protected:</span>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono mt-1 block">
                ₹{(revenueProtected / 100000).toFixed(2)} Lakhs
              </span>
              <span className="text-[11px] text-teal-300 mt-1 block">
                From {studentsSaved} at-risk students successfully retained
              </span>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Platform Cost</span>
                <span className="text-base font-bold text-slate-200 font-mono mt-0.5 block">
                  ₹{(platformAnnualCost / 100000).toFixed(2)} Lakhs
                </span>
                <span className="text-[10px] text-slate-500">₹12,960 / month</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Net ROI Multiple</span>
                <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block">
                  {netRoiRatio}x
                </span>
                <span className="text-[10px] text-emerald-300">Return on Investment</span>
              </div>
            </div>

            <Link
              href="/owner"
              onClick={() => setRole('owner')}
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md"
            >
              <span>View Executive Financial Model</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. DPDP Act 2023 Section 9 & Enterprise Security */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-bold tracking-wider text-teal-600 block">
            Regulatory & Statutory Compliance
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            Engineered Under the DPDP Act 2023 (Section 9)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Indian coaching institutes operate under strict scrutiny regarding child privacy and non-shaming education standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Verifiable Parental Consent (VPC)</h3>
            <p className="text-slate-600 leading-normal">
              Statutory consent manager tracks guardian authorization before automated WhatsApp digests are dispatched. Consent revocations halt outbound notifications instantaneously.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <Lock className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Zero Commercial Behavioral Profiling</h3>
            <p className="text-slate-600 leading-normal">
              In full compliance with Section 9(2), student records are never tracked for targeted advertising or shared with external data brokers. Tenant schemas are cryptographically isolated.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <Award className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Zero-Shaming Growth Trajectory</h3>
            <p className="text-slate-600 leading-normal">
              Under Section 9(3), detrimental psychological impacts are prevented by replacing public rank-shaming boards with constructive topic-mastery ladders and formative remediation.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2 text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>MeitY-Empanelled Cloud Data Sovereignty (AWS Mumbai ap-south-1)</span>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/privacy-policy" className="text-teal-600 font-bold hover:underline">
              Read Complete Privacy Policy &rarr;
            </Link>
            <span>•</span>
            <Link href="/terms" className="text-teal-600 font-bold hover:underline">
              View Terms of Service &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Ready to Deploy Call to Action */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl space-y-2 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to Protect Your Coaching Institute&apos;s Revenue?
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
            Register your institute today to unlock 2PL Item Response Theory, early dropout triage, and AI-powered remedial worksheets.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/register"
            className="px-6 py-3 bg-white text-teal-800 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-100 transition shadow-lg"
          >
            Register New Institute
          </Link>
          <Link
            href="/overview"
            className="px-6 py-3 bg-teal-800/60 hover:bg-teal-800 text-white rounded-xl font-semibold text-xs sm:text-sm transition border border-teal-300/40"
          >
            Launch Platform Tour
          </Link>
        </div>
      </section>

      {/* 7. Comprehensive Public Footer */}
      <footer className="pt-10 border-t border-slate-200 text-xs text-slate-500 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="col-span-2 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                IP
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-sm">
                INTELLIPRIVART
              </span>
            </div>
            <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
              The AI-Powered Institute Intelligence Moat. Developed for Nextute EdTech × Finance Club, IIT Patna (The Data Moat Round 2).
            </p>
            <div className="text-[11px] text-slate-400">
              Patliputra Colony, Patna, Bihar 800013, India
            </div>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-900 block font-bold">Solutions</strong>
            <ul className="space-y-1.5 text-slate-600">
              <li><Link href="/upload" className="hover:text-teal-600">OMR & CSV Ingestion</Link></li>
              <li><Link href="/mastery" className="hover:text-teal-600">Topic Mastery (2PL IRT)</Link></li>
              <li><Link href="/risk" className="hover:text-teal-600">Early-Warning Centre</Link></li>
              <li><Link href="/predict" className="hover:text-teal-600">Conformal Forecasts</Link></li>
              <li><Link href="/reports" className="hover:text-teal-600">Bilingual Parent Digests</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-900 block font-bold">Intelligence & AI</strong>
            <ul className="space-y-1.5 text-slate-600">
              <li><Link href="/ai-assistant" className="hover:text-teal-600">AI Teaching Copilot</Link></li>
              <li><Link href="/model-report" className="hover:text-teal-600">ML Rigour & Metrics</Link></li>
              <li><Link href="/owner" className="hover:text-teal-600">Executive ROI Model</Link></li>
              <li><Link href="/interventions" className="hover:text-teal-600">Intervention Tracker</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-900 block font-bold">Governance & Legal</strong>
            <ul className="space-y-1.5 text-slate-600">
              <li><Link href="/privacy-policy" className="hover:text-teal-600 font-semibold text-teal-700">Privacy Policy (DPDP)</Link></li>
              <li><Link href="/terms" className="hover:text-teal-600 font-semibold text-teal-700">Terms of Service (MSA)</Link></li>
              <li><Link href="/privacy" className="hover:text-teal-600">Consent Ledger & Audit</Link></li>
              <li><Link href="/login" className="hover:text-teal-600">Institute Sign In</Link></li>
              <li><Link href="/register" className="hover:text-teal-600">Register Institute</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} Nextute EdTech Private Limited. All rights reserved.</span>
          <div className="flex items-center space-x-3">
            <span>Built for IIT Patna Case Competition</span>
            <span>•</span>
            <span>DPDP Act 2023 Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
