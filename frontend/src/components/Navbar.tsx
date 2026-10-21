'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  User,
  Building2,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    tenantId,
    setTenantId,
    role,
    setRole,
    isOnline,
    offlineQueueCount,
    institutes,
  } = useApp();

  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1F3A] text-white shadow-md">
      {/* Persistent Synthetic Demo Banner */}
      <div className="bg-[#08172c] border-b border-blue-900/40 px-3 sm:px-4 py-1 text-[11px] sm:text-xs flex flex-wrap items-center justify-between text-blue-200 gap-1.5">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
          <span className="font-semibold text-amber-300">DEMO MODE:</span>
          <span className="truncate max-w-[200px] sm:max-w-none">
            1,200 Synthetic Students | Nextute × IIT Patna
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="hidden sm:inline text-slate-300">DPDP Act 2023 Compliant</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <div className="flex items-center space-x-1">
            {isOnline ? (
              <span className="flex items-center text-emerald-400">
                <Wifi className="w-3 h-3 mr-1" /> Online
              </span>
            ) : (
              <span className="flex items-center text-amber-400 font-bold">
                <WifiOff className="w-3 h-3 mr-1" /> Offline ({offlineQueueCount} queued)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal-500 flex items-center justify-center font-black text-white text-base sm:text-lg shadow-sm shrink-0">
                IM
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-white block leading-none">
                  INTELLIPRIVART
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-wider text-teal-300 uppercase block font-medium">
                  The Data Moat Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Right Controls (Laptop/Desktop View) */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Institute Switcher */}
            <div className="flex items-center bg-blue-950/70 border border-blue-800/60 rounded-md px-2.5 py-1 text-xs">
              <Building2 className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <select
                aria-label="Select Institute Tenant"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                {institutes.map((inst) => (
                  <option key={inst.id} value={inst.id} className="bg-[#0B1F3A] text-white">
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center bg-blue-950/70 border border-blue-800/60 rounded-md px-2.5 py-1 text-xs">
              <span className="text-slate-400 mr-1.5 font-medium">Role:</span>
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

            {/* Auth Profile / Logout */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-blue-800/60">
                <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {user.full_name ? user.full_name.charAt(0) : 'U'}
                </div>
                <div className="text-left text-[11px] leading-tight">
                  <span className="font-semibold text-white block max-w-[120px] truncate">
                    {user.full_name}
                  </span>
                  <span className="text-teal-300 capitalize text-[10px]">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 hover:bg-blue-900/60 text-slate-300 hover:text-white rounded-md transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center space-x-1 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-xs font-semibold shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            {user && (
              <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 uppercase">
                {role}
              </span>
            )}
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
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center font-bold text-white text-sm">
                    {user.full_name ? user.full_name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-teal-300 capitalize font-medium">
                      {user.role} • {user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                <span>Sign In to Your Institute</span>
              </Link>
            )}

            {/* Mobile Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-950 p-2.5 rounded-lg border border-blue-800">
                <label className="text-[10px] text-slate-400 font-medium block mb-1">
                  Active Institute Tenant:
                </label>
                <select
                  aria-label="Select Institute Tenant"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="w-full bg-transparent text-white font-medium focus:outline-none"
                >
                  {institutes.map((inst) => (
                    <option key={inst.id} value={inst.id} className="bg-[#0B1F3A] text-white">
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-950 p-2.5 rounded-lg border border-blue-800">
                <label className="text-[10px] text-slate-400 font-medium block mb-1">
                  Active Role Perspective:
                </label>
                <select
                  aria-label="Select User Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-transparent text-teal-300 font-bold focus:outline-none capitalize"
                >
                  <option value="owner" className="bg-[#0B1F3A] text-white">Institute Owner</option>
                  <option value="teacher" className="bg-[#0B1F3A] text-white">Teacher / Academic Head</option>
                  <option value="student" className="bg-[#0B1F3A] text-white">Student (Growth View)</option>
                  <option value="parent" className="bg-[#0B1F3A] text-white">Parent (Digest View)</option>
                </select>
              </div>
            </div>

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
