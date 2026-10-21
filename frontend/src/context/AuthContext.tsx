'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, DemoUserPersona } from '../lib/types';
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
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoUser = async (persona: DemoUserPersona): Promise<AuthUser> => {
    return login(persona.email, persona.password);
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
