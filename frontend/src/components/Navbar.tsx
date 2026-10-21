'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp, INSTITUTES } from '../context/AppContext';
import { UserRole } from '../lib/types';
import {
  ShieldAlert,
  GraduationCap,
  Users,
  LineChart,
  UploadCloud,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const {
    tenantId,
    setTenantId,
    role,
    setRole,
    isOnline,
    offlineQueueCount,
  } = useApp();

  const getNavLinks = () => {
    switch (role) {
      case 'owner':
        return [
          { href: '/owner', label: 'Executive ROI & Cohort', icon: LineChart },
          { href: '/risk', label: 'Early-Warning Dropouts', icon: ShieldAlert },
          { href: '/mastery', label: 'Batch Mastery Heatmap', icon: Layers },
          { href: '/privacy', label: 'DPDP Consent & Privacy', icon: Lock },
          { href: '/model-report', label: 'ML Rigor & Unit Economics', icon: FileCheck2 },
          { href: '/demo-tools', label: 'Live Curveball Sandbox', icon: Sparkles },
        ];
      case 'teacher':
        return [
          { href: '/upload', label: 'Data Ingestion & OMR', icon: UploadCloud },
          { href: '/review-queue', label: 'Review Queue', icon: AlertTriangle },
          { href: '/mastery', label: 'Topic Mastery Heatmap', icon: Layers },
          { href: '/risk', label: 'At-Risk & Remedials', icon: ShieldAlert },
          { href: '/predict', label: 'Percentile Ranges', icon: LineChart },
          { href: '/reports', label: 'Parent Digests (EN/HI)', icon: GraduationCap },
        ];
      case 'student':
        return [
          { href: '/student', label: 'My Learning & Mastery', icon: Layers },
          { href: '/predict', label: 'My Predicted Progress', icon: LineChart },
          { href: '/privacy', label: 'My DPDP Rights', icon: Lock },
        ];
      case 'parent':
        return [
          { href: '/reports', label: 'Weekly Progress Digest', icon: GraduationCap },
          { href: '/privacy', label: 'Guardian Consent Register', icon: Lock },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 bg-[#0B1F3A] text-white shadow-md">
      {/* Persistent Synthetic Demo Banner */}
      <div className="bg-[#08172c] border-b border-blue-900/40 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between text-blue-200">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="font-semibold tracking-wide text-amber-300">DEMO MODE:</span>
          <span>1,200 Synthetic JEE/NEET Student Cohort | Nextute × Finance Club, IIT Patna 2026</span>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <span className="text-slate-300">DPDP Act 2023 Compliant</span>
          <span className="text-slate-500">|</span>
          <div className="flex items-center space-x-1.5">
            {isOnline ? (
              <span className="flex items-center text-emerald-400">
                <Wifi className="w-3.5 h-3.5 mr-1" /> Online
              </span>
            ) : (
              <span className="flex items-center text-amber-400 font-bold">
                <WifiOff className="w-3.5 h-3.5 mr-1" /> Offline ({offlineQueueCount} queued)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center font-black text-white text-lg shadow-sm">
                IM
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block leading-none">
                  INTELLIPRIVART
                </span>
                <span className="text-[10px] tracking-wider text-teal-300 uppercase block font-medium">
                  The Data Moat Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Context Switchers: Institute & Role */}
          <div className="flex items-center space-x-3">
            {/* Institute Switcher */}
            <div className="flex items-center bg-blue-950/70 border border-blue-800/60 rounded-md px-2.5 py-1 text-xs">
              <span className="text-slate-400 mr-2 font-medium">Tenant:</span>
              <select
                aria-label="Select Institute Tenant"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                {INSTITUTES.map((inst) => (
                  <option key={inst.id} value={inst.id} className="bg-[#0B1F3A] text-white">
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center bg-blue-950/70 border border-blue-800/60 rounded-md px-2.5 py-1 text-xs">
              <span className="text-slate-400 mr-2 font-medium">Role:</span>
              <select
                aria-label="Select User Role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-transparent text-teal-300 font-semibold focus:outline-none cursor-pointer capitalize"
              >
                <option value="owner" className="bg-[#0B1F3A] text-white">Institute Owner</option>
                <option value="teacher" className="bg-[#0B1F3A] text-white">Teacher / Academic Head</option>
                <option value="student" className="bg-[#0B1F3A] text-white">Student (Growth View)</option>
                <option value="parent" className="bg-[#0B1F3A] text-white">Parent (Digest View)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Bar */}
        <nav className="flex space-x-1 border-t border-blue-900/60 overflow-x-auto py-1 scrollbar-none">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-blue-900/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
