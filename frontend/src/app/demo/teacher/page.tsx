'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import DemoRoleModal from '@/components/DemoRoleModal';
import {
  DEMO_BATCHES,
  DEMO_TOPIC_MASTERY,
  DEMO_STUDENTS,
  DEMO_INTERVENTIONS,
  DemoTopicMastery,
  DemoBatch,
  DemoStudent
} from '@/lib/demoData';
import {
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Flame,
  Clock,
  Send,
  HelpCircle,
  FileCheck2,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function DemoTeacherPage() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedBatch, setSelectedBatch] = useState<string>('BATCH_TOP30');
  const [selectedTopic, setSelectedTopic] = useState<string>('Rotational Dynamics');
  const [worksheetGenerated, setWorksheetGenerated] = useState<boolean>(false);
  const [worksheetStudent, setWorksheetStudent] = useState<string>('Aarav Sharma');
  const [isInterventionCommitted, setIsInterventionCommitted] = useState<boolean>(false);

  // Filter topics by subject
  const filteredTopics = selectedSubject === 'All'
    ? DEMO_TOPIC_MASTERY
    : DEMO_TOPIC_MASTERY.filter((t: DemoTopicMastery) => t.subject === selectedSubject);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Demo Banner */}
      <DemoBanner onOpenRoleModal={() => setIsRoleModalOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Teacher & Academic Head Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Er. R. K. Verma • Senior Physics Faculty
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Lead Mentor: Achievers JEE Advanced Top-30 & Foundation 11th Batch
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <span className="text-slate-500 mr-2">Assigned Batch:</span>
              <select
                aria-label="Select Assigned Batch"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
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

        {/* 1. Topic Mastery Heatmap Section (Core Requirement) */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Bayesian Knowledge Tracing (BKT) Topic Mastery Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Calibrated probability of topic mastery $P(L_t)$ separated from lucky guesses and test difficulty
              </p>
            </div>

            {/* Subject Filter Pills */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['All', 'Physics', 'Chemistry', 'Mathematics'].map(subj => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-3 py-1 rounded-lg transition ${
                    selectedSubject === subj
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pt-2">
            {filteredTopics.map((topic: DemoTopicMastery) => {
              const pct = Math.round(topic.bktMasteryProb * 100);
              const isStruggling = topic.status === 'Struggling';
              const isMastered = topic.status === 'Mastered';
              return (
                <div
                  key={topic.topicId}
                  onClick={() => setSelectedTopic(topic.topicName)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    selectedTopic === topic.topicName
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
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {topic.topicName}
                    </h3>
                    <div className="text-[11px] text-slate-500 mt-1">
                      N = {topic.sampleSize} item evaluations
                    </div>
                  </div>

                  {/* Mastery Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-mono font-bold">
                      <span className="text-slate-500">Mastery:</span>
                      <span className={isStruggling ? 'text-rose-600' : 'text-slate-900'}>{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isStruggling
                            ? 'bg-rose-500'
                            : isMastered
                            ? 'bg-emerald-500'
                            : 'bg-teal-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Common Error / Misconception Note */}
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 line-clamp-2">
                    <strong className="text-slate-700">Friction:</strong> {topic.commonMisconception}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Remedial Worksheet Generator & Support Triage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Worksheet Generator (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1 text-xs font-bold text-teal-600 uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3-Tier Remedial Action</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  15-Minute Concept Catch-Up Worksheet
                </h3>
              </div>
              <span className="text-[11px] font-semibold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                Selected: {selectedTopic}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Generates calibrated 3-tier practice problems (Foundational $\rightarrow$ Moderate $\rightarrow$ JEE Advanced) with talking points for faculty 1-on-1 sessions.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Target Student:</label>
                  <select
                    value={worksheetStudent}
                    onChange={(e) => setWorksheetStudent(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none"
                  >
                    {DEMO_STUDENTS.map((s: DemoStudent) => (
                      <option key={s.id} value={s.name}>{s.name} ({s.rollNumber})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Target Topic:</label>
                  <div className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-teal-700">
                    {selectedTopic}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setWorksheetGenerated(true)}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center justify-center space-x-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate 3-Tier Remedial Worksheet for {worksheetStudent}</span>
              </button>
            </div>

            {/* Generated Worksheet Preview */}
            {worksheetGenerated && (
              <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-50/20 space-y-3 text-xs animate-fadeIn">
                <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
                  <span className="font-bold text-slate-900">
                    Remedial Module: {selectedTopic} ({worksheetStudent})
                  </span>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                    Generated via Pedagogical Intelligence Core
                  </span>
                </div>

                <div className="space-y-2 text-slate-700 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <strong className="text-teal-800 block text-xs">Level 1: Foundational (1-Step Concept Check)</strong>
                    A solid cylinder of mass M and radius R rolls without slipping on a horizontal surface. Calculate the ratio of rotational kinetic energy to total kinetic energy.
                    <span className="block text-[10px] text-slate-400 mt-1">Hint: Apply I_cm = 0.5 * M * R^2 and condition v = R * omega.</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <strong className="text-teal-800 block text-xs">Level 2: Moderate (Torque Sign & Equilibrium)</strong>
                    A uniform rod of length L is hinged at one end and released from rest in a horizontal position. Determine its angular velocity as it swings through the vertical plane.
                    <span className="block text-[10px] text-slate-400 mt-1">Hint: Use conservation of mechanical energy: delta U = M * g * (L/2).</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <strong className="text-teal-800 block text-xs">Level 3: JEE Advanced Standard (Combined Motion)</strong>
                    A solid sphere rests on a rough inclined plane at angle theta. Find the minimum coefficient of static friction mu_s required for pure rolling without slipping.
                    <span className="block text-[10px] text-slate-400 mt-1">Hint: Set up Newton second law for linear acceleration and torque about CM: I = 0.4 * M * R^2.</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-teal-500/20">
                  <span className="text-[11px] text-slate-500">
                    Faculty 1-on-1 Talking Point: Check if student sets the origin at the instantaneous center of zero velocity.
                  </span>
                  {isInterventionCommitted ? (
                    <div className="px-3 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold flex items-center space-x-1.5 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Committed to Ledger!</span>
                      <Link href="/interventions" className="text-teal-700 underline ml-1">View &rarr;</Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsInterventionCommitted(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-xs cursor-pointer flex items-center space-x-1 shrink-0"
                    >
                      <span>Commit to Intervention Tracker</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Students Needing Academic Support (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Students Needing Academic Attention
                </h3>
                <p className="text-xs text-slate-500">
                  Concept friction triggers in {selectedBatch === 'BATCH_TOP30' ? 'Achievers Top-30' : 'Selected Batch'}
                </p>
              </div>
              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Actionable
              </span>
            </div>

            <div className="space-y-3">
              {DEMO_STUDENTS.slice(0, 3).map((student: DemoStudent) => (
                <div
                  key={student.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500/50 bg-slate-50/50 transition space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{student.name}</span>
                      <span className="text-[10px] text-slate-400">{student.rollNumber} • {student.targetExam}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        student.riskTier === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : student.riskTier === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {student.riskTier} Risk
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/80">
                    <strong className="text-slate-800">Weak Topics:</strong> {student.weakTopics.join(', ')}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Attendance: <strong>{student.attendanceRate}%</strong>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedTopic(student.weakTopics[0] || 'Rotational Dynamics');
                        setWorksheetStudent(student.name);
                        setWorksheetGenerated(true);
                      }}
                      className="text-[11px] font-bold text-teal-600 hover:underline"
                    >
                      Prepare Worksheet &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/demo/student"
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition flex items-center justify-center space-x-1"
              >
                <span>View Full Student Roster &rarr;</span>
              </Link>
            </div>
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
