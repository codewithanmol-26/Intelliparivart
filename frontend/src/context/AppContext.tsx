'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, InstituteInfo, RecomputeStatus } from '../lib/types';
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
  recomputeVersion: number;
  lastRunId: string | null;
  isRecomputing: boolean;
  recomputeNotification: string | null;
  triggerRecompute: () => Promise<string | null>;
  notifyRecomputed: (runId?: string, msg?: string) => void;
  clearNotification: () => void;
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
  const [selectedStudentId, setSelectedStudentId] = useState<string>('STD_PAT_001');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [institutes, setInstitutes] = useState<InstituteInfo[]>(INITIAL_INSTITUTES);

  const [recomputeVersion, setRecomputeVersion] = useState<number>(1);
  const [lastRunId, setLastRunId] = useState<string | null>(null);
  const [isRecomputing, setIsRecomputing] = useState<boolean>(false);
  const [recomputeNotification, setRecomputeNotification] = useState<string | null>(null);

  const refreshOfflineCount = async () => {
    try {
      const items = await getPendingOfflineActions();
      setOfflineQueueCount(items.length);
    } catch {
      setOfflineQueueCount(0);
    }
  };

  const notifyRecomputed = (runId?: string, msg?: string) => {
    if (runId) setLastRunId(runId);
    setRecomputeVersion((v) => v + 1);
    if (msg) {
      setRecomputeNotification(msg);
      setTimeout(() => setRecomputeNotification(null), 8000);
    }
  };

  const clearNotification = () => setRecomputeNotification(null);

  const triggerRecompute = async (): Promise<string | null> => {
    setIsRecomputing(true);
    try {
      const res = await api.triggerRecompute(tenantId);
      if (res && res.run_id) {
        setLastRunId(res.run_id);
        setRecomputeVersion((v) => v + 1);
        setRecomputeNotification(`Intelligence pipeline recomputed successfully: Run ID ${res.run_id.slice(-8)}`);
        setTimeout(() => setRecomputeNotification(null), 6000);
        return res.run_id;
      }
      return null;
    } catch (err: any) {
      console.error('Failed to trigger recompute:', err);
      return null;
    } finally {
      setIsRecomputing(false);
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

      // Fetch initial recompute status
      api
        .getRecomputeStatus(tenantId)
        .then((status: RecomputeStatus) => {
          if (status && status.run_id) {
            setLastRunId(status.run_id);
          }
        })
        .catch(() => {});

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [tenantId]);

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
        recomputeVersion,
        lastRunId,
        isRecomputing,
        recomputeNotification,
        triggerRecompute,
        notifyRecomputed,
        clearNotification,
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
