'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Location01Icon, Calendar01Icon, Time02Icon, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useScheduleContext } from '../ScheduleContext';
import { useGetAccommodationByIdQuery } from '@/store/api/accommodationApi';
import { useGetAccommodationCleanersQuery } from '@/store/api/assignmentApi';
import { useCreateScheduleMutation } from '@/store/api/scheduleApi';
import type { Housekeeper } from '@/store/types';
import { resolveAssetUrl } from '@/lib/config';
import { getApiErrorMessage } from '@/lib/apiError';
import { AppImage } from '@/components/ui/app-image';

const FALLBACK_ROOM =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500';

export default function SchedulePaymentPage() {
  const router = useRouter();
  const t = useTranslations('Schedule');
  const { data, updateData } = useScheduleContext();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [createSchedule, { isLoading }] = useCreateScheduleMutation();

  const { data: property } = useGetAccommodationByIdQuery(data.propertyId ?? '', {
    skip: !data.propertyId,
  });

  const { data: cleaners } = useGetAccommodationCleanersQuery(data.propertyId ?? '', {
    skip: !data.propertyId,
  });

  const propertyPhoto = property?.photos?.[0]
    ? resolveAssetUrl(property.photos[0])
    : FALLBACK_ROOM;
  const propertyName = property?.name || 'Accommodation';
  const propertyAddress = property
    ? [property.address, [property.zipCode, property.city].filter(Boolean).join(' ')]
        .filter(Boolean)
        .join(', ')
    : '';

  const chosen = cleaners?.find((c) => {
    const cl = typeof c.cleaner === 'object' ? (c.cleaner as Housekeeper) : null;
    return cl?._id === data.primaryCleanerId;
  });
  const chosenCleaner =
    chosen && typeof chosen.cleaner === 'object' ? (chosen.cleaner as Housekeeper) : null;
  const cleanerName = chosenCleaner
    ? chosenCleaner.name ||
      [chosenCleaner.firstName, chosenCleaner.lastName].filter(Boolean).join(' ') ||
      'Cleaner'
    : '---';

  const handleConfirm = async () => {
    setErrorMsg(null);
    if (!data.propertyId || !data.primaryCleanerId) {
      setErrorMsg(t('selectPropertyAndCleaner'));
      return;
    }
    try {
      await createSchedule({
        accommodationId: data.propertyId,
        cleanerId: data.primaryCleanerId,
        date: data.date,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
      }).unwrap();
      router.push('/dashboard/schedule/success');
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err));
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">

      <div className="w-full max-w-[500px] flex flex-col gap-8">

        {/* Top Header Block */}
        <div className="flex items-center gap-4 bg-white">
          <div className="w-[100px] h-[100px] rounded-xl overflow-hidden relative bg-gray-200 shrink-0">
            <AppImage src={propertyPhoto} alt={propertyName} fill className="object-cover" />
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wider">{t('accommodationLabel')}</span>
             <span className="text-[14px] font-bold text-gray-900 mb-1">{propertyName}</span>
             <div className="flex items-start gap-1.5 mb-2">
               <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
               <span className="text-[12px] text-gray-500 leading-snug">{propertyAddress || '—'}</span>
             </div>
          </div>
        </div>

        {/* Info List */}
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

        {/* Price Details */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-4">{t('priceDetailsLabel')}</span>
          <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 mb-4">
            <div className="flex justify-between items-center">
               <span className="text-[12px] text-gray-500">{t('cleaningService')}</span>
               <span className="text-[12px] font-medium text-gray-900">55,00 €</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-[12px] text-gray-500">{t('serviceFee')}</span>
               <span className="text-[12px] font-medium text-gray-900">3,00 €</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[13px] font-bold text-gray-900">{t('totalToPay')}</span>
             <span className="text-[13px] font-bold text-gray-900">58,00 €</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-4">{t('paymentMethodLabel')}</span>

          <div className="flex flex-col gap-2">
            {[
              { id: 'card', name: t('card'), icon: '💳' },
              { id: 'apple_pay', name: 'Apple Pay', icon: 'Pay' },
              { id: 'google_pay', name: 'Google Pay', icon: 'GPay' }
            ].map((method) => (
              <div
                key={method.id}
                onClick={() => updateData({ paymentMethod: method.id })}
                className="w-full h-14 bg-[#FAFAFA] rounded-xl px-4 flex items-center justify-between cursor-pointer border border-transparent hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.paymentMethod === method.id ? 'border-[#0084FF]' : 'border-gray-300'}`}>
                    {data.paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-[#0084FF]"></div>}
                  </div>
                  <span className="text-[14px] font-medium text-gray-900">{method.icon} <span className="ml-2">{method.name}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="text-[12px] text-red-500 text-center">{errorMsg}</div>
        )}

        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full h-12 bg-[#0084FF] text-white rounded-xl text-[14px] font-medium hover:bg-blue-600 transition-colors mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? t('processing') : t('confirmAndPay')}
        </button>

      </div>
    </div>
  );
}
