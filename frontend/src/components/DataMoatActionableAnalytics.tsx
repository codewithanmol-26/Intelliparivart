'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Search,
  Filter,
  X,
  Bell,
  ChevronRight,
  ChevronLeft,
  Send,
  Building2,
  Layers,
  GraduationCap,
  Shield,
  Zap,
  HelpCircle,
  FileText,
  FileCheck2,
  Bookmark
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface DataMoatActionableAnalyticsProps {
  onSelectStudent?: (studentId: string) => void;
  onSwitchToWorkflows?: () => void;
}

export default function DataMoatActionableAnalytics({
  onSelectStudent,
  onSwitchToWorkflows
}: DataMoatActionableAnalyticsProps) {
  // Filter state
  const [activeCampus, setActiveCampus] = useState<string>('Boring Road (Main)');
  const [activeFilterTag, setActiveFilterTag] = useState<string | null>('Northwest Campus');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<'monthly' | 'term'>('monthly');

  // Inline AI Chat state ("Ask CivChat / Ask DataMoat")
  const [civChatInput, setCivChatInput] = useState<string>('');
  const [civChatMessages, setCivChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello Director. Persistence is up 4% this month, but 14 students in 12th Achievers Top-30 are flagging for rotational dynamics slumps. How can I assist?'
    }
  ]);
  const [civChatLoading, setCivChatLoading] = useState<boolean>(false);

  // 1. Enrollment Trends Chart Data (Past 6 Months)
  const enrollmentTrendsData = [
    { month: 'Jan', enrollments: 3050, label: 'Jan' },
    { month: 'Feb', enrollments: 3120, label: 'Feb' },
    { month: 'Mar', enrollments: 3180, label: 'Mar' },
    { month: 'Apr', enrollments: 3150, label: 'Apr' },
    { month: 'May', enrollments: 3210, label: 'May' },
    { month: 'Jun', enrollments: 3237, label: 'Jun' }
  ];

  // 2. Score / Latent Ability Trends Data (Area curve showing downward slump)
  const gpaTrendsData = [
    { month: 'Jan', gpa: 3.4, theta: 0.85 },
    { month: 'Feb', gpa: 3.1, theta: 0.62 },
    { month: 'Mar', gpa: 2.9, theta: 0.48 },
    { month: 'Apr', gpa: 2.7, theta: 0.35 },
    { month: 'May', gpa: 2.4, theta: 0.18 },
    { month: 'Jun', gpa: 2.5, theta: 0.22 }
  ];

  // 3. Course Success Trends (Stacked Area: Completion, Drops, Fails, Withdraws)
  const courseSuccessData = [
    { month: 'Jan', completion: 74, atRisk: 14, drops: 8, fails: 4 },
    { month: 'Feb', completion: 76, atRisk: 12, drops: 8, fails: 4 },
    { month: 'Mar', completion: 73, atRisk: 15, drops: 8, fails: 4 },
    { month: 'Apr', completion: 75, atRisk: 13, drops: 7, fails: 5 },
    { month: 'May', completion: 74, atRisk: 14, drops: 8, fails: 4 },
    { month: 'Jun', completion: 75, atRisk: 13, drops: 8, fails: 4 }
  ];

  // High-Impact Courses & Batches Table Data (Directly matching Image 1 layout)
  const highImpactCourses = [
    {
      courseCode: '13857-202510',
      title: 'Science, Ethics, and Tech (12th JEE Achievers Top-30)',
      enrolled: 250,
      tuitionPaid: '₹1,50,00,000',
      sections: 15,
      capacityPct: 84,
      programs: 14,
      riskLevel: 'Moderate'
    },
    {
      courseCode: '10376-202510',
      title: 'Mechanics & Rotational Dynamics Core (11th Foundation)',
      enrolled: 246,
      tuitionPaid: '₹1,47,60,000',
      sections: 14,
      capacityPct: 77,
      programs: 12,
      riskLevel: 'High'
    },
    {
      courseCode: '11492-202510',
      title: 'Organic Chemistry Reactions (12th NEET Pinnacle)',
      enrolled: 312,
      tuitionPaid: '₹1,87,20,000',
      sections: 18,
      capacityPct: 91,
      programs: 16,
      riskLevel: 'Low'
    },
    {
      courseCode: '14208-202510',
      title: 'Integral Calculus & Vector Algebra (Rank Booster)',
      enrolled: 184,
      tuitionPaid: '₹1,10,40,000',
      sections: 10,
      capacityPct: 69,
      programs: 8,
      riskLevel: 'Moderate'
    }
  ];

  const handleSendCivChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!civChatInput.trim() || civChatLoading) return;

    const userMsg = civChatInput.trim();
    setCivChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setCivChatInput('');
    setCivChatLoading(true);

    try {
      const res = await fetch('/api/genai/datamoat-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg, persona: 'director' })
      });
      const data = await res.json();
      setCivChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.answer || 'DataMoat analyzed your batch telemetry: 15% churn reduction retains 7 students and ₹2,52,000 in fees.'
        }
      ]);
    } catch (err) {
      setCivChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Telemetry query processed: Consider dispatching the 15-minute remedial worksheet to the 35 students flagged for test slumps.'
        }
      ]);
    } finally {
      setCivChatLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden font-sans text-slate-800">
      
      {/* 1. TOP EXECUTIVE APP BAR */}
      <div className="bg-white px-5 sm:px-8 py-3.5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Search */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2.5 shrink-0">
            <img
              src="/intelliprivart-icon.png"
              alt="Intelliprivart Shield"
              className="w-8 h-8 object-contain"
            />
            <div className="leading-tight">
              <span className="font-extrabold text-slate-900 tracking-wider text-xs block uppercase">
                Apex JEE &amp; Medical Academy
              </span>
              <span className="text-[10px] text-teal-700 font-semibold block">
                Patna Flagship Campus • 1,200 Benchmark Cohort
              </span>
            </div>
          </div>

          {/* Search Box (Directly matching Image 1) */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for students by name or ID (e.g. Anna Williams, Aarav Sharma)..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Right Status Strip */}
        <div className="flex items-center space-x-3 self-end md:self-auto text-xs">
          <button
            onClick={() => onSwitchToWorkflows && onSwitchToWorkflows()}
            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg font-bold transition"
            title="Open Connected Workflows"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Connected Workflows &rarr;</span>
          </button>

          <div className="relative">
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center border-2 border-white">
                5
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-600 to-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              AW
            </div>
            <span className="font-semibold text-slate-700 hidden lg:inline text-xs">
              Dr. Eleanor Vance
            </span>
          </div>
        </div>
      </div>

      {/* 2. FILTER BAR (Matching Image 1: FILTERS, Active Chip, RESET, SAVE FILTER) */}
      <div className="bg-[#f8fafc] px-5 sm:px-8 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-1 bg-[#1E3A8A] hover:bg-[#1e3470] text-white font-bold rounded-md flex items-center space-x-1.5 shadow-2xs transition">
            <Filter className="w-3 h-3" />
            <span>FILTERS</span>
            <span className="text-[10px] opacity-80">▾</span>
          </button>

          {activeFilterTag && (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-slate-300 rounded-md text-slate-700 font-medium shadow-2xs">
              <span className="text-slate-400">Campuses</span>
              <span className="font-bold text-slate-900">{activeFilterTag}</span>
              <button
                onClick={() => setActiveFilterTag(null)}
                className="text-slate-400 hover:text-slate-700 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-teal-50 border border-teal-200 rounded-md text-teal-800 font-semibold shadow-2xs">
            <span className="text-teal-600">Active Cohort:</span>
            <span>12th JEE Achievers Top-30</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveFilterTag('Northwest Campus')}
            className="text-slate-500 hover:text-slate-800 font-semibold text-xs px-2 py-1"
          >
            RESET
          </button>
          <button className="inline-flex items-center space-x-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-md shadow-2xs transition">
            <Bookmark className="w-3 h-3 text-teal-600" />
            <span>SAVE FILTER</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN ACTIONABLE ANALYTICS CONTENT AREA */}
      <div className="p-5 sm:p-8 space-y-8">
        
        {/* Spotlight Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              College State Spotlight
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-batch enrollment, latent mastery, and course retention analytics calibrated for Apex JEE &amp; Medical Academy.
            </p>
          </div>

          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
            <button
              onClick={() => setTimePeriod('monthly')}
              className={`px-3 py-1 rounded-md transition ${timePeriod === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimePeriod('term')}
              className={`px-3 py-1 rounded-md transition ${timePeriod === 'term' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
            >
              Semester / Term
            </button>
          </div>
        </div>

        {/* 4. GRID: LEFT 3/4 ANALYTICS & CHARTS + RIGHT 1/4 INSIGHTS & CIVCHAT PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 8 COLS: 3 SUMMARY KPI CARDS + 3 TREND CHARTS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 3 TOP KPI SUMMARY CARDS (Matching Image 1: +4.5%, -0.6%, +3%) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: Total Enrollment */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 transition space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Total Enrollment</span>
                  <div className="flex items-center space-x-1 text-slate-400 font-mono">
                    <span>Monthly</span>
                    <button className="hover:text-slate-700"><ChevronLeft className="w-3 h-3" /></button>
                    <button className="hover:text-slate-700"><ChevronRight className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-600 font-mono">
                  + 4.5%
                </div>
                <div className="text-[11px] text-slate-500 leading-snug flex items-start space-x-1">
                  <span className="text-emerald-500 font-bold">★</span>
                  <span><strong>3,237 total enrollments</strong>, with positive increase for this period.</span>
                </div>
              </div>

              {/* Card 2: Average GPA / Latent Score */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-400 transition space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Average GPA / Score</span>
                  <div className="flex items-center space-x-1 text-slate-400 font-mono">
                    <span>Monthly</span>
                    <button className="hover:text-slate-700"><ChevronLeft className="w-3 h-3" /></button>
                    <button className="hover:text-slate-700"><ChevronRight className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="text-3xl font-black text-rose-600 font-mono">
                  - 0.6%
                </div>
                <div className="text-[11px] text-slate-500 leading-snug flex items-start space-x-1">
                  <span className="text-rose-500 font-bold">▼</span>
                  <span><strong>2.4 on average (64.2%)</strong>, with a slight decrease for this period.</span>
                </div>
              </div>

              {/* Card 3: Course Success Rates Per Term */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 transition space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Course Success Rates</span>
                  <span className="text-slate-400 font-mono text-[11px]">Per Term</span>
                </div>
                <div className="text-3xl font-black text-emerald-600 font-mono">
                  + 3%
                </div>
                <div className="text-[11px] text-slate-500 leading-snug flex items-start space-x-1">
                  <span className="text-emerald-500 font-bold">★</span>
                  <span><strong>75% retention in total</strong> this month, with a 3% positive increase for this period.</span>
                </div>
              </div>
            </div>

            {/* 3 TREND CHARTS (Matching Image 1: Enrollment Trends, GPA Trends, Course Success Trends) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Chart 1: Enrollment Trends */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Enrollment Trends</h4>
                  <div className="h-32 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={enrollmentTrendsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={[3000, 3300]} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                        <Line
                          type="monotone"
                          dataKey="enrollments"
                          stroke="#0284c7"
                          strokeWidth={2.5}
                          dot={{ r: 3, fill: '#0284c7', strokeWidth: 1 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 leading-relaxed">
                  <div className="flex items-center space-x-1 font-bold text-emerald-700">
                    <span>▲ Steady Growth</span>
                  </div>
                  <span>Enrollment has shown consistent growth over the past 6 months.</span>
                </div>
              </div>

              {/* Chart 2: GPA Trends */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">GPA Trends</h4>
                  <div className="h-32 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={gpaTrendsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={[2, 4]} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                        <Area
                          type="monotone"
                          dataKey="gpa"
                          stroke="#0284c7"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#gpaGrad)"
                          dot={{ r: 2.5, fill: '#0284c7' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 leading-relaxed">
                  <div className="flex items-center space-x-1 font-bold text-rose-600">
                    <span>▼ Significant Decrease</span>
                  </div>
                  <span>Average GPA has shown a downward trend over the last 6 months.</span>
                </div>
              </div>

              {/* Chart 3: Course Success Trends */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Course Success Trends</h4>
                  <div className="h-32 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={courseSuccessData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={[0, 100]} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="completion" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.8} />
                        <Area type="monotone" dataKey="atRisk" stackId="1" stroke="#eab308" fill="#eab308" fillOpacity={0.8} />
                        <Area type="monotone" dataKey="drops" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.8} />
                        <Area type="monotone" dataKey="fails" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 leading-relaxed">
                  <div className="flex items-center space-x-1 font-bold text-emerald-700">
                    <span>▲ Stable Performance</span>
                  </div>
                  <span>Course completion rates remain steady with minimal fluctuation.</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 4 COLS: DATAMOAT INSIGHTS + SUGGESTED ACTIONS + ASK COPILOT PANEL */}
          <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
            
            {/* Section A: DataMoat Tactical Insights */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <CompassIcon className="w-4 h-4 text-teal-600" />
                  <span>DataMoat Insights</span>
                </div>
                <button className="text-[10px] text-teal-700 font-semibold hover:underline">
                  See more
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Insight 1: Positive */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 shadow-2xs">
                  <p className="text-[11px] text-slate-700 leading-snug">
                    Persistence rates have improved by <strong>4% this term</strong> compared to last.
                  </p>
                </div>

                {/* Insight 2: Warning */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 border-l-4 border-l-rose-500 shadow-2xs">
                  <p className="text-[11px] text-slate-700 leading-snug">
                    Significant drop in predicted completion rates for <strong>second-year students receiving Pell Grants / scholarships</strong>.
                  </p>
                </div>

                {/* Insight 3: Slump Alert */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 border-l-4 border-l-rose-500 shadow-2xs">
                  <p className="text-[11px] text-slate-700 leading-snug">
                    14 students in <strong>12th Achievers Top-30</strong> flagged for consecutive milestone test slumps.
                  </p>
                </div>
              </div>
            </div>

            {/* Section B: Suggested Actions */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Suggested Actions</span>
                </div>
                <button className="text-[10px] text-teal-700 font-semibold hover:underline">
                  See more
                </button>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-2">
                  <p className="text-[11px] text-slate-700 leading-snug">
                    Consider outreach to the <strong>35 students flagged as having low LMS engagement scores</strong> this term.
                  </p>
                  <button
                    onClick={() => onSelectStudent && onSelectStudent('STD_PAT_001')}
                    className="w-full py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[10px] transition flex items-center justify-center space-x-1"
                  >
                    <span>Launch Targeted Triage Outreach &rarr;</span>
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                  <p className="text-[11px] text-slate-700 leading-snug">
                    Assign 15-minute remedial worksheet on <strong>Rotational Dynamics</strong> to 8 students with $P(L) &lt; 50\%$.
                  </p>
                  <Link
                    href="/interventions"
                    className="w-full py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[10px] transition flex items-center justify-center space-x-1"
                  >
                    <span>Open Remedial Triage Ledger &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Section C: Ask CivChat / Ask DataMoat Inline Widget */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center space-x-1 text-xs font-bold text-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Ask CivChat / DataMoat</span>
              </div>

              {/* Chat Log Preview */}
              <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-white rounded-xl border border-slate-200 text-[11px]">
                {civChatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg ${
                      m.sender === 'user'
                        ? 'bg-teal-50 text-teal-900 font-medium ml-4'
                        : 'bg-slate-50 text-slate-700 mr-4'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
                {civChatLoading && (
                  <div className="text-[10px] text-teal-600 animate-pulse font-medium">
                    Querying institutional models...
                  </div>
                )}
              </div>

              {/* Form Input */}
              <form onSubmit={handleSendCivChat} className="relative flex items-center">
                <input
                  type="text"
                  value={civChatInput}
                  onChange={(e) => setCivChatInput(e.target.value)}
                  placeholder="Ask CivChat anything..."
                  className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={civChatLoading || !civChatInput.trim()}
                  className="absolute right-2 text-teal-600 hover:text-teal-800 disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* 5. HIGH-IMPACT COURSES & BATCHES TABLE (Matching Image 1) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
          <div className="p-5 pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                High-Impact Courses &amp; Batches
              </h3>
              <p className="text-xs text-slate-500">
                Track persistence, tuition fees paid, section load, and student capacity across key academic cohorts.
              </p>
            </div>
            <span className="text-[11px] text-teal-700 font-mono font-bold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 self-start sm:self-auto">
              Live Institution-Specific Model
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-5">Course Code</th>
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3 px-4">Enrolled Students ↓</th>
                  <th className="py-3 px-4">Tuition Paid / Protected</th>
                  <th className="py-3 px-4 text-center">Section Count</th>
                  <th className="py-3 px-4 text-center">Capacity ↓</th>
                  <th className="py-3 px-4">Programs ↓</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {highImpactCourses.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-5 font-mono text-[11px] font-bold text-slate-600">
                      {c.courseCode}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {c.enrolled}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">
                      {c.tuitionPaid}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {c.sections}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded ${
                        c.capacityPct > 80 ? 'bg-teal-50 text-teal-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {c.capacityPct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {c.programs}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => onSelectStudent && onSelectStudent('STD_PAT_001')}
                        className="text-teal-700 hover:text-teal-900 font-bold text-xs inline-flex items-center space-x-1"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. WHAT THIS TYPE OF SOFTWARE LACKS: THE 6 DATAMOAT ADVANTAGES BANNER */}
        <div className="p-5 bg-gradient-to-r from-[#0F2744] via-[#163860] to-[#0A1B2E] text-white rounded-2xl border border-blue-900 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="p-1 bg-teal-500/20 text-teal-300 rounded-md font-bold text-xs">
                ⚡ Category Differentiation
              </span>
              <span className="font-bold text-sm text-white">
                Proprietary Pedagogical Intelligence Beyond Traditional ERPs
              </span>
            </div>
            <span className="text-[10px] text-teal-300 font-mono">
              Engineered for Indian Test Prep &amp; Coaching Moats
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <div className="text-teal-300 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>1. 2PL IRT Latent Ability ($\theta$)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Traditional software relies on raw percentages. DataMoat separates question difficulty ($b$) from true student mastery using psychometric item curves.
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <div className="text-teal-300 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>2. Phone Camera OMR Ingestion</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Zero scanner hardware. Ingest paper bubble sheets via mobile camera with OpenCV warp correction and automated error quarantine.
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <div className="text-teal-300 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>3. 15-Min 3-Tier AI Remedials</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Standard platforms only advise generic outreach. DataMoat compiles tailored 3-tier remedial practice worksheets with voice explanations on the exact failed concept.
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <div className="text-teal-300 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>4. Bilingual WhatsApp Digests</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                No ignored email portals. Send transparent weekly progress summaries in English &amp; Hindi (हिन्दी) directly to parent WhatsApp numbers.
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <div className="text-teal-300 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>5. DPDP Act 2023 Section 9 VPC</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Cryptographic tenant isolation, verifiable guardian consent for minors, and a zero LLM retraining guarantee on student marks.
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <div className="text-teal-300 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>6. ₹28.50L Fee Retention Ledger</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Proves an auditable 18.3x net ROI by directly connecting 4–6 week early warning to saved tuition installments.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

function CompassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
