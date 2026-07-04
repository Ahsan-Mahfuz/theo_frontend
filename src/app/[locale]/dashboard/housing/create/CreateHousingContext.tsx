'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type HousingData = {
  name: string;
  type: string;
  address: string;
  city: string;
  zip: string;
  floor: string;
  doorCode: string;
  rooms: string;
  surface: string;
  elevator: string;
  cleaningRate: string;
  notes: string;
  photo: string | null; // preview URL (object URL or remote)
  photoFile: File | null; // actual file to upload as photos[]
  keys: string;
  accessCode: string;
  instructions: string;
};

interface CreateHousingContextType {
  data: HousingData;
  updateData: (updates: Partial<HousingData>) => void;
}

const defaultData: HousingData = {
  name: '',
  type: '',
  address: '',
  city: '',
  zip: '',
  floor: '',
  doorCode: '',
  rooms: '',
  surface: '',
  elevator: 'Yes',
  cleaningRate: '',
  notes: '',
  photo: null,
  photoFile: null,
  keys: '',
  accessCode: '',
  instructions: '',
};

const CreateHousingContext = createContext<CreateHousingContextType | undefined>(undefined);

export function CreateHousingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<HousingData>(defaultData);

  const updateData = (updates: Partial<HousingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <CreateHousingContext.Provider value={{ data, updateData }}>
      {children}
    </CreateHousingContext.Provider>
  );
}

export function useCreateHousing() {
  const context = useContext(CreateHousingContext);
  if (context === undefined) {
    throw new Error('useCreateHousing must be used within a CreateHousingProvider');
  }
  return context;
}
