'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown01Icon, Remove01Icon, Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSignupContext } from '../SignupContext';
import { useTranslations } from 'next-intl';
import { TimePickerDropdown } from '@/components/ui/time-picker';

export default function Step9Page() {
  const router = useRouter();
  const t = useTranslations('Signup');
  const c = useTranslations('Common');
  const { data, updateData } = useSignupContext();

  const handleContinue = () => {
    router.push('/signup/host/step-12');
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col items-center gap-2 text-center w-full mb-8">
        <h2 className="text-[20px] text-gray-900 font-semibold">{t('step9.heading')}</h2>
        <p className="text-[13px] text-gray-500 max-w-[300px]">
          {t('step9.subtitle')}
        </p>
      </div>

      <div className="w-full flex flex-col gap-5 mb-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] text-gray-800 font-medium">{t('step9.propertyTypeLabel')}</label>
          <div className="flex items-center justify-between w-full bg-white border border-gray-200 h-11 rounded-lg px-3 focus-within:border-[#0084FF] transition-colors cursor-pointer">
            <span className="text-[13px] text-gray-800">{data.propertyType}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} className="text-gray-400 w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] text-gray-800 font-medium">{t('step9.bedroomsLabel')}</label>
          <div className="flex items-center justify-between w-full bg-white border border-gray-200 h-11 rounded-lg px-4">
            <HugeiconsIcon icon={Remove01Icon} className="text-gray-800 w-4 h-4 cursor-pointer" onClick={() => updateData({ bedrooms: Math.max(0, data.bedrooms - 1) })} />
            <span className="text-[13px] text-gray-800 font-medium">{data.bedrooms}</span>
            <HugeiconsIcon icon={Add01Icon} className="text-gray-800 w-4 h-4 cursor-pointer" onClick={() => updateData({ bedrooms: data.bedrooms + 1 })} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] text-gray-800 font-medium">{t('step9.bathroomsLabel')}</label>
          <div className="flex items-center justify-between w-full bg-white border border-gray-200 h-11 rounded-lg px-4">
            <HugeiconsIcon icon={Remove01Icon} className="text-gray-800 w-4 h-4 cursor-pointer" onClick={() => updateData({ bathrooms1: Math.max(0, data.bathrooms1 - 1) })} />
            <span className="text-[13px] text-gray-800 font-medium">{data.bathrooms1}</span>
            <HugeiconsIcon icon={Add01Icon} className="text-gray-800 w-4 h-4 cursor-pointer" onClick={() => updateData({ bathrooms1: data.bathrooms1 + 1 })} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] text-gray-800 font-medium">{t('step9.surfaceAreaLabel')}</label>
          <div className="flex items-center w-full bg-white border border-gray-200 h-11 rounded-lg px-3 focus-within:border-[#0084FF] transition-colors">
            <input 
              type="text" 
              placeholder={t('step9.surfaceAreaPlaceholder')}
              className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[13px] w-full h-full"
              value={data.surfaceArea}
              onChange={(e) => updateData({ surfaceArea: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] text-gray-800 font-medium">Check-in time</label>
          <div className="w-full">
            <TimePickerDropdown 
              value={data.checkInTime || '10:00'} 
              onChange={(val) => updateData({ checkInTime: val })} 
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] text-gray-800 font-medium">Check-out time</label>
          <div className="w-full">
            <TimePickerDropdown 
              value={data.checkOutTime || '16:00'} 
              onChange={(val) => updateData({ checkOutTime: val })} 
            />
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
