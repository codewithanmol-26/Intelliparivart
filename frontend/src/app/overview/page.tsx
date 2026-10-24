'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { UserRole } from '../../lib/types';
import {
  DEMO_INSTITUTE,
  DEMO_BATCHES,
  DEMO_STUDENTS,
  DEMO_TOPIC_MASTERY,
  DEMO_PARENT_REPORTS,
  DemoBatch,
  DemoStudent,
  DemoTopicMastery
} from '../../lib/demoData';
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
  Sliders,
  GraduationCap,
  HeartHandshake,
  Languages,
  Check,
  Target,
  HelpCircle,
  Lightbulb,
  Share2,
  Printer,
  ChevronRight,
  Send,
  Flame,
  FileText
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
  Legend,
  LineChart,
  Line
} from 'recharts';
import CivitasActionableAnalytics from '../../components/CivitasActionableAnalytics';
import CivitasConnectedWorkflows from '../../components/CivitasConnectedWorkflows';

export default function OverviewPage() {
  const { tenantId, role, setRole, recomputeVersion, selectedStudentId, setSelectedStudentId, notifyRecomputed } = useApp();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Civitas View Mode: Actionable Analytics, Connected Workflows, or Role Perspectives
  const [overviewMode, setOverviewMode] = useState<'analytics' | 'workflows' | 'roles'>('analytics');

  // Teacher Workspace State (when role === 'teacher')
  const [selectedFaculty, setSelectedFaculty] = useState<'verma' | 'sen' | 'trivedi'>('verma');
  const [teacherSubject, setTeacherSubject] = useState<string>('All');
  const [teacherBatch, setTeacherBatch] = useState<string>('BATCH_TOP30');
  const [teacherTopic, setTeacherTopic] = useState<string>('Rotational Dynamics');
  const [worksheetStudent, setWorksheetStudent] = useState<string>('Aarav Sharma');
  const [worksheetGenerated, setWorksheetGenerated] = useState<boolean>(false);
  const [worksheetCommitted, setWorksheetCommitted] = useState<boolean>(false);

  // Student Workspace State (when role === 'student')
  const [studentPersonaId, setStudentPersonaId] = useState<string>(selectedStudentId || 'STD_PAT_001');
  const [activeDrillTopic, setActiveDrillTopic] = useState<string | null>(null);
  const [showDrillHint, setShowDrillHint] = useState<boolean>(false);
  const [drillAnswered, setDrillAnswered] = useState<boolean>(false);

  // Parent Workspace State (when role === 'parent')
  const [parentLang, setParentLang] = useState<'en' | 'hi'>('en');
  const [parentWardId, setParentWardId] = useState<string>(selectedStudentId || 'STD_PAT_001');
  const [parentWhatsAppSent, setParentWhatsAppSent] = useState<boolean>(false);

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
          { id: 'ACT_02', title: 'Assign Rotational Dynamics Remedial', description: 'Topic mastery fell to 42.1% across 12th Achievers batch.', href: '/interventions', severity: 'HIGH', action_text: 'View Remedial Ledger' },
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

  // Active student object for student view
  const activeStudent = DEMO_STUDENTS.find(s => s.id === studentPersonaId) || DEMO_STUDENTS[0];

  // Active ward object for parent view
  const activeWard = DEMO_STUDENTS.find(s => s.id === parentWardId) || DEMO_STUDENTS[0];
  const parentRpt = parentLang === 'en' ? DEMO_PARENT_REPORTS.en : DEMO_PARENT_REPORTS.hi;

  // Filtered topics for teacher view
  const teacherFilteredTopics = teacherSubject === 'All'
    ? DEMO_TOPIC_MASTERY
    : DEMO_TOPIC_MASTERY.filter((t: DemoTopicMastery) => t.subject === teacherSubject);

  const kpis = data?.kpis || {
    total_active_students: 150,
    tests_processed: 8,
    students_requiring_support: 30,
    average_topic_mastery_pct: 68.4,
    review_queue_issues: 3
  };

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* CIVITAS PLATFORM ARCHITECTURE & WORKFLOW SELECTOR              */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-[#08172c] via-[#0F2744] to-[#0B1F3A] text-white p-4 sm:p-5 rounded-3xl border border-blue-900/80 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-teal-400">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Civitas Learning Platform Architecture • Enterprise Coaching Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Institutional Impact &amp; Connected Workflows Console
          </h1>
          <p className="text-xs text-slate-300">
            Spot risk, forecast course demand, and measure initiative impact from one dataset with coordinated AI workflows.
          </p>
        </div>

        {/* 3 Primary View Mode Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-2xl border border-blue-900/70 self-start md:self-auto text-xs font-bold">
          <button
            onClick={() => setOverviewMode('analytics')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer ${
              overviewMode === 'analytics'
                ? 'bg-teal-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>1. Actionable Analytics</span>
          </button>

          <button
            onClick={() => setOverviewMode('workflows')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer ${
              overviewMode === 'workflows'
                ? 'bg-teal-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Connected Workflows</span>
          </button>

          <button
            onClick={() => setOverviewMode('roles')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer ${
              overviewMode === 'roles'
                ? 'bg-teal-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>3. Role Perspectives</span>
          </button>
        </div>
      </div>

      {/* Render Mode 1: Civitas Actionable Analytics */}
      {overviewMode === 'analytics' && (
        <CivitasActionableAnalytics
          onSelectStudent={(stId) => {
            setSelectedStudentId(stId);
            setOverviewMode('workflows');
          }}
          onSwitchToWorkflows={() => setOverviewMode('workflows')}
        />
      )}

      {/* Render Mode 2: Civitas Connected Workflows */}
      {overviewMode === 'workflows' && (
        <CivitasConnectedWorkflows
          studentId={selectedStudentId || 'STD_PAT_001'}
          onBackToAnalytics={() => setOverviewMode('analytics')}
        />
      )}

      {/* Render Mode 3: Traditional Role Workspaces */}
      {overviewMode === 'roles' && (
        <div className="space-y-6">
      {/* ============================================================== */}
      {/* MASTER ROLE-SPECIFIC DASHBOARD SWITCHER                        */}
      {/* ============================================================== */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            {role === 'owner' && <Building2 className="w-5 h-5" />}
            {role === 'teacher' && <Layers className="w-5 h-5" />}
            {role === 'student' && <GraduationCap className="w-5 h-5" />}
            {role === 'parent' && <HeartHandshake className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-wider text-teal-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Role-Specific Intelligence Console</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 leading-tight">
              {role === 'owner' && 'Institute Owner & Executive Dashboard'}
              {role === 'teacher' && 'Teacher & Academic Head Workspace'}
              {role === 'student' && `Student Growth Dashboard • ${activeStudent.name}`}
              {role === 'parent' && `Parent Progress Digest (Bilingual EN/HI) • Ward: ${activeWard.name}`}
            </h1>
          </div>
        </div>

        {/* 4 Interactive Role Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setRole('owner')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
              role === 'owner'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Institute Owner</span>
          </button>
          <button
            onClick={() => setRole('teacher')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
              role === 'teacher'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Teacher / Faculty</span>
          </button>
          <button
            onClick={() => {
              setRole('student');
              setSelectedStudentId('STD_PAT_001');
            }}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
              role === 'student'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student (Growth)</span>
          </button>
          <button
            onClick={() => {
              setRole('parent');
              setSelectedStudentId('STD_PAT_001');
            }}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
              role === 'parent'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Parent (Bilingual)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. INSTITUTE OWNER DASHBOARD VIEW                              */}
      {/* ============================================================== */}
      {role === 'owner' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Context & Action Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-teal-800 tracking-wide uppercase">
                  Executive Intelligence & Attrition Protection
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-500">
                  {data?.institute_name || 'Apex JEE & Medical Academy, Patna'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time psychometrics, longitudinal test performance, and fee-recovery triage across 1,000 enrolled learners.
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
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Multi-Stakeholder Institute Hierarchy Bar */}
          <div className="bg-gradient-to-r from-blue-900 via-[#0B1F3A] to-slate-900 p-4 rounded-2xl text-white text-xs shadow-md border border-blue-800/60">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center font-bold text-teal-300">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-sm block">
                    Institute Stakeholder Governance
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Multi-Tenant Hierarchy: 1 Owner (Sole Authority) • Multiple Faculty, Students &amp; Parents
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-teal-300 font-extrabold block text-xs">1 Sole Owner</span>
                  <span className="text-[10px] text-slate-300">Dr. S. K. Narayan</span>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-teal-300 font-extrabold block text-xs">3 Teachers</span>
                  <span className="text-[10px] text-slate-300">Physics, Chem, Math</span>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-teal-300 font-extrabold block text-xs">400 Students</span>
                  <span className="text-[10px] text-slate-300">4 Enrolled Batches</span>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-teal-300 font-extrabold block text-xs">400 Parents</span>
                  <span className="text-[10px] text-slate-300">DPDP Consent Linked</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Top Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
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
                <span className="text-[11px] text-emerald-600 font-semibold">100% Verified</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 flex items-center">
                <span>Explore Cohort</span>
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>

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
                <span className="text-[11px] text-teal-700 font-semibold font-mono">2PL IRT Calibrated</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 flex items-center">
                <span>Upload Marks / OMR</span>
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>

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
                <span className="text-[11px] text-rose-700 font-semibold font-mono">Top 20% Triage</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 flex items-center">
                <span>Early-Warning Centre</span>
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>

            <Link
              href="/mastery"
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Cohort Mastery</span>
                <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg group-hover:bg-teal-100 transition">
                  <Layers className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {kpis.average_topic_mastery_pct}%
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">+4.2% lift</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 flex items-center">
                <span>View Heatmap</span>
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>

            <Link
              href="/interventions"
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Remedial Clusters</span>
                <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-amber-700 font-mono">
                  8 Micro-Cohorts
                </span>
                <span className="text-[11px] text-amber-800 font-semibold">1,000 Scale</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400 flex items-center">
                <span>Remedial Ledger</span>
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition" />
              </div>
            </Link>
          </div>

          {/* Longitudinal Test & Attendance Performance Trend Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Longitudinal Performance & Early-Warning Detection Trajectory
                </h3>
                <p className="text-xs text-slate-500">
                  Correlating test score averages, attendance rates, and algorithmic risk flags across 8 milestone test cycles.
                </p>
              </div>
              <span className="text-[11px] text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full font-semibold">
                Historical Milestone Pipeline
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.performance_trends || []} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="avg_score" name="Avg Test Score (%)" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" />
                  <Area type="monotone" dataKey="attendance_rate" name="Cohort Attendance (%)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#attGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Batch Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Batch Comparison & Support Needs</h3>
                <p className="text-xs text-slate-500">Mastery levels and at-risk student distribution across active batches</p>
              </div>
              <Link href="/mastery" className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center">
                <span>View Full Matrix</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-4">Batch Name</th>
                    <th className="py-2.5 px-4">Target Exam</th>
                    <th className="py-2.5 px-4 text-center">Enrolled</th>
                    <th className="py-2.5 px-4 text-center">Avg Mastery</th>
                    <th className="py-2.5 px-4 text-center">Students Needing Support</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data?.batch_comparison || []).map((b: any) => (
                    <tr key={b.batch_id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{b.name}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{b.target_exam}</td>
                      <td className="py-3 px-4 text-center font-mono">{b.student_count}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-teal-700">{b.avg_mastery_pct}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          {b.high_support_count} Students
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href="/risk" className="text-xs text-teal-700 font-bold hover:underline">
                          Triage &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. TEACHER / ACADEMIC HEAD DASHBOARD VIEW                      */}
      {/* ============================================================== */}
      {role === 'teacher' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
                <Users className="w-4 h-4" />
                <span>Teacher Workspace • Multiple Faculty per Institute</span>
              </div>
              <div className="mt-1 mb-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Active Faculty Lead:</label>
                <select
                  value={selectedFaculty}
                  onChange={(e) => {
                    const val = e.target.value as 'verma' | 'sen' | 'trivedi';
                    setSelectedFaculty(val);
                    if (val === 'verma') setTeacherTopic('Rotational Dynamics');
                    else if (val === 'sen') setTeacherTopic('Ionic Equilibrium');
                    else setTeacherTopic('Integral Calculus');
                  }}
                  className="text-base sm:text-lg font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="verma">Prof. R. K. Verma • Senior Physics Faculty &amp; Academic Lead</option>
                  <option value="sen">Dr. Ananya Sen • HOD Chemistry &amp; Concept Lead</option>
                  <option value="trivedi">Prof. Manoj Trivedi • JEE Advanced Mathematics Lead</option>
                </select>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {selectedFaculty === 'verma' && 'Prof. R. K. Verma • Senior Physics Faculty'}
                {selectedFaculty === 'sen' && 'Dr. Ananya Sen • HOD Chemistry'}
                {selectedFaculty === 'trivedi' && 'Prof. Manoj Trivedi • Senior Mathematics Lead'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {selectedFaculty === 'verma' && 'Lead Mentor: Achievers JEE Advanced Top-30 & Foundation 11th Batch'}
                {selectedFaculty === 'sen' && 'Lead Mentor: Physical & Organic Chemistry Concept Triage'}
                {selectedFaculty === 'trivedi' && 'Lead Mentor: Integral Calculus & Coordinate Geometry'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold">
                <span className="text-slate-500 mr-2">Assigned Batch:</span>
                <select
                  aria-label="Select Assigned Batch"
                  value={teacherBatch}
                  onChange={(e) => setTeacherBatch(e.target.value)}
                  className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
                >
                  {DEMO_BATCHES.map((b: DemoBatch) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <Link
                href="/ai-assistant"
                className="px-4 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 font-bold text-xs transition flex items-center space-x-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Teaching Copilot</span>
              </Link>
            </div>
          </div>

          {/* BKT Topic Mastery Heatmap Matrix */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Bayesian Knowledge Tracing (BKT) Topic Mastery Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Calibrated probability of topic mastery P(L_t) separating real understanding from lucky guesses.
                </p>
              </div>

              {/* Subject Filter Pills */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {['All', 'Physics', 'Chemistry', 'Mathematics'].map(subj => (
                  <button
                    key={subj}
                    onClick={() => setTeacherSubject(subj)}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      teacherSubject === subj
                        ? 'bg-white text-teal-800 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Topic Heatmap Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              {teacherFilteredTopics.slice(0, 8).map((topic: DemoTopicMastery) => {
                const pct = Math.round(topic.bktMasteryProb * 100);
                const isStruggling = topic.status === 'Struggling';
                const isMastered = topic.status === 'Mastered';
                return (
                  <div
                    key={topic.topicId}
                    onClick={() => setTeacherTopic(topic.topicName)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      teacherTopic === topic.topicName
                        ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/20'
                        : isStruggling
                        ? 'border-rose-200 bg-rose-50/30 hover:border-rose-400'
                        : isMastered
                        ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-400'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {topic.subject}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isStruggling
                            ? 'bg-rose-100 text-rose-800'
                            : isMastered
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {topic.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {topic.topicName}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        N = {topic.sampleSize} item evaluations
                      </div>
                    </div>

                    {/* Mastery Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-mono font-bold">
                        <span className="text-slate-500">Mastery:</span>
                        <span className={isStruggling ? 'text-rose-600' : 'text-slate-900'}>{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isStruggling ? 'bg-rose-500' : isMastered ? 'bg-emerald-500' : 'bg-teal-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 line-clamp-2">
                      <strong className="text-slate-700">Friction:</strong> {topic.commonMisconception}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3-Tier Remedial Worksheet Generator */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1 text-xs font-bold text-teal-600 uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3-Tier Remedial Action</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  15-Minute Concept Catch-Up Worksheet
                </h3>
              </div>
              <span className="text-[11px] font-semibold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                Selected: {teacherTopic}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Target Learner or Micro-Cohort:</label>
                  <select
                    value={worksheetStudent}
                    onChange={(e) => setWorksheetStudent(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none"
                  >
                    <optgroup label="1,000-Student Clustered Micro-Cohorts (Scale Mode)">
                      <option value="Micro-Cohort R-01 (42 Students Across Batches A, B, C)">Micro-Cohort R-01 (42 Students Across Batches A, B, C)</option>
                      <option value="Micro-Cohort R-02 (36 Students Across Batches Top-30 & NEET)">Micro-Cohort R-02 (36 Students Across Batches Top-30 & NEET)</option>
                    </optgroup>
                    <optgroup label="Individual 1-on-1 Students">
                      {DEMO_STUDENTS.map((s: DemoStudent) => (
                        <option key={s.id} value={s.name}>{s.name} ({s.rollNumber})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Target Topic:</label>
                  <div className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-teal-700">
                    {teacherTopic}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setWorksheetGenerated(true)}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate 3-Tier Remedial Worksheet for {worksheetStudent}</span>
              </button>
            </div>

            {worksheetGenerated && (
              <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-50/20 space-y-3 text-xs animate-fadeIn">
                <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
                  <span className="font-bold text-slate-900">
                    Remedial Module: {teacherTopic} ({worksheetStudent})
                  </span>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                    Pedagogical Intelligence Core
                  </span>
                </div>

                <div className="space-y-2 text-slate-700 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <strong className="text-teal-800 block text-xs">Level 1: Foundational (1-Step Concept Check)</strong>
                    A solid cylinder of mass M and radius R rolls without slipping on a horizontal surface. Calculate the ratio of rotational kinetic energy to total kinetic energy.
                    <span className="block text-[10px] text-slate-400 mt-1">Hint: Apply I_cm = 0.5 * M * R^2 and rolling condition v = R * omega.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <strong className="text-teal-800 block text-xs">Level 2: Moderate (Torque Sign & Equilibrium)</strong>
                    A uniform rod of length L is hinged at one end and released from rest in a horizontal position. Determine its angular velocity as it swings through the vertical plane.
                    <span className="block text-[10px] text-slate-400 mt-1">Hint: Use conservation of mechanical energy: delta U = M * g * (L/2).</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <strong className="text-teal-800 block text-xs">Level 3: Exam Standard (Combined Motion)</strong>
                    A solid sphere rests on a rough inclined plane at angle theta. Find the minimum coefficient of static friction mu_s required for pure rolling without slipping.
                    <span className="block text-[10px] text-slate-400 mt-1">Hint: Set up Newton's second law for linear acceleration and torque about CM: I = 0.4 * M * R^2.</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-teal-500/20">
                  <span className="text-[11px] text-slate-500">
                    Faculty Talking Point: Verify origin placement at instantaneous center of zero velocity.
                  </span>
                  {worksheetCommitted ? (
                    <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                      ✓ Committed to Ledger
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setWorksheetCommitted(true);
                        notifyRecomputed(undefined, `Intervention committed for ${worksheetStudent}!`);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Commit to Intervention Ledger
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. STUDENT GROWTH DASHBOARD VIEW                               */}
      {/* ============================================================== */}
      {role === 'student' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Supportive Student Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>Student Growth & Practice Companion • Confidential View</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Welcome back, {activeStudent.name}!
              </h2>
              <p className="text-xs text-slate-500">
                {activeStudent.batchName} • Roll No: {activeStudent.rollNumber} • Target: {activeStudent.targetExam} 2026
              </p>
            </div>

            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <span className="text-slate-500 mr-2">Persona:</span>
              <select
                aria-label="Select Demo Student Persona"
                value={studentPersonaId}
                onChange={(e) => {
                  setStudentPersonaId(e.target.value);
                  setSelectedStudentId(e.target.value);
                }}
                className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
              >
                {DEMO_STUDENTS.map((s: DemoStudent) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.targetExam})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Test Performance Trajectory with Conformal [P10, P90] Interval */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Longitudinal Performance Trajectory & Exam Readiness
                </h3>
                <p className="text-xs text-slate-500">
                  Calibrated percentile interval [P_10, P_90] guaranteed via split-conformal inference (90% coverage).
                </p>
              </div>
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                Zero Public Shaming • Private Progress
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { test: 'Milestone 1', score: 142, percentile: 96.2, p10: 92.0, p90: 98.0 },
                    { test: 'Milestone 2', score: 138, percentile: 94.0, p10: 90.0, p90: 96.5 },
                    { test: 'Milestone 3 (Slump)', score: 104, percentile: 86.4, p10: 82.0, p90: 91.0 },
                    { test: 'Milestone 4 (Post-Interv)', score: 132, percentile: 92.1, p10: 88.0, p90: 95.0 },
                    { test: 'Mock 5 (Current)', score: 218, percentile: 94.5, p10: 91.0, p90: 96.5 }
                  ]}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="pInterval" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="test" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="p90" name="Upper Percentile Bound (P90)" stroke="#14b8a6" strokeDasharray="3 3" fillOpacity={1} fill="url(#pInterval)" />
                  <Area type="monotone" dataKey="percentile" name="Your Milestone Percentile" stroke="#0d9488" strokeWidth={3} fillOpacity={0} />
                  <Area type="monotone" dataKey="p10" name="Lower Percentile Bound (P10)" stroke="#0f766e" strokeDasharray="3 3" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strengths & Practice Priorities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Strengths */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                <Award className="w-4 h-4" />
                <span>Your Mastered Strengths</span>
              </div>
              <div className="space-y-2">
                {(activeStudent.strongTopics || ['Calculus: Limits & Continuity', 'Chemical Bonding', 'Kinematics']).map((topicName: string, idx: number) => (
                  <div key={idx} className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{topicName}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">High BKT Latent Mastery (&gt; 80%)</div>
                    </div>
                    <span className="font-mono font-extrabold text-emerald-700 text-xs">Mastered</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Areas & Drills */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-amber-700 font-bold">
                <Target className="w-4 h-4" />
                <span>High-Leverage Practice Focus</span>
              </div>
              <div className="space-y-2">
                {(activeStudent.weakTopics || ['Rotational Dynamics & Torque', 'Chemical Thermodynamics']).map((topicName: string, idx: number) => (
                  <div key={idx} className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{topicName}</div>
                      <div className="text-[10px] text-amber-800">Targeted Concept Catch-Up Recommended</div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveDrillTopic(topicName);
                        setShowDrillHint(false);
                        setDrillAnswered(false);
                      }}
                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] cursor-pointer"
                    >
                      Start Drill
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Practice Drill Modal */}
          {activeDrillTopic && (
            <div className="p-5 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-3 text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  15-Minute Practice Drill: {activeDrillTopic}
                </span>
                <button
                  onClick={() => setActiveDrillTopic(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕ Close
                </button>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                <p className="font-semibold text-slate-800">
                  Question: A uniform disc of mass M and radius R rolls without slipping on a horizontal plane. What fraction of its total kinetic energy is rotational?
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {['1/3 (33.3%)', '1/2 (50.0%)', '2/5 (40.0%)', '2/3 (66.7%)'].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setDrillAnswered(true)}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-teal-50 text-left font-semibold text-slate-700"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {drillAnswered && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg font-semibold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct! K_rot / K_tot = (0.5 * I * ω^2) / (0.5 * M * v^2 + 0.5 * I * ω^2) = (1/4) / (3/4) = 1/3.</span>
                  </div>
                )}
                <div className="pt-2">
                  <button
                    onClick={() => setShowDrillHint(!showDrillHint)}
                    className="text-teal-700 font-bold text-[11px] underline"
                  >
                    {showDrillHint ? 'Hide Concept Hint' : '💡 Show Concept Hint'}
                  </button>
                  {showDrillHint && (
                    <p className="mt-1 text-slate-600 text-[11px] italic bg-slate-50 p-2 rounded">
                      Hint: Use the moment of inertia for a solid disk I_cm = 1/2 M R^2 and substitute v = R * ω into translational KE = 1/2 M v^2.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. PARENT BILINGUAL DIGEST DASHBOARD VIEW                      */}
      {/* ============================================================== */}
      {role === 'parent' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Bar with Language Switcher */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4" />
                <span>Parent Academic Progress Digest • Guardian View</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {parentLang === 'en' ? `Monthly Progress: ${activeWard.name}` : `मासिक प्रगति रिपोर्ट: ${activeWard.name}`}
              </h2>
              <p className="text-xs text-slate-500">
                {activeWard.batchName} • Apex JEE Academy, Patna • {parentRpt.month}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Ward Switcher */}
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold">
                <span className="text-slate-500 mr-2">Ward:</span>
                <select
                  aria-label="Select Ward"
                  value={parentWardId}
                  onChange={(e) => {
                    setParentWardId(e.target.value);
                    setSelectedStudentId(e.target.value);
                  }}
                  className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
                >
                  {DEMO_STUDENTS.map((s: DemoStudent) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.targetExam})</option>
                  ))}
                </select>
              </div>

              {/* Bilingual English / Hindi Switcher (Key Requirement) */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold">
                <button
                  onClick={() => setParentLang('en')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    parentLang === 'en'
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setParentLang('hi')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    parentLang === 'hi'
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
              </div>
            </div>
          </div>

          {/* Supportive Progress Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                {parentLang === 'en' ? 'Holistic Growth Digest' : 'समग्र विकास सारांश'}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                MoE January 2024 Well-Being Guidelines
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {parentRpt.overallScoreTrend} • {parentRpt.percentileBand}
            </p>

            {/* Attendance & Engagement Status */}
            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  {activeWard.attendanceRate}%
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">
                    {parentLang === 'en' ? 'Classroom Attendance' : 'कक्षा में उपस्थिति'}
                  </span>
                  <span className="text-[11px] text-teal-800 font-medium">
                    {parentLang === 'en' ? 'Excellent regular discipline in lectures' : 'कक्षाओं में निरंतर और उत्कृष्ट अनुशासन'}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] self-start sm:self-auto">
                {parentLang === 'en' ? 'Verified Regular' : 'सत्यापित नियमित'}
              </span>
            </div>
          </div>

          {/* Strengths & Supportive Revision Routines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="font-bold text-emerald-700 block text-xs">
                {parentLang === 'en' ? 'Key Academic Strengths' : 'मुख्य शैक्षणिक क्षमताएं'}
              </span>
              <div className="space-y-2">
                {parentRpt.strongAreas.map((s, idx) => (
                  <div key={idx} className="p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-slate-800 text-[11px] flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="font-bold text-teal-700 block text-xs">
                {parentLang === 'en' ? 'Weekly Recommended Home Routine' : 'साप्ताहिक अनुशंसित गृह दिनचर्या'}
              </span>
              <div className="space-y-2">
                {parentRpt.homeSupportTips.map((r, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-[11px] flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teacher Mentorship Note & WhatsApp Share */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-900 block text-xs">
                {parentLang === 'en' ? 'Assigned Faculty Mentor Follow-Up:' : 'मार्गदर्शक संकाय का संदेश:'}
              </span>
              <p className="text-slate-600 mt-1 max-w-xl text-[11px]">
                {parentRpt.facultyNote} <span className="font-semibold text-slate-700">({parentRpt.mentorName} — {parentRpt.mentorRole})</span>
              </p>
            </div>

            <button
              onClick={() => {
                setParentWhatsAppSent(true);
                notifyRecomputed(undefined, 'Parent Progress Digest sent via WhatsApp Sandbox!');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 cursor-pointer ${
                parentWhatsAppSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
              }`}
            >
              {parentWhatsAppSent ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>WhatsApp Sent!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
      </div>
      )}
    </div>
  );
}
