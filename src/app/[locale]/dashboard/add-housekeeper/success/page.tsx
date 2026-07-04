'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

export default function SuccessPage() {
  const t = useTranslations('AddHousekeeper');
  const c = useTranslations('Common');
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-16 h-16 rounded-full bg-[#48C79D] flex items-center justify-center mb-6 shadow-sm">
        <HugeiconsIcon icon={Tick02Icon} className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-[18px] font-bold text-gray-900 mb-2">{t('requestSent')}</h2>
      <p className="text-[13px] text-gray-500 text-center max-w-[350px] mb-8 leading-relaxed">
        {t('requestSentDesc')}
      </p>
      <button 
        onClick={() => router.push('/dashboard')}
        className="bg-black text-white rounded-xl px-12 py-3.5 text-[14px] font-medium hover:bg-gray-800 transition-colors"
      >
        {c('backToHome')}
      </button>
    </div>
  );
}
