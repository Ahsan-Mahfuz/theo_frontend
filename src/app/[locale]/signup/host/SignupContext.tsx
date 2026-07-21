'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SignupData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  code: string[];
  accommodationName: string;
  address1: string;
  address2: string;
  propertyType: string;
  bedrooms: number;
  bathrooms1: number;
  bathrooms2: number;
  surfaceArea: string;
  startTime: string;
  endTime: string;
  averageDuration: string;
  proposedRate: string;
  checkInTime: string;
  checkOutTime: string;
};

type SignupContextType = {
  data: SignupData;
  updateData: (updates: Partial<SignupData>) => void;
};

// Backend OTP is exactly 4 digits — the input renders one box per entry.
export const OTP_LENGTH = 4;

const emptyCode = () => Array.from({ length: OTP_LENGTH }, () => '');

// Force any restored code onto exactly OTP_LENGTH entries so stale persisted
// state (e.g. an older 6-box array) can never render the wrong number of boxes.
const normalizeCode = (code: unknown): string[] => {
  const arr = Array.isArray(code) ? code.map((c) => (typeof c === 'string' ? c : '')) : [];
  return Array.from({ length: OTP_LENGTH }, (_, i) => arr[i] ?? '');
};

const defaultData: SignupData = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  code: emptyCode(),
  accommodationName: '',
  address1: '',
  address2: '',
  propertyType: 'Apartment',
  bedrooms: 2,
  bathrooms1: 2,
  bathrooms2: 2,
  surfaceArea: '',
  startTime: '10:00 AM',
  endTime: '4:00 PM',
  averageDuration: '2h30',
  proposedRate: '80',
  checkInTime: '10:00 AM',
  checkOutTime: '04:00 PM',
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SignupData>(defaultData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = sessionStorage.getItem('signup_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({ ...defaultData, ...parsed, code: normalizeCode(parsed.code) });
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      sessionStorage.setItem('signup_data', JSON.stringify(data));
    }
  }, [data, isMounted]);

  const updateData = (updates: Partial<SignupData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  // Avoid hydration mismatch
  if (!isMounted) return null;

  return (
    <SignupContext.Provider value={{ data, updateData }}>
      {children}
    </SignupContext.Provider>
  );
}

export function useSignupContext() {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error('useSignupContext must be used within a SignupProvider');
  }
  return context;
}
