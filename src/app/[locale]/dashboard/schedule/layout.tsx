'use client';

import React from 'react';
import { ScheduleProvider } from './ScheduleContext';

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScheduleProvider>
      <div className="w-full flex flex-col items-center py-10 px-4">
        {/* Same layout as Add Housekeeper: Max width 900, white rounded box */}
        <div className="w-full max-w-[900px] bg-white rounded-3xl p-8 md:p-12 border border-gray-100 min-h-[500px]">
          {children}
        </div>
      </div>
    </ScheduleProvider>
  );
}
