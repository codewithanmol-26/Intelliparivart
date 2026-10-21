'use client';

import React, { useEffect, useState } from 'react';
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
  Sparkles
} from 'lucide-react';

export default function OwnerPage() {
  const { tenantId } = useApp();
  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Interactive ROI Calculator State (Aligned to Nextute_Case_B_Financial_Model.xlsx)
  const [cohortSize, setCohortSize] = useState<number>(400);
  const [annualFee, setAnnualFee] = useState<number>(60000);
  const [retentionImprovementPct, setRetentionImprovementPct] = useState<number>(2.0); // +2% retention
  const platformAnnualCost = 129600; // Tier 2 pricing: ₹10,800/mo = ₹1,29,600/year

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.getOwnerDashboard(tenantId);
      setData(res);
    } catch {
      // Mock fallback data aligned to financial model
      setData({
        tenant_id: tenantId,
        institute_name:
          tenantId === 'INST001'
            ? 'Apex Academy, Patna'
            : tenantId === 'INST002'
            ? 'Nucleus Classes, Lucknow'
            : 'Pinnacle Institute, Jaipur',
        total_enrolled: 400,
        active_students: 356,
        high_risk_count: 38,
        medium_risk_count: 52,
        low_risk_count: 266,
        retention_rate_pct: 89.0,
        estimated_dropout_loss_inr: 2280000,
        remedials_active: 28,
        batches: [
          {
            batch_id: 'BATCH_01',
            name: 'JEE Advanced Super-30',
            target_exam: 'JEE_ADVANCED',
            student_count: 100,
            avg_mastery: 0.76,
            high_risk_count: 6,
          },
          {
            batch_id: 'BATCH_02',
            name: 'JEE Main Foundation',
            target_exam: 'JEE_MAIN',
            student_count: 100,
            avg_mastery: 0.63,
            high_risk_count: 12,
          },
          {
            batch_id: 'BATCH_03',
            name: 'NEET Achievers',
            target_exam: 'NEET',
            student_count: 100,
            avg_mastery: 0.68,
            high_risk_count: 9,
          },
          {
            batch_id: 'BATCH_04',
            name: 'NEET Med-Starters',
            target_exam: 'NEET',
            student_count: 100,
            avg_mastery: 0.58,
            high_risk_count: 11,
          },
        ],
        financial_roi: {
          base_students: 400,
          annual_fee_per_student: 60000,
          retention_without_platform_pct: 88.0,
          retention_with_platform_pct: 90.0,
          students_saved: 8,
          annual_revenue_protected: 480000,
          platform_annual_cost: 129600,
          net_roi_ratio: 3.7,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [tenantId]);

  // Derived ROI calculations
  const studentsSaved = Math.round((cohortSize * retentionImprovementPct) / 100);
  const revenueProtected = studentsSaved * annualFee;
  const netProfit = revenueProtected - platformAnnualCost;
  const roiMultiplier = (revenueProtected / platformAnnualCost).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-900">
              Institute Executive Dashboard & Business ROI
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {data?.institute_name || 'Apex Academy'} • Multi-Tenant Enterprise Cockpit
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
            Pricing Tier
          </span>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            Tier 2 Growth Plan (₹10,800 / mo)
          </span>
        </div>
      </div>

      {/* Cohort KPIs */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Total Enrolled Cohort</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900">
                {data.total_enrolled}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">
                {data.active_students} Active
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Current Retention Rate</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-teal-600">
                {data.retention_rate_pct}%
              </span>
              <span className="text-xs text-slate-500">Target: &gt;90%</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Dropout Risk Radar</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-rose-600">
                {data.high_risk_count}
              </span>
              <span className="text-xs text-amber-600 font-medium">
                +{data.medium_risk_count} Watchlist
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Tuition Revenue at Risk</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{(data.estimated_dropout_loss_inr / 100000).toFixed(1)}L
              </span>
              <span className="text-xs text-teal-600 font-semibold">
                {data.remedials_active} Active Interventions
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Batch Performance Matrix */}
      {data && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">
                Batch Comparison & Early Risk Distribution
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Cross-Batch Academic Benchmarking
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-4">Batch Name</th>
                  <th className="py-2.5 px-4">Exam Track</th>
                  <th className="py-2.5 px-4 text-center">Enrolled</th>
                  <th className="py-2.5 px-4 text-center">Avg BKT Mastery</th>
                  <th className="py-2.5 px-4 text-center">High Risk Students</th>
                  <th className="py-2.5 px-4 text-center">Health Indicator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.batches.map((batch) => (
                  <tr key={batch.batch_id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {batch.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {batch.target_exam.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-700">
                      {batch.student_count}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded font-bold text-teal-700 bg-teal-50 border border-teal-200">
                        {(batch.avg_mastery * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                          batch.high_risk_count > 10
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {batch.high_risk_count} students
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          batch.avg_mastery > 0.70 ? 'bg-emerald-500' : 'bg-amber-400'
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Financial ROI Calculator */}
      <div className="bg-gradient-to-br from-[#0B1F3A] to-[#132E52] p-6 sm:p-8 rounded-2xl text-white shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-800/60">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-teal-300 text-xs font-semibold uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auditable Business Model Integration</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Data Moat Return on Investment (ROI) Calculator
            </h2>
            <p className="text-slate-300 text-xs mt-1">
              Based on Nextute Case B Financial Model benchmarks (400-student cohort, ₹60k annual fee).
            </p>
          </div>

          <div className="bg-teal-500/20 border border-teal-400/30 rounded-xl px-4 py-2 text-right">
            <span className="text-[10px] text-teal-200 block uppercase font-medium">Net Platform ROI</span>
            <span className="text-2xl font-black text-teal-300">
              {roiMultiplier}x
            </span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <div className="flex justify-between font-semibold mb-2 text-slate-200">
              <span>Total Cohort Size:</span>
              <span className="text-teal-300 font-bold">{cohortSize} Students</span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={cohortSize}
              onChange={(e) => setCohortSize(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Tier 2 baseline: 400 students</span>
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-2 text-slate-200">
              <span>Annual Fee per Student:</span>
              <span className="text-teal-300 font-bold">₹{(annualFee / 1000).toFixed(0)}k</span>
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
            <span className="text-[10px] text-slate-400 mt-1 block">Avg Kota / Patna JEE fee: ₹60k–₹85k</span>
          </div>

          <div>
            <div className="flex justify-between font-semibold mb-2 text-slate-200">
              <span>Retention Gain (+%):</span>
              <span className="text-teal-300 font-bold">+{retentionImprovementPct.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={retentionImprovementPct}
              onChange={(e) => setRetentionImprovementPct(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Conservative target: +2.0%</span>
          </div>
        </div>

        {/* Financial Outcomes Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">
              Students Saved from Dropout
            </span>
            <span className="text-xl font-extrabold text-white mt-1 block">
              {studentsSaved} Students
            </span>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">
              Annual Tuition Protected
            </span>
            <span className="text-xl font-extrabold text-emerald-400 mt-1 block">
              ₹{(revenueProtected / 100000).toFixed(2)} Lakhs
            </span>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">
              Platform Subscription Cost
            </span>
            <span className="text-xl font-extrabold text-slate-300 mt-1 block">
              ₹{(platformAnnualCost / 100000).toFixed(2)} Lakhs
            </span>
          </div>

          <div className="bg-teal-500/20 p-4 rounded-xl border border-teal-400/30">
            <span className="text-[10px] uppercase font-bold text-teal-200 block">
              Net Institute Profit Protection
            </span>
            <span className="text-xl font-black text-teal-300 mt-1 block">
              +₹{(netProfit / 100000).toFixed(2)} Lakhs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
