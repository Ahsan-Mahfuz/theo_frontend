'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Location01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useScheduleContext } from './ScheduleContext';
import { useGetPlanningQuery } from '@/store/api/accommodationApi';
import { resolveAssetUrl } from '@/lib/config';
import { getApiErrorMessage } from '@/lib/apiError';
import { AppImage } from '@/components/ui/app-image';
import { Skeleton } from '@/components/ui/skeleton';

const FALLBACK_ROOM =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500';

export default function SelectPropertyPage() {
  const router = useRouter();
  const t = useTranslations('Schedule');
  const c = useTranslations('Common');
  const { data, updateData } = useScheduleContext();

  // Only accommodations that already have an accepted cleaner can be scheduled,
  // so pull them from the planning endpoint filtered to assigned cleaners.
  const { data: accommodations, isLoading, isError, error } =
    useGetPlanningQuery({ limit: 50, isCleanerAssigned: true });

  const list = accommodations?.data ?? [];

  const handleContinue = () => {
    if (data.propertyId) {
      router.push('/dashboard/schedule/details');
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-[18px] font-bold text-gray-900 mb-2">{t('chooseProperty')}</h2>
        <p className="text-[13px] text-gray-500">{t('choosePropertySubtitle')}</p>
      </div>

      <div className="w-full max-w-[500px] flex flex-col gap-3 mb-6 h-[50vh] overflow-y-auto pr-1">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-full rounded-2xl border border-gray-100 bg-white p-3 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Skeleton className="w-[100px] h-[100px] rounded-xl shrink-0" />
                <div className="flex flex-col gap-2 py-1">
                  <Skeleton className="h-3.5 w-32 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-3 w-12 rounded" />
                </div>
              </div>
              <Skeleton className="w-5 h-5 rounded-full shrink-0" />
            </div>
          ))}

        {isError && !isLoading && (
          <div className="w-full py-16 flex items-center justify-center text-[13px] text-red-500 text-center">
            {getApiErrorMessage(error)}
          </div>
        )}

        {!isLoading && !isError && list.length === 0 && (
          <div className="w-full py-16 flex items-center justify-center text-[13px] text-gray-400">
            {t('noProperties')}
          </div>
        )}

        {!isLoading && !isError && list.map((acc) => {
          const isSelected = data.propertyId === acc._id;
          const photo = acc.photos?.[0] ? resolveAssetUrl(acc.photos[0]) : FALLBACK_ROOM;

          return (
            <div
              key={acc._id}
              onClick={() => updateData({ propertyId: acc._id })}
              className={`w-full rounded-2xl border p-3 flex items-start justify-between cursor-pointer transition-colors ${isSelected ? 'border-gray-400 bg-[#FAFAFA]' : 'border-gray-100 bg-white hover:border-gray-300'}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-[100px] h-[100px] rounded-xl overflow-hidden relative bg-gray-200 shrink-0">
                  <AppImage src={photo} alt={acc.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-gray-900 mb-1">{acc.name}</span>
                  <div className="flex items-center gap-1.5 mb-2">
                    <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[11px] text-gray-500">{acc.city}</span>
                  </div>
                  {typeof acc.cleaningRate === 'number' && (
                    <span className="text-[11px] font-semibold text-gray-900 mb-2">{acc.cleaningRate} €</span>
                  )}
                </div>
              </div>

              {/* Custom Radio Button */}
              <div className="pr-2 pt-2 shrink-0">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#48C79D]' : 'border-gray-200'}`}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#48C79D]"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-[500px] bg-[#F8F9FA] rounded-xl p-4 mb-6">
        <h4 className="text-[12px] font-bold text-gray-900 mb-1">{t('cleanerNotified')}</h4>
        <p className="text-[11px] text-gray-500 leading-snug">
          {t('cleanerNotifiedDesc')}
        </p>
      </div>

      <button
        disabled={!data.propertyId}
        onClick={handleContinue}
        className={`w-full max-w-[500px] h-12 rounded-xl text-[14px] font-medium transition-colors ${data.propertyId ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        {c('add')}
      </button>
    </div>
  );
}
