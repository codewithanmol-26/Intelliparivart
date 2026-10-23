'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import {
  Users,
  FileCheck2,
  ShieldAlert,
  Layers,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Database,
  ArrowUpRight,
  Award,
  BookOpen,
  Calendar,
  Building2,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export default function OverviewPage() {
  const { tenantId, recomputeVersion, lastRunId, setRole } = useApp();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await api.getOverviewDashboard(tenantId);
      setData(res);
    } catch (err) {
      console.error('Error fetching overview dashboard:', err);
      // Fallback data
      setData({
        tenant_id: tenantId,
        institute_name: 'Apex JEE & Medical Academy, Patna',
        kpis: {
          total_active_students: 150,
          tests_processed: 8,
          students_requiring_support: 30,
          average_topic_mastery_pct: 68.4,
          review_queue_issues: 3
        },
        performance_trends: [
          { month: 'Apr (M1)', avg_score: 64.2, attendance_rate: 94.0, risk_detected: 14 },
          { month: 'May (M2)', avg_score: 66.8, attendance_rate: 92.5, risk_detected: 18 },
          { month: 'Jun (M3)', avg_score: 65.1, attendance_rate: 89.2, risk_detected: 24 },
          { month: 'Jul (M4)', avg_score: 67.5, attendance_rate: 88.0, risk_detected: 22 },
          { month: 'Aug (M5)', avg_score: 69.4, attendance_rate: 89.5, risk_detected: 19 },
          { month: 'Sep (M6)', avg_score: 71.0, attendance_rate: 90.8, risk_detected: 16 },
          { month: 'Oct (M7)', avg_score: 72.8, attendance_rate: 91.2, risk_detected: 13 },
          { month: 'Nov (M8)', avg_score: 74.5, attendance_rate: 92.0, risk_detected: 10 },
        ],
        batch_comparison: [
          { batch_id: 'BATCH_01', name: '12th JEE Achievers Top-30', target_exam: 'JEE Advanced', student_count: 30, avg_mastery_pct: 78.4, high_support_count: 3 },
          { batch_id: 'BATCH_02', name: '11th JEE Foundation Core', target_exam: 'JEE Main', student_count: 45, avg_mastery_pct: 64.2, high_support_count: 6 },
          { batch_id: 'BATCH_03', name: '12th NEET Pinnacle', target_exam: 'NEET', student_count: 40, avg_mastery_pct: 69.5, high_support_count: 4 },
          { batch_id: 'BATCH_04', name: 'Repeater Fastrack', target_exam: 'JEE Main', student_count: 35, avg_mastery_pct: 58.0, high_support_count: 5 },
        ],
        topic_strengths: [
          { topic: 'Calculus: Limits & Continuity', subject: 'Mathematics', mastery_pct: 84.5 },
          { topic: 'Chemical Bonding & Hybridization', subject: 'Chemistry', mastery_pct: 79.2 },
          { topic: 'Kinematics & Projectile Motion', subject: 'Physics', mastery_pct: 78.0 },
        ],
        topic_weaknesses: [
          { topic: 'Rotational Dynamics & Torque', subject: 'Physics', mastery_pct: 42.1 },
          { topic: 'Chemical Thermodynamics', subject: 'Chemistry', mastery_pct: 46.8 },
          { topic: 'Integral Calculus & Areas', subject: 'Mathematics', mastery_pct: 53.4 },
        ],
        risk_distribution: { High: 12, Moderate: 18, Low: 120 },
        priority_actions: [
          { id: 'ACT_01', title: 'Review 3 Unmatched Records', description: '3 student test marks quarantined due to mismatched roll codes.', href: '/review-queue', severity: 'HIGH', action_text: 'Resolve in Review Queue' },
          { id: 'ACT_02', title: 'Assign Rotational Dynamics Remedial', description: 'Topic mastery fell to 42.1% across 12th Achievers batch.', href: '/mastery', severity: 'HIGH', action_text: 'View Mastery Deficit' },
          { id: 'ACT_03', title: 'Contact Mentor: 4 Students Disengaging', description: 'Attendance slump < 55% detected in Months 2–3 triage.', href: '/risk', severity: 'MEDIUM', action_text: 'Open Early-Warning Centre' },
          { id: 'ACT_04', title: 'Dispatch Pending Parent Reports', description: '12 parent progress digests verified for WhatsApp dispatch.', href: '/reports', severity: 'LOW', action_text: 'Generate Reports' }
        ],
        recent_activities: [
          { id: 'ACT_LOG_01', title: 'Psychometric Recompute Completed', subtitle: '2PL IRT + BKT matrix updated across 150 students.', timestamp: '12m ago' },
          { id: 'ACT_LOG_02', title: 'Weekly OMR Assessment Scanned', subtitle: 'Physics Milestone Test 4: 30 sheets processed with 0 errors.', timestamp: '2h ago' },
          { id: 'ACT_LOG_03', title: 'Supportive Intervention Assigned', subtitle: 'Er. R. K. Verma assigned 1-on-1 Rotational Motion concept review.', timestamp: '3h ago' },
        ],
        recompute_run_id: 'RUN_PATNA_INIT'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [tenantId, recomputeVersion]);

  const kpis = data?.kpis || {
    total_active_students: 150,
    tests_processed: 8,
    students_requiring_support: 30,
    average_topic_mastery_pct: 68.4,
    review_queue_issues: 3
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-teal-800 tracking-wide uppercase">
              Operational Overview
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">
              {data?.institute_name || 'Apex JEE & Medical Academy, Patna'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Institute Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time psychometrics, longitudinal test performance, and supportive academic triage.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/owner"
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition"
          >
            <Sliders className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
            <span>Executive ROI Model</span>
          </Link>
          <button
            onClick={fetchOverview}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 5 Top Summary Clickable KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Total Active Students */}
        <Link
          href="/student"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Students</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {kpis.total_active_students}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center">
              100% Verified
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center">
            <span>Explore Cohort</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        {/* KPI 2: Tests Processed */}
        <Link
          href="/upload"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tests Processed</span>
            <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg group-hover:bg-teal-100 transition">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {kpis.tests_processed}
            </span>
            <span className="text-[11px] text-teal-600 font-semibold">
              CSV + OMR
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center">
            <span>Ingest & Audit</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        {/* KPI 3: Students Requiring Support */}
        <Link
          href="/risk"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-rose-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Needs Support</span>
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-100 transition">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-rose-600 font-mono">
              {kpis.students_requiring_support}
            </span>
            <span className="text-[11px] bg-rose-50 text-rose-700 font-semibold px-1.5 py-0.5 rounded">
              High Priority
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center">
            <span>Early-Warning Triage</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        {/* KPI 4: Average Topic Mastery */}
        <Link
          href="/mastery"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Average Mastery</span>
            <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg group-hover:bg-teal-100 transition">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {kpis.average_topic_mastery_pct}%
            </span>
            <span className="text-[11px] text-teal-600 font-semibold">
              BKT P(L)
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center">
            <span>View Heatmap</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        {/* KPI 5: Review Queue Issues */}
        <Link
          href="/review-queue"
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Review Queue</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-600 font-mono">
              {kpis.review_queue_issues}
            </span>
            <span className="text-[11px] bg-amber-50 text-amber-700 font-semibold px-1.5 py-0.5 rounded">
              Quarantined
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center">
            <span>Resolve Data Errors</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition" />
          </div>
        </Link>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Longitudinal Test Performance & Attendance Trend */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Cohort Longitudinal Performance & Attendance Trend
              </h2>
              <p className="text-xs text-slate-500">
                Tracking monthly academic test scores alongside attendance trajectories (Months 1 to 8).
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
              Months 1–8 Cycle
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.performance_trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                  formatter={(val: any, name: any) => [
                    `${val}%`,
                    name === 'avg_score' ? 'Average Test Score' : 'Attendance Rate'
                  ]}
                />
                <Area type="monotone" dataKey="avg_score" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" name="avg_score" />
                <Area type="monotone" dataKey="attendance_rate" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#attGrad)" name="attendance_rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center space-x-6 text-xs text-slate-500 pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-teal-600 inline-block"></span>
              <span>Average Test Score % (Upward Trajectory)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-blue-500 border-b border-dashed inline-block"></span>
              <span>Class Attendance Rate %</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Risk Distribution & Triage Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Early-Warning Support Triage
              </h2>
              <Link href="/risk" className="text-xs text-teal-600 font-semibold hover:underline">
                View Queue
              </Link>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Calibrated GBDT risk tiers across enrolled students.
            </p>

            {/* Segmented Bar */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Cohort Triage Split</span>
                <span className="text-slate-400 font-mono text-[11px]">150 Enrolled</span>
              </div>
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100">
                <div style={{ width: '8%' }} className="bg-rose-500" title="High Risk: 12 students (8%)"></div>
                <div style={{ width: '12%' }} className="bg-amber-400" title="Moderate Risk: 18 students (12%)"></div>
                <div style={{ width: '80%' }} className="bg-teal-500" title="Low Risk / On Track: 120 students (80%)"></div>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="mt-4 space-y-2.5">
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="font-semibold text-rose-900">High Support Priority</span>
                </div>
                <span className="font-mono font-bold text-rose-700">
                  {data?.risk_distribution?.High || 12} Students
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="font-semibold text-amber-900">Moderate Triage</span>
                </div>
                <span className="font-mono font-bold text-amber-700">
                  {data?.risk_distribution?.Moderate || 18} Students
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  <span className="font-semibold text-teal-900">On-Track / Solid Pace</span>
                </div>
                <span className="font-mono font-bold text-teal-700">
                  {data?.risk_distribution?.Low || 120} Students
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Zero Student Shaming Enforced</span>
            <span className="text-emerald-600 font-semibold">DPDP Sec 9 Active</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Batch Comparison & Topic Strengths / Deficits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch-wise Mastery Comparison */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Batch-wise Mastery & Capacity Comparison
              </h2>
              <p className="text-xs text-slate-500">
                Comparing conceptual BKT mastery and high-support caseload by academic batch.
              </p>
            </div>
            <Link href="/mastery" className="text-xs text-teal-600 font-semibold hover:underline">
              Heatmap
            </Link>
          </div>

          <div className="space-y-3">
            {(data?.batch_comparison || []).map((b: any) => (
              <div key={b.batch_id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{b.name}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-medium">
                      {b.target_exam}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {b.student_count} Students Enrolled • {b.high_support_count} Triage Flags
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-extrabold text-teal-700">
                    {b.avg_mastery_pct}%
                  </span>
                  <div className="w-20 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <div
                      style={{ width: `${b.avg_mastery_pct}%` }}
                      className={`h-full ${b.avg_mastery_pct >= 75 ? 'bg-teal-600' : b.avg_mastery_pct >= 60 ? 'bg-teal-400' : 'bg-amber-400'}`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Strengths & Critical Deficits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Syllabus Strengths vs. Priority Deficits
              </h2>
              <p className="text-xs text-slate-500">
                Psychometric rank of core topics needing immediate remedial worksheets.
              </p>
            </div>
            <Link href="/mastery" className="text-xs text-teal-600 font-semibold hover:underline">
              Full Matrix
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Top Strengths */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-emerald-800 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Strongest Concepts (&gt;75%)
              </span>
              <div className="space-y-2">
                {(data?.topic_strengths || []).map((t: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 truncate max-w-[130px]">{t.topic}</span>
                      <span className="font-mono font-bold text-emerald-700">{t.mastery_pct}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{t.subject}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Deficits */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-rose-800 flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />
                Remedial Deficits (&lt;55%)
              </span>
              <div className="space-y-2">
                {(data?.topic_weaknesses || []).map((t: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 truncate max-w-[130px]">{t.topic}</span>
                      <span className="font-mono font-bold text-rose-700">{t.mastery_pct}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{t.subject} • Remedial Needed</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Priority Actions & Recent Operations Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Actions Panel (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Priority Action Recommendations
              </h2>
              <p className="text-xs text-slate-500">
                Actionable tasks identified by automated validation, psychometrics, and early-warning engines.
              </p>
            </div>
            <span className="text-[11px] bg-teal-50 text-teal-800 font-semibold px-2 py-0.5 rounded">
              Direct Workflow Links
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(data?.priority_actions || []).map((act: any) => (
              <div key={act.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-400 hover:shadow-xs transition flex flex-col justify-between space-y-2.5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{act.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      act.severity === 'HIGH' ? 'bg-rose-100 text-rose-800' : act.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {act.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                <Link
                  href={act.href}
                  className="inline-flex items-center text-xs font-semibold text-teal-700 hover:text-teal-900"
                >
                  <span>{act.action_text}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Activity Feed (1 Col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Recent System Activity
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Live Audit</span>
          </div>

          <div className="space-y-3">
            {(data?.recent_activities || []).map((log: any) => (
              <div key={log.id} className="flex items-start space-x-3 text-xs pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                <span className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">{log.title}</div>
                  <div className="text-[11px] text-slate-500">{log.subtitle}</div>
                  <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
