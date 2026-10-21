'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../lib/types';
import { getPendingOfflineActions } from '../lib/offlineQueue';

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
}

export const INSTITUTES = [
  { id: 'INST001', name: 'Apex Academy, Patna', city: 'Patna, Bihar' },
  { id: 'INST002', name: 'Nucleus Classes, Lucknow', city: 'Lucknow, UP' },
  { id: 'INST003', name: 'Pinnacle Institute, Jaipur', city: 'Jaipur, Rajasthan' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tenantId, setTenantId] = useState<string>('INST001');
  const [role, setRole] = useState<UserRole>('owner');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('STU00001');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);

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
