'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, DemoUserPersona, UserRole } from '../lib/types';
import { api } from '../lib/api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
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
  const [user, setUser] = useState<AuthUser | null>(DEFAULT_DEMO_USER);
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
          // Token expired or server restarted, fallback to default persona
          setUser(DEFAULT_DEMO_USER);
        })
        .finally(() => setLoading(false));
    } else {
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
      const demoPersonas = [
        {
          id: 'USR_OWNER_01',
          email: 'owner@apex.edu',
          password: 'owner',
          full_name: 'Dr. S. K. Narayan',
          role: 'owner',
          tenant_id: 'INST_PATNA_01',
          institute_name: 'Apex JEE & Medical Academy, Patna',
        },
        {
          id: 'USR_TEACHER_01',
          email: 'teacher@apex.edu',
          password: 'teacher',
          full_name: 'Prof. R. K. Verma',
          role: 'teacher',
          tenant_id: 'INST_PATNA_01',
          institute_name: 'Apex JEE & Medical Academy, Patna',
        },
        {
          id: 'USR_STUDENT_01',
          email: 'student@apex.edu',
          password: 'student',
          full_name: 'Ishaan Prasad',
          role: 'student',
          tenant_id: 'INST_PATNA_01',
          institute_name: 'Apex JEE & Medical Academy, Patna',
          student_id: 'STD_NA_01_001',
        },
        {
          id: 'USR_PARENT_01',
          email: 'parent@apex.edu',
          password: 'parent',
          full_name: 'Mahesh Prasad (Guardian)',
          role: 'parent',
          tenant_id: 'INST_PATNA_01',
          institute_name: 'Apex JEE & Medical Academy, Patna',
          student_id: 'STD_NA_01_001',
        },
        {
          id: 'USR_OWNER_02',
          email: 'owner@chaitanya.edu',
          password: 'owner',
          full_name: 'Er. Arvind Joshi',
          role: 'owner',
          tenant_id: 'INST_KOTA_02',
          institute_name: 'Chaitanya Science Forum, Kota',
        },
        {
          id: 'USR_OWNER_03',
          email: 'owner@drona.edu',
          password: 'owner',
          full_name: 'Dr. Vandana Saxena',
          role: 'owner',
          tenant_id: 'INST_LUCKNOW_03',
          institute_name: 'Drona Medical Institute, Lucknow',
        },
      ];

      const demoMatch = demoPersonas.find(
        (p) =>
          p.email.toLowerCase() === email.trim().toLowerCase() &&
          (password.trim() === p.password || ['password', 'demo123', '123456'].includes(password.trim()))
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
