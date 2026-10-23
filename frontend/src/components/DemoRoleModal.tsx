'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { UserRole } from '../lib/types';
import {
  X,
  Building2,
  GraduationCap,
  Users,
  HeartHandshake,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  PlayCircle
} from 'lucide-react';

interface DemoRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RoleOption {
  id: UserRole;
  path: string;
  title: string;
  subtitle: string;
  persona: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge: string;
  features: string[];
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'owner',
    path: '/demo/owner',
    title: 'Institute Owner',
    subtitle: 'Executive intelligence, retention ROI, and multi-batch operational oversight.',
    persona: 'Dr. S. K. Narayan • Managing Director',
    icon: Building2,
    accentColor: 'border-blue-500/30 bg-blue-50/50 hover:border-blue-500 text-blue-900',
    badge: 'Executive Oversight',
    features: [
      '1,200 Student Cohort Overview across 3 Branches',
      'Dropout Churn Reduction: 12.8% → 5.7%',
      '₹28.5L Annual Fee Revenue Protected',
      'Batch-Level Attendance & Pacing Telemetry'
    ]
  },
  {
    id: 'teacher',
    path: '/demo/teacher',
    title: 'Teacher & Academic Head',
    subtitle: 'Concept friction diagnostics, BKT mastery heatmaps, and remedial drills.',
    persona: 'Er. R. K. Verma • Senior Physics Faculty',
    icon: Layers,
    accentColor: 'border-teal-500/30 bg-teal-50/50 hover:border-teal-500 text-teal-950',
    badge: 'Academic Diagnostics',
    features: [
      'BKT Topic Mastery Matrix (Physics, Chem, Math)',
      'Early-Warning Student Triage List (4 flagged)',
      '15-Min AI Remedial Worksheet Generator',
      '1-Click Intervention Logging & Progress Tracking'
    ]
  },
  {
    id: 'student',
    path: '/demo/student',
    title: 'Student (Growth View)',
    subtitle: 'Supportive progress tracking, personal strengths, and targeted practice drills.',
    persona: 'Aarav Sharma • Achievers Top-30 (12th Grade)',
    icon: GraduationCap,
    accentColor: 'border-indigo-500/30 bg-indigo-50/50 hover:border-indigo-500 text-indigo-950',
    badge: 'Supportive & Non-Shaming',
    features: [
      'Personal Latent Ability (θ) & Mastery Growth',
      'Top Strengths (Kinematics 91%, Bonding 85%)',
      'Targeted Revision: Rotational Dynamics',
      'Calibrated Percentile Range: [91.0% – 96.5%]'
    ]
  },
  {
    id: 'parent',
    path: '/demo/parent',
    title: 'Parent (Bilingual Digest)',
    subtitle: 'Constructive weekly academic summaries with instant English/Hindi translation.',
    persona: 'Mr. Rajesh Sharma • Guardian of Aarav',
    icon: HeartHandshake,
    accentColor: 'border-emerald-500/30 bg-emerald-50/50 hover:border-emerald-500 text-emerald-950',
    badge: 'Bilingual Transparency',
    features: [
      'MoE 2024 Compliant Non-Punitive Feedback',
      '1-Click Hindi (हिन्दी) / English Toggle',
      'Attendance Stability: 23/24 Days Attended',
      'Actionable Home Support Tips & Mentor Contacts'
    ]
  }
];

export default function DemoRoleModal({ isOpen, onClose }: DemoRoleModalProps) {
  const router = useRouter();
  const { setRole, setSelectedStudentId } = useApp();

  if (!isOpen) return null;

  const handleSelectRole = (role: RoleOption) => {
    setRole(role.id);
    if (role.id === 'student' || role.id === 'parent') {
      setSelectedStudentId('STD_PAT_001'); // Aarav Sharma
    }
    onClose();
    router.push(role.path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-[#0B1F3A] text-white px-6 sm:px-8 py-6 flex items-start justify-between border-b border-blue-900/60">
          <div>
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Interactive Role Walkthrough • Synthetic Cohort Data</span>
            </div>
            <h2 id="demo-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Explore Intelliprivart by Role
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Experience how our intelligence platform empowers every stakeholder in a coaching institute.
              Select a perspective to begin the live demo walkthrough.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-slate-300 hover:text-white transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="p-6 sm:p-8 bg-slate-50/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {ROLE_OPTIONS.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  className={`cursor-pointer rounded-2xl p-5 border bg-white shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${role.accentColor}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                        <Icon className="w-5 h-5 text-teal-600" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {role.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition flex items-center justify-between">
                        <span>{role.title}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition" />
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {role.subtitle}
                      </p>
                      <div className="text-[11px] font-semibold text-slate-500 mt-1.5 flex items-center space-x-1">
                        <span className="text-teal-600">Sample Persona:</span>
                        <span>{role.persona}</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                      {role.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Launch CTA */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-600 group-hover:underline">
                      Launch {role.title} Demo
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-teal-600 text-white font-semibold text-xs group-hover:bg-teal-700 transition shadow-xs">
                      Explore Demo &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privacy & Safety Note */}
          <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200 text-slate-500 text-[11px] flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>
                <strong>Demonstration Mode</strong>: All data is synthetic benchmark information. No production accounts or real student records required.
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 font-semibold underline shrink-0"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
