'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { UserRole } from '../lib/types';
import {
  Building2,
  Layers,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  ArrowLeft,
  Info,
  Check
} from 'lucide-react';

interface DemoBannerProps {
  onOpenRoleModal?: () => void;
}

export default function DemoBanner({ onOpenRoleModal }: DemoBannerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole, setSelectedStudentId } = useApp();

  const isDemoRoute = pathname.startsWith('/demo');

  // Map roles to their target routes
  const roles: Array<{
    id: UserRole;
    label: string;
    route: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'owner', label: 'Institute Owner', route: '/demo/owner', icon: Building2 },
    { id: 'teacher', label: 'Teacher / Faculty', route: '/demo/teacher', icon: Layers },
    { id: 'student', label: 'Student (Growth View)', route: '/demo/student', icon: GraduationCap },
    { id: 'parent', label: 'Parent (Digest View)', route: '/demo/parent', icon: HeartHandshake }
  ];

  const handleRoleSwitch = (targetRole: UserRole, targetRoute: string) => {
    setRole(targetRole);
    if (targetRole === 'student' || targetRole === 'parent') {
      setSelectedStudentId('STD_PAT_001');
    }
    router.push(targetRoute);
  };

  // Derive singular active role to guarantee exactly one button is selected
  const activeRole: UserRole = React.useMemo(() => {
    if (pathname === '/demo/owner') return 'owner';
    if (pathname === '/demo/teacher') return 'teacher';
    if (pathname === '/demo/student') return 'student';
    if (pathname === '/demo/parent') return 'parent';
    return role;
  }, [pathname, role]);

  // Synchronize AppContext role if navigating directly via URL or history
  React.useEffect(() => {
    if (pathname === '/demo/owner' && role !== 'owner') {
      setRole('owner');
    } else if (pathname === '/demo/teacher' && role !== 'teacher') {
      setRole('teacher');
    } else if (pathname === '/demo/student' && role !== 'student') {
      setRole('student');
      setSelectedStudentId('STD_PAT_001');
    } else if (pathname === '/demo/parent' && role !== 'parent') {
      setRole('parent');
      setSelectedStudentId('STD_PAT_001');
    }
  }, [pathname, role, setRole, setSelectedStudentId]);


  return (
    <div className="bg-[#0B1F3A] text-white border-b border-blue-900/60 shadow-md">
      {/* Upper Status Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between text-[11px] gap-2 border-b border-blue-900/40">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="font-bold tracking-wider uppercase text-teal-300 bg-teal-950/80 border border-teal-500/40 px-2 py-0.5 rounded text-[10px]">
            Demo Mode — Sample Data
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Simulated Benchmark: Apex JEE Academy, Patna (1,200 Students)
          </span>
        </div>

        <div className="flex items-center space-x-3 text-slate-300">
          <span className="hidden md:inline text-slate-400">
            Evaluating for Round 2 Finalist Presentation
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <Link
            href="/"
            className="text-teal-300 hover:text-white font-medium flex items-center space-x-1 transition"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Public Site</span>
          </Link>
        </div>
      </div>

      {/* Main Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Role Switcher Label */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-300 tracking-wide">
            Switch Perspective:
          </span>
          <span className="text-[11px] text-teal-400 font-medium">
            (Instant Walkthrough for Judges)
          </span>
        </div>

        {/* Center: 4 Role Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = r.id === activeRole;
            return (
              <button
                key={r.id}
                onClick={() => handleRoleSwitch(r.id, r.route)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-sm ring-2 ring-teal-400/50'
                    : 'bg-blue-950/80 text-slate-300 hover:bg-blue-900/80 hover:text-white border border-blue-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
                {isActive && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}


        </div>
      </div>
    </div>
  );
}
