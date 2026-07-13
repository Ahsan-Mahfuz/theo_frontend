'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Coins02Icon,
  EuroIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMyPaymentsQuery } from '@/store/api/paymentApi';

const CustomBroomIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 21H10.5V17.5C10.5 16.1193 9.38071 15 8 15H5.5C4.11929 15 3 16.1193 3 17.5V21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.75 15L17.25 4.5C18.0784 3.67157 19.4216 3.67157 20.25 4.5V4.5C21.0784 5.32843 21.0784 6.67157 20.25 7.5L9.75 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function PastCleaningTab() {
  const t = useTranslations('Settings.pastCleaning');
  const { data, isLoading } = useGetMyPaymentsQuery({ limit: 50 });
  const payments = data?.data ?? [];

  // Amounts are stored in the smallest currency unit (cents) on the backend,
  // so divide by 100 for display.
  const rows = payments.map((p) => ({
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-',
    name: p.accommodation?.name ?? '-',
    location:
      [p.accommodation?.city, p.accommodation?.zipCode].filter(Boolean).join(' ') ||
      p.accommodation?.address ||
      '-',
    amount: `${((p.amount || 0) / 100).toFixed(2)} ${p.currency?.toUpperCase?.() ?? ''}`.trim(),
    status: p.status,
  }));

  // Summary cards come straight from the backend (computed over the whole
  // dataset, not just this page), so they stay correct beyond the page limit.
  const summary = data?.summary;
  const totalCount = summary?.count ?? data?.meta?.total ?? payments.length;
  const totalAmount = summary?.totalAmount ?? 0;
  const averageAmount = summary?.averageAmount ?? 0;
  const currencyLabel =
    summary?.currency?.toUpperCase?.() ??
    payments[0]?.currency?.toUpperCase?.() ??
    'EUR';

  return (
    <div className="flex flex-col animate-in fade-in duration-300 w-full h-full">
      
      {/* Summary Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-bold text-gray-900">{t('summary')}</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        
        <div className="bg-[#FAFAFA] rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#E6F2FF] flex items-center justify-center mb-4">
            <CustomBroomIcon className="w-5 h-5 text-[#0084FF]" />
          </div>
          <span className="text-[12px] text-gray-500 mb-1">{t('cleaningPerformed')}</span>
          <span className="text-[20px] font-bold text-gray-900">{totalCount}</span>
        </div>

        <div className="bg-[#FAFAFA] rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#E6F2FF] flex items-center justify-center mb-4">
            <HugeiconsIcon icon={Coins02Icon} className="w-5 h-5 text-[#0084FF]" />
          </div>
          <span className="text-[12px] text-gray-500 mb-1">{t('totalAmount')}</span>
          <span className="text-[20px] font-bold text-gray-900">{totalAmount.toFixed(2)} {currencyLabel}</span>
        </div>

        <div className="bg-[#FAFAFA] rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#E6F2FF] flex items-center justify-center mb-4">
            <HugeiconsIcon icon={EuroIcon} className="w-5 h-5 text-[#0084FF]" />
          </div>
          <span className="text-[12px] text-gray-500 mb-1">{t('averageAmount')}</span>
          <span className="text-[20px] font-bold text-gray-900">{averageAmount.toFixed(2)} {currencyLabel}</span>
        </div>

      </div>

      {/* Service History Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-gray-900">{t('serviceHistory')}</h3>
      </div>

      {/* Table */}
      <div className="w-full">
        <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-gray-100 text-[11px] font-bold text-gray-500 mb-2">
          <div>{t('date')}</div>
          <div>{t('apartmentName')}</div>
          <div>{t('location')}</div>
          <div>{t('payAmount')}</div>
          <div>{t('status')}</div>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-4 items-center px-4 py-3 bg-white rounded-xl">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-14 rounded" />
              </div>
            ))
          ) : rows.length === 0 ? (
            <div className="px-4 py-10 text-center text-[13px] text-gray-400">{t('noPayments')}</div>
          ) : (
            rows.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-4 items-center px-4 py-3 bg-white hover:bg-[#FAFAFA] rounded-xl transition-colors text-[13px]">
              <div className="text-gray-500">{item.date}</div>
              <div className="text-gray-900">{item.name}</div>
              <div className="text-gray-500">{item.location}</div>
              <div className="text-gray-900 font-medium">{item.amount}</div>
              <div className="text-[#00B050] font-medium">{item.status}</div>
            </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
