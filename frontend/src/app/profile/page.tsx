'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  Building2,
  Mail,
  Hash,
  GraduationCap,
  Layers,
  Lock,
  LogOut,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Calendar,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { role, tenantId, institutes } = useApp();

  const currentInstitute = institutes.find((i) => i.id === tenantId) || institutes[0] || {
    id: tenantId,
    name: 'Apex JEE & Medical Academy, Patna',
    city: 'Patna'
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const displayUser = user || {
    id: 'USR_GUEST',
    email: 'guest@apex.edu',
    full_name: 'Guest User',
    role: role,
    tenant_id: tenantId,
    institute_name: currentInstitute.name,
    student_id: role === 'student' || role === 'parent' ? 'STD_NA_01_001' : undefined
  };

  const roleLabel =
    displayUser.role === 'owner'
      ? 'Institute Owner & Director'
      : displayUser.role === 'teacher'
      ? 'Teacher / Faculty Mentor'
      : displayUser.role === 'student'
      ? 'Student (Growth Perspective)'
      : 'Parent / Guardian';

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 animate-fadeIn">
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-teal-600 transition font-medium">Home</Link>
          <span>/</span>
          <span className="font-bold text-slate-800">User Profile</span>
        </div>

        <Link
          href="/overview"
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-xs"
        >
          <span>Open Role Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shrink-0">
              {displayUser.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {displayUser.full_name}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                  Active Account
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-teal-700 mt-0.5">
                {roleLabel}
              </p>
              <p className="text-xs text-slate-500 flex items-center mt-1">
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>{displayUser.institute_name || currentInstitute.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Account ID
            </span>
            <span className="font-mono font-bold text-slate-900 text-xs block">
              {displayUser.id}
            </span>
            <span className="text-[10px] text-slate-500">Supabase User Entity</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Email Address
            </span>
            <span className="font-semibold text-slate-900 text-xs block truncate">
              {displayUser.email}
            </span>
            <span className="text-[10px] text-slate-500">Verified Credentials</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Institute Tenant Code
            </span>
            <span className="font-mono font-bold text-teal-800 text-xs block">
              {tenantId}
            </span>
            <span className="text-[10px] text-slate-500">VPC Tenant Isolation</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              {displayUser.role === 'student' || displayUser.role === 'parent' ? 'Student Roll Code' : 'Access Level'}
            </span>
            <span className="font-mono font-bold text-slate-900 text-xs block">
              {displayUser.student_id || 'Role Level Access'}
            </span>
            <span className="text-[10px] text-slate-500">Institutional Database Identifier</span>
          </div>
        </div>
      </div>

      {/* Role-Specific Profile Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Academic & Platform Profile */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Award className="w-4 h-4 text-teal-600" />
            <span>Academic Affiliation & Context</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Assigned Institution:</span>
              <span className="font-bold text-slate-900">{currentInstitute.name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Target Academic Focus:</span>
              <span className="font-bold text-teal-800">JEE Advanced / NEET-UG 2026</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Primary Cohort:</span>
              <span className="font-bold text-slate-900">Achievers Top-30 & Foundation 11th</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Language Preference:</span>
              <span className="font-bold text-slate-900">Bilingual (English / हिंदी)</span>
            </div>
          </div>
        </div>

        {/* DPDP Act 2023 & Privacy Ledger */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>DPDP Act 2023 Compliance & Consent</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-emerald-950 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Section 9 Minor Consent Verified</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Guardian consent is active. Automated WhatsApp digests and diagnostic reports adhere strictly to positive reinforcement with zero public shaming.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Data Storage:</span>
              <span className="font-bold text-slate-900">Supabase PostgreSQL (SSL Encrypted)</span>
            </div>

            <div className="pt-2">
              <Link
                href="/privacy"
                className="text-teal-700 hover:text-teal-900 font-bold text-xs inline-flex items-center"
              >
                <span>View Full DPDP Consent Ledger</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
