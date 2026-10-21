'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { QuarantineRecord } from '../../lib/types';
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  RefreshCw,
  Trash2,
  Edit2,
  Save,
  Check
} from 'lucide-react';

export default function ReviewQueuePage() {
  const { tenantId } = useApp();
  const [records, setRecords] = useState<QuarantineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await api.getQuarantine(tenantId);
      setRecords(data);
    } catch {
      // Mock some sample quarantined records if backend empty
      setRecords([
        {
          id: 'QR_001',
          tenant_id: tenantId,
          file_name: 'batch_alpha_test3_raw.csv',
          row_data: { student_id: 'STU_9999', score: '88/100', test_date: '2025-13-45' },
          error_type: 'INVALID_STUDENT_ID',
          error_message: 'Student ID STU_9999 not registered in active cohort',
          resolution_status: 'unresolved',
          created_at: new Date().toISOString(),
        },
        {
          id: 'QR_002',
          tenant_id: tenantId,
          file_name: 'attendance_oct_week2.csv',
          row_data: { student_id: 'STU00045', attendance_status: 'Late?', phone: '98765' },
          error_type: 'MALFORMED_PHONE',
          error_message: 'Guardian phone number 98765 contains fewer than 10 digits',
          resolution_status: 'unresolved',
          created_at: new Date().toISOString(),
        },
        {
          id: 'QR_003',
          tenant_id: tenantId,
          file_name: 'test_marks_neet_physics.csv',
          row_data: { student_id: 'STU00112', score: '105', max_score: '100' },
          error_type: 'OUT_OF_BOUNDS_SCORE',
          error_message: 'Score (105) exceeds maximum test score (100)',
          resolution_status: 'unresolved',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [tenantId]);

  const handleStartEdit = (rec: QuarantineRecord) => {
    setEditingId(rec.id);
    setEditForm({ ...rec.row_data });
  };

  const handleFieldChange = (key: string, value: any) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleResolve = async (id: string) => {
    try {
      await api.resolveQuarantine(id, editForm, tenantId);
      setActionSuccess(`Record ${id} successfully resolved and added to active dataset.`);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setEditingId(null);
    } catch {
      // In offline or prototype mode, update locally
      setActionSuccess(`Record ${id} resolved locally.`);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setEditingId(null);
    }
  };

  const handleIgnore = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setActionSuccess(`Record ${id} marked as ignored.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Data Quality & Quarantine Review Queue
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Dirty, missing, or mismatched records quarantined during ingestion. Fix errors in-place to ensure psychometric model integrity.
          </p>
        </div>

        <button
          onClick={fetchRecords}
          className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-emerald-700 font-bold hover:text-emerald-900"
          >
            &times;
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-teal-600" />
          Loading quarantined records...
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">Review Queue Clean!</h3>
          <p className="text-xs text-slate-500 mt-1">
            No malformed or quarantined records pending review for this institute.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 font-medium">
            Pending Resolution: <strong className="text-slate-800">{records.length}</strong> records
          </div>

          <div className="grid grid-cols-1 gap-4">
            {records.map((rec) => {
              const isEditing = editingId === rec.id;
              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition hover:border-slate-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {rec.error_type}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        Record #{rec.id}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({rec.file_name})
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleResolve(rec.id)}
                            className="inline-flex items-center px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs"
                          >
                            <Save className="w-3 h-3 mr-1" /> Save & Ingest
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(rec)}
                            className="inline-flex items-center px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded text-xs font-semibold"
                          >
                            <Edit2 className="w-3 h-3 mr-1" /> Quick Fix
                          </button>
                          <button
                            onClick={() => handleIgnore(rec.id)}
                            className="inline-flex items-center px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-medium"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Ignore
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-rose-700 font-medium bg-rose-50/70 p-2 rounded border border-rose-100 mb-3 flex items-center">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      <span>{rec.error_message}</span>
                    </p>

                    {isEditing ? (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="text-[11px] font-semibold text-slate-700 mb-2">
                          Edit Row Data:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {Object.keys(editForm).map((k) => (
                            <div key={k}>
                              <label className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider mb-0.5">
                                {k}
                              </label>
                              <input
                                type="text"
                                value={editForm[k] || ''}
                                onChange={(e) => handleFieldChange(k, e.target.value)}
                                className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Raw Captured Payload:
                        </div>
                        <pre className="text-xs text-slate-700 font-mono overflow-x-auto">
                          {JSON.stringify(rec.row_data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
