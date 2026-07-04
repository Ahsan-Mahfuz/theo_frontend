'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Tick02Icon, UserIcon, InformationCircleIcon, TouchInteraction01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

export default function Step5Page() {
  const router = useRouter();
  const t = useTranslations('Signup');

  const handleCreate = () => {
    // Send the host into the full accommodation-create flow (collects every
    // field the backend requires: city, zip, cleaning rate, etc.).
    sessionStorage.removeItem('signup_data');
    router.push('/dashboard/housing/create');
  };

  const handleSkip = () => {
    // Skip for now — the host can add an accommodation later from the dashboard.
    sessionStorage.removeItem('signup_data');
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
           <div className="w-14 h-14 rounded-full bg-[#48C79D] text-white flex items-center justify-center">
             <HugeiconsIcon icon={Tick02Icon} className="w-8 h-8" />
           </div>
        </div>
        <div className="absolute top-2 left-0 w-2 h-2 rounded-full bg-yellow-400" />
        <div className="absolute top-8 right-0 w-1.5 h-1.5 rounded-full bg-blue-400" />
        <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-blue-300" />
      </div>

      <h2 className="text-[22px] sm:text-[24px] text-gray-900 font-semibold mb-2">{t('step5.welcome')}</h2>
      <p className="text-[13px] text-gray-500 mb-8 max-w-[280px] sm:max-w-[300px]">
        {t('step5.subtitle')}
      </p>

      <div className="w-full border border-gray-200 rounded-xl p-5 bg-white text-left mb-8 shadow-sm">
        <h3 className="text-[14px] font-semibold text-gray-800 mb-4">{t('step5.whatsNext')}</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={UserIcon} className="w-5 h-5 text-[#48C79D]" />
            <span className="text-[13px] text-gray-700">{t('step5.next1')}</span>
          </div>
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={InformationCircleIcon} className="w-5 h-5 text-[#48C79D]" />
            <span className="text-[13px] text-gray-700">{t('step5.next2')}</span>
          </div>
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={TouchInteraction01Icon} className="w-5 h-5 text-[#48C79D]" />
            <span className="text-[13px] text-gray-700">{t('step5.next3')}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleCreate}
        className="w-full h-11 rounded-lg text-white bg-[#0084FF] hover:bg-blue-600 transition-colors font-medium text-[14px]"
      >
        {t('step5.addFirstAccommodation')}
      </button>

      <button
        onClick={handleSkip}
        className="w-full h-11 mt-3 rounded-lg text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-[14px]"
      >
        {t('step5.skipForNow')}
      </button>
    </div>
  );
}
