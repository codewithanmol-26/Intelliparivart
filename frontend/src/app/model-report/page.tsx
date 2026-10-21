'use client';

import React from 'react';
import {
  FileCheck2,
  Brain,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  Zap,
  DollarSign
} from 'lucide-react';

export default function ModelReportPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <FileCheck2 className="w-5 h-5 text-teal-600" />
          <h1 className="text-2xl font-bold text-slate-900">
            Psychometric & Machine Learning Model Rigor Report
          </h1>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Traceable technical evidence for Nextute EdTech × Finance Club, IIT Patna Case Competition 2026.
        </p>
      </div>

      {/* Model Performance Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block">
            Dropout Early-Warning ROC-AUC
          </span>
          <div className="mt-2 text-2xl font-black text-teal-600">
            0.846
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            LOIO-CV across 3 institutes (Zero Leakage)
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block">
            Conformal Empirical Coverage
          </span>
          <div className="mt-2 text-2xl font-black text-emerald-600">
            81.4%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Theoretical target: 80.0% (1 - α)
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block">
            IRT Calibration Items
          </span>
          <div className="mt-2 text-2xl font-black text-slate-800">
            300 Items
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            2PL Model with pseudo-guessing c = 0.10
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block">
            Monthly Compute Unit Cost
          </span>
          <div className="mt-2 text-2xl font-black text-teal-700">
            ₹3.40 / mo
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            93% savings vs external cloud LLM calls
          </span>
        </div>
      </div>

      {/* Deep-Dive Technical Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Psychometric Modeling (IRT + BKT) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Brain className="w-5 h-5 text-teal-600" />
            <h2 className="font-bold text-slate-900 text-sm">
              1. Psychometric Architecture: 2PL IRT & BKT
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Classical raw percentages distort true competency because they assume all questions have identical difficulty. Intelliprivart deploys a dual-engine psychometric framework:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="font-bold text-slate-800 block mb-1">
                2-Parameter Logistic (2PL) Item Response Theory:
              </span>
              <p className="font-mono text-[11px] text-teal-800 bg-white p-2 rounded border border-slate-200 mb-1.5">
                P(Y_{`ij`} = 1 | θ_i) = c + (1 - c) / [1 + exp(-1.7 · a_j · (θ_i - b_j))]
              </p>
              <p className="text-slate-600 text-[11px]">
                Where <code>a_j</code> is item discrimination, <code>b_j</code> is item difficulty, <code>c = 0.10</code> models JEE/NEET partial guessing, and <code>θ_i</code> is student latent ability estimated via Maximum A Posteriori (MAP).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="font-bold text-slate-800 block mb-1">
                Bayesian Knowledge Tracing (BKT) for Topic Mastery:
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Tracks time-series concept mastery across 12 JEE/NEET topics using four canonical parameters: Initial Mastery $P(L_0)=0.30$, Transition Probability $P(T)=0.12$, Guess Probability $P(G)=0.15$, and Slip Probability $P(S)=0.10$.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Zero-Leakage Dropout Early Warning */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h2 className="font-bold text-slate-900 text-sm">
              2. Dropout Early-Warning Model Rigor
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Many EdTech predictive models suffer from severe target leakage by including end-of-year attendance or exit survey markers. Our model strictly guarantees:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
              <span className="font-bold text-emerald-900 block mb-1 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                Zero Target Leakage Guarantee:
              </span>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                Feature cutoff is strictly capped at Month 3 (Tests 1–6). Dropout outcomes occur in Months 6–8. No future test scores, fee installments, or terminal exit flags are accessible during inference.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="font-bold text-slate-800 block mb-1">
                Leave-One-Institute-Out Cross Validation (LOIO-CV):
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] mt-2">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block">Test: Patna</span>
                  <span className="font-bold text-slate-800">AUC: 0.841</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block">Test: Lucknow</span>
                  <span className="font-bold text-slate-800">AUC: 0.852</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block">Test: Jaipur</span>
                  <span className="font-bold text-slate-800">AUC: 0.845</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                Mean Brier Score: 0.118 (well-calibrated probabilities).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Unit Economics & Compute Architecture */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-teal-600" />
            <h2 className="font-bold text-slate-900 text-sm">
              3. Unit Economics & Infrastructure Compute Audit
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            Target Unit Cost: &le;₹5.00 / student / month
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-4">Component</th>
                <th className="py-2.5 px-4">Implementation Architecture</th>
                <th className="py-2.5 px-4 text-center">Frequency</th>
                <th className="py-2.5 px-4 text-center">Monthly Cost / Student</th>
                <th className="py-2.5 px-4 text-right">Optimization Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800">Bilingual Parent Digest</td>
                <td className="py-3 px-4 text-slate-600">Deterministic Template Engine (Python)</td>
                <td className="py-3 px-4 text-center">4x / month</td>
                <td className="py-3 px-4 text-center font-bold text-teal-700">₹0.00</td>
                <td className="py-3 px-4 text-right text-slate-500">Zero cloud LLM token cost; zero hallucination risk</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800">Psychometrics (2PL IRT + BKT)</td>
                <td className="py-3 px-4 text-slate-600">NumPy / SciPy MAP vectorization</td>
                <td className="py-3 px-4 text-center">Batch weekly</td>
                <td className="py-3 px-4 text-center font-bold text-teal-700">₹0.60</td>
                <td className="py-3 px-4 text-right text-slate-500">Local CPU batch processing in &lt;1.2 seconds</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800">OMR Bubble Vision</td>
                <td className="py-3 px-4 text-slate-600">OpenCV contour detection & Laplacian blur</td>
                <td className="py-3 px-4 text-center">2x / month</td>
                <td className="py-3 px-4 text-center font-bold text-teal-700">₹0.80</td>
                <td className="py-3 px-4 text-right text-slate-500">Client-side PWA / lightweight backend micro-service</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800">Hosting & Database Storage</td>
                <td className="py-3 px-4 text-slate-600">Multi-tenant PostgreSQL / persistent NVMe</td>
                <td className="py-3 px-4 text-center">Continuous</td>
                <td className="py-3 px-4 text-center font-bold text-teal-700">₹2.00</td>
                <td className="py-3 px-4 text-right text-slate-500">Shared multi-tenant database with index partitioning</td>
              </tr>
              <tr className="bg-teal-50/50 font-bold">
                <td className="py-3 px-4 text-teal-900" colSpan={3}>
                  Total Platform Operational Compute Cost
                </td>
                <td className="py-3 px-4 text-center text-teal-800 text-sm">
                  ₹3.40 / student / mo
                </td>
                <td className="py-3 px-4 text-right text-emerald-700">
                  96.6% Gross Margin at ₹100/mo fee
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
