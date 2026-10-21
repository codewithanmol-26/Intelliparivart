'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { DemoUserPersona } from '../../lib/types';
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
  TrendingUp,
  UserCheck
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemoUser, user } = useAuth();
  const { setTenantId, setRole, setSelectedStudentId } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [demoUsers, setDemoUsers] = useState<DemoUserPersona[]>([]);

  useEffect(() => {
    api
      .getDemoUsers()
      .then((data) => setDemoUsers(data))
      .catch(() => {
        // Fallback local list
        setDemoUsers([
          {
            id: 'USR_OWNER_01',
            email: 'owner@apex.edu',
            password: 'owner',
            full_name: 'Dr. S. K. Narayan',
            role: 'owner',
            tenant_id: 'INST_PATNA_01',
            institute_name: 'Apex JEE & Medical Academy, Patna',
            description: 'Institute Owner & Financial Decision Maker',
          },
          {
            id: 'USR_TEACHER_01',
            email: 'teacher@apex.edu',
            password: 'teacher',
            full_name: 'Prof. R. K. Verma',
            role: 'teacher',
            tenant_id: 'INST_PATNA_01',
            institute_name: 'Apex JEE & Medical Academy, Patna',
            description: 'Senior Physics Faculty & Academic Lead',
          },
          {
            id: 'USR_STUDENT_01',
            email: 'student@apex.edu',
            password: 'student',
            full_name: 'Ishaan Prasad',
            role: 'student',
            tenant_id: 'INST_PATNA_01',
            institute_name: 'Apex JEE & Medical Academy, Patna',
            description: 'JEE Advanced Aspirant (Zero-Shaming Growth View)',
          },
          {
            id: 'USR_PARENT_01',
            email: 'parent@apex.edu',
            password: 'parent',
            full_name: 'Mahesh Prasad (Guardian)',
            role: 'parent',
            tenant_id: 'INST_PATNA_01',
            institute_name: 'Apex JEE & Medical Academy, Patna',
            description: 'Parent of Ishaan Prasad (Weekly Progress Digest)',
          },
        ]);
      });
  }, []);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      setTenantId(loggedUser.tenant_id);
      setRole(loggedUser.role);
      if (loggedUser.student_id) setSelectedStudentId(loggedUser.student_id);

      // Redirect to appropriate role home
      if (loggedUser.role === 'owner') router.push('/owner');
      else if (loggedUser.role === 'teacher') router.push('/upload');
      else if (loggedUser.role === 'student') router.push('/student');
      else if (loggedUser.role === 'parent') router.push('/reports');
      else router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials or use a 1-click Demo Persona below.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoSelect = async (persona: DemoUserPersona) => {
    setError(null);
    setSubmitting(true);
    try {
      const loggedUser = await loginAsDemoUser(persona);
      setTenantId(loggedUser.tenant_id);
      setRole(loggedUser.role);
      if (loggedUser.student_id) setSelectedStudentId(loggedUser.student_id);

      // Redirect according to role
      if (loggedUser.role === 'owner') router.push('/owner');
      else if (loggedUser.role === 'teacher') router.push('/upload');
      else if (loggedUser.role === 'student') router.push('/student');
      else if (loggedUser.role === 'parent') router.push('/reports');
      else router.push('/');
    } catch (err: any) {
      setError('Unable to authenticate demo persona. Backend server may be offline.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4">
      {/* Title & Brand Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 bg-teal-500/10 text-teal-700 border border-teal-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>DPDP Act 2023 Compliant Multi-Tenant Authentication</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Intelliprivart
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Access your role-specific dashboard with cryptographic tenant isolation and real-time database intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Manual Account Login
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Enter your coaching institute email and password.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Institute Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="e.g. owner@apex.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Password
              </label>
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition shadow-sm flex items-center justify-center space-x-1.5"
            >
              <span>{submitting ? 'Verifying Session...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Zero-knowledge tokens backed by PyJWT with 24-hour expiration.
          </div>
        </div>

        {/* 1-Click Demo Evaluation Personas */}
        <div className="lg:col-span-7 bg-slate-50/80 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900">
                1-Click Demo Evaluation Personas (For Judges & Reviewers)
              </h2>
            </div>
            <span className="text-[10px] text-teal-700 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              Instant Access
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Click any persona below to immediately log in with calibrated database records for that role:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {demoUsers.map((persona) => {
              const isOwner = persona.role === 'owner';
              const isTeacher = persona.role === 'teacher';
              const isStudent = persona.role === 'student';

              return (
                <button
                  key={persona.id}
                  onClick={() => handleDemoSelect(persona)}
                  disabled={submitting}
                  className="text-left p-3.5 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-sm transition flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        isOwner
                          ? 'bg-blue-100 text-blue-800'
                          : isTeacher
                          ? 'bg-teal-100 text-teal-800'
                          : isStudent
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {persona.role}
                    </span>
                    <span className="text-[11px] text-teal-600 font-semibold group-hover:translate-x-0.5 transition flex items-center">
                      <span>Launch</span> &rarr;
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">
                      {persona.full_name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {persona.institute_name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      {persona.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
