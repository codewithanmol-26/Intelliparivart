'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../lib/types';
import {
  Menu,
  Building2,
  RotateCw,
  Wifi,
  WifiOff,
  Database,
  Languages,
  Calendar,
  LogIn,
  LogOut,
  X,
  CheckCircle2
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const {
    tenantId,
    setTenantId,
    role,
    setRole,
    isOnline,
    offlineQueueCount,
    institutes,
    isRecomputing,
    lastRunId,
    recomputeNotification,
    triggerRecompute,
    clearNotification,
  } = useApp();

  const { user, logout } = useAuth();
  const [recomputingLocal, setRecomputingLocal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'm1-3' | 'm4-8'>('all');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const handleManualRecompute = async () => {
    setRecomputingLocal(true);
    await triggerRecompute();
    setRecomputingLocal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Responsive Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area (Offset by 64px/w-64 on lg screens) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 bg-[#0B1F3A] text-white shadow-md border-b border-blue-900/60">
          {/* Top Lineage & Compliance Banner */}
          <div className="bg-[#08172c] border-b border-blue-900/50 px-3 sm:px-6 py-1 text-[11px] sm:text-xs flex flex-wrap items-center justify-between text-blue-200 gap-1.5">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded text-[10px]">
                PRODUCTION PIPELINE ACTIVE
              </span>
              <span className="truncate max-w-[240px] sm:max-w-none text-slate-300">
                Apex JEE & Medical Academy, Patna • Live Academic Intelligence
              </span>
              {lastRunId && (
                <span className="hidden md:inline-flex items-center px-1.5 py-0.2 bg-teal-950/80 border border-teal-500/40 rounded text-[10px] text-teal-300 font-mono">
                  <Database className="w-2.5 h-2.5 mr-1" />
                  {lastRunId.length > 20 ? `Run ${lastRunId.slice(-8)}` : lastRunId}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 text-[11px]">
              <span className="hidden sm:inline text-slate-400">DPDP Act 2023 Compliant</span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <div className="flex items-center space-x-1">
                {isOnline ? (
                  <span className="flex items-center text-emerald-400">
                    <Wifi className="w-3 h-3 mr-1" /> Live Sync
                  </span>
                ) : (
                  <span className="flex items-center text-amber-400 font-bold">
                    <WifiOff className="w-3 h-3 mr-1" /> Offline ({offlineQueueCount})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Recompute Notification Banner */}
          {recomputeNotification && (
            <div className="bg-teal-600 text-white px-4 py-1 text-xs flex items-center justify-between shadow-inner">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium">{recomputeNotification}</span>
              </div>
              <button onClick={clearNotification} className="text-teal-100 hover:text-white p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Controls Bar */}
          <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2.5">
            {/* Left: Mobile Hamburger Toggle + Context Title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg bg-blue-900/60 text-slate-300 hover:text-white lg:hidden border border-blue-800"
                aria-label="Open Sidebar Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-teal-400 shrink-0" />
                <select
                  aria-label="Select Institute Tenant"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="bg-blue-950/80 border border-blue-800/80 rounded-lg px-2.5 py-1 text-xs text-white font-medium focus:outline-none cursor-pointer max-w-[210px] truncate"
                >
                  {institutes.map((inst) => (
                    <option key={inst.id} value={inst.id} className="bg-[#0B1F3A] text-white">
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right: Academic Period, Role, Language, Recompute & Auth */}
            <div className="flex items-center space-x-2 text-xs">
              {/* Period Selector */}
              <div className="hidden md:flex items-center bg-blue-950/70 border border-blue-800/60 rounded-lg px-2 py-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-[11px]"
                >
                  <option value="all" className="bg-[#0B1F3A] text-white">All Months (M1–M8)</option>
                  <option value="m1-3" className="bg-[#0B1F3A] text-white">Early Triage (M1–M3)</option>
                  <option value="m4-8" className="bg-[#0B1F3A] text-white">Advanced Prep (M4–M8)</option>
                </select>
              </div>

              {/* Role Switcher */}
              <div className="flex items-center bg-blue-950/70 border border-blue-800/60 rounded-lg px-2 py-1">
                <span className="text-slate-400 mr-1 hidden sm:inline">Role:</span>
                <select
                  aria-label="Select User Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="bg-transparent text-teal-300 font-semibold focus:outline-none cursor-pointer capitalize text-xs"
                >
                  <option value="owner" className="bg-[#0B1F3A] text-white">Institute Owner</option>
                  <option value="teacher" className="bg-[#0B1F3A] text-white">Teacher / Academic Head</option>
                  <option value="student" className="bg-[#0B1F3A] text-white">Student (Growth View)</option>
                  <option value="parent" className="bg-[#0B1F3A] text-white">Parent (Digest View)</option>
                </select>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center rounded-lg border border-blue-800/60 overflow-hidden bg-blue-950/70 text-[11px]">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 transition ${language === 'en' ? 'bg-teal-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2 py-1 transition ${language === 'hi' ? 'bg-teal-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Recompute Action */}
              <button
                onClick={handleManualRecompute}
                disabled={isRecomputing || recomputingLocal}
                title="Trigger Full Recompute Pipeline (2PL IRT + BKT + GBDT + Conformal)"
                className="inline-flex items-center px-2.5 py-1 bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/50 rounded-lg text-xs font-semibold text-teal-300 transition disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 mr-1 ${isRecomputing || recomputingLocal ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isRecomputing || recomputingLocal ? 'Recomputing...' : 'Recompute'}</span>
              </button>

              {/* Auth Button */}
              {user ? (
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 hover:bg-blue-900/60 text-slate-300 hover:text-white rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>
              <strong>Intelliprivart</strong> — AI-Powered Institute Intelligence Platform | Case B: The Data Moat (Nextute × IIT Patna)
            </p>
            <div className="flex items-center space-x-3 text-[11px]">
              <span>Multi-Tenant PostgreSQL</span>
              <span>•</span>
              <span>DPDP Act 2023 Section 9 VPC</span>
              <span>•</span>
              <span className="text-teal-600 font-semibold">2PL IRT + BKT + Conformal Quantiles</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
