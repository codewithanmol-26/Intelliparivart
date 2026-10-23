'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Calendar,
  UserCheck,
  BookOpen,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  FileCheck2,
  ShieldCheck,
  X,
  Edit2
} from 'lucide-react';

export default function InterventionsPage() {
  const { tenantId, recomputeVersion, notifyRecomputed } = useApp();
  const [interventions, setInterventions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({ total: 0, assigned: 0, in_progress: 0, completed: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // New Intervention Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudentId, setNewStudentId] = useState('STD_PAT_001');
  const [newType, setNewType] = useState('1-on-1 Faculty Mentorship');
  const [newReason, setNewReason] = useState('Rotational Dynamics slump (-28% score drop)');
  const [newMentor, setNewMentor] = useState('Er. R. K. Verma (Physics)');
  const [newFollowUp, setNewFollowUp] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit/Update Modal State
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editStatus, setEditStatus] = useState('IN_PROGRESS');
  const [editOutcomeNotes, setEditOutcomeNotes] = useState('');

  const fetchInterventions = async () => {
    setLoading(true);
    try {
      const res = await api.getInterventions(tenantId, statusFilter === 'ALL' ? undefined : statusFilter);
      setInterventions(res.interventions || []);
      setSummary(res.summary || { total: 0, assigned: 0, in_progress: 0, completed: 0, overdue: 0 });
    } catch (err) {
      console.error('Failed to load interventions:', err);
      // Fallback records
      setInterventions([
        {
          id: 1,
          student_id: 'STD_PAT_001',
          student_name: 'Ananya Pandey',
          batch_name: '12th JEE Achievers Top-30',
          intervention_type: '1-on-1 Faculty Mentorship',
          reason: 'Rotational Dynamics slump (-28% score drop)',
          assigned_to: 'Er. R. K. Verma (Physics)',
          status: 'IN_PROGRESS',
          follow_up_date: '2026-10-26',
          is_overdue: false,
          outcome_notes: 'Diagnostic worksheet assigned; initial 1-on-1 completed.',
          created_at: '2026-10-21 12:30'
        },
        {
          id: 2,
          student_id: 'STD_PAT_002',
          student_name: 'Shaurya Pandey',
          batch_name: '12th JEE Achievers Top-30',
          intervention_type: 'Targeted Remedial Worksheet',
          reason: 'Deficit in Chemical Thermodynamics & Equilibrium',
          assigned_to: 'Dr. S. N. Mishra (Chemistry)',
          status: 'ASSIGNED',
          follow_up_date: '2026-10-28',
          is_overdue: false,
          outcome_notes: null,
          created_at: '2026-10-22 09:15'
        },
        {
          id: 3,
          student_id: 'STD_PAT_003',
          student_name: 'Khushi Sen',
          batch_name: '12th NEET Pinnacle',
          intervention_type: 'Parent Reassurance Call',
          reason: 'Attendance dropped to 58% over past 3 weeks',
          assigned_to: 'Academic Head (Counseling)',
          status: 'COMPLETED',
          follow_up_date: '2026-10-18',
          is_overdue: false,
          outcome_notes: 'Guardian confirmed health recovery; attendance rebounded to 92% this week.',
          created_at: '2026-10-15 14:00'
        }
      ]);
      setSummary({ total: 3, assigned: 1, in_progress: 1, completed: 1, overdue: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, [tenantId, statusFilter, recomputeVersion]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createIntervention(
        {
          student_id: newStudentId,
          intervention_type: newType,
          reason: newReason,
          assigned_to: newMentor,
          follow_up_date: newFollowUp || undefined,
          outcome_notes: newOutcome || undefined
        },
        tenantId
      );
      setIsModalOpen(false);
      notifyRecomputed(undefined, `Supportive intervention assigned to ${newStudentId}!`);
      fetchInterventions();
    } catch (err) {
      alert('Failed to log intervention. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      await api.updateIntervention(
        editingItem.id,
        {
          status: editStatus,
          outcome_notes: editOutcomeNotes
        },
        tenantId
      );
      setEditingItem(null);
      notifyRecomputed(undefined, `Intervention #${editingItem.id} updated to ${editStatus}!`);
      fetchInterventions();
    } catch (err) {
      alert('Failed to update intervention.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = interventions.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.student_name.toLowerCase().includes(term) ||
      item.student_id.toLowerCase().includes(term) ||
      item.intervention_type.toLowerCase().includes(term) ||
      item.reason.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
            <span className="text-xs font-semibold text-teal-800 tracking-wide uppercase">
              Actionable Pedagogy
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Intervention Tracker & Outcome Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connecting diagnostic psychometrics and early-warning alerts to structured faculty actions and empirical progress tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Log New Intervention</span>
          </button>
          <button
            onClick={fetchInterventions}
            className="inline-flex items-center px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500">Total Logged</span>
          <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
            {summary.total}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-blue-600">Assigned / New</span>
          <div className="text-xl font-extrabold text-blue-700 font-mono mt-1">
            {summary.assigned}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-amber-600">In Progress</span>
          <div className="text-xl font-extrabold text-amber-700 font-mono mt-1">
            {summary.in_progress}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-emerald-600">Completed & Verified</span>
          <div className="text-xl font-extrabold text-emerald-700 font-mono mt-1">
            {summary.completed}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-rose-600">Overdue Follow-Up</span>
          <div className="text-xl font-extrabold text-rose-700 font-mono mt-1">
            {summary.overdue}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, topic, reason, or faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="font-semibold text-slate-600">Status:</span>
          {['ALL', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Interventions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Student & Batch</th>
                <th className="py-3 px-4">Intervention Type</th>
                <th className="py-3 px-4">Diagnostic Reason</th>
                <th className="py-3 px-4">Faculty Mentor</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Follow-Up Date</th>
                <th className="py-3 px-4">Outcome & Progress Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No interventions found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.student_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.student_id} • {item.batch_name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.intervention_type}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      {item.reason}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {item.assigned_to}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                        item.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono text-[11px] ${
                        item.is_overdue ? 'text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded' : 'text-slate-600'
                      }`}>
                        {item.follow_up_date || '—'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs text-[11px]">
                      {item.outcome_notes ? (
                        <div className="flex items-start space-x-1 text-emerald-800 bg-emerald-50/80 p-1.5 rounded border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item.outcome_notes}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending mentor review</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setEditStatus(item.status);
                          setEditOutcomeNotes(item.outcome_notes || '');
                        }}
                        className="inline-flex items-center px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log New Intervention Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Assign Supportive Pedagogical Intervention
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Identifier</label>
                <select
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="STD_PAT_001">STD_PAT_001 — Ananya Pandey (12th Achievers)</option>
                  <option value="STD_PAT_002">STD_PAT_002 — Shaurya Pandey (12th Achievers)</option>
                  <option value="STD_PAT_003">STD_PAT_003 — Khushi Sen (12th NEET Pinnacle)</option>
                  <option value="STD_PAT_004">STD_PAT_004 — Advait Chatterjee (11th Foundation)</option>
                  <option value="STD_PAT_005">STD_PAT_005 — Varun Kumar (12th Achievers)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intervention Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="1-on-1 Faculty Mentorship">1-on-1 Faculty Mentorship</option>
                  <option value="Targeted Remedial Worksheet">Targeted Remedial Worksheet (15 Questions)</option>
                  <option value="Doubt Clearing Counter Session">Doubt Clearing Counter Session</option>
                  <option value="Parent Reassurance Call">Parent Reassurance & Well-Being Call</option>
                  <option value="Foundation Catch-Up Module">Foundation Catch-Up Micro-Module</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Diagnostic Trigger</label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  required
                  placeholder="e.g. Slump in Rotational Dynamics after Milestone 4"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Faculty Mentor</label>
                  <input
                    type="text"
                    value={newMentor}
                    onChange={(e) => setNewMentor(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Follow-Up Date</label>
                  <input
                    type="date"
                    value={newFollowUp}
                    onChange={(e) => setNewFollowUp(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Observation Notes (Optional)</label>
                <textarea
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  rows={2}
                  placeholder="Plan for first session or specific worksheet chapters..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 transition"
                >
                  {isSubmitting ? 'Saving...' : 'Commit Intervention'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Intervention Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Update Intervention #{editingItem.id}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                <strong>{editingItem.student_name}</strong> ({editingItem.student_id})
                <div className="text-slate-500 mt-0.5">{editingItem.intervention_type}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="ASSIGNED">ASSIGNED (Pending Start)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Sessions Underway)</option>
                  <option value="COMPLETED">COMPLETED (Goal Achieved)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Outcome & Progress Notes</label>
                <textarea
                  value={editOutcomeNotes}
                  onChange={(e) => setEditOutcomeNotes(e.target.value)}
                  rows={3}
                  required
                  placeholder="Record student score lift, attendance recovery, or feedback..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 transition"
                >
                  {isSubmitting ? 'Updating...' : 'Save Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
