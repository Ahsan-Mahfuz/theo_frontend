'use client';

import React, { useState } from 'react';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Location01Icon,
  Task01Icon,
  Calendar01Icon,
  CheckmarkBadge01Icon,
  Tick02Icon,
  ArrowDown01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';
import { useGetHousekeeperProfileQuery, useAssignCleanerMutation } from '@/store/api/assignmentApi';
import { resolveAssetUrl } from '@/lib/config';
import { getApiErrorMessage } from '@/lib/apiError';
import { useTranslations } from 'next-intl';

export default function HousekeeperProfilePage() {
  const t = useTranslations('AddHousekeeper');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const source = searchParams.get('source');
  const housingId = searchParams.get('housingId') || '';

  const [role, setRole] = useState('Primary');
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: housekeeper, isLoading } = useGetHousekeeperProfileQuery(id as any, { skip: !id });
  const hk = housekeeper as any;

  const [assignCleaner, { isLoading: isAssigning }] = useAssignCleanerMutation();

  const handleAddHousekeeper = async () => {
    if (!id) return;
    setErrorMsg('');
    try {
      await assignCleaner({
        accommodationId: housingId,
        cleanerId: id,
        role: role.toLowerCase() as 'primary' | 'substitute',
      }).unwrap();
      setShowToast(true);
      setTimeout(() => {
        if (!housingId) {
          router.push('/dashboard/housing');
        } else if (source === 'cleaners') {
          router.push(`/dashboard/housing/${housingId}/cleaners`);
        } else {
          router.push(`/dashboard/housing/${housingId}/schedule`);
        }
      }, 1500);
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col animate-in fade-in duration-300">
        {/* Profile Header */}
        <div className="flex items-start gap-5 mb-8">
          <SkeletonCircle size={80} />
          <div className="flex flex-col pt-1 gap-2">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-32 rounded mt-2" />
            <Skeleton className="h-3 w-28 rounded" />
          </div>
        </div>

        {/* Overview Boxes */}
        <Skeleton className="h-5 w-24 rounded mb-4" />
        <div className="bg-[#FAFAFA] rounded-2xl p-6 grid grid-cols-3 divide-x divide-gray-200 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center px-4 gap-3">
              <SkeletonCircle size={40} />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          ))}
        </div>

        {/* About / Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!hk) return null;

  const name = hk.name || `${hk.firstName ?? ''} ${hk.lastName ?? ''}`.trim();
  const location = hk.interventionZone || hk.workCity;
  const cleanings = hk.cleaningsCompleted ?? 0;
  const bio = hk.about || hk.biography;
  const avatar = resolveAssetUrl(hk.profileImage) ||
    `https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=${encodeURIComponent(name || 'Housekeeper')}`;
  const services: string[] = hk.servicesOffered ?? [];
  const languages: string[] = hk.languages ?? [];

  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Profile Header */}
      <div className="flex items-start gap-5 mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 relative bg-gray-200">
          <AppImage src={avatar} alt="Avatar" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
        </div>
        <div className="flex flex-col pt-1">
          <h2 className="text-[20px] font-bold text-gray-900 leading-tight mb-0.5">{name}</h2>
          <span className="text-[13px] text-gray-400 mb-3 block">{t('housekeeper')}</span>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Location01Icon} className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-[12px] text-gray-800 font-semibold">{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Task01Icon} className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-[12px] text-gray-800 font-semibold">{t('cleaningsCompleted', { count: cleanings })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Boxes */}
      <h3 className="text-[16px] font-bold text-gray-900 mb-4">{t('overview')}</h3>
      <div className="bg-[#FAFAFA] rounded-2xl p-6 grid grid-cols-3 divide-x divide-gray-200 mb-8">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
            <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">{t('interventionZone')}<br/>({location})</p>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
            <HugeiconsIcon icon={Location01Icon} className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">{t('appExperience')} ({cleanings}<br/>{t('cleaningsLower')}<br/>{t('completed')})</p>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
            <HugeiconsIcon icon={CheckmarkBadge01Icon} className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">{t('memberSince')} (March<br/>2024)</p>
        </div>
      </div>

      {/* Two columns for About/Services and Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
        <div className="flex flex-col">
          <h3 className="text-[16px] font-bold text-gray-900 mb-3">{t('about')}</h3>
          <p className="text-[12px] text-gray-600 leading-relaxed mb-8">
            {bio}
          </p>

          <h3 className="text-[16px] font-bold text-gray-900 mb-4">{t('servicesOffered')}</h3>
          <div className="flex flex-col gap-3">
            {services.map((service, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                   <HugeiconsIcon icon={Tick02Icon} className="w-2.5 h-2.5 text-gray-500" />
                </div>
                <span className="text-[13px] text-gray-600">{service}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-[16px] font-bold text-gray-900 mb-3">{t('language')}</h3>
          <p className="text-[13px] text-gray-600">{languages.join(' / ')}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-4 mt-4 w-full">
        <div className="flex flex-col gap-1.5 w-full md:w-[320px]">
          <label className="text-[12px] font-medium text-gray-800">{t('chooseCleanerRole')}</label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 appearance-none outline-none text-[13px] text-gray-800 focus:border-gray-400 cursor-pointer shadow-sm"
            >
              <option value="Primary">{t('rolePrimary')}</option>
              <option value="Substitute">{t('roleSubstitute')}</option>
            </select>
            <HugeiconsIcon icon={ArrowDown01Icon} className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        {errorMsg && (
          <p className="text-[12px] text-red-500 w-full md:w-[320px] text-right">{errorMsg}</p>
        )}
        <button
          onClick={handleAddHousekeeper}
          disabled={isAssigning}
          className="bg-black text-white rounded-xl px-12 py-3.5 text-[14px] font-medium hover:bg-gray-800 transition-colors w-full md:w-[320px] disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isAssigning ? t('adding') : t('addHousekeeper')}
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 bg-black text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in z-50">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[14px] font-medium">{t('housekeeperAssigned')}</span>
        </div>
      )}
    </div>
  );
}
