'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar01Icon, UserAdd01Icon, ArrowRight01Icon, ArrowLeft01Icon, Time02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { useGetHostDashboardQuery } from '@/store/api/accommodationApi';
import { resolveAssetUrl } from '@/lib/config';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

const FALLBACK_ROOM =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop';
const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=';

/* eslint-disable @typescript-eslint/no-explicit-any */
const nameOf = (p: any): string =>
  p?.name || [p?.firstName, p?.lastName].filter(Boolean).join(' ') || '—';
const avatarOf = (p: any): string =>
  resolveAssetUrl(p?.profileImage) || `${FALLBACK_AVATAR}${encodeURIComponent(nameOf(p))}`;
const photoOf = (acc: any): string => resolveAssetUrl(acc?.photos?.[0]) || FALLBACK_ROOM;

const formatDate = (d?: string): string => {
  if (!d) return '—';
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
};

const timeAgo = (d: string | undefined, t: (key: string, values?: Record<string, string | number | Date>) => string): string => {
  if (!d) return '';
  const diff = Date.now() - new Date(d).getTime();
  if (Number.isNaN(diff)) return '';
  const mins = Math.round(diff / 60000);
  if (mins < 1) return t('justNow');
  if (mins < 60) return t('minAgo', { count: mins });
  const hours = Math.round(mins / 60);
  if (hours < 24) return t('hoursAgo', { count: hours });
  const days = Math.round(hours / 24);
  return t('daysAgo', { count: days });
};

// Route a to-do event to the matching detail screen. Schedule events open the
// real cleaning-detail page (proof / dispute / validate); assignment events open
// the accommodation they belong to.
const todoTarget = (task: any): string => {
  if (task.kind === 'schedule' && task.scheduleId) return `/dashboard/tasks/${task.scheduleId}`;
  const accId = task.accommodation?._id;
  return accId ? `/dashboard/housing/${accId}` : '/dashboard';
};
const isNegative = (status: string) => ['refused', 'disputed', 'cancelled'].includes(status);

