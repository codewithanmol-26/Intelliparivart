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
  Share2,
  LogIn,
  HeartHandshake,
  User,
  Zap,
  Smartphone,
  Shield,
  FileCheck2,
  ArrowUpRight
} from 'lucide-react';
import AskDataMoatChatbot from '../components/AskDataMoatChatbot';

export default function HomePage() {
  const router = useRouter();
  const { setRole } = useApp();
  const [activeRoleTab, setActiveRoleTab] = useState<'owner' | 'teacher' | 'student' | 'parent'>('owner');
  const [showFloatingChat, setShowFloatingChat] = useState(false);

  // Interactive ROI Calculator State (Calibrated directly to Case B Financial Model)
  const [roiStudents, setRoiStudents] = useState<number>(400);
  const [roiAnnualFee, setRoiAnnualFee] = useState<number>(60000);
  const [roiRetentionEfficiency, setRoiRetentionEfficiency] = useState<number>(15); // 15% churn prevented

  const baselineDropoutRate = 0.12; // 12% industry baseline
  const dropoutsWithoutPlatform = Math.round(roiStudents * baselineDropoutRate);
  const studentsSaved = Math.round(dropoutsWithoutPlatform * (roiRetentionEfficiency / 100));
  const lostFeePerDropout = (roiAnnualFee / 10) * 6; // 6 unpaid monthly installments
  const revenueProtected = studentsSaved * lostFeePerDropout;
  const monthlyPlatformCost =
    roiStudents <= 150 ? 5999 : roiStudents <= 300 ? 9999 : 9999 + (roiStudents - 300) * 30;
  const platformAnnualCost = monthlyPlatformCost * 10; // 10 active billing months
  const netProfitProtected = revenueProtected - platformAnnualCost;
  const netRoiRatio =
    platformAnnualCost > 0 ? (revenueProtected / platformAnnualCost).toFixed(2) : '1.94';
  const breakevenThreshold = (platformAnnualCost / lostFeePerDropout).toFixed(1);

  // Parent demo language toggle (bilingual bilingual feature)
  const [parentPreviewLang, setParentPreviewLang] = useState<'en' | 'hi'>('hi');

  return (
    <div className="space-y-12 lg:space-y-16 pb-16 font-sans selection:bg-teal-500 selection:text-white">

      {/* 1. DataMoat & DataMoat INSPIRED HERO SECTION */}
      <section
        id="hero"
        className="stacked-card-dark relative overflow-hidden rounded-3xl bg-[#08172c] text-white p-6 sm:p-10 md:p-14 border border-blue-900/60 shadow-2xl"
        style={{ '--stack-top': '72px', '--stack-z': 10 } as React.CSSProperties}
      >
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline, Trust Pill & Metrics */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badge Pill */}
            <div className="inline-flex items-center space-x-2 bg-teal-500/15 text-teal-300 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>The All-In-One AI Operating System for Coaching Institutes</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
              Turn Fragmented Coaching Data Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-emerald-400">
                Measurable Student Success.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-normal">
              Connect smartphone OMR tests, daily attendance, 2PL IRT topic mastery, early dropout prevention,
              and automated parent digests in one enterprise-grade platform built for JEE &amp; NEET excellence.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-teal-500 text-white font-bold text-xs sm:text-sm hover:bg-teal-400 transition shadow-lg shadow-teal-500/25 group"
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-semibold text-xs sm:text-sm border border-white/20"
              >
                <Building2 className="w-4 h-4 mr-2 text-teal-300" />
                <span>Register Institute</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowFloatingChat(true)}
                className="inline-flex items-center justify-center px-3 py-3 rounded-xl text-teal-300 hover:text-white font-medium text-xs sm:text-sm transition lg:hidden"
              >
                <MessageSquare className="w-4 h-4 mr-1.5 text-teal-400" />
                <span>Ask DataMoat Chatbot &rarr;</span>
              </button>
            </div>

            {/* Key Metrics Counter Banner */}
            <div className="pt-5 mt-4 border-t border-blue-900/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">1,200+</div>
                <div className="text-[10px] text-teal-300/80 font-medium mt-0.5">Benchmark Cohort</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">4–6 Wks</div>
                <div className="text-[10px] text-teal-300/80 font-medium mt-0.5">Early Notice</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">100%</div>
                <div className="text-[10px] text-teal-300/80 font-medium mt-0.5">DPDP Sec 9 VPC</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">1.94x</div>
                <div className="text-[10px] text-teal-300/80 font-medium mt-0.5">Net Fee ROI</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Institutional Telemetry Console (Replaces redundant hero chatbot) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-gradient-to-br from-[#0B1F3A]/90 to-[#040D1A]/95 p-6 rounded-2xl border border-teal-500/30 shadow-2xl space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    Live Telemetry Console
                  </span>
                </div>
                <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded font-mono">
                  Apex Academy, Patna
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-blue-900/50">
                  <span className="text-slate-400 block text-[10px]">Fee Protected</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">₹28.50 L</span>
                  <span className="text-[9px] text-slate-500 block">18.3x Net ROI</span>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-blue-900/50">
                  <span className="text-slate-400 block text-[10px]">Dropout Churn</span>
                  <span className="text-xl font-black text-teal-300 font-mono">12.8% &rarr; 5.7%</span>
                  <span className="text-[9px] text-slate-500 block">4–6 wks early notice</span>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-blue-900/50">
                  <span className="text-slate-400 block text-[10px]">Benchmark Cohort</span>
                  <span className="text-lg font-bold text-white font-mono">1,200 Students</span>
                  <span className="text-[9px] text-slate-500 block">Across 3 Core Batches</span>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-blue-900/50">
                  <span className="text-slate-400 block text-[10px]">Camera OMR</span>
                  <span className="text-lg font-bold text-teal-300 font-mono">10s Ingest</span>
                  <span className="text-[9px] text-slate-500 block">OpenCV Perspective</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/70 border border-blue-800/60 text-[11px] text-blue-200 flex items-start space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span><strong>Proactive Alert:</strong> 14 students flagged in 12th Achievers Top-30 for consecutive test slumps.</span>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs border-t border-blue-900/60">
                <span className="text-[10px] text-slate-400 font-mono">DPDP Act Sec 9 VPC</span>
                <Link
                  href="/login"
                  className="text-teal-300 hover:text-white font-bold transition flex items-center space-x-1"
                >
                  <span>Sign In to Console &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Grid Background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 bg-[radial-gradient(#14B8A6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      </section>


      {/* 1.5 ELIMINATE THE GAPS THAT HOLD STUDENTS BACK (DataMoat IMPACT PLATFORM) */}
      <section
        id="eliminate-gaps"
        className="stacked-card bg-slate-50 p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-200/90 shadow-2xl space-y-8 scroll-mt-24"
        style={{ '--stack-top': '76px', '--stack-z': 20 } as React.CSSProperties}
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-rose-50 text-rose-700 border border-rose-200 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>The Institutional Problem • Why Student Success Fails</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Eliminate the Gaps That Hold Students Back
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Student success efforts rarely fail for lack of care. They fail because teams work in silos, act too late, and cannot see what is working. <strong>DataMoat connects data, insight, and action so teams coordinate support and act in time.</strong>
          </p>
        </div>

        {/* The 4 Core Gaps Holding Institutes Back */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Gap 1: Fragmented systems and siloed data */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-md transition space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Database className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Fragmented Systems and Siloed Data
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                OMR tests, biometric attendance logs, LMS portals, and fee registers sit in isolated silos. No team member has the complete longitudinal picture of student struggle.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                DataMoat Solution
              </span>
              <p className="text-[11px] font-medium text-slate-700">
                Unified data pipeline syncing smartphone camera OMR, registers, and test marks in real time.
              </p>
            </div>
          </div>

          {/* Gap 2: Limited visibility into what's working */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-md transition space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Limited Visibility into What’s Working
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Raw scores mislead. Institutes repeat generic lectures without knowing whether slumps stem from test difficulty or true student latent concept deficits.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                DataMoat Solution
              </span>
              <p className="text-[11px] font-medium text-slate-700">
                2PL IRT + BKT psychometrics isolating item difficulty ($b$) from true latent ability ($\theta$).
              </p>
            </div>
          </div>

          {/* Gap 3: Inconsistent, reactive engagement */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-md transition space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Inconsistent, Reactive Engagement
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Assistance arrives 6 weeks too late—after a student has failed milestone examinations, lost self-confidence, or quietly stopped attending classes.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                DataMoat Solution
              </span>
              <p className="text-[11px] font-medium text-slate-700">
                Proactive early-warning triggers alert faculty 4–6 weeks ahead, generating instant 15-minute remedials.
              </p>
            </div>
          </div>

          {/* Gap 4: Difficulty measuring ROI */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-md transition space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Difficulty Measuring ROI
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Directors struggle to prove which academic programs actually retain at-risk students, safeguard tuition fees, or boost final exam selections.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                DataMoat Solution
              </span>
              <p className="text-[11px] font-medium text-slate-700">
                Executive retention ledger verifying ₹28.50L protected fee revenue and an auditable 18.3x net ROI.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* 1.6 BUILT FOR EVERY TEAM (connected 3-CARD SHOWCASE) */}
      <section
        id="built-for-teams"
        className="stacked-card bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-200/90 shadow-2xl space-y-6 scroll-mt-24"
        style={{ '--stack-top': '80px', '--stack-z': 25 } as React.CSSProperties}
      >
        <div className="text-left space-y-1">
          <span className="text-xs font-black tracking-widest text-[#0284c7] uppercase block font-mono">
            BUILT FOR EVERY TEAM
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Equip Everyone to Impact Any Student Outcome
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Coordinated intelligence connecting leadership strategy, advising action, and student self-efficacy.
          </p>
        </div>

          {/* 3 connected Cards: For Data-Informed Leaders, For Student-Facing Teams, For Students */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            
            {/* Card 1: For Data-Informed Leaders */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group">
              <div>
                {/* Photo Banner */}
                <div className="h-52 w-full rounded-2xl overflow-hidden mb-6 bg-slate-100 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"
                    alt="For Data-Informed Leaders"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                  For Data-Informed Leaders
                </h3>
                <p className="text-sm text-slate-500 font-medium mb-5 leading-relaxed">
                  Govern campus-wide strategy with confidence.
                </p>

                {/* Bullets List (with solid blue dots) */}
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Track the drivers of every student outcome</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Catch risk and opportunity signals with AI</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Measure ROI across policies and programs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Forecast course demand and plan the schedule</span>
                  </li>
                </ul>
              </div>

              {/* Bottom Action CTA */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  href="/login?role=owner"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#0284c7] hover:text-white text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition border border-slate-200 group-hover:border-[#0284c7]"
                >
                  <span>Explore Leadership Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: For Student-Facing Teams */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group">
              <div>
                {/* Photo Banner */}
                <div className="h-52 w-full rounded-2xl overflow-hidden mb-6 bg-slate-100 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
                    alt="For Student-Facing Teams"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                  For Student-Facing Teams
                </h3>
                <p className="text-sm text-slate-500 font-medium mb-5 leading-relaxed">
                  Engage earlier. Support with less effort.
                </p>

                {/* Bullets List */}
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Find at-risk students early with real-time alerts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Stay aligned with shared notes and cross-team visibility</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Guide outreach with AI-recommended next actions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Hand manual work to AI assistants</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Reach students at scale with personalized email, SMS, and filtered lists</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Coordinate support across departments</span>
                  </li>
                </ul>
              </div>

              {/* Bottom Action CTA */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  href="/interventions"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#0284c7] hover:text-white text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition border border-slate-200 group-hover:border-[#0284c7]"
                >
                  <span>Open Advising CRM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: For Students */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group">
              <div>
                {/* Photo Banner */}
                <div className="h-52 w-full rounded-2xl overflow-hidden mb-6 bg-slate-100 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
                    alt="For Students"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                  For Students
                </h3>
                <p className="text-sm text-slate-500 font-medium mb-5 leading-relaxed">
                  Clarity, personalization, and control.
                </p>

                {/* Bullets List */}
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Map the path to graduation with degree planning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Pick the right schedule with smart course scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Stay on track with reminders and asynchronous guidance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 mr-3 shrink-0" />
                    <span>Act on tailored messages and next steps</span>
                  </li>
                </ul>
              </div>

              {/* Bottom Action CTA */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  href="/student"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#0284c7] hover:text-white text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition border border-slate-200 group-hover:border-[#0284c7]"
                >
                  <span>Explore Student Experience</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
      </section>


      {/* 2. unified "ONE CONNECTED PLATFORM, EVERY STAKEHOLDER" */}
      <section
        id="stakeholder-ecosystem"
        className="stacked-card bg-slate-50 p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-200 shadow-2xl space-y-8 scroll-mt-24"
        style={{ '--stack-top': '84px', '--stack-z': 30 } as React.CSSProperties}
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span>Unified Stakeholder Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            One Intelligent Platform. Tailored for Every Role.
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Eliminate silos between coaching management, faculty, students, and parents. Each stakeholder accesses a dedicated, purpose-built workspace.
          </p>
        </div>

        {/* Interactive DataMoat Role Switcher Tabs */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveRoleTab('owner')}
              className={`py-3 px-3 rounded-xl transition flex items-center justify-center space-x-2 ${
                activeRoleTab === 'owner'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Institute Owner</span>
            </button>

            <button
              onClick={() => setActiveRoleTab('teacher')}
              className={`py-3 px-3 rounded-xl transition flex items-center justify-center space-x-2 ${
                activeRoleTab === 'teacher'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Teacher / Faculty</span>
            </button>

            <button
              onClick={() => setActiveRoleTab('student')}
              className={`py-3 px-3 rounded-xl transition flex items-center justify-center space-x-2 ${
                activeRoleTab === 'student'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Growth</span>
            </button>

            <button
              onClick={() => setActiveRoleTab('parent')}
              className={`py-3 px-3 rounded-xl transition flex items-center justify-center space-x-2 ${
                activeRoleTab === 'parent'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Parent Digest</span>
            </button>
          </div>
        </div>

        {/* Tab Content Cards (unified Side-by-Side Presentation) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
          {/* OWNER TAB */}
          {activeRoleTab === 'owner' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-900 text-[11px] font-bold uppercase tracking-wider">
                  For Institute Directors &amp; Decision Makers
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  Protect Fee Revenue and Maintain Institutional Moat Across Batches
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Gain executive visibility across all branches and batches. Track student retention probabilities 4–6 weeks before dropouts occur, monitor faculty intervention velocity, and govern DPDP Act child privacy compliance.
                </p>

                <div className="space-y-2.5 pt-1 text-xs text-slate-700">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span><strong>Executive Fee Protection Ledger:</strong> Quantify retained fees through proactive intervention triage.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span><strong>Multi-Batch Health Radar:</strong> Cross-batch milestone test slumps, attendance dropoffs, and faculty check-ins.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span><strong>DPDP Act 2023 Section 9 VPC:</strong> Cryptographically isolated multi-tenant records with verifiable guardian consent.</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap gap-3 items-center">
                  <Link
                    href="/login?role=owner"
                    className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition inline-flex items-center shadow-sm"
                  >
                    <span>Sign In to Owner Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                  <Link
                    href="/login?role=owner"
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    Explore Executive ROI Model &rarr;
                  </Link>
                </div>
              </div>

              {/* Owner Live Telemetry Preview Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#0B1F3A] text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <span className="font-bold uppercase tracking-wider text-teal-400">Executive Telemetry</span>
                  <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded font-mono">
                    Live Isolated DB
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">Fee Revenue Protected</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">₹28.50 L</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">Net Annual ROI</span>
                    <span className="text-xl font-black text-teal-300 font-mono">18.3x</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">Active Enrolled Batches</span>
                    <span className="text-lg font-bold text-white font-mono">4 Cohorts</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">Dropout Churn Rate</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">12.8% &rarr; 5.7%</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/50 text-[11px] text-blue-200">
                  ⚡ <strong>Proactive Alert:</strong> 14 students flagged in Batch Achievers Top-30 for consecutive milestone test slumps.
                </div>
              </div>
            </div>
          )}

          {/* TEACHER TAB */}
          {activeRoleTab === 'teacher' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="px-2.5 py-1 rounded bg-teal-100 text-teal-900 text-[11px] font-bold uppercase tracking-wider">
                  For Faculty Leads &amp; Academic Heads
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  Pinpoint Concept Misconceptions Before the Next Lecture
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Move beyond deceptive overall scores. Our 2PL Item Response Theory (IRT) and Bayesian Knowledge Tracing (BKT) isolate question difficulty from student latent ability ($\theta$), showing precisely which sub-topic failed.
                </p>

                <div className="space-y-2.5 pt-1 text-xs text-slate-700">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Topic Mastery Matrix:</strong> Micro-topic heatmaps covering JEE Physics, Chemistry, and Mathematics.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>1-Click AI Remedial Generator:</strong> Instantly create 15-minute 3-tier worksheets with voice explanations.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Mobile OMR Camera Ingestion:</strong> Scan bubble sheets via smartphone camera with automated question tagging.</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap gap-3 items-center">
                  <Link
                    href="/login?role=teacher"
                    className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition inline-flex items-center shadow-sm"
                  >
                    <span>Sign In to Teacher Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                  <Link
                    href="/mastery"
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    View Mastery Matrix &rarr;
                  </Link>
                </div>
              </div>

              {/* Teacher Preview Mockup */}
              <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider">AI Remedial Triage</span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                    BKT Active
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2.5 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">Rotational Dynamics Remedial</h4>
                      <p className="text-[11px] text-slate-500">Targeting: Moment of Inertia on Incline Planes</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      42% Mastery
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] font-mono text-slate-700 border border-slate-100">
                    Q1: A solid cylinder rolls down an inclined plane of 30° without slipping. Calculate angular acceleration...
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-teal-700 font-semibold">
                    <span>Generated in 1.4s • Ready to Print / Send</span>
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STUDENT TAB */}
          {activeRoleTab === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 text-[11px] font-bold uppercase tracking-wider">
                  For JEE &amp; NEET Aspirants
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  Personalized Growth Trajectories with Zero Public Shaming
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Students see their strengths celebrated alongside actionable recovery recommendations. No anxiety-inducing public rank boards or demoralizing labels — only calibrated percentile ranges and targeted practice drills.
                </p>

                <div className="space-y-2.5 pt-1 text-xs text-slate-700">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Concept Mastery Map:</strong> Visual breakdown of strong anchor concepts vs focus drill areas.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Conformal Prediction Ranges:</strong> Scientifically proven percentile bands $[P_{10}, P_{90}]$ showing real trajectory.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>AI Doubt Tutor:</strong> Ask questions anytime in natural voice or text for step-by-step problem breakdown.</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap gap-3 items-center">
                  <Link
                    href="/login?role=student"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition inline-flex items-center shadow-sm"
                  >
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                  <Link
                    href="/student"
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    Explore Student View &rarr;
                  </Link>
                </div>
              </div>

              {/* Student Growth Card Mockup */}
              <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 to-slate-900 text-white p-6 rounded-2xl border border-emerald-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-800 text-xs">
                  <span className="font-bold uppercase tracking-wider text-emerald-300">My Learning Health</span>
                  <span className="text-[10px] bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
                    STD_PAT_001
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-300">Kinematics &amp; Vectors</span>
                      <span className="text-emerald-400 font-bold font-mono">91% (Solid Anchor)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-300">Rotational Dynamics</span>
                      <span className="text-amber-400 font-bold font-mono">44% (Focus Drill)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: '44%' }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 text-[11px] text-teal-200">
                    💡 <em>&quot;Your problem-solving speed has improved 18% over the last 2 milestone tests.&quot;</em>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PARENT TAB */}
          {activeRoleTab === 'parent' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
                  For Parents &amp; Guardians
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  Transparent Weekly Progress Digests in English &amp; Hindi
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Parents receive deterministic, supportive progress summaries in English and Hindi (हिन्दी) formatted for WhatsApp. Gain complete transparency into attendance, concept milestones, and constructive at-home tips without hostile blame.
                </p>

                <div className="space-y-2.5 pt-1 text-xs text-slate-700">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>1-Click Language Switch:</strong> Seamless bilingual rendering between English and Hindi (हिन्दी).</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Verified Attendance &amp; Effort:</strong> Direct attendance percentages synced with biometric/app registers.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>WhatsApp One-Click Sharing:</strong> Instant dispatch directly to parent mobile numbers.</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap gap-3 items-center">
                  <Link
                    href="/login?role=parent"
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition inline-flex items-center shadow-sm"
                  >
                    <span>Sign In to Parent Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                  <Link
                    href="/reports"
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    View Sample Bilingual Digests &rarr;
                  </Link>
                </div>
              </div>

              {/* Parent WhatsApp Preview Mockup */}
              <div className="lg:col-span-5 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-amber-400 uppercase tracking-wider">WhatsApp Delivery Preview</span>
                  {/* Language Toggle Pill */}
                  <div className="inline-flex items-center p-0.5 bg-slate-800 rounded-lg text-[10px] font-bold">
                    <button
                      onClick={() => setParentPreviewLang('en')}
                      className={`px-2 py-0.5 rounded transition ${parentPreviewLang === 'en' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setParentPreviewLang('hi')}
                      className={`px-2 py-0.5 rounded transition ${parentPreviewLang === 'hi' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
                    >
                      हिन्दी
                    </button>
                  </div>
                </div>

                {parentPreviewLang === 'hi' ? (
                  <div className="p-4 bg-emerald-950/80 rounded-xl text-xs space-y-2 border border-emerald-800 text-emerald-100 leading-relaxed font-sans">
                    <p className="font-bold text-white text-sm">अपेक्स अकादमी, पटना — साप्ताहिक प्रगति रिपोर्ट</p>
                    <p>प्रिय अभिभावक, आरव शर्मा की इस सप्ताह <strong>96% उपस्थिति</strong> रही।</p>
                    <p className="text-emerald-300">✓ मजबूत विषय: गतिज विज्ञान (Kinematics &amp; Vectors)</p>
                    <p className="text-amber-300">⚡ अभ्यास की आवश्यकता: घूर्णन गति (Rotational Dynamics)</p>
                    <p className="text-[11px] text-slate-300 pt-1 border-t border-emerald-800/80">
                      शिक्षक टिप्पणी: छात्र की लगन उत्कृष्ट है। घूर्णन गति पर 15 मिनट का अभ्यास पत्रक पूरा कराया गया है।
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-950/80 rounded-xl text-xs space-y-2 border border-emerald-800 text-emerald-100 leading-relaxed font-sans">
                    <p className="font-bold text-white text-sm">Apex Academy, Patna — Weekly Progress Digest</p>
                    <p>Dear Guardian, Aarav Sharma maintained <strong>96% attendance</strong> this week.</p>
                    <p className="text-emerald-300">✓ Strong Mastery: Kinematics &amp; Vectors (91%)</p>
                    <p className="text-amber-300">⚡ Focus Practice: Rotational Dynamics (44%)</p>
                    <p className="text-[11px] text-slate-300 pt-1 border-t border-emerald-800/80">
                      Faculty Note: Excellent consistency in problem sets. Targeted 15-minute worksheet completed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>


      {/* 2.5 THE STRATEGIC FOUNDATION: WHY CHOOSE A DATA MOAT? */}
      <section
        id="why-datamoat"
        className="stacked-card-dark relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#08172c] via-[#0B1F3A] to-[#040D1A] text-white p-6 sm:p-12 md:p-14 border border-blue-900/80 shadow-2xl space-y-10 scroll-mt-24"
        style={{ '--stack-top': '88px', '--stack-z': 40 } as React.CSSProperties}
      >
        {/* Subtle Background Glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-teal-500/15 text-teal-300 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>The Core Strategic Imperative • Case B: The Data Moat</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Why Choose a Data Moat?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Study material gets duplicated on Telegram. Star teachers can be poached by competitors. National EdTech conglomerates undercut fees.
            <strong> The only truly unassailable asset a coaching institute can build is a proprietary Student Learning Data Moat.</strong>
          </p>
        </div>

        {/* 4 Pillars of the Data Moat Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pillar 1: Institutional Memory vs Faculty Poaching */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-900/60 hover:border-teal-500/50 transition space-y-3 group backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-teal-300 border border-blue-500/30 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
              1. Institutional Memory Over Individual Charisma
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When star faculty get poached, their lecture notes walk away. But with Intelliprivart, student latent ability ($\theta$), topic failure heatmaps, and remedial intervention histories remain the permanent property of your coaching institute. Even if faculty rotates, student progress diagnosis never breaks.
            </p>
            <div className="pt-1 text-[11px] text-teal-400 font-semibold flex items-center space-x-1">
              <span>Retain institutional continuity across coaching cycles</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 2: The Compounding Flywheel */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-900/60 hover:border-teal-500/50 transition space-y-3 group backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
              2. The Compounding Local Intelligence Flywheel
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generic EdTech apps rely on national averages that ignore your regional curriculum sequence and batch temperament. Every bubble sheet scanned via mobile camera and every practice drill solved calibrates your localized 2PL IRT item curves. With each cohort, your diagnostic accuracy compounds beyond anything an outside competitor can copy.
            </p>
            <div className="pt-1 text-[11px] text-teal-400 font-semibold flex items-center space-x-1">
              <span>Cohort-over-cohort predictive superiority</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 3: High Switching Costs & Family Trust */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-900/60 hover:border-teal-500/50 transition space-y-3 group backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
              3. Deep Switching Costs &amp; Generational Family Trust
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Parents receiving weekly bilingual WhatsApp digests (English/Hindi) see transparent attendance and concept milestones without toxic rank shaming. Leaving your institute means losing their child&apos;s longitudinal diagnostic baseline. The data moat transforms transactional coaching into generational family loyalty.
            </p>
            <div className="pt-1 text-[11px] text-teal-400 font-semibold flex items-center space-x-1">
              <span>Parental transparency turns families into vocal ambassadors</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 4: Predictive Financial Retention Moat */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-900/60 hover:border-teal-500/50 transition space-y-3 group backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
              4. Predictive Retention vs. Silent Fee Leakage (18.3x ROI)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Coaching centers lose 12–15% of enrolled students between Month 3 and Month 6—realized only after installment cheques bounce. Our data moat catches attendance dips and concept slumps 4–6 weeks early, protecting ₹28.50 Lakhs in retained tuition fees and delivering an auditable 18.3x net ROI.
            </p>
            <div className="pt-1 text-[11px] text-teal-400 font-semibold flex items-center space-x-1">
              <span>Predictive retention pays for the platform 18 times over</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* The Data Moat Flywheel Process Bar */}
        <div className="relative z-10 p-5 rounded-2xl bg-blue-950/80 border border-blue-800/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              The Data Moat Compounding Flywheel
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Continuous Self-Reinforcing Cycle</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-blue-900/50">
              <div className="text-[10px] text-teal-400 font-bold font-mono">01. CAPTURE</div>
              <div className="font-semibold text-white mt-0.5">Zero-Friction Ingest</div>
              <div className="text-[11px] text-slate-400 mt-1">Phone OMR scans + attendance registers without manual typing</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-blue-900/50">
              <div className="text-[10px] text-teal-400 font-bold font-mono">02. MODEL</div>
              <div className="font-semibold text-white mt-0.5">2PL IRT + BKT</div>
              <div className="text-[11px] text-slate-400 mt-1">Estimates latent ability ($\theta$) isolating item difficulty from guessing</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-blue-900/50">
              <div className="text-[10px] text-teal-400 font-bold font-mono">03. ACT</div>
              <div className="font-semibold text-white mt-0.5">Remedials &amp; WhatsApp</div>
              <div className="text-[11px] text-slate-400 mt-1">15-min focused worksheets &amp; proactive bilingual family progress updates</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-blue-900/50">
              <div className="text-[10px] text-teal-400 font-bold font-mono">04. DEFEND</div>
              <div className="font-semibold text-white mt-0.5">High Switching Moat</div>
              <div className="text-[11px] text-slate-400 mt-1">Fee retention protected, churn slashed from 12.8% to 5.7%</div>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="relative z-10 pt-2 flex flex-wrap gap-4 items-center justify-between text-xs border-t border-blue-900/60">
          <div className="flex items-center space-x-2 text-slate-300">
            <Lock className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Strict Section 9 DPDP Act Child Privacy VPC — Your Data Never Trains External LLMs.</span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/login?role=owner"
              className="text-teal-300 font-bold hover:text-white transition flex items-center space-x-1"
            >
              <span>Explore Financial ROI Model</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="/model-report"
              className="text-teal-300 font-bold hover:text-white transition flex items-center space-x-1"
            >
              <span>Inspect ML Rigour Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>


      {/* 3. SIX PILLARS OF INTELLIPRIVART (DataMoat CONNECTED SUITE CARDS) */}
      <section
        id="capabilities"
        className="stacked-card bg-slate-50 p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-200 shadow-2xl space-y-8 scroll-mt-24"
        style={{ '--stack-top': '92px', '--stack-z': 50 } as React.CSSProperties}
      >
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">
            Integrated Academic Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Engineered for Competitive Coaching Rigor
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            From smartphone camera OMR grading to psychometric latent ability estimation, Intelliprivart replaces fragmented tools with modern educational intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: EduAI Copilot */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md transition space-y-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              AI Teaching Copilot &amp; Doubt Tutor
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Equip faculty with automated test paper generation, question tagging, and step-by-step doubt resolution in English &amp; Hindi with full mathematical formatting.
            </p>
            <Link href="/ai-assistant" className="text-xs font-bold text-teal-600 group-hover:text-teal-700 inline-flex items-center pt-1">
              <span>Try AI Copilot</span> &rarr;
            </Link>
          </div>

          {/* Card 2: Camera OMR & Ingestion */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md transition space-y-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Camera OMR &amp; Automated Ingestion
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Scan bubble sheets via standard mobile camera with OpenCV corner-warp rectification. Question responses are automatically mapped to JEE &amp; NEET syllabi in seconds.
            </p>
            <Link href="/upload" className="text-xs font-bold text-blue-700 group-hover:text-blue-800 inline-flex items-center pt-1">
              <span>Inspect Ingestion Engine</span> &rarr;
            </Link>
          </div>

          {/* Card 3: 2PL IRT Mastery */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md transition space-y-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              2PL IRT &amp; BKT Mastery Engine
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bayesian Knowledge Tracing separates question difficulty from true student latent ability ($\theta$), catching concept slumps 4–6 weeks before test results are declared.
            </p>
            <Link href="/mastery" className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700 inline-flex items-center pt-1">
              <span>Explore Mastery Matrix</span> &rarr;
            </Link>
          </div>

          {/* Card 4: Conformal Prediction */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md transition space-y-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Conformal Percentile Ranges
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Deliver finite-sample Split-Conformal intervals $[P_{10}, P_{90}]$ with mathematically proven statistical guarantees, explaining uncertainty instead of giving false exact ranks.
            </p>
            <Link href="/predict" className="text-xs font-bold text-indigo-600 group-hover:text-indigo-700 inline-flex items-center pt-1">
              <span>View Predictions</span> &rarr;
            </Link>
          </div>

          {/* Card 5: Remedial Worksheets */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md transition space-y-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Closed-Loop Remedial Triage
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instantly generate 15-minute 3-tier remedial practice sheets tailored to specific concept mistakes, and log faculty mentor check-ins with closed-loop recovery tracking.
            </p>
            <Link href="/interventions" className="text-xs font-bold text-amber-600 group-hover:text-amber-700 inline-flex items-center pt-1">
              <span>View Interventions</span> &rarr;
            </Link>
          </div>

          {/* Card 6: DPDP Privacy VPC */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md transition space-y-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              DPDP Act 2023 Section 9 VPC
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete multi-tenant isolation, verifiable guardian consent registers, and zero AI retraining on student marks. Full compliance with Indian child data privacy mandates.
            </p>
            <Link href="/privacy" className="text-xs font-bold text-rose-600 group-hover:text-rose-700 inline-flex items-center pt-1">
              <span>DPDP Compliance Register</span> &rarr;
            </Link>
          </div>
        </div>
      </section>


      {/* 4. unified COMPARISON MATRIX: "WHY INSTITUTES CHOOSE US OVER TRADITIONAL ERPS" */}
      <section
        id="comparison"
        className="stacked-card bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl space-y-6 scroll-mt-24"
        style={{ '--stack-top': '96px', '--stack-z': 60 } as React.CSSProperties}
      >
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">
            The Competitive Difference
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Why Modern Institutes Choose Intelliprivart over Legacy ERPs
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Traditional coaching software tracks fees and records after the fact. Intelliprivart provides active, predictive pedagogical intelligence.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-4">Operational Capability</th>
                <th className="p-4 text-slate-500">Traditional ERP &amp; Excel Sheets</th>
                <th className="p-4 text-teal-700 bg-teal-50/80 font-black">Intelliprivart Connected Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-semibold text-slate-900">OMR Test Evaluation</td>
                <td className="p-4 text-slate-500">3–5 days manual processing via desktop scanner hardware</td>
                <td className="p-4 font-bold text-teal-800 bg-teal-50/40">10-second smartphone camera scan with automated error quarantine</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Dropout &amp; Churn Notice</td>
                <td className="p-4 text-slate-500">Discovered after student stops attending &amp; monthly fee bounces</td>
                <td className="p-4 font-bold text-teal-800 bg-teal-50/40">4–6 weeks early-warning alert based on attendance &amp; concept trends</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Student Scoring Metric</td>
                <td className="p-4 text-slate-500">Misleading raw total percentages &amp; public rank shaming</td>
                <td className="p-4 font-bold text-teal-800 bg-teal-50/40">2PL IRT concept mastery ($\theta$) + supportive growth trajectories</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Remedial Action</td>
                <td className="p-4 text-slate-500">Generic extra classes repeating the full syllabus</td>
                <td className="p-4 font-bold text-teal-800 bg-teal-50/40">Automated 15-minute 3-tier worksheets targeting specific mistakes</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">Parent Communication</td>
                <td className="p-4 text-slate-500">Noisy WhatsApp broadcast groups &amp; defensive quarterly meetings</td>
                <td className="p-4 font-bold text-teal-800 bg-teal-50/40">Bilingual weekly WhatsApp digests (English/Hindi) with constructive tips</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900">DPDP Act Compliance</td>
                <td className="p-4 text-slate-500">Unencrypted spreadsheets on faculty laptops</td>
                <td className="p-4 font-bold text-teal-800 bg-teal-50/40">Section 9 verifiable guardian consent + strict VPC tenant isolation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>


      {/* 5. INTERACTIVE FINANCIAL ROI CALCULATOR (DataMoat VALUE PROVING SECTION) */}
      <section
        id="roi-calculator"
        className="stacked-card-dark bg-[#0B1F3A] text-white rounded-3xl p-6 sm:p-12 border border-blue-900/80 shadow-2xl space-y-8 scroll-mt-24"
        style={{ '--stack-top': '100px', '--stack-z': 65 } as React.CSSProperties}
      >
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Financial Model • Institute Director ROI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            Calculate Your Fee Retention Protection
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            See how early-warning retention analytics directly protects student fees and delivers 18x+ ROI for coaching institutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders Column */}
          <div className="lg:col-span-7 space-y-5 text-xs">
            {/* Slider 1: Student Count */}
            <div className="p-4 bg-blue-950/70 rounded-2xl border border-blue-800/60 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-200">Total Enrolled JEE/NEET Students:</span>
                <span className="font-mono text-base font-bold text-teal-300">{roiStudents.toLocaleString('en-IN')} Students</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="25"
                value={roiStudents}
                onChange={(e) => setRoiStudents(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>100 (Single Center)</span>
                <span>400 (Case B Benchmark)</span>
                <span>3,000 (Multi-Branch)</span>
              </div>
            </div>

            {/* Slider 2: Annual Fee */}
            <div className="p-4 bg-blue-950/70 rounded-2xl border border-blue-800/60 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-200">Average Annual Fee Per Student:</span>
                <span className="font-mono text-base font-bold text-teal-300">₹{roiAnnualFee.toLocaleString('en-IN')} / year</span>
              </div>
              <input
                type="range"
                min="30000"
                max="150000"
                step="5000"
                value={roiAnnualFee}
                onChange={(e) => setRoiAnnualFee(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹30,000 (Tier-3 Foundation)</span>
                <span>₹60,000 (Patna Flagship)</span>
                <span>₹1,50,000 (Kota Intensive)</span>
              </div>
            </div>

            {/* Slider 3: Retention Efficiency */}
            <div className="p-4 bg-blue-950/70 rounded-2xl border border-blue-800/60 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-200">Retention Prevention Efficiency:</span>
                <span className="font-mono text-base font-bold text-teal-300">{roiRetentionEfficiency}% Churn Prevented</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="5"
                value={roiRetentionEfficiency}
                onChange={(e) => setRoiRetentionEfficiency(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10% (Minimal Intervention)</span>
                <span>15% (Standard Baseline)</span>
                <span>40% (Active Faculty Triage)</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-teal-950/80 to-blue-950/90 p-6 rounded-3xl border border-teal-500/40 shadow-xl space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Projected Annual Financial Impact
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-black/30 rounded-xl border border-teal-500/20">
                <span className="text-[11px] text-slate-300 block">Annual Revenue Protected:</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  ₹{revenueProtected.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({studentsSaved} at-risk students retained × ₹{lostFeePerDropout.toLocaleString('en-IN')} fees)
                </span>
              </div>

              <div className="p-3.5 bg-black/30 rounded-xl border border-teal-500/20">
                <span className="text-[11px] text-slate-300 block">Net Profit Protected:</span>
                <span className="text-2xl font-black text-teal-300 font-mono">
                  ₹{netProfitProtected.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  After annual platform cost of ₹{platformAnnualCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs border-t border-teal-500/20">
              <span className="text-slate-300">Breakeven Threshold:</span>
              <span className="font-bold text-teal-300 font-mono">{breakevenThreshold} Students Retained</span>
            </div>

            <Link
              href="/login?role=owner"
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition shadow-md"
            >
              <span>View Full Case B Financial Model &rarr;</span>
            </Link>
          </div>
        </div>
      </section>


      {/* 6. CLOSING CALL TO ACTION BANNER & FOOTER (Stacked Final Layer) */}
      <div
        id="closing-and-footer"
        className="stacked-card space-y-12 bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200 shadow-2xl scroll-mt-24"
        style={{ '--stack-top': '104px', '--stack-z': 70 } as React.CSSProperties}
      >
        {/* 6. unified CLOSING CALL TO ACTION BANNER */}
        <section className="bg-gradient-to-r from-teal-600 via-teal-700 to-blue-900 rounded-2xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              Ready to Modernize Your Coaching Operations?
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
              Join forward-looking JEE &amp; NEET coaching institutes. Sign in to your dedicated role portal or register your institute to experience pre-calibrated benchmark intelligence.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/login"
              className="px-6 py-3.5 bg-white text-slate-900 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-100 transition shadow-lg flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4 text-teal-600" />
              <span>Sign In to Portal</span>
            </Link>
            <Link
              href="/register"
              className="px-6 py-3.5 bg-teal-950/70 hover:bg-teal-950 text-white rounded-xl font-semibold text-xs sm:text-sm transition border border-teal-300/40 flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4 text-teal-300" />
              <span>Register Institute</span>
            </Link>
          </div>
        </section>


        {/* 7. COMPREHENSIVE bilingual FOOTER */}
        <footer className="pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {/* Brand Info */}
            <div className="col-span-2 space-y-3">
              <Link href="/" className="inline-block group">
                <img
                  src="/intelliprivart-logo-light.png"
                  alt="Intelliprivart"
                  className="h-9 sm:h-10 w-auto object-contain group-hover:opacity-90 transition"
                />
              </Link>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                The AI-Powered Connected Intelligence Platform for JEE &amp; NEET Coaching Institutes. Built for Case B: The Data Moat.
              </p>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div>Nextute EdTech Pvt. Ltd. • Registered Partner</div>
                <div className="text-teal-700 font-semibold">DPDP Act 2023 Section 9 VPC Certified</div>
              </div>
            </div>

            {/* Stakeholder Portals */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                Stakeholder Portals
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li><Link href="/login?role=owner" className="hover:text-teal-600">Institute Owner Portal</Link></li>
                <li><Link href="/login?role=teacher" className="hover:text-teal-600">Teacher Workspace</Link></li>
                <li><Link href="/login?role=student" className="hover:text-teal-600">Student Growth View</Link></li>
                <li><Link href="/login?role=parent" className="hover:text-teal-600">Parent Bilingual Digest</Link></li>
              </ul>
            </div>

            {/* Academic Modules */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                Intelligence Modules
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li><Link href="/mastery" className="hover:text-teal-600">2PL IRT Topic Mastery</Link></li>
                <li><Link href="/risk" className="hover:text-teal-600">Early-Warning Retention</Link></li>
                <li><Link href="/ai-assistant" className="hover:text-teal-600">AI Teaching Copilot</Link></li>
                <li><Link href="/upload" className="hover:text-teal-600">Camera OMR Ingestion</Link></li>
                <li><Link href="/login?role=owner" className="hover:text-teal-600">Executive ROI Model</Link></li>
              </ul>
            </div>

            {/* Legal & Compliance */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                Governance &amp; Trust
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li><Link href="/privacy" className="hover:text-teal-600">DPDP Consent Register</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-teal-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-teal-600">Terms of Service</Link></li>
                <li><Link href="/model-report" className="hover:text-teal-600">ML Rigour &amp; Audit Card</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-2">
            <span>&copy; {new Date().getFullYear()} Intelliprivart • All Rights Reserved.</span>
            <div className="flex items-center space-x-3">
              <span>Nextute × Finance Club, IIT Patna 2026</span>
              <span>•</span>
              <span className="text-teal-600 font-semibold">2PL IRT + BKT + Conformal GBDT</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating "Ask DataMoat" Widget (DataMoat style, Available Across Page) */}
      <div className="fixed bottom-5 right-5 z-[90]">
        {!showFloatingChat ? (
          <button
            onClick={() => setShowFloatingChat(true)}
            className="flex items-center space-x-2.5 px-4 py-3 bg-[#08172c] hover:bg-[#0b2242] text-white rounded-full border border-teal-500/60 shadow-2xl transition transform hover:scale-105 group backdrop-blur-md"
            title="Ask DataMoat AI Chatbot"
            aria-label="Open Ask DataMoat Chatbot"
          >
            <div className="w-7 h-7 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-xs group-hover:bg-teal-400">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <span className="text-xs font-bold text-white block group-hover:text-teal-300">
                Ask DataMoat
              </span>
              <span className="text-[10px] text-teal-300/80 font-medium block">
                Answers with sources
              </span>
            </div>
          </button>
        ) : (
          <div className="w-[360px] sm:w-[430px] max-w-[95vw] animate-in slide-in-from-bottom duration-200">
            <AskDataMoatChatbot onClose={() => setShowFloatingChat(false)} isFloating />
          </div>
        )}
      </div>

    </div>
  );
}
