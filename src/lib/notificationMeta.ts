// Shared presentation helpers for notifications (icon accent + relative time).

export const notificationColor = (type: string): string => {
  switch (type) {
    case 'assignment_request':
    case 'assignment_response':
    case 'schedule_created':
    case 'proof_submitted':
    case 'task_completed':
      return '#0084FF';
    case 'payment_received':
      return '#16A34A';
    case 'dispute':
      return '#DC2626';
    case 'message':
      return '#7C3AED';
    default:
      return '#64748B';
  }
};

/**
 * Where a notification should take the host when tapped. Resolves by the ids
 * carried in `data` (set by the backend): a chat message opens the thread, any
 * schedule-related event opens that task (which shows the accommodation +
 * status), and a bare accommodation link opens the housing page. Falls back to
 * the full notifications list when there's nothing specific to open.
 */
export const notificationHref = (n: {
  type: string;
  data?: Record<string, unknown> | null;
}): string => {
  const d = (n.data ?? {}) as Record<string, string>;

  if (n.type === 'message' || d.conversationId) {
    return d.conversationId
      ? `/dashboard/message?conversationId=${d.conversationId}`
      : '/dashboard/message';
  }
  if (d.scheduleId) return `/dashboard/tasks/${d.scheduleId}`;
  if (d.accommodationId) return `/dashboard/housing/${d.accommodationId}`;
  return '/dashboard/notifications';
};

export const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diff / 1000);
  if (sec < 60) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
};
