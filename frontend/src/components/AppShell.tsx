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
            {/* Left: Mobile Hamburger Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg bg-blue-900/60 text-slate-300 hover:text-white lg:hidden border border-blue-800"
                aria-label="Open Sidebar Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Right: User Avatar Picture with Clickable Profile Window */}
            <div className="flex items-center space-x-2.5 text-xs ml-auto">
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
