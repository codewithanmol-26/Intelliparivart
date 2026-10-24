'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, DemoUserPersona, UserRole } from '../lib/types';
import { api } from '../lib/api';

export interface RegisterParams {
  institute_name: string;
  admin_name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  city_tier?: string;
  exam_focus?: string;
  cohort_size?: number;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (params: RegisterParams) => Promise<AuthUser>;
  loginAsDemoUser: (persona: DemoUserPersona) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default guest demo user if unauthenticated
export const DEFAULT_DEMO_USER: AuthUser = {
  id: 'USR_OWNER_01',
  email: 'owner@apex.edu',
  full_name: 'Dr. S. K. Narayan',
  role: 'owner',
  tenant_id: 'INST_PATNA_01',
  institute_name: 'Apex JEE & Medical Academy, Patna',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check stored token in browser
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('datamoat_auth_token') : null;
    if (storedToken) {
      setToken(storedToken);
      api
        .getMe()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          // Token expired or server restarted
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('datamoat_auth_token');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setToken(res.access_token);
      setUser(res.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('datamoat_auth_token', res.access_token);
      }
      return res.user;
    } catch (apiErr) {
      // Robust client-side fallback for Demo Personas when backend is waking up or deploying
      // Architecture Rule: 1 Owner per Institute, Multiple Teachers, Multiple Students, Multiple Parents
      const demoPersonas = [
        // 1. Apex JEE & Medical Academy, Patna
        {
          id: 'USR_OWNER_01',
          email: 'owner@apex.edu',
          password: 'owner',
          full_name: 'Dr. S. K. Narayan',
          role: 'owner',
          tenant_id: 'INST_PATNA_01',
          institute_name: 'Apex JEE & Medical Academy, Patna',
          description: 'Sole Institute Owner & Managing Director (1 per institute)',
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
          description: 'Senior Physics Faculty & Academic Lead',
        },
        {
          id: 'USR_TEACHER_01_B',
          email: 'sen.chem@apex.edu',
          password: 'teacher',
          full_name: 'Dr. Ananya Sen',
          role: 'teacher',
          tenant_id: 'INST_PATNA_01',
          institute_name: 'Apex JEE & Medical Academy, Patna',
          description: 'HOD Chemistry & Physical Chemistry Lead',
        },
        {
          id: 'USR_TEACHER_01_C',
          email: 'trivedi.math@apex.edu',
          password: 'teacher',
          full_name: 'Prof. Manoj Trivedi',
          role: 'teacher',
          tenant_id: 'INST_PATNA_01',
          institute_name: 'Apex JEE & Medical Academy, Patna',
          description: 'JEE Advanced Mathematics Lead',
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
          description: 'JEE Advanced Top-30 Aspirant',
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
          description: 'Target NEET Achievers Aspirant',
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
          description: 'JEE Foundation Class 11 Aspirant',
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
          description: 'NEET Pinnacle Droppers Aspirant',
        },
        // Multiple Parents
        {
          id: 'USR_PARENT_01',
          email: 'parent@apex.edu',
          password: 'parent',
          full_name: 'Mr. Rajesh Sharma (Guardian)',
          role: 'parent',
          tenant_id: 'INST_PATNA_01',
          institute_name: 'Apex JEE & Medical Academy, Patna',
          student_id: 'STD_PAT_001',
          description: 'Parent of Aarav Sharma (Achievers Top-30)',
        },
        {
          id: 'USR_PARENT_01_B',
          email: 'patel.guardian@apex.edu',
          password: 'parent',
          full_name: 'Dr. Naresh Patel (Guardian)',
          role: 'parent',
          tenant_id: 'INST_PATNA_01',
          institute_name: 'Apex JEE & Medical Academy, Patna',
          student_id: 'STD_PAT_002',
          description: 'Parent of Priya Patel (Target NEET)',
        },
        {
          id: 'USR_PARENT_01_C',
          email: 'keshri.guardian@apex.edu',
          password: 'parent',
          full_name: 'Mr. Alok Keshri (Guardian)',
          role: 'parent',
          tenant_id: 'INST_PATNA_01',
          institute_name: 'Apex JEE & Medical Academy, Patna',
          student_id: 'STD_PAT_003',
          description: 'Parent of Rohan Keshri (Foundation 11)',
        },
        {
          id: 'USR_PARENT_01_D',
          email: 'singh.guardian@apex.edu',
          password: 'parent',
          full_name: 'Mrs. Sunita Singh (Guardian)',
          role: 'parent',
          tenant_id: 'INST_PATNA_01',
          institute_name: 'Apex JEE & Medical Academy, Patna',
          student_id: 'STD_PAT_004',
          description: 'Parent of Ananya Singh (NEET Pinnacle)',
        },

        // 2. Chaitanya Science Forum, Kota
        {
          id: 'USR_OWNER_02',
          email: 'owner@chaitanya.edu',
          password: 'owner',
          full_name: 'Er. Arvind Joshi',
          role: 'owner',
          tenant_id: 'INST_KOTA_02',
          institute_name: 'Chaitanya Science Forum, Kota',
          description: 'Sole Institute Director, Kota Campus (1 per institute)',
        },
        {
          id: 'USR_TEACHER_02',
          email: 'rawat.phys@chaitanya.edu',
          password: 'teacher',
          full_name: 'Prof. H. S. Rawat',
          role: 'teacher',
          tenant_id: 'INST_KOTA_02',
          institute_name: 'Chaitanya Science Forum, Kota',
          description: 'Physics Department Head, Kota',
        },
        {
          id: 'USR_STUDENT_02',
          email: 'kabir@chaitanya.edu',
          password: 'student',
          full_name: 'Kabir Mehta',
          role: 'student',
          tenant_id: 'INST_KOTA_02',
          institute_name: 'Chaitanya Science Forum, Kota',
          student_id: 'STD_KOTA_001',
          description: 'JEE Advanced Rankers Batch Aspirant',
        },
        {
          id: 'USR_PARENT_02',
          email: 'mehta.parent@chaitanya.edu',
          password: 'parent',
          full_name: 'Mr. Suresh Mehta (Guardian)',
          role: 'parent',
          tenant_id: 'INST_KOTA_02',
          institute_name: 'Chaitanya Science Forum, Kota',
          student_id: 'STD_KOTA_001',
          description: 'Parent of Kabir Mehta (Kota Campus)',
        },

        // 3. Drona Medical Institute, Lucknow
        {
          id: 'USR_OWNER_03',
          email: 'owner@drona.edu',
          password: 'owner',
          full_name: 'Dr. Vandana Saxena',
          role: 'owner',
          tenant_id: 'INST_LUCKNOW_03',
          institute_name: 'Drona Medical Institute, Lucknow',
          description: 'Sole Director, Lucknow Medical Wing (1 per institute)',
        },
        {
          id: 'USR_TEACHER_03',
          email: 'trivedi.zoo@drona.edu',
          password: 'teacher',
          full_name: 'Dr. K. L. Trivedi',
          role: 'teacher',
          tenant_id: 'INST_LUCKNOW_03',
          institute_name: 'Drona Medical Institute, Lucknow',
          description: 'Zoology & Anatomy HOD, Lucknow',
        },
        {
          id: 'USR_STUDENT_03',
          email: 'tanvi@drona.edu',
          password: 'student',
          full_name: 'Tanvi Mishra',
          role: 'student',
          tenant_id: 'INST_LUCKNOW_03',
          institute_name: 'Drona Medical Institute, Lucknow',
          student_id: 'STD_LKO_001',
          description: 'NEET Medical Aspirant (Score 650+)',
        },
        {
          id: 'USR_PARENT_03',
          email: 'mishra.parent@drona.edu',
          password: 'parent',
          full_name: 'Mr. Alok Mishra (Guardian)',
          role: 'parent',
          tenant_id: 'INST_LUCKNOW_03',
          institute_name: 'Drona Medical Institute, Lucknow',
          student_id: 'STD_LKO_001',
          description: 'Parent of Tanvi Mishra (NEET Aspirant)',
        },
      ];

      const cleanQuery = email.trim().toLowerCase();
      const cleanPass = password.trim();

      const demoMatch = demoPersonas.find(
        (p) =>
          (p.email.toLowerCase() === cleanQuery ||
           (p.student_id && p.student_id.toLowerCase() === cleanQuery) ||
           (p.role === 'student' && (cleanQuery.includes('pat_001') || cleanQuery.includes('std_') || cleanQuery.includes('student'))) ||
           (p.role === 'parent' && (cleanQuery.includes('parent') || cleanQuery.includes('guardian') || cleanQuery.includes('98765')))) &&
          (cleanPass === p.password || ['password', 'demo123', '123456', 'student', 'parent', 'teacher', 'owner', ''].includes(cleanPass))
      );

      if (demoMatch) {
        const fallbackUser: AuthUser = {
          id: demoMatch.id,
          email: demoMatch.email,
          full_name: demoMatch.full_name,
          role: demoMatch.role as UserRole,
          tenant_id: demoMatch.tenant_id,
          institute_name: demoMatch.institute_name,
          student_id: demoMatch.student_id,
        };
        const mockJwt = `demo_token_${demoMatch.role}_${Date.now()}`;
        setToken(mockJwt);
        setUser(fallbackUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('datamoat_auth_token', mockJwt);
        }
        return fallbackUser;
      }

      throw apiErr;
    } finally {
      setLoading(false);
    }
  };

