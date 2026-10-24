'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../lib/types';
import {
  LayoutDashboard,
  UploadCloud,
  AlertTriangle,
  Users,
  Layers,
  ShieldAlert,
  LineChart,
  GraduationCap,
  CheckCircle2,
  Download,
  Lock,
  Sparkles,
  FileSpreadsheet,
  FileCheck2,
  ChevronRight,
  Database,
  Building2,
  Globe,
  PlayCircle,
  X,
  HeartHandshake,
  UserCheck,
  User,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { tenantId, role, setRole, setSelectedStudentId, offlineQueueCount, isOnline } = useApp();

  const handleLogout = () => {
    onClose();
    logout();
    router.push('/');
  };

  const getRoleNavItems = () => {
    switch (role) {
      case 'owner':
        return [
          { href: '/overview', label: 'Owner Dashboard', icon: LayoutDashboard },
          { href: '/directory', label: 'Faculty & Students', icon: Users },
          { href: '/owner', label: 'Executive ROI Model', icon: FileSpreadsheet },
          { href: '/risk', label: 'Early-Warning Dropouts', icon: ShieldAlert },
          { href: '/interventions', label: 'Remedial Triage Ledger', icon: CheckCircle2 },
          { href: '/mastery', label: 'Batch Mastery Heatmap', icon: Layers },
          { href: '/upload', label: 'Data Ingestion & OMR', icon: UploadCloud },
          { href: '/model-report', label: 'ML Rigour Card', icon: FileCheck2 },
          { href: '/exports', label: 'Reports & Exports', icon: Download },
          { href: '/privacy', label: 'Settings & DPDP Privacy', icon: Lock },
        ];
      case 'teacher':
        return [
          { href: '/overview', label: 'Teacher Workspace', icon: LayoutDashboard },
          { href: '/mastery', label: 'Topic Mastery Heatmap', icon: Layers },
          { href: '/ai-assistant', label: 'AI Teaching Copilot', icon: Sparkles },
          { href: '/interventions', label: 'Remedial Triage & Worksheets', icon: CheckCircle2 },
          { href: '/risk', label: 'Students Needing Support', icon: ShieldAlert },
          { href: '/predict', label: 'Performance Forecast', icon: LineChart },
          { href: '/upload', label: 'Upload Marks & OMR', icon: UploadCloud },
          { href: '/review-queue', label: 'Review Queue', icon: AlertTriangle },
          { href: '/reports', label: 'Parent Progress Digests', icon: GraduationCap },
        ];
      case 'student':
        return [
          { href: '/overview', label: 'My Growth Dashboard', icon: LayoutDashboard },
          { href: '/student', label: 'Topic Mastery & Strengths', icon: Layers },
          { href: '/predict', label: 'Predicted Progress', icon: LineChart },
          { href: '/ai-assistant', label: 'AI Doubt Practice', icon: Sparkles },
          { href: '/privacy', label: 'My DPDP Privacy Rights', icon: Lock },
        ];
      case 'parent':
        return [
          { href: '/overview', label: 'Parent Progress Digest', icon: LayoutDashboard },
          { href: '/reports', label: 'Bilingual Report (EN/HI)', icon: GraduationCap },
          { href: '/privacy', label: 'Guardian Consent Register', icon: Lock },
        ];
      default:
        return [
          { href: '/overview', label: 'Overview', icon: LayoutDashboard },
          { href: '/student', label: 'Student Analytics', icon: Users },
          { href: '/mastery', label: 'Topic Mastery', icon: Layers },
          { href: '/interventions', label: 'Intervention Tracker', icon: CheckCircle2 },
        ];
    }
  };

  const primaryNavItems = getRoleNavItems();

  const secondaryNavItems = [
    { href: '/demo-tools', label: 'Scenario Simulator', icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B1F3A] text-slate-200 border-r border-blue-900/40 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Area */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-blue-900/50 bg-[#08172c]">
          <Link href="/overview" onClick={onClose} className="flex items-center group">
            <img
              src="/intelliprivart-logo-dark.png"
              alt="Intelliprivart"
              className="h-8 w-auto object-contain group-hover:opacity-90 transition"
            />
          </Link>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white lg:hidden cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role-Adaptive Primary Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          <div>
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              {role === 'owner' && 'Owner & Executive Tools'}
              {role === 'teacher' && 'Teacher & Classroom Tools'}
              {role === 'student' && 'My Learning Tools'}
              {role === 'parent' && 'Parent Digest Tools'}
            </span>
            <nav className="space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-xs font-bold'
                        : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-200" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Secondary Utilities */}
          <div className="pt-2 border-t border-blue-900/40">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Evaluation & Judge Tools
            </span>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-teal-600/80 text-white font-bold'
                        : 'text-slate-400 hover:bg-blue-900/30 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Account & Exit / Logout Section */}
          <div className="pt-3 border-t border-blue-900/40 space-y-1.5">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Session Management
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/60 hover:text-white border border-rose-900/40 transition group cursor-pointer"
              title="Logout from dashboard and return to public website (Auto Logout)"
            >
              <div className="flex items-center space-x-2.5">
                <LogOut className="w-4 h-4 text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Logout &amp; Return to Home</span>
              </div>
              <span className="text-[10px] bg-rose-950/90 text-rose-300 border border-rose-800/80 px-1.5 py-0.5 rounded font-mono">
                Exit
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer: System Status */}
        <div className="p-3 border-t border-blue-900/50 bg-[#08172c] text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Tenant Context:</span>
            <span className="font-mono text-teal-300 text-[10px] bg-teal-950/70 border border-teal-500/30 px-1.5 py-0.2 rounded">
              {tenantId}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span>System Mode</span>
            <span className="text-emerald-400 font-semibold">Institutional Active</span>
          </div>
          <div className="pt-1.5 border-t border-blue-900/40 flex items-center justify-between text-[10px] text-slate-500">
            <Link href="/privacy-policy" className="hover:text-teal-300 transition">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-teal-300 transition">Terms</Link>
          </div>
        </div>
      </aside>
    </>
  );
}
