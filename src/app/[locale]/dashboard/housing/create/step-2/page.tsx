'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { StepIndicator } from '../components/StepIndicator';
import { useCreateHousing } from '../CreateHousingContext';

type Errors = Partial<Record<'rooms' | 'surface', string>>;

export default function Step2Page() {
  const t = useTranslations('Housing.step2');
  const c = useTranslations('Common');
  const router = useRouter();
  const { data, updateData } = useCreateHousing();
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): Errors => {
    const e: Errors = {};
    if (!data.rooms) e.rooms = t('errors.rooms');
    const surfaceNum = Number(String(data.surface).replace(',', '.'));
    if (!String(data.surface).trim()) e.surface = t('errors.surface');
    else if (!Number.isFinite(surfaceNum) || surfaceNum <= 0) e.surface = t('errors.surfaceInvalid');
    return e;
  };

  const handleContinue = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    router.push('/dashboard/housing/create/step-3');
  };

  const inputClass = (hasError?: string) =>
    `w-full h-12 bg-white border rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:ring-1 transition-all shadow-sm ${
      hasError
        ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
        : 'border-gray-100 focus:border-[#0084FF] focus:ring-[#0084FF]'
    }`;

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
              className={inputClass()}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-gray-900">{t('doorCodeLabel')}</label>
            <input
              type="text"
              value={data.doorCode}
              onChange={(e) => updateData({ doorCode: e.target.value })}
              placeholder={t('doorCodePlaceholder')}
              className={inputClass()}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('roomsLabel')}</label>
          <select
            value={data.rooms}
            onChange={(e) => { updateData({ rooms: e.target.value }); setErrors((p) => ({ ...p, rooms: undefined })); }}
            className={`${inputClass(errors.rooms)} cursor-pointer`}
          >
            <option value="" disabled>{t('selectRooms')}</option>
            <option value="1 room (T1)">1 room (T1)</option>
            <option value="2 rooms (T2)">2 rooms (T2)</option>
            <option value="3 rooms (T3)">3 rooms (T3)</option>
            <option value="4+ rooms (T4+)">4+ rooms (T4+)</option>
          </select>
          {errors.rooms && <span className="text-[11px] text-red-500">{errors.rooms}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('surfaceLabel')}</label>
          <div className="relative">
            <input
              type="text"
              value={data.surface}
              onChange={(e) => { updateData({ surface: e.target.value }); setErrors((p) => ({ ...p, surface: undefined })); }}
              placeholder={t('surfacePlaceholder')}
              className={`${inputClass(errors.surface)} pr-10`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-gray-400">m²</span>
          </div>
          {errors.surface && <span className="text-[11px] text-red-500">{errors.surface}</span>}
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
            className={inputClass()}
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

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => router.push('/dashboard/housing/create')}
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
