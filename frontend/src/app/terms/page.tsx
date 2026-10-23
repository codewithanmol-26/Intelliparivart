'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  Scale,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  MapPin,
  Lock,
  Printer
} from 'lucide-react';

export default function TermsPage() {
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
              <span>Print Terms</span>
            </button>
            <Link
              href="/privacy-policy"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-800 text-xs font-medium shadow-xs"
            >
              <span>View Privacy Policy</span>
            </Link>
          </div>
        </div>

        {/* Title Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
              <Scale className="w-3.5 h-3.5" />
              <span>B2B Master Services Agreement (MSA)</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
              Commercial SaaS Terms
            </span>
            <span className="text-xs text-slate-400 font-medium ml-auto">
              Last Revised: October 24, 2026 | Effective Immediately
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service & Institute License Agreement
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            Please review these Terms of Service carefully. They constitute a legally binding agreement between
            <strong> Nextute EdTech Private Limited</strong> (&quot;Nextute&quot;, &quot;we&quot;, &quot;us&quot;) and the
            coaching institute, academic company, school, or authorized administrator (&quot;Subscriber&quot;, &quot;Institute&quot;, or &quot;You&quot;)
            accessing the <strong>Intelliprivart Platform</strong>.
          </p>

          <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-950 flex items-start space-x-3">
            <Building2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">100% Institute Data Ownership Guarantee</span>
              <p className="mt-0.5 text-blue-900 leading-normal">
                The Institute retains sole and exclusive proprietary title and copyright over all student rosters, test scores, question papers, and proprietary study material ingested into Intelliprivart. Nextute claims zero ownership of your academic records.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-10 text-sm leading-relaxed text-slate-700">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Scope of Agreement & License Grant</span>
            </h2>
            <p>
              Subject to these Terms and active subscription plan payments, Nextute grants the Institute a non-exclusive,
              non-transferable, revocable license to access and use the Intelliprivart cloud software platform to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>Ingest and digitize OMR test sheets, Excel gradebooks, and attendance records.</li>
              <li>Compute psychometric mastery matrices (2-Parameter Logistic Item Response Theory & Bayesian Knowledge Tracing).</li>
              <li>Generate early-warning triage risk scores and conformal rank prediction intervals.</li>
              <li>Dispatch bilingual progress reports to verified student guardians and execute remedial teaching modules.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Proprietary Rights & Data Ownership</span>
            </h2>
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <strong className="text-slate-900 block mb-1">A. Institute Data:</strong>
                All student names, phone numbers, batch schedules, test answer keys, marks, and attendance records uploaded by the Institute remain the exclusive property of the Institute. Upon contract termination, the Institute may request an immediate, complete data export in open format (CSV/JSON).
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <strong className="text-slate-900 block mb-1">B. Platform Intellectual Property:</strong>
                Nextute retains all worldwide right, title, and interest in and to the Intelliprivart software, user interfaces, proprietary psychometric calibration algorithms, 2PL IRT inference engines, BKT knowledge state transition matrices, and system documentation.
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>Service Level Agreement (SLA) & Offline Continuity</span>
            </h2>
            <p>
              Nextute commits to delivering enterprise-grade operational availability:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>99.9% Scheduled Uptime:</strong> Measured on a monthly calendar basis, excluding scheduled maintenance announced at least 48 hours in advance.</li>
              <li><strong>Offline-First Resilience:</strong> Intelliprivart includes IndexedDB client caching. During local internet disruptions at Tier-2/3 coaching centers, faculty can continue inputting scores and taking attendance offline. Records synchronize automatically when connectivity restores.</li>
              <li><strong>Disaster Recovery:</strong> Daily automated database snapshots with multi-region backups in India (AWS Mumbai & Hyderabad).</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">4</span>
              <span>Pedagogical Disclaimer & AI Limitation of Liability</span>
            </h2>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Statutory Educational Disclaimer</span>
              </div>
              <p className="leading-relaxed">
                Intelliprivart provides statistical, psychometric, and machine-learning decision aids intended to support institute faculty.
                <strong> Conformal rank forecasts, early-warning risk tiers, and mastery estimates do not constitute a guarantee of actual examination ranks, admissions into the Indian Institutes of Technology (IITs), National Institutes of Technology (NITs), or AIIMS.</strong>
              </p>
              <p className="leading-relaxed">
                Final decisions regarding student mentoring, parent counseling, remedial coursework, and student welfare remain the sole prerogative and responsibility of human educational directors and faculty.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">5</span>
              <span>Child Data Protection Warranties (DPDP Act 2023)</span>
            </h2>
            <p>
              Both parties agree to uphold statutory duties under the Digital Personal Data Protection Act, 2023:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>The Institute warrants that it has established lawful basis and obtained verifiable parental consent (VPC) prior to enrolling minor students into digital parent reporting.</li>
              <li>Nextute warrants that it will process student records strictly inside isolated virtual private clouds, without tracking or behavioral ad profiling, and in compliance with our <Link href="/privacy-policy" className="text-teal-600 font-semibold underline">Privacy Policy</Link>.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">6</span>
              <span>Subscription Fees, Billing & 30-Day Cancellation</span>
            </h2>
            <p>
              Institutes subscribe under standardized tiered licensing plans:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Billing Cycle:</strong> Subscriptions are billed monthly or annually in Indian Rupees (INR) with applicable GST.</li>
              <li><strong>Fair Usage:</strong> Includes unlimited OMR processing, psychometric batch recomputations, and parent report generations within subscribed student cohort limits.</li>
              <li><strong>Termination for Convenience:</strong> Either party may terminate with 30 days written electronic notice. Upon termination, the Institute receives a complete archive of all stored data, after which databases are securely purged.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">7</span>
              <span>Governing Law, Jurisdiction & Dispute Resolution</span>
            </h2>
            <p>
              This Agreement shall be governed and construed in accordance with the substantive laws of India:
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
              <p>
                <strong>Arbitration:</strong> Any dispute, controversy, or claim arising out of this Agreement shall be referred to and finally resolved by binding arbitration conducted under the <em>Arbitration and Conciliation Act, 1996</em> by a sole arbitrator mutually appointed by the parties.
              </p>
              <p>
                <strong>Seat & Jurisdiction:</strong> The seat of arbitration shall be <strong>Patna, Bihar, India</strong>. Subject to arbitration, the courts at Patna shall have exclusive jurisdiction.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">8</span>
              <span>Official Notices & Support Inquiries</span>
            </h2>
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm">Nextute EdTech Commercial Legal Affairs</div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Legal & Billing: <a href="mailto:legal@nextute.edu.in" className="text-teal-600 font-semibold underline">legal@nextute.edu.in</a></span>
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
            <Link href="/privacy-policy" className="hover:text-teal-600 transition">Privacy Policy</Link>
            <Link href="/login" className="hover:text-teal-600 transition">Institute Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
