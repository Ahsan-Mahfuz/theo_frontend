'use client';

import React from 'react';

export default function AddHousekeeperLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-[900px] bg-white rounded-3xl p-8 md:p-12 border border-gray-100 min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
