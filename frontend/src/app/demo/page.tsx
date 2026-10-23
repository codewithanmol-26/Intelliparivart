'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import { SAMPLE_CSV_CONTENT } from '@/lib/demoData';
import {
  Building2,
  Layers,
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  PlayCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Database
} from 'lucide-react';

export default function DemoHubPage() {

  const handleDownloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'intelliprivart_benchmark_students.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const roles = [
    {
      id: 'owner',
      href: '/demo/owner',
      title: 'Institute Owner Demo',
      persona: 'Dr. S. K. Narayan • Managing Director',
      badge: 'Executive Oversight',
      color: 'border-blue-500/30 bg-blue-50/40 text-blue-900',
      icon: Building2,
      description: 'Analyze overall institute retention, batch health, attendance stability, and calculate tuition revenue protected from avoided dropouts.',
      metrics: ['1,200 Enrolled Cohort', '12.8% → 5.7% Churn Reduction', '₹28.5L Tuition Protected']
    },
    {
      id: 'teacher',
      href: '/demo/teacher',
      title: 'Teacher & Academic Head Demo',
      persona: 'Er. R. K. Verma • Physics Lead',
      badge: 'Academic Diagnostics',
      color: 'border-teal-500/30 bg-teal-50/40 text-teal-950',
      icon: Layers,
      description: 'Inspect Bayesian Knowledge Tracing (BKT) topic mastery heatmaps, diagnose concept friction, and generate tailored 15-minute remedial worksheets.',
      metrics: ['13 Sub-Topics Calibrated', '4 Flagged for Remediation', '1-Click Worksheet Engine']
    },
    {
      id: 'student',
      href: '/demo/student',
      title: 'Student Growth View Demo',
      persona: 'Aarav Sharma • Achievers Top-30',
      badge: 'Supportive & Non-Shaming',
      color: 'border-indigo-500/30 bg-indigo-50/40 text-indigo-950',
      icon: GraduationCap,
      description: 'Explore personal concept strengths, targeted micro-drills, calibrated percentile ranges [91.0%–96.5%], and personalized 7-day study pacing.',
      metrics: ['Personal Latent Ability θ', 'Targeted Rotational Motion', 'No Toxic Public Rankings']
    },
    {
      id: 'parent',
      href: '/demo/parent',
      title: 'Parent Bilingual Digest Demo',
      persona: 'Mr. Rajesh Sharma • Guardian',
      badge: 'Bilingual Transparency',
      color: 'border-emerald-500/30 bg-emerald-50/40 text-emerald-950',
      icon: HeartHandshake,
      description: 'Review constructive weekly summaries with instant English/Hindi language toggle, attendance verification, and direct faculty follow-up notes.',
      metrics: ['English & हिन्दी Toggle', 'MoE 2024 Compliant', 'WhatsApp Automated Delivery']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <DemoBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hub Header */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="inline-flex items-center space-x-2 bg-teal-500/10 text-teal-700 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <PlayCircle className="w-4 h-4 text-teal-600" />
            <span>Interactive Platform Walkthrough</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore the Intelliprivart Data Moat Platform
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Welcome to the live interactive demonstration of Intelliprivart. Experience how fragmented coaching records
            are transformed into predictive diagnostics and targeted academic interventions. Select any of the four role perspectives below.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">

            <Link
              href="/upload"
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-600" />
              <span>Test CSV Data Import Wizard</span>
            </Link>
            <button
              onClick={handleDownloadSampleCsv}
              className="px-4 py-2.5 rounded-xl border border-teal-300 bg-teal-50/60 text-teal-800 hover:bg-teal-100 font-semibold text-xs sm:text-sm transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-teal-600" />
              <span>Download Benchmark CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Role Perspective Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${role.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                      <Icon className="w-6 h-6 text-teal-600" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {role.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{role.title}</h2>
                    <span className="text-xs font-semibold text-slate-500 block mt-0.5">{role.persona}</span>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-700">
                    {role.metrics.map((m, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                        ✓ {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/80">
                  <Link
                    href={role.href}
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-xs"
                  >
                    <span>Launch {role.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5-Step Workflow Section */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase">
            <Sparkles className="w-4 h-4" />
            <span>The End-to-End Workflow</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            How Intelliprivart Closes the Academic Loop
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-teal-700 block">01. Capture</span>
              <p className="text-slate-600 text-[11px]">OMR scans, Excel rosters, and attendance logs.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-teal-700 block">02. Validate</span>
              <p className="text-slate-600 text-[11px]">Schema checks and quarantine review queue.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-teal-700 block">03. Analyze</span>
              <p className="text-slate-600 text-[11px]">2PL IRT latent ability & BKT topic mastery.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-teal-700 block">04. Intervene</span>
              <p className="text-slate-600 text-[11px]">15-min remedial drills & 1-on-1 mentor calls.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-teal-700 block">05. Measure</span>
              <p className="text-slate-600 text-[11px]">Subsequent test score recovery and fee retention.</p>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
