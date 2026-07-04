'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CreateHousingProvider } from './CreateHousingContext';

export default function CreateHousingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('Housing.createLayout');
  return (
    <CreateHousingProvider>
      <main className="w-full px-8 py-10 animate-in fade-in duration-500 max-w-4xl mx-auto">
        <h1 className="text-[32px] font-bold text-gray-900 mb-12">{t('title')}</h1>
        {children}
      </main>
    </CreateHousingProvider>
  );
}
