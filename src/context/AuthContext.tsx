'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { getFirebaseAuth, isFirebaseClientConfigured } from '@/lib/firebase-client';
import type { CustomerPublic } from '@/types';

type AuthContextValue = {
  customer: CustomerPublic | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerPublic | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/me', { credentials: 'include' });
      if (!response.ok) {
        setCustomer(null);
        return;
      }
      const data = await response.json();
      setCustomer(data.customer ?? null);
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    if (isFirebaseClientConfigured()) {
      try {
        await signOut(getFirebaseAuth());
      } catch {
        // ignore
      }
    }
    setCustomer(null);
  }, []);

  return (
    <AuthContext.Provider value={{ customer, loading, refresh, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
