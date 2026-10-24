'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  Server,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Mail,
  MapPin,
  ExternalLink,
  Printer
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-teal-600 hover:text-teal-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Homepage</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Policy</span>
            </button>
            <Link
              href="/terms"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-800 text-xs font-medium shadow-xs"
            >
              <span>View Terms of Service</span>
            </Link>
          </div>
        </div>

        {/* Title Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Compliant</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              IT Act 2000 & SPDI Rules
            </span>
            <span className="text-xs text-slate-400 font-medium ml-auto">
              Effective Date: October 24, 2026 | Version 2.4 (Enterprise)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy & Child Data Governance
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            This Privacy Policy governs the processing of academic performance metrics, attendance logs, diagnostic assessments,
            and personal identifiers collected through the <strong>Intelliprivart Institute Intelligence Platform</strong>,
            operated by Nextute EdTech Private Limited (&quot;Nextute&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
            in partnership with coaching institutes, schools, and academic organizations across India.
          </p>

          <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-2xl text-xs text-teal-950 flex items-start space-x-3">
            <Lock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Zero-Model Training & Isolated VPC Guarantee</span>
              <p className="mt-0.5 text-teal-900 leading-normal">
                Under no circumstances are student examination scores, answer keys, or personal identifiable records used to train public Large Language Models (LLMs). All psychometric calculations run inside tenant-isolated virtual private clouds located strictly within Indian territory (AWS Mumbai ap-south-1).
              </p>
            </div>
          </div>
        </div>

        {/* Legal Policy Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-10 text-sm leading-relaxed text-slate-700">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Regulatory Mandate & Legal Framework</span>
            </h2>
            <p>
              This policy is formulated in strict accordance with Indian digital data protection laws, including:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>The Digital Personal Data Protection Act, 2023 (DPDP Act 2023)</strong>, particularly Section 9 (&quot;Processing of personal data of children&quot;).</li>
              <li><strong>The Information Technology Act, 2000</strong> (IT Act) and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules).</li>
              <li>Relevant regulatory guidelines issued by the Ministry of Electronics and Information Technology (MeitY) and the National Educational Technology Forum (NETF).</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Roles: Data Fiduciary vs Data Processor</span>
            </h2>
            <p>
              For all records ingested into the Intelliprivart platform:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider text-teal-700">
                  Coaching Institute = Data Fiduciary
                </span>
                <p className="text-xs text-slate-600 leading-normal">
                  The respective coaching institute (e.g., Apex JEE & Medical Academy) is the <strong>Data Fiduciary</strong> that determines the purpose, lawful grounds, and means of collecting student attendance and test results.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider text-teal-700">
                  Nextute / Intelliprivart = Data Processor
                </span>
                <p className="text-xs text-slate-600 leading-normal">
                  Nextute acts solely as the <strong>Data Processor</strong>, performing computational psychometrics (2PL IRT, BKT), early-warning risk scoring, and parent report compilation strictly on behalf of and pursuant to instructions from the Institute.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>Special Safeguards for Children (DPDP Act Section 9)</span>
            </h2>
            <p>
              Since a significant proportion of JEE and NEET aspirants are minors (under 18 years of age), Intelliprivart enforces the highest standard of statutory child privacy:
            </p>
            <div className="space-y-2.5">
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-xs">Verifiable Parental Consent (VPC):</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Before diagnostic reports, automated WhatsApp digests, or remedial modules are generated for a minor student, the Institute must log verifiable consent from the parent or lawful guardian. If consent is withdrawn via the Consent Ledger, automated processing ceases immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-xs">Zero Behavioral Profiling or Commercial Advertising:</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    In compliance with Section 9(2) of the DPDP Act 2023, Intelliprivart never undertakes tracking, behavioral monitoring, or targeted advertising directed at students.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-xs">Zero Detrimental Effect & Non-Shaming Visualizations:</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Under Section 9(3), we strictly prohibit any algorithmic processing that causes detrimental psychological effects. In the Student Portal, public rank shaming is blocked; metrics are displayed exclusively in mastery growth trajectories and constructive remedial roadmaps.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">4</span>
              <span>Data Categories Collected & Purpose of Processing</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3 text-left border-b border-slate-200">Data Category</th>
                    <th className="p-3 text-left border-b border-slate-200">Examples</th>
                    <th className="p-3 text-left border-b border-slate-200">Primary Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Student Academic Metrics</td>
                    <td className="p-3">OMR responses, question correctness (0/1), test scores, subject marks</td>
                    <td className="p-3">2PL IRT ability estimation, Bayesian Knowledge Tracing, Topic Mastery heatmaps</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Attendance & Operational Logs</td>
                    <td className="p-3">Class attendance %, milestone test attendance, test absence streaks</td>
                    <td className="p-3">Early-warning dropout triage (Months 1–3) to trigger timely mentor interventions</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Guardian Contact Info</td>
                    <td className="p-3">Parent phone number, WhatsApp contact, language choice (Hindi/English)</td>
                    <td className="p-3">Delivering factual weekly progress digests and milestone test reports</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Pseudonymous Codes</td>
                    <td className="p-3">Hash tokens (e.g., STD_PAT_001), encrypted student identifiers</td>
                    <td className="p-3">De-identifying analytics during ML batch training and evaluation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">5</span>
              <span>Multi-Tenant VPC Isolation & Security Standards</span>
            </h2>
            <p>
              Intelliprivart implements rigorous technical and organizational safeguards:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Row-Level Tenant Isolation:</strong> Every database query enforce strict <code className="text-teal-700 bg-teal-50 px-1 rounded">X-Tenant-ID</code> filtering at both application and database layers. Institute A cannot read, query, or infer records belonging to Institute B.</li>
              <li><strong>Encryption Standards:</strong> Data in transit is encrypted using Transport Layer Security (TLS 1.3). Data at rest is encrypted with AES-256 GCM.</li>
              <li><strong>Local Indian Data Sovereignty:</strong> Primary production databases, replicas, and backup archives are hosted exclusively within MeitY-empanelled cloud data centers located in India (ap-south-1).</li>
              <li><strong>Immutable Audit Trails:</strong> All administrative modifications, consent state toggles, and report exports are logged to a tamper-resistant audit ledger recording timestamp, actor role, and IP hash.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">6</span>
              <span>Rights of Data Principals (Students & Parents)</span>
            </h2>
            <p>
              In accordance with Chapter III of the DPDP Act 2023, parents and eligible adult students hold:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs">
                <strong className="text-slate-900 block mb-1">Right to Access:</strong>
                Obtain a summary of personal data and processing activities carried out by the platform.
              </div>
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs">
                <strong className="text-slate-900 block mb-1">Right to Correction & Erasure:</strong>
                Request correction of inaccurate academic records or deletion of records upon course completion.
              </div>
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs">
                <strong className="text-slate-900 block mb-1">Right to Withdraw Consent:</strong>
                Revoke consent for WhatsApp notifications or analytics at any time via the Institute privacy portal.
              </div>
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs">
                <strong className="text-slate-900 block mb-1">Right to Grievance Redressal:</strong>
                Lodge formal complaints directly with the Data Protection Officer designated below.
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">7</span>
              <span>Data Protection Officer (DPO) Contact Details</span>
            </h2>
            <p>
              For privacy inquiries, statutory consent revocation requests, or grievance redressal:
            </p>
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm">Nextute EdTech Data Protection Office</div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Email: <a href="mailto:dpo@nextute.edu.in" className="text-teal-600 font-semibold underline">dpo@nextute.edu.in</a> / <a href="mailto:compliance@intelliprivart.in" className="text-teal-600 font-semibold underline">compliance@intelliprivart.in</a></span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Nextute EdTech Private Limited • Patna Innovation Hub</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Patliputra Colony, Patna, Bihar 800013, India</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-4">
          <span>&copy; {new Date().getFullYear()} Nextute EdTech Pvt. Ltd. All rights reserved.</span>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link href="/" className="hover:text-teal-600 transition">Homepage</Link>
            <Link href="/terms" className="hover:text-teal-600 transition">Terms & Conditions</Link>
            <Link href="/login" className="hover:text-teal-600 transition">Institute Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
