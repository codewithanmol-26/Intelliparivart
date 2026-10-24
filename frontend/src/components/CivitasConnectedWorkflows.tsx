'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Calendar,
  FileText,
  Contact,
  Phone,
  Tag,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  Printer,
  Shield,
  MessageSquare,
  Building2,
  Share2,
  Layers,
  GraduationCap,
  Star,
  Check,
  Search,
  Bell,
  MoreHorizontal
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface CivitasConnectedWorkflowsProps {
  studentId?: string;
  onBackToAnalytics?: () => void;
}

export default function CivitasConnectedWorkflows({
  studentId = 'STD_PAT_001',
  onBackToAnalytics
}: CivitasConnectedWorkflowsProps) {
  // Student persona toggle (Anna Williams from Civitas screenshot OR Aarav Sharma from DataMoat)
  const [selectedPersona, setSelectedPersona] = useState<'anna' | 'aarav'>('anna');

  // Active top tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'notes' | 'alerts' | 'advisors' | 'communication' | 'course_history' | 'events' | 'library'
  >('overview');

  // Shared notes state
  const [sharedNotes, setSharedNotes] = useState<Array<{ author: string; role: string; date: string; content: string }>>([
    {
      author: 'Dr. Eleanor Vance',
      role: 'Senior Academic Advisor',
      date: 'April 3, 2024',
      content: 'Anna expressed enthusiasm about research methodology. Discussed balancing honors coursework with lab hours.'
    },
    {
      author: 'Er. R. K. Verma',
      role: 'Physics Faculty Lead',
      date: 'March 18, 2024',
      content: 'Noticed a 14% slump in rotational dynamics test. Assigned 15-minute 3-tier remedial practice worksheet.'
    }
  ]);
  const [newNoteInput, setNewNoteInput] = useState<string>('');

  // Parent WhatsApp Communication State
  const [parentCommLang, setParentCommLang] = useState<'en' | 'hi'>('en');
  const [whatsappSent, setWhatsappSent] = useState<boolean>(false);

  // Remedial Worksheet Generation State
  const [remedialGenerated, setRemedialGenerated] = useState<boolean>(false);

  // Tags state
  const [tags, setTags] = useState<string[]>([
    selectedPersona === 'anna' ? 'Paramedic' : 'JEE Advanced',
    selectedPersona === 'anna' ? 'Austin' : 'Patna',
    selectedPersona === 'anna' ? 'Texas College' : 'Apex Academy',
    'Good Persistence'
  ]);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [showTagInput, setShowTagInput] = useState<boolean>(false);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    setSharedNotes([
      {
        author: 'Dr. Eleanor Vance (You)',
        role: 'Faculty Advisor',
        date: 'Just now',
        content: newNoteInput.trim()
      },
      ...sharedNotes
    ]);
    setNewNoteInput('');
  };

  // GPA Across Quarters Chart Data (Directly matching Image 2)
  const gpaQuartersData = [
    { quarter: 'Q1 2023', gpa: 3.82, scorePct: 86 },
    { quarter: 'Q2 2023', gpa: 3.98, scorePct: 88 },
    { quarter: 'Q3 2023', gpa: 3.75, scorePct: 84 },
    { quarter: 'Q4 2023', gpa: 3.65, scorePct: 82 },
    { quarter: 'Q1 2024', gpa: 3.42, scorePct: 78 },
    { quarter: 'Q2 2024', gpa: 3.21, scorePct: 74 }
  ];

  // Course Attendance / Participation Data (M, T, W, T, F, S, S)
  const attendanceDaysData = [
    { day: 'M', participation: 85, isStar: false },
    { day: 'T', participation: 95, isStar: true },
    { day: 'W', participation: 60, isStar: false },
    { day: 'T', participation: 92, isStar: true },
    { day: 'F', participation: 88, isStar: false },
    { day: 'S', participation: 80, isStar: false },
    { day: 'S', participation: 75, isStar: false }
  ];

  // Persistence Per Month Data (Jan, Mar, May, Jul)
  const persistenceMonthlyData = [
    { month: 'Jan', persistence: 92 },
    { month: 'Mar', persistence: 88 },
    { month: 'May', persistence: 82 },
    { month: 'Jul', persistence: 76 }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden font-sans text-slate-800">
      
      {/* 1. TOP HEADER & SEARCH BAR (Matching Civitas Setup) */}
      <div className="bg-white px-5 sm:px-8 py-3.5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2.5 shrink-0">
            <img
              src="/intelliprivart-icon.png"
              alt="Intelliprivart Shield"
              className="w-8 h-8 object-contain"
            />
            <div className="leading-tight">
              <span className="font-extrabold text-slate-900 tracking-wider text-xs block uppercase">
                COLLEGE STATE UNIVERSITY
              </span>
              <span className="text-[10px] text-teal-700 font-semibold block">
                Advising CRM &amp; Connected Workflows
              </span>
            </div>
          </div>

          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              readOnly
              value={selectedPersona === 'anna' ? 'Anna Williams (NetID: 660333)' : 'Aarav Sharma (STD_PAT_001)'}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Persona Switcher & Notification Badge */}
        <div className="flex items-center space-x-3 self-end md:self-auto text-xs">
          {onBackToAnalytics && (
            <button
              onClick={onBackToAnalytics}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
            >
              &larr; Actionable Analytics
            </button>
          )}

          {/* Toggle between Anna Williams and Aarav Sharma */}
          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => setSelectedPersona('anna')}
              className={`px-2 py-1 rounded transition ${selectedPersona === 'anna' ? 'bg-[#0F2744] text-white' : 'text-slate-600'}`}
            >
              Anna Williams (Civitas)
            </button>
            <button
              onClick={() => setSelectedPersona('aarav')}
              className={`px-2 py-1 rounded transition ${selectedPersona === 'aarav' ? 'bg-teal-700 text-white' : 'text-slate-600'}`}
            >
              Aarav Sharma (DataMoat)
            </button>
          </div>

          <div className="relative">
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center border-2 border-white">
                40
              </span>
            </button>
          </div>

          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-600 to-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            EV
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE GRID: LEFT PROFILE 360 + RIGHT MAIN TAB CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: UNIFIED STUDENT PROFILE (STUDENT 360)             */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 p-5 sm:p-6 space-y-6 bg-[#f8fafc]/60">
          
          {/* Back button */}
          <button
            onClick={() => onBackToAnalytics && onBackToAnalytics()}
            className="text-xs text-slate-500 hover:text-slate-900 font-semibold flex items-center space-x-1 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Student List</span>
          </button>

          {/* Avatar Picture & Name Header */}
          <div className="text-center space-y-2">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-3 border-teal-500 shadow-md bg-gradient-to-tr from-teal-100 to-blue-200 flex items-center justify-center">
                {selectedPersona === 'anna' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
                    alt="Anna Williams"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250"
                    alt="Aarav Sharma"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <span className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                {selectedPersona === 'anna' ? 'Anna Williams' : 'Aarav Sharma'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedPersona === 'anna'
                  ? '27 Years Old · Female · Austin, Texas'
                  : '17 Years Old · Male · Patna, Bihar'}
              </p>
            </div>

            {/* Quick Action Icons Strip (Email, Calendar, Notes, ID) */}
            <div className="flex items-center justify-center space-x-2 pt-1 text-slate-500">
              <button
                onClick={() => setActiveTab('communication')}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:text-teal-700 hover:border-teal-400 transition"
                title="Send Message / WhatsApp"
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:text-teal-700 hover:border-teal-400 transition"
                title="Appointment Calendar"
              >
                <Calendar className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:text-teal-700 hover:border-teal-400 transition"
                title="Shared Faculty Notes"
              >
                <FileText className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:text-teal-700 hover:border-teal-400 transition"
                title="Unified Student Profile"
              >
                <Contact className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Action Buttons: View Student Summary + ... */}
            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className="flex-1 py-2 px-3 bg-[#1E3A8A] hover:bg-[#192f70] text-white font-bold text-xs rounded-xl transition shadow-xs"
              >
                View Student Summary
              </button>
              <button className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-500">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-mono text-[11px]">
                {selectedPersona === 'anna' ? '+21 0373467950' : '+91 98350 12345'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-mono text-[11px] truncate">
                {selectedPersona === 'anna' ? 'anna.williams@college.edu' : 'aarav.sharma@apexacademy.in'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Contact className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-mono text-[11px]">
                NetID: <strong>{selectedPersona === 'anna' ? '660333' : 'STD_PAT_001'}</strong>
              </span>
            </div>
          </div>

          {/* Tags (Matching Image 2: Paramedic, Austin, Texas College, Good Persistence, + Add Tag) */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Student Tags</span>
              <button
                onClick={() => setShowTagInput(!showTagInput)}
                className="text-[10px] text-teal-700 font-bold hover:underline flex items-center space-x-0.5"
              >
                <Plus className="w-3 h-3" />
                <span>Add Tag</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[10px]">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-700 shadow-2xs"
                >
                  <span>{t}</span>
                  <button onClick={() => handleRemoveTag(t)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>

            {showTagInput && (
              <form onSubmit={handleAddTag} className="flex gap-1 pt-1">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="New tag..."
                  className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-teal-600 text-white text-xs font-bold rounded-md"
                >
                  Add
                </button>
              </form>
            )}
          </div>

          {/* General Information (Matching Image 2) */}
          <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800 block text-xs">General Information</span>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Legal Name</span>
                <span className="font-semibold text-slate-800">
                  {selectedPersona === 'anna' ? 'Anna Williams Richter' : 'Aarav Kumar Sharma'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Birthdate</span>
                <span className="font-semibold text-slate-800">
                  {selectedPersona === 'anna' ? 'Feb 26, 1997' : 'Oct 14, 2008 (Minor - DPDP Sec 9)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Enrollment Status</span>
                <span className="font-semibold text-slate-800">
                  {selectedPersona === 'anna' ? 'Undergraduate' : '12th Achievers Top-30'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Major / Target</span>
                <span className="font-semibold text-slate-800">
                  {selectedPersona === 'anna' ? '095700-Psychology' : 'JEE Advanced 2026 (PCM)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Communication Preference</span>
                <span className="font-semibold text-slate-800">
                  {selectedPersona === 'anna' ? 'Email' : 'WhatsApp (Guardian: Rajesh Sharma)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Academic Standing</span>
                <span className="font-bold text-emerald-700">Good Standing</span>
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: HORIZONTAL TABS + ADVISING HIGHLIGHTS & TIMELINE */}
        {/* ============================================================== */}
        <div className="lg:col-span-9 flex flex-col">
          
          {/* Top Horizontal Tabs (OVERVIEW, NOTES, ALERTS, ADVISORS, COMMUNICATION, COURSE HISTORY, EVENTS, LIBRARY) */}
          <div className="px-6 border-b border-slate-200 flex overflow-x-auto text-xs font-bold gap-6 bg-white">
            {[
              { id: 'overview', label: 'OVERVIEW' },
              { id: 'notes', label: 'NOTES', badge: sharedNotes.length },
              { id: 'alerts', label: 'ALERTS', badge: 2, badgeColor: 'bg-rose-500' },
              { id: 'advisors', label: 'ADVISORS' },
              { id: 'communication', label: 'COMMUNICATION' },
              { id: 'course_history', label: 'COURSE HISTORY' },
              { id: 'events', label: 'EVENTS' },
              { id: 'library', label: 'REMEDIALS & WORKSHEETS', highlight: true }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#1E3A8A] text-[#1E3A8A]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] text-white font-mono ${tab.badgeColor || 'bg-slate-700'}`}>
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && (
                  <span className="px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 text-[9px] font-mono">
                    AI Active
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* MAIN TAB CONTENT */}
          <div className="p-6 sm:p-8 flex-1 space-y-8">
            
            {/* TAB: OVERVIEW (The 2x2 Grid + Events Timeline from Image 2) */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 2x2 GRID: ADVISING HIGHLIGHTS (8 COLS) */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {selectedPersona === 'anna' ? "Anna's Advising Highlights" : "Aarav's Advising Highlights"}
                    </h3>
                    <span className="text-[11px] text-teal-700 font-mono font-bold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                      Multi-Factor Predictive Model
                    </span>
                  </div>

                  {/* The 2x2 Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Card 1: Persistence Prediction (Circular Gauge) */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-between text-center space-y-3">
                      <span className="font-bold text-xs text-slate-700 self-start">
                        Persistence Prediction
                      </span>

                      {/* Circular Gauge Graphic */}
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#22c55e"
                            strokeWidth="8"
                            strokeDasharray="251.2"
                            strokeDashoffset="35"
                            strokeLinecap="round"
                            fill="none"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-0.5">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-black text-slate-900 leading-tight">High</span>
                          <span className="text-[10px] text-slate-500">Persistence</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('course_history')}
                        className="w-full py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 transition"
                      >
                        Details
                      </button>
                    </div>

                    {/* Card 2: GPA Across Quarters / Milestones */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">GPA Across Quarters</span>
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          Note: Low Grades in May
                        </span>
                      </div>

                      {/* Area Chart */}
                      <div className="h-28 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={gpaQuartersData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                            <defs>
                              <linearGradient id="quarterGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="quarter" tick={{ fontSize: 8, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis domain={[2.5, 4.0]} tick={{ fontSize: 8, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ fontSize: '10px' }} />
                            <Area type="monotone" dataKey="gpa" stroke="#2563eb" strokeWidth={2} fill="url(#quarterGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Best: <strong className="text-slate-800">3.98 (88%)</strong></span>
                        <span className="text-slate-400">Current: <strong className="text-slate-800">3.21 (74%)</strong></span>
                      </div>
                    </div>

                    {/* Card 3: Course Attendance / Participation */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">Course Attendance</span>
                        <span className="text-[10px] text-slate-400 font-mono">Jul 10 - Jul 17</span>
                      </div>

                      {/* Bar Chart with Stars */}
                      <div className="h-28 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={attendanceDaysData} margin={{ top: 10, right: 5, left: -30, bottom: 0 }}>
                            <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <Bar dataKey="participation" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-600 flex items-start space-x-1.5">
                        <span className="text-emerald-500 font-bold">😊</span>
                        <p className="leading-snug">
                          <strong>{selectedPersona === 'anna' ? 'Anna' : 'Aarav'} is doing good!</strong> This student is regularly attending and active in courses.
                        </p>
                      </div>
                    </div>

                    {/* Card 4: Persistence Per Month */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">Persistence Per Month</span>
                        <span className="text-[10px] text-slate-400 font-mono">Jan - Jul</span>
                      </div>

                      {/* Line Chart */}
                      <div className="h-24 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={persistenceMonthlyData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                            <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis domain={[60, 100]} tick={{ fontSize: 8, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <Line type="monotone" dataKey="persistence" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <div className="leading-tight text-slate-600">
                          <span className="font-bold text-rose-600 font-mono mr-1">-14%</span>
                          <span>Persistence still high, but down 14% from last month.</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('alerts')}
                          className="py-1 px-2.5 border border-slate-200 hover:bg-slate-50 rounded-md text-[10px] font-bold text-slate-700 shrink-0 ml-2"
                        >
                          Details
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* RIGHT COLUMN: EVENTS TIMELINE (4 COLS) */}
                <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800">Events Timeline</h4>
                    <div className="flex items-center space-x-1 text-slate-400">
                      <button className="hover:text-slate-700"><ChevronLeft className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-700"><ChevronRight className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  {/* Vertical Timeline List (Matching Image 2 exactly) */}
                  <div className="space-y-4 text-xs relative pl-4 border-l-2 border-slate-200">
                    
                    {/* Item 1 */}
                    <div className="relative space-y-0.5">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                      <span className="font-bold text-slate-900 block text-xs">Summer 2024</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {selectedPersona === 'anna'
                          ? 'Anna was selected for a prestigious research project with a professor, enhancing her professional profile.'
                          : 'Selected for JEE Advanced Physics Olympiad Mentorship with Er. Verma.'}
                      </p>
                      <span className="text-[10px] text-slate-400 block font-mono">April 3, 2024, 4:23pm</span>
                    </div>

                    {/* Item 2: Warning */}
                    <div className="relative space-y-0.5">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-white" />
                      <span className="font-bold text-slate-900 block text-xs">Spring 2024</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {selectedPersona === 'anna'
                          ? 'Anna has been consistently absent from an essential course, raising concerns about engagement.'
                          : 'Milestone Test 4 slump in Rotational Dynamics (42% mastery); 15-min remedial assigned.'}
                      </p>
                      <span className="text-[10px] text-slate-400 block font-mono">April 3, 2024, 7:37am</span>
                    </div>

                    {/* Item 3 */}
                    <div className="relative space-y-0.5">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                      <span className="font-bold text-slate-900 block text-xs">Winter 2024</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {selectedPersona === 'anna'
                          ? 'Anna completed a climate change research project, praised for innovative data analysis.'
                          : 'Completed 1-on-1 concept review on Incline Plane Torque; recovered test score to 78%.'}
                      </p>
                      <span className="text-[10px] text-slate-400 block font-mono">April 3, 2024, 7:26am</span>
                    </div>

                    {/* Item 4 */}
                    <div className="relative space-y-0.5">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                      <span className="font-bold text-slate-900 block text-xs">Fall 2024</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {selectedPersona === 'anna'
                          ? 'Anna achieved a 3.8 GPA, enhancing her academic profile.'
                          : 'Achieved 91% in Kinematics & Vectors; recognized as anchor strength.'}
                      </p>
                      <span className="text-[10px] text-slate-400 block font-mono">April 3, 2024, 3:47am</span>
                    </div>

                    {/* Item 5 */}
                    <div className="relative space-y-0.5">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-white" />
                      <span className="font-bold text-slate-900 block text-xs">Summer 2023</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {selectedPersona === 'anna'
                          ? 'Anna switched from Engineering to Psychology, seeking a better fit.'
                          : 'Enrolled in Achievers JEE Top-30; guardian consent verified under DPDP Act.'}
                      </p>
                      <span className="text-[10px] text-slate-400 block font-mono">April 2, 2024, 3:47am</span>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* TAB: NOTES (Shared Notes Inside Tools Teams Use) */}
            {activeTab === 'notes' && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Shared Faculty &amp; Advisor Notes</h3>
                    <p className="text-xs text-slate-500">
                      Coordinated notes visible to faculty, mentors, and academic leadership with timestamp audit.
                    </p>
                  </div>
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <textarea
                    rows={3}
                    value={newNoteInput}
                    onChange={(e) => setNewNoteInput(e.target.value)}
                    placeholder="Add an observation, intervention result, or check-in note..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">
                      Syncs across all authorized teachers and advisors instantly.
                    </span>
                    <button
                      type="submit"
                      disabled={!newNoteInput.trim()}
                      className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#182f6e] text-white text-xs font-bold rounded-xl transition disabled:opacity-40"
                    >
                      Post Shared Note
                    </button>
                  </div>
                </form>

                {/* Existing Notes List */}
                <div className="space-y-3">
                  {sharedNotes.map((n, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{n.author}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-teal-700 font-medium text-[11px]">{n.role}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ALERTS (Academic Alerts Inside Tools) */}
            {activeTab === 'alerts' && (
              <div className="space-y-4 max-w-3xl">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Academic Alerts &amp; Triggers</h3>
                  <p className="text-xs text-slate-500">
                    Automated flags generated 4–6 weeks ahead of test slumps or dropout disengagement.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Consecutive Milestone Test Slump (Rotational Dynamics)</span>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Student scored 42% on Physics Milestone Test 4, dropping from 88% on Milestone 3. Latent ability $\theta$ declined from +0.85 to +0.22.
                  </p>
                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('library')}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition"
                    >
                      Generate Remedial Worksheet &rarr;
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Mid-Week Practice Dropoff Notice</span>
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Wednesday participation fell to 60%. Automated reminder scheduled for Thursday evening problem set.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: COMMUNICATION (Coordinated Parent Outreach via WhatsApp) */}
            {activeTab === 'communication' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Coordinated Guardian Communication</h3>
                  <p className="text-xs text-slate-500">
                    Direct WhatsApp progress updates in English and Hindi (हिन्दी) formatted for Indian parents.
                  </p>
                </div>

                <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <span className="font-bold text-amber-400 uppercase tracking-wider">
                      WhatsApp Dispatch Preview
                    </span>
                    <div className="inline-flex items-center p-0.5 bg-slate-800 rounded-lg text-[10px] font-bold">
                      <button
                        onClick={() => setParentCommLang('en')}
                        className={`px-2 py-0.5 rounded transition ${parentCommLang === 'en' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setParentCommLang('hi')}
                        className={`px-2 py-0.5 rounded transition ${parentCommLang === 'hi' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
                      >
                        हिन्दी
                      </button>
                    </div>
                  </div>

                  {parentCommLang === 'hi' ? (
                    <div className="p-4 bg-emerald-950/80 rounded-xl text-xs space-y-2 border border-emerald-800 text-emerald-100 leading-relaxed font-sans">
                      <p className="font-bold text-white text-sm">अपेक्स अकादमी, पटना — साप्ताहिक प्रगति रिपोर्ट</p>
                      <p>प्रिय अभिभावक, {selectedPersona === 'anna' ? 'अन्ना' : 'आरव'} की इस सप्ताह <strong>96% उपस्थिति</strong> रही।</p>
                      <p className="text-emerald-300">✓ मजबूत विषय: गतिज विज्ञान (Kinematics &amp; Vectors)</p>
                      <p className="text-amber-300">⚡ अभ्यास की आवश्यकता: घूर्णन गति (Rotational Dynamics - 42%)</p>
                      <p className="text-[11px] text-slate-300 pt-1 border-t border-emerald-800/80">
                        शिक्षक टिप्पणी: छात्र की लगन उत्कृष्ट है। 15 मिनट का अभ्यास पत्रक पूरा कराया गया है।
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-950/80 rounded-xl text-xs space-y-2 border border-emerald-800 text-emerald-100 leading-relaxed font-sans">
                      <p className="font-bold text-white text-sm">Apex Academy, Patna — Weekly Progress Digest</p>
                      <p>Dear Guardian, {selectedPersona === 'anna' ? 'Anna' : 'Aarav'} maintained <strong>96% attendance</strong> this week.</p>
                      <p className="text-emerald-300">✓ Strong Mastery: Kinematics &amp; Vectors (91%)</p>
                      <p className="text-amber-300">⚡ Focus Practice: Rotational Dynamics (42%)</p>
                      <p className="text-[11px] text-slate-300 pt-1 border-t border-emerald-800/80">
                        Faculty Note: Excellent consistency. 15-minute 3-tier remedial practice worksheet completed.
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Target Mobile: +91 98350 12345 (Verified DPDP Consent)
                    </span>
                    <button
                      onClick={() => setWhatsappSent(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{whatsappSent ? 'Dispatched via WhatsApp ✓' : 'Send WhatsApp Digest'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LIBRARY / REMEDIALS (What Civitas Lacks: Generates 15-Min Remedial Worksheets) */}
            {activeTab === 'library' && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      15-Minute 3-Tier Remedial Worksheets (What Civitas Lacks)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Unlike generic software that only logs notes, DataMoat automatically generates the exact pedagogical questions needed for concept recovery.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-md border border-teal-200">
                    BKT Active
                  </span>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        Rotational Dynamics &amp; Torque Worksheet
                      </h4>
                      <p className="text-xs text-slate-500">
                        Target Concept: Moment of Inertia on Incline Planes (Mastery: 42%)
                      </p>
                    </div>
                    <button
                      onClick={() => setRemedialGenerated(!remedialGenerated)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{remedialGenerated ? 'Regenerate Worksheet' : 'Generate 15-Min Worksheet'}</span>
                    </button>
                  </div>

                  {remedialGenerated ? (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs font-mono text-slate-800">
                        <div className="text-[10px] text-teal-700 font-bold uppercase">
                          Tier 1: Foundational Anchor (5 mins)
                        </div>
                        <p>
                          Q1. A solid cylinder of mass $M$ and radius $R$ rolls down an incline of angle $\theta = 30^\circ$ without slipping. Calculate its linear acceleration:
                        </p>
                        <p className="text-[11px] text-slate-500 pl-4">
                          (a) $g/2$ &nbsp; (b) $g/3$ &nbsp; (c) $2g/3$ &nbsp; (d) $5g/7$
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs font-mono text-slate-800">
                        <div className="text-[10px] text-blue-700 font-bold uppercase">
                          Tier 2: Exam Discriminator (6 mins)
                        </div>
                        <p>
                          Q2. If a hollow cylinder and a solid cylinder of equal mass are released simultaneously, determine the ratio of kinetic energy:
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs font-mono text-slate-800">
                        <div className="text-[10px] text-amber-700 font-bold uppercase">
                          Tier 3: JEE Advanced Synthesis (4 mins)
                        </div>
                        <p>
                          Q3. Calculate the minimum friction coefficient $\mu_s$ required to prevent sliding on a $45^\circ$ rough slope.
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs">
                        <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Generated in 1.4s with Voice Audio &amp; Answer Key</span>
                        </span>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-700 flex items-center space-x-1">
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print PDF</span>
                          </button>
                          <button className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold flex items-center space-x-1">
                            <Send className="w-3.5 h-3.5" />
                            <span>Assign to Student</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-xl">
                      <Sparkles className="w-6 h-6 mx-auto text-teal-600 opacity-60" />
                      <p className="text-xs">
                        Click &quot;Generate 15-Min Worksheet&quot; to compile a tailored 3-tier remedial practice sheet with voice breakdown.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* OTHER TABS FALLBACK */}
            {(activeTab === 'advisors' || activeTab === 'course_history' || activeTab === 'events') && (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                <span className="font-bold text-slate-800 text-sm capitalize">
                  {activeTab.replace('_', ' ')} Directory
                </span>
                <p className="text-slate-600">
                  Full longitudinal course registration records, mentor appointment calendar, and historical event audit connected to Supabase tenant.
                </p>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-100"
                >
                  &larr; Return to Advising Highlights Overview
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
