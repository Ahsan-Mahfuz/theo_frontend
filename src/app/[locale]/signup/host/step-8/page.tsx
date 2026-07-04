'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSignupContext } from '../SignupContext';
import { useTranslations } from 'next-intl';

export default function Step8Page() {
  const router = useRouter();
  const t = useTranslations('Signup');
  const c = useTranslations('Common');
  const { data, updateData } = useSignupContext();
  const [mapQuery, setMapQuery] = useState('Miami, FL');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMapQuery(data.address1 || 'Miami, FL');
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [data.address1]);

  const handleContinue = () => {
    router.push('/signup/host/step-9');
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col items-center gap-2 text-center w-full mb-8">
        <h2 className="text-[20px] text-gray-900 font-semibold">{t('step8.heading')}</h2>
        <p className="text-[13px] text-gray-500 max-w-[300px]">
          {t('step8.subtitle')}
        </p>
      </div>

      <div className="w-full flex flex-col gap-1.5 mb-6">
        <label className="text-[12px] text-gray-800 font-medium">{t('step8.addAddressLabel')}</label>
        <div className="flex items-center w-full bg-white border border-gray-200 h-11 rounded-lg px-3 gap-2 focus-within:border-[#0084FF] transition-colors">
          <HugeiconsIcon icon={Search01Icon} className="text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder={t('step8.addAddressPlaceholder')}
            className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[13px] w-full h-full"
            value={data.address1}
            onChange={(e) => updateData({ address1: e.target.value })}
          />
        </div>
      </div>

      <div className="w-full h-48 sm:h-56 bg-gray-200 rounded-xl mb-6 relative overflow-hidden flex flex-col items-center justify-center border border-gray-200">
        <iframe 
          src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`} 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 z-0 opacity-80 transition-all duration-500"
        ></iframe>
      </div>

      <div className="w-full flex flex-col gap-1.5 mb-6">
        <label className="text-[12px] text-gray-800 font-medium">{t('step8.address2Label')}</label>
        <div className="flex items-center w-full bg-white border border-gray-200 h-11 rounded-lg px-3 focus-within:border-[#0084FF] transition-colors">
          <input 
            type="text" 
            placeholder={t('step8.address2Placeholder')}
            className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[13px] w-full h-full"
            value={data.address2}
            onChange={(e) => updateData({ address2: e.target.value })}
          />
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
