'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { OwnerDashboardData } from '../../lib/types';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  Layers,
  Sparkles,
  Download,
  FileSpreadsheet,
  PieChart,
  BarChart3,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Table
} from 'lucide-react';

export default function OwnerPage() {
  const { tenantId, recomputeVersion } = useApp();
  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'roi' | 'unit_econ' | 'projections' | 'sensitivity'>('roi');

  // Interactive ROI Calculator State (Directly calibrated to Sheet 2 of 2_Excel_Nextute_Case_B_Financial_Model.xlsx)
  const [cohortSize, setCohortSize] = useState<number>(400);
  const [annualFee, setAnnualFee] = useState<number>(60000);
  const [dropoutRatePct, setDropoutRatePct] = useState<number>(12); // Baseline 12%
  const [preventionEfficiencyPct, setPreventionEfficiencyPct] = useState<number>(15); // Baseline 15% saved

  // Pricing & Cost parameters (Sheet 1 & 2)
  const billingMonths = 10;
  // Tier 2: Base 300 students = ₹9,999/mo; + ₹30 per student > 300
  const monthlyPlatformFee = cohortSize <= 150
    ? 5999
    : cohortSize <= 300
      ? 9999
      : 9999 + (cohortSize - 300) * 30;
  const platformAnnualCost = monthlyPlatformFee * billingMonths;

  // Uncollected tuition lost per dropout (assumes average dropout at month 4 of 10-month session = 6 unpaid months)
  const lostFeePerDropout = (annualFee / billingMonths) * 6;
  const baselineDropouts = Math.round(cohortSize * (dropoutRatePct / 100));
  const totalTuitionLeakage = baselineDropouts * lostFeePerDropout;

  // Nextute early-warning interventions save preventionEfficiencyPct of at-risk students
  const studentsSaved = Math.round(baselineDropouts * (preventionEfficiencyPct / 100));
  const tuitionRecovered = studentsSaved * lostFeePerDropout;
  const netProfitGain = tuitionRecovered - platformAnnualCost;
  const roiMultiple = platformAnnualCost > 0 ? (tuitionRecovered / platformAnnualCost).toFixed(2) : '0.00';
  const breakevenStudents = (platformAnnualCost / lostFeePerDropout).toFixed(2);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.getOwnerDashboard(tenantId);
      setData(res);
    } catch {
      setData({
        tenant_id: tenantId,
        institute_name: 'Apex JEE & Medical Academy, Patna',
        total_enrolled: 400,
        active_students: 356,
        high_risk_count: 38,
        medium_risk_count: 52,
        low_risk_count: 266,
        retention_rate_pct: 89.0,
        estimated_dropout_loss_inr: 1728000,
        remedials_active: 28,
        batches: [
          { batch_id: 'BATCH_01', name: 'JEE Advanced Super-30', target_exam: 'JEE_ADVANCED', student_count: 30, avg_mastery: 0.78, high_risk_count: 2 },
          { batch_id: 'BATCH_02', name: 'JEE Main Foundation', target_exam: 'JEE_MAIN', student_count: 45, avg_mastery: 0.64, high_risk_count: 5 },
          { batch_id: 'BATCH_03', name: 'NEET Achievers', target_exam: 'NEET', student_count: 40, avg_mastery: 0.69, high_risk_count: 3 },
          { batch_id: 'BATCH_04', name: 'NEET Med-Starters', target_exam: 'NEET', student_count: 35, avg_mastery: 0.59, high_risk_count: 4 },
        ],
        financial_roi: {
          base_students: 400,
          annual_fee_per_student: 60000,
          retention_without_platform_pct: 88.0,
          retention_with_platform_pct: 90.0,
          students_saved: 7,
          annual_revenue_protected: 252000,
          platform_annual_cost: 129990,
          net_roi_ratio: 1.94,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [tenantId, recomputeVersion]);

  return (
    <div className="space-y-6">
      {/* Header with Title and Excel Downloads */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Institute Revenue Model & Unit Economics Cockpit
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Case B: The Data Moat — Comprehensive Financial Model & Institute ROI Suite (Finance Club, IIT Patna 2026)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Excel Workbook Download */}
          <a
            href="/2_Excel_Nextute_Case_B_Financial_Model.xlsx"
            download
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
            title="Download Authoritative 5-Sheet Excel Financial Model"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Excel Model (.xlsx)</span>
          </a>

          {/* OneDrive Cloud Viewer */}
          <a
            href="https://1drv.ms/x/c/d60414ee7b60239b/IQDt8Tm9OCY0TrB-BuRbFUM4AdbpgmjsYKaEo6IS4nLO-gE?e=u1YbJe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition"
            title="Open in Microsoft Excel Online (OneDrive)"
          >
            <span>Excel Online</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>

      {/* Cohort KPIs (Live from Database) */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Total Enrolled Cohort</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900">{data.total_enrolled}</span>
              <span className="text-xs text-emerald-600 font-semibold">{data.active_students} Active</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Tier 2 Hybrid Target Benchmark</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Mid-Session Retention Rate</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-teal-600">{data.retention_rate_pct}%</span>
              <span className="text-xs text-slate-500">Baseline: 88.0%</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">+2.0% Retention Gain from Alerts</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Annual Fee Leakage at Risk</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-rose-600">₹{(totalTuitionLeakage / 100000).toFixed(2)}L</span>
              <span className="text-xs text-rose-700 font-medium">{baselineDropouts} Dropouts</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Based on ₹{(lostFeePerDropout / 1000).toFixed(0)}k fee lost / student</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Institute Net ROI Multiple</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-emerald-600">{roiMultiple}x</span>
              <span className="text-xs text-emerald-700 font-bold">1.94x Base</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Breakeven at {breakevenStudents} students saved</span>
          </div>
        </div>
      )}

      {/* Model Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-1 sm:space-x-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('roi')}
          className={`py-2.5 px-4 rounded-t-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'roi'
              ? 'bg-[#0B1F3A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-teal-400" />
          <span>1. Institute ROI Calculator (Sheet 2)</span>
        </button>

        <button
          onClick={() => setActiveTab('unit_econ')}
          className={`py-2.5 px-4 rounded-t-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'unit_econ'
              ? 'bg-[#0B1F3A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <PieChart className="w-3.5 h-3.5 text-teal-400" />
          <span>2. Platform Unit Economics (Sheet 3)</span>
        </button>

        <button
          onClick={() => setActiveTab('projections')}
          className={`py-2.5 px-4 rounded-t-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'projections'
              ? 'bg-[#0B1F3A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <Table className="w-3.5 h-3.5 text-teal-400" />
          <span>3. 3-Year P&L & Cash Flow (Sheet 4)</span>
        </button>

        <button
          onClick={() => setActiveTab('sensitivity')}
          className={`py-2.5 px-4 rounded-t-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'sensitivity'
              ? 'bg-[#0B1F3A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
          <span>4. Two-Way Sensitivity Analysis (Sheet 5)</span>
        </button>
      </div>

      {/* TAB 1: INSTITUTE ROI CALCULATOR */}
      {activeTab === 'roi' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#0B1F3A] to-[#132E52] p-6 sm:p-8 rounded-2xl text-white shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-800/60">
              <div>
                <div className="inline-flex items-center space-x-1.5 text-teal-300 text-xs font-semibold uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Institute ROI Engine</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">
                  Coaching Institute Value Proposition & Payback Calculator
                </h2>
                <p className="text-slate-300 text-xs mt-1">
                  Vary cohort enrollment, tuition rates, and retention intervention efficiency to measure bottom-line profit protection.
                </p>
              </div>

              <div className="bg-teal-500/20 border border-teal-400/30 rounded-xl px-4 py-2 text-right">
                <span className="text-[10px] text-teal-200 block uppercase font-medium">ROI Multiple</span>
                <span className="text-2xl font-black text-teal-300">{roiMultiple}x</span>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-2 text-slate-200">
                  <span>Enrolled Cohort Size:</span>
                  <span className="text-teal-300 font-bold">{cohortSize} Students</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="1500"
                  step="25"
                  value={cohortSize}
                  onChange={(e) => setCohortSize(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Tier 2 Benchmark: 400 students</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-2 text-slate-200">
                  <span>Annual Fee per Student:</span>
                  <span className="text-teal-300 font-bold">₹{(annualFee / 1000).toFixed(0)}k / year</span>
                </div>
                <input
                  type="range"
                  min="30000"
                  max="150000"
                  step="5000"
                  value={annualFee}
                  onChange={(e) => setAnnualFee(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Patna / Kota JEE baseline: ₹60k</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-2 text-slate-200">
                  <span>Historical Dropout Rate:</span>
                  <span className="text-rose-300 font-bold">{dropoutRatePct}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={dropoutRatePct}
                  onChange={(e) => setDropoutRatePct(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Industry average: 8% to 15%</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-2 text-slate-200">
                  <span>Prevention Efficiency:</span>
                  <span className="text-teal-300 font-bold">{preventionEfficiencyPct}% Saved</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={preventionEfficiencyPct}
                  onChange={(e) => setPreventionEfficiencyPct(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Model target: 15% dropout reduction</span>
              </div>
            </div>

            {/* Financial Outcomes Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Students Retained</span>
                <span className="text-xl font-extrabold text-white mt-1 block">{studentsSaved} Students</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">Out of {baselineDropouts} at-risk</span>
              </div>

              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Tuition Fee Recovered</span>
                <span className="text-xl font-extrabold text-emerald-400 mt-1 block">₹{(tuitionRecovered / 100000).toFixed(2)} Lakhs</span>
                <span className="text-[10px] text-emerald-300 block mt-0.5">Protected from attrition</span>
              </div>

              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Nextute Platform Cost</span>
                <span className="text-xl font-extrabold text-slate-300 mt-1 block">₹{(platformAnnualCost / 100000).toFixed(2)} Lakhs</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">₹{(monthlyPlatformFee).toLocaleString()} / mo (10 mos)</span>
              </div>

              <div className="bg-teal-500/20 p-4 rounded-xl border border-teal-400/30">
                <span className="text-[10px] uppercase font-bold text-teal-200 block">Net Profit Gain</span>
                <span className="text-xl font-extrabold text-teal-300 mt-1 block">₹{(netProfitGain / 100000).toFixed(2)} Lakhs</span>
                <span className="text-[10px] text-teal-200 block mt-0.5">Breakeven at {breakevenStudents} students</span>
              </div>
            </div>
          </div>

          {/* Batches Overview Table */}
          {data && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-teal-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Institute Batch Mastery & At-Risk Concentration
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Targeted Remedials Protect High-Value Batches</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-2.5 px-4">Batch Name</th>
                      <th className="py-2.5 px-4">Exam Track</th>
                      <th className="py-2.5 px-4 text-center">Enrolled</th>
                      <th className="py-2.5 px-4 text-center">Avg BKT Mastery</th>
                      <th className="py-2.5 px-4 text-center">High Risk Count</th>
                      <th className="py-2.5 px-4 text-center">Status Indicator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.batches.map((batch) => (
                      <tr key={batch.batch_id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-bold text-slate-800">{batch.name}</td>
                        <td className="py-3 px-4 text-slate-600">{batch.target_exam.replace('_', ' ')}</td>
                        <td className="py-3 px-4 text-center font-medium text-slate-700">{batch.student_count}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded font-bold text-teal-700 bg-teal-50 border border-teal-200">
                            {(batch.avg_mastery * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-rose-100 text-rose-800">
                            {batch.high_risk_count} students
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${batch.avg_mastery > 0.70 ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PLATFORM UNIT ECONOMICS */}
      {activeTab === 'unit_econ' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Platform Unit Economics (Per Acquired Coaching Institute)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Extracted directly from Sheet 3 of the Financial Model (Tier 2 Target Profile: 400 Students)
                </p>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                LTV : CAC = 21.1x (Gold Standard: &ge; 3.0x)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">Monthly Revenue (MRPA)</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">₹12,999</span>
                <span className="text-[11px] text-slate-500 mt-1 block">₹9,999 base + ₹30 × 100 above 300</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">Direct COGS + Support</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">₹5,400 / mo</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Tech ₹3,600 (₹9/st) + CS ₹1,800</span>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <span className="text-xs text-emerald-800 block font-medium">Contribution Margin</span>
                <span className="text-2xl font-black text-emerald-700 block mt-1">₹7,599 (58.5%)</span>
                <span className="text-[11px] text-emerald-800 mt-1 block">Net operating margin per account</span>
              </div>

              <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                <span className="text-xs text-teal-800 block font-medium">Customer Lifetime Value (LTV)</span>
                <span className="text-2xl font-black text-teal-700 block mt-1">₹6,33,250</span>
                <span className="text-[11px] text-teal-800 mt-1 block">Over 8.33-year expected lifespan</span>
              </div>
            </div>

            {/* Unit Economics Breakdown Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="py-2.5 px-4">Line Item / Metric</th>
                    <th className="py-2.5 px-4 text-center">Value</th>
                    <th className="py-2.5 px-4">Unit</th>
                    <th className="py-2.5 px-4">Benchmark / Methodology</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800">Field Sales & Acquisition CAC</td>
                    <td className="py-2.5 px-4 text-center font-semibold text-slate-900">₹24,000</td>
                    <td className="py-2.5 px-4 text-slate-600">INR / Institute</td>
                    <td className="py-2.5 px-4 text-slate-500">Direct sales visits in Patna, Kota, Lucknow, Jaipur</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800">Onboarding & Staff Training</td>
                    <td className="py-2.5 px-4 text-center font-semibold text-slate-900">₹6,000</td>
                    <td className="py-2.5 px-4 text-slate-600">INR / Institute</td>
                    <td className="py-2.5 px-4 text-slate-500">OMR camera setup & Excel historical migration</td>
                  </tr>
                  <tr className="bg-teal-50/50">
                    <td className="py-2.5 px-4 font-bold text-teal-900">Total Customer Acquisition Cost (CAC)</td>
                    <td className="py-2.5 px-4 text-center font-black text-teal-800">₹30,000</td>
                    <td className="py-2.5 px-4 text-teal-700">INR / Institute</td>
                    <td className="py-2.5 px-4 text-teal-800 font-semibold">All-in cost to activate new paying institute</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800">CAC Payback Period</td>
                    <td className="py-2.5 px-4 text-center font-bold text-emerald-600">3.95</td>
                    <td className="py-2.5 px-4 text-slate-600">Months</td>
                    <td className="py-2.5 px-4 text-slate-500">Recouped in &lt; 4 active billing months</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800">Annual Logo Churn Rate</td>
                    <td className="py-2.5 px-4 text-center font-semibold text-slate-900">12.0%</td>
                    <td className="py-2.5 px-4 text-slate-600">% / Year</td>
                    <td className="py-2.5 px-4 text-slate-500">Equivalent to ~1.0% blended monthly churn</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800">Expected Account Lifespan</td>
                    <td className="py-2.5 px-4 text-center font-semibold text-slate-900">8.33</td>
                    <td className="py-2.5 px-4 text-slate-600">Years (100 mos)</td>
                    <td className="py-2.5 px-4 text-slate-500">High operational stickiness once historical data is locked</td>
                  </tr>
                  <tr className="bg-emerald-50/60">
                    <td className="py-2.5 px-4 font-bold text-emerald-950">LTV : CAC Ratio</td>
                    <td className="py-2.5 px-4 text-center font-black text-emerald-700 text-sm">21.1x</td>
                    <td className="py-2.5 px-4 text-emerald-900 font-bold">Multiple</td>
                    <td className="py-2.5 px-4 text-emerald-800 font-semibold">Significantly exceeds 3.0x venture hurdle rate</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 3-YEAR P&L PROJECTIONS */}
      {activeTab === 'projections' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Nextute EdTech 3-Year P&L & Cash Flow Projections (INR Lakhs)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Demonstrating Capital Efficiency and EBITDA Expansion from Year 1 (Q1) to Year 3 (Sheet 4)
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Year 3 EBITDA: ₹259.01 Lakhs (36.6% Margin)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-2.5 px-3">P&L Metric (₹ Lakhs)</th>
                    <th className="py-2.5 px-2 text-center">Y1 Q1</th>
                    <th className="py-2.5 px-2 text-center">Y1 Q2</th>
                    <th className="py-2.5 px-2 text-center">Y1 Q3</th>
                    <th className="py-2.5 px-2 text-center">Y1 Q4</th>
                    <th className="py-2.5 px-3 text-center bg-slate-200/70">Year 1 Total</th>
                    <th className="py-2.5 px-3 text-center bg-teal-50">Year 2 Total</th>
                    <th className="py-2.5 px-3 text-center bg-emerald-50">Year 3 Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-2 px-3">Active Institutes</td>
                    <td className="py-2 px-2 text-center">10</td>
                    <td className="py-2 px-2 text-center">20</td>
                    <td className="py-2 px-2 text-center">35</td>
                    <td className="py-2 px-2 text-center">50</td>
                    <td className="py-2 px-3 text-center bg-slate-100">50</td>
                    <td className="py-2 px-3 text-center bg-teal-50/50 text-teal-800">180</td>
                    <td className="py-2 px-3 text-center bg-emerald-50/50 text-emerald-800">520</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-600">Total Students on Platform</td>
                    <td className="py-2 px-2 text-center">4,000</td>
                    <td className="py-2 px-2 text-center">8,000</td>
                    <td className="py-2 px-2 text-center">14,000</td>
                    <td className="py-2 px-2 text-center">20,000</td>
                    <td className="py-2 px-3 text-center bg-slate-100">20,000</td>
                    <td className="py-2 px-3 text-center bg-teal-50/50">72,000</td>
                    <td className="py-2 px-3 text-center bg-emerald-50/50">208,000</td>
                  </tr>
                  <tr className="bg-teal-50/30 font-bold">
                    <td className="py-2 px-3 text-teal-900">Gross Revenue</td>
                    <td className="py-2 px-2 text-center">₹4.50</td>
                    <td className="py-2 px-2 text-center">₹9.00</td>
                    <td className="py-2 px-2 text-center">₹15.75</td>
                    <td className="py-2 px-2 text-center">₹22.50</td>
                    <td className="py-2 px-3 text-center bg-slate-100 text-teal-900">₹51.75</td>
                    <td className="py-2 px-3 text-center bg-teal-50 text-teal-900">₹219.60</td>
                    <td className="py-2 px-3 text-center bg-emerald-100/70 text-emerald-950 font-black">₹707.20</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-500 pl-6">Cloud & Compute Infrastructure</td>
                    <td className="py-2 px-2 text-center text-slate-500">₹0.24</td>
                    <td className="py-2 px-2 text-center text-slate-500">₹0.48</td>
                    <td className="py-2 px-2 text-center text-slate-500">₹0.84</td>
                    <td className="py-2 px-2 text-center text-slate-500">₹1.20</td>
                    <td className="py-2 px-3 text-center bg-slate-100 text-slate-500">₹2.76</td>
                    <td className="py-2 px-3 text-center bg-teal-50/30 text-slate-500">₹12.96</td>
                    <td className="py-2 px-3 text-center bg-emerald-50/30 text-slate-500">₹41.60</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-500 pl-6">GenAI & WhatsApp API COGS</td>
                    <td className="py-2 px-2 text-center text-slate-500">₹0.78</td>
                    <td className="py-2 px-2 text-center text-slate-500">₹1.56</td>
                    <td className="py-2 px-2 text-center text-slate-500">₹2.73</td>
                    <td className="py-2 px-2 text-center text-slate-500">₹3.90</td>
                    <td className="py-2 px-3 text-center bg-slate-100 text-slate-500">₹8.97</td>
                    <td className="py-2 px-3 text-center bg-teal-50/30 text-slate-500">₹42.12</td>
                    <td className="py-2 px-3 text-center bg-emerald-50/30 text-slate-500">₹135.20</td>
                  </tr>
                  <tr className="font-semibold text-slate-700">
                    <td className="py-2 px-3">Total COGS</td>
                    <td className="py-2 px-2 text-center">₹1.56</td>
                    <td className="py-2 px-2 text-center">₹3.12</td>
                    <td className="py-2 px-2 text-center">₹5.46</td>
                    <td className="py-2 px-2 text-center">₹7.80</td>
                    <td className="py-2 px-3 text-center bg-slate-100">₹17.94</td>
                    <td className="py-2 px-3 text-center bg-teal-50/50">₹78.41</td>
                    <td className="py-2 px-3 text-center bg-emerald-50/50">₹244.19</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-2 px-3">Gross Margin %</td>
                    <td className="py-2 px-2 text-center">65.3%</td>
                    <td className="py-2 px-2 text-center">65.3%</td>
                    <td className="py-2 px-2 text-center">65.3%</td>
                    <td className="py-2 px-2 text-center">65.3%</td>
                    <td className="py-2 px-3 text-center bg-slate-100 font-bold">65.3%</td>
                    <td className="py-2 px-3 text-center bg-teal-50/50 font-bold">64.3%</td>
                    <td className="py-2 px-3 text-center bg-emerald-50/50 font-bold">65.5%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-600 pl-6">Sales & Marketing (CAC)</td>
                    <td className="py-2 px-2 text-center">₹3.00</td>
                    <td className="py-2 px-2 text-center">₹3.00</td>
                    <td className="py-2 px-2 text-center">₹4.50</td>
                    <td className="py-2 px-2 text-center">₹4.50</td>
                    <td className="py-2 px-3 text-center bg-slate-100">₹15.00</td>
                    <td className="py-2 px-3 text-center bg-teal-50/30">₹39.00</td>
                    <td className="py-2 px-3 text-center bg-emerald-50/30">₹102.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-600 pl-6">Engineering & ML R&D</td>
                    <td className="py-2 px-2 text-center">₹6.00</td>
                    <td className="py-2 px-2 text-center">₹6.00</td>
                    <td className="py-2 px-2 text-center">₹7.50</td>
                    <td className="py-2 px-2 text-center">₹7.50</td>
                    <td className="py-2 px-3 text-center bg-slate-100">₹27.00</td>
                    <td className="py-2 px-3 text-center bg-teal-50/30">₹42.00</td>
                    <td className="py-2 px-3 text-center bg-emerald-50/30">₹78.00</td>
                  </tr>
                  <tr className="bg-emerald-50 font-black border-t-2 border-slate-300">
                    <td className="py-2.5 px-3 text-emerald-950">EBITDA</td>
                    <td className="py-2.5 px-2 text-center text-rose-600">-₹7.56</td>
                    <td className="py-2.5 px-2 text-center text-rose-600">-₹4.62</td>
                    <td className="py-2.5 px-2 text-center text-rose-600">-₹3.71</td>
                    <td className="py-2.5 px-2 text-center text-emerald-700 font-bold">+₹0.70</td>
                    <td className="py-2.5 px-3 text-center bg-slate-100 text-rose-700">-₹15.19</td>
                    <td className="py-2.5 px-3 text-center bg-teal-100/70 text-teal-900">+₹48.19</td>
                    <td className="py-2.5 px-3 text-center bg-emerald-200/80 text-emerald-950 text-sm">+₹259.01</td>
                  </tr>
                  <tr className="bg-emerald-50/60 font-bold">
                    <td className="py-2 px-3 text-emerald-900">EBITDA Margin %</td>
                    <td className="py-2 px-2 text-center text-rose-600">-168.0%</td>
                    <td className="py-2 px-2 text-center text-rose-600">-51.3%</td>
                    <td className="py-2 px-2 text-center text-rose-600">-23.6%</td>
                    <td className="py-2 px-2 text-center text-emerald-700">+3.1%</td>
                    <td className="py-2 px-3 text-center bg-slate-100 text-rose-700">-29.4%</td>
                    <td className="py-2 px-3 text-center bg-teal-50/80 text-teal-800">+21.9%</td>
                    <td className="py-2 px-3 text-center bg-emerald-100 text-emerald-900 font-extrabold">+36.6%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TWO-WAY SENSITIVITY ANALYSIS */}
      {activeTab === 'sensitivity' && (
        <div className="space-y-6">
          {/* Table 1: Institute ROI Sensitivity */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Table 1: Institute ROI Multiple Sensitivity Matrix
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Stress-testing institute payback across Annual Tuition Fees vs. Dropout Prevention Efficiency % (Sheet 5)
                </p>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Breakeven at &ge; 10% Dropout Reduction
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                    <th className="py-2.5 px-3 text-left">Dropout Reduction %</th>
                    <th className="py-2.5 px-3">₹40,000 / yr</th>
                    <th className="py-2.5 px-3">₹50,000 / yr</th>
                    <th className="py-2.5 px-3 bg-teal-50 text-teal-900">₹60,000 / yr (Base)</th>
                    <th className="py-2.5 px-3">₹75,000 / yr</th>
                    <th className="py-2.5 px-3">₹90,000 / yr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  <tr>
                    <td className="py-2.5 px-3 text-left font-bold text-slate-700">5% Reduction</td>
                    <td className="py-2.5 px-3 text-slate-500">0.41x</td>
                    <td className="py-2.5 px-3 text-slate-500">0.51x</td>
                    <td className="py-2.5 px-3 bg-teal-50/40 text-slate-700">0.62x</td>
                    <td className="py-2.5 px-3 text-slate-600">0.77x</td>
                    <td className="py-2.5 px-3 text-slate-600">0.93x</td>
                  </tr>
                  <tr className="bg-emerald-50/40 font-bold">
                    <td className="py-2.5 px-3 text-left text-emerald-950">10% Reduction</td>
                    <td className="py-2.5 px-3 text-slate-700">0.82x</td>
                    <td className="py-2.5 px-3 text-emerald-700">1.03x (Breakeven)</td>
                    <td className="py-2.5 px-3 bg-teal-50/60 text-emerald-700">1.23x</td>
                    <td className="py-2.5 px-3 text-emerald-700">1.54x</td>
                    <td className="py-2.5 px-3 text-emerald-800 font-black">1.85x</td>
                  </tr>
                  <tr className="bg-teal-50 font-bold">
                    <td className="py-2.5 px-3 text-left text-teal-950">15% Reduction (Base)</td>
                    <td className="py-2.5 px-3 text-teal-800">1.23x</td>
                    <td className="py-2.5 px-3 text-teal-800">1.54x</td>
                    <td className="py-2.5 px-3 bg-teal-100 text-teal-950 font-black text-sm">1.85x (Model Baseline)</td>
                    <td className="py-2.5 px-3 text-emerald-700">2.31x</td>
                    <td className="py-2.5 px-3 text-emerald-800 font-black">2.78x</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-left font-bold text-slate-700">20% Reduction</td>
                    <td className="py-2.5 px-3 text-teal-800">1.65x</td>
                    <td className="py-2.5 px-3 text-emerald-700">2.06x</td>
                    <td className="py-2.5 px-3 bg-teal-50/40 text-emerald-700 font-bold">2.47x</td>
                    <td className="py-2.5 px-3 text-emerald-800 font-bold">3.09x</td>
                    <td className="py-2.5 px-3 text-emerald-900 font-black">3.70x</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-left font-bold text-slate-700">25% Reduction</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">2.06x</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">2.57x</td>
                    <td className="py-2.5 px-3 bg-teal-50/40 text-emerald-800 font-black">3.09x</td>
                    <td className="py-2.5 px-3 text-emerald-900 font-black">3.86x</td>
                    <td className="py-2.5 px-3 text-emerald-950 font-black text-sm">4.63x</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              <strong>Key Finding:</strong> Even at a conservative 10% dropout reduction for a modest ₹50,000 institute, the platform yields a <strong>1.03x ROI (immediate payback)</strong>. At the baseline 15% reduction for a standard Kota/Patna institute, ROI reaches <strong>1.85x – 2.47x</strong>.
            </p>
          </div>

          {/* Table 2: Nextute LTV/CAC Sensitivity */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Table 2: Nextute LTV / CAC Sensitivity Matrix
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Stress-testing business durability across Annual Logo Churn vs. Blended Acquisition CAC
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                LTV:CAC &gt; 9.5x in Worst-Case Scenario
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                    <th className="py-2.5 px-3 text-left">Annual Logo Churn</th>
                    <th className="py-2.5 px-3">₹20,000 CAC</th>
                    <th className="py-2.5 px-3">₹25,000 CAC</th>
                    <th className="py-2.5 px-3 bg-teal-50 text-teal-900">₹30,000 CAC (Base)</th>
                    <th className="py-2.5 px-3">₹35,000 CAC</th>
                    <th className="py-2.5 px-3">₹40,000 CAC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  <tr>
                    <td className="py-2.5 px-3 text-left font-bold text-slate-700">8% Churn</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">47.5x</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">38.0x</td>
                    <td className="py-2.5 px-3 bg-teal-50/40 text-emerald-800 font-bold">31.7x</td>
                    <td className="py-2.5 px-3 text-teal-800">27.1x</td>
                    <td className="py-2.5 px-3 text-teal-800">23.7x</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-left font-bold text-slate-700">10% Churn</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">38.0x</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">30.4x</td>
                    <td className="py-2.5 px-3 bg-teal-50/40 text-teal-800 font-bold">25.3x</td>
                    <td className="py-2.5 px-3 text-teal-800">21.7x</td>
                    <td className="py-2.5 px-3 text-teal-800">19.0x</td>
                  </tr>
                  <tr className="bg-teal-50 font-bold">
                    <td className="py-2.5 px-3 text-left text-teal-950">12% Churn (Base)</td>
                    <td className="py-2.5 px-3 text-emerald-800 font-bold">31.7x</td>
                    <td className="py-2.5 px-3 text-teal-800 font-bold">25.3x</td>
                    <td className="py-2.5 px-3 bg-teal-100 text-teal-950 font-black text-sm">21.1x (Model Baseline)</td>
                    <td className="py-2.5 px-3 text-teal-800">18.1x</td>
                    <td className="py-2.5 px-3 text-teal-800">15.8x</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-left font-bold text-slate-700">15% Churn</td>
                    <td className="py-2.5 px-3 text-teal-800 font-bold">25.3x</td>
                    <td className="py-2.5 px-3 text-teal-800 font-bold">20.3x</td>
                    <td className="py-2.5 px-3 bg-teal-50/40 text-teal-800">16.9x</td>
                    <td className="py-2.5 px-3 text-teal-800">14.5x</td>
                    <td className="py-2.5 px-3 text-slate-700">12.7x</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="py-2.5 px-3 text-left font-bold text-amber-950">20% Churn (Severe Stress)</td>
                    <td className="py-2.5 px-3 text-teal-800">19.0x</td>
                    <td className="py-2.5 px-3 text-teal-800">15.2x</td>
                    <td className="py-2.5 px-3 bg-teal-50/40 text-slate-800 font-bold">12.7x</td>
                    <td className="py-2.5 px-3 text-slate-700">10.9x</td>
                    <td className="py-2.5 px-3 text-slate-700 font-black">9.5x (Healthy)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              <strong>Key Finding:</strong> Even under severe stress conditions (20% annual churn + ₹40k high CAC), Nextute maintains an LTV/CAC of <strong>9.5x</strong>, well above the 3.0x venture hurdle.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
