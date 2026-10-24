'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { DemoUserPersona, InstituteInfo } from '../../lib/types';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  HeartHandshake,
  User,
  CheckCircle2,
  AlertTriangle,
  Search,
  Check,
  HelpCircle,
  Briefcase,
  ChevronDown
} from 'lucide-react';

type RoleTab = 'student' | 'parent' | 'teacher' | 'owner';

interface RosterMember {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: RoleTab;
  tenant_id: string;
  institute_name: string;
  student_id?: string;
  designation: string;
  description: string;
}

// ------------------------------------------------------------------------------
// Multi-Stakeholder Roster Definition
// Architecture Rule: 1 Institute = 1 Owner | Multiple Teachers | Multiple Students | Multiple Parents
// ------------------------------------------------------------------------------
const COMPREHENSIVE_ROSTER: RosterMember[] = [
  // ============================================================================
  // 1. APEX JEE & MEDICAL ACADEMY, PATNA (INST_PATNA_01)
  // ============================================================================
  // Sole 1 Owner
  {
    id: 'USR_OWNER_01',
    email: 'owner@apex.edu',
    password: 'owner',
    full_name: 'Dr. S. K. Narayan',
    role: 'owner',
    tenant_id: 'INST_PATNA_01',
    institute_name: 'Apex JEE & Medical Academy, Patna',
    designation: 'Sole Managing Director & Owner',
    description: 'Executive authority, financial model & DPDP Child Privacy Officer (1 Owner per Institute)'
  },
  // Multiple Teachers
  {
    id: 'USR_TEACHER_01',
    email: 'teacher@apex.edu',
    password: 'teacher',
    full_name: 'Prof. R. K. Verma',
    role: 'teacher',
    tenant_id: 'INST_PATNA_01',
    institute_name: 'Apex JEE & Medical Academy, Patna',
    designation: 'Senior Physics Faculty & Academic Lead',
    description: 'Mechanics & Rotational Dynamics Lead • 15-Min Remedial Worksheet Specialist'
  },
  {
    id: 'USR_TEACHER_01_B',
    email: 'sen.chem@apex.edu',
    password: 'teacher',
    full_name: 'Dr. Ananya Sen',
    role: 'teacher',
    tenant_id: 'INST_PATNA_01',
    institute_name: 'Apex JEE & Medical Academy, Patna',
    designation: 'HOD Chemistry & Physical Chemistry Lead',
    description: 'Ionic Equilibrium & Thermodynamics Concept Trap Diagnostics'
  },
  {
    id: 'USR_TEACHER_01_C',
    email: 'trivedi.math@apex.edu',
    password: 'teacher',
    full_name: 'Prof. Manoj Trivedi',
    role: 'teacher',
    tenant_id: 'INST_PATNA_01',
    institute_name: 'Apex JEE & Medical Academy, Patna',
    designation: 'Senior Mathematics Lead (JEE Advanced)',
    description: 'Integral Calculus, Vectors & 2PL IRT Difficulty Calibration'
  },
  // Multiple Students
  {
    id: 'USR_STUDENT_01',
    email: 'student@apex.edu',
    password: 'student',
    full_name: 'Aarav Sharma',
    role: 'student',
    tenant_id: 'INST_PATNA_01',
    institute_name: 'Apex JEE & Medical Academy, Patna',
    student_id: 'STD_PAT_001',
    designation: 'JEE Advanced Aspirant (Achievers Top-30)',
    description: '94.2 Percentile • Zero-Shaming Growth Trajectory • Target IIT Bombay CSE'
  },
  {
    id: 'USR_STUDENT_01_B',
    email: 'priya@apex.edu',
    password: 'student',
    full_name: 'Priya Patel',
    role: 'student',
    tenant_id: 'INST_PATNA_01',
    institute_name: 'Apex JEE & Medical Academy, Patna',
    student_id: 'STD_PAT_002',
    designation: 'Target NEET Achievers Aspirant',
    description: '97.4 Percentile • 96.2% Attendance • Target AIIMS New Delhi'
  },
  {
    id: 'USR_STUDENT_01_C',
    email: 'rohan@apex.edu',
    password: 'student',
    full_name: 'Rohan Keshri',
    role: 'student',
    tenant_id: 'INST_PATNA_01',
    institute_name: 'Apex JEE & Medical Academy, Patna',
    student_id: 'STD_PAT_003',
    designation: 'JEE Foundation Class 11 Aspirant',
    description: '88.6 Percentile • Strong in Kinematics • Triage Remedials Active'
  },
  {
    id: 'USR_STUDENT_01_D',
    email: 'ananya@apex.edu',
    password: 'student',
    full_name: 'Ananya Singh',
    role: 'student',
    tenant_id: 'INST_PATNA_01',
    institute_name: 'Apex JEE & Medical Academy, Patna',
    student_id: 'STD_PAT_004',
    designation: 'NEET Pinnacle Droppers Batch',
    description: '91.8 Percentile • Botany High Mastery • Chemistry Doubt Priority'
  },
  // Multiple Parents
  {
    id: 'USR_PARENT_01',
    email: 'parent@apex.edu',
    password: 'parent',
    full_name: 'Mr. Rajesh Sharma',
    role: 'parent',
    tenant_id: 'INST_PATNA_01',
    institute_name: 'Apex JEE & Medical Academy, Patna',
    student_id: 'STD_PAT_001',
    designation: 'Guardian of Aarav Sharma (Top-30)',
    description: 'Weekly Bilingual Digest (EN/HI) • Verified Class Attendance'
  },
  {
    id: 'USR_PARENT_01_B',
    email: 'patel.guardian@apex.edu',
    password: 'parent',
    full_name: 'Dr. Naresh Patel',
    role: 'parent',
    tenant_id: 'INST_PATNA_01',
    institute_name: 'Apex JEE & Medical Academy, Patna',
    student_id: 'STD_PAT_002',
    designation: 'Guardian of Priya Patel (NEET)',
    description: 'Weekly Milestone Reviews • Section 9 DPDP Consent Verified'
  },
  {
    id: 'USR_PARENT_01_C',
    email: 'keshri.guardian@apex.edu',
    password: 'parent',
    full_name: 'Mr. Alok Keshri',
    role: 'parent',
    tenant_id: 'INST_PATNA_01',
    institute_name: 'Apex JEE & Medical Academy, Patna',
    student_id: 'STD_PAT_003',
    designation: 'Guardian of Rohan Keshri (Foundation 11)',
    description: 'Remedial Concept Recovery Monitor • Faculty Mentor Notes'
  },
  {
    id: 'USR_PARENT_01_D',
    email: 'singh.guardian@apex.edu',
    password: 'parent',
    full_name: 'Mrs. Sunita Singh',
    role: 'parent',
    tenant_id: 'INST_PATNA_01',
    institute_name: 'Apex JEE & Medical Academy, Patna',
    student_id: 'STD_PAT_004',
    designation: 'Guardian of Ananya Singh (NEET Pinnacle)',
    description: 'MoE Well-Being Supportive Progress Digest • Bi-Weekly Sync'
  },

  // ============================================================================
  // 2. CHAITANYA SCIENCE FORUM, KOTA (INST_KOTA_02)
  // ============================================================================
  // Sole 1 Owner
  {
    id: 'USR_OWNER_02',
    email: 'owner@chaitanya.edu',
    password: 'owner',
    full_name: 'Er. Arvind Joshi',
    role: 'owner',
    tenant_id: 'INST_KOTA_02',
    institute_name: 'Chaitanya Science Forum, Kota',
    designation: 'Sole Institute Director, Kota Campus',
    description: 'Kota Campus Executive Oversight • 1 Owner per Institute Policy'
  },
  // Multiple Teachers
  {
    id: 'USR_TEACHER_02',
    email: 'rawat.phys@chaitanya.edu',
    password: 'teacher',
    full_name: 'Prof. H. S. Rawat',
    role: 'teacher',
    tenant_id: 'INST_KOTA_02',
    institute_name: 'Chaitanya Science Forum, Kota',
    designation: 'Physics Department Head, Kota',
    description: 'Advanced Electrostatics & Optics Lead Faculty'
  },
  {
    id: 'USR_TEACHER_02_B',
    email: 'bansal.math@chaitanya.edu',
    password: 'teacher',
    full_name: 'Dr. P. K. Bansal',
    role: 'teacher',
    tenant_id: 'INST_KOTA_02',
    institute_name: 'Chaitanya Science Forum, Kota',
    designation: 'Senior Mathematics Faculty, Kota',
    description: 'Calculus, Vectors & Algebra Faculty Lead'
  },
  // Multiple Students
  {
    id: 'USR_STUDENT_02',
    email: 'kabir@chaitanya.edu',
    password: 'student',
    full_name: 'Kabir Mehta',
    role: 'student',
    tenant_id: 'INST_KOTA_02',
    institute_name: 'Chaitanya Science Forum, Kota',
    student_id: 'STD_KOTA_001',
    designation: 'JEE Advanced Rankers Batch (Kota)',
    description: '96.1 Percentile • Kota Campus Benchmark Profile'
  },
  {
    id: 'USR_STUDENT_02_B',
    email: 'simran@chaitanya.edu',
    password: 'student',
    full_name: 'Simran Kaur',
    role: 'student',
    tenant_id: 'INST_KOTA_02',
    institute_name: 'Chaitanya Science Forum, Kota',
    student_id: 'STD_KOTA_002',
    designation: 'JEE Main Super-60 Cohort',
    description: '93.5 Percentile • Kota Foundation Lead'
  },
  // Multiple Parents
  {
    id: 'USR_PARENT_02',
    email: 'mehta.parent@chaitanya.edu',
    password: 'parent',
    full_name: 'Mr. Suresh Mehta',
    role: 'parent',
    tenant_id: 'INST_KOTA_02',
    institute_name: 'Chaitanya Science Forum, Kota',
    student_id: 'STD_KOTA_001',
    designation: 'Guardian of Kabir Mehta (Kota)',
    description: 'Parent Portal Access • Weekly Hindi & English Digest'
  },
  {
    id: 'USR_PARENT_02_B',
    email: 'kaur.parent@chaitanya.edu',
    password: 'parent',
    full_name: 'Mrs. Harpreet Kaur',
    role: 'parent',
    tenant_id: 'INST_KOTA_02',
    institute_name: 'Chaitanya Science Forum, Kota',
    student_id: 'STD_KOTA_002',
    designation: 'Guardian of Simran Kaur (Kota)',
    description: 'Parent Portal Access • Attendance & Growth Tracking'
  },

  // ============================================================================
  // 3. DRONA MEDICAL INSTITUTE, LUCKNOW (INST_LUCKNOW_03)
  // ============================================================================
  // Sole 1 Owner
  {
    id: 'USR_OWNER_03',
    email: 'owner@drona.edu',
    password: 'owner',
    full_name: 'Dr. Vandana Saxena',
    role: 'owner',
    tenant_id: 'INST_LUCKNOW_03',
    institute_name: 'Drona Medical Institute, Lucknow',
    designation: 'Sole Director, Lucknow Medical Wing',
    description: 'Executive Director • 1 Owner per Institute Policy'
  },
  // Multiple Teachers
  {
    id: 'USR_TEACHER_03',
    email: 'trivedi.zoo@drona.edu',
    password: 'teacher',
    full_name: 'Dr. K. L. Trivedi',
    role: 'teacher',
    tenant_id: 'INST_LUCKNOW_03',
    institute_name: 'Drona Medical Institute, Lucknow',
    designation: 'Zoology & Anatomy HOD, Lucknow',
    description: 'NEET Medical Lead Faculty & Diagnostic Specialist'
  },
  {
    id: 'USR_TEACHER_03_B',
    email: 'nambiar.bot@drona.edu',
    password: 'teacher',
    full_name: 'Dr. Meera Nambiar',
    role: 'teacher',
    tenant_id: 'INST_LUCKNOW_03',
    institute_name: 'Drona Medical Institute, Lucknow',
    designation: 'Botany & Genetics Lead Faculty',
    description: 'Plant Physiology & Molecular Genetics Head'
  },
  // Multiple Students
  {
    id: 'USR_STUDENT_03',
    email: 'tanvi@drona.edu',
    password: 'student',
    full_name: 'Tanvi Mishra',
    role: 'student',
    tenant_id: 'INST_LUCKNOW_03',
    institute_name: 'Drona Medical Institute, Lucknow',
    student_id: 'STD_LKO_001',
    designation: 'NEET Medical Top Batch (Score 660+)',
    description: 'Biology 355/360 • AIIMS Target Aspirant'
  },
  {
    id: 'USR_STUDENT_03_B',
    email: 'aryan@drona.edu',
    password: 'student',
    full_name: 'Aryan Srivastava',
    role: 'student',
    tenant_id: 'INST_LUCKNOW_03',
    institute_name: 'Drona Medical Institute, Lucknow',
    student_id: 'STD_LKO_002',
    designation: 'NEET Medical Achievers Batch',
    description: 'Organic Chemistry Focus • High Growth Trajectory'
  },
  // Multiple Parents
  {
    id: 'USR_PARENT_03',
    email: 'mishra.parent@drona.edu',
    password: 'parent',
    full_name: 'Mr. Alok Mishra',
    role: 'parent',
    tenant_id: 'INST_LUCKNOW_03',
    institute_name: 'Drona Medical Institute, Lucknow',
    student_id: 'STD_LKO_001',
    designation: 'Guardian of Tanvi Mishra (NEET Top)',
    description: 'Parent Portal Access • Weekly Holistic Progress Report'
  },
  {
    id: 'USR_PARENT_03_B',
    email: 'srivastava.parent@drona.edu',
    password: 'parent',
    full_name: 'Mrs. Rekha Srivastava',
    role: 'parent',
    tenant_id: 'INST_LUCKNOW_03',
    institute_name: 'Drona Medical Institute, Lucknow',
    student_id: 'STD_LKO_002',
    designation: 'Guardian of Aryan Srivastava (NEET)',
    description: 'Parent Portal Access • Mentor Feedback & Counseling'
  }
];

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as RoleTab) || 'owner';

  const { login, loginAsDemoUser, user } = useAuth();
  const { setTenantId, setRole, setSelectedStudentId } = useApp();

  const [activeTab, setActiveTab] = useState<RoleTab>(
    ['student', 'parent', 'teacher', 'owner'].includes(initialRole) ? initialRole : 'owner'
  );

  // Database Institutes List
  const [institutes, setInstitutes] = useState<InstituteInfo[]>([]);
  const [loadingInstitutes, setLoadingInstitutes] = useState(true);

  // Form states
  const [instituteSearch, setInstituteSearch] = useState('Apex JEE & Medical Academy, Patna');
  const [selectedInstitute, setSelectedInstitute] = useState<InstituteInfo | null>(null);
  const [showInstituteDropdown, setShowInstituteDropdown] = useState(false);

  // Selected Stakeholder Member within current Institute
  const [selectedMemberId, setSelectedMemberId] = useState<string>('USR_OWNER_01');

  // Credential input fields
  const [studentIdentifier, setStudentIdentifier] = useState('student@apex.edu');
  const [guardianIdentifier, setGuardianIdentifier] = useState('parent@apex.edu');
  const [wardStudentId, setWardStudentId] = useState('STD_PAT_001');
  const [teacherEmail, setTeacherEmail] = useState('teacher@apex.edu');
  const [ownerEmail, setOwnerEmail] = useState('owner@apex.edu');
  const [password, setPassword] = useState('password');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load institutes from Supabase database
  useEffect(() => {
    let isMounted = true;
    api
      .getInstitutes()
      .then((data) => {
        if (!isMounted) return;
        if (data && data.length > 0) {
          setInstitutes(data);
          const apex = data.find((i) => i.name.toLowerCase().includes('apex')) || data[0];
          setSelectedInstitute(apex);
          setInstituteSearch(apex.name);
        }
      })
      .catch(() => {
        const fallback = [
          { id: 'INST_PATNA_01', name: 'Apex JEE & Medical Academy, Patna', city: 'Patna' },
          { id: 'INST_KOTA_02', name: 'Chaitanya Science Forum, Kota', city: 'Kota' },
          { id: 'INST_LUCKNOW_03', name: 'Drona Medical Institute, Lucknow', city: 'Lucknow' }
        ];
        if (isMounted) {
          setInstitutes(fallback);
          setSelectedInstitute(fallback[0]);
          setInstituteSearch(fallback[0].name);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingInstitutes(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Current active tenant ID
  const currentTenantId = selectedInstitute?.id || 'INST_PATNA_01';

  // Multi-Stakeholder Roster Filtered by Current Institute
  const instituteOwner = COMPREHENSIVE_ROSTER.find(
    (m) => m.tenant_id === currentTenantId && m.role === 'owner'
  ) || COMPREHENSIVE_ROSTER[0];

  const instituteTeachers = COMPREHENSIVE_ROSTER.filter(
    (m) => m.tenant_id === currentTenantId && m.role === 'teacher'
  );

  const instituteStudents = COMPREHENSIVE_ROSTER.filter(
    (m) => m.tenant_id === currentTenantId && m.role === 'student'
  );

  const instituteParents = COMPREHENSIVE_ROSTER.filter(
    (m) => m.tenant_id === currentTenantId && m.role === 'parent'
  );

  // Synchronize fields when Institute or Role Tab changes
  useEffect(() => {
    setError(null);
    if (activeTab === 'owner') {
      setSelectedMemberId(instituteOwner.id);
      setOwnerEmail(instituteOwner.email);
      setPassword('owner');
    } else if (activeTab === 'teacher') {
      const firstTeacher = instituteTeachers[0] || COMPREHENSIVE_ROSTER.find((m) => m.role === 'teacher')!;
      setSelectedMemberId(firstTeacher.id);
      setTeacherEmail(firstTeacher.email);
      setPassword('teacher');
    } else if (activeTab === 'student') {
      const firstStudent = instituteStudents[0] || COMPREHENSIVE_ROSTER.find((m) => m.role === 'student')!;
      setSelectedMemberId(firstStudent.id);
      setStudentIdentifier(firstStudent.student_id || firstStudent.email);
      setWardStudentId(firstStudent.student_id || 'STD_PAT_001');
      setPassword('student');
    } else if (activeTab === 'parent') {
      const firstParent = instituteParents[0] || COMPREHENSIVE_ROSTER.find((m) => m.role === 'parent')!;
      setSelectedMemberId(firstParent.id);
      setGuardianIdentifier(firstParent.email);
      setWardStudentId(firstParent.student_id || 'STD_PAT_001');
      setPassword('parent');
    }
  }, [currentTenantId, activeTab]);

  // Current active persona for the 1-Click Launch card
  const activePersona: RosterMember =
    COMPREHENSIVE_ROSTER.find((m) => m.id === selectedMemberId) ||
    (activeTab === 'owner'
      ? instituteOwner
      : activeTab === 'teacher'
      ? instituteTeachers[0]
      : activeTab === 'student'
      ? instituteStudents[0]
      : instituteParents[0]) ||
    COMPREHENSIVE_ROSTER[0];

  // Helper to check if current institute input matches database
  const getMatchedInstitute = (): InstituteInfo | null => {
    if (!instituteSearch || !instituteSearch.trim()) return null;
    const q = instituteSearch.trim().toLowerCase();
    return (
      institutes.find(
        (inst) =>
          inst.name.toLowerCase() === q ||
          inst.name.toLowerCase().includes(q) ||
          inst.id.toLowerCase() === q
      ) || null
    );
  };

  const handleSelectInstitute = (inst: InstituteInfo) => {
    setSelectedInstitute(inst);
    setInstituteSearch(inst.name);
    setShowInstituteDropdown(false);
    setError(null);
  };

  const handleSelectTeacher = (memberId: string) => {
    setSelectedMemberId(memberId);
    const teacher = instituteTeachers.find((t) => t.id === memberId);
    if (teacher) {
      setTeacherEmail(teacher.email);
      setPassword('teacher');
    }
  };

  const handleSelectStudent = (memberId: string) => {
    setSelectedMemberId(memberId);
    const student = instituteStudents.find((s) => s.id === memberId);
    if (student) {
      setStudentIdentifier(student.student_id || student.email);
      setWardStudentId(student.student_id || 'STD_PAT_001');
      setPassword('student');
    }
  };

  const handleSelectParent = (memberId: string) => {
    setSelectedMemberId(memberId);
    const parent = instituteParents.find((p) => p.id === memberId);
    if (parent) {
      setGuardianIdentifier(parent.email);
      setWardStudentId(parent.student_id || 'STD_PAT_001');
      setPassword('parent');
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Strict Database Institute Match Requirement for Students and Parents
    if (activeTab === 'student' || activeTab === 'parent') {
      const matched = getMatchedInstitute();
      if (!matched) {
        setError(
          `Institute "${instituteSearch}" not found in database. Student & Parent access requires affiliation with an active coaching institute enrolled on Intelliprivart. Please select a registered coaching institute.`
        );
        return;
      }
      setSelectedInstitute(matched);
      setTenantId(matched.id);
    }

    setSubmitting(true);
    try {
      let targetEmail = '';
      if (activeTab === 'student') targetEmail = studentIdentifier.trim();
      else if (activeTab === 'parent') targetEmail = guardianIdentifier.trim();
      else if (activeTab === 'teacher') targetEmail = teacherEmail.trim();
      else targetEmail = ownerEmail.trim();

      const loggedUser = await login(targetEmail, password);

      // Force synchronize tenant context
      if (selectedInstitute) {
        setTenantId(selectedInstitute.id);
      } else {
        setTenantId(loggedUser.tenant_id);
      }

      setRole(activeTab);
      if (activeTab === 'student' || activeTab === 'parent') {
        setSelectedStudentId(wardStudentId || 'STD_PAT_001');
      }

      router.push('/overview');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials or select an operational role below.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectPersonaLogin = async (member: RosterMember) => {
    setError(null);
    setSubmitting(true);
    try {
      const persona: DemoUserPersona = {
        id: member.id,
        email: member.email,
        password: member.password,
        full_name: member.full_name,
        role: member.role,
        tenant_id: member.tenant_id,
        institute_name: member.institute_name,
        student_id: member.student_id,
        description: member.description
      };

      const loggedUser = await loginAsDemoUser(persona);
      setTenantId(loggedUser.tenant_id);
      setRole(member.role);
      if (member.student_id) setSelectedStudentId(member.student_id);

      router.push('/overview');
    } catch (err: any) {
      setError('Unable to authenticate role profile. Please check database connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const matchedInstitute = getMatchedInstitute();

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4">
      {/* Title & Brand Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <Link href="/" className="inline-block mb-3 group">
          <img
            src="/intelliprivart-logo-light.png"
            alt="Intelliprivart"
            className="h-10 sm:h-12 w-auto mx-auto object-contain group-hover:opacity-90 transition"
          />
        </Link>
        <div className="inline-flex items-center space-x-2 bg-teal-500/10 text-teal-700 border border-teal-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>DPDP Act 2023 Multi-Tenant Isolated Authentication</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Your Institute Portal
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Distinct portal authentication for students, teachers, parents, and institute owners. Student & parent accounts verify database institute affiliation before proceeding.
        </p>

        {/* Tab Toggle: Sign In vs Register */}
        <div className="mt-5 max-w-xs mx-auto bg-slate-200/80 p-1 rounded-xl flex items-center text-xs font-semibold">
          <div className="flex-1 py-1.5 text-center bg-white text-teal-700 rounded-lg shadow-xs font-bold">
            Sign In to Portal
          </div>
          <Link
            href="/register"
            className="flex-1 py-1.5 text-center text-slate-600 hover:text-slate-900 rounded-lg transition"
          >
            Register Institute
          </Link>
        </div>
      </div>

      {/* 4 Distinct Role Selector Tabs */}
      <div className="max-w-3xl mx-auto mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'student'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('parent')}
            className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'parent'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Parent</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('teacher')}
            className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'teacher'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('owner')}
            className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'owner'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Institute Owner</span>
          </button>
        </div>
      </div>

      {/* Stakeholder Policy Banner */}
      <div className="max-w-3xl mx-auto mb-6">
        {activeTab === 'owner' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center space-x-2.5">
            <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
            <div className="leading-snug">
              <span className="font-bold">1 Owner per Institute Policy:</span> Each coaching institute has strictly <strong>ONE Owner / Managing Director</strong> with executive oversight, business analytics, and retention financial modeling.
            </div>
          </div>
        )}
        {activeTab === 'teacher' && (
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center space-x-2.5">
            <Users className="w-4 h-4 text-teal-700 shrink-0" />
            <div className="leading-snug">
              <span className="font-bold">Multiple Teachers per Institute:</span> Each institute employs <strong>multiple faculty members</strong> across Physics, Chemistry, Maths, and Biology. Select your assigned faculty profile below.
            </div>
          </div>
        )}
        {activeTab === 'student' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center space-x-2.5">
            <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0" />
            <div className="leading-snug">
              <span className="font-bold">Multiple Students per Institute:</span> Each institute enrolls <strong>multiple students</strong> across batches (Top-30, Foundation, NEET). Select your student profile or enter your roll number.
            </div>
          </div>
        )}
        {activeTab === 'parent' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center space-x-2.5">
            <HeartHandshake className="w-4 h-4 text-amber-700 shrink-0" />
            <div className="leading-snug">
              <span className="font-bold">Multiple Parents per Institute:</span> Each institute has <strong>multiple parents</strong>, each linked to their enrolled child/ward under statutory Section 9 DPDP parental consent.
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
          {/* Header indicator */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  activeTab === 'student'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeTab === 'parent'
                    ? 'bg-amber-100 text-amber-800'
                    : activeTab === 'teacher'
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {activeTab} Sign In
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {activeTab === 'student' && 'Student Growth Portal'}
                {activeTab === 'parent' && 'Parent Digest Portal'}
                {activeTab === 'teacher' && 'Teacher & Academic Head Workspace'}
                {activeTab === 'owner' && 'Institute Owner Executive Dashboard'}
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Step 1 of 1</span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
            {/* 1. Institute Search / Selection Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 block">
                  Coaching Institute Affiliation <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">Database Institute</span>
              </div>

              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 z-10" />
                <input
                  type="text"
                  required
                  placeholder="Search enrolled institute name (e.g. Apex, Chaitanya, Drona)..."
                  value={instituteSearch}
                  onFocus={() => setShowInstituteDropdown(true)}
                  onChange={(e) => {
                    setInstituteSearch(e.target.value);
                    setShowInstituteDropdown(true);
                    setError(null);
                  }}
                  className={`w-full pl-9 pr-8 py-2 border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 text-xs text-slate-800 ${
                    matchedInstitute
                      ? 'border-emerald-300 focus:ring-emerald-500'
                      : 'border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {matchedInstitute && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-2.5" />
                )}
              </div>

              {/* Database Verification Status Pill */}
              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                {matchedInstitute ? (
                  <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified: {matchedInstitute.name} ({matchedInstitute.city})</span>
                  </span>
                ) : instituteSearch ? (
                  <span className="text-rose-600 font-semibold flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Not found in DB. Must match an enrolled coaching institute.</span>
                  </span>
                ) : (
                  <span className="text-slate-400">Select or type your registered institute</span>
                )}
              </div>

              {/* Searchable Dropdown Suggestions */}
              {showInstituteDropdown && (
                <div className="mt-1.5 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg p-1 space-y-0.5 z-20">
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 block">
                    Enrolled Institutes in Database ({institutes.length})
                  </span>
                  {institutes
                    .filter((inst) =>
                      inst.name.toLowerCase().includes(instituteSearch.toLowerCase()) ||
                      inst.city?.toLowerCase().includes(instituteSearch.toLowerCase())
                    )
                    .map((inst) => (
                      <button
                        key={inst.id}
                        type="button"
                        onClick={() => handleSelectInstitute(inst)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-teal-50 flex items-center justify-between text-xs group cursor-pointer"
                      >
                        <span className="font-semibold text-slate-800 group-hover:text-teal-700">
                          {inst.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.2 rounded">
                          {inst.city || inst.id}
                        </span>
                      </button>
                    ))}
                  {institutes.length === 0 && (
                    <div className="p-2 text-center text-slate-400 text-xs">
                      Loading registered institutes...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Specific Stakeholder Selection within Institute */}

            {/* OWNER TAB: Shows strictly the 1 Owner of this Institute */}
            {activeTab === 'owner' && (
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider">
                    Designated Institute Owner (1 per Institute)
                  </span>
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded">
                    Sole Director
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 text-xs">
                  {instituteOwner.full_name}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {instituteOwner.description}
                </p>
                <div className="text-[11px] font-mono text-blue-800 pt-1">
                  Official Email: {instituteOwner.email}
                </div>
              </div>
            )}

            {/* TEACHER TAB: Shows selector for Multiple Teachers in this Institute */}
            {activeTab === 'teacher' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Select Faculty Member ({instituteTeachers.length} in this Institute) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedMemberId}
                    onChange={(e) => handleSelectTeacher(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs text-slate-800 font-medium cursor-pointer"
                  >
                    {instituteTeachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.full_name} — {t.designation}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Select which faculty member you are logging in as.
                </span>
              </div>
            )}

            {/* STUDENT TAB: Shows selector for Multiple Students in this Institute */}
            {activeTab === 'student' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Select Enrolled Student ({instituteStudents.length} sample profiles in this Institute) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedMemberId}
                    onChange={(e) => handleSelectStudent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-800 font-medium cursor-pointer mb-2"
                  >
                    {instituteStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.full_name} ({s.student_id}) — {s.designation}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="font-semibold text-slate-700 block mb-1">
                  Student Roll Number / Registered Email
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. STD_PAT_001 or student@apex.edu"
                    value={studentIdentifier}
                    onChange={(e) => setStudentIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* PARENT TAB: Shows selector for Multiple Parents in this Institute */}
            {activeTab === 'parent' && (
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Select Parent / Guardian ({instituteParents.length} in this Institute) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => handleSelectParent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800 font-medium cursor-pointer mb-2"
                  >
                    {instituteParents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name} — {p.designation}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Guardian Email or Mobile
                  </label>
                  <div className="relative">
                    <HeartHandshake className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. parent@apex.edu or +91 98765 43210"
                      value={guardianIdentifier}
                      onChange={(e) => setGuardianIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Ward Student ID / Roll Code
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. STD_PAT_001"
                      value={wardStudentId}
                      onChange={(e) => setWardStudentId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 block">
                  Password <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Demo password: &quot;password&quot; or role</span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={submitting || ((activeTab === 'student' || activeTab === 'parent') && !matchedInstitute)}
              className={`w-full mt-2 py-2.5 px-4 text-white rounded-xl font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : activeTab === 'parent'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : activeTab === 'teacher'
                  ? 'bg-teal-600 hover:bg-teal-700'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              <span>
                {submitting
                  ? 'Verifying Session...'
                  : activeTab === 'student'
                  ? `Sign In as Student (${activePersona.full_name})`
                  : activeTab === 'parent'
                  ? `Sign In as Guardian (${activePersona.full_name})`
                  : activeTab === 'teacher'
                  ? `Sign In as Faculty (${activePersona.full_name})`
                  : `Sign In as Director (${instituteOwner.full_name})`}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {activeTab === 'owner' && (
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Need to register a new institute?</span>
              <Link href="/register" className="font-bold text-teal-700 hover:underline">
                Register New Institute &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Pre-Calibrated Persona & 1-Click Launch */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Pre-Calibrated Active Persona ({activeTab.toUpperCase()})
                </h3>
              </div>
              <span className="text-[10px] text-teal-700 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                Live DB Calibrated
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Launch directly into this verified profile linked to live database records for {selectedInstitute?.name || 'the coaching academy'}:
            </p>

            {/* Active Persona Card */}
            <div
              className={`p-4 bg-white rounded-xl border shadow-2xs space-y-2.5 ${
                activeTab === 'student'
                  ? 'border-emerald-200'
                  : activeTab === 'parent'
                  ? 'border-amber-200'
                  : activeTab === 'teacher'
                  ? 'border-teal-200'
                  : 'border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    activeTab === 'student'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeTab === 'parent'
                      ? 'bg-amber-100 text-amber-800'
                      : activeTab === 'teacher'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {activePersona.designation}
                </span>
                <span className="text-[11px] font-bold text-teal-600">1-Click Launch &rarr;</span>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{activePersona.full_name}</h4>
                <p className="text-[11px] text-slate-600 font-medium">{activePersona.institute_name}</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">{activePersona.description}</p>
                {activePersona.student_id && (
                  <div className="text-[10px] text-teal-700 font-mono mt-1">
                    Student ID: {activePersona.student_id}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDirectPersonaLogin(activePersona)}
                className={`w-full py-2.5 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs ${
                  activeTab === 'student'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : activeTab === 'parent'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : activeTab === 'teacher'
                    ? 'bg-teal-600 hover:bg-teal-700'
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                {activeTab === 'student' && <GraduationCap className="w-4 h-4" />}
                {activeTab === 'parent' && <HeartHandshake className="w-4 h-4" />}
                {activeTab === 'teacher' && <Users className="w-4 h-4" />}
                {activeTab === 'owner' && <Building2 className="w-4 h-4" />}
                <span>
                  Launch {activePersona.full_name}&apos;s {activeTab.toUpperCase()} Workspace
                </span>
              </button>
            </div>

            {/* Architecture Hierarchy Explainer Card */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Institute Stakeholder Structure ({selectedInstitute?.name || 'Apex JEE'})
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-blue-50/70 rounded-lg border border-blue-100">
                  <span className="font-bold text-blue-900 block">1 Owner</span>
                  <span className="text-[10px] text-blue-700">{instituteOwner.full_name}</span>
                </div>
                <div className="p-2 bg-teal-50/70 rounded-lg border border-teal-100">
                  <span className="font-bold text-teal-900 block">{instituteTeachers.length} Teachers</span>
                  <span className="text-[10px] text-teal-700">Physics, Chem, Math Leads</span>
                </div>
                <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-900 block">{instituteStudents.length} Students</span>
                  <span className="text-[10px] text-emerald-700">Top-30, NEET, Foundation</span>
                </div>
                <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-100">
                  <span className="font-bold text-amber-900 block">{instituteParents.length} Parents</span>
                  <span className="text-[10px] text-amber-700">Section 9 Consent Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Database Lineage Audit Note */}
          <div className="p-4 rounded-xl bg-blue-950 text-blue-100 text-xs space-y-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="font-bold text-white text-xs">Multi-Tenant Isolation &amp; DPDP Compliance</span>
            </div>
            <p className="text-[11px] text-blue-200/90 leading-relaxed">
              Every coaching institute operates as an isolated tenant. There is strictly 1 Owner per institute who governs access, while multiple faculty members, students, and parents collaborate with zero cross-tenant leakage.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
        <span>&copy; {new Date().getFullYear()} Nextute EdTech Pvt. Ltd. • The Data Moat</span>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:text-teal-600 transition">Public Homepage</Link>
          <span>•</span>
          <Link href="/profile" className="hover:text-teal-600 transition">Account Profile</Link>
          <span>•</span>
          <Link href="/privacy-policy" className="hover:text-teal-600 transition">Privacy Policy (DPDP Act)</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-teal-600 transition">Terms of Service</Link>
          <span>•</span>
          <Link href="/register" className="hover:text-teal-600 transition">Register Institute</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6 text-slate-500 text-sm">
          Loading portal authentication...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
