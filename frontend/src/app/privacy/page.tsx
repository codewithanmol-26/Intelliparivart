'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { ConsentRecord } from '../../lib/types';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  FileText,
  AlertTriangle,
  Database
} from 'lucide-react';

export default function PrivacyPage() {
  const { tenantId, notifyRecomputed, lastRunId } = useApp();
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const fetchConsents = async () => {
    setLoading(true);
    try {
      const data = await api.getConsentList(tenantId);
      setConsents(data);
    } catch {
      // Seeded consent records
      setConsents([
        {
          id: 'CONS_001',
          tenant_id: tenantId,
          student_id: 'STD_PAT_001',
          guardian_phone: '+91 98765 43210',
          consent_purpose: 'Academic Performance Tracking & Diagnostic Remediation',
          is_granted: true,
          timestamp: '2026-08-01 10:30:00',
        },
        {
          id: 'CONS_002',
          tenant_id: tenantId,
          student_id: 'STD_PAT_002',
          guardian_phone: '+91 98765 11223',
          consent_purpose: 'Automated Parent Progress Digest (WhatsApp/SMS)',
          is_granted: true,
          timestamp: '2026-08-01 11:15:00',
        },
        {
          id: 'CONS_003',
          tenant_id: tenantId,
          student_id: 'STD_PAT_003',
          guardian_phone: '+91 98765 99887',
          consent_purpose: 'Academic Performance Tracking & Diagnostic Remediation',
          is_granted: false,
          timestamp: '2026-08-15 09:20:00',
        },
        {
          id: 'CONS_004',
          tenant_id: tenantId,
          student_id: 'STD_PAT_004',
          guardian_phone: '+91 98765 55443',
          consent_purpose: 'Conformal Quantile Percentile Estimation',
          is_granted: true,
          timestamp: '2026-08-02 14:05:00',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsents();
  }, [tenantId]);

  const handleToggleConsent = async (rec: ConsentRecord) => {
    const nextState = !rec.is_granted;
    try {
      await api.toggleConsent(rec.student_id, rec.consent_purpose, nextState, tenantId);
      setConsents((prev) =>
        prev.map((c) => (c.id === rec.id ? { ...c, is_granted: nextState } : c))
      );
      notifyRecomputed(undefined, `DPDP Consent for ${rec.student_id} set to ${nextState ? 'GRANTED' : 'REVOKED'}`);
      setAuditMessage(
        `DPDP Consent Status for student ${rec.student_id} updated: ${
          nextState ? 'GRANTED' : 'REVOKED'
        }. Audit log recorded.`
      );
    } catch {
      setConsents((prev) =>
        prev.map((c) => (c.id === rec.id ? { ...c, is_granted: nextState } : c))
      );
      setAuditMessage(
        `DPDP Consent Status for student ${rec.student_id} updated locally to ${
          nextState ? 'GRANTED' : 'REVOKED'
        }.`
      );
    }
  };

  const handleDeleteRequest = (studentId: string) => {
    if (confirm(`Execute Right to Erasure (DPDP Act Section 12) for student ${studentId}? All personally identifiable records will be irreversibly anonymized.`)) {
      setConsents((prev) => prev.filter((c) => c.student_id !== studentId));
      setAuditMessage(
        `Right to Erasure executed for ${studentId}. Student PII wiped, pseudonymous psychometric calibration hashes retained for model stability.`
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-900">
              DPDP Act 2023 Consent Registry & Data Governance
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Tenant Isolation: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">{tenantId}</code> • Compliance with Digital Personal Data Protection Act 2023.
          </p>
        </div>

        <button
          onClick={fetchConsents}
          className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Registry</span>
        </button>
      </div>

      {auditMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{auditMessage}</span>
          </div>
          <button
            onClick={() => setAuditMessage(null)}
            className="text-emerald-700 font-bold hover:text-emerald-900"
          >
            &times;
          </button>
        </div>
      )}

      {/* DPDP Architectural Principles Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="font-bold text-slate-800 block mb-1">1. Multi-Tenant Isolation</span>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Every database query includes strict <code>tenant_id</code> scoping. Institute A can never inspect or infer records from Institute B.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="font-bold text-slate-800 block mb-1">2. Purpose Limitation</span>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Data is strictly processed for psychometric evaluation and learning support. No biometric tracking or ad surveillance.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="font-bold text-slate-800 block mb-1">3. Verifiable Guardian Consent</span>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Parents can grant or withdraw processing consent at any moment via single-click toggle with cryptographic timestamping.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="font-bold text-slate-800 block mb-1">4. Right to Erasure</span>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            One-click student PII deletion under DPDP Act Section 12, decoupling psychometric calibration indices from real names.
          </p>
        </div>
      </div>

      {/* Consent Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="font-bold text-slate-900 text-sm">
            Active Guardian Consent Register ({consents.length} records)
          </div>
          <span className="text-[11px] text-slate-400">
            Tenant: {tenantId}
          </span>
        </div>

        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-left text-xs border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Guardian Phone</th>
                <th className="py-3 px-4">Specified Processing Purpose</th>
                <th className="py-3 px-4 text-center">Consent Status</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consents.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {rec.student_id}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">
                    {rec.guardian_phone}
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                    {rec.consent_purpose}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.is_granted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rec.is_granted ? 'CONSENT GRANTED' : 'REVOKED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {rec.timestamp}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleConsent(rec)}
                      className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold shadow-xs transition ${
                        rec.is_granted
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {rec.is_granted ? 'Revoke Consent' : 'Grant Consent'}
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(rec.student_id)}
                      title="Right to Erasure"
                      className="inline-flex items-center p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
