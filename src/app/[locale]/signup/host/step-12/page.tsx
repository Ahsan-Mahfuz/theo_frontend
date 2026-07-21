'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSignupContext } from '../SignupContext';
import { useTranslations } from 'next-intl';

export default function Step12Page() {
  const router = useRouter();
  const t = useTranslations('Signup');
  const c = useTranslations('Common');
  const { data } = useSignupContext();

  const handleContinue = () => {
    router.push('/signup/host/step-13');
  };

  const renderSummaryRow = (label: string, value: string) => (
    <div className="w-full flex flex-col gap-1.5 mb-4">
      <label className="text-[12px] text-gray-800 font-medium">{label}</label>
      <div className="flex items-center justify-between w-full bg-white border border-gray-200 h-11 rounded-lg px-3">
        <span className="text-[13px] text-gray-500 truncate mr-2">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col items-center gap-2 text-center w-full mb-4">
        <h2 className="text-[20px] text-gray-900 font-semibold">{t('step12.heading')}</h2>
        <p className="text-[13px] text-gray-500 max-w-[300px]">
          {t('step12.subtitle')}
        </p>
      </div>

      <div className="w-full flex flex-col gap-1">
        {renderSummaryRow(t('step12.propertyName'), data.accommodationName || 'Appartement Paris 11')}
        {renderSummaryRow(t('step12.address'), data.address1 || '11 Rue de la Paix, 75011 Paris')}
        {renderSummaryRow(t('step12.type'), data.propertyType)}
        {renderSummaryRow(t('step12.bedrooms'), t('step12.bedroomsValue', { count: data.bedrooms }))}
        {renderSummaryRow(t('step12.bathrooms'), t('step12.bathroomsValue', { count: data.bathrooms1 }))}
        {renderSummaryRow(t('step12.timeSlot'), t('step12.timeSlotValue', { start: data.checkInTime, end: data.checkOutTime }))}
        {renderSummaryRow(t('step12.averageDuration'), data.averageDuration)}
        {renderSummaryRow(t('step12.proposedRate'), t('step12.rateValue', { rate: data.proposedRate }))}
      </div>
      <button
        onClick={() => router.push('/signup/host/step-9')}
        className="w-full h-11 rounded-lg text-[#0084FF] border border-[#0084FF] hover:bg-gray-50 transition-colors font-medium text-[14px] mt-4"
      >
        {c('edit')}
      </button>

      <button 
        onClick={handleContinue}
        className="w-full h-11 rounded-lg text-white bg-[#0084FF] hover:bg-blue-600 transition-colors font-medium text-[14px] mt-4"
      >
        {c('continue')}
      </button>
    </div>
  );
}
