'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ScheduleData = {
  propertyId: string | null;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  primaryCleanerId: string | null;
  paymentMethod: string;
};

type ScheduleContextType = {
  data: ScheduleData;
  updateData: (updates: Partial<ScheduleData>) => void;
};

const defaultData: ScheduleData = {
  propertyId: null,
  date: '',
  checkInTime: '',
  checkOutTime: '',
  primaryCleanerId: null,
  paymentMethod: 'card', // card, apple_pay, google_pay
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ScheduleData>(defaultData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = sessionStorage.getItem('schedule_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      sessionStorage.setItem('schedule_data', JSON.stringify(data));
    }
  }, [data, isMounted]);

  const updateData = (updates: Partial<ScheduleData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  // Avoid hydration mismatch
  if (!isMounted) return null;

  return (
    <ScheduleContext.Provider value={{ data, updateData }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useScheduleContext() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider');
  }
  return context;
}
