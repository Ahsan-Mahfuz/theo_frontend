'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { StepIndicator } from './components/StepIndicator';
import { useCreateHousing } from './CreateHousingContext';

export default function Step1Page() {
  const t = useTranslations('Housing.step1');
  const c = useTranslations('Common');
  const router = useRouter();
  const { data, updateData } = useCreateHousing();

  const handleContinue = () => {
    router.push('/dashboard/housing/create/step-2');
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      <StepIndicator currentStep={1} />
      
      <div className="text-center mb-8">
        <h2 className="text-[16px] font-bold text-gray-900 mb-1">{t('heading')}</h2>
        <p className="text-[13px] text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('nameLabel')}</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder={t('namePlaceholder')}
            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('typeLabel')}</label>
          <select
            value={data.type}
            onChange={(e) => updateData({ type: e.target.value })}
            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm cursor-pointer"
          >
            <option value="" disabled>{t('selectType')}</option>
            <option value="Apartment">{t('typeApartment')}</option>
            <option value="House">{t('typeHouse')}</option>
            <option value="Studio">{t('typeStudio')}</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('addressLabel')}</label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
            placeholder={t('addressPlaceholder')}
            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('cityLabel')}</label>
          <select
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm cursor-pointer"
          >
            <option value="" disabled>{t('selectCity')}</option>
            <option value="Paris">Paris</option>
            <option value="Lyon">Lyon</option>
            <option value="Marseille">Marseille</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('zipLabel')}</label>
          <input
            type="text"
            value={data.zip}
            onChange={(e) => updateData({ zip: e.target.value })}
            placeholder={t('zipPlaceholder')}
            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all shadow-sm"
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
