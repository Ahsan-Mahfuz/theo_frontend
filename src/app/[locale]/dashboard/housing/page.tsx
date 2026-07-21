'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Location01Icon,
  Add01Icon,
  ArrowRight01Icon,
  BedSingle01Icon,
  Maximize01Icon,
  Layers01Icon,
  Coins01Icon,
  Home01Icon,
  UserAdd01Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslations } from 'next-intl';
import { useGetAccommodationsQuery } from '@/store/api/accommodationApi';
import type { Accommodation, AssignedCleaner } from '@/store/types';
import { resolveAssetUrl } from '@/lib/config';
import { AppImage, AVATAR_PLACEHOLDER } from '@/components/ui/app-image';
import { SkeletonCard } from '@/components/ui/skeleton';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=500';
const FALLBACK_AVATAR =
  'https://ui-avatars.com/api/?background=E5E7EB&color=6B7280&name=';

const cleanerName = (c: AssignedCleaner['cleaner'], fallback: string) =>
  c?.name || [c?.firstName, c?.lastName].filter(Boolean).join(' ') || fallback;

const avatarOf = (c: AssignedCleaner['cleaner'], fallback: string) =>
  resolveAssetUrl(c?.profileImage) ||
  `${FALLBACK_AVATAR}${encodeURIComponent(cleanerName(c, fallback))}`;

// Colour + label for an assignment status pill.
const STATUS_STYLES: Record<AssignedCleaner['status'], string> = {
  pending: 'bg-[#FFF7E6] text-[#D48806]',
  accepted: 'bg-[#E5F9F1] text-[#48C79D]',
  refused: 'bg-[#FFF0F0] text-[#FF4D4F]',
};

// A small labelled stat chip (icon + value) used inside the card body.
function Stat({
  icon,
  label,
  value,
}: {
  icon: typeof BedSingle01Icon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
        <HugeiconsIcon icon={icon} className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[9px] text-gray-400 uppercase tracking-wider leading-none mb-0.5">
          {label}
        </span>
        <span className="text-[12px] font-bold text-gray-900 truncate leading-tight">
          {value}
        </span>
      </div>
    </div>
  );
}

