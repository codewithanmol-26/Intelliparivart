'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import UserProfileMenu from './UserProfileMenu';
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
  Calendar,
  LogIn,
  LogOut,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PlayCircle,
  HelpCircle,
  Layers,
  GraduationCap,
  HeartHandshake,
  User
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

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

  const { user, loading, logout } = useAuth();
  const [recomputingLocal, setRecomputingLocal] = useState(false);

  const isPublicRoute = [
    '/',
    '/public',
    '/privacy-policy',
    '/terms',
    '/terms-and-conditions',
    '/login',
    '/register',
  ].includes(pathname);

  // Dedicated demo subpages manage their own top role switcher bar
  const isDedicatedDemoPage = pathname.startsWith('/demo/');

  // Synchronize context role with authenticated user's profile
  React.useEffect(() => {
    if (user && user.role && user.role !== role) {
      setRole(user.role);
    }
  }, [user, role, setRole]);

  // Route Protection: Unauthenticated visitors trying to view private dashboards are directed to /login
  React.useEffect(() => {
    if (!loading && !user && !isPublicRoute && !isDedicatedDemoPage) {
      router.push('/login');
    }
  }, [loading, user, isPublicRoute, isDedicatedDemoPage, router]);

  const handleManualRecompute = async () => {
    setRecomputingLocal(true);
    await triggerRecompute();
    setRecomputingLocal(false);
  };

  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
        {/* Public Navigation Header (Linear/Stripe Minimal Design) */}
        <header className="sticky top-0 z-[100] bg-[#0B1F3A] text-white shadow-md border-b border-blue-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo & Brand Wordmark */}
            <Link href="/" className="flex items-center space-x-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/intelliprivart-logo-dark.png"
                alt="Intelliprivart"
                className="h-8 sm:h-9 w-auto object-contain group-hover:opacity-90 transition"
              />
            </Link>

            {/* Public Navigation (Clean product modules, no profile tab!) */}
            <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-200">
              <Link href="/#why-datamoat" className="hover:text-teal-300 transition">
                Why DataMoat
              </Link>
              <Link href="/model-report" className="text-teal-300 hover:text-white transition font-bold">
                ML Rigour
              </Link>
              <Link href="/#capabilities" className="hover:text-teal-300 transition">
                Capabilities
              </Link>
              <Link href="/#workflow" className="hover:text-teal-300 transition">
                How It Works
              </Link>
              <Link href="/ai-assistant" className="hover:text-teal-300 transition flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>AI Copilot</span>
              </Link>
            </nav>

            {/* Right Action: If authenticated, render UserProfileMenu. If guest/public, show Sign In & Register */}
            <div className="hidden sm:flex items-center text-xs">
              {user ? (
                <UserProfileMenu align="right" />
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold transition shadow-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition border border-white/20"
                  >
                    Register Institute
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex sm:hidden items-center space-x-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg bg-teal-500 text-white font-bold text-xs"
              >
                Sign In
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-blue-900/60 text-slate-300 hover:text-white border border-blue-800"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown Drawer */}
          {mobileMenuOpen && (
            <div className="sm:hidden bg-[#08172c] border-b border-blue-900/80 px-4 py-4 space-y-3 text-xs animate-fadeIn">
              <div className="grid grid-cols-2 gap-2 text-slate-200 font-semibold">
                {user ? (
                  <Link
                    href="/overview"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-blue-950 border border-blue-800 flex items-center space-x-2 text-teal-300"
                  >
                    <Layers className="w-4 h-4" />
                    <span>My Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-teal-600 text-white font-bold flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                )}
                <Link
                  href="/ai-assistant"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-blue-950 border border-blue-800 flex items-center space-x-2 text-teal-300"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Copilot</span>
                </Link>
                <Link
                  href="/#why-datamoat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-blue-900/60"
                >
                  Why DataMoat
                </Link>
                <Link
                  href="/#capabilities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-blue-900/60"
                >
                  Capabilities
                </Link>
                <Link
                  href="/#workflow"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-blue-900/60"
                >
                  How It Works
                </Link>
                <Link
                  href="/model-report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-blue-950 border border-blue-800 flex items-center space-x-2 text-teal-300 font-bold"
                >
                  <span>ML Rigour</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-teal-900/60 text-teal-200 border border-teal-700/50"
                >
                  Register Institute
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-teal-600 text-white font-bold"
                >
                  Portal Sign In
                </Link>
              </div>


            </div>
          )}
        </header>

        {/* Public Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>


      </div>
    );
  }

  // If on dedicated /demo/* pages, let the page and DemoBanner handle the layout cleanly
  if (isDedicatedDemoPage) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Responsive Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 bg-[#0B1F3A] text-white shadow-md border-b border-blue-900/60">
          {/* Top Lineage & Compliance Banner (Honest Demo Labeling) */}
          <div className="bg-[#08172c] border-b border-blue-900/50 px-3 sm:px-6 py-1 text-[11px] sm:text-xs flex flex-wrap items-center justify-between text-blue-200 gap-1.5">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse shrink-0"></span>
              <span className="font-semibold text-teal-300 bg-teal-950/80 border border-teal-500/40 px-1.5 py-0.5 rounded text-[10px]">
                DEMO MODE — SAMPLE DATA
              </span>
              <span className="truncate max-w-[240px] sm:max-w-none text-slate-300">
                Apex JEE & Medical Academy, Patna (1,200 Cohort) • Synthetic Intelligence
              </span>
            </div>

            <div className="flex items-center space-x-3 text-[11px]">
              <span className="hidden sm:inline text-slate-400">DPDP Act 2023 Compliant</span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <div className="flex items-center space-x-1">
                {isOnline ? (
                  <span className="flex items-center text-emerald-400">
                    <Wifi className="w-3 h-3 mr-1" /> Client Simulation Active
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

            {/* Right: Recompute Pipeline & Professional Profile Picture Dropdown */}
            <div className="flex items-center space-x-2.5 text-xs">
              {/* Recompute Action */}
              <button
                onClick={handleManualRecompute}
                disabled={isRecomputing || recomputingLocal}
                title="Trigger Full Recompute Pipeline"
                className="inline-flex items-center px-2.5 py-1 bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/50 rounded-lg text-xs font-semibold text-teal-300 transition disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 mr-1 ${isRecomputing || recomputingLocal ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isRecomputing || recomputingLocal ? 'Recomputing...' : 'Recompute'}</span>
              </button>

              {/* User Avatar Picture with Clickable Profile Window */}
              <UserProfileMenu align="right" />
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
              <strong>Intelliprivart</strong> — AI-Powered Institute Intelligence Platform | Case B: The Data Moat
            </p>
            <div className="flex items-center space-x-3 text-[11px]">
              <span>Demo Mode (Sample Data)</span>
              <span>•</span>
              <span>DPDP Act 2023 Compliant</span>
              <span>•</span>
              <span className="text-teal-600 font-semibold">2PL IRT + BKT Mastery</span>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}
