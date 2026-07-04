'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { StepIndicator } from '../components/StepIndicator';
import { useCreateHousing } from '../CreateHousingContext';

export default function Step2Page() {
  const t = useTranslations('Housing.step2');
  const c = useTranslations('Common');
  const router = useRouter();
  const { data, updateData } = useCreateHousing();

  const handleContinue = () => {
    router.push('/dashboard/housing/create/step-3');
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      <StepIndicator currentStep={2} />
      
      <div className="text-center mb-8">
        <h2 className="text-[16px] font-bold text-gray-900 mb-1">{t('heading')}</h2>
        <p className="text-[13px] text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-6">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-gray-900">{t('floorLabel')}</label>
            <input
              type="text"
              value={data.floor}
              onChange={(e) => updateData({ floor: e.target.value })}
              placeholder={t('floorPlaceholder')}
              className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-gray-900">{t('doorCodeLabel')}</label>
            <input
              type="text"
              value={data.doorCode}
              onChange={(e) => updateData({ doorCode: e.target.value })}
              placeholder={t('doorCodePlaceholder')}
              className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('roomsLabel')}</label>
          <select
            value={data.rooms}
            onChange={(e) => updateData({ rooms: e.target.value })}
            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm cursor-pointer"
          >
            <option value="" disabled>{t('selectRooms')}</option>
            <option value="1 room (T1)">1 room (T1)</option>
            <option value="2 rooms (T2)">2 rooms (T2)</option>
            <option value="3 rooms (T3)">3 rooms (T3)</option>
            <option value="4+ rooms (T4+)">4+ rooms (T4+)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('surfaceLabel')}</label>
          <div className="relative">
            <input
              type="text"
              value={data.surface}
              onChange={(e) => updateData({ surface: e.target.value })}
              placeholder={t('surfacePlaceholder')}
              className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 pr-10 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-gray-400">m²</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('elevatorLabel')}</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => updateData({ elevator: 'Yes' })}
              className={`h-12 rounded-xl border text-[13px] font-medium transition-colors shadow-sm ${data.elevator === 'Yes' ? 'border-[#0084FF] text-[#0084FF] bg-[#F5F9FF]' : 'border-gray-100 text-gray-600 bg-white hover:bg-gray-50'}`}
            >
              {c('yes')}
            </button>
            <button
              onClick={() => updateData({ elevator: 'No' })}
              className={`h-12 rounded-xl border text-[13px] font-medium transition-colors shadow-sm ${data.elevator === 'No' ? 'border-[#0084FF] text-[#0084FF] bg-[#F5F9FF]' : 'border-gray-100 text-gray-600 bg-white hover:bg-gray-50'}`}
            >
              {c('no')}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('cleaningRateLabel')}</label>
          <input
            type="text"
            value={data.cleaningRate}
            onChange={(e) => updateData({ cleaningRate: e.target.value })}
            placeholder={t('cleaningRatePlaceholder')}
            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm"
          />
          <span className="text-[11px] text-gray-500 italic">{t('cleaningRateHint')}</span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('notesLabel')}</label>
          <textarea
            value={data.notes}
            onChange={(e) => updateData({ notes: e.target.value })}
            placeholder={t('notesPlaceholder')}
            className="w-full h-24 bg-white border border-gray-100 rounded-xl p-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm resize-none"
          />
        </div>

        <button 
          onClick={handleContinue}
          className="w-full h-12 bg-black hover:bg-gray-900 text-white font-medium rounded-xl mt-4 transition-colors shadow-sm"
        >
          {c('continue')}
        </button>

      </div>
    </div>
  );
}
