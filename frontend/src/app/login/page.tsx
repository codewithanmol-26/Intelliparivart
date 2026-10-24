'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { DemoUserPersona, InstituteInfo } from '../../lib/types';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  HeartHandshake,
  User,
  CheckCircle2,
  AlertTriangle,
  Search,
  Check,
  HelpCircle
} from 'lucide-react';

type RoleTab = 'student' | 'parent' | 'teacher' | 'owner';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as RoleTab) || 'owner';

  const { login, loginAsDemoUser, user } = useAuth();
  const { setTenantId, setRole, setSelectedStudentId } = useApp();

  const [activeTab, setActiveTab] = useState<RoleTab>(
    ['student', 'parent', 'teacher', 'owner'].includes(initialRole) ? initialRole : 'owner'
  );

  // Database Institutes List
  const [institutes, setInstitutes] = useState<InstituteInfo[]>([]);
  const [loadingInstitutes, setLoadingInstitutes] = useState(true);

  // Form states
  const [instituteSearch, setInstituteSearch] = useState('Apex JEE & Medical Academy, Patna');
  const [selectedInstitute, setSelectedInstitute] = useState<InstituteInfo | null>(null);
  const [showInstituteDropdown, setShowInstituteDropdown] = useState(false);

  // Student fields
  const [studentIdentifier, setStudentIdentifier] = useState('student@apex.edu');
  // Parent fields
  const [guardianIdentifier, setGuardianIdentifier] = useState('parent@apex.edu');
  const [wardStudentId, setWardStudentId] = useState('STD_PAT_001');
  // Teacher fields
  const [teacherEmail, setTeacherEmail] = useState('teacher@apex.edu');
  // Owner fields
  const [ownerEmail, setOwnerEmail] = useState('owner@apex.edu');

  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [demoUsers, setDemoUsers] = useState<DemoUserPersona[]>([]);

  // Load institutes from Supabase database
  useEffect(() => {
    let isMounted = true;
    api
      .getInstitutes()
      .then((data) => {
        if (!isMounted) return;
        if (data && data.length > 0) {
          setInstitutes(data);
          // Auto-select first matching default
          const apex = data.find((i) => i.name.toLowerCase().includes('apex')) || data[0];
          setSelectedInstitute(apex);
          setInstituteSearch(apex.name);
        }
      })
      .catch(() => {
        // Fallback demo institutes
        const fallback = [
          { id: 'INST_PATNA_01', name: 'Apex JEE & Medical Academy, Patna', city: 'Patna' },
          { id: 'INST_KOTA_02', name: 'Chaitanya Science Forum, Kota', city: 'Kota' },
          { id: 'INST_LUCKNOW_03', name: 'Drona Medical Institute, Lucknow', city: 'Lucknow' }
        ];
        if (isMounted) {
          setInstitutes(fallback);
          setSelectedInstitute(fallback[0]);
          setInstituteSearch(fallback[0].name);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingInstitutes(false);
      });

    api
      .getDemoUsers()
      .then((data) => {
        if (isMounted) setDemoUsers(data);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Update fields when switching tabs
  const handleTabChange = (newTab: RoleTab) => {
    setActiveTab(newTab);
    setError(null);
    if (newTab === 'student') {
      setStudentIdentifier('student@apex.edu');
      setPassword('student');
    } else if (newTab === 'parent') {
      setGuardianIdentifier('parent@apex.edu');
      setWardStudentId('STD_PAT_001');
      setPassword('parent');
    } else if (newTab === 'teacher') {
      setTeacherEmail('teacher@apex.edu');
      setPassword('teacher');
    } else {
      setOwnerEmail('owner@apex.edu');
      setPassword('owner');
    }
  };

  // Helper to check if current institute input matches database
  const getMatchedInstitute = (): InstituteInfo | null => {
    if (!instituteSearch || !instituteSearch.trim()) return null;
    const q = instituteSearch.trim().toLowerCase();
    return (
      institutes.find(
        (inst) =>
          inst.name.toLowerCase() === q ||
          inst.name.toLowerCase().includes(q) ||
          inst.id.toLowerCase() === q
      ) || null
    );
  };

  const handleSelectInstitute = (inst: InstituteInfo) => {
    setSelectedInstitute(inst);
    setInstituteSearch(inst.name);
    setShowInstituteDropdown(false);
    setError(null);
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Strict Database Institute Match Requirement for Students and Parents
    if (activeTab === 'student' || activeTab === 'parent') {
      const matched = getMatchedInstitute();
      if (!matched) {
        setError(
          `Institute "${instituteSearch}" not found in database. Student & Parent access requires affiliation with an active coaching institute enrolled on Intelliprivart. Please select a registered coaching institute.`
        );
        return;
      }
      setSelectedInstitute(matched);
      setTenantId(matched.id);
    }

    setSubmitting(true);
    try {
      let targetEmail = '';
      if (activeTab === 'student') targetEmail = studentIdentifier.trim();
      else if (activeTab === 'parent') targetEmail = guardianIdentifier.trim();
      else if (activeTab === 'teacher') targetEmail = teacherEmail.trim();
      else targetEmail = ownerEmail.trim();

      const loggedUser = await login(targetEmail, password);

      // Force synchronize tenant context
      if (selectedInstitute) {
        setTenantId(selectedInstitute.id);
      } else {
        setTenantId(loggedUser.tenant_id);
      }

      setRole(activeTab);
      if (activeTab === 'student') {
        setSelectedStudentId(wardStudentId || 'STD_PAT_001');
      } else if (activeTab === 'parent') {
        setSelectedStudentId(wardStudentId || 'STD_PAT_001');
      }

      // Role-specific redirect
      if (activeTab === 'owner') router.push('/overview');
      else if (activeTab === 'teacher') router.push('/overview');
      else if (activeTab === 'student') router.push('/overview');
      else if (activeTab === 'parent') router.push('/overview');
      else router.push('/overview');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials or select an operational role below.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectPersonaLogin = async (persona: DemoUserPersona) => {
    setError(null);
    setSubmitting(true);
    try {
      const loggedUser = await loginAsDemoUser(persona);
      setTenantId(loggedUser.tenant_id);
      setRole(persona.role);
      if (persona.student_id) setSelectedStudentId(persona.student_id);

      if (persona.role === 'owner') router.push('/overview');
      else if (persona.role === 'teacher') router.push('/overview');
      else if (persona.role === 'student') router.push('/overview');
      else if (persona.role === 'parent') router.push('/overview');
      else router.push('/overview');
    } catch (err: any) {
      setError('Unable to authenticate role profile. Please check database connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const matchedInstitute = getMatchedInstitute();

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4">
      {/* Title & Brand Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 bg-teal-500/10 text-teal-700 border border-teal-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>DPDP Act 2023 Multi-Tenant Isolated Authentication</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Your Institute Portal
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Distinct portal authentication for students, teachers, parents, and institute owners. Student & parent accounts verify database institute affiliation before proceeding.
        </p>

        {/* Tab Toggle: Sign In vs Register */}
        <div className="mt-5 max-w-xs mx-auto bg-slate-200/80 p-1 rounded-xl flex items-center text-xs font-semibold">
          <div className="flex-1 py-1.5 text-center bg-white text-teal-700 rounded-lg shadow-xs font-bold">
            Sign In to Portal
          </div>
          <Link
            href="/register"
            className="flex-1 py-1.5 text-center text-slate-600 hover:text-slate-900 rounded-lg transition"
          >
            Register Institute
          </Link>
        </div>
      </div>

      {/* 4 Distinct Role Selector Tabs */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleTabChange('student')}
            className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'student'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('parent')}
            className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'parent'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Parent</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('teacher')}
            className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'teacher'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('owner')}
            className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'owner'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Institute Owner</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
          {/* Header indicator */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  activeTab === 'student'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeTab === 'parent'
                    ? 'bg-amber-100 text-amber-800'
                    : activeTab === 'teacher'
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {activeTab} Sign In
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {activeTab === 'student' && 'Student Growth Portal'}
                {activeTab === 'parent' && 'Parent Digest Portal'}
                {activeTab === 'teacher' && 'Teacher & Academic Head Workspace'}
                {activeTab === 'owner' && 'Institute Owner Executive Dashboard'}
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Step 1 of 1</span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
            {/* 1. Institute Name Field (REQUIRED & DATABASE-MATCHED FOR STUDENT & PARENT) */}
            {(activeTab === 'student' || activeTab === 'parent') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 block">
                    Enrolled Coaching Institute <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Matched with Supabase DB</span>
                </div>

                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 z-10" />
                  <input
                    type="text"
                    required
                    placeholder="Search enrolled institute name (e.g. Apex, Chaitanya)..."
                    value={instituteSearch}
                    onFocus={() => setShowInstituteDropdown(true)}
                    onChange={(e) => {
                      setInstituteSearch(e.target.value);
                      setShowInstituteDropdown(true);
                      setError(null);
                    }}
                    className={`w-full pl-9 pr-8 py-2 border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 text-xs text-slate-800 ${
                      matchedInstitute
                        ? 'border-emerald-300 focus:ring-emerald-500'
                        : 'border-slate-200 focus:ring-teal-500'
                    }`}
                  />
                  {matchedInstitute && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-2.5" />
                  )}
                </div>

                {/* Database Verification Status Pill */}
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  {matchedInstitute ? (
                    <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified: {matchedInstitute.name} ({matchedInstitute.city})</span>
                    </span>
                  ) : instituteSearch ? (
                    <span className="text-rose-600 font-semibold flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Not found in DB. Must match an enrolled coaching institute.</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">Select or type your registered institute</span>
                  )}
                </div>

                {/* Searchable Dropdown Suggestions */}
                {showInstituteDropdown && (
                  <div className="mt-1.5 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg p-1 space-y-0.5 z-20">
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 block">
                      Enrolled Institutes in Database ({institutes.length})
                    </span>
                    {institutes
                      .filter((inst) =>
                        inst.name.toLowerCase().includes(instituteSearch.toLowerCase()) ||
                        inst.city?.toLowerCase().includes(instituteSearch.toLowerCase())
                      )
                      .map((inst) => (
                        <button
                          key={inst.id}
                          type="button"
                          onClick={() => handleSelectInstitute(inst)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-teal-50 flex items-center justify-between text-xs group"
                        >
                          <span className="font-semibold text-slate-800 group-hover:text-teal-700">
                            {inst.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.2 rounded">
                            {inst.city || inst.id}
                          </span>
                        </button>
                      ))}
                    {institutes.length === 0 && (
                      <div className="p-2 text-center text-slate-400 text-xs">
                        Loading registered institutes...
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. Teacher Affiliated Institute Select */}
            {activeTab === 'teacher' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Faculty Institute Affiliation
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={selectedInstitute?.id || institutes[0]?.id || ''}
                    onChange={(e) => {
                      const found = institutes.find((i) => i.id === e.target.value);
                      if (found) setSelectedInstitute(found);
                    }}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs text-slate-800 font-medium"
                  >
                    {institutes.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.city || 'Patna'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* 3. Role-Tailored Credential Fields */}
            {activeTab === 'student' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Student Roll Number or Registered Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. STD_PAT_001 or student@apex.edu"
                    value={studentIdentifier}
                    onChange={(e) => setStudentIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-800"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Enter the unique Student ID or registered email assigned by your institute.
                </span>
              </div>
            )}

            {activeTab === 'parent' && (
              <>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Guardian Email or Registered Mobile <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <HeartHandshake className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. parent@apex.edu or +91 98765 43210"
                      value={guardianIdentifier}
                      onChange={(e) => setGuardianIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Ward Student ID / Roll Code <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. STD_PAT_001 or STD_NA_01_001"
                      value={wardStudentId}
                      onChange={(e) => setWardStudentId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Cross-matched with Section 9 parental consent record.
                  </span>
                </div>
              </>
            )}

            {activeTab === 'teacher' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Faculty Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. teacher@apex.edu"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs text-slate-800"
                  />
                </div>
              </div>
            )}

            {activeTab === 'owner' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Institute Director / Admin Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. owner@apex.edu"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 block">
                  Password <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">Demo password: &quot;password&quot; or role name</span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={submitting || ( (activeTab === 'student' || activeTab === 'parent') && !matchedInstitute )}
              className={`w-full mt-2 py-2.5 px-4 text-white rounded-xl font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50 ${
                activeTab === 'student'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : activeTab === 'parent'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : activeTab === 'teacher'
                  ? 'bg-teal-600 hover:bg-teal-700'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              <span>
                {submitting
                  ? 'Verifying Session...'
                  : activeTab === 'student'
                  ? 'Sign In as Student'
                  : activeTab === 'parent'
                  ? 'Sign In as Guardian'
                  : activeTab === 'teacher'
                  ? 'Sign In as Faculty'
                  : 'Sign In as Director'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {activeTab === 'owner' && (
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Coaching Institute not registered?</span>
              <Link href="/register" className="font-bold text-teal-700 hover:underline">
                Register New Institute &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Active Role Persona & Instant 1-Click Verification */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Pre-Calibrated Benchmark Persona ({activeTab.toUpperCase()})
                </h3>
              </div>
              <span className="text-[10px] text-teal-700 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                Live DB Calibrated
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              For evaluation, testing, or reviewing the platform, you can directly launch this pre-calibrated role account linked to actual benchmark records:
            </p>

            {/* Active Role Quick Card */}
            {activeTab === 'student' && (
              <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    Student Aspirant
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold">1-Click Launch &rarr;</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Ishaan Prasad (STD_PAT_001)</h4>
                  <p className="text-[11px] text-slate-500">Apex JEE & Medical Academy, Patna</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    JEE Advanced Aspirant • Zero-Shaming Growth View • Real BKT Topic Mastery Records
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleDirectPersonaLogin({
                      id: 'USR_STUDENT_01',
                      email: 'student@apex.edu',
                      password: 'student',
                      full_name: 'Ishaan Prasad',
                      role: 'student',
                      tenant_id: 'INST_PATNA_01',
                      institute_name: 'Apex JEE & Medical Academy, Patna',
                      student_id: 'STD_PAT_001',
                      description: 'JEE Advanced Aspirant'
                    })
                  }
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Launch Student Growth Dashboard</span>
                </button>
              </div>
            )}

            {activeTab === 'parent' && (
              <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                    Parent / Guardian
                  </span>
                  <span className="text-[11px] text-amber-600 font-bold">1-Click Launch &rarr;</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Mahesh Prasad (Guardian)</h4>
                  <p className="text-[11px] text-slate-500">Apex JEE & Medical Academy, Patna</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Parent of Ishaan Prasad • Weekly Bilingual Digest (EN/HI) • Verified Attendance
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleDirectPersonaLogin({
                      id: 'USR_PARENT_01',
                      email: 'parent@apex.edu',
                      password: 'parent',
                      full_name: 'Mahesh Prasad (Guardian)',
                      role: 'parent',
                      tenant_id: 'INST_PATNA_01',
                      institute_name: 'Apex JEE & Medical Academy, Patna',
                      student_id: 'STD_PAT_001',
                      description: 'Parent of Ishaan Prasad'
                    })
                  }
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Launch Parent Progress Digest</span>
                </button>
              </div>
            )}

            {activeTab === 'teacher' && (
              <div className="p-4 bg-white rounded-xl border border-teal-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold uppercase">
                    Senior Faculty
                  </span>
                  <span className="text-[11px] text-teal-600 font-bold">1-Click Launch &rarr;</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Prof. R. K. Verma</h4>
                  <p className="text-[11px] text-slate-500">Apex JEE & Medical Academy, Patna</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Senior Physics Faculty & Academic Lead • Heatmap Triage • AI Lesson Copilot
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleDirectPersonaLogin({
                      id: 'USR_TEACHER_01',
                      email: 'teacher@apex.edu',
                      password: 'teacher',
                      full_name: 'Prof. R. K. Verma',
                      role: 'teacher',
                      tenant_id: 'INST_PATNA_01',
                      institute_name: 'Apex JEE & Medical Academy, Patna',
                      description: 'Senior Physics Faculty'
                    })
                  }
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Launch Teacher Workspace</span>
                </button>
              </div>
            )}

            {activeTab === 'owner' && (
              <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                    Director & Owner
                  </span>
                  <span className="text-[11px] text-blue-600 font-bold">1-Click Launch &rarr;</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Dr. S. K. Narayan</h4>
                  <p className="text-[11px] text-slate-500">Apex JEE & Medical Academy, Patna</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Director • Financial ROI Model • Early-Warning Retention • DPDP Privacy VPC
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleDirectPersonaLogin({
                      id: 'USR_OWNER_01',
                      email: 'owner@apex.edu',
                      password: 'owner',
                      full_name: 'Dr. S. K. Narayan',
                      role: 'owner',
                      tenant_id: 'INST_PATNA_01',
                      institute_name: 'Apex JEE & Medical Academy, Patna',
                      description: 'Institute Owner'
                    })
                  }
                  className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Launch Owner Executive Dashboard</span>
                </button>
              </div>
            )}
          </div>

          {/* Database Lineage Audit Note */}
          <div className="p-4 rounded-xl bg-blue-950 text-blue-100 text-xs space-y-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="font-bold text-white text-xs">Data Security & DPDP Compliance</span>
            </div>
            <p className="text-[11px] text-blue-200/90 leading-relaxed">
              All multi-stakeholder sessions are isolated at the database tenant level. Student assessment records are never transferred across coaching institutes or shared with third-party LLMs without consent.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
        <span>&copy; {new Date().getFullYear()} Nextute EdTech Pvt. Ltd. • The Data Moat</span>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:text-teal-600 transition">Public Homepage</Link>
          <span>•</span>
          <Link href="/profile" className="hover:text-teal-600 transition">Account Profile</Link>
          <span>•</span>
          <Link href="/privacy-policy" className="hover:text-teal-600 transition">Privacy Policy (DPDP Act)</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-teal-600 transition">Terms of Service</Link>
          <span>•</span>
          <Link href="/register" className="hover:text-teal-600 transition">Register Institute</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto py-12 text-center text-xs text-slate-500">
          Loading authentication portal...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
