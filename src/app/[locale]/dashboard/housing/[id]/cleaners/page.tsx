'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Location01Icon,
  MoreVerticalIcon,
  Calendar01Icon,
  AddCircleIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { useGetAccommodationByIdQuery } from '@/store/api/accommodationApi';
import {
  useGetAccommodationCleanersQuery,
  useChangeAssignmentRoleMutation,
  useRemoveAssignmentMutation,
} from '@/store/api/assignmentApi';
import { resolveAssetUrl } from '@/lib/config';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';
import { useOpenChat } from '@/hooks/useOpenChat';

const avatarFor = (name: string) => `https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=${encodeURIComponent(name || 'Cleaner')}`;

const cleanerName = (c: any) =>
  c?.name || `${c?.firstName ?? ''} ${c?.lastName ?? ''}`.trim() || 'Cleaner';
const cleanerAvatar = (c: any) => resolveAssetUrl(c?.profileImage) || avatarFor(cleanerName(c));

export default function AccommodationCleanersPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const t = useTranslations('Housing.cleaners');
  const c = useTranslations('Common');

  const { data: accommodation } = useGetAccommodationByIdQuery(id);
  const { data: cleaners, isLoading } = useGetAccommodationCleanersQuery(id);
  const [changeRole] = useChangeAssignmentRoleMutation();
  const [removeAssignment] = useRemoveAssignmentMutation();
  const { openChat, isOpening } = useOpenChat();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const list = (cleaners ?? []) as any[];
  const primary = list.find((c) => c.role === 'primary') || null;
  const substitutes = list.filter((c) => c.role === 'substitute');

  const coverImage = resolveAssetUrl(accommodation?.photos?.[0]) || avatarFor(accommodation?.name || 'H');
  const address = accommodation ? `${accommodation.address}, ${accommodation.city}` : '';

  const handleMakeSubstitute = async (assignmentId: string) => {
    setOpenDropdown(null);
    await changeRole({ assignmentId, role: 'substitute' });
  };
  const handleMakePrimary = async (assignmentId: string) => {
    setOpenDropdown(null);
    await changeRole({ assignmentId, role: 'primary' });
  };
  const handleRemove = async (assignmentId: string) => {
    setOpenDropdown(null);
    await removeAssignment(assignmentId);
  };

  return (
    <main className="w-full px-8 py-10 animate-in fade-in duration-500 mx-auto" onClick={() => setOpenDropdown(null)}>

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

              {/* Cleaners in Card */}
              {(primary || substitutes.length > 0) && (
                <div className="flex flex-col gap-4 mt-auto">
                   {primary && (
                     <div className="flex flex-col gap-1.5">
                       <span className="text-[10px] text-gray-500">{t('primary')}</span>
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0">
                             <AppImage src={cleanerAvatar(primary.cleaner)} alt={cleanerName(primary.cleaner)} fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[11px] font-bold text-gray-900">{cleanerName(primary.cleaner)}</span>
                             <span className="text-[10px] text-gray-400">{primary.status}</span>
                          </div>
                       </div>
                     </div>
                   )}
                   {substitutes.length > 0 && (
                     <div className="flex flex-col gap-1.5">
                       <span className="text-[10px] text-gray-500">{t('substitutes')}</span>
                       <div className="flex flex-col gap-2">
                         {substitutes.map((sub) => (
                           <div key={sub._id} className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0">
                                 <AppImage src={cleanerAvatar(sub.cleaner)} alt={cleanerName(sub.cleaner)} fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-bold text-gray-900">{cleanerName(sub.cleaner)}</span>
                                 <span className="text-[10px] text-gray-400">{sub.status}</span>
                              </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Cleaners Management */}
        <div className="flex-1">
          <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 p-8 lg:p-10 flex flex-col">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <span className="text-[13px] text-gray-500">
                {t('manageStaff')}
              </span>
              <Link href={`/dashboard/add-housekeeper?source=cleaners&housingId=${id}`}>
                <button className="h-[38px] px-4 rounded-xl border border-gray-200 text-[12px] font-medium text-gray-800 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <HugeiconsIcon icon={AddCircleIcon} className="w-4 h-4 text-[#007AFF]" />
                  {t('addCleaner')}
                </button>
              </Link>
            </div>

            {isLoading && (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-[#FAFAFA] rounded-[16px] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <SkeletonCircle size={60} />
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-3.5 w-32 rounded" />
                        <Skeleton className="h-3 w-20 rounded" />
                        <Skeleton className="h-3 w-40 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !primary && substitutes.length === 0 && (
              <div className="flex items-center justify-center h-40 text-[13px] text-gray-400">{t('noCleaners')}</div>
            )}

            {/* Primary Cleaner List */}
            {primary && (
              <div className="flex flex-col mb-10">
                <h3 className="text-[15px] font-bold text-gray-900 mb-4">{t('primaryCleaner')}</h3>
                <div className="bg-[#FAFAFA] rounded-[16px] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden relative shrink-0">
                      <AppImage src={cleanerAvatar(primary.cleaner)} alt={cleanerName(primary.cleaner)} fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-gray-900">{cleanerName(primary.cleaner)}</span>
                      <span className="text-[11px] text-gray-400 mb-1.5">{t('housekeeper')}</span>
                      <div className="flex items-center gap-1.5 mb-1">
                        <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[11px] font-medium text-gray-700">{t('area')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={Calendar01Icon} className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[11px] font-medium text-gray-700">{t('status', { status: primary.status })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); openChat(primary.cleaner?._id); }}
                      disabled={isOpening || !primary.cleaner?._id}
                      className="h-[30px] px-4 rounded-lg bg-[#F4F4F5] text-[11px] font-medium text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {t('message')}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'primary' ? null : 'primary'); }}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-400"
                    >
                      <HugeiconsIcon icon={MoreVerticalIcon} className="w-[18px] h-[18px]" />
                    </button>

                    {openDropdown === 'primary' && (
                      <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-10 flex flex-col overflow-hidden">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMakeSubstitute(primary._id); }}
                          className="w-full text-left px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {t('makeSubstitute')}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemove(primary._id); }}
                          className="w-full text-left px-4 py-2 text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          {c('remove')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Substitute Cleaners List */}
            {substitutes.length > 0 && (
              <div className="flex flex-col">
                <h3 className="text-[15px] font-bold text-gray-900 mb-4">{t('substituteCleaner')}</h3>
                <div className="flex flex-col gap-3">
                  {substitutes.map((sub) => (
                    <div key={sub._id} className="bg-[#FAFAFA] rounded-[16px] p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-[60px] h-[60px] rounded-full overflow-hidden relative shrink-0">
                          <AppImage src={cleanerAvatar(sub.cleaner)} alt={cleanerName(sub.cleaner)} fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-gray-900">{cleanerName(sub.cleaner)}</span>
                          <span className="text-[11px] text-gray-400 mb-1.5">{t('housekeeper')}</span>
                          <div className="flex items-center gap-1.5 mb-1">
                            <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[11px] font-medium text-gray-700">{t('area')}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={Calendar01Icon} className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[11px] font-medium text-gray-700">{t('status', { status: sub.status })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); openChat(sub.cleaner?._id); }}
                          disabled={isOpening || !sub.cleaner?._id}
                          className="h-[30px] px-4 rounded-lg bg-[#F4F4F5] text-[11px] font-medium text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          {t('message')}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === `sub-${sub._id}` ? null : `sub-${sub._id}`); }}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-400"
                        >
                          <HugeiconsIcon icon={MoreVerticalIcon} className="w-[18px] h-[18px]" />
                        </button>

                        {openDropdown === `sub-${sub._id}` && (
                          <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-10 flex flex-col overflow-hidden">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleMakePrimary(sub._id); }}
                              className="w-full text-left px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              {t('makePrimary')}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRemove(sub._id); }}
                              className="w-full text-left px-4 py-2 text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                              {c('remove')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </main>
  );
}
