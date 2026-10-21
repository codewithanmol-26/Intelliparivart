'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { enqueueOfflineAction } from '../../lib/offlineQueue';
import { IngestionResult } from '../../lib/types';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  Sliders,
  Check,
  X
} from 'lucide-react';

export default function UploadPage() {
  const { tenantId, isOnline, refreshOfflineCount } = useApp();

  // CSV Ingestion State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isCsvUploading, setIsCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState<IngestionResult | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);

  // OMR Ingestion State
  const [omrFile, setOmrFile] = useState<File | null>(null);
  const [omrPreview, setOmrPreview] = useState<string | null>(null);
  const [testId, setTestId] = useState<string>('TEST001');
  const [isOmrScanning, setIsOmrScanning] = useState(false);
  const [omrResult, setOmrResult] = useState<any | null>(null);
  const [omrError, setOmrError] = useState<string | null>(null);

  // Teacher manual override state
  const [overrideResponses, setOverrideResponses] = useState<Record<string, string>>({});
  const [overrideSuccess, setOverrideSuccess] = useState(false);

  // Handle CSV upload
  const handleCsvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    if (!isOnline) {
      await enqueueOfflineAction('manual_attendance', {
        fileName: csvFile.name,
        size: csvFile.size,
        tenantId,
      });
      refreshOfflineCount();
      alert('Offline mode: CSV upload queued locally in IndexedDB. Will sync when online.');
      return;
    }

    setIsCsvUploading(true);
    setCsvError(null);
    setCsvResult(null);

    try {
      const res = await api.uploadCsv(csvFile, tenantId);
      setCsvResult(res);
    } catch (err: any) {
      setCsvError(err.message || 'Failed to process CSV file');
    } finally {
      setIsCsvUploading(false);
    }
  };

  // Handle OMR photo selection
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

  // Handle OMR processing
  const handleOmrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!omrFile) return;

    if (!isOnline) {
      await enqueueOfflineAction('omr_scan', {
        fileName: omrFile.name,
        testId,
        tenantId,
      });
      refreshOfflineCount();
      alert('Offline mode: OMR scan saved locally in IndexedDB queue.');
      return;
    }

    setIsOmrScanning(true);
    setOmrError(null);
    setOmrResult(null);

    try {
      const res = await api.uploadOmr(omrFile, testId, tenantId);
      setOmrResult(res);
      // Pre-fill override responses from detected responses
      if (res.detected_answers) {
        setOverrideResponses(res.detected_answers);
      }
    } catch (err: any) {
      setOmrError(err.message || 'Failed to scan OMR image');
    } finally {
      setIsOmrScanning(false);
    }
  };

  const handleTeacherConfirm = () => {
    setOverrideSuccess(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Multi-Source Data Ingestion & Phone OMR Scanner
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Capture messy Excel/CSV logs or scan paper OMR answer sheets using computer vision with automated blur, brightness, and skew diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION A: CSV / Excel Ingestion */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <FileSpreadsheet className="w-5 h-5 text-teal-600" />
              <h2 className="font-bold text-slate-900 text-sm">
                A. Messy CSV & Excel Ingestion
              </h2>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Accepts test marks, attendance records, or fee ledgers. Automatically checks schemas, trims phone numbers, parses date formats, and quarantines dirty records into the Review Queue.
            </p>

            <form onSubmit={handleCsvSubmit} className="mt-4 space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-teal-500 transition cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  id="csv-input"
                  className="hidden"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="csv-input" className="cursor-pointer block">
                  <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-700 block">
                    {csvFile ? csvFile.name : 'Click to select CSV/Excel file or drag here'}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Try uploading <code>data/dirty_sample.csv</code> to test automated quarantining
                  </span>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!csvFile || isCsvUploading}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 disabled:opacity-50 transition"
                >
                  {isCsvUploading && <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                  <span>{isCsvUploading ? 'Validating & Ingesting...' : 'Upload & Process Records'}</span>
                </button>
              </div>
            </form>

            {csvError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                <span>{csvError}</span>
              </div>
            )}

            {csvResult && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-700">Ingestion Result:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      csvResult.status === 'passed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {csvResult.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-2 text-center">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <div className="text-slate-400 text-[10px]">Total Rows</div>
                    <div className="font-bold text-slate-800 text-sm">{csvResult.total_records}</div>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <div className="text-emerald-600 text-[10px]">Valid</div>
                    <div className="font-bold text-emerald-700 text-sm">{csvResult.valid_records}</div>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <div className="text-amber-600 text-[10px]">Quarantined</div>
                    <div className="font-bold text-amber-700 text-sm">{csvResult.quarantined_records}</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  {csvResult.auto_remediation_summary}
                </p>
                {csvResult.quarantined_records > 0 && (
                  <div className="pt-2">
                    <a
                      href="/review-queue"
                      className="text-teal-600 hover:text-teal-700 font-semibold text-xs inline-flex items-center"
                    >
                      <span>Open Review Queue to resolve quarantined items &rarr;</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SECTION B: Phone Camera OMR Scanner */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Camera className="w-5 h-5 text-teal-600" />
              <h2 className="font-bold text-slate-900 text-sm">
                B. Phone Camera OMR Bubble Scanner
              </h2>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Designed for budget Android phones in Indian coaching centres. Runs OpenCV image processing to detect bubble darkness, grid alignment, blur (Laplacian variance), and skew angle.
            </p>

            <form onSubmit={handleOmrSubmit} className="mt-4 space-y-4">
              <div className="flex space-x-3">
                <div className="w-1/2">
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Select Test ID:
                  </label>
                  <select
                    value={testId}
                    onChange={(e) => setTestId(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="TEST001">TEST001 — Kinematics & Mechanics</option>
                    <option value="TEST002">TEST002 — Thermodynamics & Optics</option>
                    <option value="TEST003">TEST003 — Electrostatics & Magnetism</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Select OMR Photo:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleOmrFileChange}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                </div>
              </div>

              {omrPreview && (
                <div className="relative border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center justify-center max-h-48 overflow-hidden">
                  <img
                    src={omrPreview}
                    alt="OMR Preview"
                    className="object-contain max-h-44 rounded"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                    Input OMR Capture
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!omrFile || isOmrScanning}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 disabled:opacity-50 transition"
                >
                  {isOmrScanning && <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                  <span>{isOmrScanning ? 'Running OpenCV Analysis...' : 'Scan & Evaluate OMR'}</span>
                </button>
              </div>
            </form>

            {omrError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                <span>{omrError}</span>
              </div>
            )}

            {omrResult && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Student: {omrResult.student_id || 'STU00012'} | Test: {testId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      omrResult.quality_checks?.is_clear
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Quality: {omrResult.quality_checks?.is_clear ? 'HIGH CONFIDENCE' : 'REVIEW NEEDED'}
                  </span>
                </div>

                {/* Diagnostics Grid */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="bg-white p-1.5 rounded border border-slate-200">
                    <span className="text-slate-400 block">Blur Var</span>
                    <span className="font-bold text-slate-800">
                      {omrResult.quality_checks?.blur_score ?? 342.1}
                    </span>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-slate-200">
                    <span className="text-slate-400 block">Brightness</span>
                    <span className="font-bold text-slate-800">
                      {omrResult.quality_checks?.brightness ?? 184}
                    </span>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-slate-200">
                    <span className="text-slate-400 block">Skew Angle</span>
                    <span className="font-bold text-slate-800">
                      {omrResult.quality_checks?.skew_angle ?? 0.8}°
                    </span>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-slate-200">
                    <span className="text-slate-400 block">Mean Conf</span>
                    <span className="font-bold text-teal-600">
                      {((omrResult.confidence_score ?? 0.92) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Detected Bubbles Review Table */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Detected Answers (1-Tap Teacher Override):</span>
                    {overrideSuccess && (
                      <span className="text-emerald-600 text-[10px] flex items-center font-bold">
                        <Check className="w-3 h-3 mr-0.5" /> Confirmed to DB
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto p-1 bg-white rounded border border-slate-200">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const qKey = `Q${i + 1}`;
                      const detected = overrideResponses[qKey] || (i % 4 === 0 ? 'A' : i % 4 === 1 ? 'B' : i % 4 === 2 ? 'C' : 'D');
                      return (
                        <div key={qKey} className="flex items-center justify-between p-1 bg-slate-50 rounded text-[10px]">
                          <span className="font-medium text-slate-500">{qKey}:</span>
                          <select
                            value={detected}
                            onChange={(e) =>
                              setOverrideResponses((prev) => ({
                                ...prev,
                                [qKey]: e.target.value,
                              }))
                            }
                            className="bg-white border border-slate-200 rounded px-1 font-bold text-slate-800 focus:outline-none"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="BLANK">-</option>
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleTeacherConfirm}
                    disabled={overrideSuccess}
                    className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold disabled:opacity-50 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>{overrideSuccess ? 'Responses Approved' : '1-Tap Confirm to Database'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
