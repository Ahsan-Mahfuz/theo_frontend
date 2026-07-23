'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Location01Icon,
  Calendar01Icon,
  Clock01Icon,
  UserCircleIcon,
  Home01Icon,
  ArrowRight01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { useGetAccommodationByIdQuery } from '@/store/api/accommodationApi';
import { useCreateScheduleMutation } from '@/store/api/scheduleApi';
import { resolveAssetUrl } from '@/lib/config';
import { formatDate as formatDateLocal, todayInput } from '@/lib/datetime';
import { getApiErrorMessage } from '@/lib/apiError';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { useOpenChat } from '@/hooks/useOpenChat';
import { computeSchedulePrice, formatEuro } from '@/lib/pricing';

import { TimePickerDropdown } from '@/components/ui/time-picker';

const avatarFor = (name: string) => `https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=${encodeURIComponent(name || 'Cleaner')}`;
const cleanerName = (c: any) => c?.name || `${c?.firstName ?? ''} ${c?.lastName ?? ''}`.trim() || 'Cleaner';
const cleanerAvatar = (c: any) => resolveAssetUrl(c?.profileImage) || avatarFor(cleanerName(c));

export default function ScheduleCleaningPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const t = useTranslations('Housing.schedule');
  const c = useTranslations('Common');

  const { data: accommodation } = useGetAccommodationByIdQuery(id);
  const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation();
  const { openChat, isOpening } = useOpenChat();

  // Default to today — a cleaning can never be scheduled in the past.
  const minDate = todayInput();
  const [date, setDate] = useState(minDate);
  // Time slots matching the accommodation's defaults
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('16:00');
  const [error, setError] = useState('');

  // Pre-fill from accommodation checkInTime and checkOutTime when loaded
  useEffect(() => {
    if (!accommodation) return;

    if (accommodation.checkInTime) {
      setStartTime(accommodation.checkInTime);
    }
    if (accommodation.checkOutTime) {
      setEndTime(accommodation.checkOutTime);
    }
  }, [accommodation]);

  const cleaners = (accommodation?.assignedCleaners ?? []) as any[];
  const primaryEntry = cleaners.find((c) => c.role === 'primary') || null;
  const substituteEntries = cleaners.filter((c) => c.role === 'substitute');

  const acceptedPrimary = cleaners.find((c) => c.role === 'primary' && c.status === 'accepted');
  const firstAccepted = cleaners.find((c) => c.status === 'accepted');
  const acceptedCleaner = acceptedPrimary || firstAccepted || null;
  const cleanerId: string | null = acceptedCleaner?.cleaner?._id ?? null;

  const coverImage = resolveAssetUrl(accommodation?.photos?.[0]) || avatarFor(accommodation?.name || 'H');
  const address = accommodation ? `${accommodation.address}, ${accommodation.city}` : '';
  const cleaningRate = accommodation?.cleaningRate ?? 0;

  const formatDate = (dateStr: string) =>
    formatDateLocal(dateStr, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }, 'en-US');

  const handleNext = async () => {
    setError('');
    if (!cleanerId) {
      setError(t('assignConfirmError'));
      return;
    }

    try {
      const created = await createSchedule({
        accommodationId: id,
        cleanerId,
        date,
        checkInTime: startTime,
        checkOutTime: endTime,
      }).unwrap();
      router.push(`/dashboard/housing/${id}/payment?scheduleId=${created._id}`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <main className="w-full px-8 py-10 animate-in fade-in duration-500 mx-auto">

      {/* Header */}
      <h1 className="text-[32px] font-bold text-gray-900 mb-10">{t('title')}</h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left Column - Accommodation Card */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-4">
            <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden relative">
              <AppImage src={coverImage} alt={accommodation?.name || ''} fill className="object-cover" />
            </div>
            <div className="flex flex-col px-2 pb-2">
              <h3 className="text-[16px] font-bold text-gray-900 mb-1">{accommodation?.name}</h3>
              <div className="flex items-center gap-1.5 mb-6">
                <HugeiconsIcon icon={Location01Icon} className="w-[14px] h-[14px] text-gray-400" />
                <span className="text-[13px] text-gray-500">{address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Schedule Details */}
        <div className="flex-1">
          <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 p-8 lg:p-10 flex flex-col">

            <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">

              {/* Left Side of Right Column */}
              <div className="flex-1 flex flex-col">
                <h2 className="text-[16px] font-bold text-gray-900 mb-8">{t('cleaningInformation')}</h2>

                <div className="flex flex-col gap-8 mb-8">
                  {/* Date */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-1">
                      <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('cleaningDate')}</span>
                      <div className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors bg-white relative overflow-hidden mt-1">
                        <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
                        <input
                          type="date"
                          className="bg-transparent outline-none w-full pl-6 pr-2 cursor-pointer text-gray-700 font-medium text-[12px] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                          value={date}
                          min={minDate}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-1">
                      <HugeiconsIcon icon={Clock01Icon} className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('cleaningTime')}</span>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {/* Check-in custom dropdown picker */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] text-gray-500 font-medium">Check-in</span>
                          <TimePickerDropdown value={startTime} onChange={setStartTime} />
                        </div>

                        {/* Check-out custom dropdown picker */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] text-gray-500 font-medium">Check-out</span>
                          <TimePickerDropdown value={endTime} onChange={setEndTime} />
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-2">{t('timesAutoRetrieved')}</span>
                    </div>
                  </div>
                </div>

                {(primaryEntry || substituteEntries.length > 0) ? (
                  <div className="mt-2">
                     <h2 className="text-[16px] font-bold text-gray-900 mb-6">{t('cleaner')}</h2>

                     {/* Primary Cleaner */}
                     {primaryEntry && (
                       <div className="flex flex-col mb-6">
                         <span className="text-[13px] font-bold text-gray-700 mb-4">{t('primaryCleaner')}</span>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-[38px] h-[38px] rounded-full overflow-hidden relative">
                                 <AppImage src={cleanerAvatar(primaryEntry.cleaner)} alt={cleanerName(primaryEntry.cleaner)} fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-gray-900">{cleanerName(primaryEntry.cleaner)}</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#48C79D]"></div>
                                  <span className="text-[10px] text-gray-500">{primaryEntry.status}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => openChat(primaryEntry.cleaner?._id)}
                              disabled={isOpening || !primaryEntry.cleaner?._id}
                              className="h-[34px] px-4 rounded-xl bg-[#F4F4F5] text-[11px] font-medium text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                              {t('message')}
                            </button>
                         </div>
                       </div>
                     )}

                     {/* Substitutes */}
                     {substituteEntries.length > 0 && (
                       <div className="flex flex-col">
                         <span className="text-[13px] font-bold text-gray-700 mb-4">{t('substitutes')}</span>
                         <div className="flex flex-col gap-5">
                           {substituteEntries.map((sub) => (
                             <div key={sub.assignmentId || sub._id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-[38px] h-[38px] rounded-full overflow-hidden relative">
                                     <AppImage src={cleanerAvatar(sub.cleaner)} alt={cleanerName(sub.cleaner)} fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-gray-900">{cleanerName(sub.cleaner)}</span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#48C79D]"></div>
                                      <span className="text-[10px] text-gray-500">{sub.status}</span>
                                    </div>
                                  </div>
                                </div>
                             </div>
                           ))}
                         </div>
                        </div>
                      )}

                      {/* Assign more cleaners button */}
                      <div className="mt-8 flex justify-center">
                        <Link href={`/dashboard/add-housekeeper?source=cleaners&housingId=${id}`}>
                          <button className="h-10 px-8 rounded-xl bg-[#F4F4F5] text-[12px] font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                            {t('assignMoreCleaners')}
                          </button>
                        </Link>
                      </div>
                   </div>
                ) : (
                  <div className="ml-12 mt-2">
                    <Link href={`/dashboard/add-housekeeper?source=cleaners&housingId=${id}`}>
                      <button className="h-10 px-6 rounded-xl bg-[#F4F4F5] text-[12px] font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                        {t('assignCleaner')}
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Right Side of Right Column */}
              <div className="flex-1 flex flex-col">
                <h2 className="text-[16px] font-bold text-gray-900 mb-8">{t('summary')}</h2>

                <div className="flex flex-col gap-5 mb-12">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Home01Icon} className="w-4 h-4 text-gray-400" />
                      <span className="text-[12px] text-gray-500">{t('accommodation')}</span>
                    </div>
                    <span className="text-[12px] font-medium text-gray-900 text-right max-w-[150px] leading-tight">
                      {address}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-gray-400" />
                      <span className="text-[12px] text-gray-500">{t('date')}</span>
                    </div>
                    <span className="text-[12px] font-medium text-gray-900">{formatDate(date)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Clock01Icon} className="w-4 h-4 text-gray-400" />
                      <span className="text-[12px] text-gray-500">{t('checkOutIn')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-gray-900">{startTime}</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3 text-gray-400" />
                      <span className="text-[12px] font-medium text-gray-900">{endTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={UserCircleIcon} className="w-4 h-4 text-gray-400" />
                      <span className="text-[12px] text-gray-500">{t('housekeeper')}</span>
                    </div>
                    <span className="text-[12px] font-medium text-gray-900">{primaryEntry ? cleanerName(primaryEntry.cleaner) : t('unassigned')}</span>
                  </div>
                </div>

                <h2 className="text-[16px] font-bold text-gray-900 mb-6">{t('priceDetails')}</h2>

                {(() => {
                  const price = computeSchedulePrice(cleaningRate);
                  return (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-gray-500">{t('cleaningService')}</span>
                        <span className="font-medium text-gray-900">{formatEuro(price.total)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[12px] pb-4 border-b border-gray-100">
                        <span className="text-gray-500">{t('serviceFee')}</span>
                        <span className="font-medium text-gray-900">{formatEuro(price.serviceFee)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[13px] font-bold">
                        <span className="text-gray-900">{t('total')}</span>
                        <span className="text-gray-900">{formatEuro(price.total)}</span>
                      </div>
                    </div>
                  );
                })()}

                {error && <p className="text-[12px] text-red-600 mt-6 text-right">{error}</p>}

                <div className="mt-auto pt-10 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={isCreating}
                    className={`w-[120px] h-12 text-white text-[13px] font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 ${cleanerId ? 'bg-black' : 'bg-[#8C8C8C]'}`}
                  >
                    {isCreating ? '...' : c('next')}
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>

    </main>
  );
}
