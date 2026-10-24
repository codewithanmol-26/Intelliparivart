'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserRole } from '../lib/types';
import {
  User,
  LogOut,
  Building2,
  ShieldCheck,
  ChevronDown,
  Layers,
  GraduationCap,
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  Settings,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface UserProfileMenuProps {
  align?: 'right' | 'left';
  className?: string;
}

export default function UserProfileMenu({ align = 'right', className = '' }: UserProfileMenuProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { role, setRole, tenantId, institutes, setSelectedStudentId } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push('/');
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'student' || newRole === 'parent') {
      setSelectedStudentId('STD_PAT_001');
    }
    setIsOpen(false);
    router.push('/overview');
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2 text-xs">
        <Link
          href="/login"
          className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold transition shadow-sm"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition border border-white/20"
        >
          Register
        </Link>
      </div>
    );
  }

  const currentInstitute =
    institutes.find((i) => i.id === tenantId) ||
    institutes[0] || {
      id: tenantId || 'INST_PATNA_01',
      name: user.institute_name || 'Apex JEE & Medical Academy, Patna',
      city: 'Patna'
    };

  const initial = user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U';

  const roleLabel =
    user.role === 'owner'
      ? 'Institute Owner & Director'
      : user.role === 'teacher'
      ? 'Teacher / Faculty Lead'
      : user.role === 'student'
      ? 'Student (Growth Perspective)'
      : 'Parent / Guardian';

  const roleBadgeColor =
    user.role === 'owner'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : user.role === 'teacher'
      ? 'bg-teal-100 text-teal-800 border-teal-200'
      : user.role === 'student'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-amber-100 text-amber-800 border-amber-200';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      {/* Clickable Profile Picture / Avatar Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 pl-1.5 pr-2.5 rounded-full bg-blue-950/80 hover:bg-blue-900/90 border border-blue-800/80 transition shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 group"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Open Profile Window"
      >
        {/* User Avatar Circle with Online Ring */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-inner group-hover:scale-105 transition">
            {initial}
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0B1F3A] rounded-full"
            title="Session Active"
          />
        </div>

        {/* User Identity Info */}
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-xs font-bold text-white group-hover:text-teal-300 transition truncate max-w-[130px]">
            {user.full_name || 'My Account'}
          </span>
          <span className="text-[10px] text-teal-300 capitalize font-medium">
            {user.role}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-teal-300' : 'group-hover:text-slate-200'
          }`}
        />
      </button>

      {/* Professional Profile Popover Window */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-80 sm:w-88 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* 1. Profile Window Header (User Card Banner) */}
          <div className="p-4 bg-gradient-to-br from-[#08172c] to-[#0B1F3A] text-white space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
                  {initial}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white leading-tight">
                    {user.full_name || 'Authorized User'}
                  </h4>
                  <p className="text-[11px] text-slate-300 truncate max-w-[180px]">
                    {user.email}
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${roleBadgeColor}`}>
                {user.role}
              </span>
            </div>

            {/* Institute Affiliation */}
            <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-800/80 text-[11px] space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate font-semibold text-white">
                  {currentInstitute.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-teal-300 font-medium pl-5">
                <span>
                  {user.role === 'owner'
                    ? 'Sole Institute Owner (1 per institute)'
                    : user.role === 'teacher'
                    ? 'Faculty Member (Multiple in institute)'
                    : user.role === 'student'
                    ? 'Enrolled Student (Multiple in institute)'
                    : 'Parent / Guardian (Multiple in institute)'}
                </span>
                {user.student_id && <span className="font-mono">ID: {user.student_id}</span>}
              </div>
            </div>
          </div>

          {/* 2. Navigation Actions */}
          <div className="p-2 space-y-1 text-xs">
            <Link
              href="/overview"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition text-slate-700 font-semibold group"
            >
              <div className="flex items-center space-x-2.5">
                <Layers className="w-4 h-4 text-teal-600 group-hover:scale-110 transition" />
                <span>Go to Role Dashboard</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition text-slate-700 font-semibold group"
            >
              <div className="flex items-center space-x-2.5">
                <User className="w-4 h-4 text-blue-600 group-hover:scale-110 transition" />
                <span>Account &amp; Consent Profile</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/privacy"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition text-slate-700 font-semibold group"
            >
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" />
                <span>DPDP Act Privacy Rights</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          {/* 3. Quick Stakeholder Role Perspective Switcher */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-[11px] space-y-2">
            <div className="flex items-center justify-between text-slate-500 font-semibold">
              <span className="uppercase tracking-wider text-[10px]">Switch Perspective:</span>
              <span className="text-teal-700 font-bold capitalize">{role}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 font-bold">
              <button
                type="button"
                onClick={() => handleRoleSwitch('owner')}
                className={`px-2 py-1.5 rounded-lg border text-left transition flex items-center space-x-1.5 ${
                  role === 'owner'
                    ? 'bg-blue-900 text-white border-blue-950 font-black'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Owner</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch('teacher')}
                className={`px-2 py-1.5 rounded-lg border text-left transition flex items-center space-x-1.5 ${
                  role === 'teacher'
                    ? 'bg-teal-700 text-white border-teal-800 font-black'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch('student')}
                className={`px-2 py-1.5 rounded-lg border text-left transition flex items-center space-x-1.5 ${
                  role === 'student'
                    ? 'bg-emerald-600 text-white border-emerald-700 font-black'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch('parent')}
                className={`px-2 py-1.5 rounded-lg border text-left transition flex items-center space-x-1.5 ${
                  role === 'parent'
                    ? 'bg-amber-600 text-white border-amber-700 font-black'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Parent</span>
              </button>
            </div>
          </div>

          {/* 4. Footer Logout Action */}
          <div className="p-2.5 border-t border-slate-100 bg-white flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">
              DPDP Isolated VPC
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
