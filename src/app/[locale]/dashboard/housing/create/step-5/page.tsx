'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '../components/StepIndicator';
import { useCreateHousing } from '../CreateHousingContext';
import { useTranslations } from 'next-intl';
import { useCreateAccommodationMutation } from '@/store/api/accommodationApi';
import { getApiErrorMessage } from '@/lib/apiError';
import { AppImage } from '@/components/ui/app-image';

// "3 rooms (T3)" → 3 ; falls back to 1.
const parseRooms = (v: string): number => {
  const m = v.match(/\d+/);
  return m ? Number(m[0]) : 1;
};
// "55.00 €" / "55,00 €" → 55
const parseAmount = (v: string): number => {
  const cleaned = v.replace(/[^\d.,]/g, '').replace(',', '.');
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
};

export default function Step5Page() {
  const t = useTranslations('Housing.step5');
  const c = useTranslations('Common');
  const router = useRouter();
  const { data } = useCreateHousing();
  const [createAccommodation, { isLoading }] = useCreateAccommodationMutation();
  const [error, setError] = useState('');

  const handleContinue = async () => {
    setError('');

    // Backend requires these — surface them early instead of a 400.
    if (
      !data.name.trim() ||
      !data.type ||
      data.address.trim().length < 5 ||
      !data.city ||
      !data.zip.trim() ||
      !data.rooms ||
      !data.surface
    ) {
      setError(t('validationError'));
      return;
    }

    const fd = new FormData();
    fd.append('name', data.name.trim());
    fd.append('accommodationType', data.type);
    fd.append('address', data.address.trim());
    fd.append('city', data.city);
    fd.append('zipCode', data.zip.trim());
    if (data.floor) fd.append('floor', data.floor);
    if (data.doorCode) fd.append('doorCode', data.doorCode);
    fd.append('numberOfRooms', String(parseRooms(data.rooms)));
    fd.append('surface', String(parseAmount(data.surface)));
    fd.append('hasElevator', String(data.elevator === 'Yes'));
    fd.append('cleaningRate', String(parseAmount(data.cleaningRate)));
    if (data.notes) fd.append('notes', data.notes);
    if (data.keys) fd.append('keys', data.keys);
    if (data.accessCode) fd.append('accessCode', data.accessCode);
    if (data.instructions) fd.append('instructions', data.instructions);
    if (data.photoFile) fd.append('photos', data.photoFile);

    try {
      await createAccommodation(fd).unwrap();
      router.push('/dashboard/housing');
    } catch (err) {
      setError(getApiErrorMessage(err, t('createError')));
    }
  };

  const handleEdit = () => {
    router.push('/dashboard/housing/create');
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      <StepIndicator currentStep={5} />
      
      <div className="text-center mb-8">
        <h2 className="text-[16px] font-bold text-gray-900 mb-1">{t('heading')}</h2>
        <p className="text-[13px] text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-4">
        
        {/* General Info */}
        <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm">
          <h3 className="text-[13px] font-bold text-gray-900 mb-3">{t('generalInfo')}</h3>
          <div className="flex flex-col gap-2">
            <p className="text-[13px] text-gray-600">{data.name || 'Appartement T3 - City Center'}</p>
            <p className="text-[13px] text-gray-600">{data.address || '15 Rue de la Paix, 75002 Paris'}</p>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm">
          <h3 className="text-[13px] font-bold text-gray-900 mb-3">{t('detailsTitle')}</h3>
          <div className="flex flex-col gap-2">
            <p className="text-[13px] text-gray-600">{data.rooms || '3 rooms (T3)'}</p>
            <p className="text-[13px] text-gray-600">{data.surface || '65'} m²</p>
            <p className="text-[13px] text-gray-600">{data.floor || '3rd floor'}</p>
            <p className="text-[13px] text-gray-600">{data.elevator === 'Yes' ? t('withElevator') : t('noElevator')}</p>
            <p className="text-[13px] font-medium text-[#0084FF] mt-1">{t('cleaningRatePrefix')} {data.cleaningRate || '55,00 €'}</p>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm">
          <h3 className="text-[13px] font-bold text-gray-900 mb-3">{t('photos')}</h3>
          <div className="w-[120px] h-[80px] rounded-xl overflow-hidden relative border border-gray-100">
            <AppImage
              src={data.photo || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=300'}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Practical info */}
        <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm mb-4">
          <h3 className="text-[13px] font-bold text-gray-900 mb-3">{t('practicalInfo')}</h3>
          <div className="flex flex-col gap-3">
            <p className="text-[13px] text-gray-600"><span className="text-gray-500">{t('keys')}</span> {data.keys || 'Key box at the entrance'}</p>
            <p className="text-[13px] text-gray-600"><span className="text-gray-500">{t('accessCode')}</span> {data.accessCode || '—'}</p>
            <p className="text-[13px] text-gray-600 leading-relaxed"><span className="text-gray-500">{t('instructions')}</span> {data.instructions || 'Please close the windows after cleaning.'}</p>
            <p className="text-[13px] text-gray-600 mt-1"><span className="text-gray-500">{t('frequency')}</span> {t('everyWeek')}</p>
          </div>
        </div>

        {error && (
          <p className="text-[12px] text-red-500 text-center">{error}</p>
        )}

        <button
          onClick={handleEdit}
          disabled={isLoading}
          className="w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-medium rounded-xl transition-colors disabled:opacity-50"
        >
          {c('edit')}
        </button>
        <button
          onClick={handleContinue}
          disabled={isLoading}
          className={`w-full h-12 text-white font-medium rounded-xl transition-colors shadow-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-900'}`}
        >
          {isLoading ? t('creating') : t('confirmCreate')}
        </button>


      </div>
    </div>
  );
}