// A single assigned-cleaner row: avatar + name + role + status pill.
function CleanerRow({
  item,
  roleLabel,
}: {
  item: AssignedCleaner;
  roleLabel: string;
}) {
  const t = useTranslations('Housing.list');
  const fallback = t('cleanerFallback');
  const statusLabel =
    item.status === 'accepted'
      ? t('cleanerAccepted')
      : item.status === 'refused'
        ? t('cleanerRefused')
        : t('cleanerPending');

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-full overflow-hidden relative shrink-0 ring-1 ring-gray-100">
        <AppImage
          src={avatarOf(item.cleaner, fallback)}
          alt={cleanerName(item.cleaner, fallback)}
          fill
          className="object-cover"
          placeholderSrc={AVATAR_PLACEHOLDER}
        />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[11px] font-bold text-gray-900 truncate leading-tight">
          {cleanerName(item.cleaner, fallback)}
        </span>
        <span className="text-[9px] text-gray-400 uppercase tracking-wider leading-tight">
          {roleLabel}
        </span>
      </div>
      <span
        className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${STATUS_STYLES[item.status]}`}
      >
        {statusLabel}
      </span>
    </div>
  );
}

function HousingCard({ acc }: { acc: Accommodation }) {
  const t = useTranslations('Housing.list');
  const image = resolveAssetUrl(acc.photos?.[0]) || FALLBACK_IMAGE;
  const scheduled = acc.status === 'scheduled';
  const statusLabel = scheduled ? t('scheduled') : t('notScheduled');
  const location =
    [acc.address, acc.city].filter(Boolean).join(', ') || t('locationFallback');

  const cleaners = acc.assignedCleaners ?? [];
  const primaries = cleaners.filter((c) => c.role === 'primary');
  const substitutes = cleaners.filter((c) => c.role === 'substitute');
  const hasCleaners = cleaners.length > 0;

  return (
    <Link href={`/dashboard/housing/${acc._id}`} className="block h-full group">
      <div className="bg-white rounded-[20px] border border-gray-100 flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5">
        {/* Cover */}
        <div className="relative w-full h-44 overflow-hidden">
          <AppImage
            src={image}
            alt={acc.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Status badge */}
          <span
            className={`absolute top-3 left-3 inline-flex px-3 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur ${
              scheduled
                ? 'bg-[#E5F9F1]/90 text-[#48C79D]'
                : 'bg-[#FFF0F0]/90 text-[#FF4D4F]'
            }`}
          >
            {statusLabel}
          </span>
          {/* Type badge */}
          {acc.accommodationType && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-gray-700 shadow-sm backdrop-blur">
              <HugeiconsIcon icon={Home01Icon} className="w-3 h-3" />
              {acc.accommodationType}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-1">
              {acc.name}
            </h3>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="w-4 h-4 text-gray-300 shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0084FF]"
            />
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-[12px] text-gray-500 truncate">{location}</span>
          </div>

          {/* Property stats */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-50">
            <Stat icon={BedSingle01Icon} label={t('rooms')} value={String(acc.numberOfRooms ?? '—')} />
            <Stat icon={Maximize01Icon} label={t('surface')} value={acc.surface ? `${acc.surface} m²` : '—'} />
            <Stat
              icon={Layers01Icon}
              label={acc.hasElevator ? t('elevator') : t('floor')}
              value={acc.floor || (acc.hasElevator ? t('elevator') : t('noElevator'))}
            />
            <Stat
              icon={Coins01Icon}
              label={t('perCleaning')}
              value={acc.cleaningRate != null ? `€${acc.cleaningRate}` : '—'}
            />
          </div>

          {/* Assigned cleaners (request sent / accepted / refused) — or the
              assign hint when nobody has been requested yet. */}
          {hasCleaners ? (
            <div className="mt-4 pt-4 border-t border-gray-50 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {t('assignedCleaners')}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0084FF]">
                  {t('manageCleaners')}
                  <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3" />
                </span>
              </div>
              {primaries.map((item) => (
                <CleanerRow key={item.assignmentId} item={item} roleLabel={t('primary')} />
              ))}
              {substitutes.map((item) => (
                <CleanerRow key={item.assignmentId} item={item} roleLabel={t('substitutes')} />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-xl bg-[#F0F7FF] text-[#0084FF]">
              <HugeiconsIcon icon={UserAdd01Icon} className="w-4 h-4 shrink-0" />
              <span className="text-[11px] font-semibold truncate">{t('assignCleanerHint')}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HousingPage() {
  const t = useTranslations('Housing.list');
  const c = useTranslations('Common');
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetAccommodationsQuery({ page, limit: 10 });
  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / 10) : undefined;
  const items = data?.data ?? [];

  return (
    <main className="w-full px-8 py-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <h1 className="text-[32px] font-bold text-gray-900">{t('title')}</h1>
        <div className="flex items-center gap-4">
          {/* Filter — not needed for now
          <button className="h-10 px-4 rounded-xl bg-white border border-gray-100 flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <span className="text-[13px] font-medium text-gray-700">{t('filter')}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} className="w-4 h-4 text-gray-400" />
          </button>
          */}
          <Link href="/dashboard/housing/create">
            <button className="h-10 px-4 rounded-xl bg-white border border-gray-100 flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
              <span className="text-[13px] font-medium text-gray-700">{t('create')}</span>
              <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-[#0084FF] flex items-center justify-center">
                <HugeiconsIcon icon={Add01Icon} className="w-3 h-3 text-[#0084FF]" />
              </div>
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-[14px] text-red-500 mb-3">{t('loadError')}</p>
          <button onClick={() => refetch()} className="text-[13px] text-[#0084FF] hover:underline">{c('retry')}</button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[15px] font-medium text-gray-700 mb-2">{t('emptyTitle')}</p>
          <p className="text-[13px] text-gray-500 mb-6">{t('emptySubtitle')}</p>
          <Link href="/dashboard/housing/create" className="inline-flex h-10 px-5 items-center rounded-xl bg-[#0084FF] text-white text-[13px] font-medium hover:bg-blue-600 transition-colors">
            {t('createAccommodation')}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((acc) => (
              <HousingCard acc={acc} key={acc._id} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {/* Previous */}
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
              >
                ← Previous
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                // Show first, last, current, and neighbors; ellipsis for the rest
                const show =
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - page) <= 1;
                const showEllipsisBefore =
                  p === page - 2 && page - 2 > 1;
                const showEllipsisAfter =
                  p === page + 2 && page + 2 < totalPages;

                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <span
                      key={`ellipsis-${p}`}
                      className="w-9 h-9 flex items-center justify-center text-[13px] text-gray-400"
                    >
                      …
                    </span>
                  );
                }

                if (!show) return null;

                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-[13px] font-semibold transition-all ${
                      p === page
                        ? 'bg-[#0084FF] text-white shadow-md shadow-blue-200'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
              >
                Next →
              </button>
            </div>
          )}

          {/* Showing info */}
          {data?.meta && (
            <p className="text-center text-[12px] text-gray-400 mt-3">
              Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, data.meta.total)} of {data.meta.total} accommodations
            </p>
          )}
        </>
      )}
    </main>
  );
}
