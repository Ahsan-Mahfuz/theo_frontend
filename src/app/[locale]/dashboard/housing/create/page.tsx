'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { StepIndicator } from './components/StepIndicator';
import { useCreateHousing } from './CreateHousingContext';

type Errors = Partial<Record<'name' | 'type' | 'address' | 'city' | 'zip', string>>;

export default function Step1Page() {
  const t = useTranslations('Housing.step1');
  const c = useTranslations('Common');
  const router = useRouter();
  const { data, updateData } = useCreateHousing();
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): Errors => {
    const e: Errors = {};
    if (!data.name.trim()) e.name = t('errors.name');
    if (!data.type) e.type = t('errors.type');
    if (!data.address.trim()) e.address = t('errors.address');
    else if (data.address.trim().length < 5) e.address = t('errors.addressShort');
    if (!data.city) e.city = t('errors.city');
    if (!data.zip.trim()) e.zip = t('errors.zip');
    return e;
  };

  const handleContinue = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    router.push('/dashboard/housing/create/step-2');
  };

  const inputClass = (hasError?: string) =>
    `w-full h-12 bg-white border rounded-xl px-4 text-[13px] text-gray-900 focus:outline-none focus:ring-1 transition-all shadow-sm ${
      hasError
        ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
        : 'border-gray-100 focus:border-[#0084FF] focus:ring-[#0084FF]'
    }`;

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
            onChange={(e) => { updateData({ name: e.target.value }); setErrors((p) => ({ ...p, name: undefined })); }}
            placeholder={t('namePlaceholder')}
            className={inputClass(errors.name)}
          />
          {errors.name && <span className="text-[11px] text-red-500">{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('typeLabel')}</label>
          <select
            value={data.type}
            onChange={(e) => { updateData({ type: e.target.value }); setErrors((p) => ({ ...p, type: undefined })); }}
            className={`${inputClass(errors.type)} cursor-pointer`}
          >
            <option value="" disabled>{t('selectType')}</option>
            <option value="Apartment">{t('typeApartment')}</option>
            <option value="House">{t('typeHouse')}</option>
            <option value="Studio">{t('typeStudio')}</option>
            <option value="Other">{t('typeOther')}</option>
          </select>
          {errors.type && <span className="text-[11px] text-red-500">{errors.type}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('addressLabel')}</label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => { updateData({ address: e.target.value }); setErrors((p) => ({ ...p, address: undefined })); }}
            placeholder={t('addressPlaceholder')}
            className={inputClass(errors.address)}
          />
          {errors.address && <span className="text-[11px] text-red-500">{errors.address}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('cityLabel')}</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => { updateData({ city: e.target.value }); setErrors((p) => ({ ...p, city: undefined })); }}
            placeholder={t('cityPlaceholder')}
            className={inputClass(errors.city)}
          />
          {errors.city && <span className="text-[11px] text-red-500">{errors.city}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-gray-900">{t('zipLabel')}</label>
          <input
            type="text"
            value={data.zip}
            onChange={(e) => { updateData({ zip: e.target.value }); setErrors((p) => ({ ...p, zip: undefined })); }}
            placeholder={t('zipPlaceholder')}
            className={inputClass(errors.zip)}
          />
          {errors.zip && <span className="text-[11px] text-red-500">{errors.zip}</span>}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => router.push('/dashboard/housing')}
            className="h-12 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors shadow-sm"
          >
            {c('cancel')}
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
