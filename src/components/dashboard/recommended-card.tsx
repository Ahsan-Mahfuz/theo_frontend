'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Calendar01Icon, ArrowRight01Icon, Time02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { resolveAssetUrl } from '@/lib/config';
import { formatDate as formatDateLocal } from '@/lib/datetime';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';

const FALLBACK_ROOM =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop';
const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=';

/* eslint-disable @typescript-eslint/no-explicit-any */
const nameOf = (p: any): string =>
  p?.name || [p?.firstName, p?.lastName].filter(Boolean).join(' ') || '—';
const avatarOf = (p: any): string =>
  resolveAssetUrl(p?.profileImage) || `${FALLBACK_AVATAR}${encodeURIComponent(nameOf(p))}`;
const photoOf = (acc: any): string => resolveAssetUrl(acc?.photos?.[0]) || FALLBACK_ROOM;

const formatDate = (d?: string): string =>
  formatDateLocal(d, { day: 'numeric', month: 'short', year: 'numeric' });

export function RecommendedCard({ item }: { item: any }) {
  const t = useTranslations('Dashboard.home');
  const router = useRouter();

  const open = () => {
    const params = new URLSearchParams({ source: 'recommended' });
    const accId = item.accommodation?._id;
    if (accId) params.set('accommodationId', String(accId));
    if (item.recommendedDate) params.set('date', String(item.recommendedDate).slice(0, 10));
    if (item.checkInTime) params.set('checkIn', String(item.checkInTime));
    if (item.checkOutTime) params.set('checkOut', String(item.checkOutTime));
    router.push(`/dashboard/schedule/details?${params.toString()}`);
  };

  return (
    <div
      onClick={open}
      className="group bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-3 relative hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
    >
      <div className="w-30 shrink-0 rounded-xl overflow-hidden bg-gray-200 relative self-stretch min-h-28">
        <AppImage src={photoOf(item.accommodation)} alt="Room" fill className="object-cover" />
      </div>

      <div className="flex flex-col flex-1 w-full max-w-full overflow-hidden">
        <div className="flex justify-between items-start gap-1">
          <h3 className="font-semibold text-[#4B443B] text-[14px] leading-snug truncate">
            {item.accommodation?.name || t('accommodationFallback')}
          </h3>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-[#0084FF] group-hover:translate-x-0.5 transition-all"
          />
        </div>
        <p className="text-[11px] text-gray-400 mb-2 truncate">{t('nextCleaning')}</p>

        <div className="flex items-center gap-2 mb-2 w-full">
          <div className="bg-[#F6F7F9] rounded-lg px-2 py-1.5 flex items-center gap-1.5 flex-1 overflow-hidden">
            <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-[#0084FF] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-gray-400 leading-none mb-0.5">{t('dateLabel')}</span>
              <span className="text-[11px] font-semibold text-gray-800 leading-tight truncate">
                {formatDate(item.recommendedDate)}
              </span>
            </div>
          </div>
          <div className="bg-[#F6F7F9] rounded-lg px-2 py-1.5 flex items-center gap-1.5 flex-1 overflow-hidden">
            <HugeiconsIcon icon={Time02Icon} className="w-4 h-4 text-[#48C79D] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-gray-400 leading-none mb-0.5">{t('timeSlotLabel')}</span>
              <span className="text-[11px] font-semibold text-gray-800 leading-tight truncate">
                {item.checkInTime || '—'}{item.checkOutTime ? ` - ${item.checkOutTime}` : ''}
              </span>
            </div>
          </div>
        </div>

        {item.cleaner && (
          <div className="flex items-center gap-2 mt-auto pt-1 border-t border-gray-50">
            <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
              <AppImage src={avatarOf(item.cleaner)} alt="Avatar" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-semibold text-gray-900 leading-tight truncate">{nameOf(item.cleaner)}</span>
              <span className="text-[10px] text-gray-400 leading-tight">{t('assignedCleaner')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
