'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import DemoRoleModal from '@/components/DemoRoleModal';
import { DEMO_STUDENTS, DEMO_TOPIC_MASTERY, DemoStudent } from '@/lib/demoData';
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
  FileText,
  Download,
  Check,
  X
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
  const [selectedStudentId, setSelectedStudentId] = useState<string>('STD_PAT_001');
  const [activeDrillTopic, setActiveDrillTopic] = useState<string | null>(null);
  const [selectedDrillOption, setSelectedDrillOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Active student object
  const student = DEMO_STUDENTS.find(s => s.id === selectedStudentId) || DEMO_STUDENTS[0];

  // Test Trajectory Data with Calibrated Uncertainty Interval [P10, P90]
  const trajectoryData = [
    { test: 'Milestone 1', score: 142, max: 180, percentile: 96.2, p10: 92.0, p90: 98.0 },
    { test: 'Milestone 2', score: 138, max: 180, percentile: 94.0, p10: 90.0, p90: 96.5 },
    { test: 'Milestone 3', score: 104, max: 180, percentile: 86.4, p10: 82.0, p90: 91.0 },
    { test: 'Milestone 4', score: 132, max: 180, percentile: 92.1, p10: 88.0, p90: 95.0 },
    { test: 'Mock 5 (Latest)', score: 218, max: 300, percentile: 94.5, p10: 91.0, p90: 96.5 }
  ];

  const handleDownloadTranscript = () => {
    const rows = [
      'test_name,date,subject,score,max_score,percentile',
      ...student.recentTestScores.map(t => `${t.testName},${t.date},${t.subject},${t.score},${t.maxScore},${t.percentile}`)
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${student.name.replace(/\s+/g, '_')}_growth_transcript.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

          <div className="flex flex-wrap items-center gap-3">
            {/* Student Switcher Dropdown */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <span className="text-slate-500 mr-2">Demo Persona:</span>
              <select
                aria-label="Select Demo Persona"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
              >
                {DEMO_STUDENTS.map((s: DemoStudent) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.targetExam})</option>
                ))}
              </select>
            </div>

            {/* Calibrated Percentile Forecast */}
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
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'progress'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Learning Progress & Analytics
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'practice'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Curated Practice Drills
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Test History ({student.recentTestScores.length} Tests)
            </button>
          </div>

          <button
            onClick={handleDownloadTranscript}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Download Growth Transcript</span>
          </button>
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
              <span>Class & Drill Attendance</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {student.attendanceRate}%
            </div>
            <div className="text-[11px] text-slate-500">
              {student.attendanceRate >= 90 ? 'Excellent Consistency' : 'Needs Regularity'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Focus Priority Topic</span>
              <Target className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-lg font-bold text-slate-900 truncate">
              {student.weakTopics[0] || 'Rotational Dynamics'}
            </div>
            <div className="text-[11px] text-amber-700 font-medium">
              15-minute concept practice recommended
            </div>
          </div>
        </div>

        {/* TAB 1: PROGRESS VIEW */}
        {activeTab === 'progress' && (
          <>
            {/* Split Grid: Concept Strengths vs Trajectory */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Strengths & Growth Areas (6 cols) */}
              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Your Academic Concept Map</h3>
                    <p className="text-xs text-slate-500">Mastery estimated through Bayesian Knowledge Tracing</p>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    Growth Mindset
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

                {/* Growth Areas */}
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
                          onClick={() => { setActiveDrillTopic(top); setSelectedDrillOption(null); setShowHint(false); }}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
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
                    <strong>Understanding Your Confidence Range:</strong> Rather than giving an arbitrary single number, our conformal algorithm proves you are performing securely in the {student.predictedPercentileMin}%–{student.predictedPercentileMax}% percentile range.
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
                  <p className="text-slate-600 text-[11px]">Complete 5 tangent and normal questions using (at^2, 2at) coordinates.</p>
                  <span className="inline-block text-[10px] font-semibold text-teal-600">Time: 20 mins</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Day 4 & 5 (Chemistry)</span>
                  <h4 className="font-bold text-slate-900">Buffer Solution pH Stability</h4>
                  <p className="text-slate-600 text-[11px]">Review Henderson-Hasselbalch equation and common ion effect traps.</p>
                  <span className="inline-block text-[10px] font-semibold text-teal-600">Time: 20 mins</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Day 6 & 7 (Milestone Prep)</span>
                  <h4 className="font-bold text-slate-900">Full Timed Revision Drill</h4>
                  <p className="text-slate-600 text-[11px]">Take Sunday 45-minute sprint mock before next week coaching test.</p>
                  <span className="inline-block text-[10px] font-semibold text-teal-600">Time: 45 mins</span>
                </div>
              </div>
            </section>
          </>
        )}

        {/* TAB 2: CURATED PRACTICE DRILLS */}
        {activeTab === 'practice' && (
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">15-Minute Adaptive Remedial Drills</h3>
              <p className="text-xs text-slate-500">Targeted micro-modules based on your latest error patterns</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-5 rounded-2xl border border-teal-500/30 bg-teal-50/20 space-y-3">
                <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold uppercase">Physics Module</span>
                <h4 className="font-bold text-slate-900 text-sm">Rotational Kinetic Energy Partition</h4>
                <p className="text-slate-600 text-xs">Learn to instantly decouple center-of-mass translation from angular rotation about axis.</p>
                <button
                  onClick={() => { setActiveDrillTopic('Rotational Dynamics'); setSelectedDrillOption(null); setShowHint(false); }}
                  className="w-full py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition cursor-pointer"
                >
                  Start 15-Min Drill
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-indigo-500/30 bg-indigo-50/20 space-y-3">
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase">Mathematics Module</span>
                <h4 className="font-bold text-slate-900 text-sm">Conic Normal Equations & Tangency</h4>
                <p className="text-slate-600 text-xs">Master discriminant condition c = a/m for parabolas and point of contact forms.</p>
                <button
                  onClick={() => { setActiveDrillTopic('Conic Sections'); setSelectedDrillOption(null); setShowHint(false); }}
                  className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition cursor-pointer"
                >
                  Start 15-Min Drill
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-50/20 space-y-3">
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">Chemistry Module</span>
                <h4 className="font-bold text-slate-900 text-sm">Carbocation Stability & Rearrangement</h4>
                <p className="text-slate-600 text-xs">Hydride vs methyl shift mechanisms in electrophilic addition reactions.</p>
                <button
                  onClick={() => { setActiveDrillTopic('Organic Mechanisms'); setSelectedDrillOption(null); setShowHint(false); }}
                  className="w-full py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition cursor-pointer"
                >
                  Start 15-Min Drill
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: TEST HISTORY */}
        {activeTab === 'history' && (
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Milestone Test History</h3>
                <p className="text-xs text-slate-500">Historical performance ledger for {student.name}</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">5 Milestone Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px]">
                    <th className="pb-2">Test Name</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Subject</th>
                    <th className="pb-2">Score</th>
                    <th className="pb-2">Max Marks</th>
                    <th className="pb-2 text-right">Percentile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {student.recentTestScores.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 font-bold text-slate-900">{t.testName}</td>
                      <td className="py-3 text-slate-500 font-mono text-[11px]">{t.date}</td>
                      <td className="py-3 text-slate-700">{t.subject}</td>
                      <td className="py-3 font-mono font-bold text-teal-700">{t.score}</td>
                      <td className="py-3 text-slate-400 font-mono">{t.maxScore}</td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold font-mono text-[11px]">
                          {t.percentile}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Interactive Practice Drill Modal */}
      {activeDrillTopic && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-teal-600 uppercase">15-Minute Concept Drill</span>
                <h3 className="text-base font-bold text-slate-900">{activeDrillTopic}</h3>
              </div>
              <button
                onClick={() => { setActiveDrillTopic(null); setSelectedDrillOption(null); setShowHint(false); }}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono">
              Q1: A solid cylinder of mass M and radius R rolls without slipping on a horizontal plane with velocity v. What fraction of its total kinetic energy is purely rotational?
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: 'A', text: '1/3 (Rotational = 1/3, Translational = 2/3)', correct: true },
                { key: 'B', text: '1/2 (Equal partition of energy)', correct: false },
                { key: 'C', text: '2/5 (Standard sphere ratio)', correct: false },
                { key: 'D', text: '1/4 (Pure translation dominates)', correct: false }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSelectedDrillOption(opt.key)}
                  className={`w-full p-3 rounded-xl border text-left font-semibold transition cursor-pointer ${
                    selectedDrillOption === opt.key
                      ? opt.correct
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-rose-50 border-rose-500 text-rose-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="font-bold mr-2">{opt.key}.</span> {opt.text}
                </button>
              ))}
            </div>

            {selectedDrillOption && (
              <div className={`p-3 rounded-xl text-xs font-medium ${selectedDrillOption === 'A' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                {selectedDrillOption === 'A'
                  ? '✓ Correct! For a solid cylinder, I = 0.5 * M * R^2. K_rot = 0.25 * M * v^2 and K_trans = 0.5 * M * v^2. K_total = 0.75 * M * v^2, so K_rot/K_total = 1/3.'
                  : 'Not quite. Remember that total KE is K_rot + K_trans. Check the moment of inertia formula for a solid cylinder.'}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-teal-600 font-semibold hover:underline cursor-pointer"
              >
                {showHint ? 'Hide Concept Hint' : 'Show Concept Hint'}
              </button>
              <button
                onClick={() => { setActiveDrillTopic(null); setSelectedDrillOption(null); setShowHint(false); }}
                className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 cursor-pointer shadow-xs"
              >
                Complete Drill
              </button>
            </div>

            {showHint && (
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                Hint: Use K_rot = 0.5 * I * omega^2 with I = 0.5 * M * R^2 and rolling condition v = R * omega.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Role Selection Modal */}
      <DemoRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
}
