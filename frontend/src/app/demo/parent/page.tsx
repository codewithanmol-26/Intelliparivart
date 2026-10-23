'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import { DEMO_PARENT_REPORTS, DEMO_STUDENTS, DemoStudent } from '@/lib/demoData';
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
  Share2,
  Printer,
  Check
} from 'lucide-react';

export default function DemoParentPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [whatsAppSent, setWhatsAppSent] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('STD_PAT_001');

  const student = DEMO_STUDENTS.find(s => s.id === selectedStudentId) || DEMO_STUDENTS[0];
  const rpt = language === 'en' ? DEMO_PARENT_REPORTS.en : DEMO_PARENT_REPORTS.hi;

  const handleShareWhatsApp = () => {
    setWhatsAppSent(true);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Demo Banner */}
      <DemoBanner />

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
              {language === 'en' ? `Monthly Progress: ${student.name}` : `मासिक प्रगति रिपोर्ट: ${student.name}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {student.batchName} • Apex JEE Academy, Patna • {rpt.month}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Student Persona Switcher */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <span className="text-slate-500 mr-2">Ward:</span>
              <select
                aria-label="Select Ward"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
              >
                {DEMO_STUDENTS.map((s: DemoStudent) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.targetExam})</option>
                ))}
              </select>
            </div>

            {/* Bilingual English / Hindi Switcher (Key Requirement) */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
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
                  ? `Delivered every Monday morning to guardian registered mobile (${student.guardianPhone})`
                  : `अभिभावक के पंजीकृत मोबाइल (${student.guardianPhone}) पर प्रत्येक सोमवार सुबह भेजा जाता है`}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{whatsAppSent ? (language === 'en' ? 'Dispatched (View Below)!' : 'भेज दिया गया (नीचे देखें)!') : (language === 'en' ? 'Simulate WhatsApp Send' : 'व्हाट्सएप पर भेजें')}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'Print Digest' : 'प्रिंट करें'}</span>
            </button>
          </div>
        </div>

        {/* Live WhatsApp Simulation Message Preview */}
        {whatsAppSent && (
          <div className="p-5 rounded-2xl bg-emerald-950 text-white border border-emerald-700/60 shadow-xl space-y-3 animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-[10px]">✓</div>
                <span className="font-bold text-emerald-200">WhatsApp Delivery Simulation Active</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Delivered to {student.guardianPhone}</span>
            </div>
            <div className="bg-emerald-900/80 p-3.5 rounded-xl border border-emerald-800 space-y-2 leading-relaxed text-emerald-100 font-sans">
              <div className="flex items-center justify-between text-xs font-bold text-white border-b border-emerald-800 pb-1">
                <span>{language === 'en' ? 'Apex JEE & Medical Academy, Patna' : 'अपेक्स जेईई एवं मेडिकल अकादमी, पटना'}</span>
                <span className="text-[10px] font-normal text-emerald-300">09:15 AM</span>
              </div>
              <p>
                {language === 'en'
                  ? `Dear ${student.guardianName}, ${student.name} attended ${student.attendanceRate}% of classes this month. Score trend is strong (${student.overallPercentile}% overall mastery). Recommended home focus: ${student.weakTopics[0] || 'Rotational Dynamics'}.`
                  : `आदरणीय ${student.guardianName}, ${student.name} ने इस माह ${student.attendanceRate}% कक्षाओं में भाग लिया। कुल दक्षता ${student.overallPercentile}% है। घर पर अभ्यास हेतु अनुशंसित विषय: ${student.weakTopics[0] || 'घूर्णन गतिविज्ञान'}।`}
              </p>
              <p className="text-[11px] text-emerald-200 italic">
                {language === 'en' ? rpt.facultyNote : rpt.facultyNote}
              </p>
              <div className="text-[10px] text-teal-300 text-right font-mono flex items-center justify-end space-x-1">
                <span>Read by Guardian</span>
                <span className="text-teal-400 font-bold">✓✓</span>
              </div>
            </div>
          </div>
        )}

        {/* Core Report Content Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Top Banner inside Report */}
          <div className="bg-[#0B1F3A] text-white p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-900/60 pb-4">
              <div>
                <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block">
                  {language === 'en' ? 'Verified Institute Record' : 'प्रमाणित संस्थान रिकॉर्ड'}
                </span>
                <span className="text-xl font-bold text-white mt-0.5 block">{student.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-300 block">{student.targetExam} 2026</span>
                <span className="text-xs font-mono font-bold text-teal-300">Roll: {student.rollNumber}</span>
              </div>
            </div>

            {/* Attendance & Percentile Cards inside Top Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-4 rounded-2xl bg-blue-950/70 border border-blue-800/80 space-y-1">
                <span className="text-[11px] text-slate-300 block">
                  {language === 'en' ? 'Monthly Attendance Record' : 'मासिक उपस्थिति रिकॉर्ड'}
                </span>
                <div className="text-2xl font-black text-white font-mono">{student.attendanceRate}%</div>
                <div className="text-[11px] text-teal-300 font-semibold">{rpt.attendanceStatus}</div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-950/70 border border-blue-800/80 space-y-1">
                <span className="text-[11px] text-slate-300 block">
                  {language === 'en' ? 'Calibrated Percentile Band' : 'अनुमानित पर्सेंटाइल दायरा'}
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
                {student.strongTopics.map((area: string, idx: number) => (
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
                {student.weakTopics.map((area: string, idx: number) => (
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
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                  {language === 'en' ? 'Confidential' : 'गोपनीय'}
                </span>
              </div>

              <p className="text-slate-700 leading-relaxed italic">
                &quot;{rpt.facultyNote}&quot;
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-teal-500/20 text-[11px] text-slate-500">
                <span>{rpt.mentorName} • {rpt.mentorRole}</span>
                <span className="text-teal-700 font-semibold">{language === 'en' ? 'Mentor Follow-up Scheduled' : 'मेंटर सत्र निर्धारित'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}
