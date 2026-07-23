'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  ArrowLeft02Icon,
} from '@hugeicons/core-free-icons';
import { useLocale } from 'next-intl';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} from '@/store/api/notificationApi';
import { useNotifications } from '@/hooks/useNotifications';
import { notificationColor, timeAgo, notificationHref } from '@/lib/notificationMeta';
import type { AppNotification } from '@/store/api/notificationApi';

const LIMIT = 12;

export default function NotificationsPage() {
  const router = useRouter();
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useNotifications(); // keep live

  const { data, isLoading, isFetching } = useGetNotificationsQuery({
    page,
    limit: LIMIT,
    lang: locale,
    ...(filter === 'unread' ? { isRead: false } : {}),
  });

  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: markingAll }] =
    useMarkAllNotificationsReadMutation();
  const [remove] = useDeleteNotificationMutation();

  const openItem = (n: AppNotification) => {
    if (!n.isRead) markRead(n._id);
    router.push(notificationHref(n));
  };

  const items = data?.data ?? [];
  const unread = data?.unreadCount ?? 0;
  const totalPages = data?.meta?.totalPage ?? 1;

  return (
    <div className="px-4 py-6 md:px-8">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 cursor-pointer"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} className="h-4 w-4" /> Back
      </button>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#4B443B]">Notifications</h1>
          <p className="text-sm text-gray-500">
            {unread > 0 ? `${unread} unread` : "You're all caught up"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-gray-100 p-1">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors cursor-pointer ${
                  filter === f
                    ? 'bg-white text-[#0084FF] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            disabled={unread === 0 || markingAll}
            onClick={() => markAllRead()}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" />
            Mark all read
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
        {isLoading || isFetching ? (
          <ul className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex items-start gap-4 px-3 py-4">
                <span className="mt-1.5 h-3 w-3 shrink-0 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                </div>
              </li>
            ))}
          </ul>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            {filter === 'unread'
              ? 'No unread notifications'
              : 'No notifications yet'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {items.map((n) => (
              <li
                key={n._id}
                className={`group flex items-start gap-4 rounded-xl px-3 py-4 transition-colors hover:bg-gray-50 ${
                  n.isRead ? '' : 'bg-blue-50/40'
                }`}
              >
                <span
                  className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: notificationColor(n.type) }}
                />
                <div
                  className="min-w-0 flex-1 cursor-pointer"
                  onClick={() => openItem(n)}
                >
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#4B443B]">{n.title}</p>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-[#0084FF]" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <span className="text-xs text-gray-400">
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {!n.isRead && (
                    <button
                      onClick={() => markRead(n._id)}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-[#0084FF] hover:bg-blue-50 cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => remove(n._id)}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 cursor-pointer"
                    aria-label="Delete"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium disabled:opacity-40 cursor-pointer hover:bg-gray-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium disabled:opacity-40 cursor-pointer hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
