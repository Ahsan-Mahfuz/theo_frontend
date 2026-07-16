'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { formatDate, todayInput } from '@/lib/datetime';
import { Location01Icon, Calendar01Icon, Time02Icon, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';
import { useScheduleContext } from '../ScheduleContext';
import { useGetAccommodationByIdQuery } from '@/store/api/accommodationApi';
import { useGetAccommodationCleanersQuery } from '@/store/api/assignmentApi';
import { useCreateScheduleMutation } from '@/store/api/scheduleApi';
import type { CleanerAssignment, Housekeeper } from '@/store/types';
import { resolveAssetUrl } from '@/lib/config';
import { computeSchedulePrice, formatEuro } from '@/lib/pricing';
import { getApiErrorMessage } from '@/lib/apiError';

const FALLBACK_ROOM =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500';

const cleanerObj = (a: CleanerAssignment): Housekeeper | null =>
  a.cleaner && typeof a.cleaner === 'object' ? (a.cleaner as Housekeeper) : null;

const cleanerName = (c: Housekeeper | null): string => {
  if (!c) return 'Cleaner';
  return c.name || [c.firstName, c.lastName].filter(Boolean).join(' ') || 'Cleaner';
};

const avatarUrl = (c: Housekeeper | null): string => {
  const img = c?.profileImage ? resolveAssetUrl(c.profileImage) : '';
  if (img) return img;
  return `https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=${encodeURIComponent(cleanerName(c))}`;
};

export default function ScheduleDetailsPage() {
  const router = useRouter();
  const t = useTranslations('Schedule');
  const searchParams = useSearchParams();
  const { data, updateData } = useScheduleContext();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation();

  const isRecommended = searchParams.get('source') === 'recommended';

  // If coming from Recommended Cleaning, prefill the accommodation + date/time
  // from the booking turnover that was passed through in the URL (see the
  // dashboard recommended card). No hardcoded mock values.
  useEffect(() => {
    if (!isRecommended) return;
    const accommodationId = searchParams.get('accommodationId');
    const date = searchParams.get('date') || '';
    const checkInTime = searchParams.get('checkIn') || '';
    const checkOutTime = searchParams.get('checkOut') || '';
    const updates: Partial<typeof data> = {};
    if (accommodationId && !data.propertyId) updates.propertyId = accommodationId;
    if (date && !data.date) updates.date = date;
    if (checkInTime && !data.checkInTime) updates.checkInTime = checkInTime;
    if (checkOutTime && !data.checkOutTime) updates.checkOutTime = checkOutTime;
    if (Object.keys(updates).length > 0) updateData(updates);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecommended]);

  const { data: property } = useGetAccommodationByIdQuery(data.propertyId ?? '', {
    skip: !data.propertyId,
  });

  const { data: cleaners, isLoading: cleanersLoading } = useGetAccommodationCleanersQuery(
    data.propertyId ?? '',
    { skip: !data.propertyId },
  );

  // Pick the accepted primary (role primary & status accepted, else first accepted).
  const chosenAssignment: CleanerAssignment | undefined = React.useMemo(() => {
    if (!cleaners || cleaners.length === 0) return undefined;
    const accepted = cleaners.filter((c) => c.status === 'accepted');
    return (
      accepted.find((c) => c.role === 'primary') || accepted[0] || undefined
    );
  }, [cleaners]);

  const chosenCleaner = chosenAssignment ? cleanerObj(chosenAssignment) : null;

  useEffect(() => {
    if (chosenCleaner?._id && data.primaryCleanerId !== chosenCleaner._id) {
      updateData({ primaryCleanerId: chosenCleaner._id });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenCleaner?._id]);

  const propertyPhoto = property?.photos?.[0]
    ? resolveAssetUrl(property.photos[0])
    : FALLBACK_ROOM;
  const propertyName = property?.name || 'Accommodation';
  const propertyAddress = property
    ? [property.address, [property.zipCode, property.city].filter(Boolean).join(' ')]
        .filter(Boolean)
        .join(', ')
    : '';

  const isFormComplete = data.date !== '' && data.checkInTime !== '' && data.checkOutTime !== '';

  // Spell out exactly what's still needed so a first-time host understands why
  // the "Next" button is disabled instead of guessing.
  const missingFields: string[] = [];
  if (data.date === '') missingFields.push(t('fieldDate'));
  if (data.checkOutTime === '') missingFields.push(t('fieldCheckOut'));
  if (data.checkInTime === '') missingFields.push(t('fieldCheckIn'));

  // Real price breakdown: prefer the agreed price for this assigned cleaner,
  // fall back to the accommodation's cleaning rate.
  const price = computeSchedulePrice(chosenAssignment?.pricePerCleaning, property?.cleaningRate);

  // The host only creates the schedule here — no payment. Payment is collected
  // later (Stripe) once the cleaner accepts the request.
  const handleContinue = async () => {
    setErrorMsg(null);
    if (!isFormComplete) return;
    const cleanerId = chosenCleaner?._id ?? data.primaryCleanerId;
    if (!data.propertyId || !cleanerId) {
      setErrorMsg(t('selectPropertyAndCleaner'));
      return;
    }
    try {
      await createSchedule({
        accommodationId: data.propertyId,
        cleanerId,
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
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">

      {/* Top Header Block */}
      <div className="mb-10 flex flex-col">
        <h2 className="text-[28px] font-bold text-gray-900 mb-6">
          {isRecommended ? t('recommendedCleaning') : t('scheduleCleaning')}
        </h2>

        {/* Selected Property Card */}
        <div className="flex items-center gap-4 bg-white p-2 w-full">
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

             {chosenCleaner && (
               <div className="flex flex-col mt-1">
                 <span className="text-[10px] text-gray-400 mb-1">{t('primary')}</span>
                 <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden relative">
                       <AppImage src={avatarUrl(chosenCleaner)} alt="Cleaner" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-semibold text-gray-800">{cleanerName(chosenCleaner)}</span>
                    </div>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">

        {/* Left Column: Form */}
        <div className="flex flex-col">
           <h3 className="text-[16px] font-bold text-gray-900 mb-6">{t('cleaningInformation')}</h3>

           <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                 <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex flex-col">
                 <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">{t('cleaningDate')}</label>
                 <input
                   type="date"
                   value={data.date}
                   min={todayInput()}
                   onChange={(e) => updateData({ date: e.target.value })}
                   className="text-[13px] font-semibold text-gray-900 outline-none bg-transparent cursor-pointer"
                 />
              </div>
           </div>

           <div className="flex flex-col mb-8">
              <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-3">{t('cleaningTime')}</label>
              <div className="flex items-center gap-8">
                 <div className="flex flex-col border-b border-gray-200 pb-2 w-32">
                    <span className="text-[11px] text-gray-500 mb-1">{t('checkOut')}</span>
                    <input
                      type="time"
                      value={data.checkOutTime}
                      onChange={(e) => updateData({ checkOutTime: e.target.value })}
                      className="text-[13px] font-semibold text-gray-900 outline-none bg-transparent cursor-pointer"
                    />
                 </div>
                 <div className="flex flex-col border-b border-gray-200 pb-2 w-32">
                    <span className="text-[11px] text-gray-500 mb-1">{t('checkIn')}</span>
                    <input
                      type="time"
                      value={data.checkInTime}
                      onChange={(e) => updateData({ checkInTime: e.target.value })}
                      className="text-[13px] font-semibold text-gray-900 outline-none bg-transparent cursor-pointer"
                    />
                 </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">{t('timesAutoRetrieved')}</p>
           </div>

           {/* The assigned cleaner is always shown — it does not depend on the
               date/time being filled in yet. */}
           <div className="flex flex-col animate-in fade-in duration-500 mt-2">
                <h3 className="text-[16px] font-bold text-gray-900 mb-4">{t('cleaner')}</h3>

                <span className="text-[12px] font-semibold text-gray-800 mb-3">{t('primaryCleaner')}</span>
                {cleanersLoading ? (
                  <div className="flex items-center gap-3 mb-8">
                    <SkeletonCircle size={40} />
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-3.5 w-28 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                  </div>
                ) : chosenCleaner ? (
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full overflow-hidden relative">
                         <AppImage src={avatarUrl(chosenCleaner)} alt="Cleaner" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[13px] font-semibold text-gray-900">{cleanerName(chosenCleaner)}</span>
                          {chosenAssignment?.pricePerCleaning != null && (
                            <span className="text-[11px] text-gray-500">{t('pricePerCleaning', { price: chosenAssignment.pricePerCleaning })}</span>
                          )}
                       </div>
                    </div>
                    <button
                      onClick={() => router.push('/dashboard/message')}
                      className="px-4 py-1.5 bg-gray-100 text-gray-700 text-[11px] font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {t('message')}
                    </button>
                  </div>
                ) : (
                  <div className="text-[12px] text-gray-400 mb-8">{t('noConfirmedCleaner')}</div>
                )}
           </div>
        </div>

        {/* Right Column: Summary */}
        <div className="flex flex-col">
           <h3 className="text-[16px] font-bold text-gray-900 mb-6">{t('summary')}</h3>

           <div className="flex flex-col gap-4 mb-10">
              <div className="flex justify-between items-start gap-4">
                 <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={Location01Icon} className="w-4 h-4 text-gray-400" />
                    <span className="text-[12px] text-gray-500">{t('accommodation')}</span>
                 </div>
                 <div className="flex flex-col items-end text-right">
                    <span className="text-[12px] font-medium text-gray-900">{propertyName}</span>
                    <span className="text-[11px] text-gray-500">{propertyAddress || '—'}</span>
                 </div>
              </div>
              <div className="flex justify-between items-center gap-4">
                 <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-gray-400" />
                    <span className="text-[12px] text-gray-500">{t('date')}</span>
                 </div>
                 <span className="text-[12px] font-medium text-gray-900">{data.date ? formatDate(data.date, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }, 'en-US') : '---'}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                 <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={Time02Icon} className="w-4 h-4 text-gray-400" />
                    <span className="text-[12px] text-gray-500">{t('checkOutCheckIn')}</span>
                 </div>
                 <span className="text-[12px] font-medium text-gray-900">{isFormComplete ? `${data.checkOutTime} → ${data.checkInTime}` : '--- → ---'}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                 <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={UserIcon} className="w-4 h-4 text-gray-400" />
                    <span className="text-[12px] text-gray-500">{t('housekeeper')}</span>
                 </div>
                 <span className="text-[12px] font-medium text-gray-900">{chosenCleaner ? cleanerName(chosenCleaner) : '---'}</span>
              </div>
           </div>

           <h3 className="text-[16px] font-bold text-gray-900 mb-6">{t('priceDetails')}</h3>
           <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between items-center">
                 <span className="text-[12px] text-gray-500">{t('cleaningService')}</span>
                 <span className="text-[12px] font-medium text-gray-900">{formatEuro(price.total)}</span>
              </div>
           </div>
           <div className="flex justify-between items-center mb-10">
              <span className="text-[13px] font-bold text-gray-900">{t('total')}</span>
              <span className="text-[13px] font-bold text-gray-900">{formatEuro(price.total)}</span>
           </div>

           <div className="mt-auto flex flex-col gap-2 lg:items-end">
             {!isFormComplete && (
               <p className="text-[11px] text-gray-500 lg:text-right leading-snug">
                 {t('nextDisabledHint', { fields: missingFields.join(', ') })}
               </p>
             )}
             {errorMsg && (
               <p className="text-[11px] text-red-500 lg:text-right leading-snug">{errorMsg}</p>
             )}
             <button
               onClick={handleContinue}
               disabled={!isFormComplete || isCreating}
               title={!isFormComplete ? t('nextDisabledHint', { fields: missingFields.join(', ') }) : undefined}
               className={`w-full lg:w-auto px-16 h-11 rounded-lg text-[13px] font-medium transition-colors ${isFormComplete && !isCreating ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
             >
               {isCreating ? t('processing') : t('confirmSchedule')}
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
