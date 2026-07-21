'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { StepIndicator } from '../components/StepIndicator';
import { useCreateHousing } from '../CreateHousingContext';

export default function Step4Page() {
  const t = useTranslations('Housing.step4');
  const c = useTranslations('Common');
  const router = useRouter();
  const { data, updateData } = useCreateHousing();

  const handleContinue = () => {
    router.push('/dashboard/housing/create/step-5');
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      <StepIndicator currentStep={4} />
      
      <div className="text-center mb-8">
        <h2 className="text-[16px] font-bold text-gray-900 mb-1">{t('heading')}</h2>
        <p className="text-[13px] text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('keysLabel')}</label>
          <select
            value={data.keys}
            onChange={(e) => updateData({ keys: e.target.value })}
            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm cursor-pointer"
          >
            <option value="" disabled>{t('selectOption')}</option>
            <option value="Key box at the entrance">{t('keyBox')}</option>
            <option value="Concierge">{t('concierge')}</option>
            <option value="Hand delivered">{t('handDelivered')}</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('accessCodeLabel')}</label>
          <input
            type="text"
            value={data.accessCode}
            onChange={(e) => updateData({ accessCode: e.target.value })}
            placeholder={t('accessCodePlaceholder')}
            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('instructionsLabel')}</label>
          <textarea
            value={data.instructions}
            onChange={(e) => updateData({ instructions: e.target.value })}
            placeholder={t('instructionsPlaceholder')}
            className="w-full h-32 bg-white border border-gray-100 rounded-xl p-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">Check-in time</label>
          <input
            type="text"
            value={data.checkInTime}
            onChange={(e) => updateData({ checkInTime: e.target.value })}
            placeholder="e.g. 10:00 AM"
            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">Check-out time</label>
          <input
            type="text"
            value={data.checkOutTime}
            onChange={(e) => updateData({ checkOutTime: e.target.value })}
            placeholder="e.g. 04:00 PM"
            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => router.push('/dashboard/housing/create/step-3')}
            className="h-12 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors shadow-sm"
          >
            {c('back')}
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 h-12 bg-black hover:bg-gray-900 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            {c('continue')}
          </button>
        </div>

      </div>
    </div>
  );
}
