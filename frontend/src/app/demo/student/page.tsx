'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import DemoRoleModal from '@/components/DemoRoleModal';
import { DEMO_STUDENTS, DEMO_TOPIC_MASTERY } from '@/lib/demoData';
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  Target,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export default function DemoStudentPage() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'progress' | 'practice' | 'history'>('progress');

  // Currently focused sample student: Aarav Sharma (Achievers Top-30)
  const student = DEMO_STUDENTS[0];

  // Test Trajectory Data with Calibrated Uncertainty Interval [P10, P90]
  const trajectoryData = [
    { test: 'Milestone 1', score: 142, max: 180, percentile: 96.2, p10: 92.0, p90: 98.0 },
    { test: 'Milestone 2', score: 138, max: 180, percentile: 94.0, p10: 90.0, p90: 96.5 },
    { test: 'Milestone 3', score: 104, max: 180, percentile: 86.4, p10: 82.0, p90: 91.0 },
    { test: 'Milestone 4', score: 132, max: 180, percentile: 92.1, p10: 88.0, p90: 95.0 },
    { test: 'Mock 5 (Latest)', score: 218, max: 300, percentile: 94.5, p10: 91.0, p90: 96.5 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Demo Banner */}
      <DemoBanner onOpenRoleModal={() => setIsRoleModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Supportive Student Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Student Growth & Practice Companion</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {student.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {student.batchName} • Roll No: {student.rollNumber} • Target: {student.targetExam} 2026
            </p>
          </div>

          {/* Calibrated Percentile Forecast (Probabilistic, not deterministic) */}
          <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-500/30 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
              Calibrated Split-Conformal Range
            </span>
            <div className="text-xl sm:text-2xl font-black text-teal-950 font-mono mt-0.5">
              {student.predictedPercentileMin}% – {student.predictedPercentileMax}%
            </div>
            <span className="text-[10px] text-teal-700 block mt-0.5">
              80% Empirical Coverage Bound (Finite-Sample Validated)
            </span>
          </div>
        </div>

        {/* 3 Overview Growth Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Overall Concept Mastery</span>
              <Award className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {student.overallPercentile}%
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Recovered +8.1% since Milestone 3</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Attendance Consistency</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {student.attendanceRate}%
            </div>
            <div className="text-[11px] text-slate-500">
              23 out of 24 classes attended this month
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Next Recommended Action</span>
              <Target className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xs font-bold text-slate-900">
              Rotational Dynamics 15-Min Drill
            </div>
            <div className="text-[11px] text-slate-500">
              Assigned by Er. R. K. Verma for Friday doubt clinic
            </div>
          </div>
        </div>

        {/* Section 2: Personal Strengths & Targeted Practice Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Concept Strengths & Focus Areas (6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Concept Map</h3>
                <p className="text-xs text-slate-500">Strengths to celebrate and topics to strengthen</p>
              </div>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Updated Post-M5
              </span>
            </div>

            {/* Strengths */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Core Strengths (High Accuracy & Speed)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {student.strongTopics.map((top: string, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-200 text-slate-800 font-medium flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{top}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Areas (Zero-Shaming, Actionable) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Topics to Practice Next (Opportunity for Quick Gains)</span>
              </span>
              <div className="space-y-2 text-xs">
                {student.weakTopics.map((top: string, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/40 border border-amber-200 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 block">{top}</span>
                      <span className="text-[11px] text-slate-500">
                        {top === 'Rotational Dynamics'
                          ? 'Review instantaneous axis of rotation & torque signs'
                          : 'Practice 5 parametric form drills for conics'}
                      </span>
                    </div>
                    <button
                      onClick={() => alert(`Starting 15-minute practice session for ${top}!`)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0"
                    >
                      Start Drill
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Test Score Trajectory with Calibrated Percentile Interval (6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Performance Trajectory & Confidence Bands
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluated scores with 80% conformal coverage interval $[P_{10}, P_{90}]$
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">M1 to M5</span>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="test" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[70, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="p90" stroke="#0D9488" fill="#0D9488" fillOpacity={0.1} name="Upper Bound (P90)" />
                  <Area type="monotone" dataKey="percentile" stroke="#0F766E" strokeWidth={2.5} fill="#0F766E" fillOpacity={0.2} name="Score Percentile" dot={{ r: 4 }} />
                  <Area type="monotone" dataKey="p10" stroke="#0D9488" fill="#0D9488" fillOpacity={0.1} name="Lower Bound (P10)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Understanding Your Confidence Range:</strong> Rather than giving an arbitrary single number, our conformal algorithm proves you are performing securely in the 91.0%–96.5% percentile range. Strengthening Rotational Dynamics will elevate your lower bound ($P_{10}$) past 93%.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Recommended Weekly Study Plan */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Recommended 7-Day Micro-Study Plan</h3>
              <p className="text-xs text-slate-500">Personalized daily 20-minute focus targets to maximize concept retention</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
              Week of Oct 24 – Oct 31
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Day 1 & 2 (Physics)</span>
              <h4 className="font-bold text-slate-900">Instantaneous Center of Rotation</h4>
              <p className="text-slate-600 text-[11px]">Solve 3 rolling-without-slipping problems with origin at contact point.</p>
              <span className="inline-block text-[10px] font-semibold text-teal-600">Time: 20 mins</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Day 3 (Mathematics)</span>
              <h4 className="font-bold text-slate-900">Conic Parametric Coordinates</h4>
              <p className="text-slate-600 text-[11px]">Complete 5 tangent and normal questions using $(at^2, 2at)$ coordinates.</p>
              <span className="inline-block text-[10px] font-semibold text-teal-600">Time: 20 mins</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Day 4 & 5 (Chemistry)</span>
              <h4 className="font-bold text-slate-900">Buffer Solution pH Stability</h4>
              <p className="text-slate-600 text-[11px]">Review Henderson-Hasselbalch equation and common ion effect traps.</p>
              <span className="inline-block text-[10px] font-semibold text-teal-600">Time: 20 mins</span>
            </div>

            <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-50/30 space-y-2">
              <span className="text-[10px] font-bold uppercase text-teal-700">Day 6 & 7 (Consolidation)</span>
              <h4 className="font-bold text-teal-950">Mentor Clinic & Formula Log</h4>
              <p className="text-slate-600 text-[11px]">Review error log with Er. R. K. Verma before Milestone Test 6.</p>
              <span className="inline-block text-[10px] font-semibold text-teal-700 font-bold">15-Min 1-on-1</span>
            </div>
          </div>
        </section>
      </main>

      {/* Role Selection Modal */}
      <DemoRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
}
