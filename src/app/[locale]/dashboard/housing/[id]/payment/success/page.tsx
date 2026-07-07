'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Calendar01Icon,
  Clock01Icon,
  UserCircleIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { useGetScheduleByIdQuery } from '@/store/api/scheduleApi';
import { formatEuro } from '@/lib/pricing';
import { baseApi } from '@/store/api/baseApi';
import { useAppDispatch } from '@/store/hooks';

export default function PaymentSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  React.use(params);
  const t = useTranslations('Housing.success');
  const c = useTranslations('Common');
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get('scheduleId') || '';

  // Payment just confirmed (Stripe redirected here). The webhook has flipped the
  // schedule to paid_held server-side, so drop the cached Schedule/Calendar/Payment
  // data — otherwise Planning's calendar month keeps showing a stale "Pay now".
  React.useEffect(() => {
    dispatch(baseApi.util.invalidateTags(['Schedule', 'Calendar', 'Payment', 'HostDashboard']));
  }, [dispatch]);

  // Real cleaning + payment details for this schedule.
  const { data: schedule } = useGetScheduleByIdQuery(scheduleId, { skip: !scheduleId });
  const s = schedule as any;

  const cleaner = s?.cleaner && typeof s.cleaner === 'object' ? s.cleaner : null;
  const housekeeperName =
    (cleaner && (cleaner.name || `${cleaner.firstName ?? ''} ${cleaner.lastName ?? ''}`.trim())) || '—';

  const dateLabel = s?.date
    ? new Date(s.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : '—';
  const timeLabel = s?.checkOutTime && s?.checkInTime ? `${s.checkOutTime} → ${s.checkInTime}` : '—';

  // latestPayment.amount is the total charged, in the smallest currency unit (cents).
  const paidTotal = s?.latestPayment?.amount != null ? s.latestPayment.amount / 100 : null;

  return (
    <main className="w-full px-8 py-10 animate-in fade-in duration-500 max-w-[600px] mx-auto">
      <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 p-8 lg:p-12 flex flex-col">
        
        {/* Success Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-[48px] h-[48px] rounded-full bg-[#10B981] flex items-center justify-center mb-4 text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-[14px] font-bold text-gray-900 mb-2">{t('paymentSuccessful')}</h1>
          <p className="text-[11px] text-gray-500 max-w-[280px]">
            {t('escrowNote')}
          </p>
        </div>

        {/* Pending Acceptance */}
        <div className="flex flex-col mb-8">
          <h2 className="text-[13px] font-bold text-gray-900 mb-1">{t('pendingAcceptance')}</h2>
          <p className="text-[11px] text-gray-500">
            {t('awaitingConfirmation', { name: housekeeperName })}
          </p>
        </div>

        {/* Summary */}
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('summary')}</h2>
        
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Calendar01Icon} className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] text-gray-500">{t('date')}</span>
            </div>
            <span className="text-[11px] font-medium text-gray-900">{dateLabel}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Clock01Icon} className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] text-gray-500">{t('checkOutIn')}</span>
            </div>
            <span className="text-[11px] font-medium text-gray-900">{timeLabel}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={UserCircleIcon} className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] text-gray-500">{t('housekeeper')}</span>
            </div>
            <span className="text-[11px] font-medium text-gray-900">{housekeeperName}</span>
          </div>
        </div>

        {/* Price Details */}
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('priceDetails')}</h2>

        <div className="flex flex-col gap-3 mb-10">
          <div className="flex items-center justify-between text-[11px] pb-4 border-b border-gray-100">
            <span className="text-gray-500">{t('cleaningService')}</span>
            <span className="font-medium text-gray-900">{paidTotal != null ? formatEuro(paidTotal) : '—'}</span>
          </div>
          <div className="flex items-center justify-between text-[12px] font-bold pt-1">
            <span className="text-gray-900">{t('total')}</span>
            <span className="text-gray-900">{paidTotal != null ? formatEuro(paidTotal) : '—'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Land the host on the Planning list, "Paid" tab, where this cleaning now sits. */}
          <Link href={`/dashboard/planning?filter=paid`} className="w-full">
            <button className="w-full h-11 bg-black text-white text-[12px] font-medium rounded-xl hover:bg-gray-800 transition-colors">
              {t('viewInPlanning')}
            </button>
          </Link>
          <Link href={`/dashboard/housing`} className="w-full">
            <button className="w-full h-11 bg-white border border-gray-200 text-gray-700 text-[12px] font-medium rounded-xl hover:bg-gray-50 transition-colors">
              {c('backToHome')}
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}
