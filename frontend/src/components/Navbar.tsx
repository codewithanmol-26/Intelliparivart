'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import UserProfileMenu from './UserProfileMenu';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
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
  AlertTriangle,
  Menu,
  X,
  LogOut,
  LogIn,
  Building2,
  RotateCw,
  Database,
  CheckCircle2,
  User
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    tenantId,
    setTenantId,
    role,
    setRole,
    setSelectedStudentId,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recomputingLocal, setRecomputingLocal] = useState(false);

  const handleManualRecompute = async () => {
    setRecomputingLocal(true);
    await triggerRecompute();
    setRecomputingLocal(false);
  };

  const getNavLinks = () => {
    switch (role) {
      case 'owner':
        return [
          { href: '/overview', label: 'Owner Dashboard', icon: LineChart },
          { href: '/directory', label: 'Faculty & Students', icon: Users },
          { href: '/owner', label: 'Executive ROI & Cohort', icon: LineChart },
          { href: '/risk', label: 'Early-Warning Dropouts', icon: ShieldAlert },
          { href: '/mastery', label: 'Batch Mastery Heatmap', icon: Layers },
          { href: '/upload', label: 'Ingest & Sources Audit', icon: UploadCloud },
          { href: '/privacy', label: 'DPDP Consent & Privacy', icon: Lock },
          { href: '/model-report', label: 'ML Rigor & Financial Model', icon: FileCheck2 },
        ];
      case 'teacher':
        return [
          { href: '/overview', label: 'Teacher Workspace', icon: Layers },
          { href: '/mastery', label: 'Topic Mastery Heatmap', icon: Layers },
          { href: '/ai-assistant', label: 'AI Teaching Copilot', icon: Sparkles },
          { href: '/interventions', label: 'Remedial Triage & Worksheets', icon: CheckCircle2 },
          { href: '/risk', label: 'At-Risk & Remedials', icon: ShieldAlert },
          { href: '/predict', label: 'Percentile Ranges', icon: LineChart },
          { href: '/reports', label: 'Parent Digests (EN/HI)', icon: GraduationCap },
        ];
      case 'student':
        return [
          { href: '/overview', label: 'My Growth Dashboard', icon: Layers },
          { href: '/student', label: 'My Learning & Mastery', icon: Layers },
          { href: '/predict', label: 'My Predicted Progress', icon: LineChart },
          { href: '/ai-assistant', label: 'AI Doubt Practice', icon: Sparkles },
          { href: '/privacy', label: 'My DPDP Rights', icon: Lock },
        ];
      case 'parent':
        return [
          { href: '/overview', label: 'Parent Progress Digest', icon: GraduationCap },
          { href: '/reports', label: 'Weekly Progress Digest', icon: GraduationCap },
          { href: '/privacy', label: 'Guardian Consent Register', icon: Lock },
        ];
    }
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1F3A] text-white shadow-md">
      {/* Global Recompute Toast Notification Banner */}
      {recomputeNotification && (
        <div className="bg-teal-600 text-white px-4 py-1.5 text-xs flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{recomputeNotification}</span>
          </div>
          <button
            onClick={clearNotification}
            className="text-teal-100 hover:text-white p-0.5 rounded focus:outline-none"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link href="/" className="flex items-center group">
              <img
                src="/intelliprivart-logo-dark.png"
                alt="Intelliprivart"
                className="h-8 sm:h-9 w-auto object-contain group-hover:opacity-90 transition"
              />
            </Link>
          </div>

          {/* Desktop Right Controls (Laptop/Desktop View) */}
          <div className="hidden lg:flex items-center space-x-2.5">
            {/* User Profile Picture & Popover Window */}
            <UserProfileMenu align="right" />
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={handleManualRecompute}
              disabled={isRecomputing || recomputingLocal}
              className="p-1.5 rounded-lg bg-teal-600/30 text-teal-300 text-xs border border-teal-500/40"
              title="Recompute"
            >
              <RotateCw className={`w-4 h-4 ${isRecomputing || recomputingLocal ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-blue-950/70 border border-blue-800 text-slate-200 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-blue-900/80 py-4 space-y-4 animate-in slide-in-from-top duration-200 bg-[#08172c] rounded-b-2xl p-4 shadow-xl">
            {/* User Profile Card on Mobile */}
            {user ? (
              <div className="flex items-center justify-between p-3 bg-blue-950/90 rounded-xl border border-blue-800/60">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2.5 group"
                >
                  <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center font-bold text-white text-sm group-hover:bg-teal-400">
                    {user.full_name ? user.full_name.charAt(0) : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-teal-300">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-teal-300 capitalize font-medium">
                      {user.role} • {user.email}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 bg-blue-950 border border-blue-800 text-teal-300 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
                >
                  <Building2 className="w-3.5 h-3.5 mr-1" />
                  <span>Register</span>
                </Link>
              </div>
            )}



            {/* Mobile Nav Links List */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block mb-1">
                Navigation Modules
              </span>
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-blue-900/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Desktop Dynamic Tab Bar */}
        <nav className="hidden lg:flex space-x-1 border-t border-blue-900/60 overflow-x-auto py-1 scrollbar-none">
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
