'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useGetRecommendedSchedulesQuery } from '@/store/api/accommodationApi';
import { AppImage } from '@/components/ui/app-image';
import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';
import { RecommendedCard } from '@/components/dashboard/recommended-card';

const PAGE_SIZE = 9;

export default function RecommendedSchedulePage() {
  const t = useTranslations('Dashboard.home');
  const router = useRouter();

  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetRecommendedSchedulesQuery({ page, limit: PAGE_SIZE });

  const items = (data?.data ?? []) as any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  const totalPages = Math.max(1, data?.meta?.totalPage ?? 1);
  const total = data?.meta?.total ?? 0;

  return (
    <main className="w-full px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shrink-0"
          aria-label={t('back')}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('recommendedTitle')}</h1>
          <p className="text-[12px] text-gray-500">
            {isLoading ? t('recommendedSubtitle') : t('recommendedCount', { count: total })}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-3">
              <Skeleton className="w-30 h-28 shrink-0 rounded-xl" />
              <div className="flex flex-col flex-1 gap-2 py-1">
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
                <div className="flex items-center gap-2 mt-1">
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                </div>
                <div className="flex items-center gap-2 mt-auto pt-1">
                  <SkeletonCircle size={28} />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-2.5 w-14 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
            {items.map((item, index) => (
              <RecommendedCard key={index} item={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
              </button>
              <span className="text-[13px] font-medium text-gray-600 px-2">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isFetching}
                className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex items-center justify-center">
          <div className="flex items-center gap-6">
            <AppImage src="/homeempty1.png" alt="No recommended cleanings" width={120} height={120} className="w-24 h-auto" />
            <div className="flex flex-col">
              <span className="text-[12px] text-gray-500 font-medium mb-1">{t('noRecommendedLabel')}</span>
              <span className="text-[16px] font-bold text-gray-900 leading-snug">{t('upToDate')}</span>
              <span className="text-[14px] text-gray-500 leading-snug">{t('cleaningsScheduled')}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
