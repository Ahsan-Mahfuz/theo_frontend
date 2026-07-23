'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { formatDate, todayInput } from '@/lib/datetime';
import {
  Location01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Add01Icon,
  RefreshIcon,
  PencilEdit01Icon,
  Delete02Icon,
  Cancel01Icon,
  Clock01Icon,
  Link01Icon,
  CheckmarkCircle01Icon,
  Coins01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';
import { TimePickerDropdown } from '@/components/ui/time-picker';
import { useGetPlanningQuery } from '@/store/api/accommodationApi';
import {
  useGetConnectionsQuery,
  useAddConnectionMutation,
  useRemoveConnectionMutation,
  useSyncCalendarsMutation,
  useGetCalendarMonthQuery,
} from '@/store/api/calendarApi';
import {
  useGetHostSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useInitiateHandCashMutation,
} from '@/store/api/scheduleApi';
import type { Accommodation, AssignedCleaner } from '@/store/types';
import { resolveAssetUrl } from '@/lib/config';
import { getApiErrorMessage } from '@/lib/apiError';

const FALLBACK_ROOM =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500';
const avatarFor = (name: string) =>
  `https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=${encodeURIComponent(name || 'Cleaner')}`;

type PlatformKey = 'airbnb' | 'booking' | 'vrbo';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface MonthData {
  year: number;
  month: number;
  bookings: { _id: string; platform: string; summary?: string; startDate: string; endDate: string }[];
  schedules: {
    _id: string;
    date: string;
    checkInTime: string;
    checkOutTime: string;
    status: string;
    paymentStatus?: string;
    booking?: string | null;
    cleaner?: any;
    notes?: string;
    refusedAt?: string;
  }[];
}

// Pill colours for a cleaning schedule status.
const SCHED_STATUS: Record<string, string> = {
  scheduled: 'bg-[#FFF7E6] text-[#D48806]',
  accepted: 'bg-[#E5F9F1] text-[#48C79D]',
  in_progress: 'bg-[#E6F0FF] text-[#0084FF]',
  proof_submitted: 'bg-[#F3E8FF] text-[#7C3AED]',
  completed: 'bg-[#E5F9F1] text-[#137333]',
  refused: 'bg-[#FFF0F0] text-[#FF4D4F]',
  disputed: 'bg-[#FFF0F0] text-[#FF4D4F]',
  cancelled: 'bg-gray-100 text-gray-500',
};

// Booking platform → dot colour on occupied calendar days.
const PLATFORM_DOT: Record<string, string> = {
  airbnb: 'bg-[#FF5A5F]',
  booking: 'bg-[#0071C2]',
  vrbo: 'bg-[#002B49]',
};
const platformDot = (platform?: string) =>
  (platform && PLATFORM_DOT[platform]) || 'bg-gray-400';

const ringFor = (status: string) => {
  if (status === 'accepted' || status === 'completed') return 'ring-[#48C79D]';
  if (status === 'refused' || status === 'disputed') return 'ring-[#FF4D4F]';
  if (status === 'scheduled') return 'ring-[#D48806]';
  return 'ring-[#0084FF]';
};

// Payment state helpers. The cleaner's acceptance is the gate to paying; once
// the payment is held (or released) the host has paid.
const isPaid = (s: any) => s?.paymentStatus === 'paid_held' || s?.paymentStatus === 'released' || s?.paymentStatus === 'paid_handcash';
// Host can pay at any point after the cleaner accepts — including after the job
// is marked completed (proof_submitted → completed) — as long as they haven't
// actually paid yet.
const PAYABLE_STATUSES = ['accepted', 'in_progress', 'proof_submitted', 'completed'];
const needsPayment = (s: any) => PAYABLE_STATUSES.includes(s?.status) && !isPaid(s) && s?.paymentStatus !== 'handcash_pending';

// Deleting is allowed right up until the host pays — including a cleaning the
// cleaner already accepted, which the host may have booked by mistake. Paying
// locks it (mirrors the backend rule). Editing stays stricter: only while the
// cleaner hasn't responded yet.
const DELETABLE_STATUSES = ['scheduled', 'accepted', 'refused', 'cancelled'];
const canDelete = (s: any) => !isPaid(s) && DELETABLE_STATUSES.includes(s?.status) && s?.paymentStatus !== 'handcash_pending';

// Small corner badge on a calendar avatar: clock (awaiting), € (pay now),
// check (paid / completed-and-paid).
const badgeFor = (s: any): { icon: any; cls: string } | null => {
  if (s.status === 'scheduled') return { icon: Clock01Icon, cls: 'bg-[#D48806]' };
  if (needsPayment(s)) return { icon: Coins01Icon, cls: 'bg-[#0084FF]' };
  if (isPaid(s)) return { icon: CheckmarkCircle01Icon, cls: 'bg-[#48C79D]' };
  return null;
};

// List-view filter tabs → backend `view` buckets. 'all' sends no view param.
type ListFilter = 'all' | 'awaiting' | 'accepted' | 'pay_now' | 'paid';
const LIST_FILTERS: { key: ListFilter; labelKey: string }[] = [
  { key: 'all', labelKey: 'filterAll' },
  { key: 'awaiting', labelKey: 'filterAwaiting' },
  { key: 'accepted', labelKey: 'filterAccepted' },
  { key: 'pay_now', labelKey: 'filterPayNow' },
  { key: 'paid', labelKey: 'filterPaid' },
];

// Client-side gate for the list tabs. Mirrors the backend `view` buckets so the
// filter is correct even if the API ignores/lags the `view` param.
const matchesListFilter = (s: any, f: ListFilter): boolean => {
  switch (f) {
    case 'awaiting': return s.status === 'scheduled';
    // "Accepted" = cleaner accepted but the host hasn't paid yet.
    case 'accepted': return s.status === 'accepted' && !isPaid(s);
    // "Pay now" covers any status where payment is still due (including completed).
    case 'pay_now': return needsPayment(s);
    case 'paid': return isPaid(s);
    default: return true;
  }
};

const cleanerNameOf = (cl: any, fallback: string) =>
  cl?.name || `${cl?.firstName ?? ''} ${cl?.lastName ?? ''}`.trim() || fallback;

const cleanerAvatarOf = (cl: any, fallback: string) =>
  resolveAssetUrl(cl?.profileImage) || avatarFor(cleanerNameOf(cl, fallback));

// Local YYYY-MM-DD (avoids the UTC shift of toISOString on a midnight-local date).
const toDateInput = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// ─── Schedule create/edit modal ───────────────────────────────────────────────
interface ModalState {
  open: boolean;
  editing?: any | null;
  date?: string;
  bookingId?: string;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
  // pre-select this cleaner on open (used when re-scheduling)
  cleanerId?: string;
  // default the cleaner picker away from this cleaner (the one who refused)
  excludeCleanerId?: string;
}

function ScheduleModal({
  state,
  onClose,
  accommodationId,
  cleaners,
  accommodation,
}: {
  state: ModalState;
  onClose: () => void;
  accommodationId: string;
  cleaners: AssignedCleaner[];
  accommodation?: Accommodation;
}) {
  const t = useTranslations('Planning');
  const c = useTranslations('Common');
  const [createSchedule, { isLoading: creating }] = useCreateScheduleMutation();
  const [updateSchedule, { isLoading: updating }] = useUpdateScheduleMutation();

  const [cleanerId, setCleanerId] = useState('');
  const [date, setDate] = useState('');
  const [checkIn, setCheckIn] = useState('10:00');
  const [checkOut, setCheckOut] = useState('14:00');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const editing = state.editing;

  useEffect(() => {
    if (!state.open) return;
    setError('');

    if (editing) {
      setCleanerId(String(editing.cleaner?._id || editing.cleaner || ''));
      setDate(toDateInput(editing.date));
      setCheckIn(editing.checkInTime || '10:00');
      setCheckOut(editing.checkOutTime || '14:00');
      setNotes(editing.notes || '');
    } else {
      // Re-schedule prefill: pick the requested cleaner, else the first cleaner
      // that isn't the one who refused, else just the first accepted cleaner.
      const preferred =
        state.cleanerId ||
        cleaners.find((cl) => String(cl.cleaner?._id ?? '') !== state.excludeCleanerId)?.cleaner?._id ||
        cleaners[0]?.cleaner?._id;
      setCleanerId(preferred ? String(preferred) : '');
      setDate(state.date || '');
      setCheckIn(state.checkIn || accommodation?.checkInTime || '10:00');
      setCheckOut(state.checkOut || accommodation?.checkOutTime || '14:00');
      setNotes(state.notes || '');
    }
  }, [
    state.open,
    editing,
    state.date,
    state.checkIn,
    state.checkOut,
    state.notes,
    state.cleanerId,
    state.excludeCleanerId,
    cleaners,
    accommodation,
  ]);

  if (!state.open) return null;

  const submit = async () => {
    setError('');
    if (!cleanerId || !date) {
      setError(t('createError'));
      return;
    }

    try {
      if (editing) {
        await updateSchedule({
          id: editing._id,
          cleanerId,
          date,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          notes,
        }).unwrap();
      } else {
        await createSchedule({
          accommodationId,
          cleanerId,
          date,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          notes,
          bookingId: state.bookingId,
        }).unwrap();
      }
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const busy = creating || updating;
  const inputClass =
    'h-11 px-4 rounded-xl bg-[#F8F9FA] border border-transparent text-[13px] text-gray-900 focus:bg-white focus:border-[#0084FF] outline-none transition-all w-full';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
      <div className="bg-white rounded-[20px] w-full max-w-[460px] p-6 shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold text-gray-900">
            {editing ? t('editCleaning') : t('scheduleCleaning')}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
          </button>
        </div>

        {cleaners.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <p className="text-[13px] text-gray-500 text-center">{t('noAcceptedCleaner')}</p>
            {accommodationId && (
              <Link
                href={`/dashboard/housing/${accommodationId}/cleaners`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#0084FF] text-white text-[12px] font-medium hover:bg-[#0073E6]"
              >
                <HugeiconsIcon icon={UserGroupIcon} className="w-4 h-4" />
                {t('manageCleaners')}
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-medium text-gray-700">{t('cleaner')}</label>
                {accommodationId && (
                  <Link
                    href={`/dashboard/housing/${accommodationId}/cleaners`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0084FF] hover:underline"
                  >
                    <HugeiconsIcon icon={UserGroupIcon} className="w-3.5 h-3.5" />
                    {t('manageCleaners')}
                  </Link>
                )}
              </div>
              <select value={cleanerId} onChange={(e) => setCleanerId(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                {cleaners.map((cl) => (
                  <option key={cl.assignmentId} value={String(cl.cleaner?._id ?? '')}>
                    {cleanerNameOf(cl.cleaner, t('cleaner'))} ({cl.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-gray-700">{t('dateLabel')}</label>
              <input type="date" value={date} min={todayInput()} onChange={(e) => setDate(e.target.value)} className={inputClass} />
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[12px] font-medium text-gray-700">{t('checkIn')}</label>
                <div className="w-full">
                  <TimePickerDropdown value={checkIn} onChange={setCheckIn} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[12px] font-medium text-gray-700">{t('checkOut')}</label>
                <div className="w-full">
                  <TimePickerDropdown value={checkOut} onChange={setCheckOut} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-gray-700">{t('notesLabel')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('notesPlaceholder')}
                className="h-20 p-4 rounded-xl bg-[#F8F9FA] border border-transparent text-[13px] text-gray-900 focus:bg-white focus:border-[#0084FF] outline-none resize-none"
              />
            </div>

            {error && <p className="text-[12px] text-red-600">{error}</p>}

            <div className="flex gap-3 mt-1">
              <button onClick={onClose} className="flex-1 h-11 rounded-xl bg-white border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50">
                {c('cancel')}
              </button>
              <button
                onClick={submit}
                disabled={busy}
                className="flex-1 h-11 rounded-xl bg-[#0084FF] text-white text-[13px] font-medium hover:bg-[#0073E6] disabled:opacity-60"
              >
                {busy ? c('saving') : editing ? c('saveChanges') : t('createCleaning')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlanningPage() {
  const t = useTranslations('Planning');
  const c = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Deep-link support: /dashboard/planning?filter=paid opens the List view on
  // that tab (used after a successful payment to land the host on "Paid").
  const filterParam = searchParams.get('filter') as ListFilter | null;
  const initialFilter: ListFilter =
    filterParam && LIST_FILTERS.some((f) => f.key === filterParam) ? filterParam : 'all';

  const [selectedAccId, setSelectedAccId] = useState<string>('');
  const [viewType, setViewType] = useState<'calendrier' | 'liste'>(
    filterParam ? 'liste' : 'calendrier',
  );
  const [listFilter, setListFilter] = useState<ListFilter>(initialFilter);
  const [showConnect, setShowConnect] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [icalInputs, setIcalInputs] = useState<Record<PlatformKey, string>>({ airbnb: '', booking: '', vrbo: '' });
  const [detail, setDetail] = useState<any | null>(null); // schedule shown in the detail popover
  const [deleteId, setDeleteId] = useState<string | null>(null); // schedule pending delete confirmation
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12

  const [modal, setModal] = useState<ModalState>({ open: false });

  // ── Data ────────────────────────────────────────────────────────────────────
  const {
    data: accommodations,
    isLoading: accLoading,
    isError: accError,
    error: accErrObj,
  } = useGetPlanningQuery({ page: 1, limit: 20 });
  const accList = (accommodations?.data ?? []) as Accommodation[];

  useEffect(() => {
    if (!selectedAccId && accList.length > 0) setSelectedAccId(accList[0]._id);
  }, [accList, selectedAccId]);

  const selectedAcc = accList.find((a) => a._id === selectedAccId);
  // Memoized so the reference is stable — the schedule modal's reset effect
  // depends on it and must not re-fire (wiping the form) on background refetches.
  const acceptedCleaners = useMemo(
    () => (selectedAcc?.assignedCleaners ?? []).filter((cl) => cl.status === 'accepted' && cl.cleaner),
    [selectedAcc],
  );

  const { data: connections, isLoading: connLoading } = useGetConnectionsQuery(selectedAccId, {
    skip: !selectedAccId,
  });
  const { data: monthDataRaw, isFetching: monthLoading } = useGetCalendarMonthQuery(
    { accommodationId: selectedAccId, year, month },
    { skip: !selectedAccId },
  );
  const { data: scheduleList, isLoading: schedLoading, isFetching: schedFetching } =
    useGetHostSchedulesQuery(
      {
        accommodationId: selectedAccId,
        limit: 100,
        view: listFilter === 'all' ? undefined : listFilter,
      },
      { skip: !selectedAccId },
    );

  const [addConnection, { isLoading: adding }] = useAddConnectionMutation();
  const [removeConnection] = useRemoveConnectionMutation();
  const [syncCalendars, { isLoading: syncing }] = useSyncCalendarsMutation();
  const [deleteSchedule, { isLoading: deleting }] = useDeleteScheduleMutation();
  const [initiateHandCash, { isLoading: initiatingHandCash }] = useInitiateHandCashMutation();

  const monthData = monthDataRaw as MonthData | undefined;
  const hasConnections = (connections?.length ?? 0) > 0;
  const schedules = scheduleList?.data ?? [];
  // Apply the active tab as a definitive client-side gate (the API also filters,
  // but this guarantees the tab is always correct).
  const visibleSchedules = useMemo(
    () => (schedules as any[]).filter((s) => matchesListFilter(s, listFilter)),
    [schedules, listFilter],
  );

  const monthLabel = useMemo(
    () => new Date(year, month - 1, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
    [year, month, locale],
  );

  // Per-day maps for the calendar grid. A booking [startDate, endDate) keeps the
  // guest in the unit on every night from startDate up to — but not including —
  // the checkout day (endDate). The checkout day is left free: that's when the
  // cleaning is meant to happen, so we mark it distinctly rather than as booked.
  const { bookedDays, checkoutDays, platformByDay, schedByDay, daysInMonth, leadingBlanks } =
    useMemo(() => {
      const dim = new Date(year, month, 0).getDate();
      const booked = new Set<number>();
      const checkout = new Set<number>();
      const platform = new Map<number, string>();
      const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
      for (const b of monthData?.bookings ?? []) {
        const s = startOfDay(new Date(b.startDate));
        const e = startOfDay(new Date(b.endDate)); // checkout day = free
        for (let d = 1; d <= dim; d++) {
          const day = new Date(year, month - 1, d);
          if (day >= s && day < e) {
            booked.add(d);
            platform.set(d, b.platform);
          }
        }
        // Flag the checkout day if it lands in this month (and isn't itself the
        // start of a back-to-back booking, in which case it stays occupied).
        if (e.getFullYear() === year && e.getMonth() === month - 1) checkout.add(e.getDate());
      }
      // When checkout and checkin fall on the same day (back-to-back, e.g.
      // 12:00 PM checkout → 12:00 PM check-in), both events happened: keep the
      // checkout badge visible and remove that day from "booked" so the calendar
      // correctly shows "Checkout" instead of "Occupied".
      for (const d of checkout) booked.delete(d);
      // One schedule shown per day. When a day holds both a refused/cancelled
      // schedule and a live one (host re-scheduled another cleaner), the live one
      // wins so the calendar reflects the current cleaning.
      const isDead = (s: MonthData['schedules'][number]) =>
        s.status === 'refused' || s.status === 'cancelled';
      const byDay = new Map<number, MonthData['schedules'][number]>();
      for (const sc of monthData?.schedules ?? []) {
        const d = new Date(sc.date);
        if (d.getFullYear() !== year || d.getMonth() !== month - 1) continue;
        const day = d.getDate();
        const existing = byDay.get(day);
        if (!existing || !isDead(sc) || isDead(existing)) byDay.set(day, sc);
      }
      const firstIdx = (new Date(year, month - 1, 1).getDay() + 6) % 7; // Mon=0
      return {
        bookedDays: booked,
        checkoutDays: checkout,
        platformByDay: platform,
        schedByDay: byDay,
        daysInMonth: dim,
        leadingBlanks: firstIdx,
      };
    }, [monthData, year, month]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const goMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setMonth(m);
    setYear(y);
  };

  const handleSaveConnection = async (platform: PlatformKey) => {
    setFormError(null);
    const icalUrl = icalInputs[platform].trim();
    if (!icalUrl || !selectedAccId) {
      setFormError(t('enterIcalFirst'));
      return;
    }
    try {
      await addConnection({ accommodationId: selectedAccId, platform, icalUrl }).unwrap();
      setIcalInputs((prev) => ({ ...prev, [platform]: '' }));
      setShowConnect(false);
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    }
  };

  const handleSync = async () => {
    if (!selectedAccId) return;
    try { await syncCalendars(selectedAccId).unwrap(); } catch { /* surfaced via status */ }
  };

  const openCreate = (opts: { date?: string; bookingId?: string; checkIn?: string; checkOut?: string } = {}) =>
    setModal({ open: true, editing: null, ...opts });
  const openEdit = (schedule: any) => setModal({ open: true, editing: schedule });

  // A cleaner refused (or the host cancelled) this cleaning: open a fresh create
  // form pre-filled with the same day/time/notes, defaulting to a different
  // cleaner. The host can still edit any field before creating.
  const openReschedule = (s: any) => {
    setDetail(null);
    setModal({
      open: true,
      editing: null,
      date: toDateInput(s.date),
      checkIn: s.checkInTime,
      checkOut: s.checkOutTime,
      notes: s.notes || '',
      bookingId: s.booking ? String(s.booking) : undefined,
      excludeCleanerId: String(s.cleaner?._id || s.cleaner || ''),
    });
  };

  // Ask for confirmation via the in-app modal (not the native browser dialog).
  const handleDeleteSchedule = (id: string) => {
    setDeleteError(null);
    setDeleteId(id);
  };

  // Confirm → delete, then RTK Query tag invalidation refetches the list/calendar.
  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleteError(null);
    try {
      await deleteSchedule(deleteId).unwrap();
      setDeleteId(null);
    } catch (err) {
      setDeleteError(getApiErrorMessage(err));
    }
  };

  // Host pays for an accepted schedule via the existing Stripe payment page.
  const goPay = (s: any) =>
    router.push(`/dashboard/housing/${selectedAccId}/payment?scheduleId=${s._id}`);

  const dayInput = (d: number) =>
    `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  // Same YYYY-MM-DD shape as dayInput, so calendar cells can be compared to it
  // directly to find the days that have already passed.
  const today = todayInput();

  // Connecting a calendar is always optional: every accommodation shows the
  // Calendar/List by default, and the connect form only opens on demand (via the
  // "manage calendars" button). We never force it just because nothing is connected.
  const showConnectForm = !!selectedAccId && !connLoading && showConnect;

  return (
    <main className="w-full px-8 py-10 animate-in fade-in duration-500 mx-auto">
      <div className="mb-10">
        <h1 className="text-[32px] font-bold text-gray-900">{t('title')}</h1>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">

        {/* Left — accommodation list (bounded, self-scrolling, sticky on wide screens) */}
        <div className="w-full xl:w-[360px] shrink-0 flex flex-col gap-4 xl:sticky xl:top-6 xl:max-h-[calc(100vh-140px)] xl:overflow-y-auto xl:pr-1.5 scrollbar-slim">
          {accLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl p-3 flex items-center gap-4 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <Skeleton className="w-[140px] h-[90px] rounded-[14px] shrink-0" />
                <div className="flex flex-col py-1 gap-2">
                  <Skeleton className="h-3.5 w-32 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
            ))}
          {accError && !accLoading && (
            <div className="py-16 text-center text-[13px] text-red-500">{getApiErrorMessage(accErrObj)}</div>
          )}
          {!accLoading && !accError && accList.length === 0 && (
            <div className="py-16 text-center text-[13px] text-gray-400">{t('noProperties')}</div>
          )}
          {!accLoading && !accError && accList.map((acc) => {
            const photo = acc.photos?.[0] ? resolveAssetUrl(acc.photos[0]) : FALLBACK_ROOM;
            const active = selectedAccId === acc._id;
            return (
              <div
                key={acc._id}
                onClick={() => { setSelectedAccId(acc._id); setShowConnect(false); }}
                className={`rounded-3xl p-3 flex items-center gap-4 transition-colors cursor-pointer border ${active ? 'bg-[#F4F4F5] border-transparent' : 'bg-white border-gray-100 hover:border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'}`}
              >
                <div className="w-[140px] h-[90px] rounded-[14px] overflow-hidden relative shrink-0">
                  <AppImage src={photo} alt={acc.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col py-1 min-w-0 flex-1">
                  <h3 className="text-[14px] font-bold text-gray-900 mb-1 truncate">{acc.name}</h3>
                  <div className="flex items-center gap-1.5 mb-2">
                    <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-[12px] text-gray-500 truncate">{acc.city || t('location')}</span>
                  </div>
                  {active && (
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/housing/${acc._id}`} onClick={(e) => e.stopPropagation()} className="text-[11px] font-semibold text-[#0084FF] hover:underline">
                        {t('viewDetails')}
                      </Link>
                      <span className="text-gray-300">·</span>
                      <Link href={`/dashboard/housing/${acc._id}/edit`} onClick={(e) => e.stopPropagation()} className="text-[11px] font-semibold text-gray-500 hover:underline">
                        {t('editAccommodation')}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right — view area */}
        <div className="flex-1 w-full bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 min-h-[600px] p-8">

          {(!selectedAccId || connLoading) && (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px] text-[13px] text-gray-400">
              {connLoading ? t('loadingCalendars') : t('selectProperty')}
            </div>
          )}

          {/* Connect calendars */}
          {showConnectForm && (
            <div className="w-full flex flex-col p-4 max-w-[800px] mx-auto animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[16px] font-bold text-gray-900">{t('connectMyCalendars')}</h2>
                <button onClick={() => setShowConnect(false)} className="text-[11px] font-medium text-gray-500 hover:text-gray-800">
                  {t('backToCalendar')}
                </button>
              </div>
              <p className="text-[12px] text-gray-500 mb-6">{t('pasteIcalDescription')}</p>

              {/* Already-connected feeds */}
              {hasConnections && (
                <div className="flex flex-col gap-2 mb-8">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{t('connectedCalendars')}</span>
                  {connections!.map((conn) => (
                    <div key={conn._id} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#F8F9FA]">
                      <div className="flex items-center gap-2 min-w-0">
                        <HugeiconsIcon icon={Link01Icon} className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-[12px] font-semibold text-gray-800 capitalize">{conn.platform}</span>
                        <span className="text-[11px] text-gray-400 truncate">{conn.icalUrl}</span>
                      </div>
                      <button onClick={() => removeConnection(conn._id)} className="text-[11px] font-medium text-red-500 hover:underline shrink-0 ml-3">
                        {c('remove')}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formError && <div className="text-[11px] text-red-500 mb-4">{formError}</div>}

              <div className="flex flex-col gap-6">
                {([
                  { name: 'Airbnb', key: 'airbnb' as PlatformKey, color: 'bg-red-50 text-red-500' },
                  { name: 'Booking.com', key: 'booking' as PlatformKey, color: 'bg-blue-50 text-blue-600' },
                  { name: 'Vrbo', key: 'vrbo' as PlatformKey, color: 'bg-[#002B49] text-white' },
                ]).map((plat) => (
                  <div key={plat.key} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${plat.color}`}>{plat.name[0]}</div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-gray-900">{plat.name}</span>
                          <span className="text-[10px] text-gray-400">{t('pasteIcalUrl')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSaveConnection(plat.key)}
                        disabled={adding}
                        className="h-8 px-4 rounded-lg bg-[#E6F4EA] text-[11px] font-medium text-[#137333] hover:bg-[#CEEAD6] transition-colors disabled:opacity-60"
                      >
                        {adding ? t('saving') : c('save')}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={icalInputs[plat.key]}
                      onChange={(e) => setIcalInputs((prev) => ({ ...prev, [plat.key]: e.target.value }))}
                      placeholder={t('urlPlaceholder')}
                      className="w-full h-10 px-4 rounded-xl border border-gray-200 text-[12px] text-gray-800 outline-none focus:border-gray-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar / List */}
          {selectedAccId && !connLoading && !showConnectForm && (
            <div className="w-full flex flex-col h-full animate-in fade-in duration-300">

              {/* Segmented control + connect button */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex-1 max-w-[420px] mx-auto h-12 bg-[#F4F4F5] rounded-2xl p-1 flex items-center">
                  <button
                    onClick={() => setViewType('calendrier')}
                    className={`flex-1 h-full rounded-xl text-[12px] font-medium transition-colors ${viewType === 'calendrier' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {t('calendarView')}
                  </button>
                  <button
                    onClick={() => setViewType('liste')}
                    className={`flex-1 h-full rounded-xl text-[12px] font-medium transition-colors ${viewType === 'liste' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {t('listView')}
                  </button>
                </div>
                <button
                  onClick={() => setShowConnect(true)}
                  className="h-10 px-3 rounded-xl bg-white border border-gray-200 flex items-center gap-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50 shrink-0"
                >
                  <HugeiconsIcon icon={Link01Icon} className="w-4 h-4 text-gray-400" />
                  {t('manageCalendars')}
                </button>
              </div>

              {/* Month navigation */}
              <div className="flex items-center justify-between px-4 mb-8">
                <button onClick={() => goMonth(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400">
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
                </button>
                <span className="text-[14px] font-bold text-gray-900 capitalize">{monthLabel}</span>
                <div className="flex items-center gap-1">
                  <button onClick={handleSync} disabled={syncing} title={t('syncCalendars')} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 disabled:opacity-50">
                    <HugeiconsIcon icon={RefreshIcon} className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  </button>
                  <button onClick={() => goMonth(1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400">
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Calendar view */}
              {viewType === 'calendrier' ? (
                <div className="flex flex-col flex-1">
                  <div className="grid grid-cols-7 gap-2 text-center mb-4">
                    {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((day) => (
                      <span key={day} className="text-[10px] font-bold text-gray-400">{t(`weekday.${day}`)}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: leadingBlanks }).map((_, i) => <div key={`b${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const d = i + 1;
                      const sched = schedByDay.get(d);
                      const booked = bookedDays.has(d);
                      const isCheckout = checkoutDays.has(d);
                      // A day that has already gone by can't be scheduled. Both
                      // sides are zero-padded YYYY-MM-DD, so a string compare is
                      // the same as a date compare — and stays in the viewer's
                      // local calendar, which is what the host sees.
                      const isPastDay = dayInput(d) < today;
                      // Occupied days are still schedulable — the host may want to
                      // assign a cleaner while the guest is in the unit. We only
                      // shade the cell so it reads as occupied.
                      const cellTone = booked
                        ? 'bg-[#F4F4F5] border-transparent'
                        : isCheckout
                          ? 'bg-[#FFF7E6] border-[#FCE3B3]'
                          : 'border-gray-100';
                      return (
                        <div
                          key={d}
                          className={`relative h-[70px] rounded-xl border flex flex-col items-center pt-1.5 ${cellTone}`}
                        >
                          <span className={`text-[11px] font-medium ${isCheckout ? 'text-[#B4690E]' : 'text-gray-600'}`}>{d}</span>

                          {/* Occupancy / checkout label under the day number */}
                          {booked && !sched && (
                            <span className="mt-0.5 inline-flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-wide text-gray-400">
                              <span className={`w-1 h-1 rounded-full ${platformDot(platformByDay.get(d))}`} />
                              {t('occupied')}
                            </span>
                          )}
                          {isCheckout && !sched && (
                            <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wide text-[#D48806]">
                              {t('checkout')}
                            </span>
                          )}

                          {sched ? (
                            <button
                              onClick={() => setDetail(sched)}
                              title={t(`status.${sched.status}` as any)}
                              className="mt-1 relative"
                            >
                              <div className={`w-8 h-8 rounded-full overflow-hidden relative ring-2 ${ringFor(sched.status)}`}>
                                <AppImage src={cleanerAvatarOf(sched.cleaner, t('cleaner'))} alt="cleaner" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                              </div>
                              {(() => {
                                const badge = badgeFor(sched);
                                return badge ? (
                                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white ${badge.cls}`}>
                                    <HugeiconsIcon icon={badge.icon} className="w-2.5 h-2.5 text-white" />
                                  </span>
                                ) : null;
                              })()}
                            </button>
                          ) : (
                            <button
                              onClick={() => openCreate({ date: dayInput(d) })}
                              disabled={acceptedCleaners.length === 0 || isPastDay}
                              title={
                                isPastDay
                                  ? t('pastDateHint')
                                  : booked
                                    ? t('occupiedScheduleHint')
                                    : isCheckout
                                      ? t('checkoutHint')
                                      : t('scheduleCleaning')
                              }
                              className={`mt-1 w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
                                isCheckout
                                  ? 'bg-[#D48806] border border-[#D48806] text-white hover:bg-[#B4690E]'
                                  : booked
                                    ? 'bg-white border border-gray-300 text-gray-400 hover:border-[#10B981] hover:text-[#10B981]'
                                    : 'bg-white border border-[#10B981] text-[#10B981] hover:bg-green-50'
                              }`}
                            >
                              <HugeiconsIcon icon={Add01Icon} className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend — what the calendar colours mean */}
                  <div className="flex items-center justify-center gap-4 mt-6 flex-wrap text-[10px] font-medium text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-[#F4F4F5]" />
                      {t('occupied')}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-[#FFF7E6] border border-[#FCE3B3]" />
                      {t('checkout')}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border border-[#10B981]" />
                      {t('scheduleCleaning')}
                    </span>
                  </div>

                  <button
                    onClick={() => openCreate()}
                    disabled={acceptedCleaners.length === 0}
                    className="mt-6 w-full h-12 bg-[#007AFF] text-white text-[13px] font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                    {t('addManualCleaning')}
                  </button>
                  {acceptedCleaners.length === 0 && (
                    <p className="text-[11px] text-gray-400 text-center mt-3">{t('noAcceptedCleaner')}</p>
                  )}
                </div>
              ) : (
                /* List view — all cleanings for this accommodation */
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-bold text-gray-900">{t('allCleanings')}</span>
                    <button
                      onClick={() => openCreate()}
                      disabled={acceptedCleaners.length === 0}
                      className="h-9 px-4 rounded-xl bg-[#0084FF] text-white text-[12px] font-medium hover:bg-[#0073E6] flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <HugeiconsIcon icon={Add01Icon} className="w-3.5 h-3.5" />
                      {t('scheduleCleaning')}
                    </button>
                  </div>

                  {/* Status filter tabs */}
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    {LIST_FILTERS.map((f) => {
                      const activeTab = listFilter === f.key;
                      return (
                        <button
                          key={f.key}
                          onClick={() => setListFilter(f.key)}
                          className={`h-8 px-3.5 rounded-full text-[12px] font-medium transition-colors ${
                            activeTab
                              ? 'bg-gray-900 text-white'
                              : 'bg-[#F4F4F5] text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {t(f.labelKey as any)}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-2 scrollbar-slim">
                    {(schedLoading || schedFetching) &&
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <SkeletonCircle size={40} />
                            <div className="flex flex-col gap-2">
                              <Skeleton className="h-3 w-40 rounded" />
                              <Skeleton className="h-3 w-24 rounded" />
                            </div>
                          </div>
                          <Skeleton className="h-7 w-24 rounded-full" />
                        </div>
                      ))}

                    {!schedLoading && !schedFetching && visibleSchedules.length === 0 && (
                      <div className="py-16 text-center text-[13px] text-gray-400">
                        {listFilter === 'all' ? t('noSchedules') : t('noSchedulesForFilter')}
                      </div>
                    )}

                    {!schedLoading && !schedFetching && visibleSchedules.map((s: any) => {
                      const editable = s.status === 'scheduled';
                      const dateLabel = formatDate(s.date, {
                        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                      }, locale);
                      return (
                        <div key={s._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0 ring-1 ring-gray-100">
                              <AppImage src={cleanerAvatarOf(s.cleaner, t('cleaner'))} alt="cleaner" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[13px] font-bold text-gray-900 truncate">{cleanerNameOf(s.cleaner, t('cleaner'))}</span>
                              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                <span>{dateLabel}</span>
                                <span className="text-gray-300">·</span>
                                <span className="inline-flex items-center gap-1">
                                  <HugeiconsIcon icon={Clock01Icon} className="w-3 h-3" />
                                  {s.checkInTime}–{s.checkOutTime}
                                </span>
                                {s.booking && (
                                  <>
                                    <span className="text-gray-300">·</span>
                                    <span>{t('linkedToBooking')}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isPaid(s) && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E5F9F1] text-[#137333]">
                                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-3 h-3" />
                                {t('paid')}
                              </span>
                            )}
                            {s.paymentStatus === 'handcash_pending' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFF7E6] text-[#D48806]">
                                <HugeiconsIcon icon={Coins01Icon} className="w-3 h-3" />
                                {t('handCash')}
                              </span>
                            )}
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${SCHED_STATUS[s.status] ?? SCHED_STATUS.scheduled}`}>
                              {t(`status.${s.status}` as any)}
                            </span>
                            {/* The pay action lives in the "Pay now" (and All) tabs; the
                                Accepted tab is a read-only view of accepted cleanings. */}
                            {needsPayment(s) && listFilter !== 'accepted' && (
                              <div className="flex flex-wrap gap-2">
                                <button onClick={async () => {
                                  try {
                                    await initiateHandCash(s._id).unwrap();
                                  } catch (err) {
                                    setDeleteError(getApiErrorMessage(err));
                                  }
                                }} disabled={initiatingHandCash} className="min-h-[32px] py-1.5 px-3 rounded-lg bg-[#10B981] text-white text-[11px] font-bold hover:bg-[#059669] flex items-center justify-center gap-1 disabled:opacity-50 transition-colors">
                                  <HugeiconsIcon icon={Coins01Icon} className="w-3.5 h-3.5 shrink-0" />
                                  <span>{initiatingHandCash ? c('loading') : t('handCash')}</span>
                                </button>
                                <button onClick={() => goPay(s)} className="min-h-[32px] py-1.5 px-3 rounded-lg bg-[#0084FF] text-white text-[11px] font-bold hover:bg-[#0073E6] flex items-center justify-center gap-1 transition-colors">
                                  <HugeiconsIcon icon={Coins01Icon} className="w-3.5 h-3.5 shrink-0" />
                                  <span>{t('payNow')}</span>
                                </button>
                              </div>
                            )}
                            {/* Cleaner submitted proof (or raised a dispute): host reviews
                                and validates on the detail page. */}
                            {(s.status === 'proof_submitted' || s.status === 'disputed') && (
                              <button onClick={() => router.push(`/dashboard/tasks/${s._id}`)} className="h-8 px-3 rounded-lg bg-[#7C3AED] text-white text-[11px] font-bold hover:bg-[#6D28D9] flex items-center gap-1">
                                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-3.5 h-3.5" />
                                {t('reviewProof')}
                              </button>
                            )}
                            {editable && (
                              <button onClick={() => openEdit(s)} title={c('edit')} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700">
                                <HugeiconsIcon icon={PencilEdit01Icon} className="w-4 h-4" />
                              </button>
                            )}
                            {canDelete(s) && (
                              <button onClick={() => handleDeleteSchedule(s._id)} title={c('delete')} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500">
                                <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {monthLoading && viewType === 'calendrier' && (
                <p className="text-[11px] text-gray-400 text-center mt-2">{c('loading')}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <ScheduleModal
        state={modal}
        onClose={() => setModal({ open: false })}
        accommodationId={selectedAccId}
        cleaners={acceptedCleaners}
        accommodation={selectedAcc}
      />

      {/* Calendar cell detail popover */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-[20px] w-full max-w-[420px] sm:max-w-[440px] p-6 shadow-xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-gray-900">{t('cleaningDetails')}</h3>
              <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full overflow-hidden relative shrink-0 ring-2 ${ringFor(detail.status)}`}>
                <AppImage src={cleanerAvatarOf(detail.cleaner, t('cleaner'))} alt="cleaner" fill className="object-cover" placeholderSrc={AVATAR_PLACEHOLDER} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-bold text-gray-900 truncate">{cleanerNameOf(detail.cleaner, t('cleaner'))}</span>
                <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                  <HugeiconsIcon icon={Clock01Icon} className="w-3.5 h-3.5" />
                  {formatDate(detail.date, { weekday: 'short', day: 'numeric', month: 'short' }, locale)} · {detail.checkInTime}–{detail.checkOutTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${SCHED_STATUS[detail.status] ?? SCHED_STATUS.scheduled}`}>
                {t(`status.${detail.status}` as any)}
              </span>
              {isPaid(detail) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E5F9F1] text-[#137333]">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-3 h-3" />
                  {t('paid')}
                </span>
              )}
              {detail.paymentStatus === 'handcash_pending' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFF7E6] text-[#D48806]">
                  <HugeiconsIcon icon={Coins01Icon} className="w-3 h-3" />
                  {t('handCash')}
                </span>
              )}
            </div>

            {detail.status === 'scheduled' && (
              <p className="text-[12px] text-gray-500 mb-4">{t('awaitingPayHint')}</p>
            )}
            {needsPayment(detail) && detail.status !== 'completed' && (
              <p className="text-[12px] text-gray-500 mb-4">{t('acceptedPayHint')}</p>
            )}
            {needsPayment(detail) && detail.status === 'completed' && (
              <p className="text-[12px] text-gray-500 mb-4">{t('completedPayHint')}</p>
            )}
            {detail.status === 'refused' && (
              <div className="mb-4">
                <p className="text-[12px] text-gray-500">{t('cleanerRefusedHint')}</p>
                {detail.refusedAt && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    {t('refusedOn', {
                      date: formatDate(detail.refusedAt, {
                        day: 'numeric', month: 'short', year: 'numeric',
                      }, locale),
                    })}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-1">
              {needsPayment(detail) && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={async () => {
                    try {
                      await initiateHandCash(detail._id).unwrap();
                      setDetail(null);
                    } catch (err) {
                      setDeleteError(getApiErrorMessage(err));
                    }
                  }} disabled={initiatingHandCash} className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-[#10B981] text-white text-[12px] font-bold hover:bg-[#059669] flex items-center justify-center text-center gap-1.5 leading-snug disabled:opacity-50 transition-colors">
                    <HugeiconsIcon icon={Coins01Icon} className="w-4 h-4 shrink-0" />
                    <span>{initiatingHandCash ? c('loading') : t('handCash')}</span>
                  </button>
                  <button onClick={() => goPay(detail)} className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-[#0084FF] text-white text-[12px] font-bold hover:bg-[#0073E6] flex items-center justify-center text-center gap-1.5 leading-snug transition-colors">
                    <HugeiconsIcon icon={Coins01Icon} className="w-4 h-4 shrink-0" />
                    <span>{t('payNow')}</span>
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                {(detail.status === 'proof_submitted' || detail.status === 'disputed') && (
                  <button onClick={() => router.push(`/dashboard/tasks/${detail._id}`)} className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-[#7C3AED] text-white text-[12px] font-bold hover:bg-[#6D28D9] flex items-center justify-center gap-2 transition-colors">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-4 h-4 shrink-0" />
                    <span>{t('reviewProof')}</span>
                  </button>
                )}
                {(detail.status === 'refused' || detail.status === 'cancelled') && (
                  <button
                    onClick={() => openReschedule(detail)}
                    disabled={acceptedCleaners.length === 0}
                    title={acceptedCleaners.length === 0 ? t('noAcceptedCleaner') : undefined}
                    className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-[#0084FF] text-white text-[12px] font-bold hover:bg-[#0073E6] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <HugeiconsIcon icon={Add01Icon} className="w-4 h-4 shrink-0" />
                    <span>{t('scheduleAnotherCleaner')}</span>
                  </button>
                )}
                {detail.status === 'scheduled' && (
                  <button onClick={() => { const s = detail; setDetail(null); openEdit(s); }} className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-white border border-gray-200 text-[12px] font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                    <HugeiconsIcon icon={PencilEdit01Icon} className="w-4 h-4 shrink-0" />
                    <span>{c('edit')}</span>
                  </button>
                )}
                {canDelete(detail) && (
                  <button onClick={() => { const id = detail._id; setDetail(null); handleDeleteSchedule(id); }} title={c('delete')} className="min-h-[44px] px-4 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-colors ml-auto">
                    <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200"
          onClick={() => !deleting && setDeleteId(null)}
        >
          <div
            className="bg-white rounded-[20px] w-full max-w-95 p-6 shadow-xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#FFF0F0] flex items-center justify-center mb-4">
                <HugeiconsIcon icon={Delete02Icon} className="w-5 h-5 text-[#FF4D4F]" />
              </div>
              <h3 className="text-[16px] font-bold text-gray-900 mb-1.5">{t('deleteCleaningTitle')}</h3>
              <p className="text-[12px] text-gray-500 leading-snug mb-5">{t('deleteCleaningDesc')}</p>
            </div>

            {deleteError && <p className="text-[12px] text-red-600 text-center mb-4">{deleteError}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 h-11 rounded-xl bg-white border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                {c('cancel')}
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 h-11 rounded-xl bg-[#FF4D4F] text-white text-[13px] font-medium hover:bg-[#E64345] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting ? t('deleting') : c('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
