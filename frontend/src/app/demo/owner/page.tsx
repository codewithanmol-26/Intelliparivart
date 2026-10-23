'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import DemoRoleModal from '@/components/DemoRoleModal';
import {
  DEMO_INSTITUTE,
  DEMO_BATCHES,
  DEMO_STUDENTS,
  DEMO_INTERVENTIONS,
  DemoBatch,
  DemoStudent,
  DemoIntervention
} from '@/lib/demoData';
import {
  Building2,
  Users,
  TrendingUp,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight,
  Award,
  Sparkles,
  DollarSign,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';

export default function DemoOwnerPage() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [timePeriod, setTimePeriod] = useState<string>('m1-m5');

  const handleExportExecutiveBrief = () => {
    const csvRows = [
      'metric,value,unit,benchmark_comparison',
      'total_enrolled,1200,students,+14% YoY',
      'cohort_attendance,88.6,percent,Stable',
      'students_requiring_support,8,students,Down from 18 in Month 3',
      'tuition_protected,2850000,INR,18.3x ROI',
      'top30_avg_score,78.4,percent,Achievers Top-30',
      'neet_avg_score,71.2,percent,Target NEET',
      'foundation_avg_score,64.8,percent,Foundation 11th'
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'apex_academy_executive_brief.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered batch statistics
  const filteredBatches = selectedBatch === 'all'
    ? DEMO_BATCHES
    : DEMO_BATCHES.filter((b: DemoBatch) => b.id === selectedBatch);

  // Milestone Test Trend Data
  const scoreTrendData = [
    { test: 'Milestone 1', top30: 82.5, foundation: 61.2, neet: 68.4, attendance: 94.2 },
    { test: 'Milestone 2', top30: 84.1, foundation: 63.5, neet: 70.1, attendance: 92.0 },
    { test: 'Milestone 3 (Slump)', top30: 71.8, foundation: 58.4, neet: 65.2, attendance: 84.6 },
    { test: 'Milestone 4 (Post-Interv)', top30: 76.4, foundation: 62.0, neet: 69.8, attendance: 88.5 },
    { test: 'Milestone 5 (Current)', top30: 78.4, foundation: 64.8, neet: 71.2, attendance: 91.2 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* In-Demo Top Role Switcher Bar */}
      <DemoBanner onOpenRoleModal={() => setIsRoleModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Role Page Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>Institute Owner & Executive Intelligence Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {DEMO_INSTITUTE.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Patna Flagship Centre • 1,200 Enrolled JEE & NEET Students • 3 Integrated Branches
            </p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/owner"
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition flex items-center space-x-1.5"
            >
              <span>Full Financial Model</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleExportExecutiveBrief}
              className="px-3.5 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 font-bold text-xs transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Executive Brief</span>
            </button>
          </div>
        </div>

        {/* 4 Core Operational & Financial Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Enrolled */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Total Active Students</span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">1,200</span>
              <span className="text-xs font-bold text-emerald-600">+14% YoY</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Across 14 Batches in Patna, Kankarbagh & Bailey Rd
            </div>
          </div>

          {/* Card 2: Attendance Overview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Cohort Attendance Rate</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">88.6%</span>
              <span className="text-xs font-bold text-emerald-600">Stable</span>
            </div>
            <div className="text-[11px] text-slate-500">
              30-day rolling average (Test attendance: 92.4%)
            </div>
          </div>

          {/* Card 3: Early-Warning Support */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Students Requiring Support</span>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">8</span>
              <span className="text-xs text-slate-500 font-medium">Flagged Early</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Down from 18 prior to Month 3 mentor triage
            </div>
          </div>

          {/* Card 4: Fee Revenue Protected */}
          <div className="bg-white p-5 rounded-2xl border border-teal-500/30 bg-teal-50/20 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-teal-800">
              <span>Tuition Revenue Protected</span>
              <DollarSign className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-teal-900 font-mono">₹28.5 Lakh</span>
              <span className="text-xs font-bold text-teal-700">18.3x ROI</span>
            </div>
            <div className="text-[11px] text-teal-700">
              Estimated 38 dropouts avoided via early interventions
            </div>
          </div>
        </div>

        {/* Section 2: Batch Performance & Test Trajectories */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Test Trend Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Batch Performance & Attendance Trajectories
                </h3>
                <p className="text-xs text-slate-500">
                  Tracking average milestone test scores and cohort attendance across Month 1 to Month 5
                </p>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                5 Milestone Evaluations
              </span>
            </div>

            {/* Recharts Line Chart */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="test" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="top30" name="Achievers Top-30 (%)" stroke="#0D9488" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="neet" name="Target NEET (%)" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="foundation" name="Foundation 11th (%)" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="attendance" name="Attendance (%)" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Key Executive Insight:</strong> Month 3 showed a coordinated 8% dip in Top-30 Physics scores due to Rotational Dynamics concept friction. Timely faculty mentorship in Month 4 recovered scores back to 78.4%.
              </span>
            </div>
          </div>

          {/* Right: Batch Health Breakdown Table (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Batch Health Overview</h3>
                <p className="text-xs text-slate-500">Operational status by academic division</p>
              </div>
              <span className="text-xs font-semibold text-teal-600">Active Terms</span>
            </div>

            <div className="space-y-3">
              {filteredBatches.map((batch: DemoBatch) => (
                <div
                  key={batch.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 bg-slate-50/50 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{batch.name}</h4>
                      <span className="text-[10px] text-slate-500">{batch.leadFaculty}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      {batch.targetExam}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Students</span>
                      <span className="font-bold text-slate-800 font-mono">{batch.studentCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Avg Score</span>
                      <span className="font-bold text-slate-800 font-mono">{batch.avgScore}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">At-Risk Triage</span>
                      <span className={`font-bold font-mono ${batch.atRiskCount > 15 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {batch.atRiskCount} Students
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/demo/teacher"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center space-x-1.5"
            >
              <span>Inspect Academic Topic Mastery</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* Section 3: Students Requiring Active Support & Active Interventions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Triage Students (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Support Triage & Early-Warning Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Students identified by attendance drops, score slumps, or fee payment lags
                </p>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Action Required
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px]">
                    <th className="pb-2">Student</th>
                    <th className="pb-2">Batch</th>
                    <th className="pb-2">Attendance</th>
                    <th className="pb-2">Risk Trigger</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DEMO_STUDENTS.slice(0, 4).map((student: DemoStudent) => (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-2.5">
                        <span className="font-bold text-slate-900 block">{student.name}</span>
                        <span className="text-[10px] text-slate-400">{student.rollNumber}</span>
                      </td>
                      <td className="py-2.5 text-slate-600">{student.batchName.slice(0, 18)}...</td>
                      <td className="py-2.5">
                        <span className={`font-mono font-semibold ${student.attendanceRate < 80 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {student.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-600 max-w-[200px] truncate" title={student.riskDriver}>
                        {student.riskDriver || 'Stable progress'}
                      </td>
                      <td className="py-2.5 text-right">
                        <Link
                          href={`/demo/student?id=${student.id}`}
                          className="px-2 py-1 rounded bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px]"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Mentorship Interventions (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Faculty Remedial Actions</h3>
                <p className="text-xs text-slate-500">Logged 1-on-1 mentorship sessions</p>
              </div>
              <span className="text-[11px] font-bold text-teal-700">4 Active</span>
            </div>

            <div className="space-y-2.5">
              {DEMO_INTERVENTIONS.map((item: DemoIntervention) => (
                <div key={item.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.studentName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-blue-100 text-blue-800">
                      {item.interventionType}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Faculty: {item.assignedFaculty} • Topic: {item.topic}
                  </div>
                  <div className="text-[10px] text-teal-700 font-medium pt-0.5">
                    Target: {item.outcomeMetric}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Case B Financial Model & ML Rigour Quick-Nav Banner */}
        <div className="bg-gradient-to-r from-[#0B1F3A] to-[#132E52] p-5 sm:p-6 rounded-2xl text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Case B: The Data Moat — Full Deliverables</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Explore 5-Sheet Revenue Model & Psychometric ML Rigour
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Evaluate our auditable financial model (1.94x ROI, 3.95 mo CAC payback, 21.1x LTV:CAC) and our LOIO-CV cross-validated ML engine (2PL IRT, BKT, and Conformal rank intervals).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/owner"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-xs transition shadow-sm flex items-center space-x-1"
            >
              <span>5-Sheet Revenue Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/model-report"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-bold rounded-xl text-xs transition"
            >
              <span>ML Rigour Suite</span>
            </Link>
            <a
              href="/2_Excel_Nextute_Case_B_Financial_Model.xlsx"
              download
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Excel</span>
            </a>
          </div>
        </div>
      </main>

      {/* Role Selection Modal */}
      <DemoRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
}
