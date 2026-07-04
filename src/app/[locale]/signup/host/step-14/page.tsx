'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Calendar01Icon, DashboardSquare01Icon, CustomerSupportIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';

export default function Step14Page() {
  const router = useRouter();
  const t = useTranslations('Signup');
  const c = useTranslations('Common');

  const handleContinue = () => {
    // Clear session storage since signup flow is complete
    sessionStorage.removeItem('signup_data');
    router.push('/login');
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500 text-center">
      <h2 className="text-[22px] sm:text-[24px] text-gray-900 font-semibold mb-2 mt-4">{t('step14.heading')}</h2>
      <p className="text-[13px] text-gray-500 mb-8">
        {t('step14.subtitle')}
      </p>

      <div className="w-full flex flex-col gap-3 mb-8">
        <div className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-left">
          <div className="w-8 h-8 rounded-full bg-[#35A9D61A] flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-[#35A9D6]" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-[13px] font-semibold text-gray-800">{t('step14.card1Title')}</h4>
            <p className="text-[11px] text-gray-500 leading-snug">{t('step14.card1Desc')}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-left">
          <div className="w-8 h-8 rounded-full bg-[#35A9D61A] flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={DashboardSquare01Icon} className="w-4 h-4 text-[#35A9D6]" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-[13px] font-semibold text-gray-800">{t('step14.card2Title')}</h4>
            <p className="text-[11px] text-gray-500 leading-snug">{t('step14.card2Desc')}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-left">
          <div className="w-8 h-8 rounded-full bg-[#35A9D61A] flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={CustomerSupportIcon} className="w-4 h-4 text-[#35A9D6]" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-[13px] font-semibold text-gray-800">{t('step14.card3Title')}</h4>
            <p className="text-[11px] text-gray-500 leading-snug">{t('step14.card3Desc')}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleContinue}
        className="w-full h-11 rounded-lg text-white bg-[#0084FF] hover:bg-blue-600 transition-colors font-medium text-[14px]"
      >
        {c('continue')}
      </button>
    </div>
  );
}
