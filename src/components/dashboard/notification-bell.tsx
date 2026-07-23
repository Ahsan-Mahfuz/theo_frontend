'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BellRingIcon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { useLocale } from 'next-intl';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from '@/store/api/notificationApi';
import { useNotifications } from '@/hooks/useNotifications';
import { notificationColor, timeAgo, notificationHref } from '@/lib/notificationMeta';
import type { AppNotification } from '@/store/api/notificationApi';

export function NotificationBell() {
  const router = useRouter();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // keep the badge + list live over the socket
  useNotifications();

  const { data, isLoading } = useGetNotificationsQuery({ page: 1, limit: 8, lang: locale });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: markingAll }] =
    useMarkAllNotificationsReadMutation();

  const items = data?.data ?? [];
  const unread = data?.unreadCount ?? 0;

  // shake the bell whenever a new notification bumps the unread count
  const [shake, setShake] = useState(false);
  const prevUnread = useRef(unread);
  useEffect(() => {
    if (unread > prevUnread.current) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 900);
      prevUnread.current = unread;
      return () => clearTimeout(t);
    }
    prevUnread.current = unread;
  }, [unread]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const openItem = (n: AppNotification) => {
    if (!n.isRead) markRead(n._id);
    setOpen(false);
    router.push(notificationHref(n));
  };

  return (
    <div className="relative" ref={ref}>
      <style jsx>{`
        @keyframes bell-shake {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-12deg); }
          45% { transform: rotate(9deg); }
          60% { transform: rotate(-6deg); }
          75% { transform: rotate(3deg); }
        }
        :global(.bell-shake) {
          animation: bell-shake 0.9s ease-in-out;
        }
      `}</style>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 cursor-pointer"
        aria-label="Notifications"
      >
        <HugeiconsIcon
          icon={BellRingIcon}
          className={`h-[22px] w-[22px] origin-top ${shake ? 'bell-shake' : ''}`}
        />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#0084FF] px-1 text-[10px] font-bold text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[120%] z-50 w-[360px] max-w-[90vw] rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-200">
          <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="font-bold text-[#4B443B]">Notifications</span>
            {unread > 0 && (
              <button
                disabled={markingAll}
                onClick={() => markAllRead()}
                className="flex items-center gap-1 text-xs font-semibold text-[#0084FF] hover:underline disabled:opacity-50 cursor-pointer"
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>

          <div className="-mx-1 max-h-[380px] overflow-y-auto">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 px-3 py-2.5">
                  <span className="mt-0.5 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-11/12 animate-pulse rounded bg-gray-100" />
                    <div className="h-2.5 w-12 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ))
            ) : items.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                You&apos;re all caught up 🎉
              </div>
            ) : (
              items.map((n) => (
                <button
                  key={n._id}
                  onClick={() => openItem(n)}
                  className={`flex w-full gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50 ${
                    n.isRead ? '' : 'bg-blue-50/60'
                  }`}
                >
                  <span
                    className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: notificationColor(n.type) }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#4B443B]">
                      {n.title}
                    </span>
                    <span className="block line-clamp-2 text-xs text-gray-500">
                      {n.message}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {timeAgo(n.createdAt)}
                    </span>
                  </span>
                  {!n.isRead && (
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0084FF]" />
                  )}
                </button>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 pt-2 text-center">
            <button
              onClick={() => {
                setOpen(false);
                router.push('/dashboard/notifications');
              }}
              className="text-sm font-semibold text-[#0084FF] hover:underline cursor-pointer"
            >
              See all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
