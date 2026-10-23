'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import {
  Download,
  FileSpreadsheet,
  Layers,
  ShieldAlert,
  FileCheck2,
  Printer,
  Calendar,
  Building2,
  Lock,
  ArrowRight,
  Database,
  CheckCircle2
} from 'lucide-react';

export default function ExportsPage() {
  const { tenantId, role } = useApp();
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const exportItems = [
    {
      id: 'mastery',
      title: 'Psychometric Topic Mastery Matrix (BKT & IRT)',
      description: 'Comprehensive student-by-topic mastery probabilities P(L), raw accuracy percentages, Item Response Theory latent ability θ estimates, and standard error bounds.',
      icon: Layers,
      filename: `intelliprivart_topic_mastery_${tenantId}.csv`,
      type: 'mastery' as const,
      color: 'teal',
      badge: 'BKT + 2PL IRT'
    },
    {
      id: 'risk-alerts',
      title: 'Early-Warning Dropout Triage & Risk Roster',
      description: 'Calibrated GBDT dropout risk probabilities, triage bands (High, Moderate, Low), and individual contributing factors (attendance slumps, score decays, fee lags).',
      icon: ShieldAlert,
      filename: `intelliprivart_risk_triage_${tenantId}.csv`,
      type: 'risk-alerts' as const,
      color: 'rose',
      badge: 'Calibrated GBDT'
    },
    {
      id: 'interventions',
      title: 'Intervention Tracking & Faculty Mentorship Logs',
      description: 'Actionable pedagogy records: student IDs, assigned faculty mentors, remedial types, scheduled follow-up dates, and recorded post-intervention outcome lifts.',
      icon: CheckCircle2,
      filename: `intelliprivart_interventions_${tenantId}.csv`,
      type: 'interventions' as const,
      color: 'emerald',
      badge: 'Pedagogy Lineage'
    },
    {
      id: 'audit-logs',
      title: 'Data Ingestion Lineage & Review Queue Audit',
      description: 'Ingestion audit register detailing raw filenames, parsed row counts, quarantined student IDs, error classifications, and cryptographic Recompute Run IDs.',
      icon: FileCheck2,
      filename: `intelliprivart_ingest_audit_${tenantId}.csv`,
      type: 'audit-logs' as const,
      color: 'blue',
      badge: 'Lineage Register'
    }
  ];

  const handleDownload = (item: typeof exportItems[0]) => {
    const url = api.getExportUrl(item.type, tenantId);
    setDownloadNotice(`Downloading genuine dataset: ${item.filename}...`);
    window.open(url, '_blank');
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
          <span className="text-xs font-semibold text-teal-800 tracking-wide uppercase">
            Data Portability & Governance
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Reports & Data Exports
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Download live CSV records generated directly from the database ground truth, scoped strictly to your institute tenant.
        </p>
      </div>

      {/* Notice Banner */}
      {downloadNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-100">
                    <Icon className="w-5 h-5 text-teal-600" />
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                  {item.filename}
                </span>

                <button
                  onClick={() => handleDownload(item)}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Parent Progress Digest Callout */}
      <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1E4273] rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Printer className="w-3.5 h-3.5" />
            <span>Printable Physical Progress Digest</span>
          </div>
          <h2 className="text-lg font-bold">
            Generate Official Student Report Card (Bilingual)
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Formatted for physical parent-teacher meetings or PDF download, with factual ground-truth verification and DPDP Act Section 9 consent gatekeeping.
          </p>
        </div>

        <a
          href="/reports"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-teal-500 text-white font-bold text-xs hover:bg-teal-600 transition shadow-md shrink-0"
        >
          <span>Open Report Generator</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </a>
      </div>
    </div>
  );
}
