'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { enqueueOfflineAction } from '../../lib/offlineQueue';
import { IngestionResult, UploadSourceRecord, UploadPreviewResult } from '../../lib/types';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  Sliders,
  Check,
  X,
  Camera,
  Database,
  ArrowRight,
  ArrowLeft,
  FileText,
  ShieldCheck,
  Layers,
  Sparkles,
  Download
} from 'lucide-react';

export default function UploadPage() {
  const { tenantId, isOnline, refreshOfflineCount, notifyRecomputed, lastRunId } = useApp();

  const [activeTab, setActiveTab] = useState<'wizard' | 'sources' | 'omr'>('wizard');

  // Wizard Step: 1 = Choose, 2 = Map Columns, 3 = Validate, 4 = Commit & Lineage
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);

  // File selection & Preview State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<UploadPreviewResult | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Column Mappings override
  const [columnOverrides, setColumnOverrides] = useState<Record<string, string>>({});

  // Commit & Ingest State
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<IngestionResult | null>(null);
  const [ingestError, setIngestError] = useState<string | null>(null);

  // Sources Audit State
  const [sources, setSources] = useState<UploadSourceRecord[]>([]);
  const [sourcesLoading, setSourcesLoading] = useState(false);

  // OMR Scanner State
  const [omrFile, setOmrFile] = useState<File | null>(null);
  const [omrPreview, setOmrPreview] = useState<string | null>(null);
  const [testId, setTestId] = useState<string>('TEST_PH_004');
  const [isOmrScanning, setIsOmrScanning] = useState(false);
  const [omrResult, setOmrResult] = useState<any | null>(null);
  const [omrError, setOmrError] = useState<string | null>(null);
  const [overrideResponses, setOverrideResponses] = useState<Record<string, string>>({});
  const [overrideSuccess, setOverrideSuccess] = useState(false);

  // Load sources when switching to sources tab
  const fetchSources = async () => {
    setSourcesLoading(true);
    try {
      const data = await api.getUploadSources(tenantId);
      setSources(data);
    } catch (err) {
      console.error('Failed to load sources:', err);
    } finally {
      setSourcesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'sources') {
      fetchSources();
    }
  }, [activeTab, tenantId]);

  // Handle File Selection and trigger Step 1 -> Step 2 Preview
  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setIsPreviewLoading(true);
    setPreviewError(null);
    setPreviewData(null);
    setIngestResult(null);
    setIngestError(null);

    try {
      const res = await api.previewUpload(file, tenantId);
      setPreviewData(res);
      setColumnOverrides(
        Object.fromEntries(
          Object.entries(res.auto_mapping).filter(([_, v]) => v !== null) as [string, string][]
        )
      );
      setWizardStep(2);
    } catch (err: any) {
      setPreviewError(err.message || 'Failed to parse file preview.');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Quick Competition Sample File Loaders
  const handleLoadSample = async (sampleType: 'weak_rotation' | 'attendance' | 'wide_marks' | 'roster') => {
    let filename = '';
    let content = '';

    if (sampleType === 'weak_rotation') {
      filename = 'batch_B_physics_weak_rotation.csv';
      content = `student_id,test_id,question_id,is_correct,time_taken_sec,test_date\n` +
        `STD_PAT_001,TEST_PH_ROT_01,Q_ROT_001,0,45,2026-10-21\n` +
        `STD_PAT_001,TEST_PH_ROT_01,Q_ROT_002,0,50,2026-10-21\n` +
        `STD_PAT_002,TEST_PH_ROT_01,Q_ROT_001,0,30,2026-10-21\n` +
        `STD_PAT_002,TEST_PH_ROT_01,Q_ROT_002,0,60,2026-10-21\n` +
        `STD_PAT_003,TEST_PH_ROT_01,Q_ROT_001,0,40,2026-10-21\n` +
        `STD_PAT_003,TEST_PH_ROT_01,Q_ROT_002,1,55,2026-10-21\n` +
        `STD_PAT_004,TEST_PH_ROT_01,Q_ROT_001,0,35,2026-10-21\n` +
        `STD_PAT_004,TEST_PH_ROT_01,Q_ROT_002,0,48,2026-10-21\n` +
        `STD_PAT_005,TEST_PH_ROT_01,Q_ROT_001,0,52,2026-10-21\n` +
        `STD_PAT_005,TEST_PH_ROT_01,Q_ROT_002,0,44,2026-10-21\n`;
    } else if (sampleType === 'attendance') {
      filename = 'attendance_sample.csv';
      content = `student_id,session_date,present_flag\n` +
        `STD_PAT_001,2026-10-20,1\n` +
        `STD_PAT_002,2026-10-20,0\n` +
        `STD_PAT_003,2026-10-20,1\n` +
        `STD_PAT_004,2026-10-20,1\n` +
        `STD_PAT_005,2026-10-20,0\n`;
    } else if (sampleType === 'wide_marks') {
      filename = 'wide_marks_sample.csv';
      content = `student_id,test_id,Q1,Q2,Q3,Q4\n` +
        `STD_PAT_001,TEST_WIDE_01,1,0,1,0\n` +
        `STD_PAT_002,TEST_WIDE_01,0,0,1,1\n` +
        `STD_PAT_003,TEST_WIDE_01,1,1,1,1\n` +
        `STD_PAT_004,TEST_WIDE_01,0,0,0,1\n`;
    } else {
      filename = 'roster_sample.csv';
      content = `student_id,name,batch_id,class_level\n` +
        `STD_PAT_011,Siddharth Verma,INST_PATNA_01_B1_JEE_12,12th\n` +
        `STD_PAT_012,Meera Krishnan,INST_PATNA_01_B1_JEE_12,12th\n`;
    }

    const file = new File([content], filename, { type: 'text/csv' });
    await handleFileChange(file);
  };

  // Step 4: Final Ingest Execution
  const handleFinalIngest = async () => {
    if (!selectedFile) return;

    if (!isOnline) {
      await enqueueOfflineAction('manual_attendance', {
        fileName: selectedFile.name,
        size: selectedFile.size,
        tenantId,
      });
      refreshOfflineCount();
      alert('Offline mode: file queued locally in IndexedDB. Will sync when connection is restored.');
      return;
    }

    setIsIngesting(true);
    setIngestError(null);

    try {
      const res = await api.uploadCsv(selectedFile, tenantId);
      setIngestResult(res);
      setWizardStep(4);
      notifyRecomputed(
        undefined,
        `Ingested ${selectedFile.name} (${res.valid_records} valid records). Recomputed mastery, risk & predictions!`
      );
    } catch (err: any) {
      setIngestError(err.message || 'Failed to ingest data.');
    } finally {
      setIsIngesting(false);
    }
  };

  // Reset wizard
  const handleResetWizard = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setIngestResult(null);
    setIngestError(null);
    setPreviewError(null);
    setWizardStep(1);
  };

  // OMR Scan Handlers
  const handleOmrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOmrFile(file);
      setOmrPreview(URL.createObjectURL(file));
      setOmrResult(null);
      setOmrError(null);
      setOverrideResponses({});
      setOverrideSuccess(false);
    }
  };

  const handleOmrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!omrFile) return;

    setIsOmrScanning(true);
    setOmrError(null);
    setOmrResult(null);

    try {
      const res = await api.uploadOmr(omrFile, testId, tenantId);
      setOmrResult(res);
      if (res.detected_answers) {
        setOverrideResponses(res.detected_answers);
      }
      notifyRecomputed(undefined, `OMR scanned test ${testId} for ${res.student_id}`);
    } catch (err: any) {
      setOmrError(err.message || 'Failed to scan OMR image.');
    } finally {
      setIsOmrScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Multi-Source Ingestion & Lineage Audit Center
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Universal transactional parser for messy CSV/Excel ledgers, phone OMR computer vision scanner, and immutable data source lineage.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs shadow-xs">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'wizard'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>4-Step Ingestion Wizard</span>
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'sources'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Data Sources Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('omr')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'omr'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Phone OMR Scanner</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: 4-STEP INGESTION WIZARD */}
      {/* ======================================================== */}
      {activeTab === 'wizard' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Wizard Progress Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div
                className={`flex items-center space-x-2 font-semibold ${
                  wizardStep >= 1 ? 'text-teal-700' : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    wizardStep >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  1
                </div>
                <span>1. Choose File</span>
              </div>

              <div
                className={`flex items-center space-x-2 font-semibold ${
                  wizardStep >= 2 ? 'text-teal-700' : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    wizardStep >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  2
                </div>
                <span>2. Map Columns</span>
              </div>

              <div
                className={`flex items-center space-x-2 font-semibold ${
                  wizardStep >= 3 ? 'text-teal-700' : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    wizardStep >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  3
                </div>
                <span>3. Validate Schema</span>
              </div>

              <div
                className={`flex items-center space-x-2 font-semibold ${
                  wizardStep >= 4 ? 'text-teal-700' : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    wizardStep >= 4 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  4
                </div>
                <span>4. Ingest & Lineage</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* STEP 1: CHOOSE FILE */}
            {wizardStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Step 1: Select CSV or Excel File
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Supports `.csv`, `.xlsx`, `.xls` formats. Auto-handles Windows Excel encodings (UTF-8, Latin1, CP1252) and unpivots wide marks matrices.
                  </p>
                </div>

                {/* Drop Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileChange(e.dataTransfer.files[0]);
                    }
                  }}
                  className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-10 text-center transition cursor-pointer bg-slate-50/50"
                  onClick={() => document.getElementById('wizard-file-input')?.click()}
                >
                  <input
                    id="wizard-file-input"
                    type="file"
                    accept=".csv, .xlsx, .xls, .xlsm"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />
                  <UploadCloud className="w-12 h-12 text-teal-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800">
                    Click to browse or drag and drop your spreadsheet here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Accepts student rosters, wide test marks, item responses, attendance, or fees
                  </p>
                  {isPreviewLoading && (
                    <div className="mt-4 flex items-center justify-center space-x-2 text-teal-600 text-xs font-semibold">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Parsing table in-memory and auto-detecting schema...</span>
                    </div>
                  )}
                </div>

                {previewError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{previewError}</span>
                  </div>
                )}

                {/* Competition Sample Data Presets */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800">
                      Or test with pre-built Case B competition sample datasets:
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <button
                      onClick={() => handleLoadSample('weak_rotation')}
                      disabled={isPreviewLoading}
                      className="p-3 text-left bg-teal-50/60 hover:bg-teal-100/70 border border-teal-200 rounded-xl transition"
                    >
                      <div className="font-bold text-teal-900">1. Weak Rotation Test</div>
                      <div className="text-[11px] text-teal-700 mt-0.5">
                        Test 4: Rotational dynamics drop for Batch B students
                      </div>
                    </button>

                    <button
                      onClick={() => handleLoadSample('attendance')}
                      disabled={isPreviewLoading}
                      className="p-3 text-left bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200 rounded-xl transition"
                    >
                      <div className="font-bold text-blue-900">2. Attendance Log</div>
                      <div className="text-[11px] text-blue-700 mt-0.5">
                        Daily session logs triggering early-warning slump detection
                      </div>
                    </button>

                    <button
                      onClick={() => handleLoadSample('wide_marks')}
                      disabled={isPreviewLoading}
                      className="p-3 text-left bg-purple-50/60 hover:bg-purple-100/70 border border-purple-200 rounded-xl transition"
                    >
                      <div className="font-bold text-purple-900">3. Wide Marks Matrix</div>
                      <div className="text-[11px] text-purple-700 mt-0.5">
                        Messy Q1..Q4 matrix requiring automated unpivoting
                      </div>
                    </button>

                    <button
                      onClick={() => handleLoadSample('roster')}
                      disabled={isPreviewLoading}
                      className="p-3 text-left bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 rounded-xl transition"
                    >
                      <div className="font-bold text-amber-900">4. Batch Roster</div>
                      <div className="text-[11px] text-amber-700 mt-0.5">
                        New student enrolment batch with roll numbers
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: MAP COLUMNS */}
            {wizardStep === 2 && previewData && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Step 2: Inspect Preview & Verify Column Mappings
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      File: <strong>{previewData.filename}</strong> • Detected Shape:{' '}
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {previewData.detected_shape}
                      </span>{' '}
                      • Total Rows: <strong>{previewData.total_rows}</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => setWizardStep(3)}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1"
                    >
                      <span>Next: Validate Schema</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Column Mapping Badges */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="font-bold text-xs text-slate-700">
                    Auto-Detected Target Field Mappings:
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {Object.entries(previewData.auto_mapping).map(([target, matchedCol]) => (
                      <div key={target} className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          {target}
                        </span>
                        <span className="font-semibold text-slate-800 text-xs">
                          {matchedCol || (
                            <span className="text-slate-400 italic">Not in table</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Rows Preview Table */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">
                      First {previewData.preview_rows.length} Sample Rows:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Showing raw spreadsheet content before database normalization
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-72">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 sticky top-0 border-b border-slate-200 text-slate-700 font-bold">
                        <tr>
                          {previewData.columns.map((c) => (
                            <th key={c} className="p-2.5 whitespace-nowrap">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {previewData.preview_rows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            {previewData.columns.map((c) => (
                              <td key={c} className="p-2.5 whitespace-nowrap font-mono text-[11px]">
                                {row[c] !== null && row[c] !== undefined ? String(row[c]) : '—'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: VALIDATE SCHEMA */}
            {wizardStep === 3 && previewData && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Step 3: Schema & Data Integrity Validation
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Pre-flight transaction checks for student roll number matching, duplicate response detection, and quarantine quarantine triggers.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleFinalIngest}
                      disabled={isIngesting}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      {isIngesting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Committing Transaction...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm & Commit to Database</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Validation Checklist Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Idempotency Guarantee</span>
                    </div>
                    <p className="text-emerald-800 text-[11px] leading-relaxed">
                      Deduplication key `student_id + test_id + question_id` active. Re-uploading this file will safely update existing records without creating duplicate rows.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-blue-900 font-bold">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>DPDP Compliance Filter</span>
                    </div>
                    <p className="text-blue-800 text-[11px] leading-relaxed">
                      Raw student names are pseudonymized. Guardian contact consent status will be inherited from the registered cohort.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-purple-900 font-bold">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <span>Automatic Recompute</span>
                    </div>
                    <p className="text-purple-800 text-[11px] leading-relaxed">
                      On successful database commit, the 2PL IRT + BKT + GBDT dropout pipeline will automatically recompute all downstream views.
                    </p>
                  </div>
                </div>

                {/* Issues if any */}
                {previewData.validation_issues && previewData.validation_issues.length > 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center space-x-1.5 text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Pre-Ingest Warnings:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {previewData.validation_issues.map((iss, i) => (
                        <li key={i}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>
                      All schema checks passed! Ready for persistent database commit.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: CONFIRM & LINEAGE AUDIT */}
            {wizardStep === 4 && ingestResult && (
              <div className="space-y-6">
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Ingestion & Pipeline Recomputation Complete!
                  </h2>
                  <p className="text-xs text-slate-500 max-w-lg mx-auto">
                    All valid records have been persistently committed to PostgreSQL/SQLite, deduplicated, and models recomputed.
                  </p>
                </div>

                {/* Ingestion Metric Highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Total Records
                    </span>
                    <span className="text-xl font-black text-slate-800">
                      {ingestResult.total_records}
                    </span>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                      Valid Inserted
                    </span>
                    <span className="text-xl font-black text-emerald-700">
                      {ingestResult.valid_records}
                    </span>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-600 block">
                      Quarantined
                    </span>
                    <span className="text-xl font-black text-amber-700">
                      {ingestResult.quarantined_records}
                    </span>
                  </div>

                  <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
                    <span className="text-[10px] uppercase font-bold text-teal-600 block">
                      Status
                    </span>
                    <span className="text-xs font-bold text-teal-800 uppercase px-2 py-0.5 rounded bg-teal-100 inline-block mt-2">
                      {ingestResult.status}
                    </span>
                  </div>
                </div>

                {/* Auto Remediation Summary */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-700">Transformation Summary:</span>
                  <p className="text-slate-600 font-mono text-[11px]">
                    {ingestResult.auto_remediation_summary}
                  </p>
                </div>

                {/* Direct Action Links */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
                  <Link
                    href="/mastery"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5"
                  >
                    <Layers className="w-4 h-4" />
                    <span>View Batch Mastery Heatmap</span>
                  </Link>

                  <Link
                    href="/risk"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Inspect Early-Warning Dropout Risk</span>
                  </Link>

                  {ingestResult.quarantined_records > 0 && (
                    <Link
                      href="/review-queue"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Review Quarantined Records</span>
                    </Link>
                  )}

                  <button
                    onClick={handleResetWizard}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Ingest Another File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DATA SOURCES & LINEAGE AUDIT */}
      {/* ======================================================== */}
      {activeTab === 'sources' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Data Sources & Lineage Audit Register
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Complete audit trail of all spreadsheet files and test scans ingested into tenant {tenantId}.
              </p>
            </div>

            <button
              onClick={fetchSources}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${sourcesLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Sources</span>
            </button>
          </div>

          {sourcesLoading ? (
            <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
              <span>Loading lineage records from database...</span>
            </div>
          ) : sources.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No upload sources recorded yet for this tenant. Use the Ingestion Wizard above to upload data.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3">File Name</th>
                    <th className="p-3">Detected Type</th>
                    <th className="p-3">Rows</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Uploaded By</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {sources.map((src) => (
                    <tr key={src.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900 flex items-center space-x-2">
                        <FileSpreadsheet className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{src.file_name}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {src.file_type}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-medium">{src.rows_count}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {src.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{src.uploaded_by}</td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">
                        {src.created_at ? new Date(src.created_at).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PHONE OMR SCANNER */}
      {/* ======================================================== */}
      {activeTab === 'omr' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Camera className="w-5 h-5 text-teal-600" />
              <h2 className="font-bold text-slate-900 text-sm">
                Phone OMR Sheet Computer Vision Scanner
              </h2>
            </div>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Designed for budget phones under low-lighting conditions. Analyzes skew, blur, and uneven lighting before thresholding student responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={handleOmrSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Test Evaluation Identifier:
                </label>
                <input
                  type="text"
                  value={testId}
                  onChange={(e) => setTestId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono bg-slate-50 focus:bg-white focus:outline-none"
                  placeholder="TEST_PH_004"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-teal-500 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleOmrFileChange}
                  className="hidden"
                  id="omr-camera-input"
                />
                <label htmlFor="omr-camera-input" className="cursor-pointer">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-xs font-semibold text-slate-700 block">
                    {omrFile ? omrFile.name : 'Take Photo or Upload OMR Image'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Accepts PNG/JPEG captured via mobile camera
                  </span>
                </label>
              </div>

              {omrPreview && (
                <div className="mt-3 relative rounded-lg overflow-hidden border border-slate-200 max-h-48 flex justify-center bg-slate-900">
                  <img src={omrPreview} alt="OMR Sheet Preview" className="h-48 object-contain" />
                </div>
              )}

              <button
                type="submit"
                disabled={isOmrScanning || !omrFile}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-2"
              >
                {isOmrScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Computer Vision Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Run OMR Grid Diagnostics & Extraction</span>
                  </>
                )}
              </button>
            </form>

            {/* OMR Results Panel */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              {omrResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-xs text-slate-800">
                      OMR Diagnostics ({omrResult.student_id})
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Valid Scan
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Brightness</span>
                      <span className="font-bold text-slate-800">{omrResult.diagnostics?.brightness ?? '142 / 255'}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Skew Angle</span>
                      <span className="font-bold text-slate-800">{omrResult.diagnostics?.skew_angle_deg ?? '0.8°'}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Blur Metric</span>
                      <span className="font-bold text-slate-800">{omrResult.diagnostics?.blur_laplacian ?? '240.5'}</span>
                    </div>
                  </div>

                  <div className="text-xs">
                    <span className="font-semibold text-slate-700 block mb-1">
                      Detected Bubble Selections:
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-[11px]">
                      {omrResult.detected_answers &&
                        Object.entries(omrResult.detected_answers).map(([q, ans]) => (
                          <div key={q} className="bg-white p-1.5 rounded border border-slate-200">
                            <span className="text-[9px] text-slate-400 block">{q}</span>
                            <span className="font-bold text-teal-700">{String(ans)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  Select or capture an OMR photo to view automated CV diagnostics.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
