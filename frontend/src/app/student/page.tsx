'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function StudentPage() {
  const { tenantId, selectedStudentId } = useApp();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load student personal growth data
    setLoading(true);
    setTimeout(() => {
      setData({
        student_id: selectedStudentId || 'STU00001',
        name: 'Ananya Deshmukh',
        exam: 'JEE Advanced 2026',
        streak_days: 14,
        topics_mastered: 8,
        topics_in_progress: 3,
        tests_taken: 12,
        strengths: [
          { name: 'Kinematics & 2D Motion', mastery: 86, subject: 'Physics' },
          { name: 'Chemical Bonding & Hybridization', mastery: 92, subject: 'Chemistry' },
          { name: 'Calculus: Limits & Continuity', mastery: 88, subject: 'Mathematics' },
        ],
        focus_areas: [
          {
            name: 'Rotational Dynamics & Torque',
            mastery: 48,
            subject: 'Physics',
            recommended_drill: '5-Problem Micro-Drill on Moment of Inertia Theorems',
          },
          {
            name: 'Chemical Thermodynamics',
            mastery: 54,
            subject: 'Chemistry',
            recommended_drill: 'First Law & Hess Law Calculation Practice',
          },
        ],
        recent_milestones: [
          'Earned "Mechanics Explorer" badge (Score >80% on 3 consecutive tests)',
          '14-Day uninterrupted attendance streak',
          'Completed 150 practice questions this month',
        ],
      });
      setLoading(false);
    }, 200);
  }, [selectedStudentId, tenantId]);

  return (
    <div className="space-y-6">
      {/* Zero Shaming Guarantee Badge */}
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Growth-First Student Portal:</strong> Privacy-protected space focused solely on personal conceptual mastery and constructive practice. No peer rank humiliation.
          </span>
        </div>
      </div>

      {data && (
        <>
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1E4273] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-teal-300 text-xs font-semibold uppercase tracking-wider">
                Target: {data.exam}
              </span>
              <h1 className="text-2xl font-bold mt-1">
                Keep it up, {data.name}!
              </h1>
              <p className="text-slate-300 text-xs mt-1">
                You have logged 12 evaluations with steady conceptual progress this cycle.
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10">
              <Flame className="w-6 h-6 text-amber-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-300 block">
                  Learning Streak
                </span>
                <span className="text-lg font-extrabold text-white">
                  {data.streak_days} Days Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 block">Mastered Topics</span>
              <span className="text-xl font-bold text-emerald-600 mt-1 block">
                {data.topics_mastered} Topics
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 block">In Progress</span>
              <span className="text-xl font-bold text-amber-600 mt-1 block">
                {data.topics_in_progress} Topics
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 block">Tests Completed</span>
              <span className="text-xl font-bold text-slate-800 mt-1 block">
                {data.tests_taken} Tests
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 block">Milestones Earned</span>
              <span className="text-xl font-bold text-teal-600 mt-1 block">
                3 Badges
              </span>
            </div>
          </div>

          {/* Concepts to Review Next (Remedials) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-teal-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Recommended Practice Modules for Today
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Personalized by BKT Knowledge Tracing
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.focus_areas.map((area: any) => (
                <div
                  key={area.name}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-teal-500 transition flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {area.subject}
                      </span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        {area.mastery}% Mastery
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mt-1">
                      {area.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {area.recommended_drill}
                    </p>
                  </div>

                  <button
                    onClick={() => alert(`Starting practice module: ${area.recommended_drill}`)}
                    className="inline-flex items-center justify-center w-full px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    <span>Start 15-Min Practice Drill</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Strong Concepts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Concepts Where You Excel
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.strengths.map((s: any) => (
                <div
                  key={s.name}
                  className="p-3.5 rounded-lg border border-emerald-100 bg-emerald-50/40 text-xs"
                >
                  <span className="text-[10px] font-bold text-emerald-700 block uppercase">
                    {s.subject}
                  </span>
                  <span className="font-bold text-slate-800 block mt-0.5">
                    {s.name}
                  </span>
                  <span className="text-emerald-700 font-semibold block mt-1">
                    {s.mastery}% Solid Conceptual Mastery
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