export default function DashboardHome() {
  const t = useTranslations('Dashboard.home');
  const router = useRouter();

  // The To Do feed is paginated server-side (?page & ?limit on the dashboard
  // endpoint). Recommended schedule comes back on every page but is stable.
  const TODO_PAGE_SIZE = 5;
  const [todoPage, setTodoPage] = useState(1);
  const { data, isLoading, isFetching } = useGetHostDashboardQuery({ page: todoPage, limit: TODO_PAGE_SIZE });

  const recommendedData = data?.recommended_schedule ?? [];
  const todoData = (data?.to_do?.data ?? []) as any[];
  const totalTodoPages = Math.max(1, data?.to_do?.meta?.totalPage ?? 1);

  // If the total shrinks (items resolved elsewhere), pull the page back in range.
  useEffect(() => {
    if (todoPage > totalTodoPages) setTodoPage(totalTodoPages);
  }, [todoPage, totalTodoPages]);

  return (
    <>
      <main className="w-full px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/dashboard/schedule')}
              className="h-11 px-5 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-[#0084FF]" />
              <span className="text-[13px] font-semibold text-gray-700">{t('scheduleCleaning')}</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/add-housekeeper')}
              className="h-11 px-5 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <HugeiconsIcon icon={UserAdd01Icon} className="w-4 h-4 text-[#48C79D]" />
              <span className="text-[13px] font-semibold text-gray-700">{t('addHousekeeper')}</span>
            </button>
          </div>
        </div>

        {/* Recommended Schedule */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{t('recommendedTitle')}</h2>
          <p className="text-[13px] text-gray-500 mb-6">{t('recommendedSubtitle')}</p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex gap-4">
                  <Skeleton className="w-[150px] h-[140px] shrink-0 rounded-xl" />
                  <div className="flex flex-col flex-1 gap-2 py-1">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <div className="flex items-center gap-2 mt-1">
                      <Skeleton className="h-12 flex-1 rounded-lg" />
                      <Skeleton className="h-12 flex-1 rounded-lg" />
                    </div>
                    <div className="flex items-center gap-3 mt-auto pt-1">
                      <SkeletonCircle size={40} />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-3.5 w-24 rounded" />
                        <Skeleton className="h-3 w-16 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recommendedData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(recommendedData as any[]).map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    const params = new URLSearchParams({ source: 'recommended' });
                    const accId = item.accommodation?._id;
                    if (accId) params.set('accommodationId', String(accId));
                    if (item.recommendedDate) params.set('date', String(item.recommendedDate).slice(0, 10));
                    if (item.checkInTime) params.set('checkIn', String(item.checkInTime));
                    if (item.checkOutTime) params.set('checkOut', String(item.checkOutTime));
                    router.push(`/dashboard/schedule/details?${params.toString()}`);
                  }}
                  className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex gap-4 relative hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="w-[150px] shrink-0 rounded-xl overflow-hidden bg-gray-200 relative">
                    <AppImage src={photoOf(item.accommodation)} alt="Room" fill className="object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 w-full max-w-full overflow-hidden">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[#4B443B] text-[18px] truncate">{item.accommodation?.name || t('accommodationFallback')}</h3>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 text-gray-400 shrink-0" />
                    </div>
                    <p className="text-[14px] text-gray-500 mb-1 truncate">{t('nextCleaning')}</p>
                    <div className="flex items-center gap-2 mb-1 w-full">
                      <div className="bg-[#F3F4F6] rounded-lg p-2 flex items-start gap-1 flex-1 overflow-hidden">
                        <HugeiconsIcon icon={Calendar01Icon} className="w-5 h-5 text-gray-500 shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[12px] text-gray-500 leading-none mb-1">{t('dateLabel')}</span>
                          <span className="text-[12px] font-bold text-gray-800 leading-tight truncate">{formatDate(item.recommendedDate)}</span>
                        </div>
                      </div>
                      <div className="bg-[#F3F4F6] rounded-lg p-2 flex items-start gap-1 flex-1 overflow-hidden">
                        <HugeiconsIcon icon={Time02Icon} className="w-5 h-5 text-gray-500 shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[12px] text-gray-500 leading-none mb-1">{t('timeSlotLabel')}</span>
                          <span className="text-[12px] font-bold text-gray-800 leading-tight truncate">
                            {item.checkInTime || '—'}{item.checkOutTime ? ` - ${item.checkOutTime}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    {item.cleaner && (
                      <div className="flex items-center gap-3 mt-auto pt-1">
                        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden relative shrink-0">
                          <AppImage src={avatarOf(item.cleaner)} alt="Avatar" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[15px] font-bold text-gray-900 leading-tight mb-0.5">{nameOf(item.cleaner)}</span>
                          <span className="text-[13px] text-gray-500 leading-tight">{t('assignedCleaner')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
        </section>

        {/* To Do Section */}
        <section className="mb-20">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{t('todoTitle')}</h2>
          <p className="text-[13px] text-gray-500 mb-6">{t('todoSubtitle')}</p>

          {isLoading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-3 w-20 rounded" />
                      <Skeleton className="h-3.5 w-32 rounded" />
                      <div className="flex items-center gap-1.5">
                        <SkeletonCircle size={20} />
                        <Skeleton className="h-3 w-16 rounded" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              ))}
            </div>
          ) : todoData.length > 0 ? (
            <div className="flex flex-col gap-4">
              {todoData.map((task, index) => (
                <div
                  key={task.scheduleId || task.assignmentId || index}
                  onClick={() => router.push(todoTarget(task))}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 relative shrink-0">
                      <AppImage src={photoOf(task.accommodation)} alt="Room" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-[12px] font-medium ${isNegative(task.status) ? 'text-red-500' : 'text-gray-500'}`}>{task.label}</span>
                      <span className="text-[15px] font-bold text-gray-900 mb-0.5">{task.accommodation?.name || t('accommodationFallback')}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gray-300 overflow-hidden relative">
                          <AppImage src={avatarOf(task.cleaner)} alt="Avatar" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                        </div>
                        <span className="text-[11px] text-gray-700 font-medium">{nameOf(task.cleaner)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] text-gray-500 font-medium hidden sm:block">{timeAgo(task.timestamp, t)}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}

              {/* Pagination controls */}
              {totalTodoPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => setTodoPage((p) => Math.max(1, p - 1))}
                    disabled={todoPage === 1 || isFetching}
                    className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
                  </button>
                  <span className="text-[13px] font-medium text-gray-600 px-2">{todoPage} / {totalTodoPages}</span>
                  <button
                    onClick={() => setTodoPage((p) => Math.min(totalTodoPages, p + 1))}
                    disabled={todoPage === totalTodoPages || isFetching}
                    className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex items-center justify-center">
              <div className="flex items-center gap-6">
                <AppImage src="/homeempty2.jpg" alt="No pending tasks" width={120} height={120} className="w-24 h-auto" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-gray-500 font-medium mb-1">{t('noTaskLabel')}</span>
                  <span className="text-[16px] font-bold text-gray-900 leading-snug">{t('noPendingTask')}</span>
                  <span className="text-[14px] text-gray-500 leading-snug">{t('enjoyTime')}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
