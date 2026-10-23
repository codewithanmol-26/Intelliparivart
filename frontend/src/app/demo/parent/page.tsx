'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import DemoRoleModal from '@/components/DemoRoleModal';
import { DEMO_PARENT_REPORTS, DEMO_STUDENTS } from '@/lib/demoData';
import {
  HeartHandshake,
  Languages,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  MessageCircle,
  Phone,
  Sparkles,
  Award,
  Lightbulb,
  FileCheck2,
  Share2
} from 'lucide-react';

export default function DemoParentPage() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [whatsAppSent, setWhatsAppSent] = useState(false);

  // Active student report
  const rpt = language === 'en' ? DEMO_PARENT_REPORTS.en : DEMO_PARENT_REPORTS.hi;
  const student = DEMO_STUDENTS[0];

  const handleShareWhatsApp = () => {
    setWhatsAppSent(true);
    setTimeout(() => setWhatsAppSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Demo Banner */}
      <DemoBanner onOpenRoleModal={() => setIsRoleModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Bar with Language Switcher */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" />
              <span>Parent Academic Progress Digest • Guardian View</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? `Monthly Progress: ${rpt.studentName}` : `मासिक प्रगति रिपोर्ट: ${rpt.studentName}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {rpt.batchName} • Apex JEE Academy, Patna • {rpt.month}
            </p>
          </div>

          {/* Bilingual English / Hindi Switcher (Key Requirement) */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Report Language:</span>
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  language === 'hi'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>
        </div>

        {/* WhatsApp Delivery Simulation Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block">
                {language === 'en' ? 'Automated WhatsApp Weekly Summary' : 'व्हाट्सएप स्वचालित साप्ताहिक सारांश'}
              </span>
              <span className="text-[11px] text-emerald-800">
                {language === 'en'
                  ? 'Delivered every Monday morning to guardian registered mobile (+91 98350 XXXXX)'
                  : 'अभिभावक के पंजीकृत मोबाइल (+91 98350 XXXXX) पर प्रत्येक सोमवार सुबह भेजा जाता है'}
              </span>
            </div>
          </div>

          <button
            onClick={handleShareWhatsApp}
            disabled={whatsAppSent}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs flex items-center space-x-1.5 shrink-0 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{whatsAppSent ? (language === 'en' ? 'Dispatched!' : 'भेज दिया गया!') : (language === 'en' ? 'Simulate WhatsApp Send' : 'व्हाट्सएप पर भेजें')}</span>
          </button>
        </div>

        {/* Core Report Content Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Top Banner inside Report */}
          <div className="bg-[#0B1F3A] text-white p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-900/60 pb-4">
              <div>
                <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block">
                  {language === 'en' ? 'Verified Institute Record' : 'प्रमाणित संस्थान रिकॉर्ड'}
                </span>
                <span className="text-xl font-bold text-white mt-0.5 block">{rpt.studentName}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-300 block">{rpt.targetExam}</span>
                <span className="text-xs font-mono font-bold text-teal-300">Roll: {student.rollNumber}</span>
              </div>
            </div>

            {/* Attendance & Percentile Cards inside Top Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-4 rounded-2xl bg-blue-950/70 border border-blue-800/80 space-y-1">
                <span className="text-[11px] text-slate-300 block">
                  {language === 'en' ? 'Monthly Attendance Record' : 'मासिक उपस्थिति रिकॉर्ड'}
                </span>
                <div className="text-2xl font-black text-white font-mono">{rpt.attendanceRate}%</div>
                <div className="text-[11px] text-teal-300 font-semibold">{rpt.attendanceStatus}</div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-950/70 border border-blue-800/80 space-y-1">
                <span className="text-[11px] text-slate-300 block">
                  {language === 'en' ? 'Calibrated Performance Band' : 'अनुमानित प्रदर्शन दायरा'}
                </span>
                <div className="text-2xl font-black text-teal-300 font-mono">
                  {student.predictedPercentileMin}% – {student.predictedPercentileMax}%
                </div>
                <div className="text-[11px] text-slate-300">
                  {language === 'en' ? 'Probabilistic Confidence Interval' : 'संभावित विश्वास अंतराल (80%)'}
                </div>
              </div>
            </div>
          </div>

          {/* Body Sections */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* 1. Strengths */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'en' ? 'Concept Strengths (Consistently High Accuracy)' : 'सशक्त विषय (लगातार उच्च सटीकता)'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {rpt.strongAreas.map((area: string, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 text-slate-800 font-medium">
                    {area}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Areas for Gentle Growth */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>{language === 'en' ? 'Key Areas for Support & Growth' : 'सुधार एवं अभ्यास के मुख्य क्षेत्र'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {rpt.growthAreas.map((area: string, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-slate-800 font-medium">
                    {area}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Actionable Home Support Recommendations */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>{language === 'en' ? 'Actionable Recommendations for Parents at Home' : 'घर पर अभिभावकों के लिए व्यावहारिक सुझाव'}</span>
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                {rpt.homeSupportTips.map((tip: string, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2">
                    <span className="font-bold text-teal-700 shrink-0">#{idx + 1}</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Faculty Mentor Direct Follow-up Note */}
            <div className="p-4 rounded-2xl bg-teal-50/30 border border-teal-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-950 flex items-center space-x-1.5">
                  <FileCheck2 className="w-4 h-4 text-teal-700" />
                  <span>{language === 'en' ? 'Direct Faculty Mentor Note' : 'संकाय मेंटर की सीधी टिप्पणी'}</span>
                </span>
                <span className="text-[11px] font-semibold text-teal-800">
                  {language === 'en' ? 'Personal Mentorship Scheduled' : 'व्यक्तिगत मेंटर सत्र निर्धारित'}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed italic">
                &ldquo;{rpt.facultyNote}&rdquo;
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-teal-500/20 text-[11px] text-slate-600 gap-2">
                <div>
                  <strong>{rpt.mentorName}</strong> • {rpt.mentorRole}
                </div>
                <div className="flex items-center space-x-2 text-teal-800 font-semibold">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Institute Helpline: (0612) 258-XXXX' : 'संस्थान हेल्पलाइन: (0612) 258-XXXX'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ministry of Education 2024 Compliance Note */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs flex items-start space-x-3">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-700">MoE January 2024 Coaching Guidelines Compliance</span>
            <p className="text-[11px] text-slate-500">
              All progress digests focus on constructive support, avoiding comparative public rankings or stigmatizing labels. Guardian communications are delivered with prior consent under India&apos;s DPDP Act 2023.
            </p>
          </div>
        </div>
      </main>

      {/* Role Selection Modal */}
      <DemoRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
}
