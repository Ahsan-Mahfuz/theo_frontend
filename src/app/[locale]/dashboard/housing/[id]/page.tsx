'use client';

import React from 'react';
import Link from 'next/link';
import {
  Location01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { useGetAccommodationByIdQuery } from '@/store/api/accommodationApi';
import { resolveAssetUrl } from '@/lib/config';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const FALLBACK_ROOM = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500';
const avatarFor = (name: string) => `https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=${encodeURIComponent(name || 'Cleaner')}`;

// Colour styles for an assignment status pill.
const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-[#FFF7E6] text-[#D48806]',
  accepted: 'bg-[#E5F9F1] text-[#48C79D]',
  refused: 'bg-[#FFF0F0] text-[#FF4D4F]',
};

export default function AccommodationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const t = useTranslations('Housing.details');
  const c = useTranslations('Common');
  const { data: accommodation, isLoading } = useGetAccommodationByIdQuery(id);

  if (isLoading || !accommodation) {
    return (
      <main className="w-full px-8 py-10 animate-in fade-in duration-500 mx-auto">
        <h1 className="text-[32px] font-bold text-gray-900 mb-10">{t('title')}</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Accommodation Card */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-4">
              <Skeleton className="w-full aspect-[4/3] rounded-[16px]" />
              <div className="flex flex-col px-2 pb-2 gap-2">
                <Skeleton className="h-4 w-2/3 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
          </div>
          {/* Right Column - Details */}
          <div className="flex-1">
            <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 p-8 lg:p-10 flex flex-col">
              <Skeleton className="w-full h-[300px] lg:h-[400px] rounded-[20px] mb-10" />
              <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-1/2 rounded mb-2" />
                  <Skeleton className="h-3 w-2/3 rounded mb-6" />
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-3 w-24 rounded" />
                        <Skeleton className="h-3 w-16 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <Skeleton className="h-3 w-32 rounded mb-3" />
                  <Skeleton className="h-16 w-full rounded-[12px]" />
                  <SkeletonText lines={3} className="mt-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const coverImage = resolveAssetUrl(accommodation.photos?.[0]) || FALLBACK_ROOM;
  const fullAddress = `${accommodation.address}, ${accommodation.city}`;

  const cleaners = (accommodation.assignedCleaners ?? []) as any[];
  const cleanerName = (cl: any) =>
    cl?.name || `${cl?.firstName ?? ''} ${cl?.lastName ?? ''}`.trim() || t('cleaner');
  const statusLabel = (status: string) =>
    status === 'accepted'
      ? t('statusAccepted')
      : status === 'refused'
        ? t('statusRefused')
        : t('statusPending');

  return (
    <main className="w-full px-8 py-10 animate-in fade-in duration-500 mx-auto">

      {/* Header */}
      <h1 className="text-[32px] font-bold text-gray-900 mb-10">Accommodation Details</h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left Column - Accommodation Card */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-4">
            <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden relative">
              <AppImage src={coverImage} alt={accommodation.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col px-2 pb-2">
              <h3 className="text-[16px] font-bold text-gray-900 mb-1">{accommodation.name}</h3>
              <div className="flex items-center gap-1.5 mb-6">
                <HugeiconsIcon icon={Location01Icon} className="w-[14px] h-[14px] text-gray-400" />
                <span className="text-[13px] text-gray-500">{fullAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex-1">
          <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 p-8 lg:p-10 flex flex-col">

            {/* Cover Image */}
            <div className="w-full h-[300px] lg:h-[400px] rounded-[20px] overflow-hidden relative mb-10">
              <AppImage src={coverImage} alt="Interior" fill className="object-cover" />
            </div>

            <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

              {/* Left Side of Right Column */}
              <div className="flex-1 flex flex-col">
                <h2 className="text-[16px] font-bold text-gray-900 mb-1">{accommodation.name}</h2>
                <div className="flex items-center gap-1.5 mb-10">
                  <HugeiconsIcon icon={Location01Icon} className="w-[14px] h-[14px] text-gray-400" />
                  <span className="text-[12px] text-gray-500">{fullAddress}</span>
                </div>

                {/* Specs */}
                <div className="flex flex-col gap-4 mb-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-400">{t('accommodationType')}</span>
                    <span className="text-[12px] font-medium text-gray-900">{accommodation.accommodationType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-400">{t('bedrooms')}</span>
                    <span className="text-[12px] font-medium text-gray-900">{t('bedroomsCount', { count: accommodation.numberOfRooms })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-400">{t('surface')}</span>
                    <span className="text-[12px] font-medium text-gray-900">{accommodation.surface}m²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-400">{t('floor')}</span>
                    <span className="text-[12px] font-medium text-gray-900">{accommodation.floor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-400">{t('elevator')}</span>
                    <span className="text-[12px] font-medium text-gray-900">{accommodation.hasElevator ? c('yes') : c('no')}</span>
                  </div>
                </div>

                {/* Cleaner Block — all assigned cleaners with their request status */}
                {cleaners.length > 0 ? (
                  <div className="flex flex-col mb-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('cleaners')}</span>
                      <Link href={`/dashboard/housing/${id}/cleaners`}>
                        <button className="h-[30px] px-3 rounded-lg bg-black text-[11px] font-medium text-white hover:opacity-80 transition-opacity">
                          {t('manage')}
                        </button>
                      </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                      {cleaners.map((row) => (
                        <div key={row.assignmentId} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0 ring-1 ring-gray-100">
                              <AppImage
                                src={resolveAssetUrl(row.cleaner?.profileImage) || avatarFor(cleanerName(row.cleaner))}
                                alt={cleanerName(row.cleaner)}
                                fill
                                className="object-cover"
                                placeholderSrc={AVATAR_PLACEHOLDER}
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[13px] font-bold text-gray-900 truncate">{cleanerName(row.cleaner)}</span>
                              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                                {row.role === 'primary' ? t('primary') : t('substitutes')}
                              </span>
                            </div>
                          </div>
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${STATUS_STYLE[row.status] ?? STATUS_STYLE.pending}`}>
                            {statusLabel(row.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link href={`/dashboard/add-housekeeper?source=cleaners&housingId=${id}`} className="w-full mt-4">
                      <button className="w-full h-10 rounded-xl bg-[#F4F4F5] text-[12px] font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                        {t('addCleaner')}
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col mb-10">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('cleaner')}</span>
                    <Link href={`/dashboard/add-housekeeper?source=cleaners&housingId=${id}`} className="w-full">
                      <button className="w-full h-10 rounded-xl bg-[#F4F4F5] text-[12px] font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                        {t('assignCleaner')}
                      </button>
                    </Link>
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('cleaningRate')}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-400">{t('cleaningService')}</span>
                    <span className="text-[12px] font-medium text-gray-900">{accommodation.cleaningRate},00 €</span>
                  </div>
                </div>

              </div>

              {/* Right Side of Right Column */}
              <div className="flex-1 flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">{t('practicalInformation')}</span>

                <div className="flex bg-[#F8F9FA] rounded-[12px] p-4 mb-4">
                  <div className="flex-1 flex flex-col border-r border-gray-200 pr-4">
                    <span className="text-[11px] text-gray-500 mb-1">{t('keyBox')}</span>
                    <span className="text-[13px] font-bold text-gray-900">{accommodation.keys ? c('yes') : c('no')}</span>
                  </div>
                  <div className="flex-1 flex flex-col pl-4">
                    <span className="text-[11px] text-gray-500 mb-1">{t('keyBoxCode')}</span>
                    <span className="text-[13px] font-bold text-gray-900">{accommodation.accessCode || '-'}</span>
                  </div>
                </div>

                <div className="bg-[#F8F9FA] rounded-[12px] p-4 flex flex-col gap-2 mb-6">
                  <span className="text-[11px] text-gray-500">{t('specificInstruction')}</span>
                  <p className="text-[12px] text-gray-700 leading-relaxed">
                    {accommodation.instructions || t('noInstructions')}
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <Link href={`/dashboard/housing/${id}/edit`} className="w-full">
                    <button className="w-full h-12 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-xl hover:bg-gray-50 transition-colors">
                      {t('editInformation')}
                    </button>
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>

    </main>
  );
}
