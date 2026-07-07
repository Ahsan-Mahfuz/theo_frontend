'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Tick02Icon, Calendar01Icon, Time02Icon, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useScheduleContext } from '../ScheduleContext';
import { useGetAccommodationByIdQuery } from '@/store/api/accommodationApi';
import { useGetAccommodationCleanersQuery } from '@/store/api/assignmentApi';
import type { CleanerAssignment, Housekeeper } from '@/store/types';
import { computeSchedulePrice, formatEuro } from '@/lib/pricing';

export default function ScheduleSuccessPage() {
  const router = useRouter();
  const t = useTranslations('Schedule');
  const c = useTranslations('Common');
  const { data } = useScheduleContext();

  const { data: property } = useGetAccommodationByIdQuery(data.propertyId ?? '', {
    skip: !data.propertyId,
  });

  const { data: cleaners } = useGetAccommodationCleanersQuery(data.propertyId ?? '', {
    skip: !data.propertyId,
  });

  const accepted = (cleaners ?? []).filter((c) => c.status === 'accepted');
  const chosen: CleanerAssignment | undefined =
    accepted.find((c) => {
      const cl = typeof c.cleaner === 'object' ? (c.cleaner as Housekeeper) : null;
      return cl?._id === data.primaryCleanerId;
    }) ||
    accepted.find((c) => c.role === 'primary') ||
    accepted[0];
  const chosenCleaner =
    chosen && typeof chosen.cleaner === 'object' ? (chosen.cleaner as Housekeeper) : null;

  const price = computeSchedulePrice(chosen?.pricePerCleaning, property?.cleaningRate);
  const cleanerName = chosenCleaner
    ? chosenCleaner.name ||
      [chosenCleaner.firstName, chosenCleaner.lastName].filter(Boolean).join(' ') ||
      'the cleaner'
    : 'the cleaner';

  const handleFinish = () => {
    sessionStorage.removeItem('schedule_data');
    router.push('/dashboard');
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 py-10">

      <div className="w-full max-w-[400px] flex flex-col items-center">

        {/* Success Icon & Message */}
        <div className="w-16 h-16 rounded-full bg-[#48C79D] flex items-center justify-center mb-6 shadow-sm">
          <HugeiconsIcon icon={Tick02Icon} className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-[20px] font-bold text-gray-900 mb-2 text-center">{t('scheduleCreated')}</h2>
        <p className="text-[12px] text-gray-500 text-center mb-8 max-w-[280px]">
          {t('scheduleCreatedNote')}
        </p>

        <div className="w-full flex flex-col gap-1 mb-8">
           <h3 className="text-[13px] font-bold text-gray-900 mb-1">{t('pendingAcceptance')}</h3>
           <p className="text-[12px] text-gray-500">{t('awaitingConfirmation', { name: cleanerName })}</p>
        </div>

        {/* Summary */}
        <div className="w-full flex flex-col mb-8">
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-4">{t('summaryLabel')}</span>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-gray-400" />
                 <span className="text-[12px] text-gray-500">{t('date')}</span>
               </div>
               <span className="text-[12px] font-medium text-gray-900">{data.date ? new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : '---'}</span>
            </div>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <HugeiconsIcon icon={Time02Icon} className="w-4 h-4 text-gray-400" />
                 <span className="text-[12px] text-gray-500">{t('checkOutCheckIn')}</span>
               </div>
               <span className="text-[12px] font-medium text-gray-900">{data.checkOutTime || '---'} → {data.checkInTime || '---'}</span>
            </div>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <HugeiconsIcon icon={UserIcon} className="w-4 h-4 text-gray-400" />
                 <span className="text-[12px] text-gray-500">{t('housekeeper')}</span>
               </div>
               <span className="text-[12px] font-medium text-gray-900">{cleanerName}</span>
            </div>
          </div>
        </div>

        {/* Price Details */}
        <div className="w-full flex flex-col mb-10">
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-4">{t('priceDetailsLabel')}</span>
          <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 mb-4">
            <div className="flex justify-between items-center">
               <span className="text-[12px] text-gray-500">{t('cleaningService')}</span>
               <span className="text-[12px] font-medium text-gray-900">{formatEuro(price.total)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[13px] font-bold text-gray-900">{t('total')}</span>
             <span className="text-[13px] font-bold text-gray-900">{formatEuro(price.total)}</span>
          </div>
        </div>

        <button
          onClick={handleFinish}
          className="w-full h-12 bg-black text-white rounded-xl text-[14px] font-medium hover:bg-gray-800 transition-colors"
        >
          {c('backToHome')}
        </button>

      </div>
    </div>
  );
}
