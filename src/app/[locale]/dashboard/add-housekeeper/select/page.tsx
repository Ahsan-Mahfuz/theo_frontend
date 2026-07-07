'use client';

import React, { useState } from 'react';
import { AppImage } from '@/components/ui/app-image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Location01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';
import { useAssignCleanerMutation, useGetCleanerAssignmentsQuery } from '@/store/api/assignmentApi';
import { useGetAccommodationsQuery } from '@/store/api/accommodationApi';
import { resolveAssetUrl } from '@/lib/config';
import { getApiErrorMessage } from '@/lib/apiError';
import { useTranslations } from 'next-intl';

export default function SelectAccommodationPage() {
  const t = useTranslations('AddHousekeeper');
  const c = useTranslations('Common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [selectedAccommodation, setSelectedAccommodation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data, isLoading } = useGetAccommodationsQuery({ limit: 50 });
  const accommodations = (data?.data ?? []) as any[];

  // Existing requests/assignments this cleaner already has across the host's
  // properties — used to badge each accommodation and block duplicates.
  const { data: cleanerAssignments } = useGetCleanerAssignmentsQuery(id as string, { skip: !id });
  const statusByAccommodation = React.useMemo(() => {
    const map = new Map<string, 'pending' | 'accepted' | 'refused'>();
    (cleanerAssignments ?? []).forEach((a) => map.set(String(a.accommodation), a.status));
    return map;
  }, [cleanerAssignments]);

  const [assignCleaner, { isLoading: isAssigning }] = useAssignCleanerMutation();

  const handleAdd = async () => {
    if (!selectedAccommodation || !id) return;
    setErrorMsg('');
    try {
      await assignCleaner({
        accommodationId: selectedAccommodation,
        cleanerId: id,
        role: 'primary',
      }).unwrap();
      router.push('/dashboard/add-housekeeper/success');
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err));
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-[18px] font-bold text-gray-900 mb-2">{t('selectAccommodation')}</h2>
        <p className="text-[13px] text-gray-500">{t('selectAccommodationDesc')}</p>
      </div>

      <div className="w-full max-w-[500px] max-h-[50vh] overflow-y-auto pr-1 flex flex-col gap-3 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-full rounded-2xl border border-gray-100 bg-white p-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-[100px] h-16 rounded-xl shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-32 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              </div>
              <div className="pr-4 shrink-0">
                <SkeletonCircle size={20} />
              </div>
            </div>
          ))
        ) : accommodations.length === 0 ? (
          <div className="text-center text-[13px] text-gray-400 py-12">{t('noAccommodationsFound')}</div>
        ) : (
          accommodations.map((acc) => {
            const photo = resolveAssetUrl(acc.photos?.[0]) || 'https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=Home';
            const isSelected = selectedAccommodation === acc._id;
            const status = statusByAccommodation.get(String(acc._id));
            // Pending or already-added cleaners can't be re-requested here;
            // a previously declined cleaner can be invited again.
            const locked = status === 'pending' || status === 'accepted';
            const badge =
              status === 'pending' ? { text: t('statusRequested'), cls: 'bg-amber-50 text-amber-600' }
              : status === 'accepted' ? { text: t('statusAdded'), cls: 'bg-emerald-50 text-emerald-600' }
              : status === 'refused' ? { text: t('statusRefused'), cls: 'bg-gray-100 text-gray-500' }
              : null;
            return (
              <div
                key={acc._id}
                onClick={() => { if (!locked) setSelectedAccommodation(acc._id); }}
                aria-disabled={locked}
                className={`w-full rounded-2xl border p-2 flex items-center justify-between transition-colors ${locked ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed' : isSelected ? 'border-gray-400 bg-[#FAFAFA] cursor-pointer' : 'border-gray-100 bg-white hover:border-gray-300 cursor-pointer'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-[100px] h-16 rounded-xl overflow-hidden relative bg-gray-200 shrink-0">
                    <AppImage src={photo} alt={acc.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[13px] font-bold text-gray-900">{acc.name}</span>
                      {badge && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.text}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[11px] text-gray-500">{acc.city}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-700">{acc.cleaningRate}</span>
                  </div>
                </div>

                {/* Custom Radio Button */}
                <div className="pr-4 shrink-0">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#48C79D]' : 'border-gray-200'}`}>
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#48C79D]"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="w-full max-w-[500px] bg-[#F3F4F6] rounded-xl p-4 mb-6">
        <h4 className="text-[12px] font-bold text-gray-900 mb-1">{t('housekeeperWillBeNotified')}</h4>
        <p className="text-[11px] text-gray-500 leading-snug">
          {t('housekeeperWillBeNotifiedDesc')}
        </p>
      </div>

      {errorMsg && (
        <p className="w-full max-w-[500px] text-[12px] text-red-500 mb-4 text-center">{errorMsg}</p>
      )}

      <button
        disabled={!selectedAccommodation || isAssigning}
        onClick={handleAdd}
        className={`w-full max-w-[500px] h-12 rounded-xl text-[14px] font-medium transition-colors ${selectedAccommodation && !isAssigning ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        {isAssigning ? t('adding') : c('add')}
      </button>
    </div>
  );
}
