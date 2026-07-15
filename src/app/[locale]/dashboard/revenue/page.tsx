'use client';

import React, { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { formatDate } from '@/lib/datetime';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Clock01Icon,
  Location01Icon,
  Calendar01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Coins01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AppImage } from '@/components/ui/app-image';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetRevenueQuery,
  useGetTransactionDetailQuery,
  type RevenueTransaction,
} from '@/store/api/paymentApi';
import { resolveAssetUrl } from '@/lib/config';
import { getApiErrorMessage } from '@/lib/apiError';

const FALLBACK_ROOM =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500';

// Format an amount (already in currency units) using the payment currency.
const money = (amount: number, currency: string, locale: string) => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: (currency || 'eur').toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${(currency || '').toUpperCase()}`;
  }
};

// ─── Transaction detail modal ─────────────────────────────────────────────────
function TransactionModal({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const locale = useLocale();
  const { data, isLoading, isError, error } = useGetTransactionDetailQuery(id);

  const acc = data?.accommodation;
  const sched = data?.schedule;
  const photo = acc?.photos?.[0] ? resolveAssetUrl(acc.photos[0]) : FALLBACK_ROOM;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] w-full max-w-[440px] p-6 shadow-xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-slim"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold text-gray-900">Transaction details</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
        )}

        {isError && (
          <p className="text-[13px] text-red-500 py-8 text-center">{getApiErrorMessage(error)}</p>
        )}

        {data && !isLoading && (
          <div className="flex flex-col">
            {/* Amount received */}
            <div className="rounded-2xl bg-[#E9FBF3] p-4 mb-5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-[#0E9F6E] uppercase tracking-wide">
                  {data.status === 'released' ? 'Amount received' : 'Amount'}
                </span>
                <span className="text-[24px] font-bold text-[#0E9F6E]">
                  {money(data.yourAmount, data.currency, locale)}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#0E9F6E]">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-3 h-3" />
                {data.status}
              </span>
            </div>

            {/* Accommodation */}
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Accommodation
            </span>
            <div className="flex gap-3 mb-5">
              <div className="w-[84px] h-[84px] rounded-2xl overflow-hidden relative bg-gray-200 shrink-0">
                <AppImage src={photo} alt={acc?.name || 'Accommodation'} fill className="object-cover" />
              </div>
              <div className="flex flex-col py-1 min-w-0">
                <span className="text-[14px] font-bold text-gray-900 truncate">
                  {acc?.name || '—'}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-[12px] text-gray-500 truncate">
                    {[acc?.address, acc?.city].filter(Boolean).join(', ') || '—'}
                  </span>
                </div>
                {acc?.accommodationType && (
                  <span className="text-[11px] text-gray-400 mt-1 capitalize">
                    {acc.accommodationType}
                  </span>
                )}
              </div>
            </div>

            {/* Schedule */}
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Schedule
            </span>
            <div className="rounded-2xl border border-gray-100 p-4 mb-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-[12px] text-gray-500">
                  <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4 text-gray-400" />
                  Date
                </span>
                <span className="text-[12px] font-semibold text-gray-900">
                  {formatDate(sched?.date, {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }, locale)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-[12px] text-gray-500">
                  <HugeiconsIcon icon={Clock01Icon} className="w-4 h-4 text-gray-400" />
                  Time
                </span>
                <span className="text-[12px] font-semibold text-gray-900">
                  {sched?.checkInTime && sched?.checkOutTime
                    ? `${sched.checkInTime} – ${sched.checkOutTime}`
                    : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-gray-500">Status</span>
                <span className="text-[12px] font-semibold text-gray-900 capitalize">
                  {sched?.status?.replace('_', ' ') || '—'}
                </span>
              </div>
              {sched?.notes && (
                <div className="flex flex-col gap-1 pt-1 border-t border-gray-100">
                  <span className="text-[11px] text-gray-400">Notes</span>
                  <p className="text-[12px] text-gray-600 leading-relaxed">{sched.notes}</p>
                </div>
              )}
            </div>

            {/* Amount breakdown */}
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Payment
            </span>
            <div className="rounded-2xl border border-gray-100 p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-gray-500">Total charged</span>
                <span className="font-semibold text-gray-900">
                  {money(data.amount, data.currency, locale)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-gray-500">Platform fee</span>
                <span className="font-semibold text-gray-900">
                  −{money(data.platformFee, data.currency, locale)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px] pt-2 border-t border-gray-100">
                <span className="text-gray-700 font-medium">Cleaner payout</span>
                <span className="font-bold text-[#0E9F6E]">
                  {money(data.cleanerAmount, data.currency, locale)}
                </span>
              </div>
              {data.releasedAt && (
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <span>Released</span>
                  <span>{formatDate(data.releasedAt, {}, locale)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Revenue page ─────────────────────────────────────────────────────────────
export default function RevenuePage() {
  const locale = useLocale();
  const now = new Date();

  // Year/month filter. Month 0 = "whole year" (graph shows Jan–Dec of the year).
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [page, setPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<string | null>(null);

  const { data, isLoading, isFetching, isError, error } = useGetRevenueQuery({
    year,
    month,
    page,
    limit: 8,
  });

  const currency = data?.currency ?? 'eur';
  const graph = data?.graph ?? [];
  const maxBar = useMemo(() => Math.max(1, ...graph.map((g) => g.total)), [graph]);

  const monthName = (m: number) =>
    new Date(2000, m - 1, 1).toLocaleDateString(locale, { month: 'long' });

  const goMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setMonth(m);
    setYear(y);
    setPage(1);
  };

  const transactions = data?.transactions ?? [];
  const meta = data?.meta;

  return (
    <main className="w-full px-8 py-10 animate-in fade-in duration-500 mx-auto max-w-[1000px]">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-[32px] font-bold text-gray-900">Revenue</h1>

        {/* Year-month filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => goMonth(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-500"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
          </button>
          <span className="text-[14px] font-semibold text-gray-900 capitalize min-w-[150px] text-center">
            {monthName(month)} {year}
          </span>
          <button
            onClick={() => goMonth(1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-500"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isError && (
        <div className="py-16 text-center text-[13px] text-red-500">{getApiErrorMessage(error)}</div>
      )}

      {/* Summary card */}
      <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 p-6 mb-6">
        <span className="text-[13px] text-gray-500">Revenue this month</span>
        {isLoading ? (
          <Skeleton className="h-10 w-40 rounded mt-2" />
        ) : (
          <div className="text-[34px] font-bold text-[#0E9F6E] leading-tight mt-1">
            {money(data?.thisMonth.revenue ?? 0, currency, locale)}
          </div>
        )}
        <span className="text-[12px] text-gray-400">
          Upcoming: {money(data?.upcoming ?? 0, currency, locale)}
        </span>

        {/* Monthly graph */}
        <div className="mt-6 flex items-end justify-between gap-2 h-[160px]">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <Skeleton className="w-full rounded-lg" style={{ height: `${30 + (i % 4) * 25}px` }} />
                  <Skeleton className="h-2 w-6 rounded" />
                </div>
              ))
            : graph.map((g) => {
                const pct = Math.round((g.total / maxBar) * 100);
                const isCurrent = g.year === year && g.month === month;
                return (
                  <div
                    key={`${g.year}-${g.month}`}
                    className="flex-1 flex flex-col items-center gap-2 group"
                    title={money(g.total, currency, locale)}
                  >
                    <div className="w-full flex-1 flex items-end justify-center relative rounded-lg bg-[#F4F4F5]">
                      <div
                        className={`w-full rounded-lg transition-all ${isCurrent ? 'bg-[#0E9F6E]' : 'bg-[#48C79D]'}`}
                        style={{ height: `${Math.max(pct, g.total > 0 ? 6 : 0)}%` }}
                      />
                      <span className="absolute -top-5 text-[10px] font-semibold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {money(g.total, currency, locale)}
                      </span>
                    </div>
                    <span className={`text-[10px] font-medium ${isCurrent ? 'text-[#0E9F6E]' : 'text-gray-400'}`}>
                      {g.label}
                    </span>
                  </div>
                );
              })}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-gray-900">Recent transactions</h2>
          {meta && meta.total > 0 && (
            <span className="text-[12px] text-gray-400">{meta.total} total</span>
          )}
        </div>

        <div className="flex flex-col divide-y divide-gray-50">
          {(isLoading || isFetching) &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-32 rounded" />
                    <Skeleton className="h-2.5 w-20 rounded" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            ))}

          {!isLoading && !isFetching && transactions.length === 0 && (
            <div className="py-16 text-center text-[13px] text-gray-400">
              No transactions yet. Released payments will appear here.
            </div>
          )}

          {!isLoading && !isFetching &&
            transactions.map((tx: RevenueTransaction) => {
              const photo = tx.accommodation?.photo
                ? resolveAssetUrl(tx.accommodation.photo)
                : FALLBACK_ROOM;
              const dateLabel = formatDate(tx.date, { day: 'numeric', month: 'short' }, locale);
              return (
                <button
                  key={tx._id}
                  onClick={() => setSelectedTx(tx._id)}
                  className="flex items-center justify-between py-3.5 hover:bg-gray-50/60 -mx-2 px-2 rounded-xl transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden relative bg-gray-100 shrink-0 flex items-center justify-center">
                      {tx.accommodation ? (
                        <AppImage src={photo} alt={tx.accommodation.name} fill className="object-cover" />
                      ) : (
                        <HugeiconsIcon icon={Coins01Icon} className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-gray-900 truncate">
                        {tx.accommodation?.name || 'Cleaning'}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <span>{dateLabel}</span>
                        {tx.checkInTime && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span>{tx.checkInTime}–{tx.checkOutTime}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[14px] font-bold text-[#0E9F6E]">
                      {money(tx.amount, tx.currency, locale)}
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 text-gray-300" />
                  </div>
                </button>
              );
            })}
        </div>

        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="h-9 px-4 rounded-xl bg-white border border-gray-200 text-[12px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-[12px] text-gray-500">
              Page {meta.page} of {meta.totalPage}
            </span>
            <button
              onClick={() => setPage((p) => (meta && p < meta.totalPage ? p + 1 : p))}
              disabled={page >= meta.totalPage}
              className="h-9 px-4 rounded-xl bg-white border border-gray-200 text-[12px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedTx && <TransactionModal id={selectedTx} onClose={() => setSelectedTx(null)} />}
    </main>
  );
}
