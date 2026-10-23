'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Layers,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  X,
  RefreshCw,
  Clock,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

export default function StudentAnalyticsPage() {
  const { tenantId, role, selectedStudentId, setSelectedStudentId, recomputeVersion } = useApp();

  // Cohort table state
  const [students, setStudents] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('risk');
  const [order, setOrder] = useState<string>('desc');
  const [page, setPage] = useState<number>(0);
  const pageSize = 12;

  // Selected student detail 6-tab drawer state
  const [activeModalStudentId, setActiveModalStudentId] = useState<string | null>(null);
  const [studentDetail, setStudentDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'mastery' | 'attendance' | 'recommendations' | 'interventions'>('overview');

  // Load cohort students table
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.getStudents(tenantId, {
        search: searchTerm || undefined,
        risk_tier: riskFilter === 'ALL' ? undefined : riskFilter,
        sort_by: sortBy,
        order: order,
        limit: pageSize,
        offset: page * pageSize
      });
      setStudents(res.students || []);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [tenantId, searchTerm, riskFilter, sortBy, order, page, recomputeVersion]);

  // Load student detail when opened
  const openStudentModal = async (studentId: string) => {
    setActiveModalStudentId(studentId);
    setSelectedStudentId(studentId);
    setDetailLoading(true);
    setActiveTab('overview');
    try {
      const res = await api.getStudentDetail(studentId, tenantId);
      setStudentDetail(res);
    } catch (err) {
      console.error('Failed to load student detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  // If role is explicitly 'student', automatically open selected student profile
  useEffect(() => {
    if (role === 'student' && !activeModalStudentId) {
      openStudentModal(selectedStudentId || 'STD_PAT_001');
    }
  }, [role]);

  return (
    <div className="space-y-6">
      {/* Zero Shaming Guarantee Banner */}
      <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Growth-First Learning Analytics:</strong> Individual diagnostics are private and pedagogical. No public ranking, peer humiliation, or demoralizing labels.
          </span>
        </div>
        <span className="font-semibold text-[11px] text-emerald-700 hidden md:inline">
          DPDP Act 2023 Compliant
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
            <span className="text-xs font-semibold text-teal-800 tracking-wide uppercase">
              Cohort Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Student Analytics & Diagnostic Profiles
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Searchable cohort roster with historical score trajectories, topic mastery, and 6-tab deep diagnostic profiles.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchStudents}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Roster</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or roll ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-600">Risk Filter:</span>
            {['ALL', 'High', 'Moderate', 'Low'].map((rf) => (
              <button
                key={rf}
                onClick={() => {
                  setRiskFilter(rf);
                  setPage(0);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  riskFilter === rf
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {rf}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-1 border border-slate-200 rounded bg-slate-50 text-slate-800 text-xs font-medium focus:outline-none"
            >
              <option value="risk">Dropout Risk (Priority)</option>
              <option value="score">Latest Test Score</option>
              <option value="mastery">Overall Mastery %</option>
              <option value="attendance">Attendance Rate</option>
              <option value="name">Student Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cohort Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Student & Roll Code</th>
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4 text-center">Latest Score</th>
                <th className="py-3 px-4 text-center">Score Trend</th>
                <th className="py-3 px-4 text-center">Attendance</th>
                <th className="py-3 px-4 text-center">Mastery P(L)</th>
                <th className="py-3 px-4 text-center">Support Triage</th>
                <th className="py-3 px-4">Recommended Next Action</th>
                <th className="py-3 px-4 text-right">Diagnostic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-teal-600 mb-2" />
                    <span>Loading student records from database...</span>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No student records found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                students.map((st) => (
                  <tr
                    key={st.student_id}
                    onClick={() => openStudentModal(st.student_id)}
                    className="hover:bg-teal-50/40 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{st.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {st.student_id}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {st.batch_name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                      {st.latest_score_pct}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono text-[11px] font-bold ${
                        st.score_trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {st.score_trend}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                      {st.attendance_rate_pct}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        {st.overall_mastery_pct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                        st.risk_tier === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : st.risk_tier === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {st.risk_tier} Priority
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-xs truncate">
                      {st.recommended_action}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center text-teal-600 font-semibold text-xs group-hover:text-teal-800">
                        <span>Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Showing {students.length > 0 ? page * pageSize + 1 : 0} to{' '}
            {Math.min((page + 1) * pageSize, totalCount)} of {totalCount} students
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-semibold">Page {page + 1}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * pageSize >= totalCount}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6-Tab Detailed Student Profile Modal / Drawer */}
      {activeModalStudentId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {studentDetail?.overview?.student_id || activeModalStudentId}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">
                    {studentDetail?.overview?.batch_name || '12th Achievers Top-30'}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {studentDetail?.overview?.name || 'Student Profile'}
                </h2>
              </div>

              <button
                onClick={() => setActiveModalStudentId(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Bar */}
            <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-5 text-xs font-semibold gap-1">
              {[
                { id: 'overview', label: '1. Overview' },
                { id: 'tests', label: '2. Test History' },
                { id: 'mastery', label: '3. Topic Mastery' },
                { id: 'attendance', label: '4. Attendance & Doubts' },
                { id: 'recommendations', label: '5. Recommendations' },
                { id: 'interventions', label: '6. Interventions' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-teal-600 text-teal-800 font-bold bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Tab Content */}
            <div className="p-6 space-y-6 flex-1">
              {detailLoading ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-teal-600 mb-2" />
                  <span>Loading deep student diagnostics...</span>
                </div>
              ) : studentDetail ? (
                <>
                  {/* TAB 1: OVERVIEW */}
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[11px] text-slate-400">Target Exam</span>
                          <div className="font-bold text-slate-800 mt-0.5">{studentDetail.overview.target_exam}</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[11px] text-slate-400">Class Level</span>
                          <div className="font-bold text-slate-800 mt-0.5">{studentDetail.overview.class_level}</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[11px] text-slate-400">Faculty Lead</span>
                          <div className="font-bold text-slate-800 mt-0.5">{studentDetail.overview.faculty_lead}</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-[11px] text-slate-400">Learning Streak</span>
                          <div className="font-bold text-amber-600 mt-0.5 flex items-center">
                            <Flame className="w-3.5 h-3.5 mr-1" />
                            <span>{studentDetail.overview.streak_days} Days Active</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-teal-900 block">DPDP Act Section 9 Guardian Protection</span>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Parent Contact Consent is <strong>{studentDetail.overview.parent_contact_consent ? 'GRANTED' : 'REVOKED'}</strong>. Progress reports and external communications strictly adhere to purpose limitation guidelines.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: TEST HISTORY */}
                  {activeTab === 'tests' && (
                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-slate-600">
                        Chronological Assessment Progression vs Batch Average
                      </span>
                      <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <tr>
                              <th className="py-2.5 px-3">Date</th>
                              <th className="py-2.5 px-3">Test Title</th>
                              <th className="py-2.5 px-3 text-center">Score</th>
                              <th className="py-2.5 px-3 text-center">Student %</th>
                              <th className="py-2.5 px-3 text-center">Batch Avg %</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {studentDetail.test_history.map((t: any) => (
                              <tr key={t.test_id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-3 font-mono text-slate-500">{t.date}</td>
                                <td className="py-2.5 px-3 font-medium text-slate-900">{t.title}</td>
                                <td className="py-2.5 px-3 text-center font-mono">{t.student_score} / {t.max_score}</td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold text-teal-700">{t.percentage}%</td>
                                <td className="py-2.5 px-3 text-center font-mono text-slate-400">{t.batch_average_pct}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: TOPIC MASTERY */}
                  {activeTab === 'mastery' && (
                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-slate-600">
                        Psychometric Knowledge State Estimates (BKT & 2PL IRT)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {studentDetail.topic_mastery.map((tm: any) => (
                          <div key={tm.topic_id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{tm.topic_name}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                tm.status === 'Mastered' ? 'bg-emerald-100 text-emerald-800' : tm.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {tm.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                              <span>BKT P(L): <strong>{tm.bkt_mastery_pct}%</strong></span>
                              <span>θ: <strong>{tm.irt_theta > 0 ? `+${tm.irt_theta}` : tm.irt_theta}</strong></span>
                              <span>σ: <strong>±{tm.standard_error}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: ATTENDANCE & DOUBTS */}
                  {activeTab === 'attendance' && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                          <span className="text-[11px] text-slate-400">Attendance Rate</span>
                          <div className="text-xl font-mono font-extrabold text-teal-700 mt-1">
                            {studentDetail.attendance_engagement.attendance_rate_pct}%
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                          <span className="text-[11px] text-slate-400">Doubts Asked</span>
                          <div className="text-xl font-mono font-extrabold text-blue-700 mt-1">
                            {studentDetail.attendance_engagement.doubts_asked}
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                          <span className="text-[11px] text-slate-400">Homework Submissions</span>
                          <div className="text-xl font-mono font-extrabold text-slate-800 mt-1">
                            {studentDetail.attendance_engagement.homework_submitted_count}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: RECOMMENDATIONS */}
                  {activeTab === 'recommendations' && (
                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-slate-600">
                        Tailored Concept Catch-Up Drills & Worksheets
                      </span>
                      <div className="space-y-2.5">
                        {studentDetail.recommendations.map((rec: any, idx: number) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900">{rec.action}</span>
                              <div className="text-[11px] text-slate-500">
                                Concept: {rec.topic} • Estimated Time: {rec.estimated_time}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                              {rec.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: INTERVENTION HISTORY */}
                  {activeTab === 'interventions' && (
                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-slate-600">
                        Recorded Faculty Mentorship & Outcome Lift
                      </span>
                      {studentDetail.intervention_history.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs">
                          No interventions currently recorded for this student.
                        </div>
                      ) : (
                        studentDetail.intervention_history.map((int: any) => (
                          <div key={int.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{int.intervention_type}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                                {int.status}
                              </span>
                            </div>
                            <p className="text-slate-600 text-[11px]">{int.reason}</p>
                            {int.outcome_notes && (
                              <div className="p-2 bg-emerald-50 rounded border border-emerald-100 text-emerald-800 text-[11px] flex items-center space-x-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{int.outcome_notes}</span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Data Ground Truth Verified • Anti-Leakage Temporal Cutoff
              </span>
              <button
                onClick={() => setActiveModalStudentId(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