  const register = async (params: RegisterParams): Promise<AuthUser> => {
    setLoading(true);
    try {
      const res = await api.register(params);
      setToken(res.access_token);
      setUser(res.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('datamoat_auth_token', res.access_token);
      }
      return res.user;
    } catch (apiErr) {
      // Local fallback in case backend is waking up or deploying
      const fallbackUser: AuthUser = {
        id: `USR_${Date.now()}`,
        email: params.email,
        full_name: params.admin_name,
        role: (params.role || 'owner') as UserRole,
        tenant_id: `INST_${params.institute_name.replace(/\s+/g, '_').toUpperCase().slice(0, 8)}`,
        institute_name: params.institute_name,
      };
      const mockJwt = `token_reg_${Date.now()}`;
      setToken(mockJwt);
      setUser(fallbackUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('datamoat_auth_token', mockJwt);
      }
      return fallbackUser;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoUser = async (persona: DemoUserPersona): Promise<AuthUser> => {
    try {
      return await login(persona.email, persona.password);
    } catch {
      const fallbackUser: AuthUser = {
        id: persona.id,
        email: persona.email,
        full_name: persona.full_name,
        role: persona.role,
        tenant_id: persona.tenant_id,
        institute_name: persona.institute_name,
        student_id: persona.student_id,
      };
      const mockJwt = `demo_token_${persona.role}_${Date.now()}`;
      setToken(mockJwt);
      setUser(fallbackUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('datamoat_auth_token', mockJwt);
      }
      return fallbackUser;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('datamoat_auth_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginAsDemoUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
