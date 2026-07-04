'use client';

import React, { useState } from 'react';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search01Icon,
  ArrowRight01Icon,
  Location01Icon,
  Task01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';
import { useFindHousekeepersQuery } from '@/store/api/assignmentApi';
import { resolveAssetUrl } from '@/lib/config';
import { useTranslations } from 'next-intl';

export default function AddHousekeeperPage() {
  const t = useTranslations('AddHousekeeper');
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const housingId = searchParams.get('housingId');

  const [search, setSearch] = useState('');
  const { data, isLoading } = useFindHousekeepersQuery({ search });
  const housekeepers = (data?.data ?? []) as any[];

  const fallbackAvatar = (name: string) =>
    `https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=${encodeURIComponent(name || 'Housekeeper')}`;

  return (
    <div className="w-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
      <div className="relative w-full max-w-[500px] mx-auto mb-6">
        <HugeiconsIcon icon={Search01Icon} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('findHousekeeper')}
          className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 outline-none focus:border-gray-400 text-[14px] text-gray-800"
        />
      </div>

      <div className="w-full max-w-[600px] mx-auto">
        <h3 className="text-[12px] text-gray-500 mb-4 px-1">{t('housekeepersNearby')}</h3>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-[#FAFAFA] rounded-2xl p-5 flex items-start gap-4">
                <SkeletonCircle size={56} />
                <div className="flex flex-col flex-1 gap-2">
                  <Skeleton className="h-4 w-1/3 rounded" />
                  <Skeleton className="h-3 w-1/4 rounded" />
                  <Skeleton className="h-3 w-2/5 rounded" />
                  <Skeleton className="h-3 w-full rounded mt-1" />
                  <Skeleton className="h-3 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : housekeepers.length === 0 ? (
          <div className="text-center text-[13px] text-gray-400 py-12">{t('noHousekeepersFound')}</div>
        ) : (
          <div className="flex flex-col gap-4">
            {housekeepers.map((hk) => {
              const name = hk.name || `${hk.firstName ?? ''} ${hk.lastName ?? ''}`.trim();
              const location = hk.interventionZone || hk.workCity;
              const cleanings = hk.cleaningsCompleted ?? 0;
              const bio = hk.about || hk.biography;
              const avatar = resolveAssetUrl(hk.profileImage) || fallbackAvatar(name);
              return (
                <div
                  key={hk._id}
                  onClick={() => {
                    let url = `/dashboard/add-housekeeper/profile?id=${hk._id}`;
                    if (source) url += `&source=${source}`;
                    if (housingId) url += `&housingId=${housingId}`;
                    router.push(url);
                  }}
                  className="bg-[#FAFAFA] rounded-2xl p-5 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors relative group"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 relative bg-gray-200">
                    <AppImage src={avatar} alt={name} fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                  </div>
                  <div className="flex flex-col flex-1 pr-8">
                    <h4 className="text-[15px] font-bold text-gray-900 mb-2">{name}</h4>
                    <div className="flex flex-col gap-1.5 mb-3">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={Location01Icon} className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-[12px] text-gray-600 font-medium">{location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={Task01Icon} className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-[12px] text-gray-600 font-medium">{t('cleaningsCompleted', { count: cleanings })}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-3">
                      {bio}
                    </p>
                  </div>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
