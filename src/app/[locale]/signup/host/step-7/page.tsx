'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Camera01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSignupContext } from '../SignupContext';
import { useTranslations } from 'next-intl';

export default function Step7Page() {
  const router = useRouter();
  const t = useTranslations('Signup');
  const c = useTranslations('Common');
  const { data, updateData } = useSignupContext();

  const handleContinue = () => {
    router.push('/signup/host/step-8');
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col items-center gap-2 text-center w-full mb-8">
        <h2 className="text-[20px] text-gray-900 font-semibold">{t('step7.heading')}</h2>
        <p className="text-[13px] text-gray-500 max-w-[280px]">
          {t('step7.subtitle')}
        </p>
      </div>

      <div className="w-full flex flex-col gap-1.5 mb-6">
        <label className="text-[12px] text-gray-800 font-medium">{t('step7.nameLabel')}</label>
        <div className="flex items-center w-full bg-white border border-gray-200 h-11 rounded-lg px-3 focus-within:border-[#0084FF] transition-colors">
          <input 
            type="text" 
            placeholder={t('step7.namePlaceholder')}
            className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[13px] w-full h-full"
            value={data.accommodationName}
            onChange={(e) => updateData({ accommodationName: e.target.value })}
          />
        </div>
      </div>

      <div className="w-full h-48 sm:h-56 bg-gray-200 rounded-xl mb-6 relative overflow-hidden flex flex-col items-center justify-center border border-gray-300 border-dashed cursor-pointer hover:bg-gray-300 transition-colors">
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white gap-2">
          <HugeiconsIcon icon={Camera01Icon} className="w-6 h-6" />
          <span className="text-[13px] font-medium">{t('step7.uploadHere')}</span>
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
