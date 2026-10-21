'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, InstituteInfo } from '../lib/types';
import { getPendingOfflineActions } from '../lib/offlineQueue';
import { api } from '../lib/api';

interface AppContextType {
  tenantId: string;
  setTenantId: (id: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
  isOnline: boolean;
  offlineQueueCount: number;
  refreshOfflineCount: () => void;
  institutes: InstituteInfo[];
}

export const INITIAL_INSTITUTES: InstituteInfo[] = [
  { id: 'INST_PATNA_01', name: 'Apex JEE & Medical Academy, Patna', city: 'Patna, Bihar' },
  { id: 'INST_KOTA_02', name: 'Chaitanya Science Forum, Kota', city: 'Kota, Rajasthan' },
  { id: 'INST_LUCKNOW_03', name: 'Drona Medical Institute, Lucknow', city: 'Lucknow, UP' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tenantId, setTenantId] = useState<string>('INST_PATNA_01');
  const [role, setRole] = useState<UserRole>('owner');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('STD_NA_01_001');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [institutes, setInstitutes] = useState<InstituteInfo[]>(INITIAL_INSTITUTES);

  const refreshOfflineCount = async () => {
    try {
      const items = await getPendingOfflineActions();
      setOfflineQueueCount(items.length);
    } catch {
      setOfflineQueueCount(0);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      refreshOfflineCount();

      // Query database directly for live institute tenants
      api
        .getInstitutes()
        .then((data) => {
          if (data && data.length > 0) {
            setInstitutes(data);
          }
        })
        .catch(() => {
          // Fallback to static list if offline
        });

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        tenantId,
        setTenantId,
        role,
        setRole,
        selectedStudentId,
        setSelectedStudentId,
        selectedBatchId,
        setSelectedBatchId,
        isOnline,
        offlineQueueCount,
        refreshOfflineCount,
        institutes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
