'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { notificationApi, type AppNotification } from '@/store/api/notificationApi';

/**
 * Keeps the host's notification cache live over Socket.io.
 *
 * The website (host on web) receives IN-APP notifications only — no OneSignal
 * push. Push is reserved for the host/cleaner mobile app, which registers a
 * device token separately. Mount this once in the dashboard layout.
 *
 * @param onNew optional callback (e.g. to pop a toast) when a fresh one arrives.
 */
export function useNotifications(onNew?: (n: AppNotification) => void) {
  const token = useAppSelector((s) => s.auth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) return;
    const socket = getSocket(token);

    const refresh = () =>
      dispatch(notificationApi.util.invalidateTags(['Notification']));

    const handleNew = (n: AppNotification) => {
      onNew?.(n);
      refresh();
    };

    socket.on('notification:new', handleNew);
    socket.on('notification:unreadCount', refresh);

    return () => {
      socket.off('notification:new', handleNew);
      socket.off('notification:unreadCount', refresh);
    };
  }, [token, dispatch, onNew]);
}
