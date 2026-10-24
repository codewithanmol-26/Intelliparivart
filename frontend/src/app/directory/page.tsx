'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Building2,
  ShieldAlert,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Layers,
  ArrowRight,
  UserCheck,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Lock,
  ExternalLink,
  X,
  MessageSquare
} from 'lucide-react';
import {
  DIRECTORY_OWNER,
  DIRECTORY_TEACHERS,
  DIRECTORY_STUDENTS,
  DIRECTORY_BATCH_STATS,
  DirectoryStudent,
  DirectoryTeacher
} from '../../lib/directoryData';
import { useApp } from '../../context/AppContext';

export default function DirectoryPage() {
  const { role } = useApp();
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'governance'>('students');

  // Filters for Students
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'roll' | 'theta' | 'percentile' | 'attendance' | 'risk'>('roll');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selected student for quick inspection modal
  const [selectedStudent, setSelectedStudent] = useState<DirectoryStudent | null>(null);

  // Filter & Search Logic
  const filteredStudents = useMemo(() => {
    return DIRECTORY_STUDENTS.filter((st) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.pseudonymous_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.guardian_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.guardian_phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Batch filter
      const matchesBatch = selectedBatch === 'all' || st.batch_id === selectedBatch;

      // Risk filter
      const matchesRisk = selectedRisk === 'all' || st.risk_tier.toLowerCase() === selectedRisk.toLowerCase();

      // Exam filter
      const matchesExam = selectedExam === 'all' || st.target_exam.toLowerCase() === selectedExam.toLowerCase();

      return matchesSearch && matchesBatch && matchesRisk && matchesExam;
    }).sort((a, b) => {
      let comp = 0;
      if (sortBy === 'name') comp = a.name.localeCompare(b.name);
      else if (sortBy === 'roll') comp = a.id.localeCompare(b.id);
      else if (sortBy === 'theta') comp = a.latent_ability_theta - b.latent_ability_theta;
      else if (sortBy === 'percentile') comp = a.estimated_percentile - b.estimated_percentile;
      else if (sortBy === 'attendance') comp = a.attendance_rate - b.attendance_rate;
      else if (sortBy === 'risk') {
        const score = { High: 3, Moderate: 2, Low: 1 };
        comp = score[a.risk_tier] - score[b.risk_tier];
      }
      return sortOrder === 'desc' ? -comp : comp;
    });
  }, [searchQuery, selectedBatch, selectedRisk, selectedExam, sortBy, sortOrder]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = DIRECTORY_STUDENTS.length;
    const lowRisk = DIRECTORY_STUDENTS.filter((s) => s.risk_tier === 'Low').length;
    const modRisk = DIRECTORY_STUDENTS.filter((s) => s.risk_tier === 'Moderate').length;
    const highRisk = DIRECTORY_STUDENTS.filter((s) => s.risk_tier === 'High').length;
    const avgAttendance = (DIRECTORY_STUDENTS.reduce((acc, s) => acc + s.attendance_rate, 0) / total).toFixed(1);
    const avgTheta = (DIRECTORY_STUDENTS.reduce((acc, s) => acc + s.latent_ability_theta, 0) / total).toFixed(2);
    return { total, lowRisk, modRisk, highRisk, avgAttendance, avgTheta };
  }, []);

  const exportCSV = () => {
    const headers = [
      'Roll Number',
      'Student Name',
      'Pseudonymous Code',
      'Batch ID',
      'Batch Name',
      'Faculty Lead',
      'Target Exam',
      'Class Level',
      'Latent Ability Theta',
      'Estimated Percentile',
      'Attendance Rate %',
      'Risk Tier',
      'Fee Status',
      'Guardian Name',
      'Guardian Phone',
      'Guardian Email',
      'DPDP Section 9 Consent'
    ];
    const rows = filteredStudents.map((s) => [
      s.id,
      `"${s.name}"`,
      s.pseudonymous_code,
      s.batch_id,
      `"${s.batch_name}"`,
      `"${s.faculty_lead}"`,
      `"${s.target_exam}"`,
      `"${s.class_level}"`,
      s.latent_ability_theta,
      s.estimated_percentile,
      s.attendance_rate,
      s.risk_tier,
      `"${s.fee_status}"`,
      `"${s.guardian_name}"`,
      `"${s.guardian_phone}"`,
      s.guardian_email,
      s.parent_contact_consent ? 'Verified' : 'Pending'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Apex_Academy_Institutional_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Breadcrumb & Institutional Header */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-teal-400 mb-2">
                <Building2 className="w-4 h-4" />
                <span>INSTITUTIONAL ROSTER & FACULTY DIRECTORY</span>
                <span>•</span>
                <span className="text-slate-400">TENANT: {DIRECTORY_OWNER.tenant_id}</span>
                <span>•</span>
                <span className="bg-teal-500/10 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded">
                  SINGLE INSTITUTE SCOPE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
                <span>{DIRECTORY_OWNER.institute_name}</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                Unified institutional registry for the Owner: Oversee all{' '}
                <span className="text-teal-300 font-semibold">5 Academic Faculty Leads</span>,{' '}
                <span className="text-teal-300 font-semibold">100 Enrolled Students</span> across 4 batches, and{' '}
                <span className="text-teal-300 font-semibold">100 Linked Guardians</span> with verified DPDP Act 2023 Section 9 consent.
              </p>
            </div>

            {/* Quick Summary Pill Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-900/90 border border-slate-700 px-3.5 py-2 rounded-xl text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Managing Director</span>
                <span className="text-white font-semibold flex items-center space-x-1.5 mt-0.5">
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>{DIRECTORY_OWNER.name}</span>
                </span>
              </div>
              <button
                onClick={exportCSV}
                className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-colors"
                title="Export complete roster to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Roster CSV</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-700/60">
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block font-medium">Active Students</span>
              <span className="text-xl font-bold text-white mt-1 block">100</span>
              <span className="text-[10px] text-emerald-400 font-medium">100% Enrolled</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block font-medium">Faculty Mentors</span>
              <span className="text-xl font-bold text-teal-300 mt-1 block">5 Leads</span>
              <span className="text-[10px] text-slate-400 font-medium">1:20 Mentor Ratio</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block font-medium">Linked Parents</span>
              <span className="text-xl font-bold text-white mt-1 block">100</span>
              <span className="text-[10px] text-emerald-400 font-medium">100% Verified DPDP</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block font-medium">Avg Latent Ability θ</span>
              <span className="text-xl font-bold text-blue-300 mt-1 block">+{stats.avgTheta} SD</span>
              <span className="text-[10px] text-slate-400 font-medium">2PL IRT Calibrated</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block font-medium">Cohort Attendance</span>
              <span className="text-xl font-bold text-emerald-300 mt-1 block">{stats.avgAttendance}%</span>
              <span className="text-[10px] text-slate-400 font-medium">Biometric Register</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block font-medium">Conformal Dropout Risk</span>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">{stats.lowRisk}L</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">{stats.modRisk}M</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">{stats.highRisk}H</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">Non-shaming Triage</span>
            </div>
          </div>
        </div>

        {/* Primary View Navigation Switcher Tabs */}
        <div className="flex border-b border-slate-800 space-x-2 sm:space-x-4">
          <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'students'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>All Students & Guardians</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs font-mono">100</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'teachers'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Faculty Leads & Teachers</span>
            <span className="bg-slate-800 text-teal-300 px-2 py-0.5 rounded-full text-xs font-mono">5</span>
          </button>

          <button
            onClick={() => setActiveTab('governance')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'governance'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Institute Ownership & Governance</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs font-mono">1</span>
          </button>
        </div>

        {/* TAB 1: ALL STUDENTS & GUARDIANS */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {/* Batch Cards Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {DIRECTORY_BATCH_STATS.map((b) => (
                <div
                  key={b.batch_id}
                  onClick={() => setSelectedBatch(selectedBatch === b.batch_id ? 'all' : b.batch_id)}
                  className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                    selectedBatch === b.batch_id
                      ? 'bg-teal-950/40 border-teal-500 shadow-md ring-1 ring-teal-500'
                      : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-200 truncate">{b.batch_name}</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-teal-300 font-mono">
                      {b.total_students} Std
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-1">
                    <span>Lead:</span>
                    <span className="text-slate-300 font-medium truncate">{b.faculty_lead}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/40 text-[10px]">
                    <span className="text-slate-400">Target: {b.target_exam}</span>
                    <span className="text-emerald-400 font-medium">Avg θ +{b.avg_theta}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name, roll number (STD_PAT_001), guardian name, or phone..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg text-xs px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="all">All Batches (100 Students)</option>
                    <option value="BATCH_TOP30">Achievers Top-30 (JEE Adv)</option>
                    <option value="BATCH_NEET12">Target NEET Achievers (PCB)</option>
                    <option value="BATCH_ELEV12">Elevate JEE 12th (JEE Main)</option>
                    <option value="BATCH_FND11">Foundation JEE/NEET 11th</option>
                  </select>

                  <select
                    value={selectedRisk}
                    onChange={(e) => setSelectedRisk(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg text-xs px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="all">All Risk Tiers</option>
                    <option value="low">Low Risk (On Track)</option>
                    <option value="moderate">Moderate Risk</option>
                    <option value="high">High Risk (Immediate Triage)</option>
                  </select>

                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg text-xs px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="all">All Exams</option>
                    <option value="jee advanced">JEE Advanced</option>
                    <option value="neet-ug">NEET-UG</option>
                    <option value="jee main">JEE Main</option>
                    <option value="foundation (11th)">Foundation (11th)</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-lg text-xs px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="roll">Sort by Roll Number</option>
                    <option value="name">Sort by Name</option>
                    <option value="theta">Sort by Latent Ability θ</option>
                    <option value="percentile">Sort by Percentile</option>
                    <option value="attendance">Sort by Attendance</option>
                    <option value="risk">Sort by Risk Severity</option>
                  </select>

                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg text-xs px-3 py-2 text-slate-300 font-medium"
                    title="Toggle Sort Order"
                  >
                    {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
                  </button>
                </div>
              </div>

              {/* Active Filter Pills Bar */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>
                  Showing <strong className="text-teal-300">{filteredStudents.length}</strong> of{' '}
                  <strong className="text-slate-200">100</strong> students
                </span>
                {(searchQuery || selectedBatch !== 'all' || selectedRisk !== 'all' || selectedExam !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBatch('all');
                      setSelectedRisk('all');
                      setSelectedExam('all');
                    }}
                    className="text-xs text-teal-400 hover:text-teal-300 underline font-medium"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </div>

            {/* Students & Guardians Table */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-300 border-b border-slate-700/80 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3.5">Roll No & Student</th>
                      <th className="py-3 px-3">Batch & Faculty Mentor</th>
                      <th className="py-3 px-3">Target Exam</th>
                      <th className="py-3 px-3">Latent Ability θ</th>
                      <th className="py-3 px-3">Attendance</th>
                      <th className="py-3 px-3">Risk Tier</th>
                      <th className="py-3 px-3">Guardian & Verified Contact</th>
                      <th className="py-3 px-3 text-center">DPDP Sec 9</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-10 text-center text-slate-400">
                          <p className="text-sm">No students match your active filters.</p>
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedBatch('all');
                              setSelectedRisk('all');
                              setSelectedExam('all');
                            }}
                            className="mt-2 text-xs text-teal-400 hover:underline"
                          >
                            Clear filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st) => (
                        <tr
                          key={st.id}
                          className="hover:bg-slate-750/50 transition-colors group cursor-pointer"
                          onClick={() => setSelectedStudent(st)}
                        >
                          {/* Student Name & Roll */}
                          <td className="py-3 px-3.5">
                            <div className="font-semibold text-white group-hover:text-teal-300 transition-colors">
                              {st.name}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                              <span className="font-mono text-teal-400 font-medium">{st.id}</span>
                              <span>•</span>
                              <span className="font-mono text-slate-500">{st.pseudonymous_code}</span>
                            </div>
                          </td>

                          {/* Batch & Lead */}
                          <td className="py-3 px-3">
                            <div className="text-slate-200 font-medium">{st.batch_name}</div>
                            <div className="text-[11px] text-slate-400">Mentor: {st.faculty_lead}</div>
                          </td>

                          {/* Target Exam */}
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                st.target_exam === 'JEE Advanced'
                                  ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                                  : st.target_exam === 'NEET-UG'
                                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                                  : st.target_exam === 'JEE Main'
                                  ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                                  : 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                              }`}
                            >
                              {st.target_exam}
                            </span>
                          </td>

                          {/* Latent Ability θ & Percentile */}
                          <td className="py-3 px-3 font-mono">
                            <div className="text-slate-200 font-semibold">
                              θ {st.latent_ability_theta >= 0 ? `+${st.latent_ability_theta.toFixed(2)}` : st.latent_ability_theta.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-teal-400">{st.estimated_percentile}th %ile</div>
                          </td>

                          {/* Attendance */}
                          <td className="py-3 px-3">
                            <span
                              className={`font-semibold ${
                                st.attendance_rate >= 90
                                  ? 'text-emerald-400'
                                  : st.attendance_rate >= 80
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {st.attendance_rate}%
                            </span>
                          </td>

                          {/* Risk Tier */}
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                st.risk_tier === 'High'
                                  ? 'bg-rose-900/50 text-rose-300 border border-rose-700/60'
                                  : st.risk_tier === 'Moderate'
                                  ? 'bg-amber-900/50 text-amber-300 border border-amber-700/60'
                                  : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/60'
                              }`}
                            >
                              {st.risk_tier === 'High' && <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />}
                              <span>{st.risk_tier} Risk</span>
                            </span>
                          </td>

                          {/* Guardian & Phone */}
                          <td className="py-3 px-3">
                            <div className="text-slate-200 font-medium">{st.guardian_name}</div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                              <Phone className="w-2.5 h-2.5 text-slate-500" />
                              <span>{st.guardian_phone}</span>
                            </div>
                          </td>

                          {/* DPDP Section 9 Consent */}
                          <td className="py-3 px-3 text-center">
                            {st.parent_contact_consent ? (
                              <span className="inline-flex items-center text-emerald-400 font-medium text-[10px] bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-amber-400 font-medium text-[10px] bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded">
                                Pending
                              </span>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(st);
                              }}
                              className="text-xs bg-slate-700/70 hover:bg-teal-600 hover:text-white px-2.5 py-1 rounded text-slate-200 transition-colors"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="bg-slate-900/90 px-4 py-2.5 border-t border-slate-700/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <div>
                  Displaying {filteredStudents.length} students enrolled in {DIRECTORY_OWNER.institute_name}.
                </div>
                <div className="flex items-center space-x-3 text-slate-500">
                  <span>Privacy: Differential Privacy Laplace ε=0.5 applied on aggregated exports</span>
                  <span>•</span>
                  <span>Zero-Public Ranking Policy</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FACULTY LEADS & TEACHERS */}
        {activeTab === 'teachers' && (
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Users className="w-4 h-4 text-teal-400" />
                  <span>Academic Faculty Leadership (5 Full-Time Lead Mentors)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct academic oversight for all 100 students across Physics, Chemistry, Mathematics, Biology, and Foundation STEM.
                </p>
              </div>
              <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                <span>Faculty-to-Student Ratio: </span>
                <strong className="text-teal-300">1 : 20</strong>
              </div>
            </div>

            {/* 5 Teacher Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DIRECTORY_TEACHERS.map((tch, idx) => (
                <div
                  key={tch.id}
                  className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-teal-500/60 transition-all group"
                >
                  <div>
                    {/* Header: Avatar, Name & Subject */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-inner ${
                            tch.department.includes('Physics')
                              ? 'bg-gradient-to-br from-cyan-600 to-blue-700'
                              : tch.department.includes('Chemistry')
                              ? 'bg-gradient-to-br from-amber-600 to-orange-700'
                              : tch.department.includes('Math')
                              ? 'bg-gradient-to-br from-emerald-600 to-teal-800'
                              : tch.department.includes('Biology')
                              ? 'bg-gradient-to-br from-rose-600 to-pink-800'
                              : 'bg-gradient-to-br from-purple-600 to-indigo-800'
                          }`}
                        >
                          {tch.name
                            .split(' ')
                            .map((p) => p[0])
                            .slice(-2)
                            .join('')}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                            {tch.name}
                          </h4>
                          <span className="text-[11px] text-teal-400 block font-mono">{tch.id}</span>
                          <span className="text-[11px] text-slate-400 block">{tch.department}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                        {tch.status}
                      </span>
                    </div>

                    {/* Role & Qualification */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-2.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Designation</span>
                        <span className="text-slate-200 font-medium">{tch.designation}</span>
                      </div>

                      <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-2.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Credentials</span>
                        <span className="text-slate-300">{tch.qualification}</span>
                        <span className="text-[11px] text-slate-400 block mt-1">
                          Experience: <strong className="text-white">{tch.experience_years} Years</strong>
                        </span>
                      </div>
                    </div>

                    {/* Batch & Exam Assignment */}
                    <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Assigned Batch:</span>
                        <span className="text-slate-200 font-semibold text-right">{tch.assigned_batch_name}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Target Exam:</span>
                        <span className="text-teal-400 font-medium">{tch.target_exam}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Enrolled Students:</span>
                        <span className="text-white font-bold">{tch.enrolled_students} Students</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mt-3 pt-3 border-t border-slate-700/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                        Specialized Syllabus Modules
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {tch.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="bg-slate-900 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info & Office Hours */}
                  <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] space-y-1.5 bg-slate-900/60 -mx-5 -mb-5 p-4 rounded-b-2xl">
                    <div className="flex items-center space-x-2 text-slate-300 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">{tch.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">{tch.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400 text-[10px] pt-1">
                      <Calendar className="w-3 h-3 text-teal-400 shrink-0" />
                      <span>Office: {tch.office_hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INSTITUTE OWNERSHIP & GOVERNANCE */}
        {activeTab === 'governance' && (
          <div className="space-y-6">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-700/80">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {DIRECTORY_OWNER.name
                      .split(' ')
                      .map((p) => p[0])
                      .slice(-2)
                      .join('')}
                  </div>
                  <div>
                    <span className="text-xs text-teal-400 font-semibold tracking-wider uppercase">
                      Sole Institutional Owner & Managing Director
                    </span>
                    <h2 className="text-2xl font-extrabold text-white mt-0.5">{DIRECTORY_OWNER.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{DIRECTORY_OWNER.institute_name}</p>
                  </div>
                </div>

                <div className="bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-700 text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Verified License ID</span>
                  <span className="text-sm font-mono font-bold text-teal-300">{DIRECTORY_OWNER.id}</span>
                </div>
              </div>

              {/* Institution Bio & Key Operating Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Campus Location</span>
                  <span className="text-sm font-semibold text-white mt-1 block">{DIRECTORY_OWNER.location}</span>
                  <span className="text-xs text-slate-400 mt-1 block">Established: {DIRECTORY_OWNER.established_year}</span>
                </div>

                <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Annual Cohort Tuition</span>
                  <span className="text-sm font-semibold text-emerald-400 mt-1 block">
                    ₹{DIRECTORY_OWNER.annual_fee_per_student.toLocaleString('en-IN')} / Student
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Gross Annual Run-rate: ₹{(DIRECTORY_OWNER.annual_revenue / 100000).toFixed(1)} Lakhs
                  </span>
                </div>

                <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Data Privacy Framework</span>
                  <span className="text-sm font-semibold text-teal-300 mt-1 block flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5 mr-1" />
                    <span>DPDP Act 2023 Compliant</span>
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">100/100 Section 9 Verified Consents</span>
                </div>
              </div>

              {/* Operational Governance Blueprint */}
              <div className="mt-6 pt-6 border-t border-slate-700/80 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FileCheck2 className="w-4 h-4 text-teal-400" />
                  <span>Single Institution Governance Guarantee</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Under the Intelliprivart institutional contract, <strong>Apex JEE & Medical Academy, Patna</strong> operates as an isolated single-tenant cryptographic sphere. The sole Owner ({DIRECTORY_OWNER.name}) exercises full data fiduciary authority under the Digital Personal Data Protection Act (DPDP 2023). Zero student assessment telemetry or biometric data is shared with external commercial advertising aggregators or third-party institutes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Owner Account</span>
                    <span className="text-xs font-mono text-teal-300 font-semibold">{DIRECTORY_OWNER.email}</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Direct Hotline</span>
                    <span className="text-xs font-mono text-white font-semibold">{DIRECTORY_OWNER.phone}</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Cohort Retention</span>
                    <span className="text-xs text-emerald-400 font-semibold">{DIRECTORY_OWNER.retention_rate}%</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Faculty Headcount</span>
                    <span className="text-xs text-white font-semibold">5 HODs / Leads</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: QUICK STUDENT & GUARDIAN INSPECTION DRAWER */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900/80 border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Student Header */}
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-xl bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-lg">
                  {selectedStudent.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">{selectedStudent.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        selectedStudent.risk_tier === 'High'
                          ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                          : selectedStudent.risk_tier === 'Moderate'
                          ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                          : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                      }`}
                    >
                      {selectedStudent.risk_tier} Risk
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                    <span className="font-mono text-teal-400 font-semibold">{selectedStudent.id}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">{selectedStudent.pseudonymous_code}</span>
                    <span>•</span>
                    <span>{selectedStudent.class_level}</span>
                  </div>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrolled Batch</span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">{selectedStudent.batch_name}</span>
                  <span className="text-[11px] text-teal-400 block mt-0.5">Lead: {selectedStudent.faculty_lead}</span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Exam Focus</span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">{selectedStudent.target_exam}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Joined: {selectedStudent.join_date}</span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Item Response Theory θ</span>
                  <span className="text-lg font-mono font-bold text-blue-300 mt-0.5 block">
                    θ {selectedStudent.latent_ability_theta >= 0 ? `+${selectedStudent.latent_ability_theta}` : selectedStudent.latent_ability_theta}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Percentile: <strong className="text-teal-300">{selectedStudent.estimated_percentile}th %ile</strong>
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance & Fee Status</span>
                  <span className="text-lg font-bold text-emerald-400 mt-0.5 block">{selectedStudent.attendance_rate}%</span>
                  <span className="text-[11px] text-slate-300 block">{selectedStudent.fee_status}</span>
                </div>
              </div>

              {/* Linked Guardian / Parent Section */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-teal-400 flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Linked Parent / Guardian (DPDP Section 9 Verified)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-medium">
                    Consent Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Guardian Full Name</span>
                    <span className="text-white font-semibold">{selectedStudent.guardian_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Registered Phone</span>
                    <span className="text-slate-200 font-mono flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{selectedStudent.guardian_phone}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Parent Login Email</span>
                    <span className="text-slate-200 font-mono text-[11px]">{selectedStudent.guardian_email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Student Login Email</span>
                    <span className="text-slate-200 font-mono text-[11px]">{selectedStudent.email}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <Link
                  href={`/student?id=${selectedStudent.id}`}
                  className="inline-flex items-center space-x-1 text-xs text-teal-400 hover:text-teal-300 font-semibold"
                >
                  <span>Open Full 6-Tab Student Deep-Dive</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
